from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from openai import OpenAI
from prompts import make_system_prompt
from supabase import create_client, Client


app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # which frontends are allowed
    allow_credentials=False,
    allow_methods=["*"],          # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],          # allow all headers (e.g. Content-Type)
)

class Chat(BaseModel):
    message: list[dict[str, str]]
    session_id: str

load_dotenv()
api_key = os.getenv("CHATGPT_API_KEY")

client = OpenAI(api_key=api_key)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def log_message(session_id, source, message_text):
    try:
        data = {
            "conversation_id": session_id, 
            "source": source,               
            "message": message_text
        }
        # Insert and execute
        supabase.table("chat_messages").insert(data).execute()
    except Exception as e:
        print(f"Error logging to Supabase: {e}")

def stream_response(history, session_id):
    full_response = ""
    response = client.responses.create(
        model="gpt-5.1",
        input=history,
        stream=True
    )

    for event in response:
        if event.type == "response.output_text.delta":
            text = event.delta
            full_response += text
            yield f"data: {text}\n\n"

    #log_message(session_id, "ai", full_response)


    yield "data: [DONE]\n\n"

def generate_embedding(text):
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

@app.post("/chat")
def chat(chat_data: Chat):
    last_user_message = chat_data.message[-1]['content']
    #log_message(chat_data.session_id, "user", last_user_message)
    user_embedding = generate_embedding(last_user_message)

    response = supabase.rpc("match_knowledge", {
        "query_embedding": user_embedding, 
        "match_threshold": 0.1,            
        "match_count": 3                   
    }).execute()
    context_data = response.data

    context_data = response.data
    context_text = "\n\n".join([item['content'] for item in context_data]) if context_data else "No specific context found."

    system_prompt = make_system_prompt(context_text)

    final_messages = [{"role": "system", "content": system_prompt}] + chat_data.message

    return StreamingResponse(
        stream_response(final_messages, chat_data.session_id),
        media_type="text/event-stream"
    )

