import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TUser = {
  id: string;
  name?: string;
  email?: string;
  role: string;
  avatar?: string;
  iat?: number; // JWT issued at
  exp?: number; // JWT expires at
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type TAuthState = {
  user?: TUser;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _persist?: {
    version: number;
    rehydrated: boolean;
  };
};

const initialState: TAuthState = {
  user: undefined,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: TUser; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    logout: (state) => {
      state.user = undefined;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // For handling auth check during app initialization
    setAuthState: (state, action: PayloadAction<{ isAuthenticated: boolean; user?: TUser }>) => {
      const { isAuthenticated, user } = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.user = user || undefined;
      state.isLoading = false;
    },
  },
});

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

// Legacy selectors for backward compatibility
export const useCurrentUser = selectCurrentUser;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const useCurrentToken = selectCurrentToken;

export const { setUser, logout, setLoading, setAuthState } = authSlice.actions;

export default authSlice.reducer;
