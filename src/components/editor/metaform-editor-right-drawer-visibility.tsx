import { Button, Divider, FormControlLabel, IconButton, MenuItem, Stack, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { FieldRule, Metaform, MetaformField, MetaformFieldOption } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { useEffect, FC } from "react";
import { VisibilitySource } from "types";
import MetaformUtils from "utils/metaform-utils";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Navigation from "@mui/icons-material/Navigation";
import { HelpOutline } from "@mui/icons-material";

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
 * Draft editor right drawer visibility component
 */
const MetaFormRightDrawerVisibility: FC<Props> = ({
  sectionIndex,
  fieldIndex,
  pendingForm,
  setPendingForm
}) => {
  const [ selectedVisibleIf, setSelectedVisibleIf ] = React.useState<FieldRule | undefined>();
  const [ visibleIfSource, setVisibleIfSource ] = React.useState<VisibilitySource>(VisibilitySource.NONE);
  const [ showVisibleIfProperties, setShowVisibleIfProperties ] = React.useState<number | null | undefined>();
  const [ showTooltip, setShowTooltip ] = React.useState<boolean>(false);

  /**
   * Updates visibleIf source section, field
   */
  const updateSelected = () => {
    const field = MetaformUtils.getMetaformField(pendingForm, sectionIndex, fieldIndex);
    const section = MetaformUtils.getMetaformSection(pendingForm, sectionIndex);

    if (field !== undefined) {
      setSelectedVisibleIf(field.visibleIf);
      setVisibleIfSource(VisibilitySource.FIELD);
    } else if (section !== undefined) {
      setSelectedVisibleIf(section.visibleIf);
      setVisibleIfSource(VisibilitySource.SECTION);
    } else {
      setSelectedVisibleIf(undefined);
      setVisibleIfSource(VisibilitySource.NONE);
    }
  };

  useEffect(() => {
    updateSelected();
  }, [ sectionIndex, fieldIndex, pendingForm]);

  /**
   * Updated visibleIfSource visible if
   *
   * @param visibleIf visible if
   * @param updateOrField? true or false depending if we are updating or field
   * @param orIndex? index of or value if we are updating or field
   */
  const updateSelectedVisibleIf = (visibleIf: FieldRule | undefined | any, updateOrField?: boolean, orIndex?: number) => {
    if (sectionIndex === undefined) {
      return;
    }
    if (fieldIndex !== undefined) {
      if (visibleIfSource === VisibilitySource.FIELD && updateOrField) {
        const updatedForm = produce(pendingForm, draftForm => {
          draftForm.sections![sectionIndex].fields![fieldIndex].visibleIf!.or![orIndex!] = visibleIf;
        });
        setPendingForm(updatedForm);
      }

      if (visibleIfSource === VisibilitySource.FIELD && !updateOrField) {
        const updatedForm = produce(pendingForm, draftForm => {
          draftForm.sections![sectionIndex].fields![fieldIndex].visibleIf = visibleIf;
        });
        setPendingForm(updatedForm);
      }
    }

    if (visibleIfSource === VisibilitySource.SECTION && !updateOrField) {
      const updatedForm = produce(pendingForm, draftForm => {
        draftForm.sections![sectionIndex].visibleIf = visibleIf;
      });
      setPendingForm(updatedForm);
    }

    if (visibleIfSource === VisibilitySource.SECTION && updateOrField) {
      const updatedForm = produce(pendingForm, draftForm => {
        draftForm.sections![sectionIndex].visibleIf!.or![orIndex!] = visibleIf;
      });
      setPendingForm(updatedForm);
    }
  };

  /**
   * Toggles visible if enabled
   *
   * @param enableVisibleIf enable visible if
   */
  const toggleVisibleIfEnabled = (enableVisibleIf: boolean) => {
    const updatedVisibleIf: FieldRule | undefined = enableVisibleIf ?
      {} :
      undefined;
    updateSelectedVisibleIf(updatedVisibleIf);
  };

  /**
   * Add visible if or field condition
   * 
   *@param selectedVisibleIfField? Use existing visibleIf-field name if exists
   */
  const addVisibleIfOrOption = (selectedVisibleIfField? : string) => {
    if (selectedVisibleIf) {
      if (selectedVisibleIf?.or) {
        const updatedField: FieldRule | undefined = produce(selectedVisibleIf, draftField => {
          const newVisibleIfOrRule: FieldRule = {
            field: selectedVisibleIfField !== undefined ? selectedVisibleIfField : "",
            equals: ""
          };
          draftField.or?.push(newVisibleIfOrRule);
        });
        updateSelectedVisibleIf(updatedField);
      } else {
        const updatedField: FieldRule | undefined = produce(selectedVisibleIf, draftField => {
          const newVisibleIfOrRule: FieldRule[] = [{
            field: selectedVisibleIfField !== undefined ? selectedVisibleIfField : "",
            equals: ""
          }];
          draftField.or = newVisibleIfOrRule;
        });
        updateSelectedVisibleIf(updatedField);
      }
    }
  };

  /**
   * Delete visible or field condition
   * 
   * @param index index number of deleted visible or option
   */
  const deleteVisibleOrCondition = (index: number) => {
    if (selectedVisibleIf) {
      const updatedField: FieldRule | undefined = produce(selectedVisibleIf, draftField => {
        draftField.or!.splice(index, 1);
      });
      updateSelectedVisibleIf(updatedField);
    }
  };

  /**
   * Update visibleIf Or FieldRule
   * 
   * @param key visible if key
   * @param value visible if value
   * @param index index number of visibleIf or
   */
  const updateVisibleIfOrValue = (key: keyof FieldRule, value: string, index: number) => {
    if (selectedVisibleIf && selectedVisibleIf.or) {
      const selectedOrValues = selectedVisibleIf.or[index];
      const updatedVisibleIf = {
        ...selectedOrValues,
        [key]: value
      };
      updateSelectedVisibleIf(updatedVisibleIf, true, index);
    }
  };

  /**
   * Updates visible if value
   *
   * @param key visible if key
   * @param value visible if value
   */
  const updateVisibleIfValue = (key: keyof FieldRule, value: string) => {
    let addVisibleIf: string[];
    if (selectedVisibleIf === undefined) {
      return;
    }
    
    pendingForm.sections?.forEach(currentSection => {
      currentSection.fields?.forEach(currentField => {
        if (currentField.name === selectedVisibleIf.field && currentField.visibleIf !== undefined) {
          addVisibleIf = currentField.visibleIf as string[];
        }
      });
      if (addVisibleIf) {
        const updatedVisibleIf = {
          ...selectedVisibleIf,
          [key]: value,
          and: [ addVisibleIf ],
          or: undefined
        };
        updateSelectedVisibleIf(updatedVisibleIf);
      } else {
        const updatedVisibleIf = {
          ...selectedVisibleIf,
          [key]: value,
          and: undefined
        };
        updateSelectedVisibleIf(updatedVisibleIf);
      }
    });
  };

  /**
   * Renders condition field option
   *
   * @param field field
   * @param index index
   */
  const renderConditionFieldOption = (field: MetaformField, index: number) => {
    const constructedKey = `${field.title}-${index}`;
    const selectedField = MetaformUtils.getMetaformField(pendingForm, sectionIndex, fieldIndex);
    if (selectedField && selectedField.name === field.name) {
      return;
    }
    return (
      <MenuItem value={ field.name } key={ constructedKey }>
        { field.title }
      </MenuItem>
    );
  };

  /**
   * Renders visibility condition selection menu
   */
  const renderFieldCondition = () => {
    const labelText = selectedVisibleIf !== undefined
      ? strings.draftEditorScreen.editor.visibility.conditionLabelTitle
      : strings.draftEditorScreen.editor.visibility.fieldDefiningCondition;
    return (
      <Stack spacing={ 2 }>
        <Stack spacing={ 2 } direction="row">
          <Typography
            variant="subtitle1"
            style={{ width: "100%" }}
          >
            { strings.draftEditorScreen.editor.visibility.visibilityCondition }
          </Typography>
          <Tooltip
            open={ showTooltip }
            title={
              <Typography style={{ whiteSpace: "pre-line" }} variant="body1">
                { strings.draftEditorScreen.editor.visibility.visibilityConditionTooltip }
              </Typography>
            }
            placement="top-start"
            arrow
          >
            <IconButton
              onClick={ () => setShowTooltip(!showTooltip) }
              sx={{
                paddingTop: "0px",
                whiteSpace: "pre-line"
              }}
            >
              <HelpOutline/>
            </IconButton>
          </Tooltip>
        </Stack>
        <TextField
          fullWidth
          select
          disabled={ selectedVisibleIf === undefined }
          label={ labelText }
          value={ selectedVisibleIf?.field !== undefined ? selectedVisibleIf.field : "" }
          onChange={ event => updateVisibleIfValue("field", event.target.value) }
        >
          { pendingForm.sections!.flatMap(section => section.fields || [])
            .filter(field => MetaformUtils.fieldTypesAllowVisibility.includes(field.type))
            .map(renderConditionFieldOption)
          }
        </TextField>
        <Typography sx={{ color: "gray" }} hidden={ selectedVisibleIf?.field !== undefined }>
          { strings.draftEditorScreen.editor.visibility.conditionalFieldInfo }
        </Typography>
      </Stack>
    );
  };

  /**
   * Render field condition option
   *
   * @param option option
   * @param index index
   */
  const renderFieldConditionOption = (option: MetaformFieldOption, index: number) => {
    const constructedKey = `${option.text}-${index}`;
    return (
      <MenuItem value={ option.name } key={ constructedKey }>
        { option.text }
      </MenuItem>
    );
  };

  /**
   * Render equal fields for visibleIf Or values
   * 
   * @param currentVisibleIfOr VisibleIf or value what render 
   * @param orIndex index of rendered visibleIf or value
   */
  const renderEqualsForField = (currentVisibleIfOr: FieldRule, orIndex: number) => {
    if (selectedVisibleIf!.field === currentVisibleIfOr.field) {
      return (
        <Stack spacing={ 1 } direction="row">
          <TextField
            select
            fullWidth
            label={ strings.draftEditorScreen.editor.visibility.or }
            value={ currentVisibleIfOr.equals }
            onChange={ event => updateVisibleIfOrValue("equals", event.target.value, orIndex) }
          >
            { pendingForm.sections!.flatMap(section => section.fields || [])!
              .find(field => field.name === currentVisibleIfOr.field)
              ?.options!.map(renderFieldConditionOption)
            }
            <MenuItem value="true" key="selectAllValuesTrueKey4">{ strings.draftEditorScreen.editor.visibility.allChoices }</MenuItem>
          </TextField>
          <IconButton
            color="error"
            value={ orIndex }
            sx={{ alignContent: "center", padding: "0px" }}
            onClick={ () => deleteVisibleOrCondition(orIndex) }
          >
            <DeleteIcon
              color="error"
            />
          </IconButton>
        </Stack>
      );
    }
  };

  /**
   * Renders visibility condition select menu
   */
  const renderConditionValueField = () => {
    if (!selectedVisibleIf?.field) {
      return null;
    }
    return (
      <>
        <Stack spacing={ 1 } direction="row">
          <TextField
            select
            fullWidth
            label={ strings.draftEditorScreen.editor.visibility.conditionalFieldValue }
            value={ selectedVisibleIf.equals }
            onChange={ event => updateVisibleIfValue("equals", event.target.value) }
          >
            { pendingForm.sections!.flatMap(section => section.fields || [])!
              .find(field => field.name === selectedVisibleIf.field)
              ?.options!.map(renderFieldConditionOption)
            }
            <MenuItem value="true" key="allAndTrue">{ strings.draftEditorScreen.editor.visibility.allChoices }</MenuItem>
          </TextField>
          <IconButton
            color="success"
            sx={{ alignContent: "center", padding: "0px" }}
            onClick={ () => addVisibleIfOrOption(selectedVisibleIf.field) }
          >
            <AddCircleIcon
              color="success"
            />
          </IconButton>
        </Stack>
        <Typography sx={{ color: "gray" }} hidden={ selectedVisibleIf.equals !== undefined }>
          { strings.draftEditorScreen.editor.visibility.conditionalFieldValueInfo }
        </Typography>
        { selectedVisibleIf.or !== undefined ? selectedVisibleIf.or!.map((field, index) => {
          return (
            renderEqualsForField(field!, index)
          );
        }) : "" }
        <Typography variant="subtitle1" style={{ width: "100%", textAlign: "center" }} hidden={ selectedVisibleIf!.and === undefined }>
          { strings.draftEditorScreen.editor.visibility.andConditionChainTerms }
        </Typography>
        <Divider/>
      </>
    );
  };
  /**
 * Renders visibility switch component
 */
  const renderVisibilitySwitch = () => (
    <Stack spacing={ 2 }>
      <Typography variant="subtitle1" style={{ width: "100%" }}>
        { strings.draftEditorScreen.editor.visibility.fieldVisibility }
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={ !!selectedVisibleIf }
            onChange={ event => toggleVisibleIfEnabled(event.target.checked) }
          />
        }
        label={ strings.draftEditorScreen.editor.visibility.conditionally }
      />
    </Stack>
  );

  /**
   * If selected condition field have condition itself, find all and conditions and render them
   * 
   * @param field selected visible field and condition
   */
  const renderConditionChain = (field: FieldRule[], index?: number) => {
    if (field !== undefined) {
      return (
        field!.map(selectedField => {
          return (
            <Stack spacing={ 2 } sx={{ display: showVisibleIfProperties === index ? "block" : "none" }}>
              <Typography variant="subtitle1" style={{ width: "100%", textAlign: "center" }}>
                <Navigation/>
              </Typography>
              <Stack>
                <Typography variant="subtitle1" style={{ width: "100%" }}/>
                <TextField
                  fullWidth
                  select
                  disabled
                  label={ strings.draftEditorScreen.editor.visibility.conditionLabelTitle }
                  value={ selectedField.field }
                  onChange={ event => updateVisibleIfValue("field", event.target.value) }
                >
                  { pendingForm.sections!.flatMap(section => section.fields || [])
                    .filter(sectionField => MetaformUtils.fieldTypesAllowVisibility.includes(sectionField.type))
                    .map(renderConditionFieldOption)
                  }
                </TextField>
              </Stack>
              <TextField
                fullWidth
                select
                disabled
                label={ strings.draftEditorScreen.editor.visibility.conditionalFieldValue }
                value={ selectedField.equals }
                onChange={ event => updateVisibleIfValue("equals", event.target.value) }
      
              >
                { pendingForm.sections!.flatMap(section => section.fields || [])!
                  .find(sectionField => sectionField.name === selectedField.field)
                  ?.options!.map(renderFieldConditionOption)
                }
                <MenuItem value="true" key="selectAllValuesTrueKey">{ strings.draftEditorScreen.editor.visibility.allChoices }</MenuItem>
              </TextField>
              { selectedField.and !== undefined ? selectedField.and!.map(() => {
                return (
                  renderConditionChain(selectedField!.and!)
                );
              })
                :
                "" }
            </Stack>
          );
        })
      );
    }
  };

  /**
   * Render button for and conditions
   */
  const renderShowAndConditionButton = (index?: number) => {
    if (!selectedVisibleIf?.field || selectedVisibleIf.and === undefined || selectedVisibleIf.and![0] === null) {
      return null;
    }
    return (
      <>
        { renderConditionChain(selectedVisibleIf.and, index) }
        <Button onClick={ () => setShowVisibleIfProperties(showVisibleIfProperties === index ? null : index) }>
          { showVisibleIfProperties === index ?
            strings.draftEditorScreen.editor.visibility.closeConditionChain :
            strings.draftEditorScreen.editor.visibility.showConditionChain
          }
        </Button>
        <Divider/>
      </>
    );
  };

  /**
   * Render button for adding visible or fields
   */
  const renderAddVisibleOrFieldButton = () => {
    if (!selectedVisibleIf?.equals || !selectedVisibleIf?.field || selectedVisibleIf.and) {
      return null;
    }
    return (
      <Button onClick={ () => addVisibleIfOrOption() }>{ strings.draftEditorScreen.editor.visibility.addVisibleOrButtonText }</Button>
    );
  };

  /**
   * Render equal field of selected field visibleIf or condition
   * 
   * @param selectedField field where we get visibleIf or condition
   * @param index index number of selected field visibleIf or condition
   */
  const renderVisibleOrEqualField = (selectedField: FieldRule, index: number) => (
    <Stack spacing={ 2 }>
      <TextField
        select
        label={ strings.draftEditorScreen.editor.visibility.conditionalFieldValue }
        value={ selectedField.equals }
        onChange={ event => updateVisibleIfOrValue("equals", event.target.value, index) }
      >
        { pendingForm.sections!.flatMap(section => section.fields || [])!
          .find(field => field.name === selectedField.field)
          ?.options!.map(renderFieldConditionOption)
        }
        <MenuItem value="true" key="selectAllValuesTrueKey2">{ strings.draftEditorScreen.editor.visibility.allChoices }</MenuItem>
      </TextField>
      <Typography variant="subtitle1" style={{ width: "100%", textAlign: "center" }} hidden={ selectedVisibleIf!.and === undefined }>
        { strings.draftEditorScreen.editor.visibility.andConditionChainTerms }
      </Typography>
      { renderShowAndConditionButton(index) }
      <Divider/>
    </Stack>
  );

  /**
   * Render all visible or fields of selected field / section
   */
  const renderVisibleOrField = () => {
    let visibilityConditionIndex = 1;
    if (selectedVisibleIf?.or !== undefined) {
      return (
        selectedVisibleIf.or!.map((selectedField, index) => {
          if (selectedVisibleIf.field !== selectedField.field) {
            visibilityConditionIndex += 1;
            return (
              <Stack spacing={ 2 }>
                <Stack spacing={ 2 } direction="row" flex={ 2 }>
                  <Typography variant="subtitle1" style={{ width: "100%" }}>
                    { strings.draftEditorScreen.editor.visibility.visibilityCondition }
                    { visibilityConditionIndex }
                  </Typography>
                  <IconButton
                    color="error"
                    value={ index }
                    sx={{ alignContent: "center", paddingTop: "0px" }}
                    onClick={ () => deleteVisibleOrCondition(index) }
                  >
                    <DeleteIcon
                      color="error"
                    />
                  </IconButton>
                </Stack>
                <TextField
                  select
                  label={ strings.draftEditorScreen.editor.visibility.conditionLabelTitle }
                  value={ selectedField.field }
                  onChange={ (event => updateVisibleIfOrValue("field", event.target.value, index)) }
                >
                  { pendingForm.sections!.flatMap(section => section.fields || [])
                    .filter(field => MetaformUtils.fieldTypesAllowVisibility.includes(field.type))
                    .map(renderConditionFieldOption)
                  }
                  <MenuItem value="true" key="selectAllValuesTrueKey3">{ strings.draftEditorScreen.editor.visibility.allChoices }</MenuItem>
                </TextField>
                { renderVisibleOrEqualField(selectedField, index) }
              </Stack>
            );
          }
          return null;
        }));
    }
  };

  /**
   * Renders editor
   */
  const renderEditor = () => (
    <>
      { renderVisibilitySwitch() }
      <Divider/>
      { renderFieldCondition() }
      { renderConditionValueField() }
      { renderShowAndConditionButton() }
      { renderVisibleOrField() }
      { renderAddVisibleOrFieldButton() }
    </>
  );

  /**
   * Renders empty selection
   */
  const renderEmptySelection = () => (
    <Typography>{ strings.draftEditorScreen.editor.emptySelection}</Typography>
  );

  /**
   * Renders visibility editor
   */
  const renderVisibilityEditor = () => {
    if (visibleIfSource !== VisibilitySource.NONE) {
      return renderEditor();
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
      { renderVisibilityEditor() }
    </Stack>
  );
};

export default MetaFormRightDrawerVisibility;