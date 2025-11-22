from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from openai import OpenAI
from prompts import initial_prompt
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
    """Inserts a message into the Supabase 'chat_messages' table."""
    try:
        data = {
            "conversation_id": session_id,  # Mapping session_id to conversation_id
            "source": source,               # 'user' or 'ai'
            "message": message_text
        }
        # Insert and execute
        supabase.table("chat_messages").insert(data).execute()
    except Exception as e:
        print(f"Error logging to Supabase: {e}")

def stream_response(history, session_id):
    """Generator that streams OpenAI response and logs when complete."""
    full_response = ""

    response = client.responses.create(
        model="gpt-5-nano",
        input=history,
        stream=True
    )

    for event in response:
        if event.type == "response.output_text.delta":
            text = event.delta
            full_response += text
            # Send as SSE format
            yield f"data: {text}\n\n"

    # Log complete response to Supabase
    log_message(session_id, "ai", full_response)

    # Send done signal
    yield "data: [DONE]\n\n"

@app.post("/chat")
def chat(chat_data: Chat):
    # 1. Log User Message
    last_user_message = chat_data.message[-1]['content']
    print(chat_data)
    log_message(chat_data.session_id, "user", last_user_message)

    # 2. Generate streaming AI Response
    history = [{"role": "system", "content": initial_prompt}] + chat_data.message

    return StreamingResponse(
        stream_response(history, chat_data.session_id),
        media_type="text/event-stream"
    )

