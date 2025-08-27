import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  Container,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation, useGetAllUsersQuery, useAdminMeQuery } from "../../services/api";
import { useEffect, useState } from "react";

/**
 * The main admin dashboard page.
 *
 * This page is accessible only to users with the `ADMIN` role.
 * It displays comprehensive system overview, user statistics, and quick actions.
 *
 * @returns The JSX element representing the admin dashboard.
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [logoutUser] = useLogoutMutation();
  const { data: adminUser } = useAdminMeQuery();
  
  // Fetch users from API only if user is admin
  const { data: usersData, isLoading, error, refetch } = useGetAllUsersQuery(undefined, {
    skip: !adminUser?.data
  });
  
  // Debug logging
  console.log('Dashboard state:', { usersData, isLoading, error, adminUser });
  
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch users when component mounts and set up auto-refresh
  useEffect(() => {
    const fetchData = async () => {
      await refetch();
      setLastRefresh(new Date());
    };
    fetchData();
    
    // Set up auto-refresh every 30 seconds to show new users
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  // Update recent users when data changes
  useEffect(() => {
    console.log('Dashboard usersData:', usersData); // Debug log
    if (usersData?.data) {
      // Get the 5 most recent users
      const sortedUsers = [...usersData.data].slice(0, 5);
      setRecentUsers(sortedUsers);
      console.log('Recent users set:', sortedUsers); // Debug log
    }
  }, [usersData]);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleUserManagement = () => {
    navigate("/admin/users");
  };

  const handleSystemSettings = () => {
    navigate("/admin/settings");
  };

  // Calculate statistics
  const totalUsers = usersData?.data?.length || 0;
  const activeUsers = usersData?.data?.filter(user => user.active)?.length || 0;
  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  if (!adminUser?.data) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying admin access...
        </Typography>
      </Container>
    );
  }

  if (adminUser.data.role !== 'ADMIN') {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Access Denied: Admin role required
        </Alert>
        <Typography variant="body1" color="text.secondary">
          You need admin privileges to access this dashboard.
        </Typography>
      </Container>
      );
    }

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard data...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load dashboard data. Please try again.
        </Alert>
        <Alert severity="info" sx={{ mb: 2 }}>
          Error details: {JSON.stringify(error, null, 2)}
        </Alert>
        <Button onClick={() => refetch()} variant="contained">
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h3" component="h1" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's what's happening with your system today.
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite' }} />
              Live monitoring active
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </Typography>
            {adminUser?.data && (
              <Typography variant="caption" color="info.main">
                Logged in as: {adminUser.data.name || adminUser.data.email} ({adminUser.data.role})
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  refetch();
                  setLastRefresh(new Date());
                }}
              >
                Refresh
              </Button>
              {/* <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  console.log('Manual refetch triggered');
                  refetch();
                }}
                color="secondary"
              >
                Test API
              </Button> */}
              <IconButton color="primary" size="large">
                <NotificationsIcon />
              </IconButton>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                color="error"
              >
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h3" component="p" gutterBottom>
                {totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {recentUsers.length > 0 ? `+${recentUsers.length} recently` : "No recent activity"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Active Users
                </Typography>
              </Box>
              <Typography variant="h3" component="p" gutterBottom>
                {activeUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activePercentage}% of total users
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <SecurityIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Security Status
                </Typography>
              </Box>
              <Typography variant="h3" component="p" gutterBottom>
                <Chip label="Secure" color="success" size="small" />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All systems operational
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  <DashboardIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  System Uptime
                </Typography>
              </Box>
              <Typography variant="h3" component="p" gutterBottom>
                99.9%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PeopleIcon />}
                  onClick={handleUserManagement}
                  fullWidth
                  size="large"
                >
                  Manage Users
                </Button>
                {/* <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  onClick={handleSystemSettings}
                  fullWidth
                  size="large"
                >
                  System Settings
                </Button> */}
                {/* <Button
                  variant="outlined"
                  startIcon={<SecurityIcon />}
                  fullWidth
                  size="large"
                >
                  Security Audit
                </Button> */}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Recent Activity
                </Typography>
                <Chip 
                  label={`${recentUsers.length} users`} 
                  color="primary" 
                  size="small" 
                  variant="outlined"
                />
              </Box>
              {recentUsers.length > 0 ? (
                <List>
                  {recentUsers.map((user, index) => (
                    <Box key={user._id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "success.main" }}>
                            {user.name?.charAt(0) || user.email.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="New user registered"
                          secondary={`${user.name || 'Unknown'} (${user.email}) joined the system via ${user.provider}`}
                        />
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip 
                            label={user.provider} 
                            size="small" 
                            variant="outlined"
                            sx={{ mb: 0.5 }}
                          />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Recently
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < recentUsers.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {usersData?.data && usersData.data.length === 0 
                      ? "No users found in the system. Users will appear here when they sign up."
                      : "No recent user activity"
                    }
                  </Typography>
                  {usersData?.data && usersData.data.length === 0 && (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => refetch()}
                      sx={{ mt: 1 }}
                    >
                      Check for new users
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                System Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" color="success.main">
                      Database
                    </Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" color="success.main">
                      API Server
                    </Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" color="success.main">
                      Email Service
                    </Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" color="success.main">
                      File Storage
                    </Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Paper>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>
                  User Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: 'primary.light', color: 'white' }}>
                      <Typography variant="h4">{totalUsers}</Typography>
                      <Typography variant="body2">Total Users</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: 'success.light', color: 'white' }}>
                      <Typography variant="h4">{activeUsers}</Typography>
                      <Typography variant="body2">Active Users</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: 'info.light', color: 'white' }}>
                      <Typography variant="h4">{recentUsers.length}</Typography>
                      <Typography variant="body2">Recent Users</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
