import React from "react";
import Api from "api";
import strings from "localization/strings";
import NavigationTab from "components/layouts/navigations/navigation-tab";

import { NewUserButton, NewMemberGroupButton } from "styled/layouts/admin-layout";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { PersonAdd, GroupAdd } from "@mui/icons-material";
import { ErrorContext } from "components/contexts/error-handler";
import { useApiClient } from "app/hooks";
import { Metaform, MetaformMember, MetaformMemberGroup } from "generated/client";
import UsersFilter from "components/users/users-filter";
import AddMemberGroupDialog from "components/users/add-member-group-dialog";
import UsersTable from "components/users/users-table";

/**
 * Users screen component
 */
const UsersScreen: React.FC = () => {
  // TODO: add loaders

  const errorContext = React.useContext(ErrorContext);
  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, metaformMemberGroupsApi, metaformMembersApi } = apiClient;

  const [ metaforms, setMetaforms ] = React.useState<Metaform[]>([]);
  const [ metaformMemberGroups, setMetaformMemberGroups ] = React.useState<MetaformMemberGroup[]>([]);
  const [ metaformMembers, setMetaformMembers ] = React.useState<MetaformMember[]>([]);
  const [ selectedMetaformId, setSelectedMetaformId ] = React.useState<string>();
  const [ addMemberGroupOpen, setAddMemberGroupOpen ] = React.useState<boolean>(false);

  /**
   * Load metaforms from the API
   */
  const loadMetaforms = async () => {
    try {
      setMetaforms(await metaformsApi.listMetaforms({ }));
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.loadMetaforms, err);
    }
  };

  /**
   * Load metaform member groups from the API
   */
  const loadMetaformMemberGroups = async () => {
    if (!selectedMetaformId) {
      setMetaformMemberGroups([]);
      return;
    }

    try {
      setMetaformMemberGroups(await metaformMemberGroupsApi.listMetaformMemberGroups({
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
      setMetaformMembers([]);
      return;
    }

    try {
      setMetaformMembers(await metaformMembersApi.listMetaformMembers({
        metaformId: selectedMetaformId
      }));
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.loadMembers, err);
    }
  };

  /**
   * 
   * @param metaformMember metaform member
   * @param groupIds group ids
   */
  const onMetaformGroupMembershipRemove = async (metaformMember: MetaformMember, groupId: string) => {
    if (!selectedMetaformId) {
      return;
    }

    try {
      const memberGroup = metaformMemberGroups.find(metaformMemberGroup => metaformMemberGroup.id === groupId);
      if (!memberGroup) {
        errorContext.setError(strings.errorHandling.usersScreen.removeMemberNotFound);
        return;
      }
      
      const updatedGroup = await metaformMemberGroupsApi.updateMetaformMemberGroup({
        metaformId: selectedMetaformId,
        metaformMemberGroupId: groupId,
        metaformMemberGroup: { ...memberGroup, memberIds: memberGroup.memberIds.filter(memberId => memberId !== metaformMember.id) }
      });

      const otherGroups = metaformMemberGroups.filter(metaformMemberGroup => metaformMemberGroup.id !== groupId);

      setMetaformMemberGroups([ ...otherGroups, updatedGroup ]);
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.loadMembers, err);
    }
  };

  /**
   * 
   * @param metaformMember metaform member
   * @param groupIds group ids
   */
  const onMetaformGroupMembershipAdd = async (metaformMember: MetaformMember, groupId: string) => {
    if (!selectedMetaformId) {
      return;
    }

    try {
      const memberGroup = metaformMemberGroups.find(metaformMemberGroup => metaformMemberGroup.id === groupId);
      if (!memberGroup) {
        errorContext.setError(strings.errorHandling.usersScreen.addMemberNotFound);
        return;
      }

      const updatedGroup = await metaformMemberGroupsApi.updateMetaformMemberGroup({
        metaformId: selectedMetaformId,
        metaformMemberGroupId: groupId,
        metaformMemberGroup: { ...memberGroup, memberIds: [ ...memberGroup.memberIds, metaformMember.id!! ] }
      });

      const otherGroups = metaformMemberGroups.filter(metaformMemberGroup => metaformMemberGroup.id !== groupId);

      setMetaformMemberGroups([ ...otherGroups, updatedGroup ]);
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.loadMembers, err);
    }
  };

  /**
   * New member group button click listener
   */
  const onNewMemberGroupButtonClick = () => {
    setAddMemberGroupOpen(true);
  };

  /**
   * Event handler for member group dialog create 
   * 
   * @param displayName group's display name
   */
  const onAddMemberGroupDialogCreate = async (displayName: string) => {
    if (!selectedMetaformId) {
      return;
    }

    try {
      const createdMemberGroup = await metaformMemberGroupsApi.createMetaformMemberGroup({
        metaformId: selectedMetaformId,
        metaformMemberGroup: {
          memberIds: [],
          displayName: displayName
        }
      });

      setMetaformMemberGroups([ ...metaformMemberGroups, createdMemberGroup ]);
    } catch (err) {
      errorContext.setError(strings.errorHandling.usersScreen.createMemberGroup, err);
    }

    setAddMemberGroupOpen(false);
  };

  /**
   * Event handler for member group dialog cancel 
   */
  const onAddMemberGroupDialogCancel = () => {
    setAddMemberGroupOpen(false);
  };

  React.useEffect(() => {
    loadMetaforms();
  }, []);

  React.useEffect(() => {
    loadMetaformMemberGroups();
    loadMetaformMembers();
  }, [ selectedMetaformId, metaforms ]);

  return (
    <>
      <AddMemberGroupDialog
        open={ addMemberGroupOpen }
        onCreate={ onAddMemberGroupDialogCreate }
        onCancel={ onAddMemberGroupDialogCancel }
      />

      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.usersScreens.subheader }
        />
        <NewUserButton
          disabled={ !selectedMetaformId }
          variant="outlined"
          endIcon={ <PersonAdd/> }
        >
          { strings.userManagementScreen.addMemberButton }
        </NewUserButton>
        <NewMemberGroupButton
          disabled={ !selectedMetaformId }
          variant="outlined"
          endIcon={ <GroupAdd/> }
          onClick={ onNewMemberGroupButtonClick }
        >
          { strings.userManagementScreen.addMemberGroupButton }
        </NewMemberGroupButton>
      </NavigationTabContainer>
      <UsersFilter
        metaforms={ metaforms }
        metaformMemberGroups={ metaformMemberGroups }
        selectedMetaformId={ selectedMetaformId }
        setSelectedMetaformId={ setSelectedMetaformId }
      />
      <UsersTable
        metaformMemberGroups={ metaformMemberGroups }
        metaformMembers={ metaformMembers }
        onMetaformGroupMembershipAdd={ onMetaformGroupMembershipAdd }
        onMetaformGroupMembershipRemove={ onMetaformGroupMembershipRemove }
      />
    </>
  );
};

export default UsersScreen;