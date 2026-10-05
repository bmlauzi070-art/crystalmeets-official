import os
import json
import requests
from datetime import datetime, timezone
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pymongo import MongoClient
from apscheduler.schedulers.background import BackgroundScheduler

app = FastAPI(title="Crystal Meets API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://mongo:27017/crystalmeets")
JWT_SECRET = os.environ.get("JWT_SECRET", "crystal_meets_ireland_2026_secret_key")
SANITY_PROJECT_ID = os.environ.get("SANITY_PROJECT_ID", "r5e8x9gi")
SANITY_DATASET = os.environ.get("SANITY_DATASET", "production")
ALGORITHM = "HS256"

SANITY_QUERY_URL = f"https://{SANITY_PROJECT_ID}.apicdn.sanity.io/v2026-03-01/data/query/{SANITY_DATASET}"

client = MongoClient(MONGO_URI)
db = client.get_default_database()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def current_user(token: str = Depends(oauth2_scheme)):
    user_data = None 
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid session token credentials")
        user_data = {"email": email, "role": payload.get("role", "user")}
    except JWTError:
        raise HTTPException(status_code=401, detail="Session expired or altered token signature")
    return user_data

def check_reminders():
    print(f"[{datetime.now(timezone.utc)}] Running background check for upcoming Irish car meets...")

scheduler = BackgroundScheduler()
scheduler.add_job(check_reminders, 'interval', minutes=15)
scheduler.start()

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected", "sanity_id": SANITY_PROJECT_ID}

@app.get("/api/meets")
def get_meets():
    try:
        groq_query = """*[_type == "meet" || _type == "drafts.meet"] {
            "meet_id": _id,
            name,
            description,
            date,
            location_name,
            address,
            lat,
            lon,
            category,
            fuel_type,
            price,
            "image": image.asset->url
        }"""
        response = requests.get(SANITY_QUERY_URL, params={"query": groq_query}, timeout=3.0)
        if response.status_code == 200:
            sanity_results = response.json().get("result", [])
            if sanity_results:
                return sanity_results
    except Exception as e:
        print(f"Sanity unavailable: {e}")
    return list(db.meets.find({}, {"_id": 0}))
