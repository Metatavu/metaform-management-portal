/* eslint-disable no-console */
import * as React from "react";
import { DialogContent, Divider, Typography } from "@mui/material";
import strings from "localization/strings";
import type { ErrorContextType } from "types";
import GenericDialog from "components/generic/generic-dialog";
import * as Sentry from "@sentry/react";
import moment from "moment";

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
  const [ errorMessage, setErrorMessage ] = React.useState<string>();

  /**
   * Handles error message and tries to print any given error to logs
   * Sends error message to sentry
   *
   * @param message error message
   * @param err any error
   */
  const handleError = async (message: string, err?: any) => {
    setError(message);

    Sentry.captureException(err);
    console.error(err);

    if (err instanceof Response) {
      try {
        const errorJson = await err.json();
        console.error(errorJson);
        setErrorMessage(errorJson.message);
      } catch {
        setErrorMessage(JSON.stringify(err));
      }
    } else if (err instanceof Error) {
      setErrorMessage(err.message);
    } else {
      setErrorMessage(JSON.stringify(err));
    }
  };

  /**
   * Memoized context value
   */
  const contextValue = React.useMemo(() => ({
    setError: handleError
  }), [ error ]);

  /**
   * Returns current time
   * 
   * @returns current time
   */
  const getTime = () => {
    return moment().format("DD.MM.YYYY HH:mm:ss");
  };
  
  /**
   * Returns current window URL
   * 
   * @returns current window URL
   */
  const getURL = () => {
    return window.location.href;
  };

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
        closeButtonText={ strings.generic.close }
        reloadButtonText={ strings.generic.reload }
      >
        <DialogContent id="error-dialog-description">
          { error &&
            <Typography marginBottom={ 3 } sx={{ fontSize: 16, fontWeight: "bold" }}>
              { error }
            </Typography>
          }
          <Typography marginBottom={ 2 }>
            { strings.errorHandling.dialog.reloadPage }
          </Typography>
          <Typography marginBottom={ 2 }>
            { strings.errorHandling.dialog.unsavedContents }
          </Typography>
          <Typography marginBottom={ 2 }>
            { strings.errorHandling.dialog.reportIssue }
          </Typography>
          <Typography>
            { strings.errorHandling.dialog.technicalDetails }
          </Typography>
          <Typography>
            { strings.formatString(strings.errorHandling.dialog.time, getTime()) }
          </Typography>
          <Typography >
            { strings.formatString(strings.errorHandling.dialog.url, getURL()) }
          </Typography>
          <Typography>
            { strings.errorHandling.dialog.errorMessage }
          </Typography>
          <code style={{ fontSize: "12px" }}>{ errorMessage || "" }</code>
        </DialogContent>
        <Divider/>
      </GenericDialog>
    </ErrorContext.Provider>
  );
};

export default ErrorHandler;