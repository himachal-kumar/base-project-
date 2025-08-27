import { Route, Routes } from "react-router-dom";
import AuthanticatedLayout from "./layouts/Authanticated";
import BasicLayout from "./layouts/Basic";
import Admin from "./pages/admin";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ForgotPassword from "./pages/forgot-password";
import Home from "./pages/homepage";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Register from "./pages/register";
import ResetPassword from "./pages/reset-password";

/**
 * The main application component, which is a collection of routes.
 *
 * The authenticated routes are:
 * - `/`: The homepage.
 * - `/profile`: The user's profile page.
 * - `/admin`: The admin page (only accessible to admin users).
 *
 * The unauthenticated routes are:
 * - `/login`: The login page.
 * - `/signup`: The signup page.
 * - `/forgot-password`: The forgot password page.
 * - `/reset-password`: The reset password page.
 */
function App() {
  return (
    <Routes>
      <Route element={<AuthanticatedLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Route>
      <Route element={<BasicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
}

export default App;
