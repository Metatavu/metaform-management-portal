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
  fieldLabelId: string;
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
  fieldLabelId,
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
    <>
      <h4>{field.name}</h4>
      <TextFieldWrapper
        type="text"
        placeholder={ field.placeholder }
        id={ fieldId }
        aria-labelledby={ fieldLabelId }
        name={ field.name }
        title={ field.title }
        required={ field.required }
        readOnly={ formReadOnly || field.readonly }
        value={ " " || value as string }
        onChange={ onChange }
        onFocus={ onFocus }
        disableUnderline
      />
    </>
  );
};

export default MetaformTextFieldComponent;