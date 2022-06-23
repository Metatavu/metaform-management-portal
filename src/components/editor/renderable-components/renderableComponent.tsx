import { TextField } from "@mui/material";
import { MetaformField } from "generated/client";
import React from "react";

interface Prop {
  field: MetaformField;
  fieldLabelId: string;
  fieldId: string;
}

/**
 * Renderable component
 * TODO use metaform react component
 */
const RenderableComponent: React.FC<Prop> = ({
  field,
  fieldId,
  fieldLabelId
}) => {
  /**
   * Component render
   */
  return (
    <>
      <TextField
        key={ fieldId }
        value={ field.name }
        label={ fieldLabelId }
      />
    </>
  );
};

export default RenderableComponent;