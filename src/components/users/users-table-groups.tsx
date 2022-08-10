import React, { FC } from "react";
import { MetaformMember, MetaformMemberGroup } from "generated/client";
import { Box, Chip, FormControl, MenuItem, OutlinedInput } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

/**
 * Component props
 */
interface Props {
  metaformMember: MetaformMember;
  metaformMemberGroups: MetaformMemberGroup[];
  onMetaformGroupMembershipAdd: (metaformMember: MetaformMember, groupId: string) => void;
  onMetaformGroupMembershipRemove: (metaformMember: MetaformMember, groupId: string) => void;
}

/**
 * Users table
*/
const UsersTableGroups: FC<Props> = ({
  metaformMember,
  metaformMemberGroups,
  onMetaformGroupMembershipAdd,
  onMetaformGroupMembershipRemove
}) => {
  const memberId = metaformMember.id!;
  const selectedGroups = metaformMemberGroups.filter(metaformMemberGroup => metaformMemberGroup.memberIds.includes(memberId));
  const selectedGroupIds = selectedGroups.map(selectedGroup => selectedGroup.id!);

  /**
   * Handle change event listener
   * 
   * @param event event
   */
  const handleMemberGroupSelectChange = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    const newIds = typeof value === "string" ? value.split(",") : value;
    const removedIds = selectedGroupIds.filter(groupId => !newIds.includes(groupId));

    newIds
      .filter(groupId => !selectedGroupIds.includes(groupId))
      .forEach(groupId => onMetaformGroupMembershipAdd(metaformMember, groupId));

    removedIds
      .forEach(groupId => onMetaformGroupMembershipRemove(metaformMember, groupId));
  };

  return (
    <FormControl fullWidth>
      <Select
        id={ `${metaformMember.id}-groups` }
        multiple
        style={{
          height: 40,
          display: "flex",
          justifyItems: "center",
          border: "none",
          marginLeft: 10
        }}
        size="small"
        value={ selectedGroupIds }
        onChange={ handleMemberGroupSelectChange }
        input={
          <OutlinedInput
            id={ `${metaformMember.id}-groups-select-multiple-chip` }
          />
        }
        renderValue={selected => (
          <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5
          }}
          >
            {
              selected.map(value => {
                const selectedGroup = metaformMemberGroups.find(metaformMemberGroup => metaformMemberGroup.id === value);
                if (!selectedGroup) {
                  return null;
                }

                return (
                  <Chip
                    key={ selectedGroup.id }
                    label={ selectedGroup.displayName }
                  />
                );
              })
            }
          </Box>
        )}
      >
        {metaformMemberGroups.map(metaformMemberGroup => (
          <MenuItem
            key={ metaformMemberGroup.id }
            value={ metaformMemberGroup.id }
          >
            { metaformMemberGroup.displayName }
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default UsersTableGroups;