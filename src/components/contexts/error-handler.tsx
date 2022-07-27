/* eslint-disable no-console */
import * as React from "react";
import { DialogContent, DialogContentText, Typography } from "@mui/material";
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
  const [ errorMessage, setErrorMessage ] = React.useState<any>();

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
    setErrorMessage(err);
    console.log(err);
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
   * Returns current time
   * 
   * @returns current time
   */
  const getTime = () => {
    return moment.now();
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
        positiveButtonText="OK"
      >
        { error &&
          <Typography>{ error }</Typography>
        }
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            
            {" "}
            { strings.errorHandling.dialog.reloadPage }
            {" "}
            
            {" "}
            { strings.errorHandling.dialog.unsavedContents }
            {" "}
            
            {" "}
            { strings.errorHandling.dialog.reportIssue }
            {" "}
            
            { strings.errorHandling.dialog.technicalDetails }
            <br/>
            <br/>
            { strings.formatString(strings.errorHandling.dialog.time, getTime()) }
            <br/>
            { strings.formatString(strings.errorHandling.dialog.url, getURL()) }
            <br/>
            { strings.errorHandling.dialog.errorMessage }
            <br/>
            <br/>
            <code style={{ fontSize: "10px" }}>{ errorMessage || "" }</code>
          </DialogContentText>
        </DialogContent>
        <Typography>{ errorMessage }</Typography>
      </GenericDialog>
    </ErrorContext.Provider>
  );
};

export default ErrorHandler;