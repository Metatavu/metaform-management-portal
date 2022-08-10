import * as React from "react";

import strings from "../../localization/strings";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

/**
 * Interface representing component properties
 */
interface Props {
  open: boolean;
  onCancel: () => void;
  onCreate: (displayName: string) => void;
}

/**
 * React component for add member group dialogs
 */
const AddMemberGroupDialog: React.FC<Props> = ({
  open,
  onCancel,
  onCreate
}) => {
  const [ displayName, setDisplayName ] = useState("");

  /**
   * Event handler for display name change
   * 
   * @param event event
   */
  const onDisplayNameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setDisplayName(event.target.value);
  };

  /**
   * Event handler for name create click
   */
  const onCreateClick = () => {
    onCreate(displayName);
  };
  
  if (!open) {
    return null;
  }

  return (
    <Dialog open={ true } onClose={ onCancel }>
      <DialogTitle variant="h2">{ strings.userManagementScreen.addMemberGroupDialog.title }</DialogTitle>
      <DialogContent style={{ width: 500 }}>
        <DialogContentText variant="body1" color="#ccc" style={{ paddingBottom: 16 }}>
          { strings.userManagementScreen.addMemberGroupDialog.text }
        </DialogContentText>
        <TextField
          size="medium"
          fullWidth
          required={ true }
          label={ strings.userManagementScreen.addMemberGroupDialog.displayNameLabel }
          onChange={ onDisplayNameChange }
        />
      </DialogContent>
      <DialogActions style={{ padding: 24, paddingTop: 0 }}>
        <Button disableElevation variant="contained" onClick={ onCancel } color="secondary" autoFocus>
          { strings.userManagementScreen.addMemberGroupDialog.cancelButton }
        </Button>
        <Button onClick={ onCreateClick } color="primary" disabled={ !displayName }>
          { strings.userManagementScreen.addMemberGroupDialog.createButton }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberGroupDialog;