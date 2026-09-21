import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ExploreProjects from "./pages/ExploreProjects";
import ProjectDetail from "./pages/ProjectDetail";
import SupporterDashboard from "./pages/SupporterDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateProject from "./pages/CreateProject";
import ImpactPortfolio from "./pages/ImpactPortfolio";
import MapPage from "./pages/MapPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="text-6xl font-bold text-[#14432B] mb-4">404</div>
        <h1 className="text-2xl font-bold text-[#1E2A26] mb-2">Page not found</h1>
        <p className="text-[#6B7280] mb-6">The page you're looking for doesn't exist.</p>
        <a href="/" className="px-6 py-3 rounded-2xl bg-[#14432B] text-white font-semibold text-sm hover:bg-[#1a5436] transition-colors">
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<ExploreProjects />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/dashboard/supporter" element={<SupporterDashboard />} />
        <Route path="/dashboard/owner" element={<OwnerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/create" element={<CreateProject />} />
        <Route path="/impact" element={<ImpactPortfolio />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
