import React from "react";
import { DateFieldWrapper } from "styled/react-components/react-components";
import { MetaformField } from "../generated/client/models";
import { FieldValue } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  onValueChange?: (value: FieldValue) => void,
  datetimePicker: (fieldName: string, onChange: (date: Date) => void) => JSX.Element
}

/**
 * Component for Metaform text field
 */
const MetaformDateTimeFieldComponent: React.FC<Props> = ({
  field,
  onValueChange,
  datetimePicker
}) => {
  /**
   * Event handler for field input change
   * 
   * @param date date
   */
  const onChange = (date: Date) => {
    onValueChange && onValueChange(date ? date.toISOString() : null);
  };

  if (!field.name) {
    return null;
  }
  
  return (
    <DateFieldWrapper>
      { datetimePicker(field.name || "", onChange) }
    </DateFieldWrapper>
  );
};

export default MetaformDateTimeFieldComponent;