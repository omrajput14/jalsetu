import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../services/AuthContext";
import { fetchWards } from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [wardId, setWardId] = useState("");
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Load wards list for signup selector
  useEffect(() => {
    const loadWards = async () => {
      try {
        const data = await fetchWards();
        setWards(data);
        if (data.length > 0) {
          setWardId(data[0].id.toString());
        }
      } catch (err) {
        console.error("Failed to fetch wards:", err);
      }
    };
    loadWards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!wardId) {
      setError("Please select a ward");
      setLoading(false);
      return;
    }

    try {
      await signup(email, password, name, phone, wardId, "citizen");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background flex items-center justify-center p-4 relative overflow-hidden hero-gradient">
      {/* Background Blur Nodes */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[480px] glass-card rounded-3xl p-8 shadow-2xl relative border border-outline-variant/20"
      >
        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-surface-container-high/50 rounded-2xl flex items-center justify-center border border-outline-variant/30 glow-primary mb-4">
            <span className="material-symbols-outlined text-4xl text-primary font-fill">app_registration</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-on-surface tracking-tight">Create Account</h1>
          <p className="text-on-surface-variant text-xs mt-1 uppercase tracking-widest font-semibold">Citizen Registration Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider px-1">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">person</span>
                <input
                  type="text"
                  required
                  placeholder="Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/25 transition-all text-on-surface"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider px-1">Phone Number</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">call</span>
                <input
                  type="tel"
                  required
                  placeholder="9988776655"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/25 transition-all text-on-surface"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider px-1">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
                <input
                  type="email"
                  required
                  placeholder="citizen@jalsetu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/25 transition-all text-on-surface"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider px-1">Local Ward (Sector Location)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">location_on</span>
              <select
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/25 transition-all text-on-surface appearance-none cursor-pointer"
              >
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.sector} - {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider px-1">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/25 transition-all text-on-surface"
              />
            </div>
          </div>

          {/* Validation Feedback */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-error-container/15 border border-error/20 rounded-xl text-xs text-error text-center font-semibold"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary/95 text-on-primary font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg glow-primary hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-on-primary border-t-transparent rounded-full" />
                Registering account...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">how_to_reg</span>
                Register Citizen Profile
              </>
            )}
          </button>
        </form>

        {/* Footnote */}
        <div className="text-center mt-6">
          <p className="text-xs text-on-surface-variant">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
