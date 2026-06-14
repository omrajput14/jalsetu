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

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Landing - standalone, no sidebar */}
          <Route path="/" element={<Landing />} />

          {/* Dashboard pages - with sidebar */}
          <Route element={<DashboardLayout />}>
            {/* Citizen Portal Pages */}
            <Route path="/dashboard" element={<CitizenPortal />} />
            <Route path="/citizen/complaints" element={<CitizenComplaints />} />
            <Route path="/citizen/analytics" element={<CitizenAnalytics />} />
            <Route path="/citizen/settings" element={<CitizenSettings />} />

            {/* Department Portal Pages */}
            <Route path="/control-center" element={<DepartmentPortal />} />
            <Route path="/department/tanks" element={<DepartmentTanks />} />
            <Route path="/department/scheduler" element={<SchedulerPage />} />
            <Route path="/department/complaints" element={<DepartmentComplaints />} />
            <Route path="/department/analytics" element={<DepartmentAnalytics />} />
            <Route path="/department/settings" element={<DepartmentSettings />} />
          </Route>

          {/* Legacy redirects */}
          <Route path="/citizen" element={<Navigate to="/dashboard" replace />} />
          <Route path="/department" element={<Navigate to="/control-center" replace />} />
          <Route path="/tanks" element={<Navigate to="/department/tanks" replace />} />
          <Route path="/scheduler" element={<Navigate to="/department/scheduler" replace />} />
          <Route path="/complaints" element={<Navigate to="/department/complaints" replace />} />
          <Route path="/analytics" element={<Navigate to="/citizen/analytics" replace />} />
          <Route path="/settings" element={<Navigate to="/citizen/settings" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
