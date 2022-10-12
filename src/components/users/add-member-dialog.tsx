import React, { useState } from "react";
import strings from "../../localization/strings";
import { Autocomplete, AutocompleteChangeDetails, AutocompleteRenderOptionState, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItem, ListItemIcon, Stack, TextField } from "@mui/material";
import { MetaformMember, MetaformMemberRole, User, UserFederationSource } from "generated/client";
import * as EmailValidator from "email-validator";
import GenericLoaderWrapper from "components/generic/generic-loader";
import LinkIcon from "@mui/icons-material/Link";
import SdCardIcon from "@mui/icons-material/SdCard";

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
  const [ selectedUser, setSelectedUser ] = useState<User | undefined>();

  const users: User[] = [
    {
      firstName: "Tommi",
      lastName: "Turmiola",
      email: "tommi.turmiola@example.com",
      displayName: "turmiola tommi",
      id: "4d561993-c2e7-497d-bd7e-8258bb48fa4d"
    },
    {
      firstName: "Käyttäjä1",
      lastName: "Testi",
      email: "käyttäjä1.testi@example.com",
      id: "1cb13a4c-b81b-436a-b5da-9bf9bcb5ed3f",
      displayName: "testi käyttäjä1 12345678901",
      federatedIdentities: [{
        source: UserFederationSource.Card,
        userId: "24e33737-4bba-4711-970b-e9bccdf2bc87",
        userName: "testi käyttäjä1 12345678901"
      }]
    },
    {
      firstName: "Käyttäjä2",
      lastName: "Testi",
      email: "käyttäjä2.testi@example.com",
      id: "532a92b3-62c9-46ff-9fff-5c070e4574f3",
      displayName: "testi käyttäjä2 12345678902",
      federatedIdentities: [{
        source: UserFederationSource.Card,
        userId: "0ad9ace8-f690-4256-a6c3-5d4e41553a26",
        userName: "testi käyttäjä2 12345678902"
      }]
    },
    {
      firstName: "Käyttäjä3",
      lastName: "Testi",
      email: "käyttäjä3.testi@example.com",
      displayName: "testi käyttäjä3 12345678902",
      federatedIdentities: []
    }
  ];

  /**
   * Renders correct icon for User selection dialog
   */
  const renderAutoCompleteOptionIcon = (user: User) => {
    if (user.federatedIdentities?.length) {
      return <LinkIcon/>;
    }
    if (!user.id) {
      return <SdCardIcon/>;
    }
  };

  /**
   * Renders autocomplete option
   * 
   * @param props props
   * @param option User
   * @param state state
   */
  const renderAutocompleteOption = (props: React.HTMLAttributes<HTMLLIElement>, option: User, state: AutocompleteRenderOptionState) => (
    <ListItem { ...props } selected={ state.selected }>
      <ListItemIcon>
        { renderAutoCompleteOptionIcon(option) }
      </ListItemIcon>
      { `${option.firstName} ${option.lastName}` }
    </ListItem>
  );

  /**
   * Event handler for AutoComplete field change
   * 
   * @param event event
   */
  const handleAutocompleteChange = (details?: AutocompleteChangeDetails<User | undefined>) => {
    if (details) {
      setSelectedUser(details.option);
    }
  };

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
          <Stack spacing={ 1 } direction="row">
            <Autocomplete
              disablePortal
              fullWidth
              id="combo-box-demo"
              options={ users }
              sx={{ border: 0 }}
              onChange={ (event, options, reason, details) => handleAutocompleteChange(details) }
              getOptionLabel={ option => `${option.firstName} ${option.lastName}` }
              renderOption={ (props, option, state) => renderAutocompleteOption(props, option, state) }
              renderInput={ params =>
                <TextField
                  {...params}
                  size="medium"
                  label={ strings.userManagementScreen.addMemberDialog.freeTextSearchLabel }
                />
              }
            />
            {/* <TextField
              sx={{ flex: 1 }}
              fullWidth
              size="medium"
              name="freeTextSearch"
              label={ strings.userManagementScreen.addMemberDialog.freeTextSearchLabel }
            /> */}
            <Button
              sx={{ flex: 0.25 }}
              size="medium"
            >
              { strings.userManagementScreen.addMemberDialog.searchButton }
            </Button>
          </Stack>
          <TextField
            disabled
            fullWidth
            size="medium"
            required={ true }
            value={ selectedUser?.email ?? "" }
            type="email"
            name="email"
            label={ strings.userManagementScreen.addMemberDialog.emailLabel }
            onChange={ onTextFieldChange }
          />
          <TextField
            disabled
            fullWidth
            size="medium"
            required={ true }
            value={ selectedUser?.firstName ?? "" }
            name="firstName"
            label={ strings.userManagementScreen.addMemberDialog.firstNameLabel }
            onChange={ onTextFieldChange }
          />
          <TextField
            disabled
            fullWidth
            size="medium"
            required={ true }
            name="lastName"
            value={ selectedUser?.lastName ?? "" }
            label={ strings.userManagementScreen.addMemberDialog.lastNameLabel }
            onChange={ onTextFieldChange }
          />
          <TextField
            disabled
            fullWidth
            size="medium"
            value={ selectedUser?.displayName?.split(" ")[2] ?? "" }
            label={ strings.userManagementScreen.addMemberDialog.upnNumberLabel }
            onChange={ onTextFieldChange }
            required={ true }
            name="upnNumber"
          />
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