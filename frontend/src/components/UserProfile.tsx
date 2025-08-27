import { Avatar, Box, Card, CardContent, Typography, Chip } from "@mui/material";

type Props = {
  data: User;
};

/**
 * A component that displays user profile data.
 * 
 * @param {Props} props Component props.
 * @param {User} props.data User data to display.
 * 
 * @returns {JSX.Element} The component.
 */
function UserProfile(props: Props) {
  const { name, email, role, image, active, blocked } = props.data;
  
  return (
    <Box>
      <Card sx={{ maxWidth: 500, mx: "auto", mt: 4, mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box>
            <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
              <Avatar 
                alt={name || "User"} 
                sx={{ width: 100, height: 100 }}
              >
                {image ? (
                  <Box
                    component="img"
                    src={image}
                    sx={{ width: 100, height: 100, objectFit: "cover" }}
                    alt={name || "User"}
                  />
                ) : (
                  <Typography variant="h4">
                    {(name || "U").charAt(0).toUpperCase()}
                  </Typography>
                )}
              </Avatar>
              <Box flex={1} minWidth={200}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {name || "No Name"}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {email || "No Email"}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                  <Chip 
                    label={role || "USER"} 
                    color={role === "ADMIN" ? "primary" : "default"}
                    size="small"
                  />
                  {active !== undefined && (
                    <Chip 
                      label={active ? "Active" : "Inactive"} 
                      color={active ? "success" : "error"}
                      size="small"
                    />
                  )}
                  {blocked && (
                    <Chip 
                      label="Blocked" 
                      color="error"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UserProfile;
