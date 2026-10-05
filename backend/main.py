import os
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

# Environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://lncweytdvhxskpbotjac.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Initialize Supabase client
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Connected successfully to Supabase!")
    except Exception as e:
        print(f"Error connecting to Supabase: {e}")

app = FastAPI(
    title="Kids Edu Game API",
    description="Backend API kết nối Hugging Face Space và Supabase cho Game Giáo Dục Trẻ Em",
    version="1.0.0"
)

# Enable CORS for Web and Mobile Apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class SyncProgressRequest(BaseModel):
    player_id: str
    name: Optional[str] = "Bé Thám Hiểm"
    stars: int
    coins: int
    level: int
    pet_data: Optional[Dict[str, Any]] = None
    stats_data: Optional[Dict[str, Any]] = None

class LogActivityRequest(BaseModel):
    player_id: str
    subject: str
    is_correct: bool = True
    score_earned: int = 1

# --- API Endpoints ---

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Chào mừng đến với Kids Edu Game API!",
        "supabase_connected": supabase is not None,
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    """Endpoint để UptimeRobot ping mỗi 5 phút giữ server thức 24/7"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/player/{player_id}")
def get_player_progress(player_id: str):
    """Lấy dữ liệu chơi game của bé từ Supabase"""
    if not supabase:
        raise HTTPException(
            status_code=503, 
            detail="Supabase chưa được cấu hình SUPABASE_KEY trong HF Space Secrets."
        )

    try:
        res = supabase.table("game_progress").select("*").eq("player_id", player_id).execute()
        if res.data and len(res.data) > 0:
            return {"success": True, "data": res.data[0]}
        else:
            # Tạo mới nếu chưa tồn tại
            supabase.table("players").upsert({"id": player_id, "name": "Bé Thám Hiểm"}).execute()
            new_prog = {
                "player_id": player_id,
                "stars": 5,
                "coins": 30,
                "level": 1,
                "pet_data": {"id": "cat", "name": "Bé Miu Miu", "hunger": 80, "happiness": 90}
            }
            supabase.table("game_progress").insert(new_prog).execute()
            return {"success": True, "data": new_prog}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/player/sync")
def sync_player_progress(payload: SyncProgressRequest):
    """Lưu và đồng bộ tiến độ chơi game của bé lên Supabase"""
    if not supabase:
        raise HTTPException(
            status_code=503, 
            detail="Supabase chưa được cấu hình SUPABASE_KEY trong HF Space Secrets."
        )

    try:
        # Cập nhật hoặc tạo player
        supabase.table("players").upsert({
            "id": payload.player_id,
            "name": payload.name
        }).execute()

        # Cập nhật game_progress
        data_to_save = {
            "player_id": payload.player_id,
            "stars": payload.stars,
            "coins": payload.coins,
            "level": payload.level,
            "updated_at": datetime.utcnow().isoformat()
        }
        if payload.pet_data:
            data_to_save["pet_data"] = payload.pet_data
        if payload.stats_data:
            data_to_save["stats_data"] = payload.stats_data

        supabase.table("game_progress").upsert(data_to_save).execute()
        return {"success": True, "message": "Đã đồng bộ tiến độ thành công!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/logs/record")
def record_learning_log(payload: LogActivityRequest):
    """Ghi nhật ký câu trả lời để phụ huynh theo dõi"""
    if not supabase:
        raise HTTPException(
            status_code=503, 
            detail="Supabase chưa được cấu hình SUPABASE_KEY."
        )

    try:
        supabase.table("learning_logs").insert({
            "player_id": payload.player_id,
            "subject": payload.subject,
            "is_correct": payload.is_correct,
            "score_earned": payload.score_earned
        }).execute()
        return {"success": True, "message": "Đã ghi nhận kết quả học tập"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
