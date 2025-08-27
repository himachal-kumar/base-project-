import { Box } from "@mui/material";
import ResetPassword from "../components/ResetPassword";

/**
 * The reset password page.
 *
 * This page is reached by a user when they click on the link in the reset password
 * email. The page will display a form where the user can enter their new password.
 *
 * The page will also extract the token and type from the URL query parameters.
 *
 * @returns A JSX element representing the reset password page.
 */
function Index() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("code");
  const type = params.get("type") as "reset-password" | "invite";

  return (
    <Box>
      <ResetPassword token={token!} type={type!} />
    </Box>
  );
}

export default Index;
