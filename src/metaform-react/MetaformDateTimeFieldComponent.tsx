/* eslint-disable */ // Remove when refactoring is done
import React from 'react';
import { MetaformField } from '../generated/client/models';
import { FieldValue } from './types';

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  onValueChange: (value: FieldValue) => void,
  datetimePicker: (fieldName: string, onChange: (date: Date) => void) => JSX.Element
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for Metaform text field
 */
export const MetaformDateTimeFieldComponent: React.FC<Props> = ({
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
    onValueChange(date ? date.toISOString() : null);
  }
  
  return datetimePicker(field.name || "", onChange);
}