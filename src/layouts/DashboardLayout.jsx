import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[240px] min-h-screen overflow-y-auto p-8 relative">
        {/* Atmospheric Background Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
