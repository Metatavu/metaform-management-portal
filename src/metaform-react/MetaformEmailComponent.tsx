import React from "react";
import { EmailFieldWrapper } from "styled/react-components/react-components";
import { MetaformField } from "../generated/client/models";
import { FieldValue } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  formReadOnly: boolean;
  value: FieldValue;
  onValueChange?: (value: FieldValue) => void;
  onFocus?: () => void;
  notInteractive?: boolean;
}

/**
 * Component for Metaform email field
 */
const MetaformEmailFieldComponent: React.FC<Props> = ({
  field,
  fieldId,
  fieldLabelId,
  formReadOnly,
  value,
  onValueChange,
  onFocus,
  notInteractive
}) => {
  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changedValue = event.target.value;
    onValueChange && onValueChange(changedValue);
  };

  if (!field.name) {
    return null;
  }
  
  return (
    <EmailFieldWrapper
      style={ notInteractive ? { pointerEvents: "none" } : {}}
      type="email"
      placeholder={ field.placeholder }
      id={ fieldId }
      aria-labelledby={ fieldLabelId }
      name={ field.name }
      title={ field.title }
      required={ field.required }
      disabled={ formReadOnly || field.readonly }
      value={ value as string || "" }
      onChange={ onChange }
      onFocus={ onFocus }
      InputProps={{
        sx: {
          ".MuiOutlinedInput-notchedOutline": {
            border: "none"
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none"
          }
        }
      }}
    />
  );
};

export default MetaformEmailFieldComponent;