import { FormControl, FormControlLabel, Radio } from "@mui/material";
import React, { CSSProperties, ReactNode } from "react";
import { RadioFieldWrapper, RadioOptionWrapper } from "styled/react-components/react-components";
import { MetaformField, MetaformFieldOption } from "../generated/client/models";
import { FieldValue, IconName } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
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
export const MetaformRadioFieldComponent: React.FC<Props> = ({
  field,
  fieldId,
  formReadOnly,
  value,
  onValueChange,
  onFocus,
  renderIcon,
  notInteractive
}) => {
  if (!field.name || field.name === "status") {
    return null;
  }
  
  const options = field.options || [];

  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange && onValueChange(event.target.value);
  };

  /**
   * Renders field options or icons if field is read-only
   */
  const renderOptions = (option: MetaformFieldOption, inputValue: string) => {
    const readOnly = formReadOnly || field.readonly;
    const checked: boolean = ((inputValue && inputValue === option.name) || (!inputValue && option.checked)) || false;

    if (readOnly) {
      if (checked) {
        return renderIcon("dot-circle-o", `${fieldId}-${option.name}-icon`);
      }
      return renderIcon("circle-o", `${fieldId}-${option.name}-icon-checked`);
    }

    const style: CSSProperties = {
      color: "#00008b"
    };

    if (notInteractive) {
      style.pointerEvents = "none";
      style.color = "#00008b";
    }

    return (
      <RadioOptionWrapper>
        <FormControlLabel
          className="metaform-radio-field-label"
          label={ option.text }
          key={ `${fieldId}-${option.name}-label`}
          htmlFor={ `${fieldId}-${option.name}` }
          value={ option.text }
          control={ <Radio
            style={ style }
            size="small"
            key={ `${fieldId}-${option.name}-input` }
            id={ `${fieldId}-${option.name}` }
            name={ field.name }
            title={ field.title }
            required={ field.required }
            readOnly={ formReadOnly || field.readonly }
            value={ option.name }
            checked={ checked }
            onChange={ onChange }
            onFocus={ onFocus }
            inputProps={{
              "aria-label": field.title
            }}
          /> }
        />
      </RadioOptionWrapper>
    );
  };

  return (
    <RadioFieldWrapper>
      {
        options.map(option => (
          <FormControl key={ `${fieldId}-${option.name}-container` }>
            { renderOptions(option, value as string) }
          </FormControl>
        ))
      }
    </RadioFieldWrapper>
  );
};

export default MetaformRadioFieldComponent;