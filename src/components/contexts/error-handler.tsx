/* eslint-disable no-console */
import * as React from "react";
import { Typography } from "@mui/material";
import strings from "localization/strings";
import type { ErrorContextType } from "types";
import GenericDialog from "components/generic/generic-dialog";
import * as Sentry from "@sentry/react";

/**
 * Error context initialization
 */
export const ErrorContext = React.createContext<ErrorContextType>({
  setError: () => {}
});

/**
 * Error handler component
 *
 * @param props component properties
 */
const ErrorHandler: React.FC = ({ children }) => {
  const [ error, setError ] = React.useState<string>();

  /**
   * Handles error message and tries to print any given error to logs
   * Sends error message to sentry'
   * TODO: Figure out proper way to log errors with sentry
   *
   * @param message error message
   * @param err any error
   */
  const handleError = async (message: string, err?: any) => {
    setError(message);
    Sentry.captureException(err);

    if (err instanceof Response) {
      try {
        console.error(await err.json());
      } catch {
        console.error(err);
      }
      return;
    }

    console.error(err);
  };

  /**
   * Memoized context value
   */
  const contextValue = React.useMemo(() => ({
    setError: handleError
  }), [ error ]);

  /**
   * Component render
   */
  return (
    <ErrorContext.Provider value={ contextValue }>
      { children }
      <GenericDialog
        open={ error !== undefined }
        error={ false }
        onClose={ () => setError(undefined) }
        onCancel={ () => setError(undefined) }
        onConfirm={ () => setError(undefined) }
        title={ strings.errorHandling.title }
        positiveButtonText="OK"
      >
        { error &&
          <Typography>{ error }</Typography>
        }
      </GenericDialog>
    </ErrorContext.Provider>
  );
};

export default ErrorHandler;