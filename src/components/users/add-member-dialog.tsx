import React, { useState } from "react";
import strings from "../../localization/strings";
import { Autocomplete, AutocompleteChangeDetails, AutocompleteRenderOptionState, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItem, ListItemIcon, Stack, TextField } from "@mui/material";
import { MetaformMember, MetaformMemberRole, User } from "generated/client";
import * as EmailValidator from "email-validator";
import GenericLoaderWrapper from "components/generic/generic-loader";
import LinkIcon from "@mui/icons-material/Link";
import SdCardIcon from "@mui/icons-material/SdCard";
import { useApiClient } from "app/hooks";
import Api from "api";
/* eslint-disable */
/**
 * Interface representing component properties
 */
interface Props {
  loading: boolean;
  open: boolean;
  onCancel: () => void;
  onCreate: (member: MetaformMember) => void;
  setLoading: (value: boolean) => void;
}
/**
 * React component for add member dialog
 */
const AddMemberGroupDialog: React.FC<Props> = ({
  loading,
  open,
  onCancel,
  onCreate,
  setLoading
}) => {
  const apiClient = useApiClient(Api.getApiClient);
  const { usersApi } = apiClient;
  const [ member, setMember ] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: MetaformMemberRole.Manager
  });
  const [ selectedUser, setSelectedUser ] = useState<User | undefined>();
  const [ userSearch, setUserSearch ] = useState<string>("");
  const [ foundUsers, setFoundUsers ] = useState<User[]>([]);

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
   * Event handler for free text search change
   * 
   * @param event event
   */
  const handleUserSearchChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target: { value } } = event;
    setUserSearch(value);
  };

  /**
   * Searches users by text search
   */
  const searchUsers = async () => {
    setLoading(true);

    try {
      const users = await usersApi.listUsers({  search: userSearch });
      setFoundUsers(users);
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
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
          <GenericLoaderWrapper
            loading={ loading }
          >
            <Stack spacing={ 1 } direction="row">
              <Autocomplete
                disablePortal
                fullWidth
                freeSolo
                id="combo-box-demo"
                options={ foundUsers }
                sx={{ border: 0 }}
                onChange={ (event, options, reason, details) => handleAutocompleteChange(details) }
                getOptionLabel={ option => `${(option as User).firstName} ${(option as User).lastName}` }
                renderOption={ (props, option, state) => renderAutocompleteOption(props, option, state) }
                renderInput={ params =>
                  <TextField
                    {...params}
                    size="medium"
                    onChange={ handleUserSearchChange }
                    value={ userSearch }
                    label={ strings.userManagementScreen.addMemberDialog.freeTextSearchLabel }
                  />
                }
              />
              <Button
                sx={{ flex: 0.25 }}
                size="large"
                onClick={ searchUsers }
              >
                { strings.userManagementScreen.addMemberDialog.searchButton }
              </Button>
            </Stack>
          </GenericLoaderWrapper>
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