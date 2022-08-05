import React from "react";
import { MetaformField } from "../generated/client/models";
import { FieldValue } from "./types";
import moment from "moment";
import { DateFieldWrapper } from "styled/react-components/react-components";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  onValueChange?: (value: FieldValue) => void,
  datePicker: (fieldName: string, onChange: (date: Date) => void) => JSX.Element
}

/**
 * Component for Metaform text field
 */
const MetaformDateFieldComponent: React.FC<Props> = ({
  field,
  onValueChange,
  datePicker
}) => {
  /**
   * Event handler for field input change
   * 
   * @param date date
   */
  const onChange = (date: Date) => {
    onValueChange && onValueChange(date ? moment(date).format("YYYY-MM-DD") : null);
  };

  return (
    <DateFieldWrapper>
      { datePicker(field.name || "", onChange) }
    </DateFieldWrapper>
  );
};

export default MetaformDateFieldComponent;