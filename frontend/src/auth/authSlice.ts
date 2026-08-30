import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CurrentUser } from "../api/authApi";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  user: JSON.parse(localStorage.getItem("current_user") || "null"),
  isAuthenticated: !!localStorage.getItem("access_token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: CurrentUser;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem("access_token", action.payload.accessToken);
      localStorage.setItem("refresh_token", action.payload.refreshToken);
      localStorage.setItem(
        "current_user",
        JSON.stringify(action.payload.user)
      );
      localStorage.setItem("user_role", action.payload.user.role.toUpperCase());
    },

    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("current_user");
      localStorage.removeItem("user_role");
    },

    restoreUser(state, action: PayloadAction<CurrentUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem("current_user", JSON.stringify(action.payload));
      localStorage.setItem("user_role", action.payload.role.toUpperCase());
    },
  },
});

export const { loginSuccess, logout, restoreUser } = authSlice.actions;
export default authSlice.reducer;

