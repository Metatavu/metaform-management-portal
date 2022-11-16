import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { MetaformField } from "generated/client";
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
const MetaformFieldRequiredComponent: FC<Props> = ({
  updateFormFieldDebounced
}) => {
  const { metaformField } = useAppSelector(selectMetaform);
  const dispatch = useAppDispatch();

  /**
   * Debounced update field
   *
   * @param field edited field
   */
  const updateFormField = (field: MetaformField) => {
    dispatch(setMetaformField(field));
    updateFormFieldDebounced(field);
  };

  /**
   * Renders field required edit
   *
   * @param field field
   */
  const renderFieldRequiredEdit = (field?: MetaformField) => {
    if (field) {
      return (
        <Stack spacing={ 2 }>
          <Typography variant="subtitle1" style={{ width: "100%" }}>
            { strings.draftEditorScreen.editor.features.field.required }
          </Typography>
          <FormControlLabel
            label={ strings.generic.yes }
            control={
              <Checkbox
                checked={ field.required }
                onChange={ event => updateFormField({
                  ...field,
                  required: event.target.checked
                }) }
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
      { renderFieldRequiredEdit(metaformField) }
    </>
  );
};

export default MetaformFieldRequiredComponent;