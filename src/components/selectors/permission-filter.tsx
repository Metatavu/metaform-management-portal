import React from "react";
import { TextField } from "@mui/material";
import { FilterSelector, FormFilterWrapper } from "../../styled/layouts/admin-layout";
import strings from "localization/strings";

/**
 * Disable second selector by default and if first selector is selected, enable second selector
*/
const PermissionFilter: React.FC = () => {
  const [ firstSelector, setFirstSelector ] = React.useState<string>("");
  const [ secondSelector, setSecondSelector ] = React.useState<string>("");

  /**
   * We need to disable second selector if first selector is selected
   * We read that the first selector has "" as value, so we need to check if it is empty
   *
   * @param event - event object
   */
  const handleFirstSelectorChange = (event: React.ChangeEvent<{ value: string }>) => {
    setFirstSelector(event.target.value);
    setSecondSelector("");
  };

  /**
   * We enable second selector if first selector is selected
   * @param event - event object
   */
  const handleSecondSelectorChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSecondSelector(event.target.value);
  };

  return (
    <FormFilterWrapper>
      <FilterSelector
        value={ firstSelector }
        onChange={ handleFirstSelectorChange }
        disableUnderline
      >
        <option value="">{ strings.userManagementScreen.selector.form }</option>
        <option value="1">User 1</option>
        <option value="2">User 2</option>
        <option value="3">User 3</option>
      </FilterSelector>
      <FilterSelector
        value={ secondSelector }
        onChange={ handleSecondSelectorChange }
        disableUnderline
        sx={{
          opacity: firstSelector ? 1 : 0.8,
          borderStyle: firstSelector ? "solid" : "dotted"
        }}
        disabled={ firstSelector === "" }
      >
        <option value="">{ strings.userManagementScreen.selector.group }</option>
        <option value="1">User 1</option>
        <option value="2">User 2</option>
        <option value="3">User 3</option>
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

export default PermissionFilter;