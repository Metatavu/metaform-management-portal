import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { MetaformField } from "generated/client";
import strings from "localization/strings";
import React, { FC } from "react";

/**
 * Component properties
 */
interface Props {
  selectedField?: MetaformField;
  setSelectedField: (selectedField?: MetaformField) => void;
  debounceTimerId?: NodeJS.Timeout,
  setDebounceTimerId: (debounceTimerId?: NodeJS.Timeout) => void;
  setUpdatedMetaformField: (updatedMetaformField?: MetaformField) => void;
}
/**
 * Draft editor right drawer feature define member group component
 */
const MetaformFieldRequiredComponent: FC<Props> = ({
  selectedField,
  setSelectedField,
  debounceTimerId,
  setDebounceTimerId,
  setUpdatedMetaformField
}) => {
  /**
   * Debounced update field
   *
   * @param field edited field
   */
  const updateFormFieldDebounced = (field: MetaformField) => {
    setSelectedField(field);
    debounceTimerId && clearTimeout(debounceTimerId);
    setDebounceTimerId(setTimeout(() => setUpdatedMetaformField(field), 500));
  };

  /**
   * Renders field required edit
   *
   * @param field field
   */
  const renderFieldRequiredEdit = (field?: MetaformField) => (
    <Stack spacing={ 2 }>
      <Typography variant="subtitle1" style={{ width: "100%" }}>
        { strings.draftEditorScreen.editor.features.field.required }
      </Typography>
      <FormControlLabel
        label={ strings.generic.yes }
        control={
          <Checkbox
            checked={ field!.required }
            onChange={ event => updateFormFieldDebounced({
              ...field!,
              required: event.target.checked
            }) }
          />
        }
      />
    </Stack>
  );

  /**
   * Component render
   */
  return (
    <>
      { renderFieldRequiredEdit(selectedField) }
    </>
  );
};

export default MetaformFieldRequiredComponent;