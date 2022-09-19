import { Close } from "@mui/icons-material";
import { Alert, AlertColor, IconButton, Snackbar, SnackbarCloseReason } from "@mui/material";
import React from "react";

/**
 * Component props
 */
interface Props {
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
  severity: AlertColor;
  variant?: "standard" | "filled" | "outlined";
  anchorOrigin?: {
    horizontal: "center" | "left" | "right";
    vertical: "bottom" | "top";
  };
  children?: JSX.Element;
  disableClickaway?: boolean;
}

/**
 * Generic Snackbar component
 */
const GenericSnackbar: React.FC<Props> = ({
  open,
  onClose,
  autoHideDuration,
  severity,
  variant,
  anchorOrigin,
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

  return (
    <Snackbar
      open={ open }
      onClose={ (e, reason) => handleClose(reason) }
      autoHideDuration={ autoHideDuration ?? null }
      anchorOrigin={ anchorOrigin }
    >
      <Alert
        severity={ severity }
        variant={ variant ?? "filled" }
        elevation={ 5 }
        action={
          disableClickaway &&
          <IconButton onClick={ () => handleClose("timeout") }>
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