import React from "react";
import { MetaformField } from "generated/client";
import { FieldValue } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  formReadOnly: boolean;
  value: FieldValue;
  renderAutocomplete: (field: MetaformField, readOnly: boolean, value: FieldValue) => JSX.Element;
  onFocus: () => void;
}

/**
 * Component for Metaform autocomplete field
 */
const MetaformAutocompleteFieldComponent: React.FC<Props> = ({
  field,
  formReadOnly,
  value,
  renderAutocomplete
}) => {
  if (!field.name) {
    return null;
  }

  return renderAutocomplete(field, field.readonly || formReadOnly, value);
};

export default MetaformAutocompleteFieldComponent;