import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Component properties
 */
interface Props {
  title: string;
  positiveButtonText?: string;
  cancelButtonText?: string;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  open: boolean;
  error: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  disableEnforceFocus?: boolean;
  disabled?: boolean;
  ignoreOutsideClicks?: boolean;
}

/**
 * Generic dialog component
 *
 * @param props component properties
 */
const GenericDialog: React.FC<Props> = ({
  open,
  positiveButtonText,
  cancelButtonText,
  onClose,
  onCancel,
  title,
  onConfirm,
  error,
  fullScreen,
  fullWidth,
  disableEnforceFocus,
  disabled,
  ignoreOutsideClicks,
  children
}) => {
  /**
   * Event handler for on close click
   *
   * @param event event source of the callback
   * @param reason reason why dialog was closed
   */
  const onCloseClick = (event: {}, reason: string) => {
    if (!ignoreOutsideClicks || (reason !== "backdropClick" && reason !== "escapeKeyDown")) {
      onClose();
    }
  };

  /**
   * Component render
   */
  return (
    <Dialog
      open={ open }
      onClose={ onCloseClick }
      fullScreen={ fullScreen }
      fullWidth={ fullWidth }
      disableEnforceFocus={ disableEnforceFocus }
    >
      <DialogTitle>
        { title }
        <IconButton
          size="small"
          onClick={ onCancel }
        >
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        { children }
      </DialogContent>
      <DialogActions>
        { cancelButtonText &&
          <Button
            onClick={ onCancel }
            color="secondary"
          >
            { cancelButtonText }
          </Button>
        }
        { positiveButtonText &&
          <Button
            disabled={ error || disabled }
            onClick={ onConfirm }
            color="primary"
            autoFocus
          >
            { positiveButtonText }
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
};

export default GenericDialog;