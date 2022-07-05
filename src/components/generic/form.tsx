/* eslint-disable */
import { LinearProgress, Slider, TextField, Typography, Snackbar } from "@mui/material";
import { Metaform, MetaformField, Reply } from "generated/client";
import { FileFieldValueItem, ValidationErrors, FieldValue } from "../../metaform-react/types";
import React from "react";
import FormContainer from "styled/generic/form";
import formJson from "1c9d4662-886b-4832-84ea-34ca05f90932.json";
import MetaformUtils from "utils/metaform-utils";
import strings from "localization/strings";
import DatePicker from "@mui/lab/DatePicker";
import { Alert, DateTimePicker, LocalizationProvider } from "@mui/lab";
import fiLocale from "date-fns/locale/fi";
import enLocale from "date-fns/locale/en-US";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { MetaformComponent } from "metaform-react/MetaformComponent";
import { Dictionary } from "types";
import { Link } from "react-router-dom";

/**
 * Component props
 */
interface Props {
  // accessToken?: AccessToken; TODO: use once keycloak is implemented
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
  const [ formValues, setFormValues ] = React.useState<Dictionary<FieldValue>>({});
  const [ formValid, setFormValid ] = React.useState<boolean>(false);
  const [ draftSaveVisible, setDraftSaveVisible ] = React.useState<boolean>(false);
  const [ formValueChangeTimeout, setFormValueChangeTimeout ] = React.useState<number | null>(null);
  const [ autosaving, setAutosaving ] = React.useState<boolean>(false);
  const [ ownerKey, setOwnerKey ] = React.useState<string | null>(null);
  const [ reply, setReply ] = React.useState<Reply>();
  const [ saving, setSaving ] = React.useState<boolean>(false);

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
    // await saveReply(); TODO: Implement once this can be tested
  };

  /**
   * Method for setting field value
   *
   * @param fieldName field name
   * @param fieldValue field value
   */
  const setFieldValue = (fieldName: string, fieldValue: FieldValue) => {
    if (formValues[fieldName] !== fieldValue) {
      const newFormValues = { ...formValues, [fieldName]: fieldValue };
      setFormValues(newFormValues);
      setDraftSaveVisible(!!metaform?.allowDrafts);

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
   * Event handler for date change
   */
  const handleDateChange = () => {
    console.log("Selected date"); // TODO: implement
  };

  /**
   * Event handler for datetime change
   */
  const handleDateTimeChange = () => {
    console.log("Selected datetime"); // TODO: implement
  };

  /**
   * Method for setting date
   *
   * @param fieldName field name
   */
  const renderDatePicker = (fieldName: string) => {
    const value = getFieldValue(fieldName);
    return (
      <LocalizationProvider dateAdapter={ AdapterDateFns } locale={ fiLocale }>
        <DatePicker
          value={ value ? new Date(value as string) : null }
          onChange={ handleDateChange }
          views={["day", "month", "year"]}
          renderInput={ params =>
            <TextField label={ strings.formComponent.dateTimePicker } { ...params }/>
          }
        />
      </LocalizationProvider>
    );
  };

  /**
   * Method for setting datetime
   */
  const renderDatetimePicker = (fieldName: string) => {
    const value = getFieldValue(fieldName);
    return (
      <LocalizationProvider dateAdapter={ AdapterDateFns } locale={ fiLocale }>
        <DateTimePicker
          value={ value ? new Date(value as string) : null }
          onChange={ handleDateTimeChange }
          renderInput={ params =>
            <TextField label={ strings.formComponent.dateTimePicker } { ...params }/>
          }
        />
      </LocalizationProvider>
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