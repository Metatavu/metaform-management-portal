import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import Keycloak from "keycloak-js";

/**
 * Authentication state in Redux
 */
export interface AuthState {
  keycloak?: Keycloak;
  anonymousKeycloak?: Keycloak;
}

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  keycloak: undefined
};

/**
 * Authentication slice of Redux store
 */
export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    anonymousLogin: (state, { payload }: PayloadAction<Keycloak | undefined>) => {
      state.anonymousKeycloak = payload;
    },
    login: (state, { payload }: PayloadAction<Keycloak | undefined>) => {
      state.keycloak = payload;
    },
    logout: state => {
      state.keycloak?.logout().then(() => {
        state.keycloak = undefined;
      });
    }
  }
});

/**
 * Authentication actions from created authentication slice
 */
export const { anonymousLogin, login, logout } = authSlice.actions;

/**
 * Select Keycloak selector
 *
 * @param state Redux store root state
 * @returns keycloak instance from Redux store
 */
export const selectKeycloak = (state: RootState) => {
  const { auth } = state;
  if (auth.keycloak) return auth.keycloak;

  return auth.anonymousKeycloak;
};

/**
 * Select Keycloak selector
 *
 * @param state Redux store root state
 * @returns keycloak instance from Redux store
 */
export const selectAnonymousKeycloak = (state: RootState) => state.auth.anonymousKeycloak;

/**
 * Reducer from authentication slice
 */
export default authSlice.reducer;