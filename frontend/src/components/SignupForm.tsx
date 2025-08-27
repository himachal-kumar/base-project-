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
  Container,
  Divider,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useRegisterMutation } from "../services/api";
import PasswordInput from "./PasswordInput";

const validation = yup.object({
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Minimumn 5 chars are required")
    .max(16, "Miximumn 16 chars allowed"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Comfirm password is required"),
  name: yup.string().required("Name is required"),
});

const useStyle = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 450,
      width: '100%',
      mx: "auto",
      position: 'relative',
      zIndex: 1,
    },
    input: {
      mt: 3,
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
      },
    },
    button: {
      mt: 4,
      mb: 3,
      height: 56,
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontWeight: 600,
      '&:hover': {
        color: theme.palette.primary.dark,
      },
    },
    floatingShapes: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: -1,
    },
    shape: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      animation: 'float 6s ease-in-out infinite',
    },
    shape1: {
      width: 80,
      height: 80,
      top: '10%',
      left: '10%',
      animationDelay: '0s',
    },
    shape2: {
      width: 120,
      height: 120,
      top: '20%',
      right: '10%',
      animationDelay: '2s',
    },
    shape3: {
      width: 60,
      height: 60,
      bottom: '20%',
      left: '20%',
      animationDelay: '4s',
    },
    divider: {
      my: 3,
      '&::before, &::after': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
    },
    dividerText: {
      color: 'rgba(255, 255, 255, 0.8)',
      px: 2,
    },
  });

type FormData = typeof validation.__outputType;

  /**
   * Page for registering a new user.
   *
   * Returns a SignupForm component.
   * 
   * The SignupForm component renders a form to collect user information
   * and create a new user in the database.
   * 
   * The form takes a full name, email address, password, and confirm password
   * as input and validates the input using yup.
   * 
   * If the input is valid, the form data is submitted to the server
   * and a success message is displayed to the user if the response
   * is successful.
   * 
   * If the response is not successful, an error message is displayed to the user.
   */
export default function SignupForm() {
  const theme = useTheme();
  const style = useStyle(theme);
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(validation),
  });

  /**
   * Submits the signup form data to the server.
   * 
   * If the response is successful, the user is redirected to the home page and
   * a success message is displayed to the user.
   * 
   * If the response is not successful, an error message is displayed to the user.
   * 
   * @param data The signup form data.
   */
  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data).unwrap();
      toast.success("User register successfully!");
      navigate("/");
    } catch (error: any) {
      const validationError = error?.data?.data?.errors?.[0].msg;
      toast.error(
        validationError ?? error?.data?.message ?? "Something went wrong!"
      );
    }
  };

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Floating shapes */}
      <Box sx={style.floatingShapes}>
        <Box sx={{ ...style.shape, ...style.shape1 }} />
        <Box sx={{ ...style.shape, ...style.shape2 }} />
        <Box sx={{ ...style.shape, ...style.shape3 }} />
      </Box>

      <Container maxWidth="sm">
        <Card sx={style.root}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Box textAlign="center" mb={4}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  Create Account
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '1.1rem',
                  }}
                >
                  Join us and start your journey today
                </Typography>
              </Box>

              <TextField
                sx={style.input}
                fullWidth
                type="text"
                placeholder="Enter your full name"
                label="Full Name"
                {...register("name")}
                error={Boolean(errors.name?.message)}
                helperText={errors.name?.message}
                variant="outlined"
              />

              <TextField
                sx={style.input}
                fullWidth
                type="text"
                placeholder="Enter your email"
                label="Email Address"
                {...register("email")}
                error={Boolean(errors.email?.message)}
                helperText={errors.email?.message}
                variant="outlined"
              />

              <PasswordInput
                sx={style.input}
                fullWidth
                type="password"
                placeholder="Create a password"
                label="Password"
                error={Boolean(errors.password?.message)}
                helperText={errors.password?.message}
                {...register("password")}
                variant="outlined"
              />

              <PasswordInput
                sx={style.input}
                fullWidth
                type="password"
                placeholder="Confirm your password"
                label="Confirm Password"
                error={Boolean(errors.confirmPassword?.message)}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword")}
                variant="outlined"
              />

              <Button
                type="submit"
                sx={style.button}
                variant="contained"
                fullWidth
                disabled={!isValid}
                size="large"
              >
                Create Account
              </Button>

              <Divider sx={style.divider}>
                <Typography variant="body2" sx={style.dividerText}>
                  Already have an account?
                </Typography>
              </Divider>

              <Box textAlign="center">
                <Typography variant="body2">
                  <NavLink style={style.link as CSSProperties} to="/login">
                    Sign in to your account
                  </NavLink>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(120deg); }
            66% { transform: translateY(-10px) rotate(240deg); }
          }
        `}
      </style>
    </Box>
  );
}
