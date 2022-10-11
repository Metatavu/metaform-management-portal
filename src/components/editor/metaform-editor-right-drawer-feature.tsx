import { Button, Checkbox, Divider, FormControl, FormControlLabel, IconButton, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformFieldOption, MetaformSection, MetaformTableColumn, MetaformTableColumnType, MetaformFieldType, FieldRule, MetaformMemberGroup } from "generated/client";
import produce from "immer";
import slugify from "slugify";
import strings from "localization/strings";
import React, { useEffect, FC, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormContext, memberGroupPermissions, NOT_SELECTED } from "../../types/index";
import MetaformUtils from "utils/metaform-utils";
import LocalizationUtils from "utils/localization-utils";

/**
 * Component properties
 */
interface Props {
  memberGroups: MetaformMemberGroup[],
  sectionIndex?: number;
  fieldIndex?: number;
  pendingForm: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor right drawer feature component
 */
const MetaformEditorRightDrawerFeature: FC<Props> = ({
  memberGroups,
  sectionIndex,
  fieldIndex,
  pendingForm,
  setPendingForm
}) => {
  const [ newColumnType, setNewColumnType ] = useState<MetaformTableColumnType>();
  const [ selectedSection, setSelectedSection ] = useState<MetaformSection>();
  const [ selectedField, setSelectedField ] = useState<MetaformField>();
  const [ debounceTimerId, setDebounceTimerId ] = useState<NodeJS.Timeout>();
  const [ switchChecked, setSwitchChecked ] = useState<boolean>(false);
  const [ selectedMemberGroup, setSelectedMemberGroup ] = useState<string>("");
  const [ selectedMemberGroupRole, setSelectedMemberGroupRole ] = useState<string>("");
  const [ memberGroupOptIndex, setMemberGroupOptIndex ] = useState<number | null>(null);

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
      text: `${strings.draftEditorScreen.editor.features.field.newFieldOption}-${optionsAmount}`,
      permissionGroups: {
        editGroupIds: [],
        viewGroupIds: [],
        notifyGroupIds: []
      }
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
    setSwitchChecked(false);

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
   * Set permission group notify group settings
   * @param event event is checkbox value true or false
   */
  const setMemberGroupNotify = (event : boolean) => {
    const updatedForm = produce(pendingForm, draftForm => {
      if (event) {
        draftForm.sections?.[sectionIndex!].fields?.[fieldIndex!]?.options?.[memberGroupOptIndex!]!.permissionGroups!.notifyGroupIds!.push(selectedMemberGroup);
      } else {
        draftForm.sections?.[sectionIndex!].fields?.[fieldIndex!]?.options?.[memberGroupOptIndex!]!.permissionGroups!.notifyGroupIds!.splice(0, 1);
      }
    });
    setPendingForm(updatedForm);
  };

  /**
   * Set member group role
   * 
   * @param selectedGroupRole selected member group role
   */
  const setMemberGroupRole = (selectedGroupRole: string) => {
    setSelectedMemberGroupRole(selectedGroupRole);
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const updatedForm = produce(pendingForm, draftForm => {
        if (selectedGroupRole === memberGroupPermissions.EDIT) {
          draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.[memberGroupOptIndex!]!.permissionGroups!.editGroupIds!.push(selectedMemberGroup);
          draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.[memberGroupOptIndex!]!.permissionGroups!.viewGroupIds!.splice(0, 1);
        }
        if (selectedGroupRole === memberGroupPermissions.VIEW) {
          draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.[memberGroupOptIndex!]!.permissionGroups!.viewGroupIds!.push(selectedMemberGroup);
          draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.[memberGroupOptIndex!]!.permissionGroups!.editGroupIds!.splice(0, 1);
        }
        if (selectedGroupRole === NOT_SELECTED) {
          draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.[memberGroupOptIndex!]!.permissionGroups!.editGroupIds!.splice(0, 1);
          draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.[memberGroupOptIndex!]!.permissionGroups!.viewGroupIds!.splice(0, 1);
        }
      });
      setPendingForm(updatedForm);
    }
  };

  /**
   * Render member group role options
   * @param field selected metaform field
   */
  const memberGroupOptions = (field: MetaformField) => {
    if (selectedMemberGroup) {
      const notifyChecked = field.options![memberGroupOptIndex!].permissionGroups!.notifyGroupIds!.length !== 0;
      return (
        <FormControl fullWidth>
          <TextField
            select
            label={ strings.draftEditorScreen.editor.memberGroups.memberGroupPermission }
            value={ selectedMemberGroupRole }
            onChange={ event => setMemberGroupRole(event.target.value) }
          >
            <MenuItem value={ NOT_SELECTED }>{ strings.draftEditorScreen.editor.memberGroups.none }</MenuItem>
            <MenuItem value={ memberGroupPermissions.EDIT }>{ strings.draftEditorScreen.editor.memberGroups.edit }</MenuItem>
            <MenuItem value={ memberGroupPermissions.VIEW }>{ strings.draftEditorScreen.editor.memberGroups.view }</MenuItem>
          </TextField>
          <FormControlLabel
            label={ strings.draftEditorScreen.editor.memberGroups.notifications }
            control={
              <Checkbox
                checked={ notifyChecked }
                onChange={ event => setMemberGroupNotify(event.target.checked) }
              />
            }
          />
        </FormControl>
      );
    }
  };

  /**
   *  Empty permission groups from selected option
   *
   */
  const removePermissionGroups = () => {
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const updatedForm = produce(pendingForm, draftForm => {
        draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.[memberGroupOptIndex!]!.permissionGroups!.editGroupIds!.splice(0, 1);
        draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.[memberGroupOptIndex!]!.permissionGroups!.viewGroupIds!.splice(0, 1);
        draftForm.sections?.[sectionIndex]?.fields?.[fieldIndex]?.options?.[memberGroupOptIndex!]!.permissionGroups!.notifyGroupIds!.splice(0, 1);
      });
      setPendingForm(updatedForm);
    }
  };

  /**
   * Changing member group empty permission groups and set member group role not selected
   * 
   * @param event selected member group Id
   */
  const onMemberGroupChange = (event: string) => {
    setSelectedMemberGroup(event);
    setSelectedMemberGroupRole(NOT_SELECTED);
    removePermissionGroups();
  };

  /**
   * Render Membergroups of current metaform
   * 
   * @param field selected metaform field
   */
  const renderMemberGroups = (field: MetaformField) => {
    if (memberGroupOptIndex !== null) {
      return (
        <>
          <FormControl fullWidth>
            <TextField
              fullWidth
              select
              label={ strings.draftEditorScreen.editor.memberGroups.memberGroup }
              value={ selectedMemberGroup }
              onChange={ event => onMemberGroupChange(event.target.value) }
            >
              <MenuItem sx={{ color: "gray" }}>{ strings.draftEditorScreen.editor.visibility.selectField }</MenuItem>
              { memberGroups.map(field2 => {
                return (
                  <MenuItem value={ field2.id } key={ field2.id }>
                    { field2.displayName }
                  </MenuItem>
                );
              })
              }
            </TextField>
          </FormControl>
          { memberGroupOptions(field) }
        </>
      );
    }
  };

  /**
   * Render options of current field if its Select, Radio or Checkbox
   * 
   * @param field selected metaform field
   */
  const renderFieldValues = (field: MetaformField) => {
    if (switchChecked) {
      return (
        <>
          <FormControl fullWidth>
            <TextField
              select
              fullWidth
              label={ strings.draftEditorScreen.editor.memberGroups.fieldValueLabel }
              value={ memberGroupOptIndex }
              onChange={ event => setMemberGroupOptIndex(Number(event.target.value))}
            >
              <MenuItem sx={{ color: "gray" }}>{ strings.draftEditorScreen.editor.visibility.selectField }</MenuItem>
              { field.options!.map((fieldValue, index) => {
                const constructedKey = `${fieldValue.name}-${index}`;
                return (
                  <MenuItem value={ index } key={ constructedKey }>
                    { fieldValue.text }
                  </MenuItem>
                );
              })
              }
            </TextField>
          </FormControl>
          { renderMemberGroups(field) }
        </>
      );
    }
  };

  /**
   * Set switch value depending param value if false remove permission group from selected option
   * 
   * @param value value of switch true or false
   */
  const setSwitchValue = (value: boolean) => {
    setSwitchChecked(value);
    setMemberGroupOptIndex(null);
    if (!value) {
      removePermissionGroups();
    }
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
   * Render define member group permission switch
   * 
   * @param field selected metaform field
   */
  const renderDefineUserGroup = (field: MetaformField) => {
    const currentField = pendingForm.sections![sectionIndex!].fields![fieldIndex!];
    if (currentField) {
      if (MetaformUtils.fieldTypesAllowVisibility.includes(currentField.type)) {
        return (
          <>
            <Typography variant="subtitle1">
              { strings.draftEditorScreen.editor.memberGroups.memberGroupDefineSettings }
            </Typography>
            <FormControl>
              <FormControlLabel
                label={ strings.draftEditorScreen.editor.features.field.defineUserGroup }
                control={
                  <Switch
                    checked={switchChecked}
                    onChange={ event => setSwitchValue(event.target.checked) }
                    sx={{ mb: "20px" }}
                  />
                }
              />
              <Typography variant="body2" sx={{ display: "none" }}>
                { strings.draftEditorScreen.editor.features.field.selectableFieldsInfo }
              </Typography>
            </FormControl>
            { renderFieldValues(field) }
          </>
        );
      }
    }
  };

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
            { renderDefineUserGroup(field) }
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
   * Check if selected field have member groups
   * 
   */
  const checkIfMemberGroups = () => {
    setMemberGroupOptIndex(null);
    setSelectedMemberGroup("");
    setSelectedMemberGroupRole(NOT_SELECTED);
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const currentField = pendingForm.sections![sectionIndex!].fields![fieldIndex!];
      if (MetaformUtils.fieldTypesAllowVisibility.includes(currentField.type)) {
        let findFirst = true;
        currentField.options?.forEach((field, index) => {
          if (field.permissionGroups && findFirst) {
            if (field.permissionGroups.editGroupIds!.length !== 0) {
              setSwitchChecked(true);
              setMemberGroupOptIndex(index);
              setSelectedMemberGroup(field.permissionGroups.editGroupIds![0]);
              setSelectedMemberGroupRole(memberGroupPermissions.EDIT);
              findFirst = false;
            }
            if (field.permissionGroups.viewGroupIds!.length !== 0) {
              setSwitchChecked(true);
              setMemberGroupOptIndex(index);
              setSelectedMemberGroup(field.permissionGroups.viewGroupIds![0]);
              setSelectedMemberGroupRole(memberGroupPermissions.VIEW);
              findFirst = false;
            }
            if (field.permissionGroups.notifyGroupIds!.length !== 0) {
              setSwitchChecked(true);
              setMemberGroupOptIndex(index);
              setSelectedMemberGroup(field.permissionGroups.notifyGroupIds![0]);
              findFirst = false;
            }
          }
        });
      }
    }
  };

  /**
   * When changing member group option check if option have member group.
   */
  const setMemberGroupsIfFound = () => {
    setSelectedMemberGroup("");
    setSelectedMemberGroupRole("");
    if (memberGroupOptIndex !== null) {
      setSwitchChecked(true);
      const currentField = pendingForm.sections![sectionIndex!].fields![fieldIndex!].options![memberGroupOptIndex!].permissionGroups;
      if (currentField?.editGroupIds!.length !== 0) {
        setSelectedMemberGroup(currentField!.editGroupIds![0]);
        setSelectedMemberGroupRole(memberGroupPermissions.EDIT);
      }
      if (currentField?.viewGroupIds!.length !== 0) {
        setSelectedMemberGroup(currentField!.viewGroupIds![0]);
        setSelectedMemberGroupRole(memberGroupPermissions.VIEW);
      }
      if (currentField?.notifyGroupIds!.length !== 0) {
        setSelectedMemberGroup(currentField!.notifyGroupIds![0]);
      }
    }
  };

  useEffect(() => {
    checkIfMemberGroups();
  }, [switchChecked]);

  useEffect(() => {
    setSwitchChecked(false);
    checkIfMemberGroups();
  }, [fieldIndex]);

  useEffect(() => {
    setMemberGroupsIfFound();
  }, [memberGroupOptIndex]);

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