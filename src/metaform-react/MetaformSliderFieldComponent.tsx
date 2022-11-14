import React from "react";
import { SliderFieldWrapper } from "styled/react-components/react-components";
import { MetaformField } from "../generated/client/models";
import { FieldValue } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  formReadOnly: boolean;
  value: FieldValue;
  setFieldValue?: (fieldName: string, fieldValue: FieldValue) => void;
  notInteractive?: boolean;
}

/**
 * Component for Metaform slider field
 */
export const MetaformSliderFieldComponent: React.FC<Props> = ({
  field,
  formReadOnly,
  value,
  setFieldValue,
  notInteractive
}) => {
  const fieldName = field.name;
  const readOnly = !!(formReadOnly || field.readonly);
  const defaultSliderAriaLabel = "Slider";

  if (!fieldName) {
    return null;
  }

  return (
    <SliderFieldWrapper
      style={ notInteractive ? { pointerEvents: "none" } : {}}
      step={ field.step }
      max={ field.max }
      min={ field.min }
      name={ field.name }
      marks={
        [
          { value: field.min!, label: field.min },
          { value: field.max!, label: field.max }
        ]
      }
      placeholder={ field.placeholder }
      disabled={ readOnly }
      value={ value as number }
      valueLabelDisplay="auto"
      onChange={ (event: Event, newValue: number | number[]) => {
        setFieldValue && setFieldValue(fieldName, newValue as number);
      }}
      aria-label={ field.title ? field.title : defaultSliderAriaLabel }
    />
  );
};

export default MetaformSliderFieldComponent;