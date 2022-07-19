import React, { ReactNode, useEffect, useState } from "react";
import { Metaform, MetaformField, MetaformFieldType } from "../generated/client/models";
import MetaformSectionComponent from "./MetaformSectionComponent";
import { FieldValue, FileFieldValueItem, IconName, ValidationErrors, ValidationStatus } from "./types";
import * as EmailValidator from "email-validator";
import VisibileIfEvaluator from "./VisibleIfEvaluator";
import ContextUtils from "../utils/context-utils";
import deepEqual from "fast-deep-equal";

/**
 * Component props
 */
interface Props {
  form: Metaform;
  formReadOnly: boolean;
  renderBeforeField?: (fieldName?: string) => JSX.Element | void;
  contexts?: string[];
  requiredFieldsMissingError?: string;
  showRequiredFieldsMissingError?: boolean;
  getFieldValue: (fieldName: string) => FieldValue
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
  datePicker: (fieldName: string, onChange: (date: Date) => void) => JSX.Element;
  datetimePicker: (fieldName: string, onChange: (date: Date) => void) => JSX.Element;
  renderAutocomplete: (field: MetaformField, readOnly: boolean, value: FieldValue) => JSX.Element;
  uploadFile: (fieldName: string, file: FileList | File, path: string) => void;
  renderIcon: (icon: IconName, key: string) => ReactNode;
  onSubmit: (source: MetaformField) => void;
  onFileShow: (fieldName: string, value: FileFieldValueItem) => void;
  onFileDelete: (fieldName: string, value: FileFieldValueItem) => void;
  onValidationErrorsChange?: (validationErrors: ValidationErrors) => void;
}

/**
 * Component for metaform
 */
const MetaformComponent: React.FC<Props> = ({
  form,
  formReadOnly,
  renderBeforeField,
  contexts,
  requiredFieldsMissingError,
  showRequiredFieldsMissingError,
  getFieldValue,
  setFieldValue,
  datePicker,
  datetimePicker,
  renderAutocomplete,
  uploadFile,
  renderIcon,
  onSubmit,
  onFileShow,
  onFileDelete,
  onValidationErrorsChange
}) => {
  /**
   * Returns unique id
   * 
   * @returns unique id
   */
  const getUniqueId = () => {
    return Math.random().toString(36).substr(2);
  };

  const metaformId = `metaform-${form.id ? `${form.id}-` : ""}${getUniqueId()}`;
  const [ validationErrors, setValidationErrors ] = useState({});

  /**
   * Renders form title
   */
  const renderTitle = () => {
    if (!form.title) {
      return null;
    }
    
    return (
      <h1>
        { form.title }
      </h1>
    );
  };

  /**
   * Validates field value
   * 
   * @param field field
   * @param value value
   * @returns validation result
   */
  const validateFieldValue = (field: MetaformField, value: FieldValue): ValidationStatus | null => {
    if (field.required && !value) {
      return "missing-required";
    }
    
    if (field.type === MetaformFieldType.Email && value && !EmailValidator.validate(value as string)) {
      return "invalid-email";
    }
    
    return null;
  };

  /**
   * Validates all visible form fields
   */
  const validateFields = () => {
    const localValidationErros: ValidationErrors = {};
    
    (form.sections || [])
      .filter(section => {
        return VisibileIfEvaluator.isVisible(section.visibleIf, getFieldValue);
      })
      .forEach(section => {
        (section.fields || [])
          .filter(field => !!field.name)
          .filter(field => ContextUtils.isEnabledContext(contexts, field.contexts))
          .filter(field => {
            return VisibileIfEvaluator.isVisible(field.visibleIf, getFieldValue);
          })
          .forEach(field => {
            const fieldName = field.name || "";
            const validationError = validateFieldValue(field, getFieldValue(fieldName!));
            if (validationError) {
              localValidationErros[fieldName] = validationError;
            }
          });
      });

    if (!deepEqual(localValidationErros, validationErrors)) {
      setValidationErrors(localValidationErros);

      if (onValidationErrorsChange) {
        onValidationErrorsChange(localValidationErros);
      }
    }
  };

  useEffect(() => {
    validateFields();
  }, []);

  /**
   * Sets field value
   * 
   * @param fieldName field name
   * @param fieldValue field value
   */
  const setThisFieldValue = (fieldName: string, fieldValue: FieldValue) => {
    setFieldValue(fieldName, fieldValue);
    validateFields();
  };

  const sections = form.sections || [];

  return (
    <div className="metaform">
      {
        renderTitle()
      }
      {
        sections.map((section, i) => {
          const sectionId = `section-${i}`;

          return (
            <MetaformSectionComponent
              key={`${metaformId}-${sectionId}`}
              validationErrors={ validationErrors }
              renderBeforeField={ renderBeforeField }
              datePicker={ datePicker }
              datetimePicker={ datetimePicker }
              renderAutocomplete={ renderAutocomplete }
              uploadFile={ uploadFile }
              renderIcon={ renderIcon }
              getFieldValue={ getFieldValue }
              setFieldValue={ setThisFieldValue }
              metaformId={ metaformId }
              sectionId={ sectionId }
              formReadOnly={ formReadOnly }
              section={ section }
              contexts={ contexts }
              onSubmit={ onSubmit }
              requiredFieldsMissingError={ requiredFieldsMissingError }
              showRequiredFieldsMissingError={ showRequiredFieldsMissingError }
              onFileShow={ onFileShow }
              onFileDelete={ onFileDelete }
              fileShowButtonText="FileShowButtonText"
              fileDeleteButtonText="FileDeleteButtonText"
            />
          );
        })
      }
    </div>
  );
};

export default MetaformComponent;