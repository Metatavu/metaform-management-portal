import React, { FC } from "react";
import strings from "localization/strings";
import { MetaformMember, MetaformMemberGroup } from "generated/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import UsersTableGroups from "./users-table-groups";

/**
 * Component props
 */
interface Props {
  members: MetaformMember[];
  memberGroups: MetaformMemberGroup[];
  selectedMemberGroupId: string | undefined;
  onGroupMembershipAdd: (member: MetaformMember, groupId: string) => void;
  onGroupMembershipRemove: (member: MetaformMember, groupId: string) => void;
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
        id: member.id,
        name: `${member.lastName}, ${member.firstName}`,
        email: member.email,
        member: member
      };
    });

  const columns: GridColDef[] = [
    {
      headerName: strings.userManagementScreen.usersTable.nameColumn.label,
      field: "name"
    },
    {
      headerName: strings.userManagementScreen.usersTable.emailColumn.label,
      field: "email"
    },
    {
      headerName: strings.userManagementScreen.usersTable.groupsColumn.label,
      field: "groups",
      sortable: false,
      filterable: false,
      renderCell: params => {
        const { row } = params;
        return (
          <UsersTableGroups
            key={ `${row.id}-groups` }
            metaformMember={ row.member }
            metaformMemberGroups={ memberGroups }
            onMetaformGroupMembershipAdd={ onGroupMembershipAdd }
            onMetaformGroupMembershipRemove={ onGroupMembershipRemove }
          />
        );
      }
    }
  ];

  return (
    <DataGrid
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}
      columns={ columns }
      rows={ data }
    />
  );
};

export default UsersTable;