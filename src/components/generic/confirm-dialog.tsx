import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import * as React from "react";

/**
 * Interface representing component properties
 */
interface Props {
  title: string;
  text: string;
  positiveButtonText: string;
  cancelButtonText: string;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
}

/**
 * React component displaying confirm dialogs
 */
const ConfirmDialog: React.FC<Props> = ({
  title,
  text,
  positiveButtonText,
  cancelButtonText,
  onClose,
  onCancel,
  onConfirm,
  open
}) => {
  return (
    <Dialog
      open={ open }
      onClose={ onClose }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        sx={{
          fontSize: 18,
          fontWeight: "bold"
        }}
        id="alert-dialog-title"
      >
        { title }
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          { text }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={ onCancel } color="primary">
          { cancelButtonText }
        </Button>
        <Button disableElevation variant="contained" onClick={ onConfirm } color="secondary" autoFocus>
          { positiveButtonText }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;