// src/components/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // If not admin → send to login page
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  // If admin → show the admin pages (dashboard, products, etc.)
  return <Outlet />;
};

export default AdminRoute;