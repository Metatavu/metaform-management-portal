/* eslint-disable */ // Remove when refactoring is done
import { Button, Input } from '@mui/material';
import React from 'react';
import { MetaformField } from '../generated/client/models';
import { FieldValue, FileFieldValue, FileFieldValueItem } from './types';

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
export const MetaformFilesFieldComponent: React.FC<Props> = ({
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
  }

  const isFileFieldValue = ( value: FieldValue ): boolean => {
    if (!value) {
      return false;
    }
    if (Array.isArray((value as FileFieldValue).files)) {
      return true;
    }

    return false
  }

  const ensureFileFieldType = ( value: FieldValue ): FileFieldValue => {
    if (!value) {
      return { files: [] }
    }
    if (isFileFieldValue(value)) return value as FileFieldValue;

    return {
      files: [
        {
          id: value as string,
          persisted: false
        }
      ]
    }
  }

  let normalizedValue = ensureFileFieldType(value);

  const valueItems = normalizedValue.files.map((value) => {
    return (
      <div key={value.id} className="metaform-react-file-value-container">
        <span className="metaform-react-file-field-name">{ value.name || value.id}</span>
        <Button onClick={ () => onFileShow(field.name || "", value) } className="metaform-react-file-field-open-button">{ showButtonText }</Button>
        <Button onClick={ () => onFileDelete(field.name || "", value) } className="metaform-react-file-field-delete-button">{ deleteButtonText }</Button>
      </div>
    )
  })

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
}