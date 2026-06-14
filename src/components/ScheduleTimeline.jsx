import { motion } from "framer-motion";

const ScheduleTimeline = ({ schedule = [] }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return { bg: "#00e67620", border: "#00e67640", dot: "#00e676", text: "#00e676", label: "Completed" };
      case "active":
        return { bg: "#00d4ff20", border: "#00d4ff40", dot: "#00d4ff", text: "#00d4ff", label: "In Progress" };
      case "upcoming":
        return { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)", dot: "#5a7a9a", text: "#8ba3be", label: "Upcoming" };
      case "delayed":
        return { bg: "#ff525220", border: "#ff525240", dot: "#ff5252", text: "#ff5252", label: "Delayed" };
      default:
        return { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)", dot: "#5a7a9a", text: "#8ba3be", label: status };
    }
  };

  return (
    <div className="flex flex-col gap-0 relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-6 bottom-6 w-px bg-glass-border" />

      {schedule.map((slot, index) => {
        const styles = getStatusStyles(slot.status);
        return (
          <motion.div
            key={index}
            className="flex items-start gap-4 py-3 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            {/* Dot */}
            <div className="relative z-10 mt-1">
              <div
                className="w-3 h-3 rounded-full border-2"
                style={{
                  background: styles.dot,
                  borderColor: styles.dot,
                  boxShadow: slot.status === "active" ? `0 0 12px ${styles.dot}` : "none",
                }}
              />
              {slot.status === "active" && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${styles.dot}` }}
                  animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>

            {/* Content */}
            <div
              className="flex-1 rounded-xl px-4 py-3 transition-all"
              style={{
                background: styles.bg,
                border: `1px solid ${styles.border}`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading font-semibold text-sm text-text-primary">
                  {slot.time}
                </span>
                <span
                  className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ color: styles.text, background: `${styles.dot}15` }}
                >
                  {styles.label}
                </span>
              </div>
              <span className="text-xs text-text-muted">Duration: {slot.duration}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ScheduleTimeline;
