import React, { FC } from "react";
import strings from "localization/strings";
import { MetaformMember, MetaformMemberGroup } from "generated/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import UsersTableGroups from "./users-table-groups";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import EmailIcon from "@mui/icons-material/Email";

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
      field: "name",
      flex: 1,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <PersonIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <PersonIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ params.row.name }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      headerName: strings.userManagementScreen.usersTable.emailColumn.label,
      field: "email",
      flex: 1,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <EmailIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <EmailIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ params.row.email }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    },
    {
      headerName: strings.userManagementScreen.usersTable.groupsColumn.label,
      field: "groups",
      flex: 2,
      sortable: false,
      filterable: false,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <GroupIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        const { row } = params;
        return (
          <AdminFormListStack direction="row">
            <GroupIcon style={ { fill: "darkgrey" } }/>
            <UsersTableGroups
              key={ `${row.id}-groups` }
              metaformMember={ row.member }
              metaformMemberGroups={ memberGroups }
              onMetaformGroupMembershipAdd={ onGroupMembershipAdd }
              onMetaformGroupMembershipRemove={ onGroupMembershipRemove }
            />
          </AdminFormListStack>
        );
      }
    }
  ];

  return (
    <DataGrid
      columns={ columns }
      rows={ data }
      autoHeight
      disableColumnMenu
      disableColumnSelector
      disableSelectionOnClick
      sx={{
        border: "none"
      }}
    />
  );
};

export default UsersTable;