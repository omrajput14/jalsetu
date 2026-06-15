import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchComplaints, createComplaint } from "../services/api";
import posthog from "posthog-js";

const CitizenComplaints = () => {
  const [complaintsList, setComplaintsList] = useState([]);
  const [formData, setFormData] = useState({ category: "Pipe Leakage", urgency: "Medium", description: "", address: "" });
  const [activeTicket, setActiveTicket] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await fetchComplaints();
        setComplaintsList(data);
        if (data.length > 0) {
          setActiveTicket(data[0]);
        }
      } catch (err) {
        console.error("Failed to load complaints:", err);
      }
    };
    loadComplaints();
  }, []);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.address) {
      addToast("Please fill in all details", "error");
      return;
    }
    try {
      const newTicket = await createComplaint({
        category: formData.category,
        urgency: formData.urgency,
        description: formData.description,
        address: formData.address,
        wardId: 2,
        citizen: "Rajesh Kumar",
      });
      setComplaintsList([newTicket, ...complaintsList]);
      setActiveTicket(newTicket);
      
      posthog.capture('complaint_filed', {
        category: formData.category,
        urgency: formData.urgency,
        ticket_id: newTicket.id
      });

      addToast("Your complaint has been successfully filed!", "success");
      setFormData({ category: "Pipe Leakage", urgency: "Medium", description: "", address: "" });
    } catch (err) {
      console.error(err);
      addToast("Failed to file complaint", "error");
    }
  };

  return (
    <div className="max-w-[1440px] space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Support & Grievances</p>
          <h1 className="font-heading text-4xl font-bold text-on-surface">Report Issue & Track Status</h1>
        </div>
        <div className="glass-card px-6 py-4 rounded-xl flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">support_agent</span>
          <span className="font-heading text-sm font-medium tracking-tight">Active Tickets: {complaintsList.filter(c => c.status !== "Resolved").length}</span>
        </div>
      </header>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Submit Complaint Form */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-medium text-on-surface">File a Grievance</h3>
            <p className="text-sm text-on-surface-variant">Report a pipeline leak, contaminated water, low flow pressure, or meter reading errors to Ward 12 staff.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">Issue Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/20 rounded-lg p-3 text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option>Pipe Leakage</option>
                  <option>Low Pressure</option>
                  <option>Contaminated Supply</option>
                  <option>No Supply Alert</option>
                  <option>Meter Reading Issue</option>
                  <option>Billing Query</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">Urgency Level</label>
                <select 
                  value={formData.urgency} 
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/20 rounded-lg p-3 text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">Service Address / Location Detail</label>
              <input 
                type="text"
                placeholder="House No, Street name, Landmark..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant/20 rounded-lg p-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-on-surface-variant uppercase font-bold px-1">Detailed Description</label>
              <textarea 
                rows={4}
                placeholder="Please provide details of the issue so Ward technicians can dispatch quickly..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant/20 rounded-lg p-3 text-sm focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            <button type="submit" className="w-full py-3 bg-primary text-on-primary font-bold text-sm rounded-lg hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer">
              Submit Complaint
            </button>
          </form>
        </div>

        {/* Right: Complaints List and Detail */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* List Card */}
          <div className="glass-card rounded-2xl p-6 h-[250px] overflow-y-auto no-scrollbar">
            <h3 className="font-heading text-xl font-medium text-on-surface mb-4">Grievance History</h3>
            <div className="space-y-3">
              {complaintsList.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setActiveTicket(item)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    activeTicket?.id === item.id 
                      ? "bg-primary-container/10 border-primary" 
                      : "bg-surface-container-low border-outline-variant/10 hover:border-primary/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">#{item.id}</span>
                      <span className="text-sm font-semibold">{item.category}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      item.urgency === "High" ? "bg-error-container/20 text-error" : item.urgency === "Medium" ? "bg-secondary-container/20 text-secondary" : "bg-surface-container-highest text-on-surface-variant"
                    }`}>
                      {item.urgency}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      item.status === "Resolved" ? "bg-tertiary/10 text-tertiary" : item.status === "In Progress" ? "bg-primary/10 text-primary animate-pulse" : "bg-outline-variant/30 text-on-surface-variant"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Detail Panel */}
          {activeTicket && (
            <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-on-surface-variant">Ticket Detail</div>
                    <h4 className="font-heading text-xl font-bold text-on-surface mt-0.5">#{activeTicket.id} - {activeTicket.category}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                    activeTicket.status === "Resolved" ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"
                  }`}>
                    {activeTicket.status}
                  </span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 text-sm mb-4">
                  <p className="font-semibold text-xs text-on-surface-variant uppercase mb-1">Issue Description</p>
                  <p className="text-on-surface">{activeTicket.description}</p>
                  {activeTicket.address && (
                    <div className="mt-2 pt-2 border-t border-outline-variant/5">
                      <p className="font-semibold text-xs text-on-surface-variant uppercase mb-0.5">Location</p>
                      <p className="text-on-surface-variant text-xs">{activeTicket.address}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">Progress History</p>
                  <div className="relative border-l border-outline-variant/20 ml-2.5 pl-6 space-y-4">
                    {activeTicket.updates.map((up, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full border border-background ${
                          i === activeTicket.updates.length - 1 ? "bg-primary shadow-[0_0_8px_#0ea5e9]" : "bg-outline-variant"
                        }`} />
                        <p className="text-xs font-semibold text-on-surface">{up.message}</p>
                        <p className="text-[10px] text-on-surface-variant">{up.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
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

export default CitizenComplaints;
