/* eslint-disable */ // Remove when refactoring is done
import React, { ReactNode, useState } from 'react';
import { FieldValue, FileFieldValueItem, IconName, Strings, ValidationErrors, ValidationStatus } from './types';
import VisibileIfEvaluator from './VisibleIfEvaluator';
import MetaformMemoComponent from './MetaformMemoComponent';
import { MetaformField, MetaformFieldType } from '../generated/client/models';
import MetaformTextFieldComponent from './MetaformTextFieldComponent';
import { MetaformRadioFieldComponent } from './MetaformRadioFieldComponent';
import { MetaformSubmitFieldComponent } from './MetaformSubmitFieldComponent';
import { MetaformSelectFieldComponent } from './MetaformSelectFieldComponent';
import MetaformBooleanFieldComponent from './MetaformBooleanFieldComponent';
import { MetaformHtmlComponent } from './MetaformHtmlComponent';
import MetaformEmailFieldComponent from './MetaformEmailComponent';
import { MetaformUrlFieldComponent } from './MetaformUrlField';
import MetaformAutocompleteFieldComponent from './MetaformAutocompleteField';
import MetaformHiddenFieldComponent from './MetaformHiddenFieldComponent';
import MetaformFilesFieldComponent from './MetaformFilesFieldComponent';
import MetaformDateFieldComponent from './MetaformDateFieldComponent';
import MetaformDateTimeFieldComponent from './MetaformDateTimeFieldComponent';
import { MetaformNumberFieldComponent } from './MetaformNumberFieldComponent'; 
import { MetaformSliderFieldComponent } from './MetaformSliderFieldComponent'; 
import { MetaformTableFieldComponent } from "./MetaformTableFieldComponent"; 
import { MetaformChecklistFieldComponent } from "./MetaformChecklistFieldComponent";
import ContextUtils from '../utils/context-utils';

/**
 * Component props
 */
interface Props {
  formReadOnly: boolean;
  metaformId: string;
  field: MetaformField;
  renderBeforeField?: (fieldName?: string) => JSX.Element | void;
  contexts?: string[];
  requiredFieldsMissingError?: string;
  showRequiredFieldsMissingError?: boolean;
  validationErrors: ValidationErrors;
  getFieldValue: (fieldName: string) => FieldValue;
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
  datePicker: (fieldName: string, onChange: (date: Date) => void) => JSX.Element;
  datetimePicker: (fieldName: string, onChange: (date: Date) => void) => JSX.Element;
  renderAutocomplete: (field: MetaformField, readOnly: boolean, value: FieldValue) => JSX.Element;
  uploadFile: (fieldName: string, file: FileList | File, path: string) => void;
  onFileShow: (value: FileFieldValueItem) => void;
  onFileDelete: (fieldName: string, value: FileFieldValueItem) => void;
  renderIcon: (icon: IconName, key: string) => ReactNode;
  onSubmit: (source: MetaformField) => void;
}

/**
 * Component for metaform field
 */
export const MetaformFieldComponent: React.FC<Props> = ({
  formReadOnly,
  metaformId,
  field,
  renderBeforeField,
  contexts,
  requiredFieldsMissingError,
  showRequiredFieldsMissingError,
  validationErrors,
  getFieldValue,
  setFieldValue,
  datePicker,
  datetimePicker,
  renderAutocomplete,
  uploadFile,
  onFileShow,
  onFileDelete,
  renderIcon,
  onSubmit
}) => {
  const [ pristine, setPrisitine ] = useState(true);

  /**
   * Renders field title
   */
  const renderTitle = () => {

    if (!field.title) {
      return null;
    }

    const title = `${field.title}` + (field.required ? " *" : "");

    return (
      <div className="metaform-field-label-container"> 
        <label className="metaform-field-label"> { title } </label> 
      </div>
    ) 
  }

  /**
   * Renders field's input
   */
  const renderInput = () => {
    switch (field.type) {
      case MetaformFieldType.Text:
        return  <MetaformTextFieldComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ getFieldLabelId() }
                  fieldId={ getFieldId() }
                  field={ field } onValueChange={ onValueChange }
                  value={ thisFieldValue() }
                  onFocus={ onFocus }
                />;
      case MetaformFieldType.Memo:
        return  <MetaformMemoComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ getFieldLabelId() }
                  fieldId={ getFieldId() }
                  field={ field }
                  onValueChange={ onValueChange }
                  value={ thisFieldValue() }
                  onFocus={ onFocus }
                />;
      case MetaformFieldType.Radio:
        return  <MetaformRadioFieldComponent
                  renderIcon={ renderIcon }
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ getFieldLabelId() }
                  fieldId={ getFieldId() }
                  field={ field }
                  onValueChange={ onValueChange }
                  value={ thisFieldValue() }
                  onFocus={ onFocus }
                />;
      case MetaformFieldType.Select:
        return  <MetaformSelectFieldComponent
                  formReadOnly={ formReadOnly }
                  field={ field }
                  onValueChange={ onValueChange }
                  value={ thisFieldValue() }
                />;
      case MetaformFieldType.Submit:
        return  <MetaformSubmitFieldComponent
                  validationErrors={ validationErrors }
                  formReadOnly={ formReadOnly }
                  field={ field }
                  onClick={ onSubmit }
                />;
      case MetaformFieldType.Boolean:
        return  <MetaformBooleanFieldComponent
                  renderIcon={ renderIcon }
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ getFieldLabelId() }
                  fieldId={ getFieldId() }
                  field={ field }
                  onValueChange={ onValueChange }
                  value={ thisFieldValue() }
                  onFocus={ onFocus }
                />;
      case MetaformFieldType.Html:
        return  <MetaformHtmlComponent
                  fieldLabelId={ getFieldLabelId() }
                  fieldId={ getFieldId() }
                  field={ field }
                />;
      case MetaformFieldType.Email:
        return  <MetaformEmailFieldComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ getFieldLabelId() }
                  fieldId={ getFieldId() }
                  field={ field }
                  onValueChange={ onValueChange }
                  value={ thisFieldValue() }
                  onFocus={ onFocus }
                />;
      case MetaformFieldType.Url:
        return  <MetaformUrlFieldComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ getFieldLabelId() }
                  fieldId={ getFieldId() }
                  field={ field }
                  onValueChange={ onValueChange }
                  value={ thisFieldValue() }
                  onFocus={ onFocus }
                />;
      case MetaformFieldType.Autocomplete:
        return  <MetaformAutocompleteFieldComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ getFieldLabelId() }
                  fieldId={ getFieldId() }
                  renderAutocomplete={ renderAutocomplete }
                  field={ field }
                  value={ thisFieldValue() }
                  onFocus={ onFocus }
                />;
      case MetaformFieldType.Hidden:
        return  <MetaformHiddenFieldComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ getFieldLabelId() }
                  fieldId={ getFieldId() }
                  field={ field }
                  onValueChange={ onValueChange }
                  value={ thisFieldValue() }
                  onFocus={ onFocus }
                />;
      case MetaformFieldType.Files:
        return  <MetaformFilesFieldComponent
                  fieldLabelId={ getFieldLabelId() }
                  fieldId={ getFieldId() }
                  field={ field }
                  onFileUpload={ onFileUpload }
                  onValueChange={ onValueChange }
                  value={ thisFieldValue() }
                  onFocus={ onFocus }
                  onFileDelete={ onFileDelete }
                  onFileShow={ onFileShow }
                />;
      case MetaformFieldType.Date:
        return  <MetaformDateFieldComponent
                  datePicker={ datePicker }
                  field={ field }
                  onValueChange={ onValueChange }
                />;
      case MetaformFieldType.DateTime:
        return  <MetaformDateTimeFieldComponent
                  datetimePicker={ datetimePicker }
                  field={ field }
                  onValueChange={ onValueChange }
                />;
      case MetaformFieldType.Number:
        return  <MetaformNumberFieldComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ getFieldLabelId() }
                  fieldId={ getFieldId() }
                  field={ field }
                  onValueChange={ onValueChange }
                  value={ thisFieldValue() }
                  onFocus={ onFocus }
                />;
      case MetaformFieldType.Slider:
        return <MetaformSliderFieldComponent
                setFieldValue={ setFieldValue }
                formReadOnly={ formReadOnly }
                field={ field }
                value={ thisFieldValue() }
              />
      case MetaformFieldType.Checklist:
        return <MetaformChecklistFieldComponent
                  formReadOnly={ formReadOnly }
                  field={ field }
                  renderIcon={ renderIcon }
                  onValueChange={ onValueChange }
                  value={ thisFieldValue() }
              />
      case MetaformFieldType.Table:
        return  <MetaformTableFieldComponent
                  formReadOnly={ formReadOnly }
                  field={ field }
                  value={ thisFieldValue() }
                  renderIcon={ renderIcon }
                  onValueChange={ onValueChange }
                />;
      default:
        return <div style={{ color: "red" }}> Unknown field type { field.type } </div>;
    }
  }

  /**
   * Renders required field missing error
   */
  const renderRequiredFieldMissingError = () => {
    const value = thisFieldValue();
    const { required } = field;

    if (!required || !showRequiredFieldsMissingError || value) {
      return;
    }

    return (
      <p className="metaform-field-missing-error">{ requiredFieldsMissingError }</p>
    );
  }

  /**
   * Renders field help
   */
  const renderHelp = () => {
    if (!field.help) {
      return null;
    }

    return (
      <div className="metaform-field-help-container"> 
        <small className="metaform-field-help"> { field.help } </small> 
      </div>
    ) 
  }

  /**
   * Returns field's id
   */
  const getFieldId = () => {
    return `${metaformId}-field-${field.name}`;
  }

  /**
   * Returns field label's id
   */
  const getFieldLabelId = () => {
    return `${getFieldId()}-label`;
  }

  /**
   * Returns field's value
   * 
   * @returns field's value
   */
  const thisFieldValue  = (): FieldValue => {

    if (!field.name) {
      return null;
    }

    const result = getFieldValue(field.name);
    if (!result && field._default) {
      return field._default;
    }

    return result;
  }

  /**
   * Event handler for field value change
   */
  const onValueChange = (value: FieldValue) => {
    if (!field.name) {
      return null;
    }
    
    setFieldValue(field.name, value);
  }

  /**
   * Event handler for file upload
   * 
   * @param files file list
   * @param path string
   * @param maxFileSize number
   * @param uploadSingle boolean
   */
  const onFileUpload = (fieldName: string, files: FileList, path: string, maxFileSize?: number, uploadSingle?: boolean) => {
    if (uploadSingle) {
      const file = files[0];
      if (maxFileSize && file.size > maxFileSize) {
        throw new Error(`Couldn't upload the file because it exceeded the maximum file size of ${ maxFileSize }`);
      }
      return uploadFile(fieldName, file, path);
    } else {
      for (let i = 0; i < files.length; i++) {
        if (maxFileSize && files[i].size > maxFileSize) {
          throw new Error(`Couldn't upload the files because one of them exceeded the maximum file size of ${ maxFileSize }`);
        }
      }
      uploadFile(fieldName, files, path);
    }
  }


  /**
   * Event handler for field value change
   */
  const onFocus = () => {
    setPrisitine(false);
  }

  if (!ContextUtils.isEnabledContext(contexts, field.contexts)) {
    return null;
  }

  if (!VisibileIfEvaluator.isVisible(field.visibleIf, getFieldValue)) {
    return null;
  }

  const classNames = [ "metaform-field" ];

  if (pristine) {
    classNames.push("pristine");
  }

  return (
    <div className={ classNames.join(" ") } key={ getFieldId() }>
      { renderBeforeField && renderBeforeField(field.name) }
      { renderTitle() }
      { renderInput() }
      { renderRequiredFieldMissingError() }
      { renderHelp() }
    </div>
  );
}
