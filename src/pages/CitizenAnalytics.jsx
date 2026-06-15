import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const rawUsageData = [
  { day: "Mon", usage: 220, limit: 300 },
  { day: "Tue", usage: 180, limit: 300 },
  { day: "Wed", usage: 290, limit: 300 },
  { day: "Thu", usage: 240, limit: 300 },
  { day: "Fri", usage: 310, limit: 300 },
  { day: "Sat", usage: 190, limit: 300 },
  { day: "Sun", usage: 150, limit: 300 },
];

const categoryData = [
  { name: "Showers & Baths", value: 35, color: "#0ea5e9" },
  { name: "Gardening & Lawn", value: 25, color: "#2fd9f4" },
  { name: "Kitchen & Cooking", value: 20, color: "#6bd8cb" },
  { name: "Washing & Laundry", value: 15, color: "#38ac9f" },
  { name: "Leaks & Others", value: 5, color: "#ffb4ab" },
];

const CitizenAnalytics = () => {
  const [chartMode, setChartMode] = useState("liters");
  const [billPaid, setBillPaid] = useState(false);

  // Calculate mock cost based on usage (₹1.50 per liter)
  const chartData = rawUsageData.map((d) => ({
    ...d,
    cost: Math.round(d.usage * 1.5),
  }));

  return (
    <div className="max-w-[1440px] space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Usage Analysis</p>
          <h1 className="font-heading text-4xl font-bold text-on-surface">Consumption Analytics</h1>
        </div>
        <div className="glass-card px-6 py-4 rounded-xl flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary">analytics</span>
          <span className="font-heading text-sm font-medium tracking-tight">Billing Cycle: June 1 - June 30</span>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Total Consumed</p>
          <p className="font-heading text-3xl font-bold text-primary">6,840 Liters</p>
          <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-tertiary text-sm">trending_up</span>
            -8.4% from last month
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Average Daily Use</p>
          <p className="font-heading text-3xl font-bold text-secondary">228 Liters/day</p>
          <p className="text-xs text-on-surface-variant mt-2">Recommended: 250L max</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Est. Next Bill</p>
          <p className="font-heading text-3xl font-bold text-tertiary">{billPaid ? "₹0.00" : "₹412.50"}</p>
          <div className="flex items-center justify-between mt-2">
            <p className={`text-xs ${billPaid ? "text-tertiary" : "text-yellow-400"}`}>
              {billPaid ? "Paid (June Cycle)" : "Due by June 30"}
            </p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Purity Rating</p>
          <p className="font-heading text-3xl font-bold text-emerald-400">99.4%</p>
          <p className="text-xs text-on-surface-variant mt-2">Excellent (Grade A)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-xl font-medium text-on-surface">Weekly Distribution Trend</h3>
            <div className="flex bg-surface-container-high rounded-full p-1 text-xs border border-outline-variant/10">
              <button
                onClick={() => setChartMode("liters")}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  chartMode === "liters" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Liters
              </button>
              <button
                onClick={() => setChartMode("cost")}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  chartMode === "cost" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Cost
              </button>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="usageColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartMode === "liters" ? "#0ea5e9" : "#2fd9f4"} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={chartMode === "liters" ? "#0ea5e9" : "#2fd9f4"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3e4850" opacity={0.1} />
                <XAxis dataKey="day" stroke="#bec8d2" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#bec8d2" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(v) => chartMode === "liters" ? `${v}L` : `₹${v}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1418", borderColor: "#3e4850", borderRadius: "12px" }}
                  labelStyle={{ color: "#dee3e9", fontWeight: "bold" }}
                  formatter={(value) => [chartMode === "liters" ? `${value} Liters` : `₹${value}`, chartMode === "liters" ? "Usage" : "Cost"]}
                />
                <Area 
                  type="monotone" 
                  dataKey={chartMode === "liters" ? "usage" : "cost"} 
                  stroke={chartMode === "liters" ? "#0ea5e9" : "#2fd9f4"} 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#usageColor)" 
                  name={chartMode === "liters" ? "Usage" : "Cost"} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 h-[400px] flex flex-col">
          <h3 className="font-heading text-xl font-medium text-on-surface mb-6">Where your water goes</h3>
          <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
            {categoryData.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </span>
                  <span className="text-on-surface">{cat.value}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Neighbor Comparison & Savings Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-4xl text-tertiary">eco</span>
            <div>
              <h4 className="font-heading text-lg font-semibold text-on-surface">Community Rank: Eco-Leader</h4>
              <p className="text-sm text-on-surface-variant mt-1">
                Your household consumed <strong>12% less</strong> water than the North Sector Ward 12 average this week. You are in the top 15% of water savers in your community!
              </p>
              <div className="mt-4 flex gap-4 text-xs font-bold text-primary">
                <a href="#" className="hover:underline">View Community Leaderboard</a>
                <a href="#" className="hover:underline">Claim Eco-Badge</a>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-4xl text-secondary font-fill">tips_and_updates</span>
            <div>
              <h4 className="font-heading text-lg font-semibold text-on-surface">Personalized Conservation Tip</h4>
              <p className="text-sm text-on-surface-variant mt-1">
                Your highest consumption occurs on Friday afternoons (gardening). Shifting your lawn watering schedule to early morning (6:00 AM) will reduce evaporation losses by up to 20%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-outline-variant/10 flex justify-between items-center text-on-surface-variant text-sm">
        <p>© 2024 JalSetu Technologies. Securing every drop.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">FAQs</a>
          <a href="#" className="hover:underline">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default CitizenAnalytics;
