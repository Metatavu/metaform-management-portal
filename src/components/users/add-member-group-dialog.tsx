import * as React from "react";
import strings from "../../localization/strings";
import { useState } from "react";
import { Button, TextField } from "@mui/material";
import GenericLoaderWrapper from "components/generic/generic-loader";
import UsersScreenDialog from "./users-screen-dialog";

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

  /**
   * Renders dialog content
   */
  const renderDialogContent = () => (
    <TextField
      size="medium"
      fullWidth
      required={ true }
      label={ strings.userManagementScreen.addMemberGroupDialog.displayNameLabel }
      onChange={ onDisplayNameChange }
    />
  );
  
  /**
   * Renders dialog actions
   */
  const renderDialogActions = () => [
    <Button disableElevation variant="contained" onClick={ onCancelClick } color="secondary" autoFocus>
      { strings.userManagementScreen.addMemberGroupDialog.cancelButton }
    </Button>,
    <GenericLoaderWrapper loading={ loading }>
      <Button onClick={ onCreateClick } color="primary" disabled={ !displayName }>
        { strings.userManagementScreen.addMemberGroupDialog.createButton }
      </Button>
    </GenericLoaderWrapper>
  ];

  return (
    <UsersScreenDialog
      open={ open }
      dialogTitle={ strings.userManagementScreen.addMemberGroupDialog.title }
      dialogDescription={ strings.userManagementScreen.addMemberGroupDialog.text }
      dialogContent={ renderDialogContent() }
      dialogActions={ renderDialogActions() }
      onCancel={ onCancel }
    />
  );
};

export default AddMemberGroupDialog;