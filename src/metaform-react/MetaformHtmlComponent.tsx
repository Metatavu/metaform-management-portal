import React from "react";
import HtmlFieldWrapper from "styled/react-components/react-components";
import { MetaformField } from "../generated/client/models";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
  fieldLabelId: string
}

/**
 * Component for Metaform memo field
 * 
 * @param props component properties
 */
export const MetaformHtmlComponent: React.FC<Props> = ({
  field,
  fieldId,
  fieldLabelId
}) => {
  if (!field.name) {
    return null;
  }

  const dangerousInnerHTML = field.html || "";

  return (
    <HtmlFieldWrapper
      id={ fieldId }
      aria-labelledby={ fieldLabelId }
      dangerouslySetInnerHTML={{ __html: dangerousInnerHTML }}
    />
  );
};

export default MetaformHtmlComponent;