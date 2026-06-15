import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWards, updateWard } from "../services/api";
import WaterTank from "../components/WaterTank";

const DepartmentTanks = () => {
  const [tankList, setTankList] = useState([]);
  const [selectedTank, setSelectedTank] = useState(null);
  const [refilling, setRefilling] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const loadTanks = async () => {
      try {
        const data = await fetchWards();
        setTankList(data);
        if (data.length > 0) {
          setSelectedTank(data[0]);
        }
      } catch (err) {
        console.error("Failed to load reservoirs:", err);
      }
    };
    loadTanks();
  }, []);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleRefill = async () => {
    if (!selectedTank) return;
    setRefilling(true);
    const newLevel = Math.min(selectedTank.currentLevel + 15, 100);
    const capacity = typeof selectedTank.tankCapacity === 'number'
      ? selectedTank.tankCapacity
      : parseInt(String(selectedTank.tankCapacity).replace(/,/g, ""));
    const newVolumeVal = Math.round((newLevel / 100) * capacity);
    const newVolume = `${Math.round(newVolumeVal / 1000)}K L`;
    try {
      const updated = await updateWard(selectedTank.id, {
        currentLevel: newLevel,
        currentVolume: newVolume
      });
      setTankList((prev) =>
        prev.map((t) => (t.id === selectedTank.id ? updated : t))
      );
      setSelectedTank(updated);
      addToast(`${selectedTank.name} refill cycle completed (+15%).`, "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to refill reservoir.", "error");
    } finally {
      setRefilling(false);
    }
  };

  const handleTogglePump = async () => {
    if (!selectedTank) return;
    const updatedStatus = selectedTank.pumpStatus === "Active" ? "Inactive" : "Active";
    try {
      const updated = await updateWard(selectedTank.id, { pumpStatus: updatedStatus });
      setTankList((prev) =>
        prev.map((t) => (t.id === selectedTank.id ? updated : t))
      );
      setSelectedTank(updated);
      addToast(`${selectedTank.name} pump override set to ${updatedStatus}.`, updatedStatus === "Active" ? "success" : "warning");
    } catch (err) {
      console.error(err);
      addToast("Failed to override pump status.", "error");
    }
  };

  const avgLevel = tankList.length > 0 ? Math.round(tankList.reduce((acc, t) => acc + t.currentLevel, 0) / tankList.length) : 0;
  const criticalTanks = tankList.filter((t) => t.currentLevel < 30).length;

  return (
    <div className="max-w-[1440px] space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Reservoir Infrastructure</p>
          <h1 className="font-heading text-4xl font-bold text-on-surface">Storage Tanks Monitoring</h1>
        </div>
        <div className="glass-card px-6 py-4 rounded-xl flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">water_full</span>
          <span className="font-heading text-sm font-medium tracking-tight">Active Reservoirs: {tankList.length}</span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Avg Reservoir Level</p>
          <p className="font-heading text-3xl font-bold text-primary">{avgLevel}%</p>
          <p className="text-xs text-on-surface-variant mt-2">Optimal range: 60-90%</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Critical Alerts</p>
          <p className={`font-heading text-3xl font-bold ${criticalTanks > 0 ? "text-error" : "text-tertiary"}`}>
            {criticalTanks} {criticalTanks === 1 ? "Tank" : "Tanks"}
          </p>
          <p className="text-xs text-on-surface-variant mt-2">{criticalTanks > 0 ? "Requires immediate refill" : "All levels stable"}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Total Capacity</p>
          <p className="font-heading text-3xl font-bold text-secondary">2.6M Liters</p>
          <p className="text-xs text-on-surface-variant mt-2">Across 6 wards</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">System Pump Status</p>
          <p className="font-heading text-3xl font-bold text-tertiary">
            {tankList.filter((t) => t.pumpStatus === "Active").length} / {tankList.length} Active
          </p>
          <p className="text-xs text-on-surface-variant mt-2">Pumps running within safe RPMs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tanks Grid (Left) */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-xl font-medium text-on-surface">Ward Storage Reservoirs</h3>
            <span className="text-xs text-on-surface-variant font-semibold">Click a tank to manage</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {tankList.map((tank) => (
              <div
                key={tank.id}
                onClick={() => setSelectedTank(tank)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center ${
                  selectedTank?.id === tank.id
                    ? "bg-primary-container/10 border-primary"
                    : "bg-surface-container-low border-outline-variant/10 hover:border-primary/20"
                }`}
              >
                <WaterTank
                  level={tank.currentLevel}
                  capacity={tank.tankCapacity}
                  size="small"
                  label={tank.name.replace("Ward ", "W")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tank Detailed Controls (Right) */}
        <div className="lg:col-span-4 space-y-6">
          {selectedTank ? (
            <div className="glass-card rounded-2xl p-6 flex flex-col h-full justify-between">
              <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-heading text-xl font-bold text-on-surface">{selectedTank.name}</h3>
                  <p className="text-xs text-on-surface-variant">{selectedTank.sector}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                  selectedTank.pumpStatus === "Active" ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
                }`}>
                  {selectedTank.pumpStatus}
                </span>
              </div>

              {/* Stats detail grid */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Volume</p>
                  <p className="font-heading text-lg font-bold text-on-surface">{selectedTank.currentVolume}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Outflow</p>
                  <p className="font-heading text-lg font-bold text-on-surface">{selectedTank.estimatedOutflow}</p>
                </div>
                <div className="mt-2">
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">pH Level</p>
                  <p className="font-heading text-sm font-bold text-emerald-400">7.4 (Healthy)</p>
                </div>
                <div className="mt-2">
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Chlorine PPM</p>
                  <p className="font-heading text-sm font-bold text-emerald-400">1.8 mg/L</p>
                </div>
              </div>

              {/* Pump actions */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">Valve & Pump Override</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleTogglePump}
                    className={`flex-1 py-3 text-xs font-bold rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                      selectedTank.pumpStatus === "Active"
                        ? "bg-error-container/20 text-error border-error/30 hover:bg-error/20"
                        : "bg-tertiary-container/20 text-tertiary border-tertiary/30 hover:bg-tertiary/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {selectedTank.pumpStatus === "Active" ? "power_settings_new" : "check_circle"}
                    </span>
                    {selectedTank.pumpStatus === "Active" ? "Turn Off Pump" : "Turn On Pump"}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleRefill}
              disabled={refilling}
              className="w-full mt-6 py-3 bg-primary text-on-primary font-bold text-sm rounded-lg hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              {refilling ? "Refilling in Progress..." : "Initiate Direct Refill"}
            </button>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-center text-on-surface-variant flex items-center justify-center h-full">
              Select a reservoir to view detailed controls
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

export default DepartmentTanks;
