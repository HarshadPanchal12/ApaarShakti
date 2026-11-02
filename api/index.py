import sys
import os

# Ensure api directory is in Python path for Vercel Serverless
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from main import app as core_app

# Wrapper for Vercel Serverless
app = FastAPI(title="APAAR-Verify API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "ok", "service": "apaar-verify-api", "runtime": "vercel-serverless"}

# Mount the core application at both /api and root
app.mount("/api", core_app)
app.mount("/", core_app)

