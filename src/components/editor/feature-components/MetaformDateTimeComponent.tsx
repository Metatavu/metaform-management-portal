import { FormControlLabel, Stack, Switch } from "@mui/material";
import { MetaformField } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC } from "react";
import { selectMetaform, setMetaformField } from "../../../features/metaform-slice";
import { useAppSelector, useAppDispatch } from "app/hooks";

/**
 * Component properties
 */
interface Props {
  updateFormFieldDebounced: (updatedField: MetaformField) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformDateTimeComponent: FC<Props> = ({
  updateFormFieldDebounced
}) => {
  const dispatch = useAppDispatch();
  const { metaformField } = useAppSelector(selectMetaform);

  /**
   * Updates allows work days only for date, date-time field
   *
   * @param checked checked value of the checkbox value true or false
   */
  const updateWorkDaysOnly = (checked: boolean) => {
    if (!metaformField) {
      return;
    }

    const updatedField = produce(metaformField, draftField => {
      draftField.workdaysOnly = checked;
    });
    dispatch(setMetaformField(updatedField));
    updateFormFieldDebounced(updatedField);
  };

  /**
   * Renders properties for date, date-time fields
   *
   * @param field field
   */
  const renderDateTimeProperties = (field?: MetaformField) => {
    if (field) {
      return (
        <Stack spacing={ 2 }>
          <FormControlLabel
            label={ strings.draftEditorScreen.editor.features.field.workDaysOnly }
            control={
              <Switch
                checked={ !!field.workdaysOnly }
                onChange={ ({ target }) => updateWorkDaysOnly(target.checked) }
              />
            }
          />
        </Stack>
      );
    }
  };

  /**
   * Component render
   */
  return (
    <>
      { renderDateTimeProperties(metaformField) }
    </>
  );
};

export default MetaformDateTimeComponent;