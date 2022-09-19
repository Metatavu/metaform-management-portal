import { Button, Checkbox, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformFieldOption, MetaformSection, MetaformTableColumn, MetaformTableColumnType } from "generated/client";
import produce from "immer";
import slugify from "slugify";
import strings from "localization/strings";
import React, { useEffect, FC } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [ metaformSectionTitle, setMetaformSectionTitle ] = React.useState<string | undefined>("");
  const [ columnType, setColumnType ] = React.useState<string>("");

  /**
   * Get title of current section
   */
  const getSelectedSectionTitle = () => {
    if (fieldIndex === undefined && sectionIndex !== undefined) {
      setMetaformSectionTitle(pendingForm.sections![sectionIndex].title ?? "");
    }
  };

  /**
   * Updates metaform field
   * 
   * @param metaformField Metaform field what we are editing
   */
  const updateFormField = (metaformField: MetaformField) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
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
   * Update option text
   * 
   * @param updateTextOption FieldOption text we are changing
   * @param index index value
   */
  const updateOptionText = (updateTextOption: MetaformFieldOption, index: number) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.splice(index, 1, updateTextOption);
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
   * Delete optionfield
   * 
   * @param index index value of optionfield what we delete
   * @param event event value
   */
  const deleteFieldOptions = (event: any, index: number) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.splice(index, 1);
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
   * Delete column
   * 
   * @param index indexvalue of current column we are deleting
   * @param event event value
   */
  const deleteColumn = (event: any, index: number) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.columns?.splice(index, 1);
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
   * Add custom html code in field
   * 
   * @param htmlField html field
   */
  const updateCustomHtml = (htmlField: MetaformField) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, htmlField);
    });
    setPendingForm(updatedForm);
  };

  /**
   * Render slider scope values
   *  
   * @param selectedField selected metaformField
   * */
  const renderSliderScopeValues = (selectedField: MetaformField) => {
    const {
      max,
      title,
      min
    } = selectedField;
    return (
      <>
        <TextField
          fullWidth
          type="number"
          sx={{ height: "50px" }}
          label={`${title} min value`}
          value={ min }
          onChange={ event => updateSliderValue(event.target.value, "min") }
        />
        <TextField
          fullWidth
          type="number"
          sx={{ height: "50px" }}
          label={`${title} max value`}
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
                  onClick={ event => deleteFieldOptions(event, index) }
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
        onChange={ event => updateCustomHtml({ ...selectedField, html: event.target.value }) }
      />
    );
  };

  /**
   * Update column title value
   * 
   * @param tableColumn MetaformTableColumn where we are changing title
   * @param index index value of current column title
   */
  const updateColumnTitle = (tableColumn: MetaformTableColumn, index: number) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.columns?.splice(index, 1, tableColumn);
    });
    setPendingForm(updatedForm);
  };

  /**
   * Render features for adding, editing and deleting columns in table field
   */
  const renderTableColumns = () => {
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
                onClick={ event => deleteColumn(event, index) }
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
        <FormControl fullWidth>
          <InputLabel id="fieldCategoryVisiblityConditionLabel">
            { strings.draftEditorScreen.editor.features.addColumnType }
          </InputLabel>
          <Select
            fullWidth
            labelId="fieldCategoryVisiblityConditionLabel"
            label={ strings.draftEditorScreen.editor.features.addColumnType }
            sx={{ height: "50px" }}
            value={ columnType }
            onChange={ event => setColumnType(event.target.value) }
          >
            <MenuItem value="text">{ strings.draftEditorScreen.editor.features.columnTextType}</MenuItem>
            <MenuItem value="number">{ strings.draftEditorScreen.editor.features.columnNumberType}</MenuItem>
          </Select>
          <Button
            fullWidth
            sx={{
              height: "50px",
              mt: "5px"
            }}
            onClick={ addNewColumn }
          >
            { strings.draftEditorScreen.editor.features.addNewColumn }
          </Button>
        </FormControl>
      </>
    );
  };

  /**
   * Render options depending what field type is selected
   */
  const renderOptions = () => {
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const selectedField = pendingForm.sections![sectionIndex].fields![fieldIndex];
      const { type } = selectedField;
      if (type === "slider") {
        return (
          renderSliderScopeValues(selectedField)
        );
      }
      if (type === "checklist" || type === "radio" || type === "select") {
        return (
          renderFieldOptions()
        );
      }
      if (type === "html") {
        return (
          renderHtmlEditor(selectedField)
        );
      }
      if (type === "table") {
        return (
          renderTableColumns()
        );
      }
    }
  };
  
  /**
   * Render define user group component
   * 
   *  @param field selected field
   */
  const defineUserGroupComponent = (field: MetaformField) => {
    const { type } = field;
    const allowToDefineUserGroup = type === "select" || type === "date-time" || type === "radio" || type === "checklist" || type === "date";
    return (
      <>
        <Typography variant="subtitle1" style={{ width: "100%" }}>
          { strings.draftEditorScreen.editor.features.defineUserGroup }
        </Typography>
        <FormControl disabled={ !allowToDefineUserGroup }>
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
        </FormControl>
      </>
    );
  };

  /**
   * Render fieldTitle and Required or not component
   * 
   * @param field current field
   */
  const fieldTitleAndRequiredComponent = (field: MetaformField) => {
    if (field === undefined) {
      return null;
    }
    const {
      text,
      title,
      type,
      required
    } = field;
    return (
      <>
        <Typography variant="subtitle1" style={{ width: "100%" }}>
          { strings.draftEditorScreen.editor.features.fieldDatas }
        </Typography>
        <TextField
          fullWidth
          label={ type === "submit" ? strings.draftEditorScreen.editor.features.textOfSubmitButton : strings.draftEditorScreen.editor.features.fieldTitle }
          value={ type === "submit" ? text : title }
          onChange={ event => {
            if (type === "submit") {
              updateFormField({
                ...field,
                text: event.target.value,
                name: slugify(`${metaformSectionTitle}-${event.target.value}-${sectionIndex}-${fieldIndex}`)
              });
            } else {
              updateFormField({
                ...field,
                title: event.target.value,
                name: slugify(`${metaformSectionTitle}-${event.target.value}-${sectionIndex}-${fieldIndex}`)
              });
            }
          }
          }
        />
        { renderOptions() }
        <Divider/>
        <Typography variant="subtitle1" style={{ width: "100%" }}>
          { strings.draftEditorScreen.editor.features.required }
        </Typography>
        <FormControlLabel
          label={ strings.generic.yes }
          control={
            <Checkbox
              checked={ required }
              onChange={ event => updateFormField({ ...field, required: event.target.checked }) }
            />
          }
        />
      </>
    );
  };

  /**
   * Render feature component
   */
  const renderFeatures = () => {
    if (sectionIndex !== undefined && fieldIndex === undefined) {
      const section = pendingForm.sections![sectionIndex];
      return (
        <TextField
          fullWidth
          value={ section.title ?? "" }
          label={ strings.draftEditorScreen.editor.features.sectionTitle }
          onChange={ event => updateFormSection({
            ...section,
            title: event.target.value
          }) }
        />
      );
    }

    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const field = pendingForm.sections![sectionIndex].fields![fieldIndex];
      if (field === undefined) {
        return null;
      }
      return (
        <>
          { fieldTitleAndRequiredComponent(field) }
          <Divider/>
          { defineUserGroupComponent(field) }
        </>
      );
    }
    return (
      <Typography>{ strings.draftEditorScreen.editor.visibility.selectVisibilityInfo }</Typography>
    );
  };

  useEffect(() => {
    getSelectedSectionTitle();
  }, [fieldIndex, sectionIndex]);

  /**
   * Component render
   */
  return renderFeatures();
};

export default MetaformEditorRightDrawerFeatureComponent;