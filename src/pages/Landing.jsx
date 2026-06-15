import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

/* ── Feature data ── */
const features = [
  {
    icon: "sensors",
    title: "Live Monitoring",
    desc: "Real-time pressure, flow, and quality sensors across your entire network. Identify leaks before they become crises.",
    accent: "#89ceff",
    visual: "chart",
  },
  {
    icon: "event_upcoming",
    title: "Smart Scheduling",
    desc: "Automated distribution schedules based on demand forecasts and current reservoir levels.",
    accent: "#5de6ff",
    visual: "schedule",
  },
  {
    icon: "public",
    title: "Citizen Transparency",
    desc: "Empower residents with mobile apps to check supply times, report leaks, and pay bills instantly.",
    accent: "#6bd8cb",
    visual: "mobile",
  },
  {
    icon: "psychology",
    title: "Predictive AI",
    desc: "Our AI models predict equipment failure and consumption spikes with 98% accuracy, reducing operational overhead.",
    accent: "#a78bfa",
    visual: "ai",
  },
  {
    icon: "leak_add",
    title: "Leak Detection",
    desc: "Acoustic sensors and ML algorithms pinpoint leak locations within 2 metres before pressure drops register.",
    accent: "#fb923c",
    visual: "leak",
  },
];

/* ── Animated water wave SVG background ── */
const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Radial glow orbs */}
    <div
      style={{
        position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: 800, height: 800, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
    <div
      style={{
        position: "absolute", bottom: "-20%", right: "-10%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(107,216,203,0.12) 0%, transparent 70%)",
        filter: "blur(60px)",
      }}
    />
    <div
      style={{
        position: "absolute", top: "30%", left: "-10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(93,230,255,0.08) 0%, transparent 70%)",
        filter: "blur(50px)",
      }}
    />

    {/* Animated SVG waves at bottom */}
    <svg
      viewBox="0 0 1440 320"
      style={{ position: "absolute", bottom: 0, left: 0, width: "100%", opacity: 0.12 }}
      preserveAspectRatio="none"
    >
      <motion.path
        d="M0,160 C180,220 360,80 540,140 C720,200 900,80 1080,120 C1260,160 1380,100 1440,80 L1440,320 L0,320 Z"
        fill="#89ceff"
        animate={{ d: [
          "M0,160 C180,220 360,80 540,140 C720,200 900,80 1080,120 C1260,160 1380,100 1440,80 L1440,320 L0,320 Z",
          "M0,120 C200,160 400,60 600,100 C800,140 1000,60 1200,100 C1350,130 1400,80 1440,60 L1440,320 L0,320 Z",
          "M0,160 C180,220 360,80 540,140 C720,200 900,80 1080,120 C1260,160 1380,100 1440,80 L1440,320 L0,320 Z",
        ]}}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
    <svg
      viewBox="0 0 1440 320"
      style={{ position: "absolute", bottom: 0, left: 0, width: "100%", opacity: 0.07 }}
      preserveAspectRatio="none"
    >
      <motion.path
        d="M0,200 C200,120 400,240 600,180 C800,120 1000,200 1200,160 C1350,130 1400,180 1440,200 L1440,320 L0,320 Z"
        fill="#5de6ff"
        animate={{ d: [
          "M0,200 C200,120 400,240 600,180 C800,120 1000,200 1200,160 C1350,130 1400,180 1440,200 L1440,320 L0,320 Z",
          "M0,180 C220,240 420,140 620,200 C820,260 1020,160 1220,200 C1360,230 1410,170 1440,160 L1440,320 L0,320 Z",
          "M0,200 C200,120 400,240 600,180 C800,120 1000,200 1200,160 C1350,130 1400,180 1440,200 L1440,320 L0,320 Z",
        ]}}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </svg>

    {/* Floating dots */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: "absolute",
          width: 2 + (i % 3),
          height: 2 + (i % 3),
          borderRadius: "50%",
          background: i % 3 === 0 ? "#89ceff" : i % 3 === 1 ? "#6bd8cb" : "#5de6ff",
          left: `${(i * 37 + 10) % 95}%`,
          top: `${(i * 23 + 5) % 85}%`,
          opacity: 0.3,
        }}
        animate={{ y: [-8, 8, -8], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
      />
    ))}
  </div>
);

/* ── Feature Card visual inserts ── */
const FeatureVisual = ({ type, accent }) => {
  if (type === "chart") return (
    <div className="mt-auto flex items-end gap-1.5 h-16 pt-4">
      {[40, 65, 50, 80, 55, 90, 70].map((h, j) => (
        <motion.div
          key={j}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.8, delay: j * 0.08, ease: "easeOut" }}
          style={{ flex: 1, background: `${accent}`, borderRadius: "4px 4px 0 0", opacity: 0.3 + (h / 200) }}
        />
      ))}
    </div>
  );
  if (type === "schedule") return (
    <div className="mt-auto space-y-2">
      {[{ zone: "Zone 04 – Sector B", status: "Active", active: true }, { zone: "Zone 02 – Sector A", status: "04:00 AM", active: false }].map((s, j) => (
        <div key={j} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", opacity: s.active ? 1 : 0.55 }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>{s.zone}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: s.active ? "#6bd8cb" : "#bec8d2", textTransform: "uppercase" }}>{s.status}</span>
        </div>
      ))}
    </div>
  );
  if (type === "mobile") return (
    <div className="mt-auto flex justify-center pt-2">
      <motion.span
        className="material-symbols-outlined"
        style={{ fontSize: 56, color: accent, opacity: 0.6 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >mobile_friendly</motion.span>
    </div>
  );
  if (type === "ai") return (
    <div className="mt-auto flex items-center gap-2 pt-3">
      <div style={{ flex: 1, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <motion.div style={{ height: "100%", background: accent, borderRadius: 4 }} animate={{ width: ["0%", "98%"] }} transition={{ duration: 2, delay: 0.5, ease: "easeOut" }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: accent }}>98%</span>
    </div>
  );
  if (type === "leak") return (
    <div className="mt-auto flex justify-center pt-2">
      <motion.div
        style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}
        animate={{ boxShadow: [`0 0 0px ${accent}`, `0 0 20px ${accent}55`, `0 0 0px ${accent}`] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="material-symbols-outlined" style={{ color: accent, fontSize: 22 }}>radar</span>
      </motion.div>
    </div>
  );
  return null;
};

/* ── Feature Slider ── */
const FeatureSlider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const trackRef = useRef(null);

  const goTo = (i) => setActiveIndex(Math.max(0, Math.min(features.length - 1, i)));

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -50) goTo(activeIndex + 1);
    else if (info.offset.x > 50) goTo(activeIndex - 1);
  };

  return (
    <section style={{ padding: "80px 0", position: "relative" }}>
      {/* Section header + toggle */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 100, background: "rgba(137,206,255,0.1)", border: "1px solid rgba(137,206,255,0.2)", marginBottom: 12 }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#89ceff", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#89ceff", textTransform: "uppercase", letterSpacing: "0.1em" }}>Platform Features</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, margin: 0, lineHeight: 1.2 }}
            >
              Unmatched Control
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ color: "#bec8d2", marginTop: 8, maxWidth: 480, lineHeight: 1.6 }}
            >
              From sensor nodes to citizen mobile apps, JalSetu creates a seamless ecosystem for water management.
            </motion.p>
          </div>

          {/* Toggle button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 12,
              background: isOpen ? "rgba(137,206,255,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${isOpen ? "rgba(137,206,255,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: isOpen ? "#89ceff" : "#bec8d2",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {isOpen ? "close" : "view_carousel"}
            </span>
            {isOpen ? "Close Features" : "Explore Features"}
          </motion.button>
        </div>

        {/* Collapsed state – just the tab pills */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
          >
            {features.map((f, i) => (
              <motion.button
                key={i}
                onClick={() => { setActiveIndex(i); setIsOpen(true); }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 16px", borderRadius: 100,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#dee3e9", fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: f.accent }}>{f.icon}</span>
                {f.title}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Expanded slider */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ maxWidth: 1200, margin: "24px auto 0", padding: "0 24px" }}>
              {/* Dot nav */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
                {features.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{
                      width: i === activeIndex ? 28 : 8, height: 8, borderRadius: 100,
                      background: i === activeIndex ? f.accent : "rgba(255,255,255,0.15)",
                      border: "none", cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
                <span style={{ marginLeft: "auto", fontSize: 12, color: "#bec8d2" }}>{activeIndex + 1} / {features.length}</span>
                <button onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 8px", cursor: "pointer", color: "#dee3e9", opacity: activeIndex === 0 ? 0.3 : 1 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
                </button>
                <button onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === features.length - 1} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 8px", cursor: "pointer", color: "#dee3e9", opacity: activeIndex === features.length - 1 ? 0.3 : 1 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
                </button>
              </div>

              {/* Draggable slide track */}
              <div style={{ overflow: "hidden", borderRadius: 20 }}>
                <motion.div
                  ref={trackRef}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  style={{ display: "flex", gap: 16, cursor: "grab" }}
                  animate={{ x: `-${activeIndex * (100 / features.length)}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 35 }}
                >
                  {features.map((f, i) => (
                    <motion.div
                      key={i}
                      style={{
                        minWidth: "100%",
                        background: "rgba(15,23,42,0.7)",
                        border: `1px solid ${i === activeIndex ? f.accent + "40" : "rgba(255,255,255,0.06)"}`,
                        borderRadius: 20,
                        padding: "32px 36px",
                        backdropFilter: "blur(16px)",
                        transition: "border-color 0.4s ease",
                        boxShadow: i === activeIndex ? `0 0 40px ${f.accent}18` : "none",
                      }}
                    >
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.accent}18`, border: `1px solid ${f.accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span className="material-symbols-outlined" style={{ color: f.accent, fontSize: 24 }}>{f.icon}</span>
                            </div>
                            <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{f.title}</h3>
                          </div>
                          <p style={{ color: "#bec8d2", lineHeight: 1.7, fontSize: 15, margin: 0 }}>{f.desc}</p>
                          <motion.div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 24, color: f.accent, fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                            whileHover={{ x: 4 }}>
                            Learn more <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                          </motion.div>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.05)", minHeight: 160 }}>
                          <FeatureVisual type={f.visual} accent={f.accent} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Keyboard hint */}
              <p style={{ textAlign: "center", marginTop: 16, color: "#bec8d2", fontSize: 12, opacity: 0.5 }}>
                Drag to navigate · or use the arrows
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ── Live stats strip ── */
const StatsStrip = () => {
  const stats = [
    { value: "40+", label: "Municipalities", icon: "location_city" },
    { value: "12M+", label: "Citizens Served", icon: "group" },
    { value: "98%", label: "AI Accuracy", icon: "psychology" },
    { value: "2.4k", label: "L/min Flow", icon: "water" },
    { value: "< 2m", label: "Leak Detection", icon: "radar" },
  ];

  return (
    <div style={{ background: "rgba(137,206,255,0.04)", borderTop: "1px solid rgba(137,206,255,0.1)", borderBottom: "1px solid rgba(137,206,255,0.1)", padding: "24px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0, justifyContent: "space-around", flexWrap: "wrap" }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            style={{ textAlign: "center", padding: "12px 20px" }}
          >
            <span className="material-symbols-outlined" style={{ color: "#89ceff", fontSize: 20, display: "block", marginBottom: 6, opacity: 0.7 }}>{s.icon}</span>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#89ceff", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#bec8d2", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ── Dashboard Mockup ── */
const DashboardMockup = () => (
  <section style={{ padding: "80px 0", background: "rgba(10,15,19,0.8)", overflow: "hidden", position: "relative" }}>
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 100, background: "rgba(137,206,255,0.1)", border: "1px solid rgba(137,206,255,0.2)", marginBottom: 16 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#89ceff", display: "inline-block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#89ceff", textTransform: "uppercase", letterSpacing: "0.1em" }}>Command Center</span>
        </div>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, marginBottom: 12 }}>The Command Center of Water Management</h2>
        <p style={{ color: "#bec8d2", maxWidth: 500, margin: "0 auto 48px" }}>Monitor, predict, and act — all from a single unified dashboard.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}
      >
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(14,165,233,0.12)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(107,216,203,0.08)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(137,206,255,0.15)", borderRadius: 20, padding: 3, backdropFilter: "blur(20px)", boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)" }}>
          {/* Header bar */}
          <div style={{ background: "rgba(37,43,47,0.9)", borderRadius: "17px 17px 0 0", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontWeight: 800, color: "#89ceff", fontSize: 16 }}>JalSetu Admin</span>
              <div style={{ display: "flex", gap: 12 }}>
                {["Dashboard", "Monitoring", "Analytics"].map((t, i) => (
                  <span key={t} style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? "#89ceff" : "#bec8d2", borderBottom: i === 0 ? "2px solid #89ceff" : "none", paddingBottom: 2 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#6bd8cb" }} />
              <span style={{ fontSize: 11, color: "#6bd8cb", fontWeight: 600 }}>LIVE</span>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(137,206,255,0.15)", border: "1px solid rgba(137,206,255,0.3)" }} />
            </div>
          </div>

          {/* Content grid */}
          <div style={{ padding: 20, display: "grid", gridTemplateColumns: "180px 1fr", gap: 16, background: "rgba(15,20,24,0.9)", borderRadius: "0 0 17px 17px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Reservoir Level", value: "84.2%", color: "#89ceff" },
                { label: "System Health", value: "Excellent", color: "#6bd8cb" },
                { label: "Total Flow Rate", value: "2.4k L/m", color: "#5de6ff" },
                { label: "Active Zones", value: "12 / 15", color: "#a78bfa" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}
                >
                  <p style={{ color: "#bec8d2", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>{item.label}</p>
                  <p style={{ color: item.color, fontSize: 18, fontWeight: 700, margin: 0 }}>{item.value}</p>
                </motion.div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, position: "relative", overflow: "hidden", height: 280 }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.04 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 200 }}>waves</span>
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h4 style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>Network Flow Analysis</h4>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["24h", "7d", "30d"].map((t, i) => (
                      <span key={t} style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: i === 0 ? "rgba(137,206,255,0.15)" : "transparent", color: i === 0 ? "#89ceff" : "#bec8d2" }}>{t}</span>
                    ))}
                  </div>
                </div>
                <svg viewBox="0 0 400 180" style={{ width: "100%", height: 180 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#89ceff" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#89ceff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,140 Q50,100 100,120 T200,80 T300,110 T400,50 L400,180 L0,180 Z" fill="url(#chartGrad)" />
                  <path d="M0,140 Q50,100 100,120 T200,80 T300,110 T400,50" fill="none" stroke="#89ceff" strokeWidth="2.5" strokeLinecap="round" />
                  {[
                    { cx: 100, cy: 120 }, { cx: 200, cy: 80 }, { cx: 300, cy: 110 }, { cx: 400, cy: 50 }
                  ].map((pt, i) => (
                    <motion.circle key={i} cx={pt.cx} cy={pt.cy} r="4" fill="#89ceff"
                      animate={{ r: [3, 5, 3], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trusted by */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ marginTop: 56 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#bec8d2", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 20 }}>Trusted by 40+ Municipalities</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", opacity: 0.45 }}>
          {["AquaCorp", "SmartCity Tech", "HydroGrid", "Unity Utilities", "ClearFlow"].map((name) => (
            <span key={name} style={{ fontWeight: 800, fontSize: 16, fontStyle: "italic", letterSpacing: "-0.02em" }}>{name}</span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ══════════════════════════════════════
   MAIN LANDING COMPONENT
══════════════════════════════════════ */
const Landing = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#dee3e9", fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden" }}>
      {/* ── Navigation ── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, width: "100%", zIndex: 50,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          background: scrolled ? "rgba(2,6,23,0.92)" : "rgba(2,6,23,0.6)",
          padding: scrolled ? "10px 0" : "16px 0",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <motion.span whileHover={{ scale: 1.03 }} style={{ fontSize: 22, fontWeight: 800, color: "#89ceff", letterSpacing: "-0.03em", cursor: "default" }}>
            JalSetu
          </motion.span>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {[
              { label: "Solutions", href: "#features" },
              { label: "Infrastructure", href: "#mockup" },
              { label: "Community", href: "#cta" },
            ].map((item) => (
              <a key={item.label} href={item.href} style={{ fontSize: 13, fontWeight: 600, color: "#bec8d2", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#dee3e9"}
                onMouseLeave={e => e.target.style.color = "#bec8d2"}>
                {item.label}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/dashboard" style={{ fontSize: 13, fontWeight: 600, color: "#bec8d2", textDecoration: "none" }}>Login</Link>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(137,206,255,0.3)" }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: "8px 20px", borderRadius: 10, background: "#0ea5e9", color: "#003751", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 100 }}>
        <WaveBackground />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 800, textAlign: "center", padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(137,206,255,0.1)", border: "1px solid rgba(137,206,255,0.2)", marginBottom: 28 }}
          >
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#6bd8cb", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6bd8cb", textTransform: "uppercase", letterSpacing: "0.12em" }}>Next-Gen Water Infrastructure</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.03em" }}
          >
            Bringing{" "}
            <span style={{ background: "linear-gradient(135deg, #89ceff 0%, #6bd8cb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              transparency,
            </span>
            {" "}efficiency, and intelligence to{" "}
            <span style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #5de6ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              water distribution
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 18, color: "#bec8d2", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7 }}
          >
            JalSetu empowers municipalities and utilities with real-time data, predictive maintenance, and community-driven insights for a sustainable water future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            {/* CITIZEN PORTAL → /dashboard */}
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(14,165,233,0.4)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "16px 36px", borderRadius: 14,
                  background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                  color: "#003751", fontWeight: 800, fontSize: 16,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 8px 30px rgba(14,165,233,0.25)",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person</span>
                Citizen Portal
              </motion.button>
            </Link>

            {/* DEPARTMENT PORTAL → /control-center */}
            <Link to="/control-center" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: "rgba(137,206,255,0.5)", background: "rgba(137,206,255,0.07)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "16px 36px", borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  color: "#dee3e9", fontWeight: 800, fontSize: 16,
                  border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "all 0.3s ease",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>admin_panel_settings</span>
                Department Portal
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginTop: 64, opacity: 0.4 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 32 }}>expand_more</span>
          </motion.div>
        </div>
      </section>

      {/* ── Live Stats ── */}
      <StatsStrip />

      {/* ── Feature Slider ── */}
      <div id="features">
        <FeatureSlider />
      </div>

      {/* ── Dashboard Mockup ── */}
      <div id="mockup">
        <DashboardMockup />
      </div>

      {/* ── CTA ── */}
      <section id="cta" style={{ padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(14,165,233,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: 600, margin: "0 auto", position: "relative", zIndex: 1 }}
        >
          <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Ready to transform your water infrastructure?
          </h2>
          <p style={{ color: "#bec8d2", fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
            Join the network of cities building a more transparent and efficient distribution system today.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(14,165,233,0.4)" }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: "16px 40px", borderRadius: 14, background: "linear-gradient(135deg, #0ea5e9, #38bdf8)", color: "#003751", fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer" }}
              >
                Get Started Now
              </motion.button>
            </Link>
            <Link to="/control-center" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: "16px 40px", borderRadius: 14, background: "transparent", color: "#dee3e9", fontWeight: 800, fontSize: 16, border: "1px solid rgba(137,206,255,0.25)", cursor: "pointer", transition: "all 0.3s" }}
              >
                Department Access
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "rgba(10,15,19,0.9)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", gap: 32, marginBottom: 40, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#89ceff", marginBottom: 12 }}>JalSetu</div>
              <p style={{ color: "#bec8d2", fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>The intelligent bridge between water availability and sustainable consumption. Securing every drop through data.</p>
            </div>
            <div>
              <h5 style={{ fontSize: 11, fontWeight: 700, color: "#dee3e9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Solutions</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {["Smart Grids", "Asset Tracking", "IoT Integration"].map(item => (
                  <li key={item}><a href="#" style={{ color: "#bec8d2", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color="#89ceff"} onMouseLeave={e => e.target.style.color="#bec8d2"}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 style={{ fontSize: 11, fontWeight: 700, color: "#dee3e9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Company</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {["About Us", "Our Vision", "Contact"].map(item => (
                  <li key={item}><a href="#" style={{ color: "#bec8d2", fontSize: 13, textDecoration: "none" }} onMouseEnter={e => e.target.style.color="#89ceff"} onMouseLeave={e => e.target.style.color="#bec8d2"}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 style={{ fontSize: 11, fontWeight: 700, color: "#dee3e9", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Stay Updated</h5>
              <p style={{ color: "#bec8d2", fontSize: 13, marginBottom: 16 }}>Get the latest insights on water tech.</p>
              <div style={{ display: "flex", gap: 6 }}>
                <input type="email" placeholder="Email address" style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: "#dee3e9", fontSize: 13, outline: "none" }} />
                <button style={{ background: "#0ea5e9", color: "#003751", fontWeight: 700, fontSize: 13, padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer" }}>Join</button>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "#bec8d2", fontSize: 12 }}>© 2024 JalSetu Technologies. Securing every drop.</p>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy", "Terms of Service", "Documentation"].map(item => (
                <a key={item} href="#" style={{ color: "#bec8d2", fontSize: 12, textDecoration: "none" }} onMouseEnter={e => e.target.style.color="#89ceff"} onMouseLeave={e => e.target.style.color="#bec8d2"}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
