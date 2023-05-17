import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { MetaformField } from "generated/client";
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
const MetaformFieldRequiredComponent: FC<Props> = ({
  updateFormFieldDebounced
}) => {
  const { metaformVersion, metaformFieldIndex, metaformSectionIndex } = useAppSelector(selectMetaform);
  const pendingForm = MetaformUtils.jsonToMetaform(MetaformUtils.getDraftForm(metaformVersion));
  const [ metaformField, setMetaformField ] = React.useState<MetaformField>();

  useEffect(() => {
    if (metaformSectionIndex !== undefined && metaformFieldIndex !== undefined) {
      setMetaformField(pendingForm.sections?.[metaformSectionIndex].fields?.[metaformFieldIndex]);
    }
  }, [metaformFieldIndex, metaformSectionIndex, metaformVersion]);
  /**
   * Debounced update field
   *
   * @param field edited field
   */
  const updateFormField = (field: MetaformField) => {
    setMetaformField(field);
    updateFormFieldDebounced(field);
  };

  /**
   * Renders field required edit
   *
   * @param field field
   */
  const renderFieldRequiredEdit = (field?: MetaformField) => {
    if (field) {
      const requiredField = field.required;
      return (
        <FormGroup>
          <FormControlLabel
            label={ strings.draftEditorScreen.editor.features.field.required }
            control={
              <Switch
                checked={ requiredField }
                onChange={ event => updateFormField({
                  ...field,
                  required: event.target.checked
                }) }
              />
            }
          />
        </FormGroup>
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