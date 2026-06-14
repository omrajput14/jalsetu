import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

const StatCard = ({ icon, label, value, suffix = "", color = "#00d4ff", delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const isNumeric = typeof value === "number";

  useEffect(() => {
    if (!isNumeric) return;
    const controls = animate(0, value, {
      duration: 2,
      delay: delay * 0.15,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });
    return controls.stop;
  }, [value, delay, isNumeric]);

  return (
    <motion.div
      className="glass-card p-5 relative overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      {/* Accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Background glow */}
      <div
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl"
        style={{ background: color }}
      />

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}25`,
        }}
      >
        {icon}
      </div>

      {/* Label */}
      <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">
        {label}
      </p>

      {/* Value */}
      <p className="text-2xl font-heading font-bold text-text-primary">
        {isNumeric ? displayValue : value}
        {suffix && (
          <span className="text-sm font-normal text-text-secondary ml-1">{suffix}</span>
        )}
      </p>
    </motion.div>
  );
};

export default StatCard;
