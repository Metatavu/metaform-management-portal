import React, { FC } from "react";
import strings from "localization/strings";
import { Metaform, MetaformMember, MetaformMemberGroup } from "generated/client";
import MaterialTable from "material-table";
import UsersTableGroups from "./users-table-groups";
import UsersFilter from "./users-filter";

/**
 * Component props
 */
interface Props {
  metaforms: Metaform[];
  members: MetaformMember[];
  memberGroups: MetaformMemberGroup[];
  selectedMetaformId: string | undefined;
  selectedMemberGroupId: string | undefined;
  setSelectedMetaformId: (metaformId: string | undefined) => void;
  setSelectedMemberGroupId: (memberGroupId: string | undefined) => void;
  onGroupMembershipAdd: (member: MetaformMember, groupId: string) => void;
  onGroupMembershipRemove: (member: MetaformMember, groupId: string) => void;
}

/**
 * Users table
*/
const UsersTable: FC<Props> = ({
  metaforms,
  members,
  memberGroups,
  selectedMetaformId,
  selectedMemberGroupId,
  setSelectedMetaformId,
  setSelectedMemberGroupId,
  onGroupMembershipAdd,
  onGroupMembershipRemove
}: Props) => {
  const selectedGroup = selectedMemberGroupId ? memberGroups.find(group => group.id === selectedMemberGroupId) : null;

  const data = members
    .filter(member => {
      if (!selectedGroup) {
        return true;
      }

      return selectedGroup.memberIds.includes(member.id!!);
    })
    .map(member => {
      return {
        name: `${member.lastName}, ${member.firstName}`,
        email: member.email,
        member: member
      };
    });

  return (
    <MaterialTable
      title={
        <UsersFilter
          metaforms={ metaforms }
          memberGroups={ memberGroups }
          selectedMetaformId={ selectedMetaformId }
          selectedMemberGroupId={ selectedMemberGroupId }
          setSelectedMetaformId={ setSelectedMetaformId }
          setSelectedMemberGroupId={ setSelectedMemberGroupId }
        />
      }
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}
      columns={[
        {
          title: strings.userManagementScreen.usersTable.nameColumn.label,
          field: "name"
        },
        {
          title: strings.userManagementScreen.usersTable.emailColumn.label,
          field: "email"
        },
        {
          title: strings.userManagementScreen.usersTable.groupsColumn.label,
          field: "groups",
          sorting: false,
          render: rowData => {
            return (
              <UsersTableGroups
                key={ `${rowData.member.id}-groups` }
                metaformMember={ rowData.member }
                metaformMemberGroups={ memberGroups }
                onMetaformGroupMembershipAdd={ onGroupMembershipAdd }
                onMetaformGroupMembershipRemove={ onGroupMembershipRemove }
              />
            );
          }
        }
      ]}
      data={ data }
      options={{
        padding: "dense",
        searchFieldStyle: {
          flex: 1,
          minWidth: 400
        },
        headerStyle: {
          backgroundColor: "rgba(0,0,0,0.05)",
          fontWeight: "bold",
          borderTop: "0.5px solid rgba(0,0,0,0.2)"
        }
      }}
    />
  );
};

export default UsersTable;