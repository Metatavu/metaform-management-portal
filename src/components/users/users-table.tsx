import React, { FC } from "react";
import strings from "localization/strings";
import { MetaformMember, MetaformMemberGroup } from "generated/client";
import MaterialTable from "material-table";
import UsersTableGroups from "./users-table-groups";

/**
 * Component props
 */
interface Props {
  metaformMembers: MetaformMember[];
  metaformMemberGroups: MetaformMemberGroup[];
  onMetaformGroupMembershipAdd: (metaformMember: MetaformMember, groupId: string) => void;
  onMetaformGroupMembershipRemove: (metaformMember: MetaformMember, groupId: string) => void;
}

/**
 * Users table
*/
const UsersTable: FC<Props> = ({ metaformMembers, metaformMemberGroups, onMetaformGroupMembershipAdd, onMetaformGroupMembershipRemove }: Props) => {
  const data = metaformMembers.map(metaformMember => {
    return {
      name: `${metaformMember.lastName}, ${metaformMember.firstName}`,
      email: metaformMember.email,
      metaformMember: metaformMember
    };
  });

  return (
    <MaterialTable
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
          render: rowData => {
            return (
              <UsersTableGroups
                key={ `${rowData.metaformMember.id}-groups` }
                metaformMember={ rowData.metaformMember }
                metaformMemberGroups={ metaformMemberGroups }
                onMetaformGroupMembershipAdd={ onMetaformGroupMembershipAdd }
                onMetaformGroupMembershipRemove={ onMetaformGroupMembershipRemove }
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