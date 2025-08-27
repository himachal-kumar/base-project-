import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { resetTokens, setTokens } from "../store/reducers/authReducer";
import { RootState } from "../store/store";

const baseUrl = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  /**
   * @param {Headers} headers Headers object to be sent with the request.
   * @param {{ getState: () => RootState }} api Object containing the `getState` method from the `ApiContext`.
   * @returns {Headers} Modified headers object with the Authorization header set to the access token if it exists.
   *
   * Adds the access token to the Authorization header if it exists.
   */
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});


/**
 * A wrapper around the `baseQuery` function that automatically handles token refreshes for expired tokens.
 *
 * If the original request returns a 401 status code and the error data contains the string "TOKEN_EXPIRED",
 * this function will automatically call the `/users/refresh-token` endpoint with the existing refresh token
 * to obtain a new access token. If the refresh call is successful, it will update the state with the new tokens
 * and retry the original request. If the refresh call fails, it will clear the state of any existing tokens.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    result.error.status === 401 &&
    // @ts-ignore
    result.error.data.data.type === "TOKEN_EXPIRED"
  ) {
    const authState = (api.getState() as RootState).auth;

    if (!authState.accessToken || !authState.refreshToken) {
      return result; // Nothing to do if we don't have tokens
    }

    const refreshResult = await baseQuery(
      {
        url: "/users/refresh-token",
        method: "POST",
        body: { refreshToken: authState.refreshToken },
      },
      api,
      extraOptions
    );

    //@ts-ignore
    const data = refreshResult.data.data as {
      accessToken: string;
      refreshToken: string;
    };

    if (data) {
      // Update state with new tokens
      api.dispatch(setTokens(data));

      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(resetTokens());
    }
  }

  return result;
};
