import { Metaform } from "generated/client";
import React, { useState, FC } from "react";
import { FieldValue } from "metaform-react/types";
import Form from "components/generic/form";
import { Dictionary } from "@reduxjs/toolkit";

/**
 * Component prop
 */
interface Prop {
  metaform: Metaform;
}

/**
 * Metaform editor preview component
 */
const DraftPreview: FC<Prop> = ({
  metaform
}) => {
  const [ formValues, setFormValues ] = useState<Dictionary<FieldValue>>({});

  /**
   * Method for getting field value
   *
   * @param fieldName field name
   */
  const getFieldValue = (fieldName: string): FieldValue => formValues[fieldName] || null;

  /**
   * Method for setting field value
   *
   * @param fieldName field name
   * @param fieldValue field value
   */
  const setFieldValue = (fieldName: string, fieldValue: FieldValue) => {
    if (formValues[fieldName] !== fieldValue) {
      setFormValues({ ...formValues, [fieldName]: fieldValue });
    }
  };

  return (
    <Form
      contexts={ ["FORM"] }
      metaform={ metaform }
      getFieldValue={ getFieldValue }
      setFieldValue={ setFieldValue }
      onSubmit={ () => {} }
      saving={ false }
    />
  );
};

export default DraftPreview;