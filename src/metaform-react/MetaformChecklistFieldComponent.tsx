import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React, { CSSProperties, ReactNode } from "react";
import { ChecklistFieldWrapper } from "styled/react-components/react-components";
import { MetaformField, MetaformFieldOption } from "../generated/client/models";
import { FieldValue, IconName } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  formReadOnly: boolean,
  value: FieldValue,
  renderIcon: (icon: IconName, key: string) => ReactNode;
  onValueChange?: (value: FieldValue) => void,
  notInteractive?: boolean
}

/**
 * Component for Metaform checklist field
 */
export const MetaformChecklistFieldComponent: React.FC<Props> = ({
  field,
  formReadOnly,
  value,
  renderIcon,
  onValueChange,
  notInteractive
}) => {
  if (!field.name) {
    return null;
  }

  /**
   * Returns array of selected options
   */
  const getSelectedOptions = () => {
    if (!value) {
      return [];
    }
    
    return (value as string).split(",");
  };

  /**
   * Event handler for checkbox change
   * 
   * @param option option
   * @param checked whether checkbox was checked
   */
  const onCheckboxChange = (option: MetaformFieldOption, checked: boolean) => {
    const selectedOptions = getSelectedOptions();
    const newValue = (checked ? [ ...selectedOptions, option.name ] : selectedOptions.filter(selectedOption => selectedOption !== option.name)).join(",");
    onValueChange && onValueChange(newValue);
  };

  /**
   * Renders an option
   * 
   * @param option option
   * @param selectedOptions array of selected options 
   */
  const renderOption = (option: MetaformFieldOption, selectedOptions: string[]) => {
    const checked = selectedOptions.includes(option.name);

    if (formReadOnly || field.readonly) {
      return (
        <div key={ option.name }>
          { renderIcon(checked ? "check-square-o" : "square-o", option.name) }
          <span style={{ verticalAlign: "super" }}>{ option.text }</span>
        </div>
      );
    }

    const style: CSSProperties = {};

    if (notInteractive) {
      style.pointerEvents = "none";
      style.color = "black";
    }

    return (
      <Box key={ option.name }>
        <FormGroup>
          <FormControlLabel
            value={ option.name }
            control={
              <Checkbox
                style={ style }
                name={ field.name }
                value={ option.name }
                checked={ checked }
                onChange={ (event: any) => onCheckboxChange(option, event.target.checked) }
              />
            }
            label={ option.text }
          />
        </FormGroup>
      </Box>
    );
  };

  /**
   * Checklist render method
   */
  const renderChecklist = () => {
    const options = field.options || [];
    const selectedOptions = getSelectedOptions();

    return (
      options.map(option => renderOption(option, selectedOptions))
    );
  };

  return (
    <ChecklistFieldWrapper key={ field.name }>
      { renderChecklist() }
    </ChecklistFieldWrapper>
  );
};

export default MetaformChecklistFieldComponent;