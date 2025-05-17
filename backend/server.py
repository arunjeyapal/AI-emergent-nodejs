from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
from datetime import datetime
import pymongo
from pymongo import MongoClient

# Get environment variables
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")

# MongoDB client
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Category(BaseModel):
    id: str
    name: str
    color: str

class Event(BaseModel):
    id: str
    title: str
    start: str
    end: str
    categoryId: str
    description: Optional[str] = None

# Mock data for categories
MOCK_CATEGORIES = [
    {"id": "work", "name": "Work", "color": "#4F46E5"},
    {"id": "personal", "name": "Personal", "color": "#10B981"},
    {"id": "family", "name": "Family", "color": "#F59E0B"},
    {"id": "academy", "name": "Academy", "color": "#EF4444"},
    {"id": "events", "name": "Events", "color": "#8B5CF6"},
]

# API Routes
@app.get("/api/")
async def read_root():
    return {"message": "Calendar API is running"}

@app.get("/api/config/categories", response_model=List[Category])
async def get_categories():
    # Return mock categories
    return MOCK_CATEGORIES

@app.on_event("startup")
async def startup_db_client():
    # Initialize database when app starts
    try:
        # Check if collection exists and initialize if not
        if "categories" not in db.list_collection_names():
            db.categories.insert_many(MOCK_CATEGORIES)
    except Exception as e:
        print(f"Database initialization error: {e}")
    
    print("Connected to MongoDB")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
