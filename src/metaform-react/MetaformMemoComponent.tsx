import React from "react";
import { MemoFieldWrapper } from "styled/react-components/react-components";
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

  const style: React.CSSProperties = {};
  if (notInteractive) {
    style.pointerEvents = "none";
  }

  return (
    <MemoFieldWrapper
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
      InputProps={{
        "aria-label": field.title,
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

export default MetaformMemoComponent;