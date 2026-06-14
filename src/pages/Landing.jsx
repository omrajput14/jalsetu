import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    icon: "sensors",
    title: "Live Monitoring",
    desc: "Real-time pressure, flow, and quality sensors across your entire network. Identify leaks before they become crises.",
    colSpan: "md:col-span-8",
    hasChart: true,
  },
  {
    icon: "event_upcoming",
    title: "Smart Scheduling",
    desc: "Automated distribution schedules based on demand forecasts and current reservoir levels.",
    colSpan: "md:col-span-4",
    hasSchedule: true,
  },
  {
    icon: "public",
    title: "Citizen Transparency",
    desc: "Empower residents with mobile apps to check supply times, report leaks, and pay bills instantly.",
    colSpan: "md:col-span-4",
    hasIcon: true,
  },
  {
    icon: "leaderboard",
    title: "Predictive Analytics",
    desc: "Our AI models predict equipment failure and consumption spikes with 98% accuracy, reducing operational overhead.",
    colSpan: "md:col-span-8",
    hasLearnMore: true,
  },
];

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 border-b border-outline-variant/10 transition-all duration-300 ${
        scrolled ? "bg-surface/90 backdrop-blur-xl py-3 shadow-md" : "bg-surface/70 backdrop-blur-xl py-4"
      }`}>
        <div className="flex items-center justify-between px-5 max-w-[1440px] mx-auto">
          <span className="font-heading text-2xl font-bold text-primary">JalSetu</span>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-primary border-b-2 border-primary pb-1 text-sm" href="#">Solutions</a>
            <a className="text-on-surface-variant hover:text-on-surface transition-colors text-sm" href="#">Infrastructure</a>
            <a className="text-on-surface-variant hover:text-on-surface transition-colors text-sm" href="#">Community</a>
            <a className="text-on-surface-variant hover:text-on-surface transition-colors text-sm" href="#">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-on-surface-variant hover:text-on-surface text-xs font-semibold tracking-wider transition-colors">Login</button>
            <Link to="/dashboard">
              <button className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider hover:brightness-110 transition-all cursor-pointer">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 hero-gradient overflow-hidden">
        <div className="relative z-10 max-w-4xl text-center px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/50 border border-outline-variant/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="text-xs font-semibold text-tertiary uppercase tracking-widest">Next-Gen Water Infrastructure</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-5xl md:text-6xl font-bold text-on-surface leading-tight mb-8"
          >
            Bringing transparency, efficiency, and intelligence to{" "}
            <span className="text-primary-container">water distribution</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-12"
          >
            JalSetu empowers municipalities and utilities with real-time data, predictive maintenance, and community-driven insights for a sustainable water future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-12 py-4 bg-primary text-on-primary rounded-xl font-heading text-xl font-bold shadow-lg shadow-primary/20 cursor-pointer"
              >
                Citizen Portal
              </motion.button>
            </Link>
            <Link to="/control-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-12 py-4 glass-card rounded-xl font-heading text-xl font-bold border-outline-variant/30 hover:border-primary/50 cursor-pointer text-on-surface"
              >
                Department Portal
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-12 animate-bounce opacity-40">
          <span className="material-symbols-outlined text-5xl">expand_more</span>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-12 max-w-[1440px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-semibold mb-3">Unmatched Control</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">From sensor nodes to citizen mobile apps, JalSetu creates a seamless ecosystem for water management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${f.colSpan} glass-card rounded-2xl p-6 flex flex-col group overflow-hidden`}
            >
              <span className="material-symbols-outlined text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
                {f.icon}
              </span>
              <h3 className="font-heading text-xl font-medium mb-2">{f.title}</h3>
              <p className="text-on-surface-variant text-sm mb-6">{f.desc}</p>

              {f.hasChart && (
                <div className="mt-auto relative h-48 rounded-xl overflow-hidden bg-surface-container-lowest/50 border border-outline-variant/10">
                  <div className="absolute inset-0 flex items-end p-4 gap-2">
                    {[30, 45, 60, 55, 40].map((h, j) => (
                      <div
                        key={j}
                        className="flex-1 bg-primary/30 rounded-t-lg transition-all duration-700 group-hover:bg-primary/50"
                        style={{ height: `${h}%`, transitionDelay: `${j * 50}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {f.hasSchedule && (
                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high/50 border border-outline-variant/10">
                    <span className="text-xs font-semibold tracking-wider">Zone 04 - Sector B</span>
                    <span className="status-chip-active px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high/50 border border-outline-variant/10 opacity-60">
                    <span className="text-xs font-semibold tracking-wider">Zone 02 - Sector A</span>
                    <span className="text-on-surface-variant text-[10px] uppercase font-semibold">Scheduled 04:00</span>
                  </div>
                </div>
              )}

              {f.hasIcon && (
                <div className="mt-auto flex justify-center">
                  <span className="material-symbols-outlined text-6xl opacity-20 group-hover:opacity-100 group-hover:text-tertiary transition-all duration-500">
                    mobile_friendly
                  </span>
                </div>
              )}

              {f.hasLearnMore && (
                <button className="text-primary text-xs font-semibold flex items-center gap-1 mt-2">
                  Learn about our AI <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard Mockup */}
      <section className="py-12 bg-surface-container-lowest overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 text-center">
          <h2 className="font-heading text-3xl font-semibold mb-8">The Command Center of Water Management</h2>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full" />

            <div className="glass-card rounded-t-3xl p-2 shadow-2xl relative z-10">
              <div className="bg-surface-dim rounded-t-2xl overflow-hidden border border-outline-variant/20">
                {/* Mockup Header */}
                <div className="bg-surface-container-high px-6 py-4 flex items-center justify-between border-b border-outline-variant/10">
                  <div className="flex items-center gap-8">
                    <span className="font-bold text-primary font-heading text-xl">JalSetu Admin</span>
                    <div className="flex gap-4 text-on-surface-variant text-xs font-semibold tracking-wider">
                      <span className="text-primary">Dashboard</span>
                      <span>Monitoring</span>
                      <span>Analytics</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50" />
                  </div>
                </div>

                {/* Mockup Content */}
                <div className="p-6 grid grid-cols-12 gap-6 text-left">
                  <div className="col-span-3 space-y-4">
                    {[
                      { label: "Reservoir Level", value: "84.2%", color: "text-primary" },
                      { label: "System Health", value: "Excellent", color: "text-tertiary" },
                      { label: "Total Flow Rate", value: "2.4k L/m", color: "text-secondary" },
                    ].map((item, i) => (
                      <div key={i} className="bg-surface-container rounded-xl p-4 border border-outline-variant/10">
                        <p className="text-on-surface-variant text-[10px] uppercase font-semibold tracking-wider mb-1">{item.label}</p>
                        <p className={`font-heading text-xl font-medium ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-9 bg-surface-container rounded-2xl p-6 border border-outline-variant/10 relative overflow-hidden h-[400px]">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <span className="material-symbols-outlined text-[200px]">waves</span>
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-center mb-8">
                        <h4 className="font-heading text-xl font-medium">Network Flow Analysis</h4>
                        <div className="flex gap-2">
                          {["24h", "7d", "30d"].map((t, i) => (
                            <span key={t} className={`px-3 py-1 rounded-lg text-xs font-semibold ${i === 0 ? "bg-surface-bright" : "text-on-surface-variant"}`}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 border-b border-l border-outline-variant/20 relative">
                        <svg className="w-full h-full" viewBox="0 0 400 150">
                          <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" style={{ stopColor: "#89ceff", stopOpacity: 1 }} />
                              <stop offset="100%" style={{ stopColor: "#89ceff", stopOpacity: 0 }} />
                            </linearGradient>
                          </defs>
                          <path d="M0,120 Q50,80 100,100 T200,60 T300,90 T400,30 L400,150 L0,150 Z" fill="url(#grad)" opacity="0.1" />
                          <path d="M0,120 Q50,80 100,100 T200,60 T300,90 T400,30" fill="none" stroke="#89ceff" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted By */}
          <div className="mt-12">
            <p className="text-xs font-semibold text-on-surface-variant mb-6 uppercase tracking-widest">Trusted by 40+ Municipalities</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
              {["AquaCorp", "SmartCity Tech", "HydroGrid", "Unity Utilities"].map((name) => (
                <span key={name} className="font-heading text-xl font-bold italic">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-primary-container/5 -z-10" />
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="font-heading text-3xl font-semibold mb-6">Ready to transform your water infrastructure?</h2>
          <p className="text-on-surface-variant text-lg mb-8">Join the network of cities building a more transparent and efficient distribution system today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto px-12 py-4 bg-primary text-on-primary rounded-xl font-heading text-xl font-bold hover:brightness-110 transition-all cursor-pointer">
                Get Started Now
              </motion.button>
            </Link>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto px-12 py-4 border border-primary/30 rounded-xl font-heading text-xl font-bold hover:bg-primary/5 transition-all cursor-pointer">
              Contact Sales
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/10 pt-12 pb-8">
        <div className="max-w-[1440px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-4">
              <div className="font-heading text-xl font-bold text-primary mb-4">JalSetu</div>
              <p className="text-on-surface-variant text-sm max-w-xs">The intelligent bridge between water availability and sustainable consumption. Securing every drop through data.</p>
            </div>
            <div className="md:col-span-2">
              <h5 className="text-xs font-semibold text-on-surface mb-6 uppercase tracking-widest">Solutions</h5>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#">Smart Grids</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Asset Tracking</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">IoT Integration</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h5 className="text-xs font-semibold text-on-surface mb-6 uppercase tracking-widest">Company</h5>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Our Vision</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <h5 className="text-xs font-semibold text-on-surface mb-6 uppercase tracking-widest">Subscribe</h5>
              <p className="text-on-surface-variant text-sm mb-4">Get the latest insights on water tech.</p>
              <div className="flex gap-1">
                <input className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 flex-1 cyan-pulse text-on-surface text-sm" placeholder="Email Address" type="email" />
                <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm cursor-pointer">Join</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/10 gap-4">
            <p className="text-sm text-on-surface-variant">© 2024 JalSetu Technologies. Securing every drop.</p>
            <div className="flex gap-8 text-sm text-on-surface-variant">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-primary transition-colors" href="#">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
