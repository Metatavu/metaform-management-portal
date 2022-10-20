import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import Keycloak from "keycloak-js";

/**
 * Authentication state in Redux
 */
export interface AuthState {
  keycloak?: Keycloak;
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
export const { login, logout } = authSlice.actions;

/**
 * Select Keycloak selector
 *
 * @param state Redux store root state
 * @returns keycloak instance from Redux store
 */
export const selectKeycloak = (state: RootState) => {
  const { auth } = state;
  return auth.keycloak;
};

/**
 * Reducer from authentication slice
 */
export default authSlice.reducer;