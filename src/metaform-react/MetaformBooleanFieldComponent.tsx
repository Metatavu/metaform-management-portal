import { Box, Checkbox, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import theme from "theme";
import { MetaformField } from "../generated/client/models";
import { FieldValue, IconName } from "./types";
import strings from "localization/strings";

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
const MetaformBooleanFieldComponent: React.FC<Props> = ({
  field,
  fieldId,
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
    
    return (
      <Box
        style={{
          backgroundColor: "#fff",
          width: "100%",
          border: `1px solid ${theme.palette.grey[300]}`,
          height: 50,
          display: "flex",
          alignItems: "center"
        }}
      >
        <Checkbox
          style={ notInteractive ? { pointerEvents: "none" } : {}}
          key={ `${fieldId}-${option.name}-input` }
          id={ `${fieldId}-${option.name}` }
          name={ field.name }
          title={ field.title }
          required={ field.required }
          readOnly={ formReadOnly || field.readonly }
          value={ optionValue }
          checked={ checked }
          onChange={ onChange }
          onFocus={ onFocus }
          inputProps={{
            "aria-label": field.title
          }}
        />
        <Typography>
          { optionValue ? strings.generic.yes : strings.generic.no }
        </Typography>
      </Box>
    );
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