import { motion, AnimatePresence } from "framer-motion";

const NotificationDrawer = ({ isOpen, onClose, notifications = [] }) => {
  const getTypeStyles = (type) => {
    switch (type) {
      case "alert":
        return { icon: "⚠️", color: "#ff5252", bg: "#ff525210" };
      case "success":
        return { icon: "✅", color: "#00e676", bg: "#00e67610" };
      case "info":
      default:
        return { icon: "ℹ️", color: "#00d4ff", bg: "#00d4ff10" };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-[70] bg-navy-light border-l border-glass-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-glass-border">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <h3 className="font-heading font-bold text-lg text-text-primary">
                  Notifications
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-dim text-cyan text-xs font-semibold">
                  {notifications.filter((n) => !n.read).length} new
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-glass border border-glass-border flex items-center justify-center hover:bg-glass-hover transition-all text-text-secondary cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Notification list */}
            <div className="p-4 overflow-y-auto" style={{ height: "calc(100% - 76px)" }}>
              <div className="flex flex-col gap-3">
                {notifications.map((notif, index) => {
                  const styles = getTypeStyles(notif.type);
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-xl p-4 border transition-all hover:border-opacity-60"
                      style={{
                        background: styles.bg,
                        borderColor: `${styles.color}20`,
                        borderLeft: `3px solid ${styles.color}`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg mt-0.5">{styles.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-text-primary truncate">
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-cyan shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-text-muted leading-relaxed mb-2">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-text-muted uppercase tracking-wider">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDrawer;
