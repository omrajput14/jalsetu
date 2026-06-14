import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchConfig, updateConfig } from "../services/api";

const DepartmentSettings = () => {
  const [config, setConfig] = useState({
    pressureLimit: 5.5,
    reservoirLimit: 20,
    smsAlerts: true,
    leakSiren: true,
    autoShutoff: true,
  });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await fetchConfig();
        setConfig(data);
      } catch (err) {
        console.error("Failed to load config:", err);
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
    const newVal = !config[key];
    try {
      const updated = await updateConfig({ [key]: newVal });
      setConfig(updated);
    } catch (err) {
      console.error(err);
      addToast("Failed to update setting.", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateConfig({
        pressureLimit: config.pressureLimit,
        reservoirLimit: config.reservoirLimit,
      });
      setConfig(updated);
      addToast("Municipal settings saved successfully!", "success");
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
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Municipal Infrastructure Control</p>
          <h1 className="font-heading text-4xl font-bold text-on-surface">System Settings</h1>
        </div>
        <div className="glass-card px-6 py-4 rounded-xl flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">settings</span>
          <span className="font-heading text-sm font-medium tracking-tight">System Status: ONLINE</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Municipal System Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Settings form */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-heading text-xl font-medium text-on-surface mb-6">Alarm Threshold Configuration</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-on-surface">Max Allowed Line Pressure</label>
                  <span className="font-mono-metrics font-bold text-secondary">{config.pressureLimit} Bar</span>
                </div>
                <input 
                  type="range" 
                  min={3.0}
                  max={7.0}
                  step={0.1}
                  value={config.pressureLimit}
                  onChange={(e) => setConfig({ ...config, pressureLimit: Number(e.target.value) })}
                  className="w-full accent-secondary cursor-pointer bg-surface-container-high h-1.5 rounded-full"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant font-semibold">
                  <span>3.0 Bar (Safe)</span>
                  <span>5.0 Bar (High)</span>
                  <span>7.0 Bar (Danger Zone)</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-on-surface">Low Reservoir Warning Limit</label>
                  <span className="font-mono-metrics font-bold text-error">{config.reservoirLimit}%</span>
                </div>
                <input 
                  type="range" 
                  min={10}
                  max={40}
                  step={5}
                  value={config.reservoirLimit}
                  onChange={(e) => setConfig({ ...config, reservoirLimit: Number(e.target.value) })}
                  className="w-full accent-error cursor-pointer bg-surface-container-high h-1.5 rounded-full"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant font-semibold">
                  <span>10% (Emergency)</span>
                  <span>25% (Warning)</span>
                  <span>40% (Standard)</span>
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-primary text-on-primary font-bold text-sm rounded-lg hover:brightness-110 transition-all cursor-pointer">
                Apply Threshold Config
              </button>
            </form>
          </div>

          {/* Diagnostic utilities */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-heading text-xl font-medium text-on-surface mb-4">Diagnostics & Maintenance Override</h3>
            <p className="text-sm text-on-surface-variant mb-4">Run manual network self-tests or toggle maintenance bypass valves.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => addToast("Self-diagnostic simulation started... No issues detected.", "info")}
                className="flex-1 py-3 bg-surface-container-high border border-outline-variant/20 hover:border-primary/20 text-on-surface rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Run Self-Diagnostic
              </button>
              <button 
                onClick={() => addToast("Bypass valve test initialized... System health normal.", "info")}
                className="flex-1 py-3 bg-surface-container-high border border-outline-variant/20 hover:border-primary/20 text-on-surface rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Test Valve Bypass
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Auto Shutdown and Notifications */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 flex flex-col h-full justify-between">
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-medium text-on-surface">Automation Toggles</h3>
              <div className="space-y-4">
                {/* Switch 1 */}
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/5">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Auto-SMS to Citizens</p>
                    <p className="text-xs text-on-surface-variant">Notify residents 30m prior to supply release</p>
                  </div>
                  <div 
                    onClick={() => handleToggle("smsAlerts")}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                      config.smsAlerts ? "bg-primary" : "bg-surface-container-highest"
                    }`}
                  >
                    <motion.div 
                      layout
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                      animate={{ x: config.smsAlerts ? 20 : 0 }}
                    />
                  </div>
                </div>

                {/* Switch 2 */}
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/5">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Leak Alerts Dispatch</p>
                    <p className="text-xs text-on-surface-variant">Auto-dispatch crew on flow velocity drops</p>
                  </div>
                  <div 
                    onClick={() => handleToggle("leakSiren")}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                      config.leakSiren ? "bg-primary" : "bg-surface-container-highest"
                    }`}
                  >
                    <motion.div 
                      layout
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                      animate={{ x: config.leakSiren ? 20 : 0 }}
                    />
                  </div>
                </div>

                {/* Switch 3 */}
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/5">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Emergency Shutoff</p>
                    <p className="text-xs text-on-surface-variant">Auto-shut valves on pressure surge &gt; 6.0 Bar</p>
                  </div>
                  <div 
                    onClick={() => handleToggle("autoShutoff")}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                      config.autoShutoff ? "bg-primary" : "bg-surface-container-highest"
                    }`}
                  >
                    <motion.div 
                      layout
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                      animate={{ x: config.autoShutoff ? 20 : 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-error-container/10 border border-error/20 rounded-xl mt-6">
              <h5 className="text-xs font-bold text-error uppercase mb-1">Critical Security Override</h5>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Emergency valve shutdown bypasses all scheduling controls. Activating emergency shutdown will immediately seal main conduit pipes.
              </p>
            </div>
          </div>
        </div>
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

export default DepartmentSettings;
