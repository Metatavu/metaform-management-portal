import React from "react";
import { UrlFieldWrapper } from "styled/react-components/react-components";
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
 * Component for Metaform url field
 */
export const MetaformUrlFieldComponent: React.FC<Props> = ({
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
    onValueChange && onValueChange(event.target.value);
  };

  if (!field.name) {
    return null;
  }

  return (
    <UrlFieldWrapper
      style={ notInteractive ? { pointerEvents: "none" } : {}}
      color="secondary"
      disableUnderline
      type="url"
      placeholder={ field.placeholder }
      id={ fieldId }
      aria-labelledby={ fieldLabelId }
      name={ field.name }
      title={ field.title }
      required={ field.required }
      readOnly={ formReadOnly || field.readonly }
      value={ value as string || "" }
      onChange={ onChange }
      onFocus={ onFocus }
    />
  );
};

export default MetaformUrlFieldComponent;