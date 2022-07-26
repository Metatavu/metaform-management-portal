import { LinearProgress, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField } from "generated/client";
import { FileFieldValueItem, ValidationErrors, FieldValue, FileFieldValue } from "../../metaform-react/types";
import React from "react";
import FormContainer from "styled/generic/form";
import strings from "localization/strings";
import DatePicker from "@mui/lab/DatePicker";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import fiLocale from "date-fns/locale/fi";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import MetaformComponent from "metaform-react/MetaformComponent";
import Api from "api";
import { useApiClient } from "app/hooks";
import moment from "moment";
import MetaformUtils from "utils/metaform-utils";
import FormAutocomplete from "./form-autocomplete";

/**
 * Component props
 */
interface Props {
  contexts: string[];
  metaform: Metaform;
  ownerKey?: string;
  getFieldValue: (fieldName: string) => FieldValue;
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
  onSubmit: (source: Metaform) => void;
  onValidationErrorsChange?: (validationErrors: ValidationErrors) => void;
}

/**
 * Form component
 */
const Form: React.FC<Props> = ({
  contexts,
  metaform,
  ownerKey,
  getFieldValue,
  setFieldValue,
  onValidationErrorsChange,
  onSubmit
}) => {
  const [ uploadingFields, setUploadingFields ] = React.useState<string[]>([]);

  const apiClient = useApiClient(Api.getApiClient);

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
  const handleDateChange = (date: Date | null, fieldName: string) => {
    setFieldValue(fieldName, date ? moment(date).format("YYYY-MM-DD") : null);
  };

  /**
   * Event handler for datetime change
   */
  const handleDateTimeChange = (date: Date | null, fieldName: string) => {
    setFieldValue(fieldName, date ? moment(date).toISOString() : null);
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
          onChange={ (date: Date | null) => handleDateChange(date, fieldName) }
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
          onChange={ (date: Date | null) => handleDateTimeChange(date, fieldName) }
          renderInput={ params =>
            <TextField label={ strings.formComponent.dateTimePicker } { ...params }/>
          }
        />
      </LocalizationProvider>
    );
  };

  /**
   * Creates url with default format for accessing uploaded file
   * @param id fileRef id
   */
  const createDefaultFileUrl = (id: string) => {
    return `${Api.createDefaultUploadUrl()}?fileRef=${id}`;
  };

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
      .then(responseData => {
        let currentFiles = getFieldValue(fieldName);
        if (!currentFiles) {
          currentFiles = { files: [] };
        }
        const value = {
          id: responseData.fileRef,
          persisted: false,
          name: responseData.fileName,
          url: createDefaultFileUrl(responseData.fileRef)
        } as FileFieldValueItem;
        (currentFiles as FileFieldValue).files.push(value);
        setFieldValue(fieldName, { ...currentFiles as FileFieldValue });
        setUploadingFields([ ...uploadingFields.filter(f => f !== fieldName) ]);
      })
      .catch(() => {
        setUploadingFields([ ...uploadingFields.filter(f => f !== fieldName) ]);
      });
  };

  /**
   * Method for uploading a file
   *
   * @param files files
   * @param path path
   */
  const uploadFile = (fieldName: string, files: FileList | File, path: string) => {
    if (files instanceof FileList) {
      for (let i = 0; i < files.length; i++) {
        const item = files.item(i);
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
   * @param fieldName field name
   * @param value uploaded value
   */
  const deleteFile = (fieldName: string, value: FileFieldValueItem) => {
    let currentFiles = getFieldValue(fieldName);
    if (!currentFiles) {
      currentFiles = { files: [] };
    }
    const files = (currentFiles as FileFieldValue).files.filter(f => f.id !== value.id);
    setFieldValue(fieldName, { files: files });
    
    if (!value.persisted) {
      fetch(createDefaultFileUrl(value.id), { method: "DELETE" });
    }
  };

  /**
   * Shows uploaded file
   * @param value uploaded value
   */
  const showFile = async (value: FileFieldValueItem) => {
    if (!value.persisted) {
      window.open(value.url, "blank");
      return;
    }

    const { attachmentsApi } = apiClient;
    const data = await attachmentsApi.findAttachmentData({ attachmentId: value.id, ownerKey: ownerKey });
    MetaformUtils.downloadBlob(data, value.name || "attachment");
  };

  /**
   * Renders autocomplete component
   * 
   * @param field field
   * @param formReadOnly form read only
   * @param value autocomplete form value
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, require-jsdoc
  const renderAutocomplete = (field: MetaformField, readOnly: boolean, value: FieldValue) => {
    return (
      <FormAutocomplete
        field={ field }
        metaform={ metaform }
        setFieldValue={ setFieldValue }
        disabled={ readOnly }
        value={ value }
      />
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