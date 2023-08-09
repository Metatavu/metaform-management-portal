import { User, UserFederationSource } from "generated/client";
import React, { FC, useState } from "react";
import strings from "../../localization/strings";
import * as EmailValidator from "email-validator";
import { Button, IconButton, InputAdornment, MenuItem, Stack, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import UsersScreenDialog from "./users-screen-dialog";
import GenericLoaderWrapper from "components/generic/generic-loader";
import { API_ADMIN_USER } from "consts";

/**
 * Interface representing component properties
 */
interface Props {
  loading: boolean;
  open: boolean;
  onCancel: () => void;
  setLoading: (value: boolean) => void;
  searchUsers: (search: string) => Promise<User[]>;
  editUser: (user: User) => Promise<void>;
}

/**
 * React component for edit member dialog
 */
const EditMemberDialog: FC<Props> = ({
  loading,
  open,
  onCancel,
  setLoading,
  searchUsers,
  editUser
}) => {
  const [ selectedMetaformUser, setSelectedMetaformUser ] = useState<User>();
  const [ selectedCardUser, setSelectedCardUser ] = useState<User>();
  const [ userSearch, setUserSearch ] = useState<string>("");
  const [ foundMetaformUsers, setFoundMetaformUsers ] = useState<User[]>([]);
  const [ linkSwitchChecked, setLinkSwitchChecked ] = useState<boolean>(false);

  /**
   * Event handler for cancel click
   */
  const handleCancelClick = () => {
    setSelectedMetaformUser(undefined);
    setSelectedCardUser(undefined);
    setFoundMetaformUsers([]);
    onCancel();
  };

  /**
   * Event handler for edit button click
   */
  const handleEditClick = async () => {
    if (!selectedMetaformUser) {
      return;
    }

    if (linkSwitchChecked) {
      if (!selectedCardUser) {
        return;
      }
      const federatedUser = selectedCardUser?.federatedIdentities?.find(federatedIdentitty =>
        federatedIdentitty.source === UserFederationSource.Card);

      if (!federatedUser) {
        return;
      }

      await editUser({
        ...selectedMetaformUser,
        username: federatedUser.username,
        federatedIdentities: [ ...selectedMetaformUser.federatedIdentities!, federatedUser ]
      });
    } else {
      await editUser({
        ...selectedMetaformUser,
        username: selectedMetaformUser.email,
        federatedIdentities: []
      });
    }

    handleCancelClick();
    setLoading(false);
  };

  /**
   * Clears search textfield
   */
  const handleSearchClear = () => setUserSearch("");

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
   * Event handler for selecting Metaform Keycloak User
   *
   * @param event event
   */
  const handleMetaformUserSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    const foundUser = foundMetaformUsers.find(user => user.id === value);
    setSelectedMetaformUser(foundUser);
    setLinkSwitchChecked(!!foundUser?.federatedIdentities?.length ?? false);
  };

  /**
   * Searches users by text search
   */
  const handleSearchButtonClick = async () => {
    const users = (await searchUsers(userSearch))
      .filter(user => user.displayName !== API_ADMIN_USER)
      .sort((userA: User, userB: User) => (userA.displayName! < userB.displayName! ? -1 : 1));

    setFoundMetaformUsers(users.filter(user => user.id));
    setLoading(false);
  };

  /**
   * Event handler for text field change
   *
   * @param event event
   */
  const onTextFieldChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { target: { name, value } } = event;
    const fieldName = name;
    const updatedUser: any = { ...selectedMetaformUser };
    updatedUser[fieldName] = value;
    setSelectedMetaformUser(updatedUser);
  };

  const valid = selectedMetaformUser?.firstName && selectedMetaformUser?.lastName && EmailValidator.validate(selectedMetaformUser.email);

  /**
   * Renders metaform users menu items
   */
  const renderMetaformUsersMenuItems = (user: User) => (
    <MenuItem key={ user.id} value={ user.id }>
      { `${user.firstName} ${user.lastName}` }
    </MenuItem>
  );

  /**
   * Renders dialog content
   */
  const renderDialogContent = () => (
    <Stack spacing={ 1 }>
      <Stack
        spacing={ 1 }
        direction="row"
        alignItems="center"
      >
        <TextField
          sx={{ flex: 1 }}
          value={ userSearch }
          onChange={ handleUserSearchChange }
          size="medium"
          label={ strings.userManagementScreen.editMemberDialog.freeTextSearchLabel }
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
          onClick={ handleSearchButtonClick }
          disabled={ loading }
        >
          { strings.userManagementScreen.editMemberDialog.searchButton }
        </Button>
      </Stack>
      <TextField
        select
        fullWidth
        disabled={ !foundMetaformUsers.length }
        size="medium"
        onChange={ handleMetaformUserSelectChange }
        label={ strings.userManagementScreen.editMemberDialog.metaformUsersSelectLabel }
      >
        { foundMetaformUsers.map(renderMetaformUsersMenuItems) }
      </TextField>
      <TextField
        disabled={ !selectedMetaformUser ?? loading }
        fullWidth
        size="medium"
        required={ true }
        value={ selectedMetaformUser?.email ?? "" }
        name="email"
        type="email"
        label={ strings.userManagementScreen.editMemberDialog.emailLabel }
        onChange={ onTextFieldChange }
      />
      <TextField
        disabled={ !selectedMetaformUser ?? loading }
        fullWidth
        size="medium"
        required={ true }
        value={ selectedMetaformUser?.firstName ?? "" }
        name="firstName"
        label={ strings.userManagementScreen.editMemberDialog.firstNameLabel }
        onChange={ onTextFieldChange }
      />
      <TextField
        disabled={ !selectedMetaformUser ?? loading }
        fullWidth
        size="medium"
        required={ true }
        value={ selectedMetaformUser?.lastName ?? "" }
        name="lastName"
        label={ strings.userManagementScreen.editMemberDialog.lastNameLabel }
        onChange={ onTextFieldChange }
      />
    </Stack>
  );

  /**
   * Renders dialog actions
   */
  const renderDialogActions = () => (
    <GenericLoaderWrapper loading={ loading }>
      <>
        <Button disableElevation variant="contained" onClick={ handleCancelClick } color="warning" autoFocus>
          { strings.userManagementScreen.editMemberDialog.cancelButton }
        </Button>
        <Button onClick={ handleEditClick } color="primary" disabled={ !valid }>
          { strings.userManagementScreen.editMemberDialog.editButton }
        </Button>
      </>
    </GenericLoaderWrapper>
  );

  return (
    <UsersScreenDialog
      open={ open }
      dialogTitle={ strings.userManagementScreen.editMemberDialog.title }
      dialogDescription={ strings.userManagementScreen.editMemberDialog.text }
      dialogContent={ renderDialogContent() }
      dialogActions={ renderDialogActions() }
      onCancel={ onCancel }
    />
  );
};

export default EditMemberDialog;