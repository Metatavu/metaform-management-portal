/* eslint-disable */ // Remove when refactoring is done
import React, { ReactNode } from 'react';
import { MetaformField, MetaformFieldOption } from '../generated/client/models';
import { FieldValue, IconName } from './types';

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
  fieldLabelId: string,
  formReadOnly: boolean,
  value: FieldValue,
  renderIcon: (icon: IconName, key: string) => ReactNode;
  onValueChange: (value: FieldValue) => void,
  onFocus: () => void
}

/**
 * Component state
 */
interface State {

}

/**
 * Component for Metaform checklist field
 */
export class MetaformChecklistFieldComponent extends React.Component<Props, State> {

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

    return (
      <div key={ this.props.field.name }>
        { this.renderChecklist() }
      </div>
    )
  }

  /**
   * Checklist render method
   */
  private renderChecklist = () => {
    const options = this.props.field.options || [];
    const selectedOptions = this.getSelectedOptions();

    return (
      options.map(option => this.renderOption(option, selectedOptions))
    )
  }

  /**
   * Renders an option
   * 
   * @param option option
   * @param selectedOptions array of selected options 
   */
  private renderOption = (option: MetaformFieldOption, selectedOptions: string[]) => {
    const checked = selectedOptions.includes(option.name);

    if (this.props.formReadOnly || this.props.field.readonly) {
      return (
        <div key={ option.name }>
          { this.props.renderIcon(checked ? "check-square-o" : "square-o", option.name) }
          <span style={{ verticalAlign: "super" }}>{ option.text }</span>
        </div>
      );
    } else {
      return (
        <div key={ option.name }>
          <input 
            type="checkbox"
            name={ this.props.field.name }
            value={ option.name }
            checked={ checked }
            onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onCheckboxChange(option, event.target.checked) }
          />
          <span>{ option.text }</span>
        </div>
      );
    }
  }

  /**
   * Returns array of selected options
   */
  private getSelectedOptions = () => {
    if (!this.props.value) {
      return [];
    }
    
    return (this.props.value as string).split(",");
  }

  /**
   * Event handler for checkbox change
   * 
   * @param option option
   * @param checked whether checkbox was checked
   */
  private onCheckboxChange = (option: MetaformFieldOption, checked: boolean) => {
    const selectedOptions = this.getSelectedOptions();
    const value = (checked ? [ ...selectedOptions, option.name ] : selectedOptions.filter(selectedOption => selectedOption !== option.name)).join(",");
    this.props.onValueChange(value);
  }

}