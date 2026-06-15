import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_URL || "";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve user info using token on mount
  useEffect(() => {
    const token = localStorage.getItem("jalsetu_token");
    if (!token) {
      setLoading(false);
      return;
    }

    const loadMe = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem("jalsetu_token");
        }
      } catch (err) {
        console.error("Failed to load user session:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || "Failed to log in");
    }

    localStorage.setItem("jalsetu_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (email, password, name, phone, wardId, role = "citizen") => {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, phone, ward_id: parseInt(wardId), role }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || "Failed to sign up");
    }

    localStorage.setItem("jalsetu_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("jalsetu_token");
    setUser(null);
  };

  // Helper fetch function that appends auth token
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("jalsetu_token");
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    // Prefix URL with API_BASE
    const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;
    return fetch(fullUrl, {
      ...options,
      headers,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
