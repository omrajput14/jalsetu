import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const citizenNavItems = [
  { icon: "dashboard", label: "Dashboard", path: "/dashboard" },
  { icon: "support_agent", label: "My Complaints", path: "/citizen/complaints" },
  { icon: "leaderboard", label: "Usage Analytics", path: "/citizen/analytics" },
  { icon: "settings", label: "Settings", path: "/citizen/settings" },
];

const departmentNavItems = [
  { icon: "settings_remote", label: "Control Center", path: "/control-center" },
  { icon: "water_full", label: "Tanks", path: "/department/tanks" },
  { icon: "event_upcoming", label: "Scheduler", path: "/department/scheduler" },
  { icon: "support_agent", label: "Complaints", path: "/department/complaints" },
  { icon: "leaderboard", label: "Analytics", path: "/department/analytics" },
  { icon: "settings", label: "Settings", path: "/department/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Determine role based on pathname
  const isDepartment =
    location.pathname.startsWith("/control-center") ||
    location.pathname.startsWith("/department");

  const navItems = isDepartment ? departmentNavItems : citizenNavItems;

  const handlePortalSwitch = () => {
    if (isDepartment) {
      navigate("/dashboard");
    } else {
      navigate("/control-center");
    }
  };

  const handleEmergencyShutdown = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmShutdown = () => {
    setShowConfirmModal(false);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-surface-container-low/60 backdrop-blur-2xl border-r border-outline-variant/10 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-8 flex items-center justify-between">
        <span className="font-heading text-2xl font-bold text-primary">
          {isDepartment ? "JalSetu Admin" : "JalSetu"}
        </span>
      </div>

      {/* User Profile */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-high/50 border border-outline-variant/10">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="overflow-hidden">
            <p className="font-heading text-xs font-semibold text-on-surface truncate tracking-wider">
              {isDepartment ? "Admin User" : "Rajesh Kumar"}
            </p>
            <p className="text-[10px] text-on-surface-variant truncate">
              {isDepartment ? "Ward 12 - North Sector" : "Citizen (Ward 12)"}
            </p>
          </div>
        </div>
      </div>

      {/* Portal Switcher Button */}
      <div className="px-4 mb-4">
        <button
          onClick={handlePortalSwitch}
          className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">swap_horiz</span>
          {isDepartment ? "Switch to Citizen View" : "Switch to Admin View"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-2.5 text-xs font-semibold tracking-wider transition-all duration-200 ${
                isActive
                  ? "text-primary bg-primary-container/10 border-r-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mt-auto space-y-1">
        {isDepartment && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEmergencyShutdown}
            className="w-full mb-4 flex items-center justify-center gap-2 bg-error-container/20 text-error border border-error/30 py-2.5 rounded-lg text-xs font-semibold tracking-wider hover:bg-error/20 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">power_settings_new</span>
            Emergency Shutdown
          </motion.button>
        )}
        <a href="#" className="flex items-center gap-4 px-4 py-2.5 text-on-surface-variant hover:text-on-surface transition-colors text-xs font-semibold tracking-wider">
          <span className="material-symbols-outlined">help</span>
          <span>Help Center</span>
        </a>
        <NavLink to="/" className="flex items-center gap-4 px-4 py-2.5 text-on-surface-variant hover:text-on-surface transition-colors text-xs font-semibold tracking-wider">
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </NavLink>
      </div>

      {/* Emergency Shutdown Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card max-w-md w-full p-6 rounded-2xl border border-error/30 bg-[#161213]/90 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-error mb-4">
                <span className="material-symbols-outlined text-3xl">warning</span>
                <h3 className="font-heading text-lg font-bold">Emergency Shutdown</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                WARNING: Are you sure you want to trigger Emergency Shutdown for the entire Ward 12 water network? This will immediately seal all main valves.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg text-xs font-semibold cursor-pointer border border-outline-variant/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmShutdown}
                  className="px-4 py-2 bg-error text-white hover:brightness-110 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Confirm Shutdown
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Emergency Shutdown Notification */}
      <AnimatePresence>
        {showNotification && (
          <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className="pointer-events-auto min-w-[320px] glass-card px-4 py-3 rounded-xl border border-error/30 shadow-2xl flex items-center gap-3 bg-[#1e1315]/95 backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-full bg-error-container/20 text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">power_settings_new</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-on-surface font-semibold">Emergency Shutdown Triggered</p>
                <p className="text-[10px] text-on-surface-variant">Valves sealed, notification sent to all operators.</p>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer flex items-center justify-center p-0.5"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default Sidebar;
