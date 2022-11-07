import { Checkbox, FormControl, FormControlLabel, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformMemberGroup } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useEffect, useState } from "react";
import { NullableMemberGroupPermission, MemberGroupPermission } from "types";
import MetaformUtils from "utils/metaform-utils";
import { NOT_SELECTED } from "consts";

/**
 * Component properties
 */
interface Props {
  selectedField?: MetaformField;
  setSelectedField: (selectedField: MetaformField) => void;
  memberGroupOptIndex?: number;
  setMemberGroupOptIndex: (memberGroupOptIndex?: number) => void;
  memberGroups: MetaformMemberGroup[],
  debounceTimerId?: NodeJS.Timeout,
  setDebounceTimerId: (debounceTimerId: NodeJS.Timeout) => void;
  setUpdatedMetaformField: (updatedMetaformField: MetaformField) => void;
  sectionIndex?: number;
  fieldIndex?: number;
  pendingForm: Metaform;
}

/**
 * Draft editor right drawer feature define member group component
 */
const RenderDefineMemberGroupComponent: FC<Props> = ({
  selectedField,
  setSelectedField,
  memberGroupOptIndex,
  setMemberGroupOptIndex,
  memberGroups,
  debounceTimerId,
  setDebounceTimerId,
  setUpdatedMetaformField,
  sectionIndex,
  fieldIndex,
  pendingForm
}) => {
  const [ selectMemberGroupEnabled, setSelectMemberGroupEnabled ] = useState<boolean>(false);
  const [ selectedMemberGroupId, setSelectedMemberGroupId ] = useState<string>();
  const [ selectedMemberGroupPermission, setSelectedMemberGroupPermission ] = useState<NullableMemberGroupPermission>(NOT_SELECTED);

  /**
   * Empties member group settings
   */
  const emptyMemberGroupSettings = () => {
    setSelectMemberGroupEnabled(false);
    setMemberGroupOptIndex(undefined);
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
    setMemberGroupOptIndex(undefined);
    setSelectedMemberGroupId(undefined);
    setSelectedMemberGroupPermission(NOT_SELECTED);
    setUpdatedMetaformField(updatedField);
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

    setUpdatedMetaformField(updatedField);
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

    setUpdatedMetaformField(updatedField);
  };

  /**
   * Debounced update field
   *
   * @param field edited field
   */
  const updateFormFieldDebounced = (field: MetaformField) => {
    setSelectedField(field);

    debounceTimerId && clearTimeout(debounceTimerId);
    setDebounceTimerId(setTimeout(() => setUpdatedMetaformField(field), 500));
  };

  /**
   * Set permission group notify group settings
   *
   * @param checked checked value of the checkbox value true or false
   */
  const setMemberGroupNotify = (checked: boolean) => {
    if (!selectedField || selectedMemberGroupId === undefined || memberGroupOptIndex === undefined) {
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
   * Render member group role options
   * 
   * @param field metaform field
   */
  const renderMemberGroupPermissionSelect = (field?: MetaformField) => {
    if (memberGroupOptIndex === undefined || selectedMemberGroupId === undefined || selectedMemberGroupId === NOT_SELECTED || !field) {
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
          <MenuItem value={ NOT_SELECTED } key={ NOT_SELECTED }>
            { strings.draftEditorScreen.editor.memberGroups.noMemberGroup }
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
  const renderMemberGroupOptionSelect = (field?: MetaformField) => {
    if (!selectMemberGroupEnabled || !field) {
      return null;
    }
    const currentIndex = memberGroupOptIndex ?? "";
    return (
      <FormControl fullWidth>
        <TextField
          select
          fullWidth
          label={ strings.draftEditorScreen.editor.memberGroups.fieldValueLabel }
          value={ currentIndex }
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

  useEffect(() => {
    emptyMemberGroupSettings();
    checkIfMemberGroupsAreSelected();
  }, [ sectionIndex, fieldIndex, selectedField?.options?.length ]);
  
  /**
   * Renders Define member group
   *
   * @param field field
   */
  const renderDefineMemberGroup = (field?: MetaformField) => (
    <Stack spacing={ 2 }>
      { renderDefineMemberGroupSwitch() }
      { renderMemberGroupOptionSelect(field) }
      { renderMemberGroupSelect() }
      { renderMemberGroupPermissionSelect(field) }
    </Stack>
  );

  /**
   * Component render
   */
  return (
    renderDefineMemberGroup(selectedField)
  );
};

export default RenderDefineMemberGroupComponent;