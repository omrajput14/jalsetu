import { motion } from "framer-motion";

const StatusBadge = ({ status, size = "default" }) => {
  const getStyles = () => {
    switch (status) {
      case "resolved":
        return { bg: "#00e67615", color: "#00e676", border: "#00e67630", label: "Resolved", icon: "✓" };
      case "in-progress":
        return { bg: "#ffca2815", color: "#ffca28", border: "#ffca2830", label: "In Progress", icon: "⟳" };
      case "pending":
        return { bg: "#ff525215", color: "#ff5252", border: "#ff525230", label: "Pending", icon: "!" };
      case "active":
        return { bg: "#00d4ff15", color: "#00d4ff", border: "#00d4ff30", label: "Active", icon: "●" };
      case "inactive":
        return { bg: "rgba(255,255,255,0.05)", color: "#5a7a9a", border: "rgba(255,255,255,0.1)", label: "Inactive", icon: "○" };
      case "delayed":
        return { bg: "#ff525215", color: "#ff5252", border: "#ff525230", label: "Delayed", icon: "⏱" };
      default:
        return { bg: "rgba(255,255,255,0.05)", color: "#8ba3be", border: "rgba(255,255,255,0.1)", label: status, icon: "–" };
    }
  };

  const styles = getStyles();
  const isSmall = size === "small";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        isSmall ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      }`}
      style={{
        background: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
      }}
    >
      {(status === "in-progress" || status === "active") && (
        <motion.span
          animate={{ rotate: status === "in-progress" ? 360 : 0, opacity: [0.5, 1, 0.5] }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2, repeat: Infinity },
          }}
          className="inline-block"
        >
          {styles.icon}
        </motion.span>
      )}
      {status !== "in-progress" && status !== "active" && (
        <span>{styles.icon}</span>
      )}
      {styles.label}
    </span>
  );
};

export default StatusBadge;
