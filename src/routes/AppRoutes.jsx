import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import OAuthSuccess from "../pages/OAuthSuccess";
import MainLayout from "../components/MainLayout";

// ✅ ADD THIS
import HistoryPage from "../pages/HistoryPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* App Layout (Navbar always visible) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ✅ ADD HISTORY ROUTE */}
          <Route path="/history" element={<HistoryPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;