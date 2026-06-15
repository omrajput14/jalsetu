import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { adminStats, wards as localWards, complaints, sensorNodes } from "../data/mockData";
import { fetchWards, triggerFlush } from "../services/api";

const DepartmentPortal = () => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [flushingNode, setFlushingNode] = useState(false);
  const [filterSector, setFilterSector] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [toasts, setToasts] = useState([]);
  const [wardsList, setWardsList] = useState(localWards);
  
  const center = [19.0760, 72.8777];

  // Helper component to handle zoom/pan programmatically
  const MapController = () => {
    const map = useMap();
    useEffect(() => {
      // Expose map to window or parent state if needed, but we can handle it directly via refs if we want.
      // For now, we'll keep the buttons doing standard Leaflet controls (which are built-in).
    }, [map]);
    return null;
  };

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const loadWards = async () => {
    try {
      const data = await fetchWards();
      setWardsList(data);
    } catch (err) {
      console.error("Failed to load wards from backend:", err);
    }
  };

  useEffect(() => {
    loadWards();
  }, []);

  // Since Leaflet has built-in zoom controls, we don't strictly need these custom buttons unless desired.
  // But to keep the UI exactly as it was:
  const [mapInstance, setMapInstance] = useState(null);
  const handleZoomIn = () => { if (mapInstance) mapInstance.zoomIn(); };
  const handleZoomOut = () => { if (mapInstance) mapInstance.zoomOut(); };
  const handleReset = () => { if (mapInstance) { mapInstance.setView(center, 12); } setSelectedNode(null); };

  const handleFlushNode = async (nodeLabel) => {
    setFlushingNode(true);
    try {
      const result = await triggerFlush(nodeLabel);
      setFlushingNode(false);
      addToast(result.message || `Valve flush diagnostics on ${nodeLabel} completed.`, "success");
    } catch (err) {
      setFlushingNode(false);
      addToast(`Failed to flush node ${nodeLabel}.`, "error");
    }
  };

  const filteredSortedWards = wardsList
    .filter((w) => filterSector === "All" || w.sector === filterSector)
    .sort((a, b) => {
      if (sortBy === "level-desc") return b.currentLevel - a.currentLevel;
      if (sortBy === "level-asc") return a.currentLevel - b.currentLevel;
      if (sortBy === "capacity") return b.tankCapacity - a.tankCapacity;
      return 0;
    });

  const today = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

  const statCards = [
    { label: "CURRENT OUTPUT", value: adminStats.currentOutput, unit: adminStats.currentOutputUnit, delta: adminStats.currentOutputDelta, icon: "water_drop", color: "text-primary" },
    { label: "AVG PRESSURE", value: adminStats.avgPressure, unit: adminStats.avgPressureUnit, delta: adminStats.avgPressureStatus, icon: "compress", color: "text-secondary" },
    { label: "SYSTEM HEALTH", value: adminStats.systemHealth, unit: "", delta: adminStats.systemHealthSensors, icon: "verified_user", color: "text-tertiary" },
  ];

  const statusColors = { 
    stable: "bg-tertiary shadow-[0_0_15px_rgba(107,216,203,0.8)]", 
    active: "bg-primary shadow-[0_0_15px_rgba(14,165,233,0.8)]", 
    critical: "bg-error shadow-[0_0_15px_rgba(255,180,171,0.8)] animate-pulse" 
  };

  return (
    <div className="max-w-[1440px]">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-3xl font-bold text-on-surface">Control Center Overview</h1>
          <span className="px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary text-xs font-semibold uppercase tracking-wider">Live System</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-on-surface-variant text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            {today}
          </span>
          <button className="relative cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">notifications</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full" />
          </button>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">{card.label}</p>
              <p className={`font-heading text-4xl font-bold ${card.color}`}>
                {card.value} <span className="text-lg font-normal text-on-surface-variant">{card.unit}</span>
              </p>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-tertiary text-sm">trending_up</span>
                {card.delta}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-high/50 flex items-center justify-center">
              <span className={`material-symbols-outlined text-2xl ${card.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Map + Sidebar */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Network Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-6 min-h-[500px] relative overflow-hidden flex flex-col"
        >
          {/* Interactive Map Area */}
          <div className="flex-1 relative bg-[#0a0f13] overflow-hidden rounded-xl border border-outline-variant/10">
                <MapContainer 
                  center={center} 
                  zoom={12} 
                  zoomControl={false}
                  scrollWheelZoom={true} 
                  style={{ width: '100%', height: '100%', background: '#0a0f13' }}
                  ref={setMapInstance}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  {sensorNodes.map((node) => {
                    let pinColor = "#0ea5e9"; // Active/Primary
                    let shadowGlow = "rgba(14, 165, 233, 0.5)";
                    if (node.status === "stable") { pinColor = "#6bd8cb"; shadowGlow = "rgba(107, 216, 203, 0.5)"; }
                    if (node.status === "critical") { pinColor = "#ffb4ab"; shadowGlow = "rgba(255, 180, 171, 0.5)"; }

                    const customIcon = L.divIcon({
                      className: 'custom-leaflet-marker',
                      html: `<div style="width: 20px; height: 20px; background-color: ${pinColor}; border-radius: 50%; border: 3px solid #0f1418; box-shadow: 0 0 15px ${shadowGlow}"></div>`,
                      iconSize: [20, 20],
                      iconAnchor: [10, 10],
                      popupAnchor: [0, -10]
                    });

                    return (
                      <Marker 
                        key={node.id} 
                        position={[node.lat, node.lng]} 
                        icon={customIcon}
                        eventHandlers={{
                          click: () => setSelectedNode(node),
                        }}
                      >
                        <Popup className="custom-popup" closeButton={false}>
                          <div className="text-gray-900 p-1 min-w-[120px] m-0">
                            <h4 className="font-bold text-sm mb-1">{node.label}</h4>
                            <p className="text-xs font-semibold capitalize m-0" style={{
                              color: node.status === 'critical' ? '#ef4444' : node.status === 'active' ? '#0ea5e9' : '#14b8a6'
                            }}>
                              {node.status}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
            
            {/* Map Controls */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <div className="bg-surface/80 backdrop-blur-md border border-outline-variant/30 p-2 rounded-lg flex flex-col gap-2 shadow-lg">
                <button 
                  onClick={handleZoomIn} 
                  className="p-1 hover:bg-primary/20 rounded transition-colors text-on-surface cursor-pointer flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
                <button 
                  onClick={handleZoomOut} 
                  className="p-1 hover:bg-primary/20 rounded transition-colors text-on-surface cursor-pointer flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
              </div>
              <button 
                onClick={handleReset} 
                className="bg-surface/80 backdrop-blur-md border border-outline-variant/30 p-3 rounded-lg hover:bg-primary/20 transition-colors text-on-surface cursor-pointer flex items-center justify-center shadow-lg"
              >
                <span className="material-symbols-outlined text-lg">my_location</span>
              </button>
            </div>

            {/* Selected Node Details Card */}
            {selectedNode && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-16 right-4 bg-surface/90 backdrop-blur-xl border border-outline-variant/30 p-4 rounded-xl shadow-2xl z-20 w-64 text-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-on-surface">{selectedNode.label}</h4>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <div className="space-y-1 text-xs mb-3 text-on-surface-variant">
                  <p>Status: <span className={`font-semibold capitalize ${selectedNode.status === 'critical' ? 'text-error' : selectedNode.status === 'active' ? 'text-primary' : 'text-tertiary'}`}>{selectedNode.status}</span></p>
                  <p>Pressure: <span className="text-on-surface font-semibold">{selectedNode.status === 'critical' ? '1.8 Bar' : '4.2 Bar'}</span></p>
                  <p>Flow Rate: <span className="text-on-surface font-semibold">{selectedNode.status === 'critical' ? '120 L/min' : '450 L/min'}</span></p>
                  <p>Last Active: <span className="text-on-surface">2 mins ago</span></p>
                </div>
                <button
                  onClick={() => handleFlushNode(selectedNode.label)}
                  disabled={flushingNode}
                  className="w-full py-1.5 bg-primary text-on-primary font-bold rounded text-xs hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                >
                  {flushingNode ? "Flushing Valves..." : "Run Valve Flush"}
                </button>
              </motion.div>
            )}

            {/* Legend Overlay */}
            <div className="absolute bottom-4 left-4 bg-surface/80 backdrop-blur-md border border-outline-variant/30 px-4 py-2 rounded-lg flex gap-4 z-20 shadow-lg">
              {[
                { color: "bg-tertiary shadow-[0_0_8px_rgba(107,216,203,0.8)]", label: "Stable" },
                { color: "bg-primary shadow-[0_0_8px_rgba(14,165,233,0.8)]", label: "Supply Active" },
                { color: "bg-error shadow-[0_0_8px_rgba(255,180,171,0.8)]", label: "Critical Alert" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs text-on-surface-variant font-semibold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Sidebar Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Complaints */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-xl font-medium">Complaints</h3>
              <span className="text-xs text-on-surface-variant">Last 24h</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-surface-container-high/50 rounded-xl p-4 text-center">
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">OPEN</p>
                <p className="font-heading text-3xl font-bold text-error">{adminStats.openComplaints}</p>
              </div>
              <div className="bg-surface-container-high/50 rounded-xl p-4 text-center">
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">RESOLVED</p>
                <p className="font-heading text-3xl font-bold text-tertiary">{adminStats.resolvedComplaints}</p>
              </div>
            </div>
            <Link to="/department/complaints" className="text-primary text-xs font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer">
              View All Tickets <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </motion.div>

          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-xl font-medium">Performance</h3>
              <span className="flex items-center gap-1 text-tertiary text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">verified</span> Optimal
              </span>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-on-surface-variant">Supply Efficiency</span>
                  <span className="text-sm font-semibold text-on-surface">{adminStats.supplyEfficiency}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${adminStats.supplyEfficiency}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-on-surface-variant">Pressure Variance</span>
                  <span className="text-sm font-semibold text-on-surface">{adminStats.pressureVariance}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${adminStats.pressureVariance * 10}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ward Storage Tanks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl font-semibold">Ward Storage Tanks</h2>
          <div className="flex gap-3">
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="px-4 py-2 glass-card rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer bg-surface-container-high border-none outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Sectors</option>
              <option value="North Sector">North Sector</option>
              <option value="East Sector">East Sector</option>
              <option value="West Sector">West Sector</option>
              <option value="South Sector">South Sector</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 glass-card rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer bg-surface-container-high border-none outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="default">Default Sort</option>
              <option value="level-desc">Level (Highest)</option>
              <option value="level-asc">Level (Lowest)</option>
              <option value="capacity">Capacity (Highest)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSortedWards.map((ward) => {
            const level = ward.currentLevel;
            const color = level >= 60 ? "#0ea5e9" : level >= 30 ? "#eab308" : "#ef4444";
            const statusText = level >= 60 ? "Good" : level >= 30 ? "Moderate" : "Critical";
            return (
              <motion.div
                key={ward.id}
                whileHover={{ scale: 1.02 }}
                className={`glass-card rounded-2xl p-6 ${level < 20 ? "border-error/30" : ""}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-heading text-sm font-semibold">{ward.name}</h4>
                    <p className="text-[10px] text-on-surface-variant">{ward.sector}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    ward.pumpStatus === "Active" ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
                  }`}>
                    {ward.pumpStatus}
                  </span>
                </div>
                {/* Mini Tank */}
                <div className="relative w-full h-32 bg-surface-container-highest/30 rounded-xl border border-outline-variant/10 overflow-hidden mb-4">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${level}%` }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                    className="absolute bottom-0 w-full"
                    style={{ background: `linear-gradient(180deg, ${color}33 0%, ${color}99 100%)` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold text-white drop-shadow-lg">{level}%</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>{ward.currentVolume}</span>
                  <span style={{ color }}>{statusText}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-on-surface-variant text-sm">© 2024 JalSetu Technologies. Securing every drop.</p>
        <div className="flex gap-8 text-sm text-on-surface-variant">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors" href="#">Contact Support</a>
          <a className="hover:text-primary transition-colors" href="#">Documentation</a>
        </div>
      </footer>

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
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-tertiary-container/20 text-tertiary">
                <span className="material-symbols-outlined text-lg">check_circle</span>
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

export default DepartmentPortal;
