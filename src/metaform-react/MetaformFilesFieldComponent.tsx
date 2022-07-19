import { Button, Input } from "@mui/material";
import React from "react";
import { MetaformField } from "../generated/client/models";
import { FieldValue, FileFieldValue, FileFieldValueItem } from "./types";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
  fieldLabelId: string,
  showButtonText: string,
  deleteButtonText: string,
  value: FieldValue,
  onValueChange: (value: FieldValue) => void,
  onFileUpload: (fieldName: string, file: FileList, path: string, maxFileSize?: number, uploadSingle?: boolean) => void,
  onFileShow: (fieldName: string, value: FileFieldValueItem) => void,
  onFileDelete: (fieldName: string, value: FileFieldValueItem) => void,
  onFocus: () => void
}

/**
 * Component for Metaform text field
 */
const MetaformFilesFieldComponent: React.FC<Props> = ({
  field,
  fieldId,
  fieldLabelId,
  showButtonText,
  deleteButtonText,
  value,
  onValueChange,
  onFileUpload,
  onFileShow,
  onFileDelete,
  onFocus
}) => {
  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && field.uploadUrl) {
      onFileUpload(field.name || "", event.target.files, field.uploadUrl, field.maxFileSize, field.singleFile);
    } else {
      onValueChange(event.target.value);
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
      <div key={valueItem.id} className="metaform-react-file-value-container">
        <span className="metaform-react-file-field-name">{ valueItem.name || valueItem.id}</span>
        <Button onClick={ () => onFileShow(field.name || "", valueItem) } className="metaform-react-file-field-open-button">{ showButtonText }</Button>
        <Button onClick={ () => onFileDelete(field.name || "", valueItem) } className="metaform-react-file-field-delete-button">{ deleteButtonText }</Button>
      </div>
    );
  });

  if (!field.name) {
    return null;
  }

  return (
    <>
      { valueItems }
      <Input
        type="file"
        value=""
        placeholder={ field.placeholder }
        id={ fieldId }
        aria-labelledby={ fieldLabelId }
        name={ field.name }
        onChange={ onChange }
        onFocus={ onFocus }
      />
    </>
  );
};

export default MetaformFilesFieldComponent;