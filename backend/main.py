import os
import requests
import resend
import razorpay
import jwt
import bcrypt
import json
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "onboarding@resend.dev")
MSG91_AUTH_KEY = os.getenv("MSG91_AUTH_KEY")
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_KEY in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
resend.api_key = RESEND_API_KEY

razorpay_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# ─── Email Helpers ───────────────────────────────────────────────

def send_email(to: str, subject: str, html: str):
    try:
        resend.Emails.send({"from": f"JalSetu <{FROM_EMAIL}>", "to": [to], "subject": subject, "html": html})
    except Exception as e:
        print(f"[Email] Failed: {e}")

def complaint_filed_html(c: dict) -> str:
    return f"""<div style='font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f1418;color:#dee3e9;padding:32px;border-radius:16px'><div style='text-align:center;margin-bottom:24px'><h1 style='color:#89ceff;font-size:28px;margin:0'>JalSetu</h1><p style='color:#bec8d2;font-size:13px;margin:4px 0'>Smart Water Distribution Platform</p></div><div style='background:#1b2024;border-radius:12px;padding:24px;border:1px solid #3e4850'><h2 style='color:#6bd8cb;margin:0 0 16px'>✅ Complaint Registered</h2><p style='color:#bec8d2'>Your complaint has been received and is under review.</p><table style='width:100%;border-collapse:collapse;margin-top:16px'><tr><td style='padding:8px;color:#89ceff;font-weight:600;width:140px'>Ticket ID</td><td style='padding:8px;color:#dee3e9'>#{c['id']}</td></tr><tr style='background:#252b2f'><td style='padding:8px;color:#89ceff;font-weight:600'>Category</td><td style='padding:8px;color:#dee3e9'>{c['category']}</td></tr><tr><td style='padding:8px;color:#89ceff;font-weight:600'>Address</td><td style='padding:8px;color:#dee3e9'>{c['address']}</td></tr><tr style='background:#252b2f'><td style='padding:8px;color:#89ceff;font-weight:600'>Urgency</td><td style='padding:8px;color:#dee3e9'>{c['urgency']}</td></tr><tr><td style='padding:8px;color:#89ceff;font-weight:600'>Status</td><td style='padding:8px;color:#6bd8cb;font-weight:700'>Pending Review</td></tr></table></div><p style='color:#bec8d2;font-size:12px;text-align:center;margin-top:24px'>© 2024 JalSetu Technologies · Securing every drop</p></div>"""

def complaint_updated_html(c: dict) -> str:
    sc = {"Resolved":"#6bd8cb","In Progress":"#89ceff","Pending":"#eab308"}.get(c['status'],"#bec8d2")
    last_msg = c['updates'][-1]['message'] if c.get('updates') else 'No update message.'
    return f"""<div style='font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f1418;color:#dee3e9;padding:32px;border-radius:16px'><div style='text-align:center;margin-bottom:24px'><h1 style='color:#89ceff;font-size:28px;margin:0'>JalSetu</h1></div><div style='background:#1b2024;border-radius:12px;padding:24px;border:1px solid #3e4850'><h2 style='color:#89ceff;margin:0 0 16px'>🔔 Complaint Update — #{c['id']}</h2><p style='color:#bec8d2'>Your complaint status has been updated by the municipal team.</p><div style='margin-top:16px;padding:16px;background:#252b2f;border-radius:8px;border-left:4px solid {sc}'><p style='margin:0;font-size:18px;font-weight:700;color:{sc}'>Status: {c['status']}</p><p style='margin:4px 0 0;color:#bec8d2;font-size:13px'>Priority: {c['priority'].capitalize()}</p></div><p style='color:#bec8d2;margin-top:16px;font-size:13px'>Latest update: {last_msg}</p></div><p style='color:#bec8d2;font-size:12px;text-align:center;margin-top:24px'>© 2024 JalSetu Technologies · Securing every drop</p></div>"""

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

class ComplaintCreateWithEmail(ComplaintCreate):
    email: Optional[str] = None

@app.post("/api/complaints")
def create_complaint(complaint: ComplaintCreateWithEmail):
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
    out = {"id": c["id"], "wardId": c["ward_id"], "citizen": c["citizen"], "category": c["category"], "description": c["description"], "address": c["address"], "date": c["date"], "urgency": c["urgency"], "priority": c["priority"], "status": c["status"], "updates": c["updates"]}
    if complaint.email:
        send_email(to=complaint.email, subject=f"JalSetu — Complaint #{c['id']} Received", html=complaint_filed_html(out))
    return out

class ComplaintUpdateWithEmail(ComplaintUpdate):
    email: Optional[str] = None

@app.put("/api/complaints/{complaint_id}")
def update_complaint(complaint_id: int, updates: ComplaintUpdateWithEmail):
    res = supabase.table("complaints").select("*").eq("id", complaint_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Complaint not found")
    existing_updates = res.data[0]["updates"] or []
    existing_updates.append({"time": "Just now", "message": f"Status updated to {updates.status}, Priority: {updates.priority}."})
    patch = {"status": updates.status, "priority": updates.priority, "updates": existing_updates}
    res2 = supabase.table("complaints").update(patch).eq("id", complaint_id).execute()
    c = res2.data[0]
    out = {
        "id": c["id"], "wardId": c["ward_id"], "citizen": c["citizen"], 
        "category": c["category"], "description": c["description"],
        "address": c["address"], "date": c["date"], "urgency": c["urgency"],
        "priority": c["priority"], "status": c["status"], "updates": c["updates"],
    }
    if updates.email:
        send_email(to=updates.email, subject=f"JalSetu — Complaint #{c['id']} Updated", html=complaint_updated_html(out))
    return out


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


# ─── Email Endpoints ────────────────────────────────────────────

class PurityReportRequest(BaseModel):
    to: str
    ward_name: str
    ph_level: float = 7.2
    turbidity: str = "0.4 NTU"
    chlorine: str = "0.8 mg/L"
    result: str = "Excellent"

@app.post("/api/email/purity-report")
def send_purity_report(req: PurityReportRequest):
    sc = {"Excellent":"#6bd8cb","Good":"#89ceff","Fair":"#eab308","Poor":"#ff5252"}.get(req.result,"#bec8d2")
    html = f"""<div style='font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f1418;color:#dee3e9;padding:32px;border-radius:16px'><div style='text-align:center;margin-bottom:24px'><h1 style='color:#89ceff;font-size:28px;margin:0'>JalSetu</h1><p style='color:#bec8d2;font-size:13px'>Weekly Water Quality Report</p></div><div style='background:#1b2024;border-radius:12px;padding:24px;border:1px solid #3e4850'><h2 style='color:#89ceff;margin:0 0 8px'>💧 Purity Report — {req.ward_name}</h2><table style='width:100%;border-collapse:collapse;margin-top:16px'><tr><td style='padding:10px;color:#89ceff;font-weight:600'>pH Level</td><td style='padding:10px;color:#dee3e9'>{req.ph_level}</td><td style='padding:10px;color:#6bd8cb'>✓ Normal</td></tr><tr style='background:#252b2f'><td style='padding:10px;color:#89ceff;font-weight:600'>Turbidity</td><td style='padding:10px;color:#dee3e9'>{req.turbidity}</td><td style='padding:10px;color:#6bd8cb'>✓ Clear</td></tr><tr><td style='padding:10px;color:#89ceff;font-weight:600'>Chlorine</td><td style='padding:10px;color:#dee3e9'>{req.chlorine}</td><td style='padding:10px;color:#6bd8cb'>✓ Safe</td></tr></table><div style='margin-top:20px;padding:16px;background:#252b2f;border-radius:8px;border-left:4px solid {sc};text-align:center'><p style='margin:0;font-size:20px;font-weight:700;color:{sc}'>Overall: {req.result}</p></div></div><p style='color:#bec8d2;font-size:12px;text-align:center;margin-top:24px'>© 2024 JalSetu Technologies · Securing every drop</p></div>"""
    send_email(to=req.to, subject=f"JalSetu — Weekly Water Quality Report · {req.ward_name}", html=html)
    return {"success": True, "message": f"Purity report sent to {req.to}"}

@app.post("/api/email/supply-alert")
def send_supply_alert(to: str, ward_name: str, start_time: str):
    html = f"""<div style='font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f1418;color:#dee3e9;padding:32px;border-radius:16px'><div style='text-align:center;margin-bottom:24px'><h1 style='color:#89ceff;font-size:28px;margin:0'>JalSetu</h1></div><div style='background:#1b2024;border-radius:12px;padding:24px;border:1px solid #3e4850;text-align:center'><div style='font-size:48px;margin-bottom:16px'>💧</div><h2 style='color:#89ceff;margin:0 0 8px'>Water Supply Alert</h2><p style='color:#bec8d2'>Supply for <strong style='color:#dee3e9'>{ward_name}</strong> starts at</p><p style='font-size:36px;font-weight:800;color:#6bd8cb;margin:8px 0'>{start_time}</p><p style='color:#bec8d2;font-size:13px'>Please ensure your storage tanks are ready.</p></div><p style='color:#bec8d2;font-size:12px;text-align:center;margin-top:24px'>© 2024 JalSetu Technologies · Securing every drop</p></div>"""
    send_email(to=to, subject=f"JalSetu — Water Supply Alert · {ward_name} at {start_time}", html=html)
    return {"success": True, "message": f"Supply alert sent to {to}"}


# ─── SMS Endpoints (MSG91) ──────────────────────────────────────

class SMSRequest(BaseModel):
    to: str
    message: str

@app.post("/api/notify/sms")
def send_sms_alert(req: SMSRequest):
    if not MSG91_AUTH_KEY:
        raise HTTPException(status_code=500, detail="MSG91 API Key not configured")

    payload = {
        "sender": "JALSTU",
        "route": "4",
        "country": "91",
        "sms": [
            {
                "message": req.message,
                "to": [req.to]
            }
        ]
    }
    headers = {
        "authkey": MSG91_AUTH_KEY,
        "content-type": "application/json"
    }

    try:
        response = requests.post("https://api.msg91.com/api/v2/sendsms", json=payload, headers=headers)
        data = response.json()
        return {
            "success": True, 
            "message": f"SMS queued for {req.to}",
            "msg91_response": data
        }
    except Exception as e:
        print(f"[SMS Error] {e}")
        return {"success": False, "message": str(e)}


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


# ─── Payments (Razorpay) ─────────────────────────────────────────

@app.get("/api/payments/key")
def get_payment_key():
    if not RAZORPAY_KEY_ID:
        raise HTTPException(status_code=500, detail="Razorpay key not configured")
    return {"key": RAZORPAY_KEY_ID}

class OrderCreate(BaseModel):
    amount: int  # Amount in INR
    receipt: str

@app.post("/api/payments/create-order")
def create_payment_order(order: OrderCreate):
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Razorpay keys not configured")
    
    try:
        data = {
            "amount": order.amount * 100,  # Razorpay expects paise
            "currency": "INR",
            "receipt": order.receipt
        }
        rp_order = razorpay_client.order.create(data=data)
        return {"success": True, "order": rp_order}
    except Exception as e:
        print(f"[Razorpay Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/payments/verify")
async def verify_payment(req: Request):
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Razorpay keys not configured")
    
    body = await req.json()
    try:
        # Check signature
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': body.get('razorpay_order_id'),
            'razorpay_payment_id': body.get('razorpay_payment_id'),
            'razorpay_signature': body.get('razorpay_signature')
        })
        return {"success": True, "message": "Payment verified successfully"}
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Authentication ──────────────────────────────────────────────

JWT_SECRET = os.getenv("JWT_SECRET", "jalsetu-super-secret-key-1234567890")
JWT_ALGORITHM = "HS256"
USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def load_local_users():
    if not os.path.exists(USERS_FILE):
        default_users = [
            {
                "email": "citizen@jalsetu.in",
                "password_hash": "$2b$12$wePRow.RY1wW3wf.SstECeMPZEjflYMZKtAIlE4LLfurrGXfXPUOi",
                "role": "citizen",
                "name": "Rajesh Kumar",
                "phone": "9988776655",
                "ward_id": 2
            },
            {
                "email": "operator@jalsetu.in",
                "password_hash": "$2b$12$wePRow.RY1wW3wf.SstECeMPZEjflYMZKtAIlE4LLfurrGXfXPUOi",
                "role": "operator",
                "name": "Municipal Admin",
                "phone": "9876543210",
                "ward_id": 1
            }
        ]
        with open(USERS_FILE, "w") as f:
            json.dump(default_users, f, indent=2)
        return default_users
    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"[Auth] Local JSON read failed: {e}")
        return []

def save_local_users(users_list):
    try:
        with open(USERS_FILE, "w") as f:
            json.dump(users_list, f, indent=2)
    except Exception as e:
        print(f"[Auth] Local JSON write failed: {e}")

def get_user_by_email(email: str):
    try:
        res = supabase.table("users").select("*").eq("email", email).execute()
        if res.data:
            return res.data[0]
    except Exception as e:
        print(f"[Auth] Supabase users table query failed, falling back: {e}")
    
    users = load_local_users()
    for u in users:
        if u["email"] == email:
            return u
    return None

def create_user_record(email: str, password_hash: str, role: str, name: str, phone: str, ward_id: int):
    new_user = {
        "email": email,
        "password_hash": password_hash,
        "role": role,
        "name": name,
        "phone": phone,
        "ward_id": ward_id
    }
    try:
        res = supabase.table("users").insert(new_user).execute()
        if res.data:
            return res.data[0]
    except Exception as e:
        print(f"[Auth] Supabase users table insert failed, falling back: {e}")
    
    users = load_local_users()
    new_user["id"] = str(os.urandom(16).hex())
    users.append(new_user)
    save_local_users(users)
    return new_user

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception as e:
        print(f"[Auth] Password verification failed: {e}")
        return False

def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

class UserSignup(BaseModel):
    email: str
    password: str
    name: str
    phone: str
    ward_id: int
    role: Optional[str] = "citizen"

class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/api/auth/signup")
def signup(user: UserSignup):
    existing = get_user_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user.password)
    new_user = create_user_record(
        email=user.email,
        password_hash=hashed,
        role=user.role,
        name=user.name,
        phone=user.phone,
        ward_id=user.ward_id
    )
    
    token = create_access_token({"email": new_user["email"], "role": new_user["role"]})
    return {
        "success": True,
        "token": token,
        "user": {
            "email": new_user["email"],
            "role": new_user["role"],
            "name": new_user["name"],
            "phone": new_user["phone"],
            "ward_id": new_user["ward_id"]
        }
    }

@app.post("/api/auth/login")
def login(credentials: UserLogin):
    user = get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"email": user["email"], "role": user["role"]})
    return {
        "success": True,
        "token": token,
        "user": {
            "email": user["email"],
            "role": user["role"],
            "name": user["name"],
            "phone": user.get("phone", ""),
            "ward_id": user.get("ward_id", None)
        }
    }

@app.get("/api/auth/me")
def get_me(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = auth_header.split(" ")[1]
    payload = verify_access_token(token)
    
    user = get_user_by_email(payload["email"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    return {
        "success": True,
        "user": {
            "email": user["email"],
            "role": user["role"],
            "name": user["name"],
            "phone": user.get("phone", ""),
            "ward_id": user.get("ward_id", None)
        }
    }
