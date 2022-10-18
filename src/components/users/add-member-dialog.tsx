import React, { FC, useState } from "react";
import strings from "../../localization/strings";
import { Button, IconButton, InputAdornment, ListItem, ListItemIcon, MenuItem, Stack, TextField } from "@mui/material";
import { MetaformMember, MetaformMemberRole, User, UserFederationSource } from "generated/client";
import * as EmailValidator from "email-validator";
import GenericLoaderWrapper from "components/generic/generic-loader";
import LinkIcon from "@mui/icons-material/Link";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ClearIcon from "@mui/icons-material/Clear";
import { useApiClient } from "app/hooks";
import Api from "api";
import { ErrorContext } from "components/contexts/error-handler";
import UsersScreenDialog from "./users-screen-dialog";

const API_ADMIN_USER = "api-admin";

/**
 * Interface representing component properties
 */
interface Props {
  loading: boolean;
  open: boolean;
  onCancel: () => void;
  onCreate: (member: MetaformMember) => void;
  setLoading: (value: boolean) => void;
  searchUsers: (search: string) => Promise<User[]>;
  createUser: (user: User) => Promise<User | undefined>;
}

/**
 * React component for add member dialog
 */
const AddMemberDialog: React.FC<Props> = ({
  loading,
  open,
  onCancel,
  onCreate,
  setLoading,
  searchUsers,
  createUser
}) => {
  const errorContext = React.useContext(ErrorContext);
  const apiClient = useApiClient(Api.getApiClient);
  const { usersApi } = apiClient;
  const [ selectedUser, setSelectedUser ] = useState<User | undefined>();
  const [ userSearch, setUserSearch ] = useState<string>("");
  const [ foundUsers, setFoundUsers ] = useState<User[]>([]);

  /**
   * Renders correct icon for User selection dialog
   * 
   * @param user User
   */
  const renderSelectOptionIcon = (user: User) => {
    if (!user.id) {
      return <CreditCardIcon/>;
    }
    const userIsLinkedToCard = user.federatedIdentities?.some(federatedIdentity => federatedIdentity.source === UserFederationSource.Card);
    if (userIsLinkedToCard) {
      return <LinkIcon/>;
    }
  };

  /**
   * Gets Users UPN number from their display name
   * 
   * @param user User
   */
  const getUsersUPNNumber = (user: User) => {
    const digits = user.displayName?.match(/\d/g);
    return digits?.join("");
  };

  /**
   * Event handler for text field change
   * 
   * @param event event
   */
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (!selectedUser) {
      return;
    }

    const { target: { name, value } } = event;
    const fieldName = name;
    const updatedUser: any = { ...selectedUser };
    updatedUser[fieldName] = value;
    setSelectedUser(updatedUser);
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
   * Event handler for selecting user
   * 
   * @param event event
   */
  const handleSelectChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    const metaformKeycloakUser = foundUsers.find(user => user.id === value);

    if (metaformKeycloakUser) {
      setSelectedUser(metaformKeycloakUser);
    } else {
      setSelectedUser(foundUsers.find(user => user.displayName === value));
    }
  };

  /**
   * Searches users by text search
   */
  const handleSelectChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    const metaformKeycloakUser = foundUsers.find(user => user.id === value);

    try {
      const users = await usersApi.listUsers({ search: userSearch });
      users.sort((a: User, b: User) => (a.displayName! < b.displayName! ? -1 : 1));
      const filteredUsers = users.filter((user: User, idx: number) => user.displayName !== API_ADMIN_USER && idx < 10);
      setFoundUsers(filteredUsers);
    } catch (e) {
      errorContext.setError(strings.errorHandling.usersScreen.loadUsers, e);
    }
  };

  /**
   * Event handler for search button click
   */
  const handleSearchButtonClick = async () => {
    const users = (await searchUsers(userSearch))
      .filter(user => user.displayName !== API_ADMIN_USER)
      .sort((a: User, b: User) => (a.displayName! < b.displayName! ? -1 : 1));

    setFoundUsers(users);
    setLoading(false);
  };

  /**
   * Clears search textfield
   */
  const handleSearchClear = () => setUserSearch("");

  /**
   * Event handler for name create click
   */
  const onCreateClick = async () => {
    setLoading(true);

    if (!selectedUser) {
      return;
    }

    try {
      if (!selectedUser.id) {
        const userToCreate: User = {
          ...selectedUser,
          username: selectedUser.displayName ?? selectedUser.email
        };
        const createdUser = await usersApi.createUser({ user: userToCreate });
        const { firstName, lastName, email } = createdUser;
        onCreate({
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: MetaformMemberRole.Manager
        });
      } else {
        const { firstName, lastName, email } = selectedUser;
        onCreate({
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: MetaformMemberRole.Manager
        });
      }
    } catch (e) {
      errorContext.setError(strings.errorHandling.usersScreen.createUser, e);
    }

    setLoading(false);
  };

  /**
   * Renders select box items
   */
  const renderSelectableUsers = (user: User) => (
    <MenuItem key={ user.id ?? user.displayName } component={ ListItem } value={ user.id ?? user.displayName }>
      <ListItemIcon>
        { renderSelectOptionIcon(user) }
      </ListItemIcon>
      { user.displayName }
    </MenuItem>
  );

  const valid = selectedUser?.firstName && selectedUser?.lastName && EmailValidator.validate(selectedUser?.email);

  /**
   * Renders dialog content
   */
  const renderDialogContent = () => (
    <Stack spacing={ 1 }>
      <Stack spacing={ 1 } direction="row" alignItems="center">
        <TextField
          sx={{ flex: 1 }}
          value={ userSearch }
          onChange={ handleUserSearchChange }
          size="medium"
          label={ strings.userManagementScreen.addMemberDialog.freeTextSearchLabel }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={ !userSearch } onClick={ handleSearchClear }>
                  <ClearIcon/>
                </IconButton>
              </InputAdornment>)
          }}
        />
        <Button
          sx={{ flex: 0.25, height: 56 }}
          size="large"
          onClick={ searchUsers }
          disabled={ loading }
        >
          { strings.userManagementScreen.addMemberDialog.searchButton }
        </Button>
      </Stack>
      <TextField
        select
        fullWidth
        size="medium"
        onChange={ handleSelectChange }
        label={ strings.userManagementScreen.addMemberDialog.usersSelectLabel }
      >
        { foundUsers.map(renderSelectableUsers) }
      </TextField>
      <TextField
        disabled={ !selectedUser ?? loading }
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
        disabled={ !selectedUser ?? loading }
        fullWidth
        size="medium"
        required={ true }
        value={ selectedUser?.firstName ?? "" }
        name="firstName"
        label={ strings.userManagementScreen.addMemberDialog.firstNameLabel }
        onChange={ onTextFieldChange }
      />
      <TextField
        disabled={ !selectedUser ?? loading }
        fullWidth
        size="medium"
        required={ true }
        name="lastName"
        value={ selectedUser?.lastName ?? "" }
        label={ strings.userManagementScreen.addMemberDialog.lastNameLabel }
        onChange={ onTextFieldChange }
      />
      <TextField
        disabled={ !selectedUser ?? loading }
        fullWidth
        size="medium"
        value={ (selectedUser && getUsersUPNNumber(selectedUser)) ?? "" }
        label={ strings.userManagementScreen.addMemberDialog.upnNumberLabel }
        onChange={ onTextFieldChange }
        required={ true }
        name="upnNumber"
      />
    </Stack>
  );

  /**
   * Renders dialog actions
   */
  const renderDialogActions = () => [
    <Button disableElevation variant="contained" onClick={ onCancel } color="secondary" autoFocus>
      { strings.userManagementScreen.addMemberDialog.cancelButton }
    </Button>,
    <GenericLoaderWrapper loading={ loading }>
      <Button onClick={ onCreateClick } color="primary" disabled={ !valid }>
        { strings.userManagementScreen.addMemberDialog.createButton }
      </Button>
    </GenericLoaderWrapper>
  ];

  return (
    <UsersScreenDialog
      open={ open }
      dialogTitle={ strings.userManagementScreen.addMemberDialog.title }
      dialogDescription={ strings.userManagementScreen.addMemberDialog.text }
      dialogContent={ renderDialogContent() }
      dialogActions={ renderDialogActions() }
      onCancel={ onCancel }
    />
  );
};

export default AddMemberDialog;