import os
from dotenv import load_dotenv
from openai import OpenAI
from supabase import create_client, Client
from knowledge_base import knowledge_base

load_dotenv()
EMBEDDING_MODEL = "text-embedding-3-small" 

openai_client = OpenAI(api_key=os.getenv("CHATGPT_API_KEY"))
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def seed_knowledge():
    print(f"Starting seed process for {len(knowledge_base)} chunks...")
    
    supabase.table("knowledge_embeddings").delete().neq("id", 0).execute()
    
    for i, chunk in enumerate(knowledge_base):
        response = openai_client.embeddings.create(
            input=chunk,
            model=EMBEDDING_MODEL
        )
        embedding = response.data[0].embedding
        data = {
            "content": chunk,
            "embedding": embedding
        }
        try:
            supabase.table("knowledge_embeddings").insert(data).execute()
            print(f"Chunk {i+1} inserted.")
        except Exception as e:
            print(f"Error inserting chunk {i+1}: {e}")

if __name__ == "__main__":
    seed_knowledge()