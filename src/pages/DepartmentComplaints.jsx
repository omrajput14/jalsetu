import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchComplaints, updateComplaint, fetchWards } from "../services/api";

const DepartmentComplaints = () => {
  const [ticketList, setTicketList] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [wardsList, setWardsList] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [complaintsData, wardsData] = await Promise.all([
          fetchComplaints(),
          fetchWards(),
        ]);
        setTicketList(complaintsData);
        setWardsList(wardsData);
        if (complaintsData.length > 0) {
          setSelectedTicket(complaintsData[0]);
        }
      } catch (err) {
        console.error("Failed to load complaints page data:", err);
      }
    };
    loadData();
  }, []);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleUpdateTicket = async (status, priority) => {
    try {
      const updated = await updateComplaint(selectedTicket.id, status, priority);
      setTicketList((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? updated : t))
      );
      setSelectedTicket(updated);
      addToast(`Ticket #${selectedTicket.id} updated successfully.`, "success");
    } catch (err) {
      console.error(err);
      addToast(`Failed to update ticket #${selectedTicket.id}.`, "error");
    }
  };

  const getWardName = (wardId) => {
    const w = wardsList.find((ward) => ward.id === wardId);
    return w ? w.name.replace("Ward ", "W") : `Ward ${wardId}`;
  };

  const filteredTickets = ticketList.filter(
    (t) => filterStatus === "All" || t.status === filterStatus
  );

  const openCount = ticketList.filter((t) => t.status !== "Resolved").length;
  const resolvedCount = ticketList.filter((t) => t.status === "Resolved").length;

  return (
    <div className="max-w-[1440px] space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Municipal Grievances</p>
          <h1 className="font-heading text-4xl font-bold text-on-surface">Complaint Tickets Board</h1>
        </div>
        <div className="glass-card px-6 py-4 rounded-xl flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">support_agent</span>
          <span className="font-heading text-sm font-medium tracking-tight">Active Tickets: {openCount}</span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Total Tickets</p>
          <p className="font-heading text-3xl font-bold text-primary">{ticketList.length}</p>
          <p className="text-xs text-on-surface-variant mt-2">Received in last 7 days</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Open / Pending</p>
          <p className="font-heading text-3xl font-bold text-error">{openCount}</p>
          <p className="text-xs text-on-surface-variant mt-2">Assigned to field engineers</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Resolved Tickets</p>
          <p className="font-heading text-3xl font-bold text-tertiary">{resolvedCount}</p>
          <p className="text-xs text-on-surface-variant mt-2">Resolution efficiency: 85%</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Avg Resolution Time</p>
          <p className="font-heading text-3xl font-bold text-secondary">3.4 hrs</p>
          <p className="text-xs text-on-surface-variant mt-2">Target resolution: &lt; 4.0 hrs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List (Left) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-xl font-medium text-on-surface">Registered Tickets</h3>
            <div className="flex bg-surface-container-high rounded-full p-1 text-xs">
              {["All", "Pending", "In Progress", "Resolved"].map((status) => (
                <span
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-full cursor-pointer transition-colors font-semibold ${
                    filterStatus === status ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {status}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedTicket.id === ticket.id
                    ? "bg-primary-container/10 border-primary"
                    : "bg-surface-container-low border-outline-variant/10 hover:border-primary/20"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">#{ticket.id}</span>
                    <span className="text-sm font-semibold">{ticket.category}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-on-surface-variant mt-1">
                    <span>{ticket.citizen}</span>
                    <span>•</span>
                    <span>{getWardName(ticket.wardId)}</span>
                    <span>•</span>
                    <span>{ticket.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    ticket.priority === "high" ? "bg-error-container/20 text-error" : ticket.priority === "medium" ? "bg-secondary-container/20 text-secondary" : "bg-surface-container-highest text-on-surface-variant"
                  }`}>
                    {ticket.priority}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                    ticket.status === "Resolved" ? "bg-tertiary/10 text-tertiary" : ticket.status === "In Progress" ? "bg-primary/10 text-primary animate-pulse" : "bg-outline-variant/30 text-on-surface-variant"
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispatch Controls (Right) */}
        {selectedTicket && (
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 flex flex-col justify-between h-[500px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs text-on-surface-variant">Ticket Action & Dispatch</div>
                  <h4 className="font-heading text-xl font-bold text-on-surface mt-0.5">#{selectedTicket.id} - {selectedTicket.category}</h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                  selectedTicket.status === "Resolved" ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary animate-pulse"
                }`}>
                  {selectedTicket.status}
                </span>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 space-y-3 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-0.5">Filer Details</span>
                  <p className="text-sm text-on-surface">{selectedTicket.citizen} ({getWardName(selectedTicket.wardId)})</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-0.5">Registration Time</span>
                  <p className="text-xs text-on-surface-variant">{selectedTicket.date}</p>
                </div>
              </div>

              {/* Status and Priority Form Controls */}
              <div className="space-y-4" key={selectedTicket.id}>
                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">Update Status</label>
                  <select
                    id="ticket-status-override"
                    defaultValue={selectedTicket.status}
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-lg p-3 text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">Modify Priority</label>
                  <select
                    id="ticket-priority-override"
                    defaultValue={selectedTicket.priority}
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-lg p-3 text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const status = document.getElementById("ticket-status-override").value;
                const priority = document.getElementById("ticket-priority-override").value;
                handleUpdateTicket(status, priority);
              }}
              className="w-full py-3.5 bg-primary text-on-primary font-bold text-sm rounded-lg hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer mt-6"
            >
              Update Ticket & Dispatch Crew
            </button>
          </div>
        )}
      </div>
      {/* Toast Notifications */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className="pointer-events-auto min-w-[300px] glass-card px-4 py-3 rounded-xl border border-outline-variant/20 shadow-2xl flex items-center gap-3 bg-surface/80 backdrop-blur-xl"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                toast.type === "error" ? "bg-error-container/20 text-error" : 
                toast.type === "warning" ? "bg-warning/20 text-warning" : 
                "bg-tertiary-container/20 text-tertiary"
              }`}>
                <span className="material-symbols-outlined text-lg">
                  {toast.type === "error" ? "error" : toast.type === "warning" ? "warning" : "check_circle"}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-on-surface-variant font-semibold">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer flex items-center justify-center p-0.5"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DepartmentComplaints;
