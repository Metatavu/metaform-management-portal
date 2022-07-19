/* eslint-disable */ // Remove when refactoring is done
import React from 'react';
import { MetaformField } from '../generated/client/models';
import { FieldValue } from './types';
import moment from "moment";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  onValueChange: (value: FieldValue) => void,
  datePicker: (fieldName: string, onChange: (date: Date) => void) => JSX.Element
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for Metaform text field
 */
export const MetaformDateFieldComponent: React.FC<Props> = ({
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
    onValueChange(date ? moment(date).format("YYYY-MM-DD") : null);
  }

  return datePicker(field.name || "", onChange);
}