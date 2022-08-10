import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { SelectFieldWrapper } from "styled/react-components/react-components";
import { MetaformField } from "../generated/client/models";
import { FieldValue } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  formReadOnly: boolean,
  value: FieldValue,
  onValueChange?: (value: FieldValue) => void,
  notInteractive?: boolean
}

/**
 * Component for Metaform select field
 */
export const MetaformSelectFieldComponent: React.FC<Props> = ({
  field,
  formReadOnly,
  value,
  onValueChange,
  notInteractive
}) => {
  if (!field.name) {
    return null;
  }

  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  const onChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value as string;

    if (event.target.value) {
      onValueChange && onValueChange(selectedValue);
    }
  };

  const options = field.options || [];
  const selected = value as string || (options.length > 0 ? options[0].name : "");
  const readOnly = formReadOnly || field.readonly;

  return (
    <SelectFieldWrapper>
      <Select
        style={ notInteractive ? { pointerEvents: "none" } : {} }
        onChange={ onChange }
        value={ selected }
        disabled={ readOnly }
      >
        { options.map(option => <MenuItem key={ option.name } value={ option.name }>{ option.text }</MenuItem>) }
      </Select>
    </SelectFieldWrapper>
  );
};

export default MetaformSelectFieldComponent;