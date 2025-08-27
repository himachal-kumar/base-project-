import { Facebook } from "@mui/icons-material";
import { toast } from "react-toastify";
// @ts-ignore
import { IResolveParams, LoginSocialFacebook } from "reactjs-social-login";

import { IconButton } from "@mui/material";
import { useLoginByFacebookMutation } from "../services/api";

/**
 * FBLogin component
 *
 * Handles Facebook login logic
 *
 * @returns {JSX.Element}
 */
export default function FBLogin() {
  const [fbLogin] = useLoginByFacebookMutation();

  /**
   * Handles Facebook login resolve event
   * @param data - Resolve event data object
   * @param data.data.accessToken - Facebook access token
   * @throws {Error} - If an error occurs while logging in
   */
  const handleOnResolve = async (data: IResolveParams) => {
    try {
      await fbLogin({
        access_token: data.data.accessToken || "",
      }).unwrap();
    } catch (error: any) {
      toast.error(
        error?.message || error?.data?.message || "Something went wrong!"
      );
    }
  };

  return (
    <LoginSocialFacebook
      appId={import.meta.env.VITE_FB_APP_ID ?? ""}
      redirect_uri={window.location.href}
      onResolve={handleOnResolve}
      onReject={(e: any) => console.log(e, "onReject")}
    >
      <IconButton>
        <Facebook sx={{ height: 30, width: 30, fill: "#0866ff" }} />
      </IconButton>
    </LoginSocialFacebook>
  );
}
