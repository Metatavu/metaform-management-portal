import { FormControlLabel, Stack, Switch } from "@mui/material";
import { MetaformField } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useEffect } from "react";
import { selectMetaform } from "../../../features/metaform-slice";
import { useAppSelector } from "app/hooks";
import MetaformUtils from "utils/metaform-utils";

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
  const { metaformVersion, metaformFieldIndex, metaformSectionIndex } = useAppSelector(selectMetaform);
  const pendingForm = MetaformUtils.jsonToMetaform(MetaformUtils.getDraftForm(metaformVersion));
  const [ metaformField, setMetaformField ] = React.useState<MetaformField>();

  useEffect(() => {
    if (metaformSectionIndex !== undefined && metaformFieldIndex !== undefined) {
      setMetaformField(pendingForm.sections![metaformSectionIndex].fields![metaformFieldIndex]);
    }
  }, [metaformFieldIndex, metaformSectionIndex, metaformVersion]);
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
    setMetaformField(updatedField);
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