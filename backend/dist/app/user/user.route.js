"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const cath_error_middleware_1 = require("../common/middleware/cath-error.middleware");
const role_auth_middleware_1 = require("../common/middleware/role-auth.middleware");
const userController = __importStar(require("./user.controller"));
const userValidator = __importStar(require("./user.validation"));
const router = (0, express_1.Router)();
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
router.get("/", (0, role_auth_middleware_1.roleAuth)(["ADMIN"]), userController.getAllUser);
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
router.get("/me", (0, role_auth_middleware_1.roleAuth)(["USER"]), userController.getUserInfo);
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
router.get("/admin/me", (0, role_auth_middleware_1.roleAuth)(["ADMIN"]), userController.getUserInfo);
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
router.post("/admin/change-password", (0, role_auth_middleware_1.roleAuth)(["ADMIN"]), userValidator.changePassword, cath_error_middleware_1.catchError, userController.changePassword);
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
router.post("/admin/logout", (0, role_auth_middleware_1.roleAuth)(["ADMIN"]), userController.logout);
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
router.post("/forgot-password", userValidator.forgotPassword, cath_error_middleware_1.catchError, userController.requestResetPassword);
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
router.post("/change-password", (0, role_auth_middleware_1.roleAuth)(["USER"]), userValidator.changePassword, cath_error_middleware_1.catchError, userController.changePassword);
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
router.post("/login", userValidator.login, cath_error_middleware_1.catchError, passport_1.default.authenticate("login", { session: false }), userController.login);
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
router.post("/refresh-token", userValidator.refreshToken, cath_error_middleware_1.catchError, userController.refreshToken);
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
router.post("/logout", (0, role_auth_middleware_1.roleAuth)(["USER"]), userController.logout);
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
router.post("/social/google", userValidator.socialLogin("access_token"), cath_error_middleware_1.catchError, userController.googleLogin);
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
router.post("/social/facebook", userValidator.socialLogin("access_token"), cath_error_middleware_1.catchError, userController.fbLogin);
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
router.post("/social/linkedin", userValidator.socialLogin("access_token"), cath_error_middleware_1.catchError, userController.linkedInLogin);
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
router.post("/social/apple", userValidator.socialLogin("id_token"), cath_error_middleware_1.catchError, userController.appleLogin);
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
router.put("/admin/update/:id", (0, role_auth_middleware_1.roleAuth)(["ADMIN"]), userValidator.updateUser, cath_error_middleware_1.catchError, userController.updateUserByAdmin);
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
router.post("/admin/create", (0, role_auth_middleware_1.roleAuth)(["ADMIN"]), userValidator.createAdminUser, cath_error_middleware_1.catchError, userController.createAdminUser);
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
router.post("/register", userValidator.createUser, cath_error_middleware_1.catchError, userController.createUser);
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
router.post("/invite", userValidator.verifyEmail, cath_error_middleware_1.catchError, userController.inviteUser);
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
router.post("/verify-invitation", userValidator.verifyInvitation, cath_error_middleware_1.catchError, userController.verifyInvitation);
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
router.post("/reset-password", userValidator.verifyInvitation, cath_error_middleware_1.catchError, userController.resetPassword);
exports.default = router;
