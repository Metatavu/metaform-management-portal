import { Close } from "@mui/icons-material";
import { Alert, AlertColor, IconButton, Snackbar, SnackbarCloseReason } from "@mui/material";
import React, { FC } from "react";
import theme from "theme";

/**
 * Component props
 */
interface Props {
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
  severity: AlertColor;
  variant?: "standard" | "filled" | "outlined";
  children?: JSX.Element;
  disableClickaway?: boolean;
}

/**
 * Generic Snackbar component
 */
const GenericSnackbar: FC<Props> = ({
  open,
  onClose,
  autoHideDuration,
  severity,
  variant,
  disableClickaway,
  children
}) => {
  /**
   * Handles Snackbar close
   */
  const handleClose = (reason: SnackbarCloseReason) => {
    if (disableClickaway && reason !== "timeout") {
      return;
    }

    onClose();
  };

  const style: React.CSSProperties = {};
  if (severity === "success") {
    style.borderTop = `5px solid ${theme.palette.success.main}`;
    style.color = theme.palette.success.main;
  }
  if (severity === "error") {
    style.borderTop = `5px solid ${theme.palette.error.main}`;
    style.color = theme.palette.error.main;
  }
  if (severity === "warning") {
    style.borderTop = `5px solid ${theme.palette.warning.main}`;
    style.color = theme.palette.warning.main;
  }

  return (
    <Snackbar
      open={ open }
      onClose={ (e, reason) => handleClose(reason) }
      autoHideDuration={ autoHideDuration ?? null }
    >
      <Alert
        severity={ severity }
        variant={ variant ?? "filled" }
        elevation={ 5 }
        style={ style }
        action={
          <IconButton
            onClick={ () => handleClose("timeout") }
            sx={{ color: "#fff", marginTop: "-4px" }}
          >
            <Close/>
          </IconButton>
        }
      >
        { children }
      </Alert>
    </Snackbar>
  );
};

export default GenericSnackbar;