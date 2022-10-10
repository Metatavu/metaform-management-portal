import { Button, Checkbox, Divider, FormControl, FormControlLabel, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformFieldOption, MetaformSection, MetaformTableColumn, MetaformTableColumnType, MetaformFieldType, FieldRule } from "generated/client";
import produce from "immer";
import slugify from "slugify";
import strings from "localization/strings";
import React, { useEffect, FC, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormContext } from "../../types/index";
import MetaformUtils from "utils/metaform-utils";
import LocalizationUtils from "utils/localization-utils";

/**
 * Component properties
 */
interface Props {
  sectionIndex?: number;
  fieldIndex?: number;
  pendingForm: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor right drawer feature component
 */
const MetaformEditorRightDrawerFeature: FC<Props> = ({
  sectionIndex,
  fieldIndex,
  pendingForm,
  setPendingForm
}) => {
  const [ newColumnType, setNewColumnType ] = useState<MetaformTableColumnType>();
  const [ selectedSection, setSelectedSection ] = useState<MetaformSection>();
  const [ selectedField, setSelectedField ] = useState<MetaformField>();
  const [ debounceTimerId, setDebounceTimerId ] = useState<NodeJS.Timeout>();

  /**
   * Updates selected section and field states
   */
  const updateSelected = () => {
    setSelectedField(MetaformUtils.getMetaformField(pendingForm, sectionIndex, fieldIndex));
    setSelectedSection(MetaformUtils.getMetaformSection(pendingForm, sectionIndex));
    setDebounceTimerId(undefined);
  };

  useEffect(() => {
    updateSelected();
  }, [ sectionIndex, fieldIndex, pendingForm ]);

  /**
   * Updates field with visibility
   *
   * @param field edited field
   * @param optionIndex option index
   */
  const updateFormField = (field: MetaformField, optionIndex?: number) => {
    if (!selectedField || sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      if (MetaformUtils.fieldTypesAllowVisibility.includes(field.type)) {
        if ((selectedField.name !== undefined && field.name !== selectedField.name) || optionIndex !== undefined) {
          const fieldOptionMatch = optionIndex !== undefined ?
            pendingForm.sections![sectionIndex].fields![fieldIndex].options![optionIndex] :
            undefined;
          const fieldRules: FieldRule[] = [];

          draftForm.sections?.forEach(draftSection => {
            if (draftSection.visibleIf !== undefined) {
              MetaformUtils.fieldRuleScan(draftSection.visibleIf, selectedField.name || "", fieldRules, fieldOptionMatch);
            }
            draftSection.fields?.forEach(draftField => {
              if (draftField.visibleIf !== undefined) {
                MetaformUtils.fieldRuleScan(draftField.visibleIf, selectedField.name || "", fieldRules, fieldOptionMatch);
              }
            });
          });

          fieldRules.forEach(rule => {
            if ((selectedField.name !== undefined && field.name !== selectedField.name)) {
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
          });
        }
      }

      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, field);
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
    setSelectedField(field);

    debounceTimerId && clearTimeout(debounceTimerId);
    setDebounceTimerId(setTimeout(() => updateFormField(field, optionIndex), 500));
  };

  /**
   * Updates metaform section
   *
   * @param metaformSection metaform section what we are editing
   */
  const updateFormSection = (metaformSection: MetaformSection) => {
    if (sectionIndex === undefined) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.splice(sectionIndex, 1, metaformSection);
    });

    setPendingForm(updatedForm);
  };

  /**
   * Update option text and check if its used as VisibleIf change text also in that field
   *
   * @param updateTextOption FieldOption text we are changing
   * @param optionIndex option index value
   */
  const updateOptionText = (updateTextOption: MetaformFieldOption, optionIndex: number) => {
    if (!selectedField) {
      return;
    }

    const updatedField: MetaformField = produce(selectedField, draftField => {
      draftField?.options?.splice(optionIndex, 1, updateTextOption);
    });

    updateFormFieldDebounced(updatedField, optionIndex);
  };

  /**
   * Add new Radio / Checklist / Select field option
   */
  const addNewFieldOption = () => {
    if (!selectedField) {
      return;
    }

    const optionsAmount = selectedField.options?.length;
    const newOption: MetaformFieldOption = {
      name: `${strings.draftEditorScreen.editor.features.field.newFieldOption}-${optionsAmount}`,
      text: `${strings.draftEditorScreen.editor.features.field.newFieldOption}-${optionsAmount}`
    };

    const updatedField: MetaformField = produce(selectedField, draftField => {
      draftField.options = [ ...(draftField.options || []), newOption ];
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Delete option field and VisibleIf conditions where its used
   *
   * @param optionIndex Option index value of option field what we delete
   */
  const deleteFieldOptions = (optionIndex: number) => {
    if (!selectedField || sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const optionMatch = pendingForm.sections?.[sectionIndex].fields?.[fieldIndex].options?.[optionIndex];
    const fieldNameMatch = selectedField.name;

    if (!optionMatch || !fieldNameMatch) {
      return;
    }

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

      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.splice(optionIndex, 1);
    });

    setPendingForm(updatedForm);
  };

  /**
   * Update slider value
   *
   * @param eventValue Value of min or max slider value
   * @param scopeValue Min or Max, depending which value we are changing
   */
  const updateSliderValue = (eventValue: string, scopeValue: string) => {
    if (!selectedField) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      if (scopeValue === "min") {
        draftField.min = Number(eventValue);
      } else {
        draftField.max = Number(eventValue);
      }
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Update column value
   *
   * @param tableColumn Metaform table column where we are changing title
   * @param columnIndex index value of current column title
   */
  const updateTableColumn = (tableColumn: MetaformTableColumn, columnIndex: number) => {
    if (!selectedField) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      draftField.columns?.splice(columnIndex, 1, tableColumn);
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Delete column
   *
   * @param columnIndex index value of current column we are deleting
   */
  const deleteColumn = (columnIndex: number) => {
    if (!selectedField) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      draftField.columns?.splice(columnIndex, 1);
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Add new column in table
   */
  const addNewColumn = () => {
    if (!selectedField) {
      return;
    }

    const columnsAmount = selectedField.columns?.length || 0;

    const newColumn: MetaformTableColumn = {
      type: newColumnType!,
      name: columnsAmount.toString(),
      title: columnsAmount.toString()
    };

    const updatedField = produce(selectedField, draftField => {
      draftField.columns = [ ...(draftField.columns || []), newColumn ];
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Update contexts of field
   *
   * @param selectedContext Selected context Option
   * @param checked Is context option checked or not
   */
  const updateContexts = (selectedContext: FormContext, checked: boolean) => {
    if (!selectedField) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      let updatedContexts: string[] = [ ...(draftField.contexts || []) ];
      if (checked) {
        updatedContexts.push(selectedContext);
      } else {
        updatedContexts = updatedContexts.filter(context => context !== selectedContext);
      }

      draftField.contexts = updatedContexts;
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Renders context option
   *
   * @param context context
   * @param selectedContexts selected contexts
   */
  const renderContextOption = (context: FormContext, selectedContexts: string[]) => (
    <FormControlLabel
      key={ context.toString() }
      label={ LocalizationUtils.getLocalizedFormContext(context) }
      control={
        <Checkbox
          checked={ selectedContexts.includes(context) }
          onChange={ event => updateContexts(context, event.target.checked) }
        />
      }
    />
  );

  /**
   * Renders contexts options
   *
   * @param field field
   */
  const renderContextOptions = (field: MetaformField) => (
    <Stack spacing={ 2 }>
      <Typography variant="subtitle1">
        { strings.draftEditorScreen.editor.features.field.contextVisibilityInfo }
      </Typography>
      { Object.values(FormContext).map(context => renderContextOption(context, field.contexts || [])) }
    </Stack>
  );

  /**
   * Renders slider scope values
   *
   * @param field field
   */
  const renderSliderProperties = (field: MetaformField) => {
    const { max, min } = field;
    const { minValueLabel, maxValueLabel } = strings.draftEditorScreen.editor.features.field.slider;

    return (
      <Stack spacing={ 2 }>
        <TextField
          fullWidth
          type="number"
          label={ minValueLabel }
          value={ min }
          onChange={ event => updateSliderValue(event.target.value, "min") }
        />
        <TextField
          fullWidth
          type="number"
          label={ maxValueLabel }
          value={ max }
          onChange={ event => updateSliderValue(event.target.value, "max") }
        />
      </Stack>
    );
  };

  /**
   * Render multi-choice option edit
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
   * Renders multi-choice field properties
   *
   * @param field field
   */
  const renderMultiChoiceFieldProperties = (field: MetaformField) => (
    <Stack spacing={ 2 }>
      { field.options?.map(renderMultiChoiceOptionEdit) }
      <Button
        fullWidth
        sx={{ height: "50px" }}
        onClick={ addNewFieldOption }
      >
        { strings.draftEditorScreen.editor.features.field.addFieldOption }
      </Button>
    </Stack>
  );

  /**
   * Renders table column edit
   *
   * @param column column
   * @param index index
   */
  const renderTableColumnEdit = (column: MetaformTableColumn, index: number) => (
    <Stack
      key={ `column-${index}` }
      spacing={ 2 }
      direction="row"
    >
      <TextField
        value={ column.title }
        label={ index }
        onChange={ event => updateTableColumn({
          ...column,
          name: slugify(`${event.target.value}-${index}`),
          title: event.target.value,
          type: "text" as MetaformTableColumnType,
          values: undefined
        }, index)}
      />
      <IconButton
        color="error"
        value={ index }
        onClick={ () => deleteColumn(index) }
      >
        <DeleteIcon color="error"/>
      </IconButton>
    </Stack>
  );

  /**
   * Renders table new column
   */
  const renderTableNewColumn = () => (
    <Stack spacing={ 2 }>
      <Typography variant="subtitle1" style={{ width: "100%" }}>
        { strings.draftEditorScreen.editor.features.field.addNewColumn }
      </Typography>
      <TextField
        select
        fullWidth
        label={ strings.draftEditorScreen.editor.features.field.addColumnType }
        value={ newColumnType }
        onChange={ ({ target }) => setNewColumnType(target.value as MetaformTableColumnType) }
      >
        <MenuItem value={ MetaformTableColumnType.Text }>
          { strings.draftEditorScreen.editor.features.field.columnTextType }
        </MenuItem>
        <MenuItem value={ MetaformTableColumnType.Number }>
          { strings.draftEditorScreen.editor.features.field.columnNumberType }
        </MenuItem>
      </TextField>
      <Button
        fullWidth
        disabled={ newColumnType === undefined }
        onClick={ addNewColumn }
      >
        { strings.draftEditorScreen.editor.features.field.addNewColumn }
      </Button>
    </Stack>
  );

  /**
   * Renders features for adding, editing and deleting columns in table field
   *
   * @param field field
   */
  const renderTableProperties = (field: MetaformField) => (
    <Stack spacing={ 2 }>
      { field.columns?.map(renderTableColumnEdit) }
      <Divider/>
      { renderTableNewColumn() }
    </Stack>
  );

  /**
   * Renders field properties
   *
   * @param field field
   */
  const renderFieldProperties = (field: MetaformField) => {
    const { type } = field;

    switch (type) {
      case MetaformFieldType.Slider:
        return (
          <>
            { renderSliderProperties(field) }
            <Divider/>
          </>
        );
      case MetaformFieldType.Checklist:
      case MetaformFieldType.Radio:
      case MetaformFieldType.Select:
        return (
          <>
            { renderMultiChoiceFieldProperties(field) }
            <Divider/>
          </>
        );
      case MetaformFieldType.Table:
        return (
          <>
            { renderTableProperties(field) }
            <Divider/>
          </>
        );
      default:
        break;
    }
  };

  /**
   * Renders define user group component
   *
   *  @param field selected field
   */
  const renderDefineUserGroup = (field: MetaformField) => {
    const { type } = field;
    const userGroupAllowed = MetaformUtils.fieldTypesAllowUserGroup.includes(type);

    return (
      <Stack spacing={ 2 }>
        <Typography variant="subtitle1" style={{ width: "100%" }}>
          { strings.draftEditorScreen.editor.features.field.defineUserGroup }
        </Typography>
        <FormControl disabled={ !userGroupAllowed }>
          <FormControlLabel
            label={ strings.generic.yes }
            control={
              <Checkbox checked/>
            }
          />
          <Typography variant="body2">
            { strings.draftEditorScreen.editor.features.field.selectableFieldsInfo }
          </Typography>
        </FormControl>
      </Stack>
    );
  };

  /**
   * Renders field title
   *
   * @param section field
   * @param field field
   */
  const renderFieldTitleEdit = (section: MetaformSection, field: MetaformField) => (
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
    </Stack>
  );

  /**
   * Renders submit title
   *
   * @param section field
   * @param field field
   */
  const renderSubmitTitleEdit = (section: MetaformSection, field: MetaformField) => (
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

  /**
   * Renders field required edit
   *
   * @param field field
   */
  const renderFieldRequiredEdit = (field: MetaformField) => (
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

  /**
   * Renders section editor
   *
   * @param section section
   */
  const renderSectionEditor = (section: MetaformSection) => (
    <>
      <Typography variant="subtitle1" style={{ width: "100%" }}>
        { strings.draftEditorScreen.editor.features.section.sectionData }
      </Typography>
      <TextField
        fullWidth
        value={ section.title ?? "" }
        label={ strings.draftEditorScreen.editor.features.section.sectionTitle }
        onChange={ event => updateFormSection({
          ...section,
          title: event.target.value
        }) }
      />
    </>
  );

  /**
   * Renders field editor
   *
   * @param field field
   * @param section section
   */
  const renderFieldEditor = (field: MetaformField, section: MetaformSection) => (
    <>
      { field.type === MetaformFieldType.Submit ?
        renderSubmitTitleEdit(section, field) :
        renderFieldTitleEdit(section, field)
      }
      <Divider/>
      { renderFieldProperties(field) }
      { renderContextOptions(field) }
      <Divider/>
      { renderFieldRequiredEdit(field) }
      <Divider/>
      { renderDefineUserGroup(field) }
    </>
  );

  /**
   * Renders empty selection
   */
  const renderEmptySelection = () => (
    <Typography>{ strings.draftEditorScreen.editor.emptySelection}</Typography>
  );

  /**
   * Renders feature editor
   */
  const renderFeatureEditor = () => {
    if (selectedField !== undefined && selectedSection !== undefined) {
      return renderFieldEditor(selectedField, selectedSection);
    }

    if (selectedSection !== undefined) {
      return renderSectionEditor(selectedSection);
    }

    return renderEmptySelection();
  };

  /**
   * Component render
   */
  return (
    <Stack
      spacing={ 2 }
      width="100%"
      overflow="hidden"
    >
      { renderFeatureEditor() }
    </Stack>
  );
};

export default MetaformEditorRightDrawerFeature;