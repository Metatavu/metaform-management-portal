import { Input } from "@mui/material";
import React from "react";
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
 * Component for Metaform text field
 */
const MetaformHiddenFieldComponent: React.FC<Props> = ({
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
    onValueChange(event.target.value);
  };

  if (!field.name) {
    return null;
  }

  return (
    <Input
      type="hidden"
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
    />
  );
};

export default MetaformHiddenFieldComponent;