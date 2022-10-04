import { Divider, FormControlLabel, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import { FieldRule, Metaform, MetaformField, MetaformFieldOption } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { useEffect, FC } from "react";
import { VisibilitySource } from "types";
import MetaformUtils from "utils/metaform-utils";

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

  /**
   * Updates visibleIfSource section, field
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
  }, [ sectionIndex, fieldIndex ]);

  /**
   * Updated visibleIfSource visible if
   *
   * @param visibleIf visible if
   */
  const updateSelectedVisibleIf = (visibleIf: FieldRule | undefined) => {
    if (visibleIfSource === VisibilitySource.FIELD) {
      const updatedForm = produce(pendingForm, draftForm => {
        draftForm.sections![sectionIndex!].fields![fieldIndex!].visibleIf = visibleIf;
      });

      setPendingForm(updatedForm);
    }

    if (visibleIfSource === VisibilitySource.SECTION) {
      const updatedForm = produce(pendingForm, draftForm => {
        draftForm.sections![sectionIndex!].visibleIf = visibleIf;
      });

      setPendingForm(updatedForm);
    }
    setSelectedVisibleIf(visibleIf);
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
   * Updates visible if value
   *
   * @param key visible if key
   * @param value visible if value
   */
  const updateVisibleIfValue = (key: keyof FieldRule, value: string) => {
    if (selectedVisibleIf === undefined) {
      return;
    }

    const updatedVisibleIf = {
      ...selectedVisibleIf,
      [key]: value
    };

    updateSelectedVisibleIf(updatedVisibleIf);
  };

  /**
   * Renders condition field option
   *
   * @param field field
   * @param index index
   */
  const renderConditionFieldOption = (field: MetaformField, index: number) => {
    const constructedKey = `${field.title}-${index}`;

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
          value={ selectedVisibleIf?.field }
          onChange={ event => updateVisibleIfValue("field", event.target.value) }
        >
          { pendingForm.sections!.flatMap(section => section.fields || [])
            .filter(field => MetaformUtils.fieldTypesAllowVisibility.includes(field.type))
            .map(renderConditionFieldOption)
          }
        </TextField>
        <Typography sx={{ color: "gray" }}>
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
        <Divider/>
        <Typography variant="subtitle1">
          { strings.draftEditorScreen.editor.visibility.conditionalFieldValue }
        </Typography>
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
        </TextField>
        <Typography sx={{ color: "gray" }}>
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
   * Renders editor
   */
  const renderEditor = () => (
    <>
      { renderVisibilitySwitch() }
      <Divider/>
      { renderFieldCondition() }
      { renderConditionValueField() }
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