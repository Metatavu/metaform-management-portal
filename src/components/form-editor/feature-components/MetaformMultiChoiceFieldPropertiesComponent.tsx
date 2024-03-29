import { FormControlLabel, IconButton, Stack, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { uuid4 } from "@sentry/utils";
import { MetaformField, MetaformFieldOption } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useEffect, useState } from "react";
import theme from "theme";
import DeleteIcon from "@mui/icons-material/Delete";
import MetaformUtils from "utils/metaform-utils";
import { selectMetaform } from "../../../features/metaform-slice";
import { useAppSelector } from "app/hooks";
import { RoundActionButton } from "styled/generic/form";
import AddCircleIcon from "@mui/icons-material/AddCircle";
/**
 * Component properties
 */
interface Props {
  updateFormFieldDebounced: (updatedField: MetaformField, optionIndex?: number) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformMultiChoiceFieldComponent: FC<Props> = ({
  updateFormFieldDebounced
}) => {
  const [ multiSelectRawTextMode, setMultiSelectRawTextMode ] = useState<boolean>(false);
  const [ multiSelectRawText, setMultiSelectRawText ] = useState<string>("");
  const [ memberGroupOptIndex, setMemberGroupOptIndex ] = useState<number>();
  const { metaformVersion, metaformFieldIndex, metaformSectionIndex } = useAppSelector(selectMetaform);
  const pendingForm = MetaformUtils.jsonToMetaform(MetaformUtils.getDraftForm(metaformVersion));
  const [ metaformField, setMetaformField ] = React.useState<MetaformField>();
  const [ optionText, setOptionText ] = useState<string>("");

  useEffect(() => {
    if (metaformSectionIndex !== undefined && metaformFieldIndex !== undefined) {
      setMetaformField(pendingForm.sections?.[metaformSectionIndex].fields?.[metaformFieldIndex]);
    }
  }, [metaformFieldIndex, metaformSectionIndex, metaformVersion]);

  /**
   * Update option text and check if its used as VisibleIf change text also in that field
   *
   * @param updateTextOption FieldOption text we are changing
   * @param optionIndex option index value
   */
  const updateOptionText = (updateTextOption: MetaformFieldOption, optionIndex: number) => {
    if (!metaformField) {
      return;
    }

    const updatedField: MetaformField = produce(metaformField, draftField => {
      draftField?.options?.splice(optionIndex, 1, updateTextOption);
    });

    setMetaformField(updatedField);
    updateFormFieldDebounced(updatedField, optionIndex);
  };

  /**
   * Delete option field and VisibleIf conditions where its used
   *
   * @param optionIndex Option index value of option field what we delete
   */
  const deleteFieldOptions = (optionIndex: number) => {
    setMemberGroupOptIndex(undefined);
    if (!metaformField || metaformSectionIndex === undefined || metaformFieldIndex === undefined) {
      return;
    }
    const optionMatch = pendingForm.sections?.[metaformSectionIndex].fields?.[metaformFieldIndex].options?.[optionIndex];
    const fieldNameMatch = metaformField.name;

    if (!optionMatch || !fieldNameMatch) {
      return;
    }
    const updatedField: MetaformField = produce(metaformField, draftField => {
      draftField?.options?.splice(optionIndex, 1);
    });

    setMetaformField(updatedField);
    updateFormFieldDebounced(updatedField);
  };

  /**
   * Render multi-choice option edit
   * 
   * @param option metaform field option
   * @param index index number of option
   */
  const renderMultiChoiceOptionEdit = (option: MetaformFieldOption, index: number) => (
    <Stack
      key={ `option-${index}` }
      spacing={ 0 }
      direction="row"
    >
      <TextField
        fullWidth
        value={ option.text }
        focused={ memberGroupOptIndex === index }
        color="success"
        onChange={ event => updateOptionText({
          ...option,
          text: event.target.value
        }, index)}
      />
      <IconButton
        color="error"
        value={ index }
        onClick={ () => deleteFieldOptions(index) }
      >
        <DeleteIcon
          color="error"
        />
      </IconButton>
    </Stack>
  );

  /**
   * Add new Radio / Checklist / Select field option
   */
  const addNewFieldOption = () => {
    if (!metaformField) {
      return;
    }

    const newOption: MetaformFieldOption = {
      name: `${strings.draftEditorScreen.editor.features.field.newFieldOption}-${uuid4().slice(0, 5)}`,
      text: optionText,
      permissionGroups: undefined
    };

    const updatedField: MetaformField = produce(metaformField, draftField => {
      draftField.options = [ ...(draftField.options || []), newOption ];
    });

    setMetaformField(updatedField);
    updateFormFieldDebounced(updatedField);
    setOptionText("");
  };

  /**
   * Event handler for changing edit mode of multi-select type fields
   * 
   * @param _event event
   * @param checked checked
   */
  const handleMultiSelectOptionEditMode = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (!metaformField) {
      return;
    }

    if (metaformField.options?.length) {
      const existingOptions = metaformField.options.map(option => option.text);
      setMultiSelectRawText(existingOptions.join("\n"));
    }

    setMultiSelectRawTextMode(checked);
  };

  /**
   * Handles converting text input into multi-select options
   */
  const onMultiSelectTextModeUpdate = () => {
    if (!metaformField || !multiSelectRawText) {
      return;
    }
    const updatedField = produce(metaformField, draftField => {
      const rawOptions = multiSelectRawText.split("\n");

      draftField.options?.splice(0, draftField.options?.length, ...rawOptions.map((parsedValue: string, index: number) => {
        return {
          name: parsedValue.concat(`-${index}`),
          text: parsedValue
        };
      }));
    });
    setMetaformField(updatedField);
    updateFormFieldDebounced(updatedField);
    setMultiSelectRawTextMode(false);
  };

  /**
   * Gets existing multi-select options as text
   * 
   * @param field field
   */
  const getExistingMultiSelectOptions = (field: MetaformField) => field.options?.map(option => option.text).join("\n");

  /** 
   * Event handler for multi-select options text input
   * 
   * @param event event
   */
  const handleMultiSelectTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    setMultiSelectRawText(value);
  };

  /**
   * Renders multi-choice field raw text edit
   * 
   * @param field field
   */
  const renderMultiSelectOptions = (field?: MetaformField) => {
    if (multiSelectRawTextMode && field) {
      return (
        <>
          <Typography color={ theme.palette.text.secondary } variant="body2">
            { strings.draftEditorScreen.editor.features.field.addFieldsAsTextHelper }
          </Typography>
          <TextField
            multiline
            defaultValue={ getExistingMultiSelectOptions(field) }
            onChange={ handleMultiSelectTextChange }
          />
          <RoundActionButton
            fullWidth
            onClick={ onMultiSelectTextModeUpdate }
          >
            <Typography>
              { strings.draftEditorScreen.editor.features.field.updateFields }
            </Typography>
          </RoundActionButton>
        </>
      );
    }
    if (field) {
      return (
        <>
          { field.options?.map(renderMultiChoiceOptionEdit) }
          <Stack direction="row" justifyContent="space-between">
            <TextField
              value={ optionText }
              placeholder={ strings.draftEditorScreen.editor.features.field.addNewOption }
              fullWidth
              onChange={ e => setOptionText(e.target.value) }
            />
            <IconButton
              disabled={ !optionText }
              color="success"
              onClick={ () => addNewFieldOption() }
            >
              <AddCircleIcon/>
            </IconButton>
          </Stack>
        </>
      );
    }
  };

  /**
   * Renders multi-choice field properties
   *
   * @param field field
   */
  const renderMultiChoiceFieldProperties = (field?: MetaformField) => (
    <Stack spacing={ 2 }>
      <Tooltip title={ strings.draftEditorScreen.editor.features.field.addFieldsAsTextHelper }>
        <FormControlLabel
          label={ strings.draftEditorScreen.editor.features.field.addFieldsAsText }
          control={
            <Switch
              checked={ multiSelectRawTextMode }
              onChange={ handleMultiSelectOptionEditMode }
            />
          }
        />
      </Tooltip>
      { renderMultiSelectOptions(field) }
    </Stack>
  );
  /**
   * Component render
   */
  return (
    <>
      { renderMultiChoiceFieldProperties(metaformField) }
    </>
  );
};

export default MetaformMultiChoiceFieldComponent;