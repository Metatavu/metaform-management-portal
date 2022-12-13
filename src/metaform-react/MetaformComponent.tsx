import React, { ReactNode, useEffect, useState } from "react";
import { Metaform, MetaformField, MetaformFieldType } from "../generated/client/models";
import MetaformSectionComponent from "./MetaformSectionComponent";
import { FieldValue, FileFieldValueItem, IconName, ValidationErrors, ValidationStatus } from "./types";
import * as EmailValidator from "email-validator";
import VisibleIfEvaluator from "./VisibleIfEvaluator";
import ContextUtils from "../utils/context-utils";
import deepEqual from "fast-deep-equal";
import { MetaformBody, MetaformTitle } from "styled/generic/form";
import theme from "theme";
import { Dictionary } from "types";

/**
 * Component props
 */
interface Props {
  form: Metaform;
  formReadOnly: boolean;
  titleColor?: string;
  saving?: boolean;
  contexts?: string[];
  requiredFieldsMissingError?: string;
  showRequiredFieldsMissingError?: boolean;
  formValues?: Dictionary<FieldValue>;
  renderBeforeField?: (fieldName?: string) => JSX.Element | void;
  getFieldValue: (fieldName: string) => FieldValue
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
  renderDatePicker: (field: MetaformField, onChange: (date: Date) => void) => JSX.Element;
  renderDatetimePicker: (field: MetaformField, onChange: (date: Date) => void) => JSX.Element;
  renderAutocomplete: (field: MetaformField, readOnly: boolean, value: FieldValue) => JSX.Element;
  uploadFile: (fieldName: string, file: FileList | File, path: string) => void;
  renderIcon: (icon: IconName, key: string) => ReactNode;
  onSubmit: (source: MetaformField) => void;
  onFileShow: (value: FileFieldValueItem) => void;
  onFileDelete: (fieldName: string, value: FileFieldValueItem) => void;
  onValidationErrorsChange?: (validationErrors: ValidationErrors) => void;
}

/**
 * Component for metaform
 */
const MetaformComponent: React.FC<Props> = ({
  form,
  saving,
  titleColor,
  formReadOnly,
  contexts,
  requiredFieldsMissingError,
  showRequiredFieldsMissingError,
  formValues,
  renderBeforeField,
  getFieldValue,
  setFieldValue,
  renderDatePicker,
  renderDatetimePicker,
  renderAutocomplete,
  uploadFile,
  renderIcon,
  onSubmit,
  onFileShow,
  onFileDelete,
  onValidationErrorsChange
}) => {
  const metaformId = form.id ? `${form.id}` : "";
  const metaformSectionKeyPrefix = `metaform-${metaformId}`;

  const [ validationErrors, setValidationErrors ] = useState({});

  /**
   * Renders form title
   */
  const renderTitle = () => {
    if (!form.title) {
      return null;
    }

    return (
      <MetaformTitle color={ titleColor || theme.palette.secondary.light }>
        { form.title }
      </MetaformTitle>
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
    const localValidationErrors: ValidationErrors = {};

    (form.sections || [])
      .filter(section => {
        return VisibleIfEvaluator.isVisible(section.visibleIf, getFieldValue);
      })
      .forEach(section => {
        (section.fields || [])
          .filter(field => !!field.name)
          .filter(field => ContextUtils.isEnabledContext(contexts, field.contexts))
          .filter(field => {
            return VisibleIfEvaluator.isVisible(field.visibleIf, getFieldValue);
          })
          .forEach(field => {
            const fieldName = field.name || "";
            const validationError = validateFieldValue(field, getFieldValue(fieldName!));
            if (validationError) {
              localValidationErrors[fieldName] = validationError;
            }
          });
      });

    if (!deepEqual(localValidationErrors, validationErrors)) {
      setValidationErrors(localValidationErrors);

      if (onValidationErrorsChange) {
        onValidationErrorsChange(localValidationErrors);
      }
    }
  };

  useEffect(() => {
    validateFields();
  }, [ form, formValues ]);

  const sections = form.sections || [];

  return (
    <MetaformBody>
      { renderTitle() }
      {
        sections.map((section, i) => {
          const sectionId = `section-${i}`;

          return (
            <MetaformSectionComponent
              key={`${metaformSectionKeyPrefix}-${sectionId}`}
              validationErrors={ validationErrors }
              renderBeforeField={ renderBeforeField }
              renderDatePicker={ renderDatePicker }
              renderDatetimePicker={ renderDatetimePicker }
              renderAutocomplete={ renderAutocomplete }
              uploadFile={ uploadFile }
              renderIcon={ renderIcon }
              getFieldValue={ getFieldValue }
              setFieldValue={ setFieldValue }
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
              saving={ saving }
            />
          );
        })
      }
    </MetaformBody>
  );
};

export default MetaformComponent;