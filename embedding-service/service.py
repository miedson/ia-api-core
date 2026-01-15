from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI()
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

class Text(BaseModel):
    text: str

@app.post("/embed")
def embed(data: Text):
    vec = model.encode(data.text).tolist()
    return {"vector": vec}