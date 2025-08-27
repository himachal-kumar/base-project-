import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useLogoutMutation, useAdminLogoutMutation } from "../services/api";
import { useAppSelector } from "../store/store";

/**
 * A protected route that can be accessed by an authenticated user.
 * This route shows a top navigation bar with a profile and logout button.
 * The profile button navigates to the profile page, and the logout button
 * logs the user out and redirects to the login page.
 *
 * This route wraps the given page component with the navigation bar and
 * authentication check.
 *
 * @returns {JSX.Element} The protected route component.
 */
export default function Authanticated() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigation = useNavigate();
  const [logoutUser] = useLogoutMutation();
  const [adminLogoutUser] = useAdminLogoutMutation();


  /**
   * Handles the click event on the profile button by setting the anchor element
   * for the menu to the element that was clicked.
   *
   * @param {React.MouseEvent<HTMLElement>} event The event that triggered this function.
   */
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the menu and handles the selected route.
   *
   * If the route is "logout", the user is logged out and redirected to the login page.
   * If the route is "profile", the user is navigated to the profile page.
   * If no route is given, the menu is simply closed.
   * @param {string} [route] The route to navigate to, either "profile" or "logout".
   * @returns {() => void} A function that closes the menu and handles the route.
   */
  const handleClose = (route?: "profile" | "logout") => {
    return () => {
      if (route) {
        if (route == "logout") {
          if (user?.role === "ADMIN") {
            adminLogoutUser();
          } else {
            logoutUser();
          }
        } else {
          navigation("/" + route);
        }
      }
      setAnchorEl(null);
    };
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            disabled
          >
            <MenuIcon />
          </IconButton>
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            component={Link}
            to={user?.role === "ADMIN" ? "/admin" : "/"}
            sx={{ textDecoration: "none" }}
          >
            <Typography color="white" variant="h6" sx={{ flexGrow: 1 }}>
              {user?.role === "ADMIN" ? "Admin Dashboard" : "App Logo"}
            </Typography>
          </Box>
          {isAuthenticated && (
            <Box marginLeft="auto">
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose()}
              >
                <MenuItem onClick={handleClose("profile")}>Profile</MenuItem>
                <MenuItem onClick={handleClose("logout")}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
