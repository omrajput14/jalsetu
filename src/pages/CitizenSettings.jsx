import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchConfig, updateConfig } from "../services/api";
import { useAuth } from "../services/AuthContext";

const CitizenSettings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    smsAlerts: true,
    whatsappAlerts: true,
    emailReports: false,
    ecoMode: true,
  });
  const [threshold, setThreshold] = useState(350); // liters limit
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await fetchConfig();
        setNotifications({
          smsAlerts: data.smsAlerts ?? true,
          whatsappAlerts: data.whatsappAlerts ?? true,
          emailReports: data.emailReports ?? false,
          ecoMode: data.ecoMode ?? true,
        });
        setThreshold(data.threshold ?? 350);
      } catch (err) {
        console.error("Failed to load citizen config:", err);
      }
    };
    loadConfig();
  }, []);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleToggle = async (key) => {
    const newVal = !notifications[key];
    try {
      const updated = await updateConfig({ [key]: newVal });
      setNotifications((prev) => ({ ...prev, [key]: updated[key] ?? newVal }));
    } catch (err) {
      console.error(err);
      addToast("Failed to update setting.", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateConfig({
        threshold: threshold,
      });
      setThreshold(updated.threshold ?? threshold);
      addToast("Settings saved successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to save settings.", "error");
    }
  };

  return (
    <div className="max-w-[1440px] space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Account Config</p>
          <h1 className="font-heading text-4xl font-bold text-on-surface">Portal Settings</h1>
        </div>
        <div className="glass-card px-6 py-4 rounded-xl flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">settings</span>
          <span className="font-heading text-sm font-medium tracking-tight">Active Connection: #JS-9182-W12</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Profile and Preferences */}
        <div className="lg:col-span-7 space-y-6">
          {/* Profile Card */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-heading text-xl font-medium text-on-surface mb-6">Consumer Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Consumer Name</label>
                <input 
                  type="text" 
                  disabled
                  value={user?.name || "Anonymous Citizen"}
                  className="w-full bg-surface-container/50 border border-outline-variant/10 rounded-lg p-3 text-sm text-on-surface-variant cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Registered Mobile</label>
                <input 
                  type="text" 
                  disabled
                  value={user?.phone || "+91 99887 76655"}
                  className="w-full bg-surface-container/50 border border-outline-variant/10 rounded-lg p-3 text-sm text-on-surface-variant cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Connection Details / Registered Email</label>
                <input 
                  type="text" 
                  disabled
                  value={user ? `Assigned Ward: Sector-${user.ward_id || "N/A"} · Email: ${user.email}` : "Plot 24, North Avenue Road, Sector B, North Sector, Ward 12"}
                  className="w-full bg-surface-container/50 border border-outline-variant/10 rounded-lg p-3 text-sm text-on-surface-variant cursor-not-allowed"
                />
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-4">Profile updates must be submitted through the Ward municipal office with valid utility ownership credentials.</p>
          </div>

          {/* Warning Thresholds */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-heading text-xl font-medium text-on-surface mb-4">Water Usage Alerts</h3>
            <p className="text-sm text-on-surface-variant mb-6">Receive high usage alerts on your phone when daily consumption exceeds your set warning threshold.</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-on-surface">Daily Alert Threshold</label>
                <span className="font-mono-metrics font-bold text-primary">{threshold} Liters</span>
              </div>
              <input 
                type="range" 
                min={100}
                max={800}
                step={50}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer bg-surface-container-high h-1.5 rounded-full"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant font-semibold">
                <span>100L (Eco)</span>
                <span>450L (Average)</span>
                <span>800L (High)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Notification Swtiches */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-medium text-on-surface">Notifications & Auto-alerts</h3>
              
              <div className="space-y-4">
                {/* Switch 1 */}
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/5">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">SMS Supply Reminders</p>
                    <p className="text-xs text-on-surface-variant">Alert me 30 mins before water release</p>
                  </div>
                  <div 
                    onClick={() => handleToggle("smsAlerts")}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                      notifications.smsAlerts ? "bg-primary" : "bg-surface-container-highest"
                    }`}
                  >
                    <motion.div 
                      layout
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                      animate={{ x: notifications.smsAlerts ? 20 : 0 }}
                    />
                  </div>
                </div>

                {/* Switch 2 */}
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/5">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">WhatsApp Reports</p>
                    <p className="text-xs text-on-surface-variant">Receive weekly purity and bills on WhatsApp</p>
                  </div>
                  <div 
                    onClick={() => handleToggle("whatsappAlerts")}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                      notifications.whatsappAlerts ? "bg-primary" : "bg-surface-container-highest"
                    }`}
                  >
                    <motion.div 
                      layout
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                      animate={{ x: notifications.whatsappAlerts ? 20 : 0 }}
                    />
                  </div>
                </div>

                {/* Switch 3 */}
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/5">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Weekly Purity Emails</p>
                    <p className="text-xs text-on-surface-variant">Detailed lab diagnostics PDF sent to email</p>
                  </div>
                  <div 
                    onClick={() => handleToggle("emailReports")}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                      notifications.emailReports ? "bg-primary" : "bg-surface-container-highest"
                    }`}
                  >
                    <motion.div 
                      layout
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                      animate={{ x: notifications.emailReports ? 20 : 0 }}
                    />
                  </div>
                </div>

                {/* Switch 4 */}
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/5">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Eco Saver Mode</p>
                    <p className="text-xs text-on-surface-variant">Auto-enroll in neighborhood saving challenges</p>
                  </div>
                  <div 
                    onClick={() => handleToggle("ecoMode")}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                      notifications.ecoMode ? "bg-primary" : "bg-surface-container-highest"
                    }`}
                  >
                    <motion.div 
                      layout
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                      animate={{ x: notifications.ecoMode ? 20 : 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full mt-6 py-3 bg-primary text-on-primary font-bold text-sm rounded-lg hover:brightness-110 transition-all cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
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

export default CitizenSettings;
