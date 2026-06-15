import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { citizenData as localCitizenData, notifications } from "../data/mockData";
import { fetchWards, fetchPaymentKey, createPaymentOrder, verifyPayment } from "../services/api";
import posthog from "posthog-js";

const weeklyData = [
  { name: "Mon", usage: 180 },
  { name: "Tue", usage: 220 },
  { name: "Wed", usage: 200 },
  { name: "Thu", usage: 240 },
  { name: "Fri", usage: 210 },
  { name: "Sat", usage: 170 },
  { name: "Sun", usage: 160 },
];

const monthlyData = [
  { name: "W1", usage: 1400 },
  { name: "W2", usage: 1550 },
  { name: "W3", usage: 1300 },
  { name: "W4", usage: 1620 },
];

const CitizenPortal = () => {
  const [chartTab, setChartTab] = useState("week");
  const [countdown, setCountdown] = useState(9912); // 02:45:12
  const [ward, setWard] = useState(localCitizenData.ward);
  const [myNotifications, setMyNotifications] = useState(notifications);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const handlePayment = async () => {
    setPaymentLoading(true);
    setPaymentMessage("");
    try {
      const { key } = await fetchPaymentKey();
      
      const orderRes = await createPaymentOrder(412, "receipt_bill_062026");
      if (!orderRes.success) {
        throw new Error("Failed to create order");
      }
      
      const { order } = orderRes;
      
      posthog.capture('payment_initiated', {
        amount: 412.50,
        currency: 'INR',
        order_id: order.id,
        receipt: 'receipt_bill_062026'
      });
      
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "JalSetu Payments",
        description: "Water Bill Payment - June 2026",
        order_id: order.id,
        handler: async function (response) {
          try {
            setPaymentLoading(true);
            setPaymentMessage("Verifying payment...");
            
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            if (verifyRes.success) {
              setPaymentStatus("Paid");
              localStorage.setItem("jalsetu_bill_paid", "true");
              setPaymentMessage("Payment Successful! Thank you.");
              
              posthog.capture('payment_successful', {
                amount: 412.50,
                currency: 'INR',
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id
              });
              
              const newNotification = {
                id: Date.now(),
                type: "success",
                title: "Bill Payment Successful",
                message: `Your payment of ₹412 for June 2026 was processed successfully. Receipt: ${response.razorpay_payment_id}`,
                time: "Just now",
                read: false
              };
              setMyNotifications(prev => [newNotification, ...prev]);
            } else {
              setPaymentMessage("Verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            setPaymentMessage("Verification failed: " + err.message);
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: "Rajesh Kumar",
          email: "rajesh.kumar@example.com",
          contact: "9988776655",
        },
        theme: {
          color: "#0ea5e9",
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
            setPaymentMessage("Payment canceled by user.");
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (err) {
      console.error("Payment initialization error:", err);
      setPaymentMessage("Payment failed to initialize: " + err.message);
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadWard = async () => {
      try {
        const data = await fetchWards();
        const myWard = data.find((w) => w.id === 2);
        if (myWard) setWard(myWard);
      } catch (err) {
        console.error("Failed to load ward details from backend:", err);
      }
    };
    loadWard();
  }, []);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const level = ward.currentLevel;
  const tankColor = level >= 60 ? "#0ea5e9" : level >= 30 ? "#eab308" : "#ef4444";

  return (
    <div className="max-w-[1440px]">
      {/* Header */}
      <header className="mb-12 flex justify-between items-end">
        <div>
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Live Monitoring</p>
          <h1 className="font-heading text-5xl font-bold text-on-surface">Welcome back, Citizen</h1>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-6 py-4 rounded-xl flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="font-heading text-sm font-medium tracking-tight">System Status: Optimal</span>
          </div>
        </div>
      </header>

      {/* Dashboard Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Water Tank Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-12 min-h-[400px]"
        >
          <div className="flex-1">
            <h3 className="font-heading text-2xl font-medium text-on-surface mb-3">Local Ward Storage</h3>
            <p className="text-on-surface-variant mb-8 max-w-md">
              The main reservoir for {ward.sector} - {ward.name} is currently operating at {level >= 60 ? "high" : level >= 30 ? "moderate" : "critical"} capacity.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-semibold text-on-surface-variant tracking-wider mb-1">Current Volume</p>
                <p className="font-heading text-3xl font-semibold text-primary">{ward.currentVolume}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface-variant tracking-wider mb-1">Estimated Outflow</p>
                <p className="font-heading text-3xl font-semibold text-secondary">{ward.estimatedOutflow}</p>
              </div>
            </div>
          </div>

          {/* Animated Tank */}
          <div className="relative w-64 h-80 bg-surface-container-highest/30 rounded-t-[100px] rounded-b-xl border-4 border-outline-variant/20 overflow-hidden flex flex-col justify-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${level}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full relative animate-wave origin-bottom"
              style={{ background: `linear-gradient(180deg, ${tankColor}33 0%, ${tankColor}99 100%)` }}
            >
              <div className="absolute top-0 left-0 w-full h-4 bg-white/10 -translate-y-full blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading text-5xl font-bold text-white drop-shadow-lg">{level}%</span>
              </div>
            </motion.div>
            {/* Bubbles */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute bottom-4 left-1/4 w-2 h-2 bg-white rounded-full animate-bounce" />
              <div className="absolute bottom-12 right-1/3 w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "1s" }} />
            </div>
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-8 flex flex-col justify-center items-center text-center"
        >
          <span className="material-symbols-outlined text-primary text-5xl mb-4">timer</span>
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Next Supply Countdown</p>
          <div className="font-heading text-5xl font-bold text-on-surface tracking-tighter tabular-nums">
            {formatTime(countdown)}
          </div>
          <div className="mt-4 px-4 py-1.5 bg-tertiary/10 border border-tertiary/30 text-tertiary rounded-full text-xs font-semibold">
            Scheduled: Morning Session
          </div>
        </motion.div>

        {/* Consumption Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-8 h-[360px] flex flex-col"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-heading text-2xl font-medium text-on-surface">Consumption Analytics</h3>
            <div className="flex bg-surface-container-high rounded-full p-1 text-xs border border-outline-variant/10">
              <button 
                onClick={() => setChartTab("week")}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  chartTab === "week" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Week
              </button>
              <button 
                onClick={() => setChartTab("month")}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  chartTab === "month" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Month
              </button>
            </div>
          </div>
          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartTab === "week" ? weeklyData : monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="citizenChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3e4850" opacity={0.1} />
                <XAxis dataKey="name" stroke="#bec8d2" fontSize={11} tickLine={false} />
                <YAxis stroke="#bec8d2" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1418", borderColor: "#3e4850", borderRadius: "12px" }}
                  labelStyle={{ color: "#dee3e9", fontWeight: "bold" }}
                  formatter={(value) => [`${value} Liters`, "Usage"]}
                />
                <Area type="monotone" dataKey="usage" stroke="#22D3EE" strokeWidth={2.5} fillOpacity={1} fill="url(#citizenChartGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Pay Bill Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="material-symbols-outlined text-tertiary text-4xl mb-2">payments</span>
                <h3 className="font-heading text-2xl font-medium text-on-surface">Water Utility Bill</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                paymentStatus === "Paid" ? "bg-tertiary/20 text-tertiary border border-tertiary/30" : "bg-yellow-400/20 text-yellow-400 border border-yellow-500/30"
              }`}>
                {paymentStatus}
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                <span className="text-on-surface-variant text-sm">Billing Cycle</span>
                <span className="text-on-surface text-sm font-medium">June 2026</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                <span className="text-on-surface-variant text-sm">Due Date</span>
                <span className="text-on-surface text-sm font-medium">June 30, 2026</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-on-surface-variant text-sm">Amount Due</span>
                <span className="font-heading text-3xl font-bold text-primary">₹412.50</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {paymentMessage && (
              <p className={`text-xs text-center font-medium ${
                paymentMessage.includes("Successful") ? "text-tertiary animate-pulse" : "text-error"
              }`}>
                {paymentMessage}
              </p>
            )}

            {paymentStatus === "Unpaid" ? (
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full py-3 bg-primary hover:bg-primary/95 text-on-primary font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg glow-primary hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none cursor-pointer"
              >
                {paymentLoading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-on-primary border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">credit_card</span>
                    Pay Bill Now
                  </>
                )}
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-full py-3 bg-tertiary/15 border border-tertiary/30 text-tertiary font-semibold rounded-xl flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">verified_user</span>
                  Bill Paid Successfully
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Supply Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-12 lg:col-span-5 glass-card rounded-2xl p-8"
        >
          <h3 className="font-heading text-2xl font-medium text-on-surface mb-6">Supply Schedule</h3>
          <div className="space-y-4">
            {[
              { icon: "wb_sunny", label: "Morning", time: "06:00 AM - 09:00 AM", status: "Current", color: "text-secondary" },
              { icon: "wb_twilight", label: "Evening", time: "06:00 PM - 08:30 PM", status: "Upcoming", opacity: true },
              { icon: "nightlight", label: "Night Flow", time: "11:00 PM - 02:00 AM", status: "Maintenance", opacity: true },
            ].map((s, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border border-outline-variant/10 ${
                s.opacity ? "bg-surface-container-low opacity-60" : "bg-surface-container-highest/20"
              }`}>
                <div className="flex items-center gap-4">
                  <span className={`material-symbols-outlined ${s.color || ""}`}>{s.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">{s.label}</p>
                    <p className="text-sm text-on-surface-variant">{s.time}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold ${s.status === "Current" ? "text-tertiary" : "text-on-surface-variant"}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="col-span-12 lg:col-span-7 glass-card rounded-2xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-heading text-2xl font-medium text-on-surface">Recent Notifications</h3>
            <a className="text-primary text-xs font-semibold hover:underline" href="#">View All</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myNotifications.map((n) => {
              const iconMap = { warning: "warning", success: "check_circle", info: "info" };
              const colorMap = { warning: "bg-error-container/20 text-error", success: "bg-tertiary-container/20 text-tertiary", info: "bg-secondary-container/20 text-secondary" };
              return (
                <div key={n.id} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${colorMap[n.type]}`}>
                    <span className="material-symbols-outlined">{iconMap[n.type]}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface mb-1">{n.title}</p>
                    <p className="text-sm text-on-surface-variant line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-outline mt-2">{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-on-surface-variant text-sm">© 2024 JalSetu Technologies. Securing every drop.</p>
        <div className="flex gap-8">
          <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">Terms of Service</a>
        </div>
      </footer>
      {/* Floating Action Button */}
      <Link to="/citizen/complaints">
        <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-on-primary shadow-2xl flex items-center justify-center glow-primary hover:scale-110 transition-transform active:scale-95 z-50 cursor-pointer">
          <span className="material-symbols-outlined text-[32px]">report_problem</span>
          <div className="absolute -top-1 -right-1 px-2 bg-error text-white text-[10px] rounded-full border-2 border-background font-bold">ALERT</div>
        </button>
      </Link>
    </div>
  );
};

export default CitizenPortal;
