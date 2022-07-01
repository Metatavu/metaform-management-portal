/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
import { Typography } from "@mui/material";
import { Metaform, FieldValue } from "metaform-react";
import { ValidationErrors } from "metaform-react/dist/types";
import React from "react";
import FormContainer from "styled/generic/form";

/**
 * Component props
 */
interface Props {
  contexts: string[];
  metaform: Metaform;
  // accessToken?: AccessToken; TODO: use once keycloak is implemented
  ownerKey?: string;
  getFieldValue: (fieldName: string) => FieldValue;
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
  onSubmit: (source: Metaform) => void;
  onValidationErrorsChange?: (validationErrors: ValidationErrors) => void;
}

/**
 * Form component
 */
const Form: React.FC = ({
  // contexts,
  // metaform,
  // accessToken, TODO: use once keycloak is implemented
  // ownerKey,
  // getFieldValue,
  // setFieldValue,
  // onSubmit,
  // onValidationErrorsChange
}) => {
  return (
    <FormContainer>
      <Typography variant="h6">Metaform</Typography>
    </FormContainer>
  );
};

export default Form;