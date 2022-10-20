import React, { FC, useState } from "react";
import strings from "../../localization/strings";
import { Button, IconButton, InputAdornment, ListItem, ListItemIcon, MenuItem, Stack, TextField, Tooltip } from "@mui/material";
import { MetaformMember, MetaformMemberRole, User, UserFederationSource } from "generated/client";
import * as EmailValidator from "email-validator";
import GenericLoaderWrapper from "components/generic/generic-loader";
import LinkIcon from "@mui/icons-material/Link";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ClearIcon from "@mui/icons-material/Clear";
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
  const getUsersUpnNumber = (user: User) => {
    const digits = user.displayName?.match(/\d/g);
    return digits?.join("");
  };

  /**
   * Event handler for text field change
   * 
   * @param event event
   */
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { target: { name, value } } = event;
    const fieldName = name;
    const updatedUser: any = { ...selectedUser };
    updatedUser[fieldName] = value;
    setSelectedUser(updatedUser);
  };

  /**
   * Event handler for cancel click
   */
  const handleCancelClick = () => {
    setSelectedUser(undefined);
    onCancel();
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
   * Event handler for search button click
   */
  const handleSearchButtonClick = async () => {
    const users = (await searchUsers(userSearch))
      .filter(user => user.displayName !== API_ADMIN_USER)
      .sort((a: User, b: User) => (a.displayName! < b.displayName! ? -1 : 1));
    // users.sort((a: User, b: User) => (a.displayName! < b.displayName! ? -1 : 1));

    setFoundUsers(users.length <= 10 ? users : users.slice(10));

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
   * Event handler for create button click
   */
  const handleCreateClick = async () => {
    if (!selectedUser) {
      return;
    }

    if (!selectedUser.id) {
      const createdUser = await createUser({
        ...selectedUser,
        username: selectedUser.displayName ?? selectedUser.email
      });

      if (!createdUser) {
        return;
      }

      onCreate({
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        role: MetaformMemberRole.Manager
      });
    } else {
      onCreate({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        role: MetaformMemberRole.Manager
      });
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
        <Tooltip title="TOOLTIPPI">
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
        </Tooltip>
        <Button
          sx={{ flex: 0.25, height: 56 }}
          size="large"
          onClick={ handleSearchButtonClick }
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
        required
        value={ selectedUser?.email ?? "" }
        type="email"
        name="email"
        label={ strings.userManagementScreen.addMemberDialog.emailLabel }
        onChange={ handleTextFieldChange }
      />
      <TextField
        disabled={ !selectedUser ?? loading }
        fullWidth
        size="medium"
        required
        value={ selectedUser?.firstName ?? "" }
        name="firstName"
        label={ strings.userManagementScreen.addMemberDialog.firstNameLabel }
        onChange={ handleTextFieldChange }
      />
      <TextField
        disabled={ !selectedUser ?? loading }
        fullWidth
        size="medium"
        required
        name="lastName"
        value={ selectedUser?.lastName ?? "" }
        label={ strings.userManagementScreen.addMemberDialog.lastNameLabel }
        onChange={ handleTextFieldChange }
      />
      <TextField
        disabled
        fullWidth
        size="medium"
        value={ (selectedUser && getUsersUpnNumber(selectedUser)) ?? "" }
        label={ strings.userManagementScreen.addMemberDialog.upnNumberLabel }
        onChange={ handleTextFieldChange }
      />
    </Stack>
  );

  /**
   * Renders dialog actions
   */
  const renderDialogActions = () => [
    <Button disableElevation variant="contained" onClick={ handleCancelClick } color="secondary" autoFocus>
      { strings.userManagementScreen.addMemberDialog.cancelButton }
    </Button>,
    <GenericLoaderWrapper loading={ loading }>
      <Button onClick={ handleCreateClick } color="primary" disabled={ !valid }>
        { strings.userManagementScreen.addMemberDialog.createButton }
      </Button>
    </GenericLoaderWrapper>
  ];

  return (
    <UsersScreenDialog
      open={ open }
      dialogTitle={ strings.userManagementScreen.addMemberDialog.title }
      dialogDescription={ strings.userManagementScreen.addMemberDialog.text }
      helperIcon
      tooltipText={ strings.generic.notImplemented }
      dialogContent={ renderDialogContent() }
      dialogActions={ renderDialogActions() }
      onCancel={ onCancel }
    />
  );
};

export default AddMemberDialog;