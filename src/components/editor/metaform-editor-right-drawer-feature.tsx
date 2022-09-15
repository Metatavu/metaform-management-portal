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
  const setVisiblityComponentValue = () => {
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
   * Add new Radio / Boolean / Select option field
   */
  const addNewOptionField = () => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const optionsAmount = JSON.stringify(pendingForm.sections![sectionIndex].fields![fieldIndex].options?.length);
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.push({ name: optionsAmount, text: "Valintakenttä" });
    });
    setPendingForm(updatedForm);
  };

  /**
   * Delete optionfield
   * @param index index value of optionfield what we delete
   * @param event event value
   */
  const deleteOptionField = (event: any, index: number) => {
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
   * @param eventValue Value of min or max slider value
   * @param minMax Min or Max, depending which value we are changing
   */
  const updateSliderValue = (eventValue:string, minMax: string) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const metaFormField = pendingForm.sections![sectionIndex].fields![fieldIndex];
    if (minMax === "min") {
      const updateField = {
        ...metaFormField,
        min: eventValue as unknown as number
      };
      const updatedForm = produce(pendingForm, draftForm => {
        draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, updateField);
      });
      setPendingForm(updatedForm);
    }
    if (minMax === "max") {
      const updateField = {
        ...metaFormField,
        max: eventValue as unknown as number
      };
      const updatedForm = produce(pendingForm, draftForm => {
        draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, updateField);
      });
      setPendingForm(updatedForm);
    }
  };

  /**
   * Delete column
   * @param index indexvalue of current column we are deleting
   * @param event event value
   */
  const deleteColumn = (event: any, index : number) => {
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
        title: `Column title ${columnsAmount}`
      });
    });
    setPendingForm(updatedForm);
  };

  /**
   * Add custom html code
   * @param htmlField html field
   */
  const updateCustomHtml = (htmlField : MetaformField) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, htmlField);
    });
    setPendingForm(updatedForm);
  };

  /**
   * Render option textfields if radio/checklist or boolean
   */
  const options = () => {
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const selectedType = pendingForm.sections![sectionIndex].fields![fieldIndex];
      if (selectedType.type === "slider") {
        return (
          <>
            <TextField
              fullWidth
              type="number"
              sx={{ height: "50px" }}
              label={`${selectedType.title} min value`}
              value={ selectedType.min}
              onChange={ event => updateSliderValue(event.target.value, "min") }
            />
            <TextField
              fullWidth
              type="number"
              sx={{ height: "50px" }}
              label={`${selectedType.title} max value`}
              value={ selectedType.max}
              onChange={ event => updateSliderValue(event.target.value, "max") }
            />
          </>
        );
      }
      if (selectedType.type === "checklist" || selectedType.type === "radio" || selectedType.type === "select") {
        const optionsText = pendingForm.sections![sectionIndex].fields![fieldIndex].options;
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
                      ...optionsText,
                      name: slugify(event.target.value),
                      text: event.target.value
                    }, index)}
                  />
                  <Button variant="outlined" color="error" sx={{ alignContent: "center", height: "40px" }} value={ index } onClick={ event => deleteOptionField(event, index) }>
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
            <Button fullWidth sx={{ height: "50px" }} onClick={ addNewOptionField }>{ strings.draftEditorScreen.editor.features.addSelectionField }</Button>
          </>
        );
      }
      if (selectedType.type === "html") {
        return (
          <TextField
            fullWidth
            placeholder="Add custom html here"
            multiline
            rows={4}
            value={ selectedType.html }
            onChange={ event => updateCustomHtml({ ...selectedType, html: event.target.value }) }
          />
        );
      }
    }
  };

  /**
   * Update column title value
   * @param tableColumn MetaformTableColumn where we are changing title
   * @param index index value of current column title
   */
  const updateColumnTitle = (tableColumn : MetaformTableColumn, index: number) => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.columns?.splice(index, 1, tableColumn);
    });
    setPendingForm(updatedForm);
  };

  /**
   * Options table component render table columns editor
   */
  const optionsTable = () => {
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const selectedType = pendingForm.sections![sectionIndex].fields![fieldIndex];
      if (selectedType.type === "table") {
        const tableColumn = pendingForm.sections![sectionIndex].fields![fieldIndex].columns;
        return (
          <>
            { pendingForm.sections![sectionIndex].fields![fieldIndex].columns!.map((field, index) => {
              return (
                <Stack spacing={ 2 } direction="row">
                  <TextField
                    sx={{ height: "50px" }}
                    value={ field.title }
                    label={ index }
                    onChange={ event => updateColumnTitle({
                      ...tableColumn,
                      name: slugify(event.target.value),
                      title: event.target.value,
                      type: "text" as MetaformTableColumnType,
                      values: undefined
                    }, index)}
                  />
                  <Button variant="outlined" color="error" sx={{ alignContent: "center", height: "40px" }} value={ index } onClick={ event => deleteColumn(event, index) }>
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
              <Button fullWidth sx={{ height: "50px", mt: "5px" }} onClick={ addNewColumn }>{ strings.draftEditorScreen.editor.features.addNewColumn }</Button>
            </FormControl>
          </>
        );
      }
    }
  };
  
  /**
   * Render define user group component
   *  @param field current field
   */
  const defineUserGroupComponent = (field : MetaformField) => {
    const allowToDefineUserGroup = field.type === "select" || field.type === "date-time" || field.type === "radio" || field.type === "checklist" || field.type === "date";
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
   * @param field current field
   */
  const fieldTitleAndRequiredComponent = (field: MetaformField) => {
    return (
      <>
        <Typography variant="subtitle1" style={{ width: "100%" }}>
          { strings.draftEditorScreen.editor.features.fieldDatas }
        </Typography>
        <TextField
          fullWidth
          label={ field.type === "submit" ? strings.draftEditorScreen.editor.features.textOfSubmitButton : strings.draftEditorScreen.editor.features.fieldTitle }
          value={ field.type === "submit" ? field.text : field.title }
          onChange={ event => {
            if (field.type === "submit") {
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
        { options() }
        { optionsTable() }
        <Divider/>
        <Typography variant="subtitle1" style={{ width: "100%" }}>
          { strings.draftEditorScreen.editor.features.required }
        </Typography>
        <FormControlLabel
          label={ strings.generic.yes }
          control={
            <Checkbox
              checked={ field.required }
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
          value={ section.title }
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
    setVisiblityComponentValue();
  }, [fieldIndex, sectionIndex]);

  /**
   * Component render
   */
  return renderFeatures();
};

export default MetaformEditorRightDrawerFeatureComponent;