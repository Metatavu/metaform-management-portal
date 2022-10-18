import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from "@mui/material";
import React from "react";

/**
 * Interface representing component properties
 */
interface Props {
  open: boolean;
  dialogTitle: string;
  dialogDescription: string;
  dialogContent: JSX.Element;
  dialogActions: JSX.Element[];
  onCancel: () => void;
}

/**
 * React component for generic dialog used in Users screen
 */
const UsersScreenDialog: React.FC<Props> = ({
  open,
  dialogTitle,
  dialogDescription,
  dialogContent,
  dialogActions,
  onCancel
}) => {
  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={ open }
      onClose={ onCancel }
    >
      <DialogTitle variant="h2">
        { dialogTitle }
      </DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <DialogContentText
          variant="body1"
          color="#ccc"
          sx={{ paddingBottom: 2 }}
        >
          { dialogDescription }
        </DialogContentText>
        { dialogContent }
      </DialogContent>
      <DialogActions>
        <Stack direction="row" paddingX={ 2 } paddingY={ 1 }>
          { dialogActions }
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default UsersScreenDialog;