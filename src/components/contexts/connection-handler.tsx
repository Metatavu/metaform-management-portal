import { AlertTitle, Typography } from "@mui/material";
import GenericSnackbar from "components/generic/generic-snackbar";
import strings from "localization/strings";
import React, { FC, useEffect, useState } from "react";

/**
 * ConnectionHandler component
 */
const ConnectionHandler: FC = ({ children }) => {
  const [ connectionLost, setConnectionLost ] = useState<boolean>(false);

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

  /**
  * Renders connection lost alert
  */
  const renderConnectionLostAlert = () => (
    <GenericSnackbar
      open={ connectionLost }
      onClose={ () => setConnectionLost(!connectionLost) }
      severity="error"
      disableClickaway
    >
      <>
        <AlertTitle>{ strings.errorHandling.formScreen.noConnection }</AlertTitle>
        <Typography variant="body2" color="#fff">{ strings.errorHandling.formScreen.noConnectionHelper }</Typography>
      </>
    </GenericSnackbar>
  );

  return (
    <>
      { children }
      { renderConnectionLostAlert() }
    </>
  );
};

export default ConnectionHandler;