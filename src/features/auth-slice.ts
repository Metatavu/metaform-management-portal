import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import { KeycloakInstance } from "keycloak-js";

/**
 * Authentication state in Redux
 */
export interface AuthState {
  keycloak?: KeycloakInstance;
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
    login: (state, { payload }: PayloadAction<KeycloakInstance | undefined>) => {
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
export const selectKeycloak = (state: RootState) => state.auth.keycloak;

/**
 * Reducer from authentication slice
 */
export default authSlice.reducer;