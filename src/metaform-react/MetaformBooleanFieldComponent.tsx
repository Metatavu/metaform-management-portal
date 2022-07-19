/* eslint-disable */ // Remove when refactoring is done
import { Checkbox } from '@mui/material';
import React, { ReactNode } from 'react';
import { MetaformField } from '../generated/client/models';
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
  onValueChange: (value: FieldValue) => void,
  onFocus: () => void,
  renderIcon: (icon: IconName, key: string) => ReactNode
}

/**
 * Component for radio field
 */
export const MetaformBooleanFieldComponent: React.FC<Props> = ({
  field,
  fieldId,
  fieldLabelId,
  formReadOnly,
  value,
  onValueChange,
  onFocus,
  renderIcon
}) => {
  /**
   * Renders field option's value
   */
  const renderOptionValue = (option: MetaformField, value: string) => {
    const readOnly = formReadOnly || field.readonly;
    const checked: boolean = value ? true : false;

    if (readOnly) {
      if (checked) {
        return renderIcon("check-square-o", `${fieldId}-${option.name}-icon`);
      } else { 
        return renderIcon("square-o", `${fieldId}-${option.name}-icon-checked`);
      }
    } else {
      return <Checkbox 
        key={ `${fieldId}-${option.name}-input` }
        id={ `${fieldId}-${option.name}` }  
        aria-labelledby={ fieldLabelId } 
        name={ field.name }
        title={ field.title }
        required={ field.required }
        readOnly={ formReadOnly || field.readonly }
        value={ value }
        checked={ checked }
        onChange={ onChange }
        onFocus={ onFocus }
        />
    }
  }
  
  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value ? "" : "checked");
  }  

  const option = field;

  return (
    <div>
      <label className="metaform-boolean-field-label" key={ `${fieldId}-${field.name}-label` } htmlFor={ `${fieldId}-${field.name}` }>
        { renderOptionValue(option, value as string) }
        <span> { option.text } </span>
      </label>
    </div>
  );
}