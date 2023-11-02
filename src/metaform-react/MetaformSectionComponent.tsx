import { Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { MetaformFieldset, MetaformSectionWrapper } from "styled/generic/form";
import theme from "theme";
import { MetaformSection, MetaformField } from "../generated/client/models";
import { MetaformFieldComponent } from "./MetaformFieldComponent";
import { FieldValue, FileFieldValueItem, IconName, ValidationErrors } from "./types";
import VisibleIfEvaluator from "./VisibleIfEvaluator";

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
  renderDatePicker: (field: MetaformField, onChange: (date: Date) => void) => JSX.Element;
  renderDatetimePicker: (field: MetaformField, onChange: (date: Date) => void) => JSX.Element;
  renderAutocomplete: (field: MetaformField, readOnly: boolean, value: FieldValue) => JSX.Element;
  uploadFile: (fieldName: string, file: FileList | File) => void;
  renderIcon: (icon: IconName, key: string) => ReactNode;
  onSubmit: (source: MetaformField) => void;
  onFileShow: (value: FileFieldValueItem) => void;
  onFileDelete: (fieldName: string, value: FileFieldValueItem) => void;
  saving?: boolean;
}

/**
 * Component for metaform section
 */
const MetaformSectionComponent: React.FC<Props> = ({
  section,
  metaformId,
  sectionId,
  renderDatePicker,
  renderDatetimePicker,
  renderAutocomplete,
  validationErrors,
  renderBeforeField,
  uploadFile,
  renderIcon,
  getFieldValue,
  setFieldValue,
  formReadOnly,
  contexts,
  onSubmit,
  onFileDelete,
  onFileShow,
  requiredFieldsMissingError,
  showRequiredFieldsMissingError,
  saving
}) => {
  /**
   * Renders a title
   */
  const renderTitle = () => {
    if (!section.title) {
      return null;
    }

    return <Typography style={ theme.sectionTitle }>{ section.title }</Typography>;
  };

  /**
   * Render field components
   */
  const renderFields = () => {
    return (
      <MetaformFieldset>
        {
          (section.fields || []).map((field, i) => {
            return (
              <MetaformFieldComponent
                // eslint-disable-next-line react/no-array-index-key
                key={ `${metaformId}-${sectionId}-field-${i}` }
                validationErrors={ validationErrors }
                renderDatePicker={ renderDatePicker }
                renderDatetimePicker={ renderDatetimePicker }
                renderAutocomplete={ renderAutocomplete }
                renderBeforeField={renderBeforeField}
                uploadFile={ uploadFile }
                renderIcon={ renderIcon }
                getFieldValue={ getFieldValue }
                setFieldValue={ setFieldValue }
                formReadOnly={ formReadOnly }
                field={ field }
                metaformId={ metaformId }
                contexts={ contexts }
                onSubmit={ onSubmit }
                onFileDelete={ onFileDelete }
                onFileShow={ onFileShow }
                requiredFieldsMissingError={ requiredFieldsMissingError }
                showRequiredFieldsMissingError={ showRequiredFieldsMissingError }
                saving={ saving }
              />
            );
          })
        }
      </MetaformFieldset>
    );
  };

  if (!VisibleIfEvaluator.isVisible(section.visibleIf, getFieldValue)) {
    return null;
  }

  return (
    <MetaformSectionWrapper>
      { renderTitle() }
      { renderFields() }
    </MetaformSectionWrapper>
  );
};

export default MetaformSectionComponent;