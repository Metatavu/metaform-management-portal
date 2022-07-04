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
  fieldId: string,
  fieldLabelId: string,
  formReadOnly: boolean,
  value: FieldValue,
  getFieldValue: (fieldName: string) => FieldValue,
  onValueChange: (value: FieldValue) => void,
  datePicker: (fieldName: string, onChange: (date: Date) => void) => JSX.Element,
  onFocus: () => void
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for Metaform text field
 */
export class MetaformDateFieldComponent extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      
    };
  }

  /**
   * Component render method
   */
  public render() {
    if (!this.props.field.name) {
      return null;
    }

    return this.props.datePicker(this.props.field.name || "", this.onChange);
  }
  
  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  private onChange = (date: Date) => {
    this.props.onValueChange(date ? moment(date).format("YYYY-MM-DD") : null);
  }

}