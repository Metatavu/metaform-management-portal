import * as React from "react";

import strings from "../../localization/strings";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import GenericLoaderWrapper from "components/generic/generic-loader";

/**
 * Interface representing component properties
 */
interface Props {
  loading: boolean;
  open: boolean;
  onCancel: () => void;
  onCreate: (displayName: string | undefined) => void;
}

/**
 * React component for add member group dialogs
 */
const AddMemberGroupDialog: React.FC<Props> = ({
  loading,
  open,
  onCancel,
  onCreate
}) => {
  const [ displayName, setDisplayName ] = useState<string | undefined>();

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

  /**
   * Event handler for cancel click
   */
  const onCancelClick = () => {
    setDisplayName(undefined);
    onCancel();
  };
  
  if (!open) {
    return null;
  }

  return (
    <Dialog open={ true } onClose={ onCancelClick }>
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
        <Button disableElevation variant="contained" onClick={ onCancelClick } color="secondary" autoFocus>
          { strings.userManagementScreen.addMemberGroupDialog.cancelButton }
        </Button>
        <GenericLoaderWrapper loading={ loading }>
          <Button onClick={ onCreateClick } color="primary" disabled={ !displayName }>
            { strings.userManagementScreen.addMemberGroupDialog.createButton }
          </Button>
        </GenericLoaderWrapper>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberGroupDialog;