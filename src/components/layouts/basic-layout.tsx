import { CircularProgress, Typography, Snackbar, Alert } from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";
import { Root } from "styled/layouts/basic-layout";

export interface SnackbarMessage {
  message: string;
  severity: "success" | "info" | "warning" | "error";
}

interface Props {
  loading?: boolean
  loadMessage?: string | undefined;
  snackbarMessage?: SnackbarMessage;
  error?: string | undefined | unknown;
  redirectTo?: string;
  clearError?: () => void;
  clearSnackbar?: () => void;
}

/**
 * Basic layout component
 *
 * @param props component properties
 */
const BasicLayout: React.FC<Props> = ({
  loading,
  loadMessage,
  snackbarMessage,
  error,
  redirectTo,
  clearError,
  clearSnackbar
}, { children }) => {
  /**
   * Renders loader
   */
  const renderLoader = () => {
    const text = loadMessage || "Ladataan";

    return (
      <div>
        <div>
          <CircularProgress size={ 50 }/>
          <Typography>{ text }</Typography>
        </div>
      </div>
    );
  };

  /**
   * Renders snackbar
   */
  const renderSnackbar = () => {
    return (
      <Snackbar open={ !!snackbarMessage } autoHideDuration={ 6000 } onClose={ clearSnackbar } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert elevation={ 6 } variant="filled" onClose={ clearSnackbar } severity={ snackbarMessage?.severity }>
          { snackbarMessage?.message || "" }
        </Alert>
      </Snackbar>
    );
  };

  /**
   * Renders error dialog
   */
  const renderErrorDialog = () => {
    if (error && clearError) {
      return; /* TODO Implement error dialog */
    }

    return null;
  };

  /**
   * Renders contents
   */
  const renderContents = () => {
    return (
      <>
        <div>
          { children }
        </div>
        { renderErrorDialog() }
        { renderSnackbar() }
      </>
    );
  };

  if (redirectTo) {
    return <Navigate replace to={ redirectTo }/>;
  }

  if (!error && loading) {
    return renderLoader();
  }

  /**
   * Component render
   */
  return (
    <Root>
      { renderContents() }
      { children }
    </Root>
  );
};

export default BasicLayout;