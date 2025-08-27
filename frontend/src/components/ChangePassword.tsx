import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Theme, useTheme, Typography, Card, CardContent } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { api, useChangePasswordMutation, useAdminChangePasswordMutation } from "../services/api";
import { useAppDispatch } from "../store/store";
import PasswordInput from "./PasswordInput";

const validation = yup.object({
  currentPassword: yup.string().nullable(),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Minimum 5 characters are required")
    .max(16, "Maximum 16 characters allowed"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

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

type Props = {
  user: User;
};

export default function ChangePassword(props: Props) {
  const theme = useTheme();
  const style = useStyle(theme);
  const dispatch = useAppDispatch();
  const { provider, role } = props.user;
  
  // Use admin-specific endpoint if user is admin, otherwise use regular endpoint
  const [changePassword, { isLoading: isLoadingRegular }] = useChangePasswordMutation();
  const [adminChangePassword, { isLoading: isLoadingAdmin }] = useAdminChangePasswordMutation();
  
  const isLoading = isLoadingRegular || isLoadingAdmin;
  const isAdmin = role === "ADMIN";
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      confirmPassword: "",
      password: "",
      currentPassword: "",
    },
    resolver: yupResolver(validation),
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isAdmin) {
        await adminChangePassword(data).unwrap();
      } else {
        await changePassword(data).unwrap();
      }
      dispatch(api.util.invalidateTags(["ME"]));
      reset();
      toast.success("Password changed successfully!");
    } catch (error: any) {
      const validationError = error?.data?.data?.errors?.[0]?.msg;
      toast.error(
        validationError ?? error?.data?.message ?? "Something went wrong!"
      );
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      maxWidth={500}
      mx="auto"
    >
      <Card sx={{ width: "100%", maxWidth: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom textAlign="center" mb={3}>
            Change Password {isAdmin && "(Admin)"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {provider === "manual" && (
              <TextField
                sx={style.input}
                fullWidth
                type="password"
                placeholder="Current password"
                label="Current password"
                {...register("currentPassword")}
                error={Boolean(errors.currentPassword?.message)}
                helperText={errors.currentPassword?.message}
              />
            )}
            <PasswordInput
              sx={style.input}
              fullWidth
              type="password"
              placeholder="New password"
              label="New password"
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              {...register("password")}
            />
            <PasswordInput
              sx={style.input}
              fullWidth
              type="password"
              placeholder="Confirm password"
              label="Confirm password"
              error={Boolean(errors.confirmPassword?.message)}
              helperText={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <Button
              type="submit"
              sx={style.button}
              variant="contained"
              fullWidth
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
