import { Typography } from "@mui/material";
import strings from "localization/strings";
import React from "react";

interface Prop {
}

/**
 * Metaform field addable component
 * TODO render different fields according to field types
 */
const FieldAddable: React.FC<Prop> = () => {
  /**
   * Component render
   */
  return (
    <Typography>{ strings.generic.notImplemented }</Typography>
  );
};

export default FieldAddable;