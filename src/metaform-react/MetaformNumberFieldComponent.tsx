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
  onValueChange: (value: FieldValue) => void,
  onFocus: () => void
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
  onFocus
}) => {
  if (!field.name) {
    return null;
  }

  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  return (
    <NumberFieldWrapper
      type="number"
      placeholder={ field.placeholder }
      id={ fieldId }
      aria-labelledby={ fieldLabelId }
      name={ field.name }
      title={ field.title }
      required={ field.required }
      InputProps={{
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