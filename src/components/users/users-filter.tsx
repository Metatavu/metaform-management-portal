/* eslint-disable */
import React, { FC } from "react";
import { TextField } from "@mui/material";
import { FilterSelector, FormFilterWrapper } from "../../styled/layouts/admin-layout";
import strings from "localization/strings";
import { Metaform, MetaformMemberGroup } from "generated/client";

/**
 * Component props
 */
interface Props {
  metaforms: Metaform[];
  memberGroups: MetaformMemberGroup[];
  selectedMetaformId: string | undefined;
  selectedMemberGroupId: string | undefined;
  setSelectedMetaformId: (metaformId: string | undefined) => void;
  setSelectedMemberGroupId: (memberGroupId: string | undefined) => void;
}

/**
 * Users filter
*/
const UsersFilter: FC<Props> = ({ 
  metaforms, 
  memberGroups, 
  selectedMetaformId, 
  selectedMemberGroupId, 
  setSelectedMetaformId, 
  setSelectedMemberGroupId 
}: Props) => {
  /**
   * Handle selected metaform change
   * 
   * @param event event
   */
  const handleMetaformSelectorChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedMetaformId(event.target.value || undefined);
    setSelectedMemberGroupId("");
  };

  /**
   * Hanndle member group selection change
   *
   * @param event - event object
   */
  const onMemberGroupSelectorChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedMemberGroupId(event.target.value);
  };

  return (
    <FormFilterWrapper>
      <FilterSelector
        key="metaform-select-container"
        value={ selectedMetaformId }
        onChange={ handleMetaformSelectorChange }
        disableUnderline
      >
        <option value="" key="no-metaform-selected">{ strings.userManagementScreen.selector.form }</option>
        {
          metaforms.map(metaform => {
            return (
              <option 
                key={ `${metaform.id}-metaform`}
                value={ metaform.id }
              >
                  { metaform.title }
              </option>
            );
          })
        }
      </FilterSelector>
      <FilterSelector
        value={ selectedMemberGroupId }
        onChange={ onMemberGroupSelectorChange }
        disableUnderline
        sx={{
          opacity: selectedMetaformId ? 1 : 0.8,
          borderStyle: selectedMetaformId ? "solid" : "dotted"
        }}
        disabled={ !selectedMetaformId }
      >
        <option value="">{ strings.userManagementScreen.selector.group }</option>
        {
          memberGroups.map(metaformMemberGroup => {
            return (
              <option 
                key={ `${metaformMemberGroup.id}-metaform-member-group`}
                value={ metaformMemberGroup.id }
              >
                  { metaformMemberGroup.displayName }
                </option>
            );
          })
        }
      </FilterSelector>
    </FormFilterWrapper>
  );
};

export default UsersFilter;