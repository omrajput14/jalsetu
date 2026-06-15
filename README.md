# JalSetu (जलसेतु) — Smart Water Distribution & Monitoring Platform

JalSetu is a smart municipal water utility monitoring and grievance management system. It connects citizens with local municipal authorities to streamline billing, report pipeline leakages/shortages, view supply timetables, and monitor water storage metrics in real time.

---

## 🚀 Key Features

### 👤 Citizen Portal
- **Live Ward Storage Tanks**: Real-time visual monitoring of local water tank levels with dynamic animation.
- **Consumption Analytics**: Responsive charts showing weekly and monthly usage trends (liters and cost).
- **Water Bill Quick Pay**: Full integrated billing cycles with one-click payment checkout using **Razorpay** in test mode.
- **Grievance Redressal**: File support tickets for pipeline leakages, low pressure, or supply issues. Track ticket updates and receive email updates automatically.
- **Supply Timetable**: Live countdown for the next scheduled water release window.

### 🏢 Municipal Control Center (Admin Portal)
- **Geographic Network Map**: Interactive, responsive network map of all ward pressure nodes powered by **Leaflet.js** (100% free tiles).
- **Valve Diagnostics (Flush)**: Run diagnostics and trigger remote valve flushes directly on custom node markers.
- **Automated Scheduler**: Complete calendar interface to plan weekly supply release slots for different sectors.
- **Performance Analytics**: Track municipal supply efficiency, pressure variance limits, and grievance resolution times.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Framer Motion, Leaflet.js, Recharts, Material Symbols.
- **Backend**: Python, FastAPI, Supabase Python Client.
- **Database**: Supabase (PostgreSQL).
- **Integrations**:
  - **Razorpay**: Test Mode payment gateway integration.
  - **Resend**: Transactional emails for complaints and alerts.
  - **MSG91**: Operational SMS alert notifications.
  - **PostHog**: Product analytics, screen session replays, and custom action funnels.

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- A Supabase project

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=onboarding@resend.dev
   MSG91_AUTH_KEY=your_msg91_auth_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
4. Start the FastAPI server:
   ```bash
   python3 -m uvicorn main:app --reload --host 127.0.0.1 --port 5001
   ```

### 2. Frontend Setup
1. Navigate to the root directory and install npm packages:
   ```bash
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

## 📡 Analytical Tracking (PostHog Events)
The application has custom events hooked up to PostHog to track the following:
- `payment_initiated` (When a citizen opens the bill pay popup)
- `payment_successful` (When payment signature verification succeeds)
- `complaint_filed` (When a citizen submits a ticket)
- `valve_flushed` (When an admin flushes a node valve)
