import React from "react";
import { TextField } from "@mui/material";
import { MetaformField } from "../generated/client/models";
import { HtmlAutocompleteWrapper } from "styled/react-components/react-components";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  formReadOnly: boolean;
  items : string[];
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
  items,
  onFocus
}) => {
  if (!field.name) {
    return null;
  }
  
  return (
    <HtmlAutocompleteWrapper
      id={ fieldId }
      aria-labelledby={ fieldLabelId }
      readOnly={ formReadOnly }
      onFocus={ onFocus }
      options={ items }
      renderInput={params => <TextField {...params} variant="outlined" InputProps={{ ...params.InputProps }}/> }
    />
  );
};

export default MetaformAutocompleteFieldComponent;