import * as React from "react";

import strings from "../../localization/strings";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { MetaformMember, MetaformMemberRole, MetaformMemberRoleFromJSON } from "generated/client";
import * as EmailValidator from "email-validator";
import GenericLoaderWrapper from "components/generic/generic-loader";

/**
 * Interface representing component properties
 */
interface Props {
  loading: boolean;
  open: boolean;
  onCancel: () => void;
  onCreate: (member: MetaformMember) => void;
}

/**
 * React component for add member dialog
 */
const AddMemberGroupDialog: React.FC<Props> = ({
  loading,
  open,
  onCancel,
  onCreate
}) => {
  const [ member, setMember ] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: MetaformMemberRole.Manager
  });

  /**
   * Event handler for text field change
   * 
   * @param event event
   */
  const onTextFieldChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { target: { name, value } } = event;
    const fieldName = name;
    const updatedMember: any = { ...member };
    updatedMember[fieldName] = value;
    setMember(updatedMember);
  };

  /**
   * Event handler for role field change
   * 
   * @param event event
   */
  const onRoleFieldChange = (event: SelectChangeEvent<MetaformMemberRole>) => {
    const { target: { value } } = event;
    const role = MetaformMemberRoleFromJSON(value);
    setMember({ ...member, role: role });
  };

  /**
   * Event handler for name create click
   */
  const onCreateClick = () => {
    onCreate(member);
  };
  
  if (!open) {
    return null;
  }

  const valid = member.firstName && member.lastName && EmailValidator.validate(member.email);

  return (
    <Dialog open={ true } onClose={ onCancel }>
      <DialogTitle variant="h2">{ strings.userManagementScreen.addMemberDialog.title }</DialogTitle>
      <DialogContent style={{ width: 500 }}>
        <DialogContentText variant="body1" color="#ccc" style={{ paddingBottom: 16 }}>
          { strings.userManagementScreen.addMemberDialog.text }
        </DialogContentText>
        <Stack spacing={ 1 }>
          <TextField
            fullWidth
            size="medium"
            required={ true }
            value={ member.email }
            type="email"
            name="email"
            label={ strings.userManagementScreen.addMemberDialog.emailLabel }
            onChange={ onTextFieldChange }
          />
          <TextField
            fullWidth
            size="medium"
            required={ true }
            value={ member.firstName }
            name="firstName"
            label={ strings.userManagementScreen.addMemberDialog.firstNameLabel }
            onChange={ onTextFieldChange }
          />
          <TextField
            fullWidth
            size="medium"
            required={ true }
            name="lastName"
            value={ member.lastName }
            label={ strings.userManagementScreen.addMemberDialog.lastNameLabel }
            onChange={ onTextFieldChange }
          />
          <Select
            value={ member.role }
            label="Age"
            fullWidth
            onChange={ onRoleFieldChange }
          >
            <MenuItem value={ MetaformMemberRole.Administrator }>{ strings.userManagementScreen.addMemberDialog.roleAdministrator }</MenuItem>
            <MenuItem value={ MetaformMemberRole.Manager }>{ strings.userManagementScreen.addMemberDialog.roleManager }</MenuItem>
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions style={{ padding: 24, paddingTop: 0 }}>
        <Button disableElevation variant="contained" onClick={ onCancel } color="secondary" autoFocus>
          { strings.userManagementScreen.addMemberDialog.cancelButton }
        </Button>
        <GenericLoaderWrapper loading={ loading }>
          <Button onClick={ onCreateClick } color="primary" disabled={ !valid }>
            { strings.userManagementScreen.addMemberDialog.createButton }
          </Button>
        </GenericLoaderWrapper>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberGroupDialog;