import * as React from "react";

import strings from "../../localization/strings";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { MetaformMember, MetaformMemberRole, MetaformMemberRoleFromJSON } from "generated/client";
import * as EmailValidator from "email-validator";

/**
 * Interface representing component properties
 */
interface Props {
  open: boolean;
  onCancel: () => void;
  onCreate: (member: MetaformMember) => void;
}

/**
 * React component for add member dialog
 */
const AddMemberGroupDialog: React.FC<Props> = ({
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
      <DialogTitle>{ strings.userManagementScreen.addMemberDialog.title }</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>
            { strings.userManagementScreen.addMemberDialog.text }
          </p>
        </DialogContentText>
        <TextField
          style={{ width: "100%" }}
          required={ true }
          value={ member.email }
          type="email"
          name="email"
          label={ strings.userManagementScreen.addMemberDialog.emailLabel }
          onChange={ onTextFieldChange }
        />
        <TextField
          style={{ width: "100%" }}
          required={ true }
          value={ member.firstName }
          name="firstName"
          label={ strings.userManagementScreen.addMemberDialog.firstNameLabel }
          onChange={ onTextFieldChange }
        />
        <TextField
          style={{ width: "100%" }}
          required={ true }
          name="lastName"
          value={ member.lastName }
          label={ strings.userManagementScreen.addMemberDialog.lastNameLabel }
          onChange={ onTextFieldChange }
        />
        <Select
          value={ member.role }
          label="Age"
          onChange={ onRoleFieldChange }
        >
          <MenuItem value={ MetaformMemberRole.Administrator }>{ strings.userManagementScreen.addMemberDialog.roleAdministrator }</MenuItem>
          <MenuItem value={ MetaformMemberRole.Manager }>{ strings.userManagementScreen.addMemberDialog.roleManager }</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button disableElevation variant="contained" onClick={ onCancel } color="secondary" autoFocus>
          { strings.userManagementScreen.addMemberDialog.cancelButton }
        </Button>
        <Button onClick={ onCreateClick } color="primary" disabled={ !valid }>
          { strings.userManagementScreen.addMemberDialog.createButton }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberGroupDialog;