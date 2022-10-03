import { Button, Checkbox, Divider, FormControl, FormControlLabel, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformFieldOption, MetaformSection, MetaformTableColumn, MetaformTableColumnType, MetaformFieldType } from "generated/client";
import produce from "immer";
import slugify from "slugify";
import strings from "localization/strings";
import React, { useEffect, FC, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormContext } from "../../types/index";
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
const MetaformEditorRightDrawerFeatureComponent: FC<Props> = ({
  sectionIndex,
  fieldIndex,
  pendingForm,
  setPendingForm
}) => {
  const [ metaformSectionTitle, setMetaformSectionTitle ] = useState<string | undefined>("");
  const [ columnType, setColumnType ] = useState<string>("");
  const [ contextOption, setContextOption ] = useState<FormContext[]>([]);
  /**
   * Get title of current section
   */
  const getSelectedSectionTitle = () => {
    if (fieldIndex === undefined && sectionIndex !== undefined) {
      setMetaformSectionTitle(pendingForm.sections![sectionIndex].title ?? "");
    }
  };

  /**
   * Updates metaform field and check if its used as visibleIf condition and change them 
   *
   * @param metaformField Metaform field what we are editing
   */
  const updateFormField = (metaformField: MetaformField) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const selectedField = pendingForm.sections![sectionIndex!].fields![fieldIndex!];

    const updatedForm = produce(pendingForm, draftForm => {
      if (metaformField.type === "select" || metaformField.type === "checklist" || metaformField.type === "radio") {
        draftForm.sections?.forEach((currentSection, sectionIndexOfSection) => {
          if (currentSection.visibleIf) {
            if (currentSection.visibleIf.field === selectedField.name) {
              const metaFormFieldSection = pendingForm.sections![sectionIndexOfSection];
              const editedSection = {
                ...metaFormFieldSection,
                visibleIf: {
                  field: metaformField.name,
                  equals: currentSection.visibleIf.equals,
                  notEquals: "",
                  and: [],
                  or: []
                }
              };
              draftForm.sections?.splice(sectionIndexOfSection, 1, editedSection as MetaformSection);
            }
          }
          currentSection.fields?.forEach((currentField, fieldIndexOfField) => {
            if (currentField.visibleIf) {
              if (currentField.visibleIf.field === selectedField.name) {
                const metaFormFieldSection = pendingForm.sections![sectionIndexOfSection].fields![fieldIndexOfField];
                const editedField = {
                  ...metaFormFieldSection,
                  visibleIf: {
                    field: metaformField.name,
                    equals: currentField.visibleIf.equals,
                    notEquals: "",
                    and: [],
                    or: []
                  }
                };
                draftForm.sections?.[sectionIndexOfSection]?.fields?.splice(fieldIndexOfField, 1, editedField as MetaformField);
              }
            }
          });
        });
      }
      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, metaformField);
    });
    setPendingForm(updatedForm);
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
    const selectedField = pendingForm.sections![sectionIndex!].fields![fieldIndex!];
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.forEach((currentSection, sectionIndexOfSection) => {
        if (currentSection.visibleIf) {
          if (currentSection.visibleIf.field === selectedField.name && currentSection.visibleIf.equals === selectedField.options![optionIndex].name) {
            const metaFormSection = pendingForm.sections![sectionIndexOfSection];
            const editedSection = {
              ...metaFormSection,
              visibleIf: {
                field: currentSection.visibleIf.field,
                equals: updateTextOption.name,
                notEquals: "",
                and: [],
                or: []
              }
            };
            draftForm.sections?.splice(sectionIndexOfSection, 1, editedSection as MetaformSection);
          }
        }
        currentSection.fields?.forEach((currentField, fieldIndexOfField) => {
          if (currentField.visibleIf) {
            if (currentField.visibleIf.field === selectedField.name && currentField.visibleIf.equals === selectedField.options![optionIndex].name) {
              const metaFormField = pendingForm.sections![sectionIndexOfSection].fields![fieldIndexOfField];
              const editedField = {
                ...metaFormField,
                visibleIf: {
                  field: currentField.visibleIf.field,
                  equals: updateTextOption.name,
                  notEquals: "",
                  and: [],
                  or: []
                }
              };
              draftForm.sections?.[sectionIndexOfSection]?.fields?.splice(fieldIndexOfField, 1, editedField as MetaformField);
            }
          }
        });
      });
      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.splice(optionIndex, 1, updateTextOption);
    });
    setPendingForm(updatedForm);
  };

  /**
   * Add new Radio / Checklist / Select field option
   */
  const addNewFieldOption = () => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const optionsAmount = JSON.stringify(pendingForm.sections![sectionIndex].fields![fieldIndex].options?.length);
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.push({
        name: `${strings.draftEditorScreen.editor.features.newFieldOption}-${optionsAmount}`,
        text: `${strings.draftEditorScreen.editor.features.newFieldOption}-${optionsAmount}`
      });
    });
    setPendingForm(updatedForm);
  };

  /**
   * Delete option field and VisibleIf conditions where its used
   * 
   * @param optionIndex Option index value of option field what we delete
   */
  const deleteFieldOptions = (optionIndex: number) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const selectedField = pendingForm.sections![sectionIndex!].fields![fieldIndex!];
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.forEach(currentSection => {
        if (currentSection.visibleIf) {
          if (currentSection.visibleIf.field === selectedField.name && currentSection.visibleIf.equals === selectedField.options![optionIndex].name) {
            delete currentSection.visibleIf;
          }
        }
        currentSection.fields?.forEach(currentField => {
          if (currentField.visibleIf) {
            if (currentField.visibleIf.field === selectedField.name && currentField.visibleIf.equals === selectedField.options![optionIndex].name) {
              delete currentField.visibleIf;
            }
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
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const metaFormField = pendingForm.sections![sectionIndex].fields![fieldIndex];
    if (scopeValue === "min") {
      const updateField = {
        ...metaFormField,
        min: Number(eventValue)
      };
      const updatedForm = produce(pendingForm, draftForm => {
        draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, updateField);
      });
      setPendingForm(updatedForm);
    }
    if (scopeValue === "max") {
      const updateField = {
        ...metaFormField,
        max: Number(eventValue)
      };
      const updatedForm = produce(pendingForm, draftForm => {
        draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, updateField);
      });
      setPendingForm(updatedForm);
    }
  };

  /**
   * Update column title value
   *
   * @param tableColumn Metaform table column where we are changing title
   * @param columnIndex index value of current column title
   */
  const updateColumnTitle = (tableColumn: MetaformTableColumn, columnIndex: number) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.columns?.splice(columnIndex, 1, tableColumn);
    });
    setPendingForm(updatedForm);
  };

  /**
   * Delete column
   *
   * @param columnIndex indexvalue of current column we are deleting
   */
  const deleteColumn = (columnIndex: number) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.columns?.splice(columnIndex, 1);
    });
    setPendingForm(updatedForm);
  };

  /**
   * Add new column in table
   */
  const addNewColumn = () => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const columnsAmount = JSON.stringify(pendingForm.sections![sectionIndex].fields![fieldIndex].columns?.length);
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.columns?.push({
        type: columnType as MetaformTableColumnType,
        name: columnsAmount,
        title: columnsAmount
      });
    });
    setPendingForm(updatedForm);
  };

  /**
   * Update contexts of field
   * 
   * @param selectedContext Selected context Option
   * @param checked Is context option checked or not
   */
  const updateContexts = (selectedContext: FormContext, checked: boolean) => {
    if (sectionIndex !== undefined && fieldIndex !== undefined) {
      if (!checked) {
        pendingForm.sections![sectionIndex].fields![fieldIndex].contexts!.forEach((context, index) => {
          if (selectedContext === context) {
            const updatedForm = produce(pendingForm, draftForm => {
              draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.contexts?.splice(index, 1);
            });
            setPendingForm(updatedForm);
          }
        });
      } else {
        const updatedForm = produce(pendingForm, draftForm => {
          draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.contexts?.push(selectedContext);
        });
        setPendingForm(updatedForm);
      }
    }
  };

  /**
   * Add custom html code in field
   *
   * @param htmlField html field
   */
  const updateHtmlField = (htmlField: MetaformField) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, htmlField);
    });
    setPendingForm(updatedForm);
  };

  /**
   * Check fields contexts
   */
  const checkContextSettings = () => {
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      if (!pendingForm.sections![sectionIndex].fields![fieldIndex]) {
        return;
      }
      setContextOption([]);
      pendingForm.sections![sectionIndex].fields![fieldIndex].contexts!.forEach(context => {
        setContextOption(contextOptionList => [...contextOptionList, context as FormContext]);
      });
    }
  };

  /**
   * Renders form section title
   * 
   * @param title title
   */
  const renderFormSectionTitle = (title: string) => (
    <Typography variant="subtitle1">
      { title }
    </Typography>
  );

  /**
   * Render contexts options
   */
  const renderContextOptions = () => (
    <Stack spacing={ 2 }>
      <FormControl>
        <FormControlLabel
          label={ strings.draftEditorScreen.editor.features.contextFormVisibility }
          control={
            <Checkbox
              checked={ contextOption.includes(FormContext.FORM) }
              onChange={ event => updateContexts(FormContext.FORM, event.target.checked) }
            />
          }
        />
      </FormControl>
      <FormControl>
        <FormControlLabel
          label={ strings.draftEditorScreen.editor.features.contextManagementVisibility }
          control={
            <Checkbox
              checked={ contextOption.includes(FormContext.MANAGEMENT) }
              onChange={ event => updateContexts(FormContext.MANAGEMENT, event.target.checked) }
            />
          }
        />
      </FormControl>
      <FormControl>
        <FormControlLabel
          label={ strings.draftEditorScreen.editor.features.contextManagementListVisibility }
          control={
            <Checkbox
              checked={ contextOption.includes(FormContext.MANAGEMENT_LIST) }
              onChange={ event => updateContexts(FormContext.MANAGEMENT_LIST, event.target.checked) }
            />
          }
        />
      </FormControl>
    </Stack>
  );

  /**
   * Render slider scope values
   *
   * @param selectedField selected metaformField
   */
  const renderSliderScopeValues = (selectedField: MetaformField) => {
    const { max, min } = selectedField;
    const { sliderMinValueLabel, sliderMaxValueLabel } = strings.draftEditorScreen.editor.features;
    
    return (
      <>
        <TextField
          fullWidth
          type="number"
          sx={{ height: "50px" }}
          label={ sliderMinValueLabel }
          value={ min }
          onChange={ event => updateSliderValue(event.target.value, "min") }
        />
        <TextField
          fullWidth
          type="number"
          sx={{ height: "50px" }}
          label={ sliderMaxValueLabel }
          value={ max }
          onChange={ event => updateSliderValue(event.target.value, "max") }
        />
      </>
    );
  };

  /**
   * Render options if selected field type is radio, checklist or select
   */
  const renderFieldOptions = () => {
    if (sectionIndex !== undefined && fieldIndex !== undefined) {
      return (
        <>
          { pendingForm.sections![sectionIndex].fields![fieldIndex].options!.map((field, index) => {
            return (
              <Stack spacing={ 2 } direction="row">
                <TextField
                  sx={{ height: "50px" }}
                  value={ field.text }
                  label={ index }
                  onChange={ event => updateOptionText({
                    ...field,
                    name: slugify(event.target.value),
                    text: event.target.value
                  }, index)}
                />
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    alignContent: "center",
                    height: "40px"
                  }}
                  value={ index }
                  onClick={ () => deleteFieldOptions(index) }
                >
                  <DeleteIcon
                    color="error"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  />
                </Button>
              </Stack>
            );
          })}
          <Button
            fullWidth
            sx={{
              height: "50px"
            }}
            onClick={ addNewFieldOption }
          >
            { strings.draftEditorScreen.editor.features.addSelectionField }
          </Button>
        </>
      );
    }
  };

  /**
   * Render html editor
   *
   * @param selectedField selected field
   */
  const renderHtmlEditor = (selectedField: MetaformField) => {
    const { html } = selectedField;
    return (
      <TextField
        fullWidth
        placeholder={ strings.draftEditorScreen.editor.features.addCustomHtml }
        multiline
        rows={ 4 }
        value={ html }
        onChange={ event => updateHtmlField({ ...selectedField, html: event.target.value }) }
      />
    );
  };

  /**
   * Render features for adding, editing and deleting columns in table field
   */
  const renderTableColumnFeatures = () => {
    const tableColumn = pendingForm.sections![sectionIndex!].fields![fieldIndex!].columns;
    return (
      <>
        { pendingForm.sections![sectionIndex!].fields![fieldIndex!].columns!.map((field, index) => {
          return (
            <Stack spacing={ 2 } direction="row">
              <TextField
                sx={{ height: "50px" }}
                value={ field.title }
                label={ index }
                onChange={ event => updateColumnTitle({
                  ...tableColumn,
                  name: slugify(`${event.target.value}-${index}`),
                  title: event.target.value,
                  type: "text" as MetaformTableColumnType,
                  values: undefined
                }, index)}
              />
              <Button
                variant="outlined"
                color="error"
                sx={{
                  alignContent: "center",
                  height: "40px"
                }}
                value={ index }
                onClick={ () => deleteColumn(index) }
              >
                <DeleteIcon
                  color="error"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                />
              </Button>
            </Stack>
          );
        })}
        <Divider/>
        <Typography variant="subtitle1" style={{ width: "100%" }}>
          { strings.draftEditorScreen.editor.features.addNewColumn }
        </Typography>
        <TextField
          select
          fullWidth
          label={ strings.draftEditorScreen.editor.features.addColumnType }
          value={ columnType }
          onChange={ event => setColumnType(event.target.value) }
        >
          <MenuItem value="text">{ strings.draftEditorScreen.editor.features.columnTextType}</MenuItem>
          <MenuItem value="number">{ strings.draftEditorScreen.editor.features.columnNumberType}</MenuItem>
        </TextField>
        <Button
          fullWidth
          disabled={ !columnType }
          sx={{
            height: "50px",
            mt: "5px"
          }}
          onClick={ addNewColumn }
        >
          { strings.draftEditorScreen.editor.features.addNewColumn }
        </Button>
      </>
    );
  };

  /**
   * Render options depending what field type is selected
   * 
   * @param field current field
   */
  const renderOptions = (field: MetaformField) => {
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      switch (field.type) {
        case MetaformFieldType.Slider:
          return renderSliderScopeValues(field);
        case MetaformFieldType.Checklist:
        case MetaformFieldType.Radio:
        case MetaformFieldType.Select:
          return renderFieldOptions();
        case MetaformFieldType.Html:
          return renderHtmlEditor(field);
        case MetaformFieldType.Table:
          return renderTableColumnFeatures();
        default:
          break;
      }
    }
  };

  /**
   * Render define user group component
   *
   *  @param field selected field
   */
  const renderDefineUserGroup = (field: MetaformField) => {
    const { type } = field;
    const allowToDefineUserGroup = type === "select" || type === "date-time" || type === "radio" || type === "checklist" || type === "date";
    
    if (!allowToDefineUserGroup) {
      return null;
    }
    
    return (
      <>
        <Divider/>
        { renderFormSectionTitle(strings.draftEditorScreen.editor.features.defineUserGroup) }
        <FormControlLabel
          label={ strings.generic.yes }
          control={
            <Checkbox
              checked
            />
          }
        />
        <Typography variant="body2">
          { strings.draftEditorScreen.editor.features.selectableFieldsInfo }
        </Typography>
      </>
    );
  };

  /**
   * Renders field title TextField
   * 
   * @param field current field
   */
  const renderFieldTitleTextField = (field: MetaformField) => {
    const { text, title, type } = field;

    return (
      <TextField
        fullWidth
        label={ type === "submit" ? strings.draftEditorScreen.editor.features.textOfSubmitButton : strings.draftEditorScreen.editor.features.fieldTitle }
        value={ type === "submit" ? text : title }
        onChange={ event => (
          type === "submit"
            ? updateFormField({
              ...field,
              text: event.target.value,
              name: slugify(`${metaformSectionTitle}-${event.target.value}-${sectionIndex}-${fieldIndex}`)
            })
            : updateFormField({
              ...field,
              title: event.target.value,
              name: slugify(`${metaformSectionTitle}-${event.target.value}-${sectionIndex}-${fieldIndex}`)
            })
        )}
      />
    );
  };

  /**
   * Renders field required Checkbox
   * 
   * @param field current field
   */
  const renderFieldRequiredCheckbox = (field: MetaformField) => (
    <FormControlLabel
      label={ strings.generic.yes }
      control={
        <Checkbox
          checked={ field.required }
          onChange={ event => updateFormField({ ...field, required: event.target.checked }) }
        />
      }
    />
  );

  /**
   * Renders feature component
   */
  const renderFeatures = () => {
    if (sectionIndex !== undefined && fieldIndex === undefined) {
      const section = pendingForm.sections![sectionIndex];
      return (
        <Stack spacing={ 2 }>
          { renderFormSectionTitle(strings.draftEditorScreen.editor.features.sectionInformation) }
          <TextField
            fullWidth
            value={ section.title ?? "" }
            label={ strings.draftEditorScreen.editor.features.sectionTitle }
            onChange={ event => updateFormSection({
              ...section,
              title: event.target.value
            }) }
          />
        </Stack>
      );
    }

    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex];
      if (field === undefined) {
        return null;
      }
      return (
        <Stack spacing={ 2 }>
          { renderFormSectionTitle(strings.draftEditorScreen.editor.features.fieldInformation) }
          { renderFieldTitleTextField(field) }
          { renderOptions(field) }
          <Divider/>
          { renderFormSectionTitle(strings.draftEditorScreen.editor.features.contextVisibilityInfo) }
          { renderContextOptions() }
          <Divider/>
          { renderFormSectionTitle(strings.draftEditorScreen.editor.features.required) }
          { renderFieldRequiredCheckbox(field) }
          { renderDefineUserGroup(field) }
        </Stack>
      );
    }

    return (
      <Typography>{ strings.draftEditorScreen.editor.visibility.selectVisibilityInfo }</Typography>
    );
  };

  useEffect(() => {
    checkContextSettings();
  }, [fieldIndex, pendingForm]);

  useEffect(() => {
    getSelectedSectionTitle();
  }, [ fieldIndex, sectionIndex ]);

  /**
   * Component render
   */
  return (
    <FormControl fullWidth>
      <Stack spacing={ 2 }>
        { renderFeatures() }
      </Stack>
    </FormControl>
  );
};

export default MetaformEditorRightDrawerFeatureComponent;