import React, { useEffect, useContext, useState } from "react";
import Api from "api";
import strings from "localization/strings";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { PersonAdd, GroupAdd, Edit } from "@mui/icons-material";
import { ErrorContext } from "components/contexts/error-handler";
import { useApiClient, useAppDispatch } from "app/hooks";
import { Metaform, MetaformMember, MetaformMemberGroup, User } from "generated/client";
import AddMemberGroupDialog from "components/users/add-member-group-dialog";
import UsersTable from "components/users/users-table";
import CardAuthFeatureAddMemberDialog from "components/users/card-auth-feature-add-member-dialog";
import UsersFilter from "components/users/users-filter";
import { RoundActionButton } from "styled/generic/form";
import theme from "theme";
import CardAuthFeatureEditMemberDialog from "components/users/card-auth-feature-edit-member-dialog";
import { setSnackbarMessage } from "features/snackbar-slice";
import Feature from "components/containers/feature";
import { FeatureStrategy, FeatureType } from "types";
import AddMemberDialog from "components/users/add-member-dialog";
import EditMemberDialog from "components/users/edit-member-dialog";

/**
 * Users screen component
 */
const UsersScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);
  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, metaformMemberGroupsApi, metaformMembersApi, usersApi } = apiClient;

  const dispatch = useAppDispatch();

  const [ loading, setLoading ] = useState<boolean>(false);
  const [ loadingMemberId, setLoadingMemberId ] = useState<string>();
  const [ metaforms, setMetaforms ] = useState<Metaform[]>([]);
  const [ memberGroups, setMemberGroups ] = useState<MetaformMemberGroup[]>([]);
  const [ members, setMembers ] = useState<MetaformMember[]>([]);
  const [ selectedMetaformId, setSelectedMetaformId ] = useState<string>();
  const [ selectedMemberGroupId, setSelectedMemberGroupId ] = useState<string>();
  const [ addMemberGroupOpen, setAddMemberGroupOpen ] = useState<boolean>(false);
  const [ addMemberOpen, setAddMemberOpen ] = useState<boolean>(false);
  const [ editMemberOpen, setEditMemberOpen ] = useState<boolean>(false);

  /**
   * Searches users from the API
   * 
   * @param search search
   */
  const searchUsers = async (search: string): Promise<User[]> => {
    setLoading(true);

    try {
      const users = await usersApi.listUsers({ search: search });
      
      return users;
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.loadUsers, err);
    }

    setLoading(false);

    return [];
  };

  /**
   * Creates new User
   * 
   * @param user user
   */
  const createUser = async (user: User): Promise<User | undefined> => {
    setLoading(true);
    
    try {
      const createdUser = await usersApi.createUser({ user: user });

      return createdUser;
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.createUser, err);
    }

    setLoading(false);
  };

  /**
   * Edits User
   * 
   * @param user User
   */
  const editUser = async (user: User) => {
    setLoading(true);

    try {
      await usersApi.updateUser({
        userId: user.id!,
        user: user
      });

      dispatch(setSnackbarMessage(strings.successSnackbars.users.editUserSuccessText));
    } catch (e) {
      errorContext.setError(strings.errorHandling.usersScreen.updateUser, e);
    }
  };

  /**
   * Load metaforms from the API
   */
  const loadMetaforms = async () => {
    try {
      setLoading(true);
      setMetaforms(await metaformsApi.listMetaforms({ }));
      setLoading(false);
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.loadMetaforms, err);
    }
  };

  /**
   * Load metaform member groups from the API
   */
  const loadMemberGroups = async () => {
    if (!selectedMetaformId) {
      setMemberGroups([]);
      return;
    }

    try {
      setMemberGroups(await metaformMemberGroupsApi.listMetaformMemberGroups({
        metaformId: selectedMetaformId
      }));
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.loadMemberGroups, err);
    }
  };

  /**
   * Load metaform members from the API
   */
  const loadMetaformMembers = async () => {
    if (!selectedMetaformId) {
      setMembers([]);
      return;
    }

    try {
      setMembers(await metaformMembersApi.listMetaformMembers({
        metaformId: selectedMetaformId
      }));
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.loadMembers, err);
    }
  };

  /**
   * Loads members and groups
   */
  const loadMembersAndGroups = async () => {
    setLoading(true);

    await Promise.all([
      loadMemberGroups(),
      loadMetaformMembers()
    ]);

    setLoading(false);
  };

  /**
   * Event handler for group membership removal from member
   *
   * @param metaformMember metaform member
   * @param groupId group id
   */
  const onGroupMembershipRemove = async (metaformMember: MetaformMember, groupId: string) => {
    if (!selectedMetaformId) {
      return;
    }

    setLoadingMemberId(metaformMember.id);

    try {
      const memberGroup = memberGroups.find(metaformMemberGroup => metaformMemberGroup.id === groupId);
      if (!memberGroup) {
        errorContext.setError(strings.errorHandling.usersScreen.removeMemberNotFound);
        return;
      }

      const updatedGroup = await metaformMemberGroupsApi.updateMetaformMemberGroup({
        metaformId: selectedMetaformId,
        metaformMemberGroupId: groupId,
        metaformMemberGroup: { ...memberGroup, memberIds: memberGroup.memberIds.filter(memberId => memberId !== metaformMember.id) }
      });

      const updatedGroups = memberGroups.map(metaformMemberGroup => (metaformMemberGroup.id === updatedGroup.id ? updatedGroup : metaformMemberGroup));

      dispatch(setSnackbarMessage(strings.successSnackbars.users.groupMembershipRemoveSuccessText));
      setMemberGroups(updatedGroups);
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.loadMembers, err);
    }

    setLoadingMemberId(undefined);
  };

  /**
   * Event handler for group membership add to member
   *
   * @param metaformMember metaform member
   * @param groupId group id
   */
  const onGroupMembershipAdd = async (metaformMember: MetaformMember, groupId: string) => {
    if (!selectedMetaformId) {
      return;
    }

    setLoadingMemberId(metaformMember.id);

    try {
      const memberGroup = memberGroups.find(metaformMemberGroup => metaformMemberGroup.id === groupId);
      if (!memberGroup) {
        errorContext.setError(strings.errorHandling.usersScreen.addMemberNotFound);
        return;
      }

      const updatedGroup = await metaformMemberGroupsApi.updateMetaformMemberGroup({
        metaformId: selectedMetaformId,
        metaformMemberGroupId: groupId,
        metaformMemberGroup: { ...memberGroup, memberIds: [ ...memberGroup.memberIds, metaformMember.id! ] }
      });

      const updatedGroups = memberGroups.map(metaformMemberGroup => (metaformMemberGroup.id === updatedGroup.id ? updatedGroup : metaformMemberGroup));

      dispatch(setSnackbarMessage(strings.successSnackbars.users.groupMembershipAddSuccessText));
      setMemberGroups(updatedGroups);
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.loadMembers, err);
    }

    setLoadingMemberId(undefined);
  };

  /**
   * Event handler for member group dialog create
   *
   * @param displayName group's display name
   */
  const onAddMemberGroupDialogCreate = async (displayName: string | undefined) => {
    if (!selectedMetaformId || !displayName) {
      return;
    }

    setLoading(true);

    try {
      const createdMemberGroup = await metaformMemberGroupsApi.createMetaformMemberGroup({
        metaformId: selectedMetaformId,
        metaformMemberGroup: {
          memberIds: [],
          displayName: displayName
        }
      });

      dispatch(setSnackbarMessage(strings.successSnackbars.users.addMemberGroupSuccessText));
      setMemberGroups([ ...memberGroups, createdMemberGroup ]);
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.createMemberGroup, err);
    }

    setAddMemberGroupOpen(false);
    setLoading(false);
  };

  /**
   * Event handler for member dialog create
   *
   * @param member member's details
   */
  const onAddMemberDialogCreate = async (member: MetaformMember) => {
    if (!selectedMetaformId) {
      return;
    }

    setLoading(true);

    try {
      const createdMember = await metaformMembersApi.createMetaformMember({
        metaformId: selectedMetaformId,
        metaformMember: member
      });

      dispatch(setSnackbarMessage(strings.successSnackbars.users.addMemberSuccessText));
      setMembers([ ...members, createdMember ]);
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.createMember, err);
    }

    setAddMemberOpen(false);
    setLoading(false);
  };

  /**
   * New member group button click listener
   */
  const onNewMemberGroupButtonClick = () => setAddMemberGroupOpen(true);

  /**
   * Event handler for member group dialog cancel
   */
  const onAddMemberGroupDialogCancel = () => setAddMemberGroupOpen(false);

  /**
   * New member button click listener
   */
  const onNewMemberButtonClick = () => setAddMemberOpen(true);

  /**
   * Event handler for member dialog cancel
   */
  const onAddMemberDialogCancel = () => setAddMemberOpen(false);

  /**
   * Edit User button click listener
   */
  const onEditMemberButtonClick = () => setEditMemberOpen(true);

  /**
   * Event handler for User edit dialog cancel
   */
  const onEditMemberDialogCancel = () => setEditMemberOpen(false);
  
  useEffect(() => {
    loadMetaforms();
  }, []);

  useEffect(() => {
    loadMembersAndGroups();
  }, [ selectedMetaformId, metaforms ]);

  return (
    <>
      <Feature
        replacement={
          <AddMemberDialog
            loading={ loading }
            open={ addMemberOpen }
            onCreate={ onAddMemberDialogCreate }
            onCancel={ onAddMemberDialogCancel }
            setLoading={ setLoading }
            searchUsers={ searchUsers }
            createUser={ createUser }
          />
        }
        feature={FeatureType.CARD_AUTH}
        strategy={FeatureStrategy.REPLACE}
      >
        <CardAuthFeatureAddMemberDialog
          loading={ loading }
          open={ addMemberOpen }
          onCreate={ onAddMemberDialogCreate }
          onCancel={ onAddMemberDialogCancel }
          setLoading={ setLoading }
          searchUsers={ searchUsers }
          createUser={ createUser }
        />
      </Feature>

      <AddMemberGroupDialog
        loading={ loading }
        open={ addMemberGroupOpen }
        onCreate={ onAddMemberGroupDialogCreate }
        onCancel={ onAddMemberGroupDialogCancel }
      />

      <Feature
        replacement={
          <EditMemberDialog
            loading={ loading }
            open={ editMemberOpen }
            setLoading={ setLoading }
            onCancel={ onEditMemberDialogCancel }
            searchUsers={ searchUsers }
            editUser={ editUser }
          />
        }
        feature={FeatureType.CARD_AUTH}
        strategy={FeatureStrategy.REPLACE}
      >
        <CardAuthFeatureEditMemberDialog
          loading={ loading }
          open={ editMemberOpen }
          setLoading={ setLoading }
          onCancel={ onEditMemberDialogCancel }
          searchUsers={ searchUsers }
          editUser={ editUser }
        />
      </Feature>

      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.usersScreens.subheader }
        />
        <RoundActionButton
          variant="outlined"
          endIcon={ <Edit/> }
          onClick={ onEditMemberButtonClick }
          sx={{ mr: theme.spacing(2) }}
        >
          { strings.userManagementScreen.editMemberButton }
        </RoundActionButton>
        <RoundActionButton
          disabled={ !selectedMetaformId }
          variant="outlined"
          endIcon={ <PersonAdd/> }
          onClick={ onNewMemberButtonClick }
          sx={{ mr: theme.spacing(2) }}
        >
          { strings.userManagementScreen.addMemberButton }
        </RoundActionButton>
        <RoundActionButton
          disabled={ !selectedMetaformId }
          variant="outlined"
          endIcon={ <GroupAdd/> }
          onClick={ onNewMemberGroupButtonClick }
          sx={{ mr: theme.spacing(2) }}
        >
          { strings.userManagementScreen.addMemberGroupButton }
        </RoundActionButton>
      </NavigationTabContainer>
      <UsersFilter
        loading={ loading }
        metaforms={ metaforms }
        memberGroups={ memberGroups }
        selectedMetaformId={ selectedMetaformId }
        selectedMemberGroupId={ selectedMemberGroupId }
        setSelectedMetaformId={ setSelectedMetaformId }
        setSelectedMemberGroupId={ setSelectedMemberGroupId }
      />
      <UsersTable
        loading={ loading }
        loadingMemberId={ loadingMemberId }
        memberGroups={ memberGroups }
        members={ members }
        selectedMemberGroupId={ selectedMemberGroupId }
        onGroupMembershipAdd={ onGroupMembershipAdd }
        onGroupMembershipRemove={ onGroupMembershipRemove }
      />
    </>
  );
};

export default UsersScreen;