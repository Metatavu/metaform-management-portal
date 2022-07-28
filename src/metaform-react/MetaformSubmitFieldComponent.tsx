import React, { CSSProperties } from "react";
import { SubmitFieldWrapper } from "styled/react-components/react-components";
import { MetaformField } from "../generated/client/models";
import { ValidationErrors } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  formReadOnly: boolean;
  validationErrors: ValidationErrors;
  onClick?: (source: MetaformField) => void;
  notInteractive?: boolean;
}

/**
 * Component for Metaform submit field
 */
export const MetaformSubmitFieldComponent: React.FC<Props> = ({
  field,
  formReadOnly,
  validationErrors,
  onClick,
  notInteractive
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

  if (notInteractive) {
    style.pointerEvents = "none";
  }

  return (
    <SubmitFieldWrapper
      type="submit"
      inputProps={{
        style: style
      }}
      disabled={ disabled }
      value={ field.text }
      onClick={ () => onClick && onClick(field) }
    />
  );
};

export default MetaformSubmitFieldComponent;