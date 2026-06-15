import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_KEY in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(
    title="JalSetu API",
    description="Smart Water Distribution Management Platform — powered by Supabase"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Pydantic Models ────────────────────────────────────────────

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


# ─── Helper: camelCase → snake_case map for config ──────────────

CONFIG_KEY_MAP = {
    "pressureLimit":  "pressure_limit",
    "reservoirLimit": "reservoir_limit",
    "smsAlerts":      "sms_alerts",
    "leakSiren":      "leak_siren",
    "autoShutoff":    "auto_shutoff",
    "whatsappAlerts": "whatsapp_alerts",
    "emailReports":   "email_reports",
    "ecoMode":        "eco_mode",
    "threshold":      "threshold",
}

def snake_to_camel_config(row: dict) -> dict:
    """Convert DB snake_case config row → camelCase for frontend."""
    reverse = {v: k for k, v in CONFIG_KEY_MAP.items()}
    return {reverse.get(k, k): v for k, v in row.items() if k != "id"}

def ward_to_camel(row: dict) -> dict:
    """Convert DB snake_case ward row → camelCase for frontend."""
    return {
        "id":               row["id"],
        "name":             row["name"],
        "sector":           row["sector"],
        "currentLevel":     row["current_level"],
        "tankCapacity":     row["tank_capacity"],
        "pumpStatus":       row["pump_status"],
        "lastRefill":       row["last_refill"],
        "nextSupply":       row["next_supply"],
        "currentVolume":    row["current_volume"],
        "estimatedOutflow": row["estimated_outflow"],
        "supplySchedule":   row["supply_schedule"] or [],
    }

def event_to_camel(row: dict) -> dict:
    return {
        "id":         row["id"],
        "day":        row["day"],
        "label":      row["label"],
        "time":       row["time"],
        "status":     row["status"],
        "top":        row["top"],
        "height":     row["height"],
        "colorClass": row["color_class"],
    }


# ─── Wards ──────────────────────────────────────────────────────

@app.get("/api/wards")
def get_wards():
    res = supabase.table("wards").select("*").order("id").execute()
    return [ward_to_camel(w) for w in res.data]

@app.put("/api/wards/{ward_id}")
def update_ward(ward_id: int, updates: WardUpdate):
    patch = {}
    if updates.currentLevel is not None:
        patch["current_level"] = updates.currentLevel
    if updates.pumpStatus is not None:
        patch["pump_status"] = updates.pumpStatus
    if updates.currentVolume is not None:
        patch["current_volume"] = updates.currentVolume

    if not patch:
        raise HTTPException(status_code=400, detail="No fields to update")

    res = supabase.table("wards").update(patch).eq("id", ward_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Ward not found")
    return ward_to_camel(res.data[0])


# ─── Complaints ─────────────────────────────────────────────────

@app.get("/api/complaints")
def get_complaints():
    res = supabase.table("complaints").select("*").order("id", desc=True).execute()
    # Rename snake → camel for frontend
    out = []
    for c in res.data:
        out.append({
            "id":          c["id"],
            "wardId":      c["ward_id"],
            "citizen":     c["citizen"],
            "category":    c["category"],
            "description": c["description"],
            "address":     c["address"],
            "date":        c["date"],
            "urgency":     c["urgency"],
            "priority":    c["priority"],
            "status":      c["status"],
            "updates":     c["updates"] or [],
        })
    return out

@app.post("/api/complaints")
def create_complaint(complaint: ComplaintCreate):
    new_ticket = {
        "ward_id":     complaint.wardId,
        "citizen":     complaint.citizen,
        "category":    complaint.category,
        "description": complaint.description,
        "address":     complaint.address,
        "date":        "Just now",
        "urgency":     complaint.urgency,
        "priority":    complaint.urgency.lower(),
        "status":      "Pending",
        "updates":     [{"time": "Just now", "message": "Complaint received. Municipal operator review in progress."}],
    }
    res = supabase.table("complaints").insert(new_ticket).execute()
    c = res.data[0]
    return {
        "id": c["id"], "wardId": c["ward_id"], "citizen": c["citizen"],
        "category": c["category"], "description": c["description"],
        "address": c["address"], "date": c["date"], "urgency": c["urgency"],
        "priority": c["priority"], "status": c["status"], "updates": c["updates"],
    }

@app.put("/api/complaints/{complaint_id}")
def update_complaint(complaint_id: int, updates: ComplaintUpdate):
    # Fetch current updates array
    res = supabase.table("complaints").select("updates").eq("id", complaint_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Complaint not found")

    existing_updates = res.data[0]["updates"] or []
    existing_updates.append({
        "time": "Just now",
        "message": f"Status updated to {updates.status}, Priority: {updates.priority}."
    })

    patch = {
        "status":   updates.status,
        "priority": updates.priority,
        "updates":  existing_updates,
    }
    res2 = supabase.table("complaints").update(patch).eq("id", complaint_id).execute()
    c = res2.data[0]
    return {
        "id": c["id"], "wardId": c["ward_id"], "citizen": c["citizen"],
        "category": c["category"], "description": c["description"],
        "address": c["address"], "date": c["date"], "urgency": c["urgency"],
        "priority": c["priority"], "status": c["status"], "updates": c["updates"],
    }


# ─── Scheduler ──────────────────────────────────────────────────

@app.get("/api/scheduler")
def get_scheduler():
    events_res  = supabase.table("scheduler_events").select("*").execute()
    assigns_res = supabase.table("assignments").select("*").execute()
    return {
        "events":      [event_to_camel(e) for e in events_res.data],
        "assignments": assigns_res.data,
    }

@app.post("/api/scheduler")
def create_schedule(schedule: ScheduleCreate):
    def time_to_px(t: str) -> int:
        try:
            h, m = map(int, t.split(":"))
            return int(round((h + m / 60.0 - 6.0) * 26.6))
        except:
            return 80

    top    = time_to_px(schedule.start)
    height = max(40, time_to_px(schedule.end) - top)
    event_id     = int(os.urandom(4).hex(), 16)
    assignment_id = event_id + 1

    new_event = {
        "id":          event_id,
        "day":         schedule.day,
        "label":       schedule.ward.split(" - ")[0],
        "time":        f"{schedule.start} - {schedule.end}",
        "status":      "upcoming",
        "top":         top,
        "height":      height,
        "color_class": "border-primary text-primary bg-primary-container/20 hover:bg-primary-container/30",
    }
    new_assignment = {
        "id":   assignment_id,
        "name": schedule.ward,
        "time": f"Scheduled for {schedule.day}, {schedule.start}",
        "icon": "location_on",
    }

    e_res = supabase.table("scheduler_events").insert(new_event).execute()
    a_res = supabase.table("assignments").insert(new_assignment).execute()

    return {
        "event":      event_to_camel(e_res.data[0]),
        "assignment": a_res.data[0],
    }

@app.delete("/api/scheduler/{event_id}")
def delete_schedule(event_id: int):
    res = supabase.table("scheduler_events").delete().eq("id", event_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Schedule event not found")
    return {"success": True, "detail": "Schedule cancelled successfully"}


# ─── Node Flush (simulated) ──────────────────────────────────────

@app.post("/api/nodes/{node_label}/flush")
def trigger_flush(node_label: str):
    return {
        "success": True,
        "message": f"Valve flush on {node_label} completed. Local pressures balanced."
    }


# ─── Municipal Config ────────────────────────────────────────────

@app.get("/api/config")
def get_config():
    res = supabase.table("municipal_config").select("*").eq("id", 1).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Config not found")
    return snake_to_camel_config(res.data[0])

@app.put("/api/config")
def update_config(updates: ConfigUpdate):
    patch = {}
    update_dict = updates.model_dump(exclude_unset=True)
    for k, v in update_dict.items():
        db_key = CONFIG_KEY_MAP.get(k, k)
        patch[db_key] = v

    if not patch:
        raise HTTPException(status_code=400, detail="No fields to update")

    res = supabase.table("municipal_config").update(patch).eq("id", 1).execute()
    return snake_to_camel_config(res.data[0])
