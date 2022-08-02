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
      <DialogTitle>{ strings.navigationHeader.usersScreens.addMemberGroupDialog.title }</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>
            { strings.navigationHeader.usersScreens.addMemberGroupDialog.text }
          </p>
        </DialogContentText>
        <TextField
          style={{ width: "100%" }}
          required={ true }
          label={ strings.navigationHeader.usersScreens.addMemberGroupDialog.displayNameLabel }
          onChange={ onDisplayNameChange }
        />
      </DialogContent>
      <DialogActions>
        <Button disableElevation variant="contained" onClick={ onCancel } color="secondary" autoFocus>
          { strings.navigationHeader.usersScreens.addMemberGroupDialog.cancelButton }
        </Button>
        <Button onClick={ onCreateClick } color="primary" disabled={ !displayName }>
          { strings.navigationHeader.usersScreens.addMemberGroupDialog.createButton }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberGroupDialog;