import { Alert, Snackbar, Typography } from "@mui/material";
import strings from "localization/strings";
import React, { useEffect, useState } from "react";

/**
 * ConnectionHandler component
 */
const ConnectionHandler: React.FC = ({ children }) => {
  const [ connectionLost, setConnectionLost ] = useState<boolean>(false);

  /**
   * Renders connection lost alert
   */
  const renderConnectionLostAlert = () => (
    <Snackbar
      open={ connectionLost }
    >
      <Alert
        variant="filled"
        severity="error"
        elevation={ 5 }
      >
        <Typography variant="h5">{ strings.errorHandling.formScreen.noConnection }</Typography>
        <Typography variant="caption">{ strings.errorHandling.formScreen.noConnectionHelper }</Typography>
      </Alert>
    </Snackbar>
  );

  /**
   * Handles notifying user when connection lost
   */
  const handleConnectionLost = () => {
    setConnectionLost(true);
  };

  /**
   * Handles removing connection lost alerts when connection resumes
   */
  const handleConnectionResume = () => {
    setConnectionLost(false);
  };

  useEffect(() => {
    window.addEventListener("offline", handleConnectionLost);
    window.addEventListener("online", handleConnectionResume);

    return () => {
      window.removeEventListener("offline", handleConnectionLost);
      window.removeEventListener("online", handleConnectionResume);
    };
  }, []);

  return (
    <>
      { children }
      { renderConnectionLostAlert() }
    </>
  );
};

export default ConnectionHandler;