/* eslint-disable */ // Remove when refactoring is done
import React, { ReactNode } from 'react';
import { MetaformSection, MetaformField } from '../generated/client/models';
import { MetaformFieldComponent } from './MetaformFieldComponent';
import { FieldValue, FileFieldValue, FileFieldValueItem, IconName, Strings, ValidationErrors, ValidationStatus } from './types';
import VisibileIfEvaluator from './VisibleIfEvaluator';

/**
 * Component props
 */
interface Props {
  section: MetaformSection;
  formReadOnly: boolean;
  metaformId: string;
  sectionId: string;
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
  renderIcon: (icon: IconName, key: string) => ReactNode;
  renderSlider?: (fieldName: string, readOnly: boolean) => JSX.Element | null;
  onSubmit: (source: MetaformField) => void;
  fileShowButtonText: string;
  fileDeleteButtonText: string;
  onFileShow: (fieldName: string, value: FileFieldValueItem) => void;
  onFileDelete: (fieldName: string, value: FileFieldValueItem) => void;
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for metaform section
 */
export class MetaformSectionComponent extends React.Component<Props, State> {

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
    if (!VisibileIfEvaluator.isVisible(this.props.section.visibleIf, this.props.getFieldValue)) {
      return null;
    }

    return (
      <section className="metaform-section">
        { this.renderTitle() }
        { this.renderFields() }
      </section>
    );
  }

  private renderTitle = () => {
    if (!this.props.section.title) {
      return null;
    }

    return <h2> { this.props.section.title } </h2>; 
  }

  private renderFields = () => {
    const { renderAutocomplete } = this.props;

    return (
      <fieldset>
        {
          (this.props.section.fields || []).map((field, i) => {
            return (
              <MetaformFieldComponent key={ `${this.props.metaformId}-${this.props.sectionId}-field-${i}` } 
                validationErrors={ this.props.validationErrors }
                datePicker={ this.props.datePicker } 
                datetimePicker={ this.props.datetimePicker }
                renderAutocomplete={ renderAutocomplete }
                renderBeforeField={this.props.renderBeforeField}
                uploadFile={ this.props.uploadFile }
                renderIcon={ this.props.renderIcon } 
                renderSlider={ this.props.renderSlider }
                getFieldValue={ this.props.getFieldValue } 
                setFieldValue={ this.props.setFieldValue } 
                formReadOnly={ this.props.formReadOnly } 
                field={ field }
                metaformId={ this.props.metaformId } 
                contexts={ this.props.contexts }
                onSubmit={ this.props.onSubmit }
                onFileDelete={ this.props.onFileDelete }
                onFileShow={ this.props.onFileShow }
                fileShowButtonText={ this.props.fileShowButtonText }
                fileDeleteButtonText={ this.props.fileDeleteButtonText }
                requiredFieldsMissingError={ this.props.requiredFieldsMissingError }
                showRequiredFieldsMissingError={ this.props.showRequiredFieldsMissingError } 
              />
            )
          })
        }
      </fieldset>
    );
  }

}
