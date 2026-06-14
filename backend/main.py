import os
import json
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

app = FastAPI(title="JalSetu API", description="Smart Water Distribution Management Platform API")

# Enable CORS for local cross-origin development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "db.json")

def load_db() -> dict:
    if not os.path.exists(DB_PATH):
        raise HTTPException(status_code=500, detail="Database file not found.")
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(data: dict):
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

# --- Models ---
class WardUpdate(BaseModel):
    currentLevel: Optional[int] = None
    pumpStatus: Optional[str] = None
    currentVolume: Optional[str] = None

class ComplaintCreate(BaseModel):
    category: str
    urgency: str
    description: str
    address: str
    wardId: int
    citizen: str

class ComplaintUpdate(BaseModel):
    status: str
    priority: str

class ScheduleCreate(BaseModel):
    ward: str
    start: str
    end: str
    day: str

class ConfigUpdate(BaseModel):
    pressureLimit: Optional[float] = None
    reservoirLimit: Optional[int] = None
    smsAlerts: Optional[bool] = None
    leakSiren: Optional[bool] = None
    autoShutoff: Optional[bool] = None
    whatsappAlerts: Optional[bool] = None
    emailReports: Optional[bool] = None
    ecoMode: Optional[bool] = None
    threshold: Optional[int] = None


# --- Endpoints ---

@app.get("/api/wards")
def get_wards():
    db = load_db()
    return db.get("wards", [])

@app.put("/api/wards/{ward_id}")
def update_ward(ward_id: int, updates: WardUpdate):
    db = load_db()
    wards = db.get("wards", [])
    for w in wards:
        if w["id"] == ward_id:
            if updates.currentLevel is not None:
                w["currentLevel"] = updates.currentLevel
            if updates.pumpStatus is not None:
                w["pumpStatus"] = updates.pumpStatus
            if updates.currentVolume is not None:
                w["currentVolume"] = updates.currentVolume
            save_db(db)
            return w
    raise HTTPException(status_code=404, detail="Ward not found")

@app.get("/api/complaints")
def get_complaints():
    db = load_db()
    return db.get("complaints", [])

@app.post("/api/complaints")
def create_complaint(complaint: ComplaintCreate):
    db = load_db()
    complaints = db.get("complaints", [])
    
    new_id = max([c["id"] for c in complaints]) + 1 if complaints else 1000
    new_ticket = {
        "id": new_id,
        "wardId": complaint.wardId,
        "citizen": complaint.citizen,
        "category": complaint.category,
        "description": complaint.description,
        "address": complaint.address,
        "date": "Just now",
        "urgency": complaint.urgency,
        "priority": complaint.urgency.lower(),
        "status": "Pending",
        "updates": [
            { "time": "Just now", "message": "Complaint received. Municipal operator review in progress." }
        ]
    }
    
    complaints.insert(0, new_ticket)
    db["complaints"] = complaints
    save_db(db)
    return new_ticket

@app.put("/api/complaints/{complaint_id}")
def update_complaint(complaint_id: int, updates: ComplaintUpdate):
    db = load_db()
    complaints = db.get("complaints", [])
    for c in complaints:
        if c["id"] == complaint_id:
            c["status"] = updates.status
            c["priority"] = updates.priority
            c["updates"].append({
                "time": "Just now",
                "message": f"Ticket details updated. Status: {updates.status}, Priority: {updates.priority}."
            })
            save_db(db)
            return c
    raise HTTPException(status_code=404, detail="Complaint not found")

@app.get("/api/scheduler")
def get_scheduler():
    db = load_db()
    return {
        "events": db.get("schedulerEvents", []),
        "assignments": db.get("assignments", [])
    }

@app.post("/api/scheduler")
def create_schedule(schedule: ScheduleCreate):
    db = load_db()
    events = db.get("schedulerEvents", [])
    assignments = db.get("assignments", [])
    
    # Calculate timeline coordinate parameters (equivalent to frontend timeToPx)
    def time_to_px(time_str: str) -> int:
        try:
            h, m = map(int, time_str.split(":"))
            total_hours = h + m / 60.0
            relative_hours = max(0.0, total_hours - 6.0)
            return int(round(relative_hours * 26.6))
        except:
            return 80
            
    top = time_to_px(schedule.start)
    end_top = time_to_px(schedule.end)
    height = max(40, end_top - top)
    
    new_event = {
        "id": int(os.urandom(4).hex(), 16),
        "day": schedule.day,
        "label": schedule.ward.split(" - ")[0],
        "time": f"{schedule.start} - {schedule.end}",
        "status": "upcoming",
        "top": top,
        "height": height,
        "colorClass": "border-primary text-primary bg-primary-container/20 hover:bg-primary-container/30"
    }
    
    new_assignment = {
        "id": int(os.urandom(4).hex(), 16) + 1,
        "name": schedule.ward,
        "time": f"Scheduled for {schedule.day}, {schedule.start}",
        "icon": "location_on"
    }
    
    events.append(new_event)
    assignments.insert(0, new_assignment)
    
    db["schedulerEvents"] = events
    db["assignments"] = assignments
    save_db(db)
    
    return { "event": new_event, "assignment": new_assignment }

@app.delete("/api/scheduler/{event_id}")
def delete_schedule(event_id: int):
    db = load_db()
    events = db.get("schedulerEvents", [])
    filtered_events = [e for e in events if e["id"] != event_id]
    
    if len(events) == len(filtered_events):
        raise HTTPException(status_code=404, detail="Schedule event not found")
        
    db["schedulerEvents"] = filtered_events
    save_db(db)
    return { "success": True, "detail": "Schedule cancelled successfully" }

@app.post("/api/nodes/{node_label}/flush")
def trigger_flush(node_label: str):
    # Simulated action, returns success status
    return {
        "success": True,
        "message": f"Valve flush diagnostics on {node_label} completed successfully. Local pressures balanced."
    }

@app.get("/api/config")
def get_config():
    db = load_db()
    return db.get("municipalConfig", {})

@app.put("/api/config")
def update_config(updates: ConfigUpdate):
    db = load_db()
    config = db.get("municipalConfig", {})
    
    update_dict = updates.model_dump(exclude_unset=True)
    for k, v in update_dict.items():
        config[k] = v
        
    db["municipalConfig"] = config
    save_db(db)
    return config
