from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json
from openai import OpenAI
from prompts import make_system_prompt
from supabase import create_client, Client

load_dotenv()

MAX_MESSAGE_LENGTH = 250
MAX_CONTEXT_HISTORY = 10
MODEL_NAME = "gpt-5-nano"
EMBEDDING_MODEL = "text-embedding-3-small"
REJECTION_TEXT = "Please only ask information relevant to Barney's tutoring services, such as course details or pricing. Or email Barney for more infomration:"
WELCOME_MESSAGE = "Hello! I'm AI-Barney. I can answer questions about the course syllabus, pricing, or my teaching style. Try asking: 'Do you teach A-Level?'"

try:
    openai_client = OpenAI(api_key=os.getenv("CHATGPT_API_KEY"))
    supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
except Exception:
    pass

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Chat(BaseModel):
    message: list[dict[str, str]]
    session_id: str

class FeedbackPayload(BaseModel):
    session_id: str
    message: str
    feedback: int

def log_message(session_id, source, message_text):
    try:
        supabase.table("chat_messages").insert({
            "conversation_id": session_id, 
            "source": source,               
            "message": message_text
        }).execute()
    except Exception:
        pass

def validate_input(messages: list[dict[str, str]]) -> str:
    last_content = messages[-1].get("content", "").strip()
    for msg in messages:
        if msg.get("role") == "user":
            if len(msg.get("content", "").strip()) > MAX_MESSAGE_LENGTH:
                raise HTTPException(status_code=400, detail=f"Message too long. Max {MAX_MESSAGE_LENGTH} chars.")
    return last_content

def get_user_status(history: list[dict[str, str]]) -> bool:
    ai_messages = [m['content'] for m in history if m['role'] == 'assistant']
    if not ai_messages:
        return False
    last_ai = ai_messages[-1]
    if REJECTION_TEXT in last_ai or last_ai == WELCOME_MESSAGE:
        return False
    return True

def retrieve_context(query: str) -> list:
    emb = openai_client.embeddings.create(input=query, model=EMBEDDING_MODEL).data[0].embedding
    res = supabase.rpc("match_knowledge", {
        "query_embedding": emb, 
        "match_threshold": 0.01,  
        "match_count": 5          
    }).execute()
    return res.data or []

def check_gatekeeper(is_trusted: bool, context_data: list) -> bool:
    if is_trusted:
        return False
    if not context_data:
        return True
    return context_data[0].get('similarity', 0) < 0.25

def build_prompt(context_data: list, history: list[dict[str, str]]) -> list:
    context_text = "\n\n".join([item['content'] for item in context_data])
    system_prompt = make_system_prompt(context_text)
    return [{"role": "system", "content": system_prompt}] + history[-MAX_CONTEXT_HISTORY:]

def stream_rejection(session_id: str):
    yield f"data: {json.dumps({'content': REJECTION_TEXT})}\n\n"
    email_block = "\n\n```\nebarneytutoring@gmail.com\n```"
    yield f"data: {json.dumps({'content': email_block})}\n\n"
    yield "data: [DONE]\n\n"
    log_message(session_id, "ai", REJECTION_TEXT)

def stream_generator(messages: list, session_id: str):
    full_resp = ""
    stream = openai_client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        stream=True
    )
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            full_resp += content
            yield f"data: {json.dumps({'content': content})}\n\n"
    
    log_message(session_id, "ai", full_resp)
    yield "data: [DONE]\n\n"

@app.post("/chat")
def chat(payload: Chat):
    query = validate_input(payload.message)
    log_message(payload.session_id, "user", query)
    
    is_trusted = get_user_status(payload.message)
    context = retrieve_context(query)
    
    if check_gatekeeper(is_trusted, context):
        return StreamingResponse(stream_rejection(payload.session_id), media_type="text/event-stream")
    
    messages = build_prompt(context, payload.message)
    return StreamingResponse(stream_generator(messages, payload.session_id), media_type="text/event-stream")
