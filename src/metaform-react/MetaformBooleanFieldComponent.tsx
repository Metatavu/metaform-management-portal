import { Checkbox } from "@mui/material";
import React, { ReactNode } from "react";
import { MetaformField } from "../generated/client/models";
import { FieldValue, IconName } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
  fieldLabelId: string,
  formReadOnly: boolean,
  value: FieldValue,
  onValueChange?: (value: FieldValue) => void,
  onFocus?: () => void,
  renderIcon: (icon: IconName, key: string) => ReactNode,
  notInteractive?: boolean
}

/**
 * Component for radio field
 */
const MetaformBooleanFieldComponent: React.FC<Props> = ({
  field,
  fieldId,
  fieldLabelId,
  formReadOnly,
  value,
  onValueChange,
  onFocus,
  renderIcon,
  notInteractive
}) => {
  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange && onValueChange(event.target.value ? "" : "checked");
  };

  /**
   * Renders field option's value
   */
  const renderOptionValue = (option: MetaformField, optionValue: string) => {
    const readOnly = formReadOnly || field.readonly;
    const checked: boolean = !!optionValue;

    if (readOnly) {
      if (checked) {
        return renderIcon("check-square-o", `${fieldId}-${option.name}-icon`);
      }
        
      return renderIcon("square-o", `${fieldId}-${option.name}-icon-checked`);
    }
    
    return <Checkbox
      style={ notInteractive ? { pointerEvents: "none" } : {}}
      key={ `${fieldId}-${option.name}-input` }
      id={ `${fieldId}-${option.name}` }
      aria-labelledby={ fieldLabelId }
      name={ field.name }
      title={ field.title }
      required={ field.required }
      readOnly={ formReadOnly || field.readonly }
      value={ optionValue }
      checked={ checked }
      onChange={ onChange }
      onFocus={ onFocus }
    />;
  };

  const option = field;

  if (!field.name) {
    return null;
  }

  return (
    <div>
      <label className="metaform-boolean-field-label" key={ `${fieldId}-${field.name}-label` } htmlFor={ `${fieldId}-${field.name}` }>
        { renderOptionValue(option, value as string) }
        <span>
          { option.text }
        </span>
      </label>
    </div>
  );
};

export default MetaformBooleanFieldComponent;