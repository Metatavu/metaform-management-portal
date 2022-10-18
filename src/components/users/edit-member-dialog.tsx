import { ErrorContext } from "components/contexts/error-handler";
import { User, UserFederationSource } from "generated/client";
import React, { useState } from "react";
import strings from "../../localization/strings";
import * as EmailValidator from "email-validator";
import { useApiClient } from "app/hooks";
import Api from "api";
import { Button, IconButton, InputAdornment, MenuItem, Stack, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import UsersScreenDialog from "./users-screen-dialog";
import GenericLoaderWrapper from "components/generic/generic-loader";

const API_ADMIN_USER = "api-admin";
const EMPTY_SELECTION = "EMPTY_SELECTION";

/**
 * Interface representing component properties
 */
interface Props {
  loading: boolean;
  open: boolean;
  onCancel: () => void;
  onEdit: (user: User) => void;
  setLoading: (value: boolean) => void;
}
/* eslint-disable */
/**
 * React component for edit member dialog
 */
const EditMemberDialog: React.FC<Props> = ({
  loading,
  open,
  onCancel,
  onEdit,
  setLoading
}) => {
  const errorContext = React.useContext(ErrorContext);
  const apiClient = useApiClient(Api.getApiClient);
  const { usersApi } = apiClient;
  const [ selectedMetaformUser, setSelectedMetaformUser ] = useState<User | undefined>();
  const [ selectedCardUser, setSelectedCardUser ] = useState<User | undefined>();
  const [ updatedUser, setUpdatedUser ] = useState<User | undefined>();
  const [ userSearch, setUserSearch ] = useState<string>("");
  const [ foundMetaformUsers, setFoundMetaformUsers ] = useState<User[]>([]);
  const [ foundCardUsers, setFoundCardUsers ] = useState<User[]>([]);

  /**
   * Event handler for create button click
   */
  const onEditClick = async () => {
    setLoading(true);

    try {
      if (selectedCardUser === undefined) {
        if (!selectedMetaformUser) return;
        await usersApi.updateUser({
          userId: selectedMetaformUser?.id!,
          user: { ...selectedMetaformUser, federatedIdentities: [] }
        });
      }
    } catch (e) {
      errorContext.setError((e as string).toString(), e);
    }

    setLoading(false);
  };

  /**
   * Event handler for cancel click
   */
  const onCancelClick = () => {
    onCancel();
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
  const handleMetaformUserSelectChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    setSelectedMetaformUser(foundMetaformUsers.find(user => user.id === value));
  };

  /**
   * Event handler for selecting Card Auth Keycloak User
   * 
   * @param event event
   */
  const handleCardUserSelectChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    
    if (value === EMPTY_SELECTION) {
      setSelectedCardUser(undefined);
      return;
    }

    const federatedUser = foundCardUsers.find(user =>
      user.federatedIdentities?.find(federatedIdentity => federatedIdentity.userId === value));
    setSelectedCardUser(federatedUser);
  };

  /**
   * Searches users by text search
   */
  const searchUsers = async () => {
    setLoading(true);

    try {
      const users = await usersApi.listUsers({ search: userSearch });
      const filteredUsers = users
        .filter(user => user.displayName !== API_ADMIN_USER)
        .sort((a: User, b: User) => (a.displayName! < b.displayName! ? -1 : 1));
      setFoundMetaformUsers(filteredUsers.filter(user => user.id));
      setFoundCardUsers(filteredUsers.filter(user => !user.id));
    } catch (e) {
      errorContext.setError(strings.errorHandling.usersScreen.loadUsers, e);
    }

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

  const valid = updatedUser?.firstName && updatedUser?.lastName && EmailValidator.validate(updatedUser.email);
  
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
          onClick={ searchUsers }
          disabled={ loading }
        >
          { strings.userManagementScreen.editMemberDialog.searchButton }
        </Button>
      </Stack>
      <TextField
        select
        fullWidth
        size="medium"
        onChange={ handleMetaformUserSelectChange }
        label={ strings.userManagementScreen.editMemberDialog.metaformUsersSelectLabel }
      >
        { foundMetaformUsers.map(user =>
          <MenuItem key={ user.id} value={ user.id }>
            { `${user.firstName} ${user.lastName}` }
          </MenuItem>)
        }
      </TextField>
      <TextField
        select
        fullWidth
        size="medium"
        onChange={ handleCardUserSelectChange }
        label={ strings.userManagementScreen.editMemberDialog.cardAuthUsersSelectLabel }
      >
        <MenuItem value={ EMPTY_SELECTION }>
          { strings.userManagementScreen.editMemberDialog.emptySelection }
        </MenuItem>
        { foundCardUsers.map(user => {
          const federatedUser = user.federatedIdentities?.find(federatedIdentity => federatedIdentity.source === UserFederationSource.Card);
          return (
            <MenuItem key={ user.displayName} value={ federatedUser?.userId }>
              { `${user.firstName} ${user.lastName}` }
            </MenuItem>);
        })
        }
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
      <TextField
        disabled={ !selectedMetaformUser ?? loading }
        fullWidth
        size="medium"
        required={ true }
        name="upnNumber"
        label={ strings.userManagementScreen.editMemberDialog.upnNumberLabel }
        onChange={ onTextFieldChange }
      />
    </Stack>
  );

  /**
   * Renders dialog actions
   */
  const renderDialogActions = () => [
    <Button disableElevation variant="contained" onClick={ onCancelClick } color="secondary" autoFocus>
      { strings.userManagementScreen.editMemberDialog.cancelButton }
    </Button>,
    <GenericLoaderWrapper loading={ loading }>
      <Button onClick={ onEditClick } color="primary" disabled={ false }>
        { strings.userManagementScreen.editMemberDialog.editButton }
      </Button>
    </GenericLoaderWrapper>
  ];

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