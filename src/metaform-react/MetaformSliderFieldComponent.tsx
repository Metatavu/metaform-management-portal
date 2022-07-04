/* eslint-disable */ // Remove when refactoring is done
import React from 'react';
import { MetaformField } from '../generated/client/models';
import { FieldValue } from './types';

/**
 * Component props
 */
interface Props {
  renderSlider?: (fieldName: string, readOnly: boolean) => JSX.Element | null;
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  formReadOnly: boolean;
  value: FieldValue;
  getFieldValue: (fieldName: string) => FieldValue;
  onValueChange: (value: FieldValue) => void;
  onFocus: () => void;
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for Metaform slider field
 */
export class MetaformSliderFieldComponent extends React.Component<Props, State> {

  /**
   * Component render method
   */
  public render() {
    const { field, renderSlider, formReadOnly } = this.props;

    if (!field.name || !renderSlider) {
      return null;
    }

    const readOnly = !!(formReadOnly || field.readonly);    
    return renderSlider(field.name, readOnly);
  }

}
