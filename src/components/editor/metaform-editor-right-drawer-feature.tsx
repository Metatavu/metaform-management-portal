import { Button, Checkbox, Divider, FormControl, FormControlLabel, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformSection, MetaformFieldType, FieldRule, MetaformMemberGroup, MetaformFieldOption } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useEffect, useState } from "react";
import MetaformUtils from "utils/metaform-utils";
import MetaformDefineMemberGroupComponent from "./feature-components/MetaformDefineMemberGroupComponent";
import MetaformSliderComponent from "./feature-components/MetaformSlidercomponent";
import MetaformTableComponent from "./feature-components/MetaformTableComponent";
import MetaformDateTimeComponent from "./feature-components/MetaformDateTimeComponent";
import MetaformMultiChoiceFieldPropertiesComponent from "./feature-components/MetaformMultiChoiceFieldPropertiesComponent";
import MetaformContextOptionsComponent from "./feature-components/MetaformContextOptionsComponent";
import MetaformFieldAndSubmitEditTitleComponent from "./feature-components/MetaformFieldAndSubmitTitleEditComponent";
import MetaformFieldRequiredComponent from "./feature-components/MetaformFieldRequiredComponent";
import { selectMetaform } from "../../features/metaform-slice";
import { useAppSelector } from "app/hooks";
import slugify from "slugify";
import { FormContext } from "types";
import LocalizationUtils from "utils/localization-utils";

/**
 * Component properties
 */
interface Props {
  memberGroups: MetaformMemberGroup[],
  pendingForm: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor right drawer feature component
 */
export const MetaformEditorRightDrawerFeature: FC<Props> = ({
  memberGroups,
  pendingForm,
  setPendingForm
}) => {
  const { metaformFieldIndex, metaformSectionIndex } = useAppSelector(selectMetaform);
  const [ debounceTimerId, setDebounceTimerId ] = useState<NodeJS.Timeout>();
  const [ selectMemberGroupEnabled, setSelectMemberGroupEnabled ] = useState<boolean>(false);
  const [ selectedMemberGroupId, setSelectedMemberGroupId ] = useState<string>();
  const [ selectedMemberGroupPermission, setSelectedMemberGroupPermission ] = useState<NullableMemberGroupPermission>(NOT_SELECTED);
  const [ memberGroupOptIndex, setMemberGroupOptIndex ] = useState<number>(-1);

  /**
   * Updates selected section and field states
   */
  const updateSelected = () => {
    setSelectedField(MetaformUtils.getMetaformField(pendingForm, sectionIndex, fieldIndex));
    setSelectedSection(MetaformUtils.getMetaformSection(pendingForm, sectionIndex));
    setDebounceTimerId(undefined);
  };

  /**
   * Empties member group settings
   */
  const emptyMemberGroupSettings = () => {
    setSelectMemberGroupEnabled(false);
    setMemberGroupOptIndex(-1);
    setSelectedMemberGroupId(undefined);
    setSelectedMemberGroupPermission(NOT_SELECTED);
  };

  /**
   * Set member groups for selected field to the found first group
   */
  const checkIfMemberGroupsAreSelected = () => {
    if (sectionIndex === undefined || fieldIndex === undefined) {
      return;
    }

    const updatedSelectedField = pendingForm.sections?.[sectionIndex].fields?.[fieldIndex];

    if (!updatedSelectedField || !MetaformUtils.fieldTypesAllowVisibility.includes(updatedSelectedField.type)) {
      return;
    }

    const foundOptionIndex = updatedSelectedField.options?.findIndex(option => MetaformUtils.getOptionPermissionGroup(option) !== undefined);

    if (foundOptionIndex !== -1 && foundOptionIndex !== undefined) {
      const [ groupId, permission ] = MetaformUtils.getOptionPermissionGroup(updatedSelectedField.options![foundOptionIndex])!;

      setSelectMemberGroupEnabled(true);
      setSelectedMemberGroupId(groupId);
      setSelectedMemberGroupPermission(permission !== MemberGroupPermission.NOTIFY ? permission : NOT_SELECTED);
      setMemberGroupOptIndex(foundOptionIndex);
    }
  };

  useEffect(() => {
    if (metaformSectionIndex !== undefined) {
      setMetaformSection(pendingForm.sections?.[metaformSectionIndex]);
    }
    if (metaformFieldIndex !== undefined && metaformSectionIndex !== undefined) {
      setMetaformField(pendingForm.sections?.[metaformSectionIndex].fields?.[metaformFieldIndex]);
    }
    if (metaformFieldIndex === undefined) {
      setMetaformField(undefined);
    }
    if (metaformSectionIndex === undefined) {
      setMetaformSection(undefined);
    }
  }, [pendingForm, metaformSectionIndex, metaformFieldIndex]);
  
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
        const checkedName = pendingForm.sections![metaformSectionIndex!].fields![metaformFieldIndex!];
        if ((checkedName!.name !== undefined && field.name !== checkedName!.name) || optionIndex !== undefined) {
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
   */
  const updateFormFieldDebounced = (field: MetaformField, optionIndex?: number) => {
    debounceTimerId && clearTimeout(debounceTimerId);
    setDebounceTimerId(setTimeout(() => updateFormField(field, optionIndex), 500));
  };

  /**
   * Updates metaform section
   *
   * @param metaformSection metaform section what we are editing
   */
  const updateFormSection = (selectedMetaformSection: MetaformSection) => {
    if (metaformSectionIndex === undefined) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.splice(metaformSectionIndex, 1, selectedMetaformSection);
    });
    setMetaformSection(selectedMetaformSection);
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
      permissionGroups: undefined
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
    setMemberGroupOptIndex(-1);
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
    if (!selectedField || selectedMemberGroupId === undefined || memberGroupOptIndex === -1) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      draftField.options![memberGroupOptIndex]!.permissionGroups = {
        editGroupIds: draftField.options![memberGroupOptIndex]!.permissionGroups?.editGroupIds || [],
        viewGroupIds: draftField.options![memberGroupOptIndex]!.permissionGroups?.viewGroupIds || [],
        notifyGroupIds: checked ? [ selectedMemberGroupId ] : []
      };
    });

    updateFormFieldDebounced(updatedField);
  };

  /**
   * Set member group permission view or edit
   *
   * @param selectedGroupPermission selected member group permission
   */
  const setMemberGroupPermission = (selectedGroupPermission: NullableMemberGroupPermission) => {
    setSelectedMemberGroupPermission(selectedGroupPermission);

    if (!selectedField ||
        memberGroupOptIndex === undefined ||
        selectedMemberGroupId === undefined ||
        selectedField.options?.[memberGroupOptIndex] === undefined
    ) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      if (selectedGroupPermission === MemberGroupPermission.EDIT) {
        draftField.options![memberGroupOptIndex]!.permissionGroups = {
          viewGroupIds: [],
          editGroupIds: [ selectedMemberGroupId ],
          notifyGroupIds: draftField.options![memberGroupOptIndex]!.permissionGroups?.notifyGroupIds || []
        };
      }
      if (selectedGroupPermission === MemberGroupPermission.VIEW) {
        draftField.options![memberGroupOptIndex]!.permissionGroups = {
          editGroupIds: [],
          viewGroupIds: [ selectedMemberGroupId ],
          notifyGroupIds: draftField.options![memberGroupOptIndex]!.permissionGroups?.notifyGroupIds || []
        };
      }
      if (selectedGroupPermission === NOT_SELECTED) {
        draftField.options![memberGroupOptIndex]!.permissionGroups = undefined;
      }
    });

    updateFormField(updatedField);
  };

  /**
   * Empty permission groups for all options
   */
  const removeAllPermissionGroups = () => {
    if (!selectedField) {
      return;
    }

    const updatedField = produce(selectedField, draftField => {
      draftField.options?.forEach(option => { option.permissionGroups = undefined; });
    });
    setMemberGroupOptIndex(-1);
    setSelectedMemberGroupId(undefined);
    setSelectedMemberGroupPermission(NOT_SELECTED);
    updateFormField(updatedField);
  };

  /**
   * Handle member group change and empty member group permission selection. Also if option had permission member groups remove them.
   *
   * @param memberGroupId selected member group Id
   */
  const handleMemberGroupChange = (memberGroupId: string) => {
    if (!selectedField || memberGroupOptIndex === undefined) {
      return;
    }

    setSelectedMemberGroupId(memberGroupId);
    setSelectedMemberGroupPermission(NOT_SELECTED);

    const updatedField = produce(selectedField, draftField => {
      draftField.options![memberGroupOptIndex].permissionGroups = undefined;
    });

    updateFormField(updatedField);
  };

  /**
   * Toggles member group enabled
   *
   * @param enabled enabled
   */
  const toggleMemberGroupEnabled = (enabled: boolean) => {
    setSelectMemberGroupEnabled(enabled);

    if (!enabled) {
      removeAllPermissionGroups();
    }
  };

  /**
   * Set member group for selected option
   *
   * @param optionIndex option index
   */
  const onSelectedOptionChange = (optionIndex?: number) => {
    if (optionIndex === undefined || selectedField?.options?.[optionIndex] === undefined) {
      return;
    }

    setMemberGroupOptIndex(optionIndex);

    const groupWithPermission = MetaformUtils.getOptionPermissionGroup(selectedField.options[optionIndex]);

    if (groupWithPermission !== undefined) {
      const [ groupId, permission ] = groupWithPermission;
      setSelectedMemberGroupId(groupId);
      setSelectedMemberGroupPermission(permission);
    } else {
      setSelectedMemberGroupId(undefined);
      setSelectedMemberGroupPermission(NOT_SELECTED);
    }
  };

  /**
   * Render member group role options
   *
   */
  const renderMemberGroupPermissionSelect = (field: MetaformField) => {
    if (memberGroupOptIndex === undefined || selectedMemberGroupId === undefined || selectedMemberGroupId === NOT_SELECTED) {
      return null;
    }
    const notifyChecked = !!field.options?.[memberGroupOptIndex]?.permissionGroups?.notifyGroupIds?.length;
    return (
      <FormControl fullWidth>
        <TextField
          select
          label={ strings.draftEditorScreen.editor.memberGroups.memberGroupPermission }
          value={ selectedMemberGroupPermission }
          onChange={ ({ target }) => setMemberGroupPermission(target.value as NullableMemberGroupPermission) }
        >
          <MenuItem value={ NOT_SELECTED }>{ strings.draftEditorScreen.editor.memberGroups.noPermission }</MenuItem>
          <MenuItem value={ MemberGroupPermission.EDIT }>{ strings.draftEditorScreen.editor.memberGroups.edit }</MenuItem>
          <MenuItem value={ MemberGroupPermission.VIEW }>{ strings.draftEditorScreen.editor.memberGroups.view }</MenuItem>
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
  };

  /**
   * Render member groups of current metaform
   */
  const renderMemberGroupSelect = () => {
    if (memberGroupOptIndex === undefined || !selectMemberGroupEnabled) {
      return null;
    }
    return (
      <FormControl fullWidth>
        <TextField
          fullWidth
          select
          label={ strings.draftEditorScreen.editor.memberGroups.memberGroup }
          value={ selectedMemberGroupId || "" }
          onChange={ event => handleMemberGroupChange(event.target.value) }
        >
          <MenuItem value={ NOT_SELECTED } key={uuid4()}>
            { strings.draftEditorScreen.editor.memberGroups.noMemberGroupSelected }
          </MenuItem>
          { memberGroups.map(memberGroup => (
            <MenuItem value={ memberGroup.id } key={ memberGroup.id }>
              { memberGroup.displayName }
            </MenuItem>
          ))
          }
        </TextField>
      </FormControl>
    );
  };

  /**
   * Render options of current field if its Select, Radio or Checkbox
   *
   * @param field selected metaform field
   */
  const renderMemberGroupOptionSelect = (field: MetaformField) => {
    if (!selectMemberGroupEnabled) {
      return null;
    }

    return (
      <FormControl fullWidth>
        <TextField
          select
          fullWidth
          label={ strings.draftEditorScreen.editor.memberGroups.fieldValueLabel }
          value={ memberGroupOptIndex || 0 }
          onChange={ event => onSelectedOptionChange(Number(event.target.value))}
        >
          { field.options!.map((option, index) => {
            const constructedKey = `${option.name}-${index}`;
            return (
              <MenuItem value={ index } key={ constructedKey }>
                { option.text }
              </MenuItem>
            );
          })
          }
        </TextField>
      </FormControl>
    );
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
   */
  const renderDefineMemberGroupSwitch = () => (
    <>
      <Typography variant="subtitle1">
        { strings.draftEditorScreen.editor.memberGroups.memberGroupDefineSettings }
      </Typography>
      <FormControl>
        <FormControlLabel
          label={ strings.draftEditorScreen.editor.features.field.defineUserGroup }
          control={
            <Switch
              disabled={ selectedField?.options!.length === 0 }
              checked={ selectMemberGroupEnabled }
              onChange={ event => toggleMemberGroupEnabled(event.target.checked) }
            />
          }
        />
        <Typography variant="body2" sx={{ display: "none" }}>
          { strings.draftEditorScreen.editor.features.field.selectableFieldsInfo }
        </Typography>
      </FormControl>
    </>
  );

  /**
   * Renders Define member group
   *
   * @param field field
   */
  const renderDefineMemberGroup = (field: MetaformField) => (
    <Stack spacing={ 2 }>
      { renderDefineMemberGroupSwitch() }
      { renderMemberGroupOptionSelect(field) }
      { renderMemberGroupSelect() }
      { renderMemberGroupPermissionSelect(field) }
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
      case MetaformFieldType.Number:
        return (
          <>
            <MetaformSliderComponent
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
            <Divider/>
          </>
        );
      case MetaformFieldType.Checklist:
      case MetaformFieldType.Radio:
      case MetaformFieldType.Select:
        return (
          <>
            <MetaformMultiChoiceFieldPropertiesComponent
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
            <Divider/>
            <MetaformDefineMemberGroupComponent
              memberGroups={ memberGroups }
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
            <Divider/>
          </>
        );
      case MetaformFieldType.Table:
        return (
          <>
            <MetaformTableComponent
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
            <Divider/>
          </>
        );
      case MetaformFieldType.Date:
      case MetaformFieldType.DateTime:
        return (
          <>
            <MetaformDateTimeComponent
              updateFormFieldDebounced={ updateFormFieldDebounced }
            />
            <Divider/>
          </>
        );
      default:
        break;
    }
  };

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
   */
  const renderFieldEditor = (field: MetaformField) => (
    <>
      <MetaformFieldAndSubmitEditTitleComponent
        updateFormFieldDebounced={ updateFormFieldDebounced }
      />
      <Divider/>
      { renderFieldProperties(field) }
      <MetaformContextOptionsComponent
        updateFormFieldDebounced={ updateFormFieldDebounced }
      />
      <Divider/>
      <MetaformFieldRequiredComponent
        updateFormFieldDebounced={ updateFormFieldDebounced }
      />
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
    if (metaformField && metaformSection) {
      return renderFieldEditor(metaformField);
    }

    if (metaformSection) {
      return renderSectionEditor(metaformSection);
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