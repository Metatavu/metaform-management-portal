import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Component properties
 */
interface Props {
  title: string;
  closeButtonText?: string;
  reloadButtonText?: string;
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
  closeButtonText,
  reloadButtonText,
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
   * Reload button click event handler
   */
  const onReloadClick = () => {
    window.location.reload();
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
      <DialogTitle variant="h2">
        { title }
        <IconButton
          style={{ float: "right" }}
          size="small"
          onClick={ onCancel }
        >
          <CloseIcon/>
        </IconButton>
        <Divider/>
      </DialogTitle>
      <DialogContent>
        { children }
      </DialogContent>
      <DialogActions>
        { reloadButtonText &&
          <Button
            onClick={ onReloadClick }
            color="error"
            style={{ float: "left" }}
          >
            { reloadButtonText }
          </Button>
        }
        { closeButtonText &&
          <Button
            disabled={ error || disabled }
            onClick={ onConfirm }
            color="primary"
            autoFocus
          >
            { closeButtonText }
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
};

export default GenericDialog;