import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import Keycloak from "keycloak-js";

/**
 * Authentication state in Redux
 */
export interface AuthState {
  keycloak?: Keycloak;
  anonymousKeycloak?: Keycloak;
  idpKeycloak?: Keycloak;
  accessToken?: string;
  anonymousAccessToken?: string;
  idpAccessToken?: string;
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
    idpLogin: (state, { payload }: PayloadAction<Keycloak | undefined>) => {
      state.idpKeycloak = payload;
      state.idpAccessToken = payload?.token;
    },
    anonymousLogin: (state, { payload }: PayloadAction<Keycloak | undefined>) => {
      state.anonymousKeycloak = payload;
      state.anonymousAccessToken = payload?.token;
    },
    login: (state, { payload }: PayloadAction<Keycloak | undefined>) => {
      state.keycloak = payload;
      state.accessToken = payload?.token;
    },
    logout: state => {
      state.keycloak?.logout().then(() => {
        state.keycloak = undefined;
        state.accessToken = undefined;
      });
    }
  }
});

/**
 * Authentication actions from created authentication slice
 */
export const { anonymousLogin, idpLogin, login, logout } = authSlice.actions;

/**
 * Select Keycloak selector
 *
 * @param state Redux store root state
 * @returns keycloak instance from Redux store
 */
export const selectKeycloak = (state: RootState) => {
  const { auth } = state;
  if (auth.keycloak) return auth.keycloak;
  if (auth.idpKeycloak) return auth.idpKeycloak;

  return auth.anonymousKeycloak;
};

/**
 * Select access token
 *
 * @param state Redux store root state
 * @returns access token
 */
export const selectAccessToken = (state: RootState) => {
  return state.auth.accessToken;
};

/**
 * Select anonymous access token
 *
 * @param state Redux store root state
 * @returns anonymous access token
 */
export const selectAnonymousAccessToken = (state: RootState) => {
  return state.auth.anonymousAccessToken;
};

/**
 * Select anonymous access token
 *
 * @param state Redux store root state
 * @returns anonymous access token
 */
export const selectIdpAccessToken = (state: RootState) => {
  return state.auth.idpAccessToken;
};

/**
 * Select Keycloak selector
 *
 * @param state Redux store root state
 * @returns keycloak instance from Redux store
 */
export const selectAnonymousKeycloak = (state: RootState) => state.auth.anonymousKeycloak;

/**
 * Select idp Keycloak selector
 *
 * @param state Redux store root state
 * @returns keycloak instance from Redux store
 */
export const selectIdpKeycloak = (state: RootState) => state.auth.idpKeycloak;

/**
 * Reducer from authentication slice
 */
export default authSlice.reducer;