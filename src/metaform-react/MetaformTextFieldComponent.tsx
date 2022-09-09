import React from "react";
import { TextFieldWrapper } from "styled/react-components/react-components";
import { MetaformField } from "../generated/client/models";
import { FieldValue } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  formReadOnly: boolean;
  value: FieldValue;
  onValueChange?: (value: FieldValue) => void;
  onFocus?: () => void;
}

/**
 * Component for Metaform text field
 */
const MetaformTextFieldComponent: React.FC<Props> = ({
  field,
  fieldId,
  formReadOnly,
  value,
  onValueChange,
  onFocus
}) => {
  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange && onValueChange(event.target.value);
  };

  if (!field.name) {
    return null;
  }

  return (
    <TextFieldWrapper
      type="text"
      placeholder={ field.placeholder }
      id={ fieldId }
      name={ field.name }
      title={ field.title }
      required={ field.required }
      readOnly={ formReadOnly || field.readonly }
      value={ value as string || "" }
      onChange={ onChange }
      onFocus={ onFocus }
      disableUnderline
      inputProps={{
        "aria-label": field.title
      }}
    />
  );
};

export default MetaformTextFieldComponent;