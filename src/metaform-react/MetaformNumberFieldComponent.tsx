import React from "react";
import { NumberFieldWrapper } from "styled/react-components/react-components";
import { MetaformField } from "../generated/client/models";
import { FieldValue } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
  fieldLabelId: string,
  formReadOnly: boolean,
  value: FieldValue,
  onValueChange?: (value: FieldValue) => void,
  onFocus?: () => void,
  notInteractive?: boolean
}

/**
 * Component for Metaform number field
 */
export const MetaformNumberFieldComponent: React.FC<Props> = ({
  field,
  fieldId,
  fieldLabelId,
  formReadOnly,
  value,
  onValueChange,
  onFocus,
  notInteractive
}) => {
  if (!field.name) {
    return null;
  }

  /**
   * Event handler for field input change and check also if field have min or max settings.
   * 
   * @param event event
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { min, max } = field;
    const numberValue = Number(event.target.value);

    if (numberValue > max!) {
      onValueChange && onValueChange(max!);
    }
    if (numberValue <= min!) {
      onValueChange && onValueChange(min!);
    }
    if (
      (numberValue >= min! && numberValue <= max!) ||
      (numberValue && !min && numberValue < max!) ||
      (numberValue && !max && numberValue > min!)
    ) {
      onValueChange && onValueChange(numberValue);
    }
    if ((!numberValue && !min) || (numberValue && !min && !max)) {
      onValueChange && onValueChange(numberValue);
    }
  };

  return (
    <NumberFieldWrapper
      style={ notInteractive ? { pointerEvents: "none" } : {}}
      type="number"
      placeholder={ field.placeholder }
      id={ fieldId }
      aria-labelledby={ fieldLabelId }
      name={ field.name }
      title={ field.title }
      required={ field.required }
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
        },
        readOnly: formReadOnly || field.readonly,
        inputProps: {
          min: field.min,
          max: field.max,
          step: field.step
        }
      }}
      value={ value as number || "" }
      onChange={ onChange }
      onFocus={ onFocus }
    />
  );
};

export default MetaformNumberFieldComponent;