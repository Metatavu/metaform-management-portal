import { TextField } from "@mui/material";
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
  onValueChange?: (value: FieldValue) => void,
  onFocus?: () => void,
  notInteractive?: boolean
}

/**
 * Component for Metaform memo field
 */
const MetaformMemoComponent: React.FC<Props> = ({
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
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange && onValueChange(event.target.value);
  };

  if (!field.name) {
    return null;
  }

  const style: React.CSSProperties = {
    backgroundColor: "white",
    border: "1px solid rgba(0, 0, 0, .5)",
    borderRadius: "0.5rem",
    width: "100%",
    padding: "0.5rem 1rem",
    minHeight: "5rem"
  };
  if (notInteractive) {
    style.pointerEvents = "none";
  }

  return (
    <TextField
      variant="outlined"
      multiline
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
      style={ style }
    />
  );
};

export default MetaformMemoComponent;