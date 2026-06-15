const API_BASE = import.meta.env.VITE_API_URL || "";

const getHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem("jalsetu_token");
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchWards = async () => {
  const res = await fetch(`${API_BASE}/api/wards`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch wards");
  return res.json();
};

export const updateWard = async (id, updates) => {
  const res = await fetch(`${API_BASE}/api/wards/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update ward");
  return res.json();
};

export const fetchComplaints = async () => {
  const res = await fetch(`${API_BASE}/api/complaints`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch complaints");
  return res.json();
};

export const createComplaint = async (complaint) => {
  const res = await fetch(`${API_BASE}/api/complaints`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(complaint),
  });
  if (!res.ok) throw new Error("Failed to create complaint");
  return res.json();
};

export const updateComplaint = async (id, status, priority) => {
  const res = await fetch(`${API_BASE}/api/complaints/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ status, priority }),
  });
  if (!res.ok) throw new Error("Failed to update complaint");
  return res.json();
};

export const fetchScheduler = async () => {
  const res = await fetch(`${API_BASE}/api/scheduler`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch scheduler events");
  return res.json();
};

export const createSchedule = async (schedule) => {
  const res = await fetch(`${API_BASE}/api/scheduler`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(schedule),
  });
  if (!res.ok) throw new Error("Failed to create schedule");
  return res.json();
};

export const deleteSchedule = async (id) => {
  const res = await fetch(`${API_BASE}/api/scheduler/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete schedule");
  return res.json();
};

export const triggerFlush = async (label) => {
  const res = await fetch(`${API_BASE}/api/nodes/${label}/flush`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to trigger flush");
  return res.json();
};

export const fetchConfig = async () => {
  const res = await fetch(`${API_BASE}/api/config`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch config");
  return res.json();
};

export const updateConfig = async (updates) => {
  const res = await fetch(`${API_BASE}/api/config`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update config");
  return res.json();
};

export const fetchPaymentKey = async () => {
  const res = await fetch(`${API_BASE}/api/payments/key`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch payment key");
  return res.json();
};

export const createPaymentOrder = async (amount, receipt) => {
  const res = await fetch(`${API_BASE}/api/payments/create-order`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ amount, receipt }),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
};

export const verifyPayment = async (payload) => {
  const res = await fetch(`${API_BASE}/api/payments/verify`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to verify payment");
  return res.json();
};
