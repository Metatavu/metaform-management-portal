import { NOT_SELECTED } from "consts";
import { AuditLogEntryType } from "generated/client";

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
  form: {
    idpHint: string;
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
 * Interface describing an processed reply audit log
 */
export interface ReplyAuditLog {
  replyId: string,
  createdAt: Date,
  logEntryType: AuditLogEntryType
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
 * Enum for visibility source
 */
export enum VisibilitySource {
  FIELD = "FIELD",
  SECTION = "SECTION",
  NONE = "NONE"
}

/**
 * Interface describing dictionary type
 */
export interface Dictionary<T> {
  [Key: string]: T;
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
 * Enum for different types of Contexts for form fields
 */
export enum FormContext {
  FORM = "FORM",
  MANAGEMENT = "MANAGEMENT",
  MANAGEMENT_LIST = "MANAGEMENT_LIST",
  META = "META"
}

/**
 * Enum for member group permission
 */
export enum MemberGroupPermission {
  NOTIFY = "notify",
  VIEW = "view",
  EDIT = "edit"
}

/**
 * Type for nullable member group permissions
 */
export type NullableMemberGroupPermission = MemberGroupPermission | typeof NOT_SELECTED;

declare module "@mui/material/styles" {
  interface CustomTheme {
    logo: {
      lightPath: string;
      darkPath: string;
    };
    backgroundImage: {
      backgroundImagePath: string;
    };
    sectionTitle: {
      fontFamily: string;
      fontWeight: number;
      fontSize: number;
    };
  }

  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}