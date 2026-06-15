// ===== Ward Data =====
export const wards = [
  {
    id: 1, name: "Ward 1 — Lakshmi Nagar", sector: "North Sector",
    currentLevel: 78, tankCapacity: 500000, pumpStatus: "Active",
    lastRefill: "Today, 06:30 AM", nextSupply: "06:00 PM",
    currentVolume: "390K L", estimatedOutflow: "32k L/hr",
    supplySchedule: [
      { time: "05:30 AM", duration: "2 hrs", status: "completed" },
      { time: "11:30 AM", duration: "1.5 hrs", status: "active" },
      { time: "05:30 PM", duration: "2 hrs", status: "upcoming" },
    ],
  },
  {
    id: 2, name: "Ward 2 — Gandhi Colony", sector: "North Sector",
    currentLevel: 45, tankCapacity: 400000, pumpStatus: "Active",
    lastRefill: "Today, 05:45 AM", nextSupply: "05:30 PM",
    currentVolume: "180K L", estimatedOutflow: "28k L/hr",
    supplySchedule: [
      { time: "05:30 AM", duration: "2 hrs", status: "completed" },
      { time: "11:30 AM", duration: "1.5 hrs", status: "active" },
      { time: "05:30 PM", duration: "2 hrs", status: "upcoming" },
    ],
  },
  {
    id: 3, name: "Ward 3 — Shivaji Peth", sector: "East Sector",
    currentLevel: 92, tankCapacity: 600000, pumpStatus: "Active",
    lastRefill: "Today, 07:00 AM", nextSupply: "01:00 PM",
    currentVolume: "552K L", estimatedOutflow: "45k L/hr",
    supplySchedule: [
      { time: "06:00 AM", duration: "2 hrs", status: "completed" },
      { time: "01:00 PM", duration: "1.5 hrs", status: "upcoming" },
      { time: "06:00 PM", duration: "2 hrs", status: "upcoming" },
    ],
  },
  {
    id: 4, name: "Ward 4 — Subhash Road", sector: "West Sector",
    currentLevel: 15, tankCapacity: 350000, pumpStatus: "Inactive",
    lastRefill: "Yesterday, 06:00 PM", nextSupply: "12:00 PM",
    currentVolume: "52K L", estimatedOutflow: "18k L/hr",
    supplySchedule: [
      { time: "12:00 PM", duration: "3 hrs", status: "upcoming" },
    ],
  },
  {
    id: 5, name: "Ward 5 — Nehru Garden", sector: "South Sector",
    currentLevel: 30, tankCapacity: 450000, pumpStatus: "Active",
    lastRefill: "Today, 04:00 AM", nextSupply: "—",
    currentVolume: "135K L", estimatedOutflow: "22k L/hr",
    supplySchedule: [
      { time: "04:00 AM", duration: "2 hrs", status: "completed" },
      { time: "02:00 PM", duration: "2 hrs", status: "upcoming" },
    ],
  },
  {
    id: 6, name: "Ward 6 — Ambedkar Nagar", sector: "South Sector",
    currentLevel: 60, tankCapacity: 300000, pumpStatus: "Active",
    lastRefill: "Today, 06:00 AM", nextSupply: "12:30 PM",
    currentVolume: "180K L", estimatedOutflow: "25k L/hr",
    supplySchedule: [
      { time: "06:00 AM", duration: "2 hrs", status: "completed" },
      { time: "12:30 PM", duration: "1.5 hrs", status: "upcoming" },
      { time: "06:30 PM", duration: "2 hrs", status: "upcoming" },
    ],
  },
];

// ===== Citizen Data =====
export const citizenData = {
  name: "Rajesh Kumar",
  wardId: 2,
  ward: wards[1],
  myComplaints: [
    { id: 1041, category: "Low Pressure", description: "Water pressure extremely low on 3rd floor. Unable to fill storage tank.", date: "Today, 07:30 AM", status: "In Progress" },
  ],
};

// ===== Notifications =====
export const notifications = [
  { id: 1, type: "warning", title: "Planned Maintenance", message: "Section B-12 will experience low pressure tomorrow from 2 PM to 5 PM due to sensor calibration.", time: "2 hours ago", read: false },
  { id: 2, type: "success", title: "Quality Report Ready", message: "The weekly water purity report for Ward 12 North is now available. Standards: Excellent.", time: "5 hours ago", read: false },
  { id: 3, type: "info", title: "Usage Milestone", message: "Your household consumption is 12% lower than the ward average this month. Great job!", time: "Yesterday", read: true },
];

// ===== Complaints =====
export const complaints = [
  { id: 1042, wardId: 4, citizen: "Rajesh Sharma", category: "Pipe Leakage", date: "Today, 08:15 AM", priority: "high", status: "Pending" },
  { id: 1041, wardId: 2, citizen: "Priya Patel", category: "Low Pressure", date: "Today, 07:30 AM", priority: "medium", status: "In Progress" },
  { id: 1040, wardId: 5, citizen: "Amit Kumar", category: "No Supply", date: "Yesterday, 09:00 PM", priority: "high", status: "In Progress" },
  { id: 1039, wardId: 1, citizen: "Sunita Devi", category: "Contamination", date: "Yesterday, 06:45 PM", priority: "high", status: "In Progress" },
  { id: 1038, wardId: 3, citizen: "Vikram Singh", category: "Contamination", date: "2 days ago", priority: "medium", status: "Resolved" },
  { id: 1037, wardId: 6, citizen: "Meena Joshi", category: "Meter Issue", date: "3 days ago", priority: "low", status: "Resolved" },
  { id: 1036, wardId: 1, citizen: "Karan Mehta", category: "Pipe Leakage", date: "4 days ago", priority: "medium", status: "Resolved" },
  { id: 1035, wardId: 4, citizen: "Deepak Rao", category: "No Supply", date: "5 days ago", priority: "low", status: "Resolved" },
];

// ===== Admin Stats =====
export const adminStats = {
  currentOutput: "1.2M",
  currentOutputUnit: "L/hr",
  currentOutputDelta: "+4.2% from peak",
  avgPressure: "4.2",
  avgPressureUnit: "Bar",
  avgPressureStatus: "Optimal range",
  systemHealth: "98%",
  systemHealthSensors: "124 sensors active",
  supplyEfficiency: 92,
  pressureVariance: 1.2,
  openComplaints: 24,
  resolvedComplaints: 142,
};

// ===== Sensor Map Nodes =====
export const sensorNodes = [
  { id: 1, lat: 19.0760, lng: 72.8777, status: "stable", label: "Node A-1" },
  { id: 2, lat: 19.0800, lng: 72.8800, status: "active", label: "Node B-3" },
  { id: 3, lat: 19.0700, lng: 72.8700, status: "critical", label: "Node C-2" },
  { id: 4, lat: 19.0850, lng: 72.8600, status: "stable", label: "Node D-1" },
  { id: 5, lat: 19.0600, lng: 72.8900, status: "active", label: "Node E-4" },
];

// ===== Supply Schedule Calendar Events =====
export const schedulerEvents = [
  { id: 1, day: "Tue", ward: "Ward 12", time: "07:30 - 10:30", status: "completed" },
  { id: 2, day: "Wed", ward: "Main Trunk", time: "08:00 - 12:00", status: "active" },
  { id: 3, day: "Fri", ward: "Maintenance", time: "15:00 - 17:30", status: "maintenance" },
];

// ===== Pressure Insight =====
export const pressureInsight = {
  current: 4.2,
  unit: "bar",
  prediction: "Predicted surge at 14:20 PM today during Ward 12 activation.",
  recommendation: "Open relief valve #04 (Sector B) 5 minutes prior to main release.",
};

// ===== Chart Data =====
export const supplyTrends = [
  { day: "Mon", consumed: 2100000, supplied: 2400000, wastage: 120000 },
  { day: "Tue", consumed: 1950000, supplied: 2300000, wastage: 95000 },
  { day: "Wed", consumed: 2200000, supplied: 2500000, wastage: 85000 },
  { day: "Thu", consumed: 2350000, supplied: 2700000, wastage: 150000 },
  { day: "Fri", consumed: 2100000, supplied: 2550000, wastage: 170000 },
  { day: "Sat", consumed: 2000000, supplied: 2450000, wastage: 100000 },
  { day: "Sun", consumed: 1800000, supplied: 2200000, wastage: 90000 },
];
