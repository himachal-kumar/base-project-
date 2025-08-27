import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Checkbox,
  ButtonGroup,
  Grid,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  People as PeopleIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserByAdminMutation } from "../../services/api";
import AddAdminForm from "../../components/AddAdminForm";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  active?: boolean;
  blocked?: boolean;
  provider: string;
  image?: string;
  updatedAt?: string;
  createdAt?: string;
}

/**
 * User Management page for administrators.
 * 
 * Allows admins to view, search, edit, and manage all users in the system.
 * 
 * @returns The JSX element representing the user management page.
 */
const UserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    role: "USER" | "ADMIN";
    active: boolean;
  }>({
    name: "",
    role: "USER",
    active: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  // Fetch users from API
  const { data: usersData, isLoading, error, refetch } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserByAdmin] = useUpdateUserByAdminMutation();

  // Filter users based on search and role
  const filteredUsers = usersData?.data?.filter((user) => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  }) || [];

  // Debug logging
  console.log('UserManagement - usersData:', usersData);
  console.log('UserManagement - filteredUsers:', filteredUsers);
  console.log('UserManagement - error:', error);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || "",
      role: user.role,
      active: user.active || false,
    });
    setEditDialogOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete._id).unwrap();
      setSnackbar({
        open: true,
        message: "User deleted successfully",
        severity: "success",
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      // Refresh the user list
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete user. Please try again.",
        severity: "error",
      });
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allUserIds = filteredUsers.map(user => user._id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    
    // For bulk delete, we'll delete users one by one
    const deletePromises = selectedUsers.map(userId => deleteUser(userId));
    
    Promise.all(deletePromises)
      .then(() => {
        setSnackbar({
          open: true,
          message: `${selectedUsers.length} users deleted successfully`,
          severity: "success",
        });
        setSelectedUsers([]);
        refetch();
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Some users could not be deleted. Please try again.",
          severity: "error",
        });
      });
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUserByAdmin({
        id: selectedUser._id,
        name: editFormData.name,
        role: editFormData.role,
        active: editFormData.active,
      }).unwrap();
      setSnackbar({
        open: true,
        message: "User updated successfully",
        severity: "success",
      });
      setEditDialogOpen(false);
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update user. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getRoleColor = (role: string) => {
    return role === "ADMIN" ? "error" : "primary";
  };

  const getStatusColor = (active: boolean, blocked: boolean) => {
    if (blocked) return "error";
    return active ? "success" : "warning";
  };

  const getStatusLabel = (active: boolean, blocked: boolean) => {
    if (blocked) return "Blocked";
    return active ? "Active" : "Inactive";
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return "G";
      case "facebook":
        return "F";
      case "apple":
        return "A";
      case "linkedin":
        return "L";
      default:
        return "M";
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading users...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load users. Please try again.
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

  // Show message if no users found
  if (!usersData?.data || usersData.data.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Users Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            There are no users in the system yet. Users will appear here when they sign up.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={() => refetch()}
              startIcon={<AddIcon />}
            >
              Check for New Users
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/admin')}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={() => navigate("/admin")}>
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h3" component="h1" gutterBottom>
                  User Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage all users in the system
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {usersData?.data ? `${usersData.data.length} total users` : 'Loading users...'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Chip 
                    label={`Total: ${usersData?.data?.length || 0}`} 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                  />
                  <Chip 
                    label={`Active: ${usersData?.data?.filter(u => u.active)?.length || 0}`} 
                    color="success" 
                    variant="outlined" 
                    size="small"
                  />
                  <Chip 
                    label={`Admins: ${usersData?.data?.filter(u => u.role === 'ADMIN')?.length || 0}`} 
                    color="error" 
                    variant="outlined" 
                    size="small"
                  />
                  <Chip 
                    label={`Users: ${usersData?.data?.filter(u => u.role === 'USER')?.length || 0}`} 
                    color="info" 
                    variant="outlined" 
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setAddAdminDialogOpen(true)}
            >
              Add Admin
            </Button>
          </Grid>
        </Grid>
      </Box>

    

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedRole}
                  label="Role"
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={10} md={1}>
              <Typography variant="body2" color="text.secondary">
                {filteredUsers.length} users found
              </Typography>
            </Grid>
            <Grid item xs={9} md={1}>
              <Button
                variant="outlined"
                onClick={() => {
                  refetch();
                }}
                size="small"
              >
                Refresh
              </Button>
            </Grid>
          
            {/* <Grid item xs={10} md={1}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </Typography>
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card sx={{ mb: 2, bgcolor: 'warning.light' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="text.primary">
                {selectedUsers.length} user(s) selected
              </Typography>
              <ButtonGroup>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                >
                  Delete Selected ({selectedUsers.length})
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedUsers([])}
                >
                  Clear Selection
                </Button>
              </ButtonGroup>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        disabled={user.role === "ADMIN"}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar src={user.image}>
                          {user.name?.charAt(0) || user.email.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {user.name || 'Unknown'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(user.active || false, user.blocked || false)}
                        color={getStatusColor(user.active || false, user.blocked || false)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.provider}
                        variant="outlined"
                        size="small"
                        icon={<Avatar sx={{ width: 16, height: 16, fontSize: '0.75rem' }}>{getProviderIcon(user.provider)}</Avatar>}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {/* {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} */}
                        N/A
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleViewUser(user)}
                            title="View user details"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user)}
                            disabled={user.role === "ADMIN"}
                            title={user.role === "ADMIN" ? "Cannot delete admin users" : "Delete user"}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    defaultValue={selectedUser.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={selectedUser.email}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={editFormData.role}
                      label="Role"
                      onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value as "USER" | "ADMIN" }))}
                    >
                      <MenuItem value="USER">User</MenuItem>
                      <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editFormData.active ? "active" : "inactive"}
                      label="Status"
                      onChange={(e) => setEditFormData(prev => ({ ...prev, active: e.target.value === "active" }))}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar src={selectedUser.image} sx={{ width: 64, height: 64 }}>
                      {selectedUser.name?.charAt(0) || selectedUser.email.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {selectedUser.name || 'Unknown'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedUser.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                  <Chip 
                    label={selectedUser.role} 
                    color={getRoleColor(selectedUser.role)} 
                    size="small" 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={getStatusLabel(selectedUser.active || false, selectedUser.blocked || false)} 
                    color={getStatusColor(selectedUser.active || false, selectedUser.blocked || false)} 
                    size="small" 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Provider</Typography>
                  <Chip 
                    label={selectedUser.provider} 
                    variant="outlined" 
                    size="small" 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">User ID</Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {selectedUser._id}
                  </Typography>
                </Grid>
                {selectedUser.createdAt && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                    <Typography variant="body2">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
                {selectedUser.updatedAt && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                    <Typography variant="body2">
                      {new Date(selectedUser.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button 
            onClick={() => {
              setViewDialogOpen(false);
              handleEditUser(selectedUser!);
            }} 
            variant="contained"
          >
            Edit User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>
          Confirm Delete User
        </DialogTitle>
        <DialogContent>
          {userToDelete && (
            <Box sx={{ pt: 2 }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                This action cannot be undone. The user will be permanently removed from the system.
              </Alert>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to delete this user?
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {userToDelete.name || 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userToDelete.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {userToDelete.role} | Provider: {userToDelete.provider}
                </Typography>
                {userToDelete.createdAt && (
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(userToDelete.createdAt).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteUser} 
            variant="contained" 
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Add Admin Form Dialog */}
      <AddAdminForm
        open={addAdminDialogOpen}
        onClose={() => setAddAdminDialogOpen(false)}
        onSuccess={() => {
          setSnackbar({
            open: true,
            message: "Admin user created successfully",
            severity: "success",
          });
          refetch();
        }}
      />
    </Container>
  );
};

export default UserManagement;

