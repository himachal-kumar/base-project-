import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/store";

/**
 * If the user is authenticated, redirect to the root route ('/').
 * Otherwise, just render the Outlet (i.e. the route that was matched).
 */
function Basic() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default Basic;
