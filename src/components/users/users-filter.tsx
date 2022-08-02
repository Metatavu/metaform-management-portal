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
  metaformMemberGroups: MetaformMemberGroup[];
  selectedMetaformId: string | undefined;
  setSelectedMetaformId: (metaformId: string | undefined) => void;
}

/**
 * Users filter
*/
const UsersFilter: FC<Props> = ({ metaforms, metaformMemberGroups, selectedMetaformId, setSelectedMetaformId }: Props) => {
  const [ secondSelector, setSecondSelector ] = React.useState<string>("");

  /**
   * Handle selected metaform change
   * 
   * @param event event
   */
  const handleMetaformSelectorChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedMetaformId(event.target.value || undefined);
    setSecondSelector("");
  };

  /**
   * We enable second selector if first selector is selected
   *
   * @param event - event object
   */
  const handleSecondSelectorChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSecondSelector(event.target.value);
  };

  return (
    <FormFilterWrapper>
      <FilterSelector
        value={ selectedMetaformId }
        onChange={ handleMetaformSelectorChange }
        disableUnderline
      >
        <option value="">{ strings.userManagementScreen.selector.form }</option>
        {
          metaforms.map(metaform => {
            return (
              <option value={ metaform.id }>{ metaform.title }</option>
            );
          })
        }
      </FilterSelector>
      <FilterSelector
        value={ secondSelector }
        onChange={ handleSecondSelectorChange }
        disableUnderline
        sx={{
          opacity: selectedMetaformId ? 1 : 0.8,
          borderStyle: selectedMetaformId ? "solid" : "dotted"
        }}
        disabled={ !selectedMetaformId }
      >
        <option value="">{ strings.userManagementScreen.selector.group }</option>
        {
          metaformMemberGroups.map(metaformMemberGroup => {
            return (
              <option value={ metaformMemberGroup.id }>{ metaformMemberGroup.displayName }</option>
            );
          })
        }
      </FilterSelector>
      <FilterSelector
        disableUnderline
      >
        <option value="">{ strings.userManagementScreen.selector.user }</option>
        <option value="1">User 1</option>
        <option value="2">User 2</option>
        <option value="3">User 3</option>
      </FilterSelector>
      <TextField/>
    </FormFilterWrapper>
  );
};

export default UsersFilter;