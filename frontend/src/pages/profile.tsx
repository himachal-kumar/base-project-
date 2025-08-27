import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import ChangePassword from "../components/ChangePassword";
import UserProfile from "../components/UserProfile";
import { useMeQuery } from "../services/api";
import { useAppSelector } from "../store/store";

/**
 * Profile page that displays the user's profile information and allows them to change their password.
 * The page will show a loading state while the data is being fetched, an error state if the data
 * cannot be fetched, and a profile not found state if the user's profile information cannot be
 * retrieved.
 *
 * The page will also provide a link to retry the fetching of the profile information if the data
 * cannot be fetched.
 *
 * @returns {JSX.Element} The profile page component.
 */
const Profile = () => {
  const { isAuthenticated, user: authUser } = useAppSelector((state) => state.auth);
  const { data, isLoading, error, refetch } = useMeQuery(undefined, { 
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true
  });

  // Show loading state
  if (isLoading) {
    return (
      <Box
        width="100%"
        minHeight="50vh"
        padding={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box
        width="100%"
        minHeight="50vh"
        padding={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
          Failed to load profile data. Please try again.
        </Alert>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {/* {error?.data?.message || "Something went wrong"} */}
        </Typography>
        <Box>
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => refetch()}
          >
            Click here to retry
          </Typography>
        </Box>
      </Box>
    );
  }

  // Show profile not found
  if (!data?.data) {
    return (
      <Box
        width="100%"
        minHeight="50vh"
        padding={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Alert severity="warning" sx={{ mb: 2, maxWidth: 500 }}>
          Profile not found!
        </Alert>
        <Typography variant="body1" color="text.secondary">
          Unable to retrieve your profile information.
        </Typography>
      </Box>
    );
  }

  // Show profile data
  return (
    <Box sx={{ py: 3 }}>
      <UserProfile data={data.data} />
      <ChangePassword user={data.data} />
    </Box>
  );
};

export default Profile;
