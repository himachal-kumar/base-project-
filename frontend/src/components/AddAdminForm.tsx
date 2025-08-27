import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useCreateAdminUserMutation } from '../services/api';

interface AddAdminFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AddAdminForm: React.FC<AddAdminFormProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [createAdminUser, { isLoading, error }] = useCreateAdminUserMutation();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createAdminUser(formData).unwrap();
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      onSuccess();
      onClose();
    } catch (error) {
      // Error is handled by RTK Query
      console.error('Failed to create admin user:', error);
    }
  };

  /**
   * Handles input change of form fields and updates the state.
   * Also clears the error of the field if it exists.
   * @param {keyof FormData} field The field to update.
   * @returns {void}
   */
  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Closes the dialog and resets the form state.
   * If the form is submitting, it does nothing.
   * @returns {void}
   */
  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon color="primary" />
          <Typography variant="h6">Add New Admin User</Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to create admin user. Please try again.
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Enter admin's full name"
                disabled={isLoading}
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="Enter admin's email address"
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password || 'Must be at least 8 characters with uppercase, lowercase, and number'}
                placeholder="Enter password"
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                placeholder="Confirm password"
                disabled={isLoading}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="info.contrastText">
              <strong>Note:</strong> The new admin user will be created with full administrative privileges 
              and will be able to access all admin features immediately.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose} 
            disabled={isLoading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : <PersonAddIcon />}
            sx={{ minWidth: 120 }}
          >
            {isLoading ? 'Creating...' : 'Create Admin'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddAdminForm;
