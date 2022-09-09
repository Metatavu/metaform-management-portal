import { RootState } from "app/store";

/**
 * Application configuration
 */
export interface Configuration {
  auth: {
    url: string;
    realm: string;
    clientId: string;
  };
  anonymousUser: {
    username: string;
    password: string;
  };
  api: {
    baseUrl: string;
  };
}

/**
 * Interface describing an access token
 */
export interface AccessToken {
  created: Date;
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_expires_in?: number;
  firstName?: string;
  lastName?: string;
  userId?: string;
  realmRoles: string[];
}

/**
 * Error context type
 */
export type ErrorContextType = {
  error?: string;
  setError: (message: string, error?: any) => void;
};

/**
 * Confirm context type
 */
export type ConfirmContextType = {
  confirm: (operation: () => any, options: ConfirmOptions) => void;
  operation?: () => void | Promise<void>;
};

/**
 * Confirm options
 */
export type ConfirmOptions = {
  description?: string;
  onCancel?: () => any;
  onConfirm?: () => any;
  title: string;
};

/**
 * List item data
 */
export type ListItemData = {
  title: string;
  description: string;
};

/**
 * Not selected for placeholder
 */
export const NOT_SELECTED = "NOT_SELECTED";

/**
 * System admin role
 */
export const SYSTEM_ADMIN_ROLE = "system-admin";

/**
 * React dnd dragging mode
 */
export enum DraggingMode {
  FIELD = "FIELD",
  ADD_FIELD = "ADD_FIELD",
  SECTION = "SECTION"
}

/**
 * Enum navigation links
 */
export enum NavigationLinks {
  FORMS = "FORMS",
  USERS = "USERS",
  EDITOR = "EDITOR"
}

/**
 * Interface describing dictionary type
 */
export interface Dictionary<T> {
  [Key: string]: T;
}

/**
 * Enum for application roles
 */
export enum ApplicationRoles {
  METAFORM_ADMIN = "metaform-admin",
  METAFORM_MANAGER = "metaform-manager",
  METAFORM_USER = "metaform-user",
  ANONYMOUS = "anonymous"
}

/**
 * Enum for reply status
 */
export enum ReplyStatus {
  WAITING = "waiting",
  PROCESSING = "processing",
  DONE = "done"
}

/**
 * Enum for different types of "sections" and "fields" contained in Sosmeta Schemas
 */
export enum SosmetaType {
  ARRAY = "array",
  BOOLEAN = "boolean",
  INTEGER = "integer",
  NULL = "null",
  NUMBER = "number",
  OBJECT = "object",
  STRING = "string"
}

/**
 * Enum for user permission level (metaform specific)
 */
export enum PermissionLevel {
  SYSTEM_ADMIN = 0,
  METAFORM_ADMIN = 1,
  METAFORM_MANGER = 2,
  ANON = 3
}

declare module "@mui/material/styles" {
  interface CustomTheme {
    logo: {
      logoPath: string;
    };
  }

  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}

/**
 * Thunk API config
 */
export interface ThunkApiConfig {
  state: RootState;
  rejectValue: string;
}