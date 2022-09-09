import React from "react";
import { HtmlFieldWrapper } from "styled/react-components/react-components";
import { MetaformField } from "../generated/client/models";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
  notInteractive?: boolean
}

/**
 * Component for Metaform html field
 * 
 * @param props component properties
 */
export const MetaformHtmlComponent: React.FC<Props> = ({
  field,
  fieldId,
  notInteractive
}) => {
  if (!field.name) {
    return null;
  }

  const dangerousInnerHTML = field.html || "";

  return (
    <HtmlFieldWrapper
      style={ notInteractive ? { pointerEvents: "none" } : {}}
      id={ fieldId }
      dangerouslySetInnerHTML={{ __html: dangerousInnerHTML }}
    />
  );
};

export default MetaformHtmlComponent;