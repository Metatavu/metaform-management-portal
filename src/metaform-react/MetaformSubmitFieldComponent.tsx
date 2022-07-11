/* eslint-disable */ // Remove when refactoring is done
import React, { CSSProperties } from 'react';
import { MetaformField } from '../generated/client/models';
import { FieldValue, ValidationErrors } from './types';

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  formReadOnly: boolean;
  value: FieldValue;
  validationErrors: ValidationErrors;
  onClick: (source: MetaformField) => void;
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for Metaform submit field
 */
export class MetaformSubmitFieldComponent extends React.Component<Props, State> {

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
    const { field, validationErrors } = this.props;

    if (!field.name) {
      return null;
    }

    const hasValidationErrors = Object.keys(validationErrors).length > 0;
    const disabled = hasValidationErrors || this.props.formReadOnly || this.props.field.readonly;
    const style: CSSProperties = {};

    if (disabled) {
      style["background"] = "#aaa";
    }

    return (
      <input
        type="submit"
        style={ style }
        disabled={ disabled }
        value={ this.props.field.text }
        onClick={ this.onClick }
      />
    );
  }
  
  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  private onClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    this.props.onClick(this.props.field);
  }

}