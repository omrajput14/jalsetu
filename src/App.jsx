import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";
import CitizenPortal from "./pages/CitizenPortal";
import CitizenAnalytics from "./pages/CitizenAnalytics";
import CitizenComplaints from "./pages/CitizenComplaints";
import CitizenSettings from "./pages/CitizenSettings";
import DepartmentPortal from "./pages/DepartmentPortal";
import DepartmentTanks from "./pages/DepartmentTanks";
import SchedulerPage from "./pages/SchedulerPage";
import DepartmentComplaints from "./pages/DepartmentComplaints";
import DepartmentAnalytics from "./pages/DepartmentAnalytics";
import DepartmentSettings from "./pages/DepartmentSettings";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./services/AuthContext";

// Route security guard component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If a citizen attempts to visit operator controls or vice versa
    return <Navigate to={user.role === "operator" ? "/control-center" : "/dashboard"} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard pages - secured with layout */}
            <Route element={<DashboardLayout />}>
              {/* Citizen Portal Pages */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={["citizen"]}>
                    <CitizenPortal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/citizen/complaints" 
                element={
                  <ProtectedRoute allowedRoles={["citizen"]}>
                    <CitizenComplaints />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/citizen/analytics" 
                element={
                  <ProtectedRoute allowedRoles={["citizen"]}>
                    <CitizenAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/citizen/settings" 
                element={
                  <ProtectedRoute allowedRoles={["citizen"]}>
                    <CitizenSettings />
                  </ProtectedRoute>
                } 
              />

              {/* Department Portal Pages */}
              <Route 
                path="/control-center" 
                element={
                  <ProtectedRoute allowedRoles={["operator"]}>
                    <DepartmentPortal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/department/tanks" 
                element={
                  <ProtectedRoute allowedRoles={["operator"]}>
                    <DepartmentTanks />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/department/scheduler" 
                element={
                  <ProtectedRoute allowedRoles={["operator"]}>
                    <SchedulerPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/department/complaints" 
                element={
                  <ProtectedRoute allowedRoles={["operator"]}>
                    <DepartmentComplaints />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/department/analytics" 
                element={
                  <ProtectedRoute allowedRoles={["operator"]}>
                    <DepartmentAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/department/settings" 
                element={
                  <ProtectedRoute allowedRoles={["operator"]}>
                    <DepartmentSettings />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Legacy redirects */}
            <Route path="/citizen" element={<Navigate to="/dashboard" replace />} />
            <Route path="/department" element={<Navigate to="/control-center" replace />} />
            <Route path="/tanks" element={<Navigate to="/department/tanks" replace />} />
            <Route path="/scheduler" element={<Navigate to="/department/scheduler" replace />} />
            <Route path="/complaints" element={<Navigate to="/department/complaints" replace />} />
            <Route path="/analytics" element={<Navigate to="/citizen/analytics" replace />} />
            <Route path="/settings" element={<Navigate to="/citizen/settings" replace />} />
            
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
}

export default App;
