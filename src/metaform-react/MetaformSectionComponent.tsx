import { Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { MetaformSection, MetaformField } from "../generated/client/models";
import { MetaformFieldComponent } from "./MetaformFieldComponent";
import { FieldValue, FileFieldValueItem, IconName, ValidationErrors } from "./types";
import VisibileIfEvaluator from "./VisibleIfEvaluator";

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
  renderSlider?: (fieldName: string, readOnly: boolean) => JSX.Element | null;
  onSubmit: (source: MetaformField) => void;
  fileShowButtonText: string;
  fileDeleteButtonText: string;
  onFileShow: (fieldName: string, value: FileFieldValueItem) => void;
  onFileDelete: (fieldName: string, value: FileFieldValueItem) => void;
}

/**
 * Component for metaform section
 */
export const MetaformSectionComponent: React.FC<Props> = ({
  section,
  metaformId,
  sectionId,
  datePicker,
  datetimePicker,
  renderAutocomplete,
  validationErrors,
  renderBeforeField,
  uploadFile,
  renderIcon,
  renderSlider,
  getFieldValue,
  setFieldValue,
  formReadOnly,
  contexts,
  onSubmit,
  onFileDelete,
  onFileShow,
  fileShowButtonText,
  fileDeleteButtonText,
  requiredFieldsMissingError,
  showRequiredFieldsMissingError
}) => {
  /**
   * Renders a section title
   */
  const renderTitle = () => {
    if (!section.title) {
      return null;
    }

    return <Typography variant="h2">{ section.title }</Typography>;
  };

  /**
   * Render field components
   */
  const renderFields = () => {
    return (
      <fieldset>
        {
          (section.fields || []).map((field, i) => {
            return (
              <MetaformFieldComponent
                // eslint-disable-next-line react/no-array-index-key
                key={ `${metaformId}-${sectionId}-field-${i}` }
                validationErrors={ validationErrors }
                datePicker={ datePicker }
                datetimePicker={ datetimePicker }
                renderAutocomplete={ renderAutocomplete }
                renderBeforeField={renderBeforeField}
                uploadFile={ uploadFile }
                renderIcon={ renderIcon }
                renderSlider={ renderSlider }
                getFieldValue={ getFieldValue }
                setFieldValue={ setFieldValue }
                formReadOnly={ formReadOnly }
                field={ field }
                metaformId={ metaformId }
                contexts={ contexts }
                onSubmit={ onSubmit }
                onFileDelete={ onFileDelete }
                onFileShow={ onFileShow }
                fileShowButtonText={ fileShowButtonText }
                fileDeleteButtonText={ fileDeleteButtonText }
                requiredFieldsMissingError={ requiredFieldsMissingError }
                showRequiredFieldsMissingError={ showRequiredFieldsMissingError }
              />
            );
          })
        }
      </fieldset>
    );
  };

  if (!VisibileIfEvaluator.isVisible(section.visibleIf, getFieldValue)) {
    return null;
  }

  return (
    <section className="metaform-section">
      { renderTitle() }
      { renderFields() }
    </section>
  );
};

export default MetaformSectionComponent;