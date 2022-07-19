/* eslint-disable */ // Remove when refactoring is done
import React, { ReactNode } from 'react';
import { FieldValue, FileFieldValueItem, IconName, Strings, ValidationErrors, ValidationStatus } from './types';
import VisibileIfEvaluator from './VisibleIfEvaluator';
import { MetaformMemoComponent } from './MetaformMemoComponent';
import { MetaformField, MetaformFieldType } from '../generated/client/models';
import MetaformTextFieldComponent from './MetaformTextFieldComponent';
import { MetaformRadioFieldComponent } from './MetaformRadioFieldComponent';
import { MetaformSubmitFieldComponent } from './MetaformSubmitFieldComponent';
import { MetaformSelectFieldComponent } from './MetaformSelectFieldComponent';
import { MetaformBooleanFieldComponent } from './MetaformBooleanFieldComponent';
import { MetaformHtmlComponent } from './MetaformHtmlComponent';
import { MetaformEmailFieldComponent } from './MetaformEmailComponent';
import { MetaformUrlFieldComponent } from './MetaformUrlField';
import { MetaformAutocompleteFieldComponent } from './MetaformAutocompleteField';
import { MetaformHiddenFieldComponent } from './MetaformHiddenFieldComponent';
import { MetaformFilesFieldComponent } from './MetaformFilesFieldComponent';
import { MetaformDateFieldComponent } from './MetaformDateFieldComponent';
import { MetaformDateTimeFieldComponent } from './MetaformDateTimeFieldComponent';
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
  fileShowButtonText: string;
  fileDeleteButtonText: string;
  onFileShow: (fieldName: string, value: FileFieldValueItem) => void;
  onFileDelete: (fieldName: string, value: FileFieldValueItem) => void;
  renderIcon: (icon: IconName, key: string) => ReactNode;
  renderSlider?: (fieldName: string, readOnly: boolean) => JSX.Element | null;
  onSubmit: (source: MetaformField) => void;
}

/**
 * Component state
 */
interface State {
  pristine: boolean
}

/**
 * Component for metaform field
 */
export class MetaformFieldComponent extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      pristine: true
    };
  }

  /**
   * Component render method
   */
  public render() {
    const { contexts, field, getFieldValue, renderBeforeField } = this.props;

    if (!ContextUtils.isEnabledContext(contexts, field.contexts)) {
      return null;
    }

    if (!VisibileIfEvaluator.isVisible(field.visibleIf, getFieldValue)) {
      return null;
    }

    const classNames = [ "metaform-field" ];

    if (this.state.pristine) {
      classNames.push("pristine");
    }

    return (
      <div className={ classNames.join(" ") } key={ this.getFieldId() }>
        { renderBeforeField && renderBeforeField(field.name) }
        { this.renderTitle() }
        { this.renderInput() }
        { this.renderRequiredFieldMissingError() }
        { this.renderHelp() }
      </div>
    );
  }

  /**
   * Renders field title
   */
  private renderTitle = () => {
    const { field } = this.props;

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
  private renderInput = () => {
    const {
      renderAutocomplete,
      formReadOnly,
      field,
      renderIcon,
      validationErrors,
      onSubmit,
      onFileDelete,
      onFileShow,
      datePicker,
      datetimePicker,
      fileDeleteButtonText,
      fileShowButtonText,
      renderSlider
    } = this.props;

    switch (this.props.field.type) {
      case MetaformFieldType.Text:
        return  <MetaformTextFieldComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ this.getFieldLabelId() }
                  fieldId={ this.getFieldId() }
                  field={ field } onValueChange={ this.onValueChange }
                  value={ this.getFieldValue() }
                  onFocus={ this.onFocus }
                />;
      case MetaformFieldType.Memo:
        return  <MetaformMemoComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ this.getFieldLabelId() }
                  fieldId={ this.getFieldId() }
                  field={ field }
                  onValueChange={ this.onValueChange }
                  value={ this.getFieldValue() }
                  onFocus={ this.onFocus }
                  getFieldValue={ this.getFieldValue }
                />;
      case MetaformFieldType.Radio:
        return  <MetaformRadioFieldComponent
                  renderIcon={ renderIcon }
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ this.getFieldLabelId() }
                  fieldId={ this.getFieldId() }
                  field={ field }
                  onValueChange={ this.onValueChange }
                  value={ this.getFieldValue() }
                  onFocus={ this.onFocus }
                />;
      case MetaformFieldType.Select:
        return  <MetaformSelectFieldComponent
                  formReadOnly={ formReadOnly }
                  field={ field }
                  onValueChange={ this.onValueChange }
                  value={ this.getFieldValue() }
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
                  fieldLabelId={ this.getFieldLabelId() }
                  fieldId={ this.getFieldId() }
                  field={ field }
                  onValueChange={ this.onValueChange }
                  value={ this.getFieldValue() }
                  onFocus={ this.onFocus }
                />;
      case MetaformFieldType.Html:
        return  <MetaformHtmlComponent
                  fieldLabelId={ this.getFieldLabelId() }
                  fieldId={ this.getFieldId() }
                  field={ field }
                />;
      case MetaformFieldType.Email:
        return  <MetaformEmailFieldComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ this.getFieldLabelId() }
                  fieldId={ this.getFieldId() }
                  field={ field }
                  onValueChange={ this.onValueChange }
                  value={ this.getFieldValue() }
                  onFocus={ this.onFocus }
                />;
      case MetaformFieldType.Url:
        return  <MetaformUrlFieldComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ this.getFieldLabelId() }
                  fieldId={ this.getFieldId() }
                  field={ field }
                  onValueChange={ this.onValueChange }
                  value={ this.getFieldValue() }
                  onFocus={ this.onFocus }
                />;
      case MetaformFieldType.Autocomplete:
        return  <MetaformAutocompleteFieldComponent
                  formReadOnly={ this.props.formReadOnly }
                  fieldLabelId={ this.getFieldLabelId() }
                  fieldId={ this.getFieldId() }
                  renderAutocomplete={ renderAutocomplete }
                  field={ this.props.field }
                  value={ this.getFieldValue() }
                  onFocus={ this.onFocus }
                />;
      case MetaformFieldType.Hidden:
        return  <MetaformHiddenFieldComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ this.getFieldLabelId() }
                  fieldId={ this.getFieldId() }
                  field={ field }
                  onValueChange={ this.onValueChange }
                  value={ this.getFieldValue() }
                  onFocus={ this.onFocus }
                />;
      case MetaformFieldType.Files:
        return  <MetaformFilesFieldComponent
                  fieldLabelId={ this.getFieldLabelId() }
                  fieldId={ this.getFieldId() }
                  field={ field }
                  onFileUpload={ this.onFileUpload }
                  onValueChange={ this.onValueChange }
                  value={ this.getFieldValue() }
                  onFocus={ this.onFocus }
                  onFileDelete={ onFileDelete }
                  onFileShow={ onFileShow }
                  deleteButtonText={ fileDeleteButtonText }
                  showButtonText={ fileShowButtonText }
                />;
      case MetaformFieldType.Date:
        return  <MetaformDateFieldComponent
                  datePicker={ datePicker }
                  field={ field }
                  onValueChange={ this.onValueChange }
                />;
      case MetaformFieldType.DateTime:
        return  <MetaformDateTimeFieldComponent
                  datetimePicker={ datetimePicker }
                  field={ field }
                  onValueChange={ this.onValueChange }
                />;
      case MetaformFieldType.Number:
        return  <MetaformNumberFieldComponent
                  formReadOnly={ formReadOnly }
                  fieldLabelId={ this.getFieldLabelId() }
                  fieldId={ this.getFieldId() }
                  field={ field }
                  onValueChange={ this.onValueChange }
                  value={ this.getFieldValue() }
                  onFocus={ this.onFocus }
                />;
      case MetaformFieldType.Slider:
        return <MetaformSliderFieldComponent
                setFieldValue={ this.props.setFieldValue }
                formReadOnly={ formReadOnly }
                field={ field }
                value={ this.getFieldValue() }
              />
      case MetaformFieldType.Checklist:
        return <MetaformChecklistFieldComponent
                  formReadOnly={ formReadOnly }
                  field={ field }
                  renderIcon={ renderIcon }
                  onValueChange={ this.onValueChange }
                  value={ this.getFieldValue() }
              />
      case MetaformFieldType.Table:
        return  <MetaformTableFieldComponent
                  formReadOnly={ formReadOnly }
                  field={ field }
                  value={ this.getFieldValue() }
                  renderIcon={ renderIcon }
                  onValueChange={ this.onValueChange }
                />;
      default:
        return <div style={{ color: "red" }}> Unknown field type { this.props.field.type } </div>;
    }
  }

  /**
   * Renders required field missing error
   */
  private renderRequiredFieldMissingError = () => {
    const { showRequiredFieldsMissingError, requiredFieldsMissingError, field } = this.props;
    const value = this.getFieldValue();
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
  private renderHelp = () => {
    const { field } = this.props;

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
  private getFieldId = () => {
    const { metaformId, field } = this.props;

    return `${metaformId}-field-${field.name}`;
  }

  /**
   * Returns field label's id
   */
  private getFieldLabelId = () => {
    return `${this.getFieldId()}-label`;
  }

  /**
   * Returns field's value
   * 
   * @returns field's value
   */
  private getFieldValue = (): FieldValue => {
    const { field } = this.props;

    if (!field.name) {
      return null;
    }

    const result = this.props.getFieldValue(field.name);
    if (!result && field._default) {
      return field._default;
    }

    return result;
  }

  /**
   * Event handler for field value change
   */
  private onValueChange = (value: FieldValue) => {
    const { field, setFieldValue } = this.props;

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
  private onFileUpload = (fieldName: string, files: FileList, path: string, maxFileSize?: number, uploadSingle?: boolean) => {
    const { uploadFile } = this.props;

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
  private onFocus = () => {
    this.setState({
      pristine: false
    });
  }
}
