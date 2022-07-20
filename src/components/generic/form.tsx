/* eslint-disable */ // Remove when refactoring is done
import { LinearProgress, Slider, TextField, Typography, Snackbar } from "@mui/material";
import { Metaform, MetaformField, Reply } from "generated/client";
import { FileFieldValueItem, ValidationErrors, FieldValue, FileFieldValue } from "../../metaform-react/types";
import React from "react";
import FormContainer from "styled/generic/form";
import MetaformUtils from "utils/metaform-utils";
import strings from "localization/strings";
import DatePicker from "@mui/lab/DatePicker";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import fiLocale from "date-fns/locale/fi";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import MetaformComponent from "metaform-react/MetaformComponent";
import { Dictionary } from "types";

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
  const [ metaform, setMetaform ] = React.useState<Metaform>(MetaformUtils.jsonToMetaform({}));
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
        onChange={ (event: Event, value: number | number[]) => {
          setFieldValue(fieldName, value as number);
        }}
      />
    );
  };

  /**
   * Method for rendering form icons
   * TODO: Implement icons
   */
  const renderIcon = () => (
    <Typography>
      { strings.generic.notImplemented }
    </Typography>
  );

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
   * Creates url with default format for accessing uploaded file
   * TODO: Implement once keycloak is implemented
   * @param id fileRef id
   */
  const createDefaultFileUrl = (id: string) => {
    // return `${Api.createDefaultUploadUrl()}?fileRef=${id}`;
  }

  /**
   * Performs file upload request
   * 
   * @param fieldName field name
   * @param file file to upload
   * @param path upload path
   */
  const doUpload = (fieldName: string, file: File, path: string) => {
    setUploadingFields([...uploadingFields, fieldName]);
    const data = new FormData();
    data.append("file", file);
    fetch(path, {
      method: "POST",
      body: data
    })
    .then(res => res.json())
    .then((data) => {
      let currentFiles = getFieldValue(fieldName);
      if (!currentFiles) {
        currentFiles = { files: [] };
      }
      const value = {
        id: data.fileRef,
        persisted: false,
        name: data.fileName,
        url: createDefaultFileUrl(data.fileRef)
      } as FileFieldValueItem;
      (currentFiles as FileFieldValue).files.push(value);
      setFieldValue(fieldName, {...currentFiles as FileFieldValue});
      setUploadingFields([ ...uploadingFields.filter(f => f !== fieldName) ]);
    })
    .catch((e) => {
      setUploadingFields([ ...uploadingFields.filter(f => f !== fieldName) ]);
    })
  }

  /**
   * Method for uploading a file
   *
   * @param files files
   * @param path path
   */
  const uploadFile = (fieldName: string, files: FileList | File, path: string) => {
    if (files instanceof FileList) {
      for (let i = 0; i < files.length; i++) {
        let item = files.item(i);
        if (item) {
          doUpload(fieldName, item, path);
        }
      }
    } else if (files instanceof File) {
      doUpload(fieldName, files, path);
    }
  };

  /**
   * Deletes uploaded file
   * Only unsecure (not yet persisted) files can be deleted, otherwise they are just removed from data
   * TODO: Implement once keycloak is implemented
   * @param fieldName field name
   * @param value uploaded value
   */
  const deleteFile = (fieldName: string, value: FileFieldValueItem) => {
    let currentFiles = getFieldValue(fieldName);
    if (!currentFiles) {
      currentFiles = { files: [] };
    }
    const files = (currentFiles as FileFieldValue).files.filter(f => f.id !== value.id);
    setFieldValue(fieldName, { files });
    
    //Only unsecured values can be deleted from server
    /* if (!value.persisted) {
      fetch(createDefaultFileUrl(value.id), { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            console.log("Deleted from server");
          }
        })*/
    } 

  /**
   * Shows uploaded file
   * TODO: Implement once keycloak is implemented
   * @param fieldName field name
   * @param value uploaded value
   */
  const showFile = async (fieldName: string, value: FileFieldValueItem) => {
    if (!value.persisted) {
      window.open(value.url, "blank");
      return
    }
    /* if (this.props.accessToken) {
      const attachmentApi = Api.getAttachmentsApi(this.props.accessToken);
      const data = await attachmentApi.findAttachmentData({attachmentId: value.id, ownerKey: this.props.ownerKey});
      MetaformUtils.downloadBlob(data, value.name || "attachment");
    } */
  };

  /**
   * Renders autocomplete component
   * TODO: Implement
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
        onSubmit={ onSubmit }
        onValidationErrorsChange={ onValidationErrorsChange }
        renderBeforeField={(fieldname?: string) => {
          if (fieldname && uploadingFields.indexOf(fieldname) > -1) {
            return (<LinearProgress/>);
          }
        }}
      />
    </FormContainer>
  );
};

export default Form;