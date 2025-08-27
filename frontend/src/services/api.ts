import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["ME", "USERS"],
  baseQuery: baseQueryWithReauth,
  /**
   * API endpoints
   *
   * @typedef {Object} ApiResponse
   * @property {number} status - Response status code
   * @property {string} message - Response message
   * @property {Object} data - Response data
   *
   * @typedef {Object} User
   * @property {string} _id - User ID
   * @property {string} name - User name
   * @property {string} email - User email
   * @property {string} role - User role
   * @property {string} provider - User provider
   * @property {string} active - User active status
   * @property {string} refreshToken - User refresh token
   *
   * @typedef {Object} LoginBody
   * @property {string} email - User email
   * @property {string} password - User password
   *
   * @typedef {Object} RegisterBody
   * @property {string} name - User name
   * @property {string} email - User email
   * @property {string} password - User password
   * @property {string} confirmPassword - User confirm password
   *
   * @typedef {Object} UpdateUserBody
   * @property {string} _id - User ID
   * @property {string} name - User name
   * @property {string} email - User email
   * @property {string} password - User password
   *
   * @typedef {Object} LoginByAppleBody
   * @property {string} id_token - Apple ID token
   *
   * @typedef {Object} LoginByGoogleBody
   * @property {string} access_token - Google access token
   *
   * @typedef {Object} LoginByLinkedInBody
   * @property {string} access_token - LinkedIn access token
   *
   * @typedef {Object} LoginByFacebookBody
   * @property {string} access_token - Facebook access token
   *
   * @typedef {Object} ChangePasswordBody
   * @property {string} confirmPassword - User confirm password
   * @property {string} password - User password
   * @property {string} currentPassword - User current password
   *
   * @typedef {Object} ResetPasswordBody
   * @property {string} confirmPassword - User confirm password
   * @property {string} password - User password
   * @property {string} token - User reset password token
   *
   * @typedef {Object} VerifyInvitationBody
   * @property {string} confirmPassword - User confirm password
   * @property {string} password - User password
   * @property {string} token - User invitation token
   *
   * @typedef {Object} ForgotPasswordBody
   * @property {string} email - User email
   */
  endpoints: (builder) => ({
    me: builder.query<ApiResponse<User>, void>({
      query: () => `/users/me`,
      providesTags: ["ME"],
    }),
    adminMe: builder.query<ApiResponse<User>, void>({
      query: () => `/users/admin/me`,
      providesTags: ["ME"],
    }),
    login: builder.mutation<
      ApiResponse<{ 
        accessToken: string; 
        refreshToken: string;
        user: User;
      }>,
      { email: string; password: string }
    >({

      query: (body) => {
        return { url: `/users/login`, method: "POST", body };
      },
    }),
    register: builder.mutation<
      ApiResponse<User>,
      Omit<User, "_id" | "active" | "role" | "provider"> & {
        confirmPassword: string;
      }
    >({
      query: (body) => {
        return { url: `/users/register`, method: "POST", body };
      },
    }),
    updateUser: builder.mutation<ApiResponse<User>, User>({
      /**
       * Updates a user by their ID
       * @param {User} body - user data
       * @returns {ApiResponse<User>} - updated user data
       */
      query: (body) => {
        return { url: `/users/${body._id}`, method: "PUT", body };
      },
    }),
    logout: builder.mutation<void, void>({
      /**
       * Logs out the user by invalidating their refresh token
       * @returns {void}
       */
      query: () => {
        return { url: `/users/logout`, method: "POST" };
      },
    }),
    adminLogout: builder.mutation<void, void>({
      /**
       * Logs out the admin user by invalidating their refresh token
       * @returns {void}
       */
      query: () => {
        return { url: `/users/admin/logout`, method: "POST" };
      },
    }),
    loginByApple: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { id_token: string }
    >({
      /**
       * Logs in the user by their Apple ID token
       * @param {LoginByAppleBody} body - Apple ID token
       * @returns {ApiResponse<{ accessToken: string; refreshToken: string }>} - access and refresh tokens
       */
      query: (body) => {
        return { url: `/users/social/apple`, method: "POST", body };
      },
    }),
    loginByGoogle: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { access_token: string }
    >({
      query: (body) => {
        return { url: `/users/social/google`, method: "POST", body };
      },
    }),
    loginByLinkedIn: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { access_token: string }
    >({
      /**
       * Logs in the user by their LinkedIn access token
       * @param {LoginByLinkedInBody} body - LinkedIn access token
       * @returns {ApiResponse<{ accessToken: string; refreshToken: string }>} - access and refresh tokens
       */
      query: (body) => {
        return { url: `/users/social/linkedin`, method: "POST", body };
      },
    }),
    loginByFacebook: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { access_token: string }
    >({
      /**
       * Logs in the user by their Facebook access token
       * @param {LoginByFacebookBody} body - Facebook access token
       * @returns {ApiResponse<{ accessToken: string; refreshToken: string }>} - access and refresh tokens
       */
      query: (body) => {
        return { url: `/users/social/facebook`, method: "POST", body };
      },
    }),
    changePassword: builder.mutation<
      ApiResponse<{}>,
      {
        confirmPassword: string;
        password: string;
        currentPassword?: string | null;
      }
    >({
      /**
       * Changes the user's password
       * @param {ChangePasswordBody} body - current password, new password, and new password confirmation
       * @returns {ApiResponse<{}>} - empty response
       */
      query: (body) => {
        return { url: `/users/change-password`, method: "POST", body };
      },
    }),
    adminChangePassword: builder.mutation<
      ApiResponse<{}>,
      {
        confirmPassword: string;
        password: string;
        currentPassword?: string | null;
      }
    >({
      /**
       * Changes the user's password from the admin panel
       * @param {AdminChangePasswordBody} body - current password, new password, and new password confirmation
       * @returns {ApiResponse<{}>} - empty response
       */
      query: (body) => {
        return { url: `/users/admin/change-password`, method: "POST", body };
      },
    }),
    resetPassword: builder.mutation<
      ApiResponse<{}>,
      {
        confirmPassword: string;
        password: string;
        token: string;
      }
    >({
      query: (body) => {
        return { url: `/users/reset-password`, method: "POST", body };
      },
    }),
    verfiyInvitation: builder.mutation<
      ApiResponse<{}>,
      {
        confirmPassword: string;
        password: string;
        token: string;
      }
    >({
      /**
       * Verifies the user's invitation
       * @param {VerifyInvitationBody} body - password, password confirmation, and the invitation token
       * @returns {ApiResponse<{}>} - empty response
       */
      query: (body) => {
        return { url: `/users/verify-invitation`, method: "POST", body };
      },
    }),
    forgotPassword: builder.mutation<
      ApiResponse<{}>,
      {
        email: string;
      }
    >({
      query: (body) => {
        return { url: `/users/forgot-password`, method: "POST" };
      },
    }),
    getAllUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => `/users`,
      providesTags: ["USERS"],
    }),
    deleteUser: builder.mutation<ApiResponse<{}>, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USERS"],
    }),
    createAdminUser: builder.mutation<
      ApiResponse<User>,
      {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
      }
    >({
      query: (body) => ({
        url: `/users/admin/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["USERS"],
    }),
    updateUserByAdmin: builder.mutation<
      ApiResponse<User>,
      {
        id: string;
        name?: string;
        role?: "USER" | "ADMIN";
        active?: boolean;
        blocked?: boolean;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/users/admin/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["USERS"],
    }),
  }),
});
export const {
  useMeQuery,
  useAdminMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useAdminLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useLoginByAppleMutation,
  useLoginByFacebookMutation,
  useLoginByGoogleMutation,
  useLoginByLinkedInMutation,
  useChangePasswordMutation,
  useAdminChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerfiyInvitationMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useCreateAdminUserMutation,
  useUpdateUserByAdminMutation,
} = api;
