import { Outlet } from "react-router-dom";

/**
 * Main admin page that provides nested routing for admin features.
 * 
 * This page is accessible only to users with the `ADMIN` role.
 * It provides routing for:
 * - `/admin` - Admin Dashboard (default)
 * - `/admin/users` - User Management
 * 
 * @returns The Outlet component for nested admin routes.
 */
const AdminPage = () => {
  return <Outlet />;
};

export default AdminPage;
