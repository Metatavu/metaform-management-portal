import React, { FC } from "react";
import strings from "localization/strings";
import { MetaformMember, MetaformMemberGroup } from "generated/client";
import MaterialTable from "material-table";
import UsersTableGroups from "./users-table-groups";

/**
 * Component props
 */
interface Props {
  members: MetaformMember[];
  memberGroups: MetaformMemberGroup[];
  selectedMemberGroupId: string | undefined;
  onGroupMembershipAdd: (metaformMember: MetaformMember, groupId: string) => void;
  onGroupMembershipRemove: (metaformMember: MetaformMember, groupId: string) => void;
}

/**
 * Users table
*/
const UsersTable: FC<Props> = ({
  members,
  memberGroups,
  selectedMemberGroupId,
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
      title=""
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
    />
  );
};

export default UsersTable;