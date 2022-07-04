/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
import { Icon, LinearProgress, Slider, Typography } from "@mui/material";
import { MetaformComponent, FieldValue } from "metaform-react";
import { Metaform, MetaformField } from "generated/client";
import { FileFieldValueItem, IconName, ValidationErrors } from "metaform-react/dist/types";
import React from "react";
import FormContainer from "styled/generic/form";
import formJson from "1c9d4662-886b-4832-84ea-34ca05f90932.json";
import MetaformUtils from "utils/metaform-utils";
import strings from "localization/strings";

/**
 * Component props
 */
interface Props {
  contexts: string[];
  // accessToken?: AccessToken; TODO: use once keycloak is implemented
  ownerKey?: string;
  getFieldValue: (fieldName: string) => FieldValue;
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
  onSubmit: (source: Metaform) => void;
  onValidationErrorsChange?: (validationErrors: ValidationErrors) => void;
}

/**
 * Form component
 */
const Form: React.FC = () => {
  const [ metaform, setMetaform ] = React.useState<Metaform>(MetaformUtils.jsonToMetaform(formJson));
  const [ contexts, setContexts ] = React.useState<string[]>([]);
  const [ onValidationErrorsChange, setOnValidationErrorsChange ] = React.useState<(validationErrors: ValidationErrors) => void>();
  const [ uploadingFields, setUploadingFields ] = React.useState<string[]>([]);
  const [ uploading, setUploading ] = React.useState<boolean>(false);
  const [ formValues, setFormValues ] = React.useState<{ [key: string]: FieldValue }>({});
  /* const [ formValid, setFormValid ] = React.useState<boolean>(false);
  const [ draftSaveVisible, setDraftSaveVisible ] = React.useState<boolean>(false);
  const [ formValueChangeTimeout, setFormValueChangeTimeout ] = React.useState<number | null>(null);
  const [ autosaving, setAutosaving ] = React.useState<boolean>(false);
  const [ ownerKey, setOwnerKey ] = React.useState<string | null>(null);
  const [ reply, setReply ] = React.useState<boolean>(false); */

  /**
   * Method for getting field value
   *
   * @param fieldName field name
   * @returns field value
   */
  const getFieldValue = (fieldName: string): FieldValue => {
    return formValues[fieldName];
  };

  /**
   * Method for submitting form
   */
  const onSubmit = async () => {
    // await this.saveReply(); TODO
    console.log("Form submitted");
  };

  /**
   * Method for setting field value
   *
   * @param fieldName field name
   * @param fieldValue field value
   */
  const setFieldValue = (fieldName: string, fieldValue: FieldValue) => {
    if (formValues[fieldName] !== fieldValue) {
      formValues[fieldName] = fieldValue;
      setFormValues(formValues);
      // setDraftSaveVisible(!!metaform?.allowDrafts); TODO

      /* if (formValid && metaform?.autosave) {
        scheduleAutosave();
      } */
    }
  };

  /**
   * Finds a field from form by field name
   * 
   * @param fieldName field name
   * @returns field or null if not found
   */
  const getField = (fieldName: string) => {
    return (metaform.sections || [])
      .flatMap(section => section.fields || [])
      .find(field => field.name === fieldName);
  };

  /**
   * Renders slider field
   * 
   * @param fieldName field name
   * @param readOnly whether the field is read only
   */
  const renderSlider = (fieldName: string, readOnly: boolean) => {
    const field = getField(fieldName);
    if (!field) {
      return null;
    }

    const value = getFieldValue(fieldName);
    
    return (
      <Slider
        step={ field.step }
        max={ field.max }
        min={ field.min }
        name={ field.name }
        placeholder={ field.placeholder }
        disabled={ readOnly }
        value={ value as number }
        /* onChange={ (_event: React.ChangeEvent<{}>, value: number | number[]) => {
          setFieldValue(fieldName, value as number);
        }} */
      />
    );
  };

  /**
   * Method for rendering form icons
   * TODO: Implement icons
   */
  const renderIcon = () => {
    return (
      <Typography>
        { strings.generic.notImplemented }
      </Typography>
    );
  };

  /**
   * Method for setting date
   *
   * @param onChange on change callback for setting date
   */
  const renderDatePicker = (fieldName: string, onChange: (date: Date) => void) => {
    const value = getFieldValue(fieldName);
    return (
      <DatePicker
        selected={ value ? new Date(value as string) : null }
        onChange={ onChange }
        dateFormat="dd.MM.yyyy"
        locale="fi"
      />
    );
  };

  /**
   * Method for setting datetime
   *
   * @param onChange on change callback for setting datetime
   */
  const renderDatetimePicker = (fieldName: string, onChange: (date: Date) => void) => {
    const value = getFieldValue(fieldName);
    return (
      <DatePicker
        selected={ value ? new Date(value as string) : null }
        onChange={ onChange }
        dateFormat="dd.MM.yyyy"
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={ 15 }
        locale="fi"
      />
    );
  };

  /**
   * Method for uploading a file
   *
   * @param file file
   * @param path path
   */
  const uploadFile = (fieldName: string, files: FileList | File, path: string) => {
    console.log("Uploading file", fieldName, files, path);
    // TODO: implement
  };

  /**
   * Deletes uploaded file
   * Only unsecure (not yet persisted) files can be deleted, otherwise they are just removed from data
   * 
   * @param fieldName field name
   * @param value uploaded value
   */
  const deleteFile = (fieldName: string, value: FileFieldValueItem) => {
    console.log("Deleting file", fieldName, value);
    // TODO: implement
  };

  /**
   * Shows uploaded file
   * 
   * @param fieldName field name
   * @param value uploaded value
   */
  const showFile = async (fieldName: string, value: FileFieldValueItem) => {
    console.log("Showing uploaded file", fieldName, value);
    // TODO: implement
  };

  /**
   * Renders autocomplete component
   * 
   * @param field field
   * @param formReadOnly form read only
   * @param value autocomplete form value
   */
  const renderAutocomplete = (field: MetaformField, readOnly: boolean, value: FieldValue) => {
    return (
      <Typography>
        { strings.generic.notImplemented }
      </Typography>
    );
  };

  return (
    <FormContainer>
      <MetaformComponent
        form={ metaform }
        contexts={ contexts }
        formReadOnly={ false }
        getFieldValue={ getFieldValue }
        setFieldValue={ setFieldValue }
        datePicker={ renderDatePicker }
        datetimePicker={ renderDatetimePicker }
        renderAutocomplete={ renderAutocomplete }
        uploadFile={ uploadFile }
        onFileDelete={ deleteFile }
        onFileShow={ showFile }
        renderIcon={ renderIcon }
        renderSlider={ renderSlider }
        onSubmit={ onSubmit }
        onValidationErrorsChange={ onValidationErrorsChange }
        renderBeforeField={fieldname => {
          if (fieldname && uploadingFields.indexOf(fieldname) > -1) {
            return (<LinearProgress/>);
          }
        }}
      />
    </FormContainer>
  );
};

export default Form;