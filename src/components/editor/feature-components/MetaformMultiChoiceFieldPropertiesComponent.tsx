import { Button, FormControlLabel, IconButton, Stack, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { uuid4 } from "@sentry/utils";
import { FieldRule, Metaform, MetaformField, MetaformFieldOption } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useState } from "react";
import slugify from "slugify";
import theme from "theme";
import DeleteIcon from "@mui/icons-material/Delete";
import MetaformUtils from "utils/metaform-utils";
import { selectMetaform, setMetaformField } from "../../../features/metaform-slice";
import { useAppSelector, useAppDispatch } from "app/hooks";
/**
 * Component properties
 */
interface Props {
  setPendingForm: (metaform: Metaform) => void;
  setUpdatedMetaformField: (updatedMetaformField: MetaformField) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const MetaformMultiChoiceFieldComponent: FC<Props> = ({
  setPendingForm,
  setUpdatedMetaformField
}) => {
  const [ multiSelectRawTextMode, setMultiSelectRawTextMode ] = useState<boolean>(false);
  const [ multiSelectRawText, setMultiSelectRawText ] = useState<string>("");
  const [ memberGroupOptIndex, setMemberGroupOptIndex ] = useState<number>();
  const [ debounceTimerId, setDebounceTimerId ] = useState<NodeJS.Timeout>();
  const { metaformSectionIndex, metaformFieldIndex, metaformVersion, metaformField } = useAppSelector(selectMetaform);
  const pendingForm = MetaformUtils.jsonToMetaform(MetaformUtils.getDraftForm(metaformVersion));
  const dispatch = useAppDispatch();

  /**
   * 
   * @param fieldRules field rules
   * @param field metaform field
   * @param optionIndex option index
   * @param fieldOptionMatch field option match
   */
  const checkFieldRules = (fieldRules: FieldRule[], field: MetaformField, optionIndex?: number, fieldOptionMatch?: MetaformFieldOption) => {
    fieldRules.forEach(rule => {
      if ((metaformField!.name !== undefined && field.name !== metaformField!.name)) {
        rule.field = field.name;
      // option update
      } else if (optionIndex !== undefined) {
        const fieldOptionToUpdate = field.options![optionIndex];
        if (rule.equals === fieldOptionMatch!.name) {
          rule.equals = fieldOptionToUpdate.name;
        } else if (rule.notEquals === fieldOptionMatch!.name) {
          rule.notEquals = fieldOptionToUpdate.name;
        }
      }
      return field;
    });
  };

  /**
   * Updates field with visibility
   *
   * @param field edited field
   * @param optionIndex option index
   */
  const updateFormField = (field: MetaformField, optionIndex?: number) => {
    if (!metaformField || metaformSectionIndex === undefined || metaformFieldIndex === undefined) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      if (MetaformUtils.fieldTypesAllowVisibility.includes(field.type)) {
        if ((metaformField.name !== undefined && field.name !== metaformField.name) || optionIndex !== undefined) {
          const fieldOptionMatch = optionIndex !== undefined ?
            pendingForm.sections![metaformSectionIndex].fields![metaformFieldIndex].options![optionIndex] :
            undefined;
          const fieldNameMatch = pendingForm.sections![metaformSectionIndex].fields![metaformFieldIndex].name || "";

          const fieldRules: FieldRule[] = [];

          draftForm.sections?.forEach(draftSection => {
            if (draftSection.visibleIf !== undefined) {
              MetaformUtils.fieldRuleScan(draftSection.visibleIf, fieldNameMatch, fieldRules, fieldOptionMatch);
            }
            draftSection.fields?.forEach(draftField => {
              if (draftField.visibleIf !== undefined) {
                MetaformUtils.fieldRuleScan(draftField.visibleIf, fieldNameMatch, fieldRules, fieldOptionMatch);
              }
            });
          });
          checkFieldRules(fieldRules, field, optionIndex, fieldOptionMatch);
        }
      }

      draftForm.sections?.[metaformSectionIndex]?.fields?.splice(metaformFieldIndex, 1, field);
    });

    setPendingForm(updatedForm);
  };

  /**
   * Debounced update field
   *
   * @param field edited field
   * @param optionIndex option index
   */
  const updateFormFieldDebounced = (field: MetaformField, optionIndex?: number) => {
    dispatch(setMetaformField(field));

    debounceTimerId && clearTimeout(debounceTimerId);
    setDebounceTimerId(setTimeout(() => updateFormField(field, optionIndex), 500));
  };

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
    updateFormFieldDebounced(updatedField);

    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.forEach(draftSection => {
        if (draftSection.visibleIf &&
          MetaformUtils.fieldRuleMatch(draftSection.visibleIf, fieldNameMatch, optionMatch)
        ) {
          draftSection.visibleIf = undefined;
        }

        draftSection.fields?.forEach(draftField => {
          if (draftField.visibleIf &&
            MetaformUtils.fieldRuleMatch(draftField.visibleIf, fieldNameMatch, optionMatch)
          ) {
            draftField.visibleIf = undefined;
          }
        });
      });

      draftForm.sections?.[metaformSectionIndex]?.fields?.[metaformFieldIndex]?.options?.splice(optionIndex, 1);
    });
    setPendingForm(updatedForm);
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
      spacing={ 2 }
      direction="row"
    >
      <TextField
        value={ option.text }
        label={ index }
        focused={ memberGroupOptIndex === index }
        color="success"
        onChange={ event => updateOptionText({
          ...option,
          name: slugify(event.target.value),
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
      name: `${strings.draftEditorScreen.editor.features.field.newFieldOption}-${uuid4()}`,
      text: `${strings.draftEditorScreen.editor.features.field.newFieldOption}`,
      permissionGroups: undefined
    };

    const updatedField: MetaformField = produce(metaformField, draftField => {
      draftField.options = [ ...(draftField.options || []), newOption ];
    });

    updateFormFieldDebounced(updatedField);
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
    dispatch(setMetaformField(updatedField));
    setUpdatedMetaformField(updatedField);
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
          <Button
            sx={{ height: "50px" }}
            onClick={ onMultiSelectTextModeUpdate }
          >
            { strings.draftEditorScreen.editor.features.field.updateFields }
          </Button>
        </>
      );
    }
    if (field) {
      return (
        <>
          { field.options?.map(renderMultiChoiceOptionEdit) }
          <Button
            fullWidth
            sx={{ height: "50px" }}
            onClick={ addNewFieldOption }
          >
            { strings.draftEditorScreen.editor.features.field.addFieldOption }
          </Button>
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