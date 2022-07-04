/* eslint-disable */ // Remove when refactoring is done
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
  formReadOnly: boolean,
  value: FieldValue,
  onValueChange: (value: FieldValue) => void,
  onFileUpload: (fieldName: string, file: FileList, path: string, maxFileSize?: number, uploadSingle?: boolean) => void,
  onFileShow: (fieldName: string, value: FileFieldValueItem) => void,
  onFileDelete: (fieldName: string, value: FileFieldValueItem) => void,
  onFocus: () => void
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for Metaform text field
 */
export class MetaformFilesFieldComponent extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      
    };
  }

  /**
   * Component render method
   */
  public render() {
    if (!this.props.field.name) {
      return null;
    }

    const { value, showButtonText, deleteButtonText, onFileDelete, onFileShow } = this.props;
    let normalizedValue = this.ensureFileFieldType(value);

    const valueItems = normalizedValue.files.map((value) => {
      return (
        <div key={value.id} className="metaform-react-file-value-container">
          <span className="metaform-react-file-field-name">{ value.name || value.id}</span>
          <button onClick={() => onFileShow(this.props.field.name || "", value)} className="metaform-react-file-field-open-button">{ showButtonText }</button>
          <button onClick={() => onFileDelete(this.props.field.name || "", value)} className="metaform-react-file-field-delete-button">{ deleteButtonText }</button>
        </div>
      )
    })

    return (
      <>
        { valueItems }
        <input
          type="file"
          value=""
          placeholder={ this.props.field.placeholder }
          id={ this.props.fieldId }
          aria-labelledby={ this.props.fieldLabelId }
          name={ this.props.field.name }
          onChange={ this.onChange }
          onFocus={ this.props.onFocus }
        />
      </>
    );
  }
  
  /**
   * Event handler for field input change
   * 
   * @param event event
   */
  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && this.props.field.uploadUrl) {
      this.props.onFileUpload(this.props.field.name || "", event.target.files, this.props.field.uploadUrl, this.props.field.maxFileSize, this.props.field.singleFile);
    } else {
      this.props.onValueChange(event.target.value);
    }
  }

  private isFileFieldValue = ( value: FieldValue ): boolean => {
    if (!value) {
      return false;
    }
    if (Array.isArray((value as FileFieldValue).files)) {
      return true;
    }

    return false
  }

  private ensureFileFieldType = ( value: FieldValue ): FileFieldValue => {
    if (!value) {
      return { files: [] }
    }
    if (this.isFileFieldValue(value)) return value as FileFieldValue;

    return {
      files: [
        {
          id: value as string,
          persisted: false
        }
      ]
    }
  }

}