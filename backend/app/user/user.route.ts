import { Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/cath-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users (Admin only)
 *     tags: [User Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/", roleAuth(["ADMIN"]), userController.getAllUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user info
 *     description: Retrieve information about the currently authenticated user
 *     tags: [User Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", roleAuth(["USER"]), userController.getUserInfo);

/**
 * @swagger
 * /users/admin/me:
 *   get:
 *     summary: Get admin user info
 *     description: Retrieve information about the currently authenticated admin user
 *     tags: [User Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin user information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/admin/me", roleAuth(["ADMIN"]), userController.getUserInfo);

/**
 * @swagger
 * /users/admin/change-password:
 *   post:
 *     summary: Change admin password
 *     description: Allow admin users to change their password
 *     tags: [Password Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post("/admin/change-password", roleAuth(["ADMIN"]), userValidator.changePassword, catchError, userController.changePassword);

/**
 * @swagger
 * /users/admin/logout:
 *   post:
 *     summary: Admin logout
 *     description: Logout admin user and invalidate JWT token
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post("/admin/logout", roleAuth(["ADMIN"]), userController.logout);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Request a password reset link
 *     tags: [Password Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - validation errors
 *       404:
 *         description: User not found
 */
router.post(
  "/forgot-password",
  userValidator.forgotPassword,
  catchError,
  userController.requestResetPassword
);

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change password
 *     description: Change user password (authenticated users only)
 *     tags: [Password Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/change-password",
  roleAuth(["USER"]),
  userValidator.changePassword,
  catchError,
  userController.changePassword
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and return JWT tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  userValidator.login,
  catchError,
  passport.authenticate("login", { session: false }),
  userController.login
);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh token
 *     description: Get new access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: New access token
 *                     refreshToken:
 *                       type: string
 *                       description: New refresh token
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post(
  "/refresh-token",
  userValidator.refreshToken,
  catchError,
  userController.refreshToken
);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user and invalidate JWT token
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", roleAuth(["USER"]), userController.logout);

/**
 * @swagger
 * /users/social/google:
 *   post:
 *     summary: Google social login
 *     description: Authenticate user using Google OAuth
 *     tags: [Social Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: Google OAuth access token
 *     responses:
 *       200:
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Invalid Google token
 */
router.post(
  "/social/google",
  userValidator.socialLogin("access_token"),
  catchError,
  userController.googleLogin
);

/**
 * @swagger
 * /users/social/facebook:
 *   post:
 *     summary: Facebook social login
 *     description: Authenticate user using Facebook OAuth
 *     tags: [Social Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: Facebook OAuth access token
 *     responses:
 *       200:
 *         description: Facebook login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Invalid Facebook token
 */
router.post(
  "/social/facebook",
  userValidator.socialLogin("access_token"),
  catchError,
  userController.fbLogin
);

/**
 * @swagger
 * /users/social/linkedin:
 *   post:
 *     summary: LinkedIn social login
 *     description: Authenticate user using LinkedIn OAuth
 *     tags: [Social Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: LinkedIn OAuth access token
 *     responses:
 *       200:
 *         description: LinkedIn login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Invalid LinkedIn token
 */
router.post(
  "/social/linkedin",
  userValidator.socialLogin("access_token"),
  catchError,
  userController.linkedInLogin
);

/**
 * @swagger
 * /users/social/apple:
 *   post:
 *     summary: Apple social login
 *     description: Authenticate user using Apple Sign In
 *     tags: [Social Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_token:
 *                 type: string
 *                 description: Apple ID token
 *     responses:
 *       200:
 *         description: Apple login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Invalid Apple token
 */
router.post(
  "/social/apple",
  userValidator.socialLogin("id_token"),
  catchError,
  userController.appleLogin
);

/**
 * @users/admin/update:
 *   put:
 *     summary: Update user information
 *     description: Update user role, status, and other information (Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 description: User's role
 *               active:
 *                 type: boolean
 *                 description: User's active status
 *               blocked:
 *                 type: boolean
 *                 description: User's blocked status
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 */
router.put(
  "/admin/update/:id",
  roleAuth(["ADMIN"]),
  userValidator.updateUser,
  catchError,
  userController.updateUserByAdmin
);

/**
 * @users/admin/create:
 *   post:
 *     summary: Create admin user
 *     description: Create a new admin user (Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Admin user's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin user's email address
 *               password:
 *                 type: string
 *                 description: Admin user's password
 *               confirmPassword:
 *                 type: string
 *                 description: Password confirmation
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       409:
 *         description: User already exists
 */
router.post(
  "/admin/create",
  roleAuth(["ADMIN"]),
  userValidator.createAdminUser,
  catchError,
  userController.createAdminUser
);

/**
 * @users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID
 *     tags: [User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user
 *     description: Delete a specific user by ID
 *     tags: [User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user
 *     description: Create a new user account
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: User already exists
 */
router.post(
  "/register",
  userValidator.createUser,
  catchError,
  userController.createUser
);

/**
 * @swagger
 * /users/invite:
 *   post:
 *     summary: Invite user
 *     description: Send an invitation to a new user
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address to invite
 *     responses:
 *       200:
 *         description: Invitation sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - validation errors
 */
router.post(
  "/invite",
  userValidator.verifyEmail,
  catchError,
  userController.inviteUser
);

/**
 * @swagger
 * /users/verify-invitation:
 *   post:
 *     summary: Verify invitation
 *     description: Verify and accept a user invitation
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Invitation verification token
 *               password:
 *                 type: string
 *                 description: New password for the user
 *               confirmPassword:
 *                 type: string
 *                 description: Password confirmation
 *     responses:
 *       200:
 *         description: Invitation verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Invalid or expired token
 */
router.post(
  "/verify-invitation",
  userValidator.verifyInvitation,
  catchError,
  userController.verifyInvitation
);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset user password using reset token
 *     tags: [Password Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Invalid or expired token
 */
router.post(
  "/reset-password",
  userValidator.verifyInvitation,
  catchError,
  userController.resetPassword
);

export default router;
