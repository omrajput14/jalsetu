import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../services/AuthContext";

const Login = () => {
  const [role, setRole] = useState("citizen"); // 'citizen' or 'operator'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");
    // Seed default credentials for easier testing
    if (selectedRole === "citizen") {
      setEmail("citizen@jalsetu.in");
      setPassword("password123");
    } else {
      setEmail("operator@jalsetu.in");
      setPassword("password123");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loggedInUser = await login(email, password);
      // Redirect based on role
      if (loggedInUser.role === "operator") {
        navigate("/control-center");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background flex items-center justify-center p-4 relative overflow-hidden hero-gradient">
      {/* Abstract Background Blur Nodes */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] glass-card rounded-3xl p-8 shadow-2xl relative border border-outline-variant/20"
      >
        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-surface-container-high/50 rounded-2xl flex items-center justify-center border border-outline-variant/30 glow-primary mb-4">
            <span className="material-symbols-outlined text-4xl text-primary font-fill">water_drop</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-on-surface tracking-tight">JalSetu</h1>
          <p className="text-on-surface-variant text-xs mt-1 uppercase tracking-widest font-semibold">Smart Water Infrastructure</p>
        </div>

        {/* Tab Selectors for Role (Citizen vs Operator) */}
        <div className="flex bg-surface-container-high/60 rounded-xl p-1 mb-6 border border-outline-variant/10 relative">
          <button
            type="button"
            onClick={() => handleRoleChange("citizen")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all relative z-10 cursor-pointer ${
              role === "citizen" ? "text-on-primary bg-primary shadow-md" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Citizen Sign-In
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("operator")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all relative z-10 cursor-pointer ${
              role === "operator" ? "text-on-primary bg-primary shadow-md" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Staff Portal
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider px-1">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
              <input
                type="email"
                required
                placeholder={role === "citizen" ? "citizen@jalsetu.in" : "operator@jalsetu.in"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/25 transition-all text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Password</label>
              <a href="#" className="text-[10px] text-primary font-bold hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-surface-container border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/25 transition-all text-on-surface"
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
                Signing in...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">login</span>
                Sign In to Platform
              </>
            )}
          </button>
        </form>

        {/* Footnote */}
        {role === "citizen" && (
          <div className="text-center mt-6">
            <p className="text-xs text-on-surface-variant">
              New to JalSetu?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Create a Citizen Account
              </Link>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
