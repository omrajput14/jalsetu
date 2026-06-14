export const fetchWards = async () => {
  const res = await fetch("/api/wards");
  if (!res.ok) throw new Error("Failed to fetch wards");
  return res.json();
};

export const updateWard = async (id, updates) => {
  const res = await fetch(`/api/wards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update ward");
  return res.json();
};

export const fetchComplaints = async () => {
  const res = await fetch("/api/complaints");
  if (!res.ok) throw new Error("Failed to fetch complaints");
  return res.json();
};

export const createComplaint = async (complaint) => {
  const res = await fetch("/api/complaints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(complaint),
  });
  if (!res.ok) throw new Error("Failed to create complaint");
  return res.json();
};

export const updateComplaint = async (id, status, priority) => {
  const res = await fetch(`/api/complaints/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, priority }),
  });
  if (!res.ok) throw new Error("Failed to update complaint");
  return res.json();
};

export const fetchScheduler = async () => {
  const res = await fetch("/api/scheduler");
  if (!res.ok) throw new Error("Failed to fetch scheduler events");
  return res.json();
};

export const createSchedule = async (schedule) => {
  const res = await fetch("/api/scheduler", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  });
  if (!res.ok) throw new Error("Failed to create schedule");
  return res.json();
};

export const deleteSchedule = async (id) => {
  const res = await fetch(`/api/scheduler/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete schedule");
  return res.json();
};

export const triggerFlush = async (label) => {
  const res = await fetch(`/api/nodes/${label}/flush`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to trigger flush");
  return res.json();
};

export const fetchConfig = async () => {
  const res = await fetch("/api/config");
  if (!res.ok) throw new Error("Failed to fetch config");
  return res.json();
};

export const updateConfig = async (updates) => {
  const res = await fetch("/api/config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update config");
  return res.json();
};
