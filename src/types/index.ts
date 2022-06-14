/**
 * Application configuration
 */
export interface Configuration {
  auth: {
    url: string;
    realm: string;
    clientId: string;
  };
  api: {
    baseUrl: string;
  };
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