import { Stack, TextField, Typography } from "@mui/material";
import { MetaformField, MetaformFieldType, MetaformSection } from "generated/client";
import strings from "localization/strings";
import React, { FC } from "react";
import slugify from "slugify";
import LocalizationUtils from "utils/localization-utils";

/**
 * Component properties
 */
interface Props {
  selectedField?: MetaformField;
  setSelectedField: (selectedField?: MetaformField) => void;
  selectedSection?: MetaformSection;
  debounceTimerId?: NodeJS.Timeout,
  setDebounceTimerId: (debounceTimerId?: NodeJS.Timeout) => void;
  setUpdatedMetaformField: (updatedMetaformField?: MetaformField) => void;
  sectionIndex?: number;
  fieldIndex?: number;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformFieldAndSubmitTitleComponent: FC<Props> = ({
  selectedField,
  setSelectedField,
  selectedSection,
  debounceTimerId,
  setDebounceTimerId,
  setUpdatedMetaformField,
  sectionIndex,
  fieldIndex
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
  * Renders field title
  *
  * @param section field
  * @param field field
  */
  const renderFieldTitleEdit = (section?: MetaformSection, field?: MetaformField) => {
    if (field && section) {
      return (
        <Stack spacing={ 2 }>
          <Typography variant="subtitle1" style={{ width: "100%" }}>
            { strings.draftEditorScreen.editor.features.field.fieldData }
          </Typography>
          <TextField
            fullWidth
            label={ strings.draftEditorScreen.editor.features.field.fieldTitle }
            value={ field.title }
            onChange={ event => updateFormFieldDebounced({
              ...field,
              title: event.target.value,
              name: slugify(`${section.title}-${event.target.value}-${sectionIndex}-${fieldIndex}`)
            })
            }
          />
          <Typography variant="body2">
            { `${strings.draftEditorScreen.editor.features.field.fieldType}: ${LocalizationUtils.getLocalizedFieldType(field.type)}` }
          </Typography>
        </Stack>
      );
    }
  };

  /**
   * Renders submit title
   *
   * @param section field
   * @param field field
   */
  const renderSubmitTitleEdit = (section?: MetaformSection, field?: MetaformField) => {
    if (field && section) {
      return (
        <Stack spacing={ 2 }>
          <Typography variant="subtitle1" style={{ width: "100%" }}>
            { strings.draftEditorScreen.editor.features.field.fieldData }
          </Typography>
          <TextField
            fullWidth
            label={ strings.draftEditorScreen.editor.features.field.submitButtonText }
            value={ field.text }
            onChange={ event => updateFormFieldDebounced({
              ...field,
              text: event.target.value,
              name: slugify(`${section.title}-${event.target.value}-${sectionIndex}-${fieldIndex}`)
            })
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
    <Stack>
      { selectedField!.type === MetaformFieldType.Submit ?
        renderSubmitTitleEdit(selectedSection, selectedField) :
        renderFieldTitleEdit(selectedSection, selectedField)
      }
    </Stack>
  );
};

export default MetaformFieldAndSubmitTitleComponent;