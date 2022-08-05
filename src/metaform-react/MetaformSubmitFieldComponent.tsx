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
  const style: CSSProperties = { };

  if (notInteractive) {
    style.pointerEvents = "none";
  }

  return (
    <SubmitFieldWrapper
      variant="contained"
      style={ style }
      disabled={ disabled }
      onClick={ () => onClick && onClick(field) }
    >
      { field.text }
    </SubmitFieldWrapper>
  );
};

export default MetaformSubmitFieldComponent;