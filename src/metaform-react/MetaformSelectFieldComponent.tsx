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
  formReadOnly: boolean,
  value: FieldValue,
  onValueChange: (value: FieldValue) => void,
  onFocus: () => void
}

/**
 * Component state
 */
interface State {
}

/**
 * Component for Metaform select field
 */
export class MetaformSelectFieldComponent extends React.Component<Props, State> {

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
    const { field, value, formReadOnly } = this.props;

    if (!field.name) {
      return null;
    }

    const options = field.options || [];
    const selected = value as string || (options.length > 0 ? options[0].name : "");
    const readOnly = formReadOnly || field.readonly;

    return (
      <div>
        <select onChange={ this.onChange } value={ selected } autoFocus={ false } disabled={ readOnly }>
          { options.map((option) => <option key={ option.name } value={ option.name }>{ option.text }</option>) }
        </select>
      </div>
    );
  }

  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  private onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as string;

    if (event.target.value) {
      this.props.onValueChange(selectedValue);
    }
  }

}