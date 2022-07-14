import React from "react";
import { MetaformField } from "../generated/client/models";
import HtmlAutocompleteWrapper from "styled/react-components/react-components";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  formReadOnly: boolean;
  onFocus: () => void;
}

/**
 * Component for Metaform autocomplete field
 * 
 * @param props Component props
 */
export const MetaformAutocompleteFieldComponent: React.FC<Props> = ({
  field,
  fieldId,
  fieldLabelId,
  formReadOnly,
  onFocus
}) => {
  if (!field.name) {
    return null;
  }

  return (
    <HtmlAutocompleteWrapper
      id={fieldId}
      aria-labelledby={fieldLabelId}
      aria-readonly={formReadOnly}
      onFocus={onFocus}
      options={}
      renderInput={}
    />
  );
};

export default MetaformAutocompleteFieldComponent;