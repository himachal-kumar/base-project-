import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useForgotPasswordMutation } from "../services/api";

const validation = yup.object({
  email: yup.string().email("Email is invalid").required("Email is required"),
});

/**
 * Creates the styles for the Forgot Password component.
 *
 * The styles are for the card root, input, button, and link.
 *
 * @param {Theme} theme The Material-UI theme object.
 * @returns {CSSProperties} The styles for the Forgot Password component.
 */
const useStyle = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 400,
      flex: 1,
      mx: "auto",
    },
    input: {
      mt: 2,
    },
    button: {
      my: 2,
    },
    link: {
      color: theme.palette.primary.main,
    },
  });

type FormData = typeof validation.__outputType;

/**
 * The Forgot Password component.
 *
 * This component renders a form to reset a user's password.
 *
 * The form takes an email address as input and sends a password reset
 * email to the user if the email address is valid and associated with
 * an account.
 *
 * @returns The Forgot Password component.
 */
export default function ForgotPassword() {
  const theme = useTheme();
  const style = useStyle(theme);
  const [forgotPassword] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(validation),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await forgotPassword(data).unwrap();
      toast.success("Email sent successfully!");
      reset();
    } catch (error: any) {
      const validationError = error?.data?.data?.errors?.[0].msg;
      toast.error(
        validationError ?? error?.data?.message ?? "Something went wrong!"
      );
    }
  };

  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card variant="outlined" sx={style.root}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Typography my={1}>Forgot password</Typography>
            </Box>
            <TextField
              sx={style.input}
              fullWidth
              type="text"
              placeholder="Email"
              label="Email"
              {...register("email")}
              error={Boolean(errors.email?.message)}
              helperText={errors.email?.message}
            />
            <Button
              type="submit"
              sx={style.button}
              variant="contained"
              fullWidth
              disabled={!isValid}
            >
              Forgot password
            </Button>
            <Typography textAlign="right">
              <NavLink style={style.link as CSSProperties} to="/login">
                Sign in
              </NavLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
