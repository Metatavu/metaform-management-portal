import { Box, FormControl, Input, InputLabel } from "@mui/material";
import strings from "localization/strings";
import React from "react";
import { FilesButtonWrapper, FilesRowWrapper, HtmlFieldWrapper } from "styled/react-components/react-components";
import { MetaformField } from "../generated/client/models";
import { FieldValue, FileFieldValue, FileFieldValueItem } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
  fieldLabelId: string,
  value: FieldValue,
  onValueChange?: (value: FieldValue) => void,
  onFileUpload?: (fieldName: string, file: FileList, path: string, maxFileSize?: number, uploadSingle?: boolean) => void,
  onFileShow?: (value: FileFieldValueItem) => void,
  onFileDelete?: (fieldName: string, value: FileFieldValueItem) => void,
  onFocus?: () => void,
  notInteractive?: boolean
}

/**
 * Component for Metaform text field
 */
const MetaformFilesFieldComponent: React.FC<Props> = ({
  field,
  fieldId,
  fieldLabelId,
  value,
  onValueChange,
  onFileUpload,
  onFileShow,
  onFileDelete,
  onFocus,
  notInteractive
}) => {
  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && field.uploadUrl) {
      onFileUpload && onFileUpload(field.name || "", event.target.files, field.uploadUrl, field.maxFileSize, field.singleFile);
    } else {
      onValueChange && onValueChange(event.target.value);
    }
  };

  /**
   * Checks if contains files-array
   * 
   * @param fieldValue
   * @returns 
   */
  const isFileFieldValue = (fieldValue: FieldValue): boolean => {
    if (!fieldValue) {
      return false;
    }
    if (Array.isArray((fieldValue as FileFieldValue).files)) {
      return true;
    }

    return false;
  };

  /**
   * Ensures file field type
   * 
   * @param fieldValue
   * @returns 
   */
  const ensureFileFieldType = (fieldValue: FieldValue): FileFieldValue => {
    if (!fieldValue) {
      return { files: [] };
    }
    if (isFileFieldValue(fieldValue)) return fieldValue as FileFieldValue;

    return {
      files: [
        {
          id: fieldValue as string,
          persisted: false
        }
      ]
    };
  };

  const normalizedValue = ensureFileFieldType(value);

  const valueItems = normalizedValue.files.map(valueItem => {
    return (
      <FilesRowWrapper direction="row" spacing={ 1 } key={valueItem.id}>
        <HtmlFieldWrapper>
          { valueItem.name || valueItem.id }
        </HtmlFieldWrapper>
        <FilesButtonWrapper
          variant="contained"
          size="small"
          onClick={ () => onFileShow && onFileShow(valueItem) }
        >
          { strings.generic.show }
        </FilesButtonWrapper>
        <FilesButtonWrapper
          variant="contained"
          size="small"
          color="error"
          onClick={ () => onFileDelete && onFileDelete(field.name || "", valueItem) }
        >
          { strings.generic.delete }
        </FilesButtonWrapper>
      </FilesRowWrapper>
    );
  });

  if (!field.name) {
    return null;
  }

  return (
    <Box
      style={{
        border: "1px dashed rgba(0,0,0,0.5)",
        width: "100%",
        borderRadius: "0.5rem",
        overflow: "hidden"
      }}
    >
      { valueItems }
      <FormControl
        sx={{
          display: "flex",
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.1)",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.2)"
          }
        }}
      >
        <InputLabel
          shrink={ false }
          style={{
            width: "100%",
            textAlign: "center",
            height: "100%",
            paddingTop: 15
          }}
        >
          { strings.generic.addFilesText }
        </InputLabel>
        <Input
          style={ notInteractive ?
            {
              pointerEvents: "none",
              opacity: 0
            } :
            {
              padding: 0,
              margin: 0,
              opacity: 0,
              width: "100%",
              height: 80
            }
          }
          type="file"
          value=""
          disableUnderline
          placeholder={ field.placeholder }
          id={ fieldId }
          aria-labelledby={ fieldLabelId }
          name={ field.name }
          onChange={ onChange }
          onFocus={ onFocus }
        />
      </FormControl>
    </Box>
  );
};

export default MetaformFilesFieldComponent;