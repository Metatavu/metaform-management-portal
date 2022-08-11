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

export enum ApplicationRoles {
  ADMIN = "admin",
  MANAGER = "manager",
  USER = "user",
  ANONYMOUS = "anonymous"
}

export enum ReplyStatus {
  WAITING = "waiting",
  PROCESSING = "processing",
  DONE = "done"
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