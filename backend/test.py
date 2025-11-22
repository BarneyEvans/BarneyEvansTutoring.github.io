from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from openai import OpenAI
from prompts import initial_prompt


app = FastAPI()

# 👇 origins that are allowed to talk to this backend
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

load_dotenv()
api_key = os.getenv("CHATGPT_API_KEY")

client = OpenAI(api_key=api_key)

def model_response(text):
    response = client.responses.create(
        model="gpt-5-nano",
        input=text
    )
    return response.output_text

@app.post("/chat")
def chat(chat: Chat):
    history = [{"role": "system", "content": initial_prompt}] + chat.message
    chat = model_response(history)
    print(history)
    return {
        "reply": chat,
    }
