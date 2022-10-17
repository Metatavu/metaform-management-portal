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
import { uuid4 } from "@sentry/utils";

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
  const [ memberGroupSwitch, setMemberGroupSwitch ] = useState<boolean>(false);
  const [ selectedMemberGroup, setSelectedMemberGroup ] = useState<string>("");
  const [ selectedMemberGroupPermission, setSelectedMemberGroupPermission ] = useState<string>("");
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
          const fieldNameMatch = pendingForm.sections![sectionIndex].fields![fieldIndex].name || "";

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

    const newOption: MetaformFieldOption = {
      name: `${strings.draftEditorScreen.editor.features.field.newFieldOption}-${uuid4()}`,
      text: `${strings.draftEditorScreen.editor.features.field.newFieldOption}`,
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
    setMemberGroupSwitch(false);

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
   * Update slider or number field min or max values. Number field can have empty min/max values but slider have to have min and max values
   *
   * @param eventValue Value of min or max value
   * @param scopeValue Min or Max, depending which value we are changing
   */
  const updateSliderOrNumberValue = (eventValue: number, scopeValue: string) => {
    if (!selectedField) {
      return;
    }
    const field = pendingForm.sections![sectionIndex!].fields![fieldIndex!];
    const updatedField = produce(selectedField, draftField => {
      if (scopeValue === "min") {
        if (!eventValue && field.type === MetaformFieldType.Number) {
          draftField.min = undefined;
        } else {
          draftField.min = Number(eventValue);
        }
      }
      if (scopeValue === "max") {
        if (!eventValue) {
          if (field.type === MetaformFieldType.Number) {
            draftField.max = undefined;
          } else {
            draftField.max = field.min! + 1;
          }
        } else {
          draftField.max = Number(eventValue);
        }
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
   * Updates allows work days only for date, date-time field
   *
   * @param checked checked value of the checkbox value true or false
   */
  const updateWorkDaysOnly = (checked: boolean) => {
    if (!selectedField) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      draftField.workdaysOnly = checked;
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
   *
   * @param checked checked value of the checkbox value true or false
   */
  const setMemberGroupNotify = (checked: boolean) => {
    if (!selectedField) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      if (checked) {
        draftField.options?.[memberGroupOptIndex!]!.permissionGroups!.notifyGroupIds!.push(selectedMemberGroup);
      } else {
        draftField.options?.[memberGroupOptIndex!]!.permissionGroups!.notifyGroupIds!.splice(0, 1);
      }
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Set member group permission view or edit
   *
   * @param selectedGroupPermission selected member group permission
   */
  const setMemberGroupPermission = (selectedGroupPermission: string) => {
    setSelectedMemberGroupPermission(selectedGroupPermission);

    if (!selectedField || !memberGroupOptIndex) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      if (selectedGroupPermission === memberGroupPermissions.EDIT) {
        draftField.options?.[memberGroupOptIndex]!.permissionGroups!.editGroupIds!.push(selectedMemberGroup);
        draftField.options?.[memberGroupOptIndex]!.permissionGroups!.viewGroupIds!.splice(0, 1);
      }
      if (selectedGroupPermission === memberGroupPermissions.VIEW) {
        draftField.options?.[memberGroupOptIndex]!.permissionGroups!.viewGroupIds!.push(selectedMemberGroup);
        draftField.options?.[memberGroupOptIndex]!.permissionGroups!.editGroupIds!.splice(0, 1);
      }
      if (selectedGroupPermission === NOT_SELECTED) {
        draftField.options?.[memberGroupOptIndex]!.permissionGroups!.editGroupIds!.splice(0, 1);
        draftField.options?.[memberGroupOptIndex]!.permissionGroups!.viewGroupIds!.splice(0, 1);
      }
    });

    updateFormField(updatedField);
  };

  /**
   *  Empty permission groups from selected option
   *
   */
  const removePermissionGroups = () => {
    if (!selectedField || memberGroupOptIndex === undefined) {
      return;
    }
    if (memberGroupOptIndex !== null) {
      const updatedField = produce(selectedField, draftField => {
        draftField.options?.[memberGroupOptIndex]!.permissionGroups!.editGroupIds!.splice(0, 1);
        draftField.options?.[memberGroupOptIndex]!.permissionGroups!.viewGroupIds!.splice(0, 1);
        draftField.options?.[memberGroupOptIndex]!.permissionGroups!.notifyGroupIds!.splice(0, 1);
      });

      updateFormField(updatedField);
    }
  };

  /**
   * Handle member group change and empty member group permission selection. Also if option had permission member groups remove them.
   *
   * @param groupId selected member group Id
   */
  const handleMemberGroupChange = (groupId: string) => {
    setSelectedMemberGroup(groupId);
    setSelectedMemberGroupPermission(NOT_SELECTED);
    removePermissionGroups();
  };
  /**
   * Set switch value depending param value if false remove permission group from selected option
   *
   * @param value value of switch true or false
   */
  const setNotifyPermissionSwitchValue = (hasNotifyPermissions: boolean) => {
    setMemberGroupSwitch(hasNotifyPermissions);
    setMemberGroupOptIndex(null);
    if (!hasNotifyPermissions) {
      removePermissionGroups();
    }
  };

  /**
   * Set member groups for selected field
   */
  const checkIfMemberGroupsAreSelected = () => {
    setMemberGroupOptIndex(null);
    setSelectedMemberGroup("");
    setSelectedMemberGroupPermission(NOT_SELECTED);
    if (fieldIndex !== undefined && sectionIndex !== undefined) {
      const currentField = pendingForm.sections![sectionIndex!].fields![fieldIndex!];
      if (MetaformUtils.fieldTypesAllowVisibility.includes(currentField.type)) {
        let memberGroupNotFound = true;
        currentField.options?.forEach((field, index) => {
          if (field.permissionGroups && memberGroupNotFound) {
            if (field.permissionGroups.editGroupIds!.length !== 0) {
              setMemberGroupSwitch(true);
              setMemberGroupOptIndex(index);
              setSelectedMemberGroup(field.permissionGroups.editGroupIds![0]);
              setSelectedMemberGroupPermission(memberGroupPermissions.EDIT);
              memberGroupNotFound = false;
            }
            if (field.permissionGroups.viewGroupIds!.length !== 0) {
              setMemberGroupSwitch(true);
              setMemberGroupOptIndex(index);
              setSelectedMemberGroup(field.permissionGroups.viewGroupIds![0]);
              setSelectedMemberGroupPermission(memberGroupPermissions.VIEW);
              memberGroupNotFound = false;
            }
            if (field.permissionGroups.notifyGroupIds!.length !== 0) {
              setMemberGroupSwitch(true);
              setMemberGroupOptIndex(index);
              setSelectedMemberGroup(field.permissionGroups.notifyGroupIds![0]);
              memberGroupNotFound = false;
            }
          }
        });
      }
    }
  };

  /**
   * Set member group for selected option
   */
  const setMemberGroupsIfFound = () => {
    setSelectedMemberGroup("");
    setSelectedMemberGroupPermission("");
    if (memberGroupOptIndex !== null) {
      setMemberGroupSwitch(true);
      const currentFieldsPermissionGroups = pendingForm.sections![sectionIndex!].fields![fieldIndex!].options![memberGroupOptIndex!].permissionGroups;
      if (currentFieldsPermissionGroups?.editGroupIds!.length !== 0) {
        setSelectedMemberGroup(currentFieldsPermissionGroups!.editGroupIds![0]);
        setSelectedMemberGroupPermission(memberGroupPermissions.EDIT);
      }
      if (currentFieldsPermissionGroups?.viewGroupIds!.length !== 0) {
        setSelectedMemberGroup(currentFieldsPermissionGroups!.viewGroupIds![0]);
        setSelectedMemberGroupPermission(memberGroupPermissions.VIEW);
      }
      if (currentFieldsPermissionGroups?.notifyGroupIds!.length !== 0) {
        setSelectedMemberGroup(currentFieldsPermissionGroups!.notifyGroupIds![0]);
      }
    }
  };

  /**
   * Render member group role options
   * @param field selected metaform field
   */
  const renderMemberGroupOptions = (field: MetaformField) => {
    if (selectedMemberGroup) {
      const notifyChecked = field.options![memberGroupOptIndex!].permissionGroups!.notifyGroupIds!.length !== 0;
      return (
        <FormControl fullWidth>
          <TextField
            select
            label={ strings.draftEditorScreen.editor.memberGroups.memberGroupPermission }
            value={ selectedMemberGroupPermission }
            onChange={ event => setMemberGroupPermission(event.target.value) }
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
   * Render member groups of current metaform
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
              onChange={ event => handleMemberGroupChange(event.target.value) }
            >
              <MenuItem sx={{ color: "gray" }}>{ strings.draftEditorScreen.editor.visibility.selectField }</MenuItem>
              { memberGroups.map(memberGroup => {
                return (
                  <MenuItem value={ memberGroup.id } key={ memberGroup.id }>
                    { memberGroup.displayName }
                  </MenuItem>
                );
              })
              }
            </TextField>
          </FormControl>
          { renderMemberGroupOptions(field) }
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
    if (memberGroupSwitch) {
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
          value={ min !== undefined ? min : "" }
          onChange={ event => updateSliderOrNumberValue(Number(event.target.value), "min") }
        />
        <TextField
          fullWidth
          type="number"
          label={ maxValueLabel }
          value={ max !== undefined ? max : "" }
          onChange={ event => updateSliderOrNumberValue(Number(event.target.value), "max") }
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
      { renderTableNewColumn() }
    </Stack>
  );

  /**
   * Renders properties for date, date-time fields
   *
   * @param field field
   */
  const renderDateTimeProperties = (field: MetaformField) => (
    <Stack spacing={ 2 }>
      <FormControlLabel
        label={ strings.draftEditorScreen.editor.features.field.workDaysOnly }
        control={
          <Switch
            checked={ !!field.workdaysOnly }
            onChange={ ({ target }) => updateWorkDaysOnly(target.checked) }
          />
        }
      />
    </Stack>
  );

  /**
   * Render define member group permission switch
   *
   * @param field selected metaform field
   */
  const renderDefineMemberGroupSwitch = (field: MetaformField) => {
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
                    checked={ memberGroupSwitch }
                    onChange={ event => setNotifyPermissionSwitchValue(event.target.checked) }
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
   * Renders field properties
   *
   * @param field field
   */
  const renderFieldProperties = (field: MetaformField) => {
    const { type } = field;

    switch (type) {
      case MetaformFieldType.Slider:
      case MetaformFieldType.Number:
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
            { renderDefineMemberGroupSwitch(field) }
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
      case MetaformFieldType.Date:
      case MetaformFieldType.DateTime:
        return (
          <>
            { renderDateTimeProperties(field) }
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

  useEffect(() => {
    checkIfMemberGroupsAreSelected();
  }, [memberGroupSwitch]);

  useEffect(() => {
    setMemberGroupSwitch(false);
    checkIfMemberGroupsAreSelected();
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