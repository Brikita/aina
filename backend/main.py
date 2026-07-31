from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import router as decision_router
from dotenv import load_dotenv
import os

load_dotenv()


app = FastAPI()

# Allow your React app to communicate with the FastAPI server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(decision_router)

@app.get("/api/health")
def health_check():
    return {"status": "AINA Backend is running", "plan": "Lean & Mean"}