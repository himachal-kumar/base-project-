import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// Define a type for the slice state
interface AuthState {
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  accessToken: localStorage.getItem("access_token") ?? "",
  refreshToken: localStorage.getItem("refresh_token") ?? "",
  isAuthenticated: Boolean(localStorage.getItem("access_token")),
  loading: true,
  user: null,
};

/**
 * Private function to set the tokens in local storage and update the state.
 *
 * @param {AuthState} state The state to update.
 * @param {{ accessToken: string; refreshToken: string; user: User }} data
 *   The data to set the tokens to.
 * @returns {AuthState} The updated state.
 */
const _setTokens = (
  state: AuthState,
  data: { accessToken: string; refreshToken: string; user: User }
) => {
  localStorage.setItem("access_token", data.accessToken);
  localStorage.setItem("refresh_token", data.refreshToken);
  state.accessToken = data.accessToken;
  state.refreshToken = data.refreshToken;
  state.user = data.user;
  state.isAuthenticated = true;
  state.loading = false;
  return state;
};

const _resetTokens = (state: AuthState) => {
  localStorage.setItem("access_token", "");
  localStorage.setItem("refresh_token", "");
  state.accessToken = "";
  state.refreshToken = "";
  state.user = null;
  state.isAuthenticated = false;
  state.loading = false;
  return state;
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Set the loading state.
     *
     * @param {{ loading: boolean }} action.payload
     *   The loading state to set.
     */
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    /**
     * Set the tokens in the state.
     *
     * @param {{ accessToken: string; refreshToken: string; user: User }} action.payload
     *   The tokens to set.
     */
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; user: User }>
    ) => {
      return _setTokens(state, action.payload);
    },
    resetTokens: (state) => {
      return _resetTokens(state);
    },
  },
    /**
     * Handle the extra reducers.
     *
     * @param {ActionReducerMapBuilder<AuthState>} builder
     *   The builder to add the extra reducers to.
     *
     * @returns {void}
     */
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          api.endpoints.login.matchPending,
          api.endpoints.loginByApple.matchPending,
          api.endpoints.loginByFacebook.matchPending,
          api.endpoints.loginByGoogle.matchPending,
          api.endpoints.loginByLinkedIn.matchPending
        ),
        (state) => {
          state.loading = true;
          return state;
        }
      )
      .addMatcher(
        isAnyOf(
          api.endpoints.login.matchFulfilled,
          api.endpoints.loginByApple.matchFulfilled,
          api.endpoints.loginByFacebook.matchFulfilled,
          api.endpoints.loginByGoogle.matchFulfilled,
          api.endpoints.loginByLinkedIn.matchFulfilled
        ),
        (state, action) => {
          return _setTokens(state, action.payload.data);
        }
      )
      .addMatcher(
        isAnyOf(
          api.endpoints.login.matchRejected,
          api.endpoints.loginByApple.matchRejected,
          api.endpoints.loginByFacebook.matchRejected,
          api.endpoints.loginByGoogle.matchRejected,
          api.endpoints.loginByLinkedIn.matchRejected,
          api.endpoints.logout.matchFulfilled,
          api.endpoints.logout.matchRejected
        ),
        (state) => {
          return _resetTokens(state);
        }
      );
  },
});

export const { setLoading, setTokens, resetTokens } = authSlice.actions;

export default authSlice.reducer;
