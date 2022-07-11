/* eslint-disable */ // Remove when refactoring is done
import React from 'react';
import { MetaformField } from '../generated/client/models';
import { FieldValue } from './types';

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
  fieldLabelId: string,
  getFieldValue: (fieldName: string) => FieldValue,
}

/**
 * Component state
 */
interface State {

}

/**
 * Component for Metaform memo field
 */
export class MetaformHtmlComponent extends React.Component<Props, State> {

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

    const dangerousInnerHTML = this.props.field.html || "";

    return (
      <div id={ this.props.fieldId } aria-labelledby={ this.props.fieldLabelId } dangerouslySetInnerHTML={{ __html: dangerousInnerHTML }}></div>
    );
  }
}