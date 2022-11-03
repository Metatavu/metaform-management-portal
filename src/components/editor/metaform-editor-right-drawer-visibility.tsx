import { Button, Divider, FormControlLabel, IconButton, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import { FieldRule, Metaform, MetaformField, MetaformFieldOption } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { useEffect, FC } from "react";
import { VisibilitySource } from "types";
import MetaformUtils from "utils/metaform-utils";
import Navigation from "@mui/icons-material/Navigation";
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
  const [ showConditions, setShowAndConditions ] = React.useState<boolean>(false);

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
   */
  const addVisibleIfOrOption = () => {
    if (selectedVisibleIf) {
      if (selectedVisibleIf?.or) {
        const updatedField: FieldRule | undefined = produce(selectedVisibleIf, draftField => {
          const newVisibleIfOrRule: FieldRule = {
            field: "",
            equals: ""
          };
          draftField.or?.push(newVisibleIfOrRule);
        });
        updateSelectedVisibleIf(updatedField);
      } else {
        const updatedField: FieldRule | undefined = produce(selectedVisibleIf, draftField => {
          const newVisibleIfOrRule: FieldRule[] = [{
            field: "",
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
          and: [ addVisibleIf ]
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
        <Typography
          variant="subtitle1"
          style={{ width: "100%" }}
        >
          { strings.draftEditorScreen.editor.visibility.visibilityCondition }
        </Typography>
        <TextField
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
   * Renders visibility condition select menu
   */
  const renderConditionValueField = () => {
    if (!selectedVisibleIf?.field) {
      return null;
    }

    return (
      <Stack spacing={ 2 }>
        <TextField
          select
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
        <Typography sx={{ color: "gray" }} hidden={ selectedVisibleIf.equals !== undefined }>
          { strings.draftEditorScreen.editor.visibility.conditionalFieldValueInfo }
        </Typography>
      </Stack>
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
  const renderConditionChain = (field: FieldRule[]) => {
    if (field !== undefined) {
      return (
        field!.map(selectedField => {
          return (
            <Stack spacing={ 2 } sx={{ display: showConditions ? "block" : "none" }}>
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
  const renderShowAndConditionButton = () => {
    if (!selectedVisibleIf?.field || selectedVisibleIf.and === undefined || selectedVisibleIf.and![0] === null) {
      return null;
    }
    return (
      <>
        { renderConditionChain(selectedVisibleIf.and) }
        <Button onClick={ () => setShowAndConditions(!showConditions) }>
          { showConditions ? strings.draftEditorScreen.editor.visibility.closeConditionChain : strings.draftEditorScreen.editor.visibility.showConditionChain }
        </Button>
        <Divider/>
      </>
    );
  };

  /**
   * Render button for adding visible or fields
   */
  const renderAddVisibleOrFieldButton = () => {
    if (!selectedVisibleIf?.equals || !selectedVisibleIf?.field) {
      return null;
    }
    
    return (
      <Button onClick={ () => addVisibleIfOrOption() }>
        { strings.draftEditorScreen.editor.visibility.addVisibleOrButtonText }
      </Button>
    );
  };

  /**
   * Render equal field of selected field visibleIf or condition
   * 
   * @param selectedField field where we get visibleIf or condition
   * @param index index number of selected field visibleIf or condition
   * 
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
      <Divider/>
    </Stack>
  );

  /**
   * Render all visible or fields of selected field / section
   */
  const renderVisibleOrField = () => {
    if (selectedVisibleIf?.or !== undefined) {
      return (
        selectedVisibleIf.or!.map((selectedField, index) => {
          return (
            <Stack spacing={ 2 }>
              <Stack spacing={ 2 } direction="row" flex={ 2 }>
                <Typography variant="subtitle1" style={{ width: "100%" }}>
                  { `${strings.draftEditorScreen.editor.visibility.visibilityCondition} ${index + 2}`}
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
                <MenuItem value="true" key="selectAllValueTrueKey3">{ strings.draftEditorScreen.editor.visibility.allChoices }</MenuItem>
              </TextField>
              { renderVisibleOrEqualField(selectedField, index) }
            </Stack>
          );
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