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
    console.log(updatedHtml);
    onFieldUpdate({
      ...field,
      html: updatedHtml
    });
  };

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        ["headingOne", "headingTwo", "headingThree"],
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
    "image",
    "imageBlot"
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