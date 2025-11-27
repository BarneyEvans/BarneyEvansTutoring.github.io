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

app = FastAPI()

MAX_MESSAGE_LENGTH = 250

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

# The phrase used to detect if a user is still "On Probation"
REJECTION_TEXT = "Please only ask information relevant to Barney's tutoring services, such as course details or pricing."
WELCOME_MESSAGE = "Hello! I'm AI-Barney. I can answer questions about the course syllabus, pricing, or my teaching style. Try asking: 'Do you teach A-Level?'"

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

def stream_rejection(session_id):
    """
    DEFAULT OUTPUT TO AVOID RUNNING THE MODEL
    This function mimics the OpenAI stream format but returns static text ($0 cost).
    """
    # 1. Text rejection
    payload = json.dumps({"content": REJECTION_TEXT})
    yield f"data: {payload}\n\n"
    
    # 2. Email block
    email_block = "\n\n```\nebarneytutoring@gmail.com\n```"
    payload_email = json.dumps({"content": email_block})
    yield f"data: {payload_email}\n\n"
    
    yield "data: [DONE]\n\n"

    # Log the rejection so you know a user was blocked
    # log_message(session_id, "ai", REJECTION_TEXT)

def stream_response(history, session_id):
    full_response = ""
    # Using your specific model syntax as requested
    response = client.responses.create(
        model="gpt-5-nano",
        input=history,
        stream=True
    )

    for event in response:
        if event.type == "response.output_text.delta":
            text = event.delta
            full_response += text
            
            # Wrap text in JSON to preserve newlines in SSE
            payload = json.dumps({"content": text})
            yield f"data: {payload}\n\n"

    # Log the full successful AI response
    # log_message(session_id, "ai", full_response)

    yield "data: [DONE]\n\n"

def generate_embedding(text):
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

@app.post("/chat")
def chat(chat_data: Chat):
    last_user_message = chat_data.message[-1]['content'].strip()

    for msg in chat_data.message:
        if msg.get("role") == "user":
            content = msg.get("content", "").strip()
            if len(content) > MAX_MESSAGE_LENGTH:
                raise HTTPException(
                    status_code=400,
                    detail=f"Message too long. Please keep messages under {MAX_MESSAGE_LENGTH} characters.",
                )
    
    # --- DEBUG: Print User Question ---
    print(f"\n📢 USER ASKED: '{last_user_message}'") 
    
    # Log the User's Message
    # log_message(chat_data.session_id, "user", last_user_message)
    
    # ---------------------------------------------------------
    # 1. ESTABLISH TRUST (The Boolean Flag)
    # ---------------------------------------------------------
    ai_messages = [m['content'] for m in chat_data.message if m['role'] == 'assistant']
    
    if not ai_messages:
        # No history = New User = Probation
        is_trusted_user = False 
    elif REJECTION_TEXT in ai_messages[-1]: 
        # Last answer was a rejection = Still on Probation
        is_trusted_user = False 
    elif ai_messages[-1] == WELCOME_MESSAGE:
        # Last answer was just the welcome message = Still on Probation
        is_trusted_user = False
    else:
        # Last answer was real content = Trusted
        is_trusted_user = True 

    # ---------------------------------------------------------
    # 2. SEARCH BROADLY (VIP + Guests)
    # ---------------------------------------------------------
    user_embedding = generate_embedding(last_user_message)
    
    # Fetch 5 chunks even if they are weak (0.01) so the LLM has guests
    response = supabase.rpc("match_knowledge", {
        "query_embedding": user_embedding, 
        "match_threshold": 0.01,  
        "match_count": 5          
    }).execute()
    context_data = response.data

    # --- DEBUG: Print Scores ---
    if context_data:
        print(f"🔍 Found {len(context_data)} matches:")
        for i, item in enumerate(context_data):
            score = item.get('similarity', 0)
            preview = item.get('content', '')[:60].replace('\n', ' ')
            print(f"   [{i+1}] Score: {score:.4f} | Content: {preview}...")
    else:
        print("❌ No matches found (even with low threshold).")
    print("-" * 50)
    # ---------------------------

    # ---------------------------------------------------------
    # 3. GATEKEEPER (Soft Gate: 0.25)
    # ---------------------------------------------------------
    # We only block if the user is NOT trusted yet.
    if not is_trusted_user:
        
        # Check relevance: Look at the TOP match score
        has_relevant_match = False
        if context_data and len(context_data) > 0:
            top_score = context_data[0].get('similarity', 0)
            if top_score >= 0.25: # Soft Gate Threshold
                has_relevant_match = True
        
        # If no relevant documents found -> BLOCK
        if not has_relevant_match:
            print(f"🛑 BLOCKED BY GATEKEEPER")
            return StreamingResponse(
                stream_rejection(chat_data.session_id),
                media_type="text/event-stream"
            )

    # ---------------------------------------------------------
    # 4. PROCEED
    # ---------------------------------------------------------
    # Pass ALL 5 chunks (VIP + Guests) to the system prompt
    context_text = "\n\n".join([item['content'] for item in context_data]) if context_data else ""
    system_prompt = make_system_prompt(context_text)

    final_messages = [{"role": "system", "content": system_prompt}] + chat_data.message

    return StreamingResponse(
        stream_response(final_messages, chat_data.session_id),
        media_type="text/event-stream"
    )
