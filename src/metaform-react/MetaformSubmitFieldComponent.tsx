import React, { CSSProperties } from "react";
import { MetaformField } from "../generated/client/models";
import { ValidationErrors } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  formReadOnly: boolean;
  validationErrors: ValidationErrors;
  onClick: (source: MetaformField) => void;
}

/**
 * Component for Metaform submit field
 * TODO - Implement styled component for this
 */
export const MetaformSubmitFieldComponent: React.FC<Props> = ({
  field,
  formReadOnly,
  validationErrors,
  onClick
}) => {
  if (!field.name) {
    return null;
  }

  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const disabled = hasValidationErrors || formReadOnly || field.readonly;
  const style: CSSProperties = {};

  if (disabled) {
    style.background = "#aaa";
  }

  return (
    <input
      type="submit"
      style={ style }
      disabled={ disabled }
      value={ field.text }
      onClick={ () => onClick(field) }
    />
  );
};

export default MetaformSubmitFieldComponent;