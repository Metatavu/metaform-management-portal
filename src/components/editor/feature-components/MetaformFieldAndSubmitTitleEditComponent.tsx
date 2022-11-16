import { Stack, TextField, Typography } from "@mui/material";
import { MetaformField, MetaformFieldType, MetaformSection } from "generated/client";
import strings from "localization/strings";
import React, { FC } from "react";
import slugify from "slugify";
import LocalizationUtils from "utils/localization-utils";
import { selectMetaform, setMetaformField } from "../../../features/metaform-slice";
import { useAppDispatch, useAppSelector } from "app/hooks";
/**
 * Component properties
 */
interface Props {
  updateFormFieldDebounced: (updatedField: MetaformField) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformFieldAndSubmitTitleComponent: FC<Props> = ({
  updateFormFieldDebounced
}) => {
  const { metaformField, metaformSectionIndex, metaformFieldIndex, metaformSection } = useAppSelector(selectMetaform);
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
            onChange={ event => updateFormField({
              ...field,
              title: event.target.value,
              name: slugify(`${section.title}-${event.target.value}-${metaformSectionIndex}-${metaformFieldIndex}`)
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
            onChange={ event => updateFormField({
              ...field,
              text: event.target.value,
              name: slugify(`${section.title}-${event.target.value}-${metaformSectionIndex}-${metaformFieldIndex}`)
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
      { metaformField!.type === MetaformFieldType.Submit ?
        renderSubmitTitleEdit(metaformSection, metaformField) :
        renderFieldTitleEdit(metaformSection, metaformField)
      }
    </Stack>
  );
};

export default MetaformFieldAndSubmitTitleComponent;