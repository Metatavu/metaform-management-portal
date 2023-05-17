import { Checkbox, FormControl, FormControlLabel, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import { MetaformField, MetaformMemberGroup } from "generated/client";
import produce from "immer";
import strings from "localization/strings";
import React, { FC, useEffect, useState } from "react";
import { NullableMemberGroupPermission, MemberGroupPermission, FeatureType, FeatureStrategy } from "types";
import MetaformUtils from "utils/metaform-utils";
import { NOT_SELECTED } from "consts";
import { selectMetaform } from "../../../features/metaform-slice";
import { useAppSelector } from "app/hooks";
import Feature from "components/containers/feature";

/**
 * Component properties
 */
interface Props {
  memberGroups: MetaformMemberGroup[],
  updateFormFieldDebounced: (updatedField: MetaformField) => void;
}

/**
 * Draft editor right drawer feature define member group component
 */
const RenderDefineMemberGroupComponent: FC<Props> = ({
  memberGroups,
  updateFormFieldDebounced
}) => {
  const [ selectMemberGroupEnabled, setSelectMemberGroupEnabled ] = useState<boolean>(false);
  const [ selectedMemberGroupId, setSelectedMemberGroupId ] = useState<string>();
  const [ selectedMemberGroupPermission, setSelectedMemberGroupPermission ] = useState<NullableMemberGroupPermission>(NOT_SELECTED);
  const [ memberGroupOptIndex, setMemberGroupOptIndex ] = useState<number>();
  const { metaformVersion, metaformFieldIndex, metaformSectionIndex } = useAppSelector(selectMetaform);
  const pendingForm = MetaformUtils.jsonToMetaform(MetaformUtils.getDraftForm(metaformVersion));
  const [ metaformField, setMetaformField ] = React.useState<MetaformField>();

  useEffect(() => {
    if (metaformSectionIndex !== undefined && metaformFieldIndex !== undefined) {
      setMetaformField(pendingForm.sections?.[metaformSectionIndex].fields?.[metaformFieldIndex]);
    }
  }, [metaformFieldIndex, metaformSectionIndex, metaformVersion]);

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
    if (metaformSectionIndex === undefined || metaformFieldIndex === undefined) {
      return;
    }

    const updatedSelectedField = pendingForm.sections?.[metaformSectionIndex].fields?.[metaformFieldIndex];
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
    if (!metaformField) {
      return;
    }

    const updatedField = produce(metaformField, draftField => {
      draftField.options?.forEach(option => { option.permissionGroups = undefined; });
    });
    setMemberGroupOptIndex(undefined);
    setSelectedMemberGroupId(undefined);
    setSelectedMemberGroupPermission(NOT_SELECTED);
    updateFormFieldDebounced(updatedField);
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
    if (optionIndex === undefined || metaformField?.options?.[optionIndex] === undefined) {
      return;
    }

    setMemberGroupOptIndex(optionIndex);

    const groupWithPermission = MetaformUtils.getOptionPermissionGroup(metaformField.options[optionIndex]);

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
    if (!metaformField || memberGroupOptIndex === undefined) {
      return;
    }

    setSelectedMemberGroupId(memberGroupId);
    setSelectedMemberGroupPermission(NOT_SELECTED);

    const updatedField = produce(metaformField, draftField => {
      draftField.options![memberGroupOptIndex].permissionGroups = undefined;
    });

    setMetaformField(updatedField);
    updateFormFieldDebounced(updatedField);
  };

  /**
   * Set member group permission view or edit
   *
   * @param selectedGroupPermission selected member group permission
   */
  const setMemberGroupPermission = (selectedGroupPermission: NullableMemberGroupPermission) => {
    setSelectedMemberGroupPermission(selectedGroupPermission);

    if (!metaformField ||
        memberGroupOptIndex === undefined ||
        selectedMemberGroupId === undefined ||
        metaformField.options?.[memberGroupOptIndex] === undefined
    ) {
      return;
    }

    const updatedField = produce(metaformField, draftField => {
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
    setMetaformField(updatedField);
    updateFormFieldDebounced(updatedField);
  };

  /**
   * Set permission group notify group settings
   *
   * @param checked checked value of the checkbox value true or false
   */
  const setMemberGroupNotify = (checked: boolean) => {
    if (!metaformField || selectedMemberGroupId === undefined || memberGroupOptIndex === undefined) {
      return;
    }

    const updatedField = produce(metaformField, draftField => {
      draftField.options![memberGroupOptIndex]!.permissionGroups = {
        editGroupIds: draftField.options![memberGroupOptIndex]!.permissionGroups?.editGroupIds || [],
        viewGroupIds: draftField.options![memberGroupOptIndex]!.permissionGroups?.viewGroupIds || [],
        notifyGroupIds: checked ? [ selectedMemberGroupId ] : []
      };
    });
    setMetaformField(updatedField);
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
  const renderDefineMemberGroupSwitch = (field?: MetaformField) => (
    <>
      <Typography variant="subtitle1">
        { strings.draftEditorScreen.editor.memberGroups.memberGroupDefineSettings }
      </Typography>
      <FormControl>
        <FormControlLabel
          label={ strings.draftEditorScreen.editor.features.field.defineUserGroup }
          control={
            <Switch
              disabled={ field?.options!.length === 0 }
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
  }, [ metaformSectionIndex, metaformFieldIndex, metaformField?.options?.length ]);
  
  /**
   * Renders Define member group
   *
   * @param field field
   */
  const renderDefineMemberGroup = (field?: MetaformField) => {
    if (field && MetaformUtils.fieldTypesAllowVisibility.includes(field.type)) {
      return (
        <Feature
          feature={ FeatureType.ADVANCED_PERMISSION_TARGETING }
          strategy={ FeatureStrategy.DISABLE }
          title={ strings.features.advancedPermissionTargeting.title}
          description={ strings.features.advancedPermissionTargeting.description }
        >
          <Stack spacing={ 2 }>
            { renderDefineMemberGroupSwitch(field) }
            { renderMemberGroupOptionSelect(field) }
            { renderMemberGroupSelect() }
            { renderMemberGroupPermissionSelect(field) }
          </Stack>
        </Feature>
      );
    }
  };

  /**
   * Component render
   */
  return (
    <>
      { renderDefineMemberGroup(metaformField) }
    </>
  );
};

export default RenderDefineMemberGroupComponent;