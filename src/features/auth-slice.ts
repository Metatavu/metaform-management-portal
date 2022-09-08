import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Api from "api";
import type { RootState } from "app/store";
import { MetaformMemberRole } from "generated/client";
import Keycloak from "keycloak-js";
import strings from "localization/strings";
import { PermissionLevel, SYSTEM_ADMIN_ROLE, ThunkApiConfig } from "types";

/**
 * Authentication state in Redux
 */
export interface AuthState {
  keycloak?: Keycloak;
  anonymousKeycloak?: Keycloak;
  permissionLevel: PermissionLevel
}

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  keycloak: undefined,
  permissionLevel: PermissionLevel.ANON
};

/**
 * Async thunk that determines permission level from user id and metaform id
 */
export const setMetaform = createAsyncThunk<PermissionLevel, string, ThunkApiConfig>(
  "metaform/set",
  async (metaformId, { getState }) => {
    try {
      const { keycloak } = getState().auth;

      if (!keycloak?.token) {
        throw new Error(strings.errorHandling.noToken);
      }

      if (keycloak?.hasRealmRole(SYSTEM_ADMIN_ROLE)) {
        return PermissionLevel.SYSTEM_ADMIN;
      }

      const foundMember = await Api.getApiClient(keycloak.token).metaformMembersApi.findMetaformMember({
        metaformId: metaformId,
        metaformMemberId: keycloak.subject!
      });

      switch (foundMember.role) {
        case MetaformMemberRole.Administrator:
          return PermissionLevel.METAFORM_ADMIN;
        case MetaformMemberRole.Manager:
          return PermissionLevel.METAFORM_MANGER;
        default:
          return PermissionLevel.ANON;
      }
    } catch (error) {
      return PermissionLevel.ANON;
    }
  }
);

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
    },
    resetPermission: state => {
      state.permissionLevel = PermissionLevel.ANON;
    }
  },
  extraReducers: builder => {
    builder.addCase(setMetaform.fulfilled, (state, { payload }) => {
      state.permissionLevel = payload;
    });
  }
});

/**
 * Authentication actions from created authentication slice
 */
export const { anonymousLogin, login, logout, resetPermission } = authSlice.actions;

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
 * Select permission level
 *
 * @param state Redux store root state
 * @returns permission level from Redux store
 */
export const selectPermissionLevel = (state: RootState) => state.auth.permissionLevel;

/**
 * Reducer from authentication slice
 */
export default authSlice.reducer;