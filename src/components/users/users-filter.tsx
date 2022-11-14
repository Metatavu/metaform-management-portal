import React, { FC } from "react";
import { FormFilterWrapper } from "../../styled/layouts/admin-layout";
import strings from "localization/strings";
import { Metaform, MetaformMemberGroup } from "generated/client";
import GenericLoaderWrapper from "components/generic/generic-loader";
import { MenuItem, TextField } from "@mui/material";
import { NOT_SELECTED } from "consts";

/**
 * Component props
 */
interface Props {
  loading?: boolean;
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
  loading,
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
   * Handle member group selection change
   *
   * @param event - event object
   */
  const onMemberGroupSelectorChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedMemberGroupId(event.target.value);
  };

  return (
    <FormFilterWrapper>
      <GenericLoaderWrapper loading={ loading }>
        <TextField
          select
          fullWidth
          key="metaform-select-container"
          value={ selectedMetaformId || NOT_SELECTED }
          onChange={ handleMetaformSelectorChange }
        >
          <MenuItem
            value={ NOT_SELECTED }
            key="no-metaform-selected"
          >
            { strings.userManagementScreen.selector.form }
          </MenuItem>
          {
            metaforms.map(metaform =>
              <MenuItem
                key={ `${metaform.id}-metaform` }
                value={ metaform.id }
              >
                { metaform.title }
              </MenuItem>)
          }
        </TextField>
      </GenericLoaderWrapper>
      <GenericLoaderWrapper loading={ loading }>
        <TextField
          select
          fullWidth
          value={ selectedMemberGroupId || NOT_SELECTED }
          onChange={ onMemberGroupSelectorChange }
          disabled={ !selectedMetaformId }
        >
          <MenuItem
            value={ NOT_SELECTED }
            key="no-member-group-selected"
          >
            { strings.userManagementScreen.selector.group }
          </MenuItem>
          {
            memberGroups.map(metaformMemberGroup =>
              <MenuItem
                key={ `${metaformMemberGroup.id}-metaform-member-group` }
                value={ metaformMemberGroup.id }
              >
                { metaformMemberGroup.displayName }
              </MenuItem>)
          }
        </TextField>
      </GenericLoaderWrapper>
    </FormFilterWrapper>
  );
};

export default UsersFilter;