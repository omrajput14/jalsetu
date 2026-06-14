import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { supplyTrends } from "../data/mockData";

// Format liters to readable text (e.g. 2.4M L)
const formatLiters = (val) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M L`;
  return `${(val / 1000).toFixed(0)}k L`;
};

const DepartmentAnalytics = () => {
  return (
    <div className="max-w-[1440px] space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Network Diagnostics</p>
          <h1 className="font-heading text-4xl font-bold text-on-surface">Municipal Water Analytics</h1>
        </div>
        <div className="glass-card px-6 py-4 rounded-xl flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">leaderboard</span>
          <span className="font-heading text-sm font-medium tracking-tight">Active Nodes: 124 Sensors</span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Avg Daily Flow</p>
          <p className="font-heading text-3xl font-bold text-primary">2.45M Liters</p>
          <p className="text-xs text-on-surface-variant mt-2">Maximum peak: 2.80M L/day</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Unaccounted Water (Leaks)</p>
          <p className="font-heading text-3xl font-bold text-error">4.6%</p>
          <p className="text-xs text-on-surface-variant mt-2">Industry standard: &lt; 5.0%</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Total Wastage Volume</p>
          <p className="font-heading text-3xl font-bold text-secondary">118k Liters</p>
          <p className="text-xs text-on-surface-variant mt-2">Reduced by 12% vs last week</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Predictive Demand Spike</p>
          <p className="font-heading text-3xl font-bold text-tertiary">14:00 - 16:30</p>
          <p className="text-xs text-tertiary mt-2">Due to Ward 12 afternoon schedule</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Flow Analysis Chart */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-xl font-medium text-on-surface">Weekly Supply vs. Consumption</h3>
            <div className="flex bg-surface-container-high rounded-full p-1 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-semibold">Weekly</span>
              <span className="px-3 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">Monthly</span>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={supplyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="suppliedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="consumedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2fd9f4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2fd9f4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3e4850" opacity={0.1} />
                <XAxis dataKey="day" stroke="#bec8d2" fontSize={11} tickLine={false} />
                <YAxis stroke="#bec8d2" fontSize={11} tickLine={false} tickFormatter={formatLiters} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1418", borderColor: "#3e4850", borderRadius: "12px" }}
                  labelStyle={{ color: "#dee3e9", fontWeight: "bold" }}
                  formatter={(val) => [formatLiters(val), ""]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="supplied" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#suppliedColor)" name="Water Supplied" />
                <Area type="monotone" dataKey="consumed" stroke="#2fd9f4" strokeWidth={2} fillOpacity={1} fill="url(#consumedColor)" name="Water Consumed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wastage Bar Chart */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 h-[400px] flex flex-col">
          <h3 className="font-heading text-xl font-medium text-on-surface mb-6">Wastage Volume Trend</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3e4850" opacity={0.05} />
                <XAxis dataKey="day" stroke="#bec8d2" fontSize={11} tickLine={false} />
                <YAxis stroke="#bec8d2" fontSize={11} tickLine={false} tickFormatter={formatLiters} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1418", borderColor: "#3e4850", borderRadius: "12px" }}
                  formatter={(val) => [formatLiters(val), "Wastage"]}
                />
                <Bar dataKey="wastage" fill="#ffb4ab" radius={[4, 4, 0, 0]} name="Wastage Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Intelligence Insights */}
      <div className="glass-card rounded-2xl p-6">
        <h4 className="font-heading text-lg font-semibold text-on-surface mb-4">Hydraulic Intelligence System Diagnostics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-on-surface-variant">
          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <h5 className="font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">warning</span> Leak Detection
            </h5>
            <p className="leading-relaxed">Minor flow velocity difference observed between Node B-3 and Node C-2. Estimated leak size: 8 L/min. Maintenance crew notified for survey.</p>
          </div>
          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <h5 className="font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">trending_up</span> Pressure Spike Mitigation
            </h5>
            <p className="leading-relaxed">Mitigated potential 5.4 bar pressure spike on Wednesday morning by automated release valves opening in Sector B bypass routing.</p>
          </div>
          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <h5 className="font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">check_circle</span> Quality Control
            </h5>
            <p className="leading-relaxed">Purity sensors at all 6 municipal tanks show safe chlorine levels and pH ranges (7.2 - 7.6) with zero pathogen alerts.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-outline-variant/10 flex justify-between items-center text-on-surface-variant text-sm">
        <p>© 2024 JalSetu Technologies. Securing every drop.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Export Report</a>
          <a href="#" className="hover:underline">Documentation</a>
        </div>
      </footer>
    </div>
  );
};

export default DepartmentAnalytics;
