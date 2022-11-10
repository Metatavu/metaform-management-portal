import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { MetaformField } from "generated/client";
import strings from "localization/strings";
import React, { FC, useState } from "react";
import { selectMetaform, setMetaformField } from "../../../features/metaform-slice";
import { useAppSelector, useAppDispatch } from "app/hooks";

/**
 * Component properties
 */
interface Props {
  setUpdatedMetaformField: (updatedMetaformField?: MetaformField) => void;
}
/**
 * Draft editor right drawer feature define member group component
 */
const MetaformFieldRequiredComponent: FC<Props> = ({
  setUpdatedMetaformField
}) => {
  const [ debounceTimerId, setDebounceTimerId ] = useState<NodeJS.Timeout>();
  const { metaformField } = useAppSelector(selectMetaform);
  const dispatch = useAppDispatch();

  /**
   * Debounced update field
   *
   * @param field edited field
   */
  const updateFormFieldDebounced = (field: MetaformField) => {
    dispatch(setMetaformField(field));
    debounceTimerId && clearTimeout(debounceTimerId);
    setDebounceTimerId(setTimeout(() => setUpdatedMetaformField(field), 500));
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
                onChange={ event => updateFormFieldDebounced({
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