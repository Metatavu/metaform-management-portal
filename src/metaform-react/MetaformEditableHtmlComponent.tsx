import { Box } from "@mui/material";
import React from "react";
import ReactQuill from "react-quill";
import { MetaformField } from "../generated/client/models";
import "react-quill/dist/quill.snow.css";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  onFieldUpdate: (updatedField: MetaformField) => void;
}

/**
 * Component for Metaform editable html field
 *
 * @param props component properties
 */
export const MetaformEditableHtmlComponent: React.FC<Props> = ({
  field,
  onFieldUpdate
}) => {
  if (!field.name) {
    return null;
  }

  /**
   * On field html update
   *
   * @param updatedHtml updated html
   */
  const onFieldHtmlUpdate = (updatedHtml: string) => {
    onFieldUpdate({
      ...field,
      html: updatedHtml
    });
  };

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ header: [ 1, 2, 3, 4, 5, 6, false ] }],
        [{ color: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
          { align: [] }
        ],
        ["link"],
        ["clean"]
      ]
    },
    clipboard: { matchVisual: false }
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "color"
  ];

  return (
    <Box>
      <ReactQuill
        theme="snow"
        value={ field.html || "" }
        onChange={ onFieldHtmlUpdate }
        modules={ modules }
        formats={ formats }
      />
    </Box>
  );
};

export default MetaformEditableHtmlComponent;