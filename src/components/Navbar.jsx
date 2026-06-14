import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ onNotificationClick, notificationCount = 0 }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/citizen", label: "Citizen Portal", icon: "👤" },
    { path: "/department", label: "Department", icon: "🏛️" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-panel mx-4 mt-3 px-6 py-3 flex items-center justify-between rounded-2xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-aqua flex items-center justify-center text-navy font-heading font-bold text-sm">
            💧
          </div>
          <span className="font-heading font-bold text-lg text-text-primary tracking-tight">
            Jal<span className="gradient-text">Setu</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative px-4 py-2 rounded-xl text-sm font-medium transition-colors no-underline"
              style={{
                color: isActive(link.path) ? "#00d4ff" : "#8ba3be",
              }}
            >
              {isActive(link.path) && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-base">{link.icon}</span>
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          {onNotificationClick && (
            <button
              onClick={onNotificationClick}
              className="relative w-10 h-10 rounded-xl bg-glass border border-glass-border flex items-center justify-center hover:bg-glass-hover transition-all cursor-pointer"
            >
              <span className="text-lg">🔔</span>
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-water-red text-white text-[10px] font-bold flex items-center justify-center"
                >
                  {notificationCount}
                </motion.span>
              )}
            </button>
          )}

          {/* Mobile menu */}
          <button
            className="md:hidden w-10 h-10 rounded-xl bg-glass border border-glass-border flex items-center justify-center cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="md:hidden glass-panel mx-4 mt-2 overflow-hidden rounded-2xl"
          >
            <div className="p-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline"
                  style={{
                    color: isActive(link.path) ? "#00d4ff" : "#8ba3be",
                    background: isActive(link.path) ? "rgba(0,212,255,0.08)" : "transparent",
                  }}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
