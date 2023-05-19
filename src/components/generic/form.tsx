import { LinearProgress, TextField, Icon, InputAdornment } from "@mui/material";
import { Metaform, MetaformField } from "generated/client";
import { FileFieldValueItem, ValidationErrors, FieldValue, FileFieldValue, IconName } from "../../metaform-react/types";
import React from "react";
import { FormContainer, FormLayout } from "styled/generic/form";
import strings from "localization/strings";
import fiLocale from "date-fns/locale/fi";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MetaformComponent from "metaform-react/MetaformComponent";
import Api from "api";
import { useApiClient } from "app/hooks";
import moment from "moment";
import MetaformUtils from "utils/metaform-utils";
import FormAutocomplete from "./form-autocomplete";
import { LocalizationProvider, DatePicker, MobileDateTimePicker } from "@mui/x-date-pickers";
import { Dictionary } from "types";
import { DateRange } from "@mui/icons-material";
import { FormLogo } from "styled/layout-components/header";

/**
 * Component props
 */
interface Props {
  contexts: string[];
  metaform: Metaform;
  ownerKey?: string;
  titleColor?: string;
  formValues?: Dictionary<FieldValue>;
  getFieldValue: (fieldName: string) => FieldValue;
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
  onSubmit: (source: Metaform) => void;
  onValidationErrorsChange?: (validationErrors: ValidationErrors) => void;
  saving?: boolean;
  isReply?: boolean;
}

/**
 * Form component
 */
const Form: React.FC<Props> = ({
  contexts,
  metaform,
  ownerKey,
  saving,
  titleColor,
  formValues,
  isReply,
  getFieldValue,
  setFieldValue,
  onValidationErrorsChange,
  onSubmit
}) => {
  const [ uploadingFields, setUploadingFields ] = React.useState<string[]>([]);

  const apiClient = useApiClient(Api.getApiClient);
  /**
   * Method for rendering form icons
   * @param icon Icon
   * @param key IconKey
   */
  const renderIcon = (icon: IconName, key: string) => {
    return (
      <Icon key={ key }>{ icon }</Icon>
    );
  };

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
   * Checks whether past days should be disabled for given date/date-time field
   * 
   * @param field field
   * @returns Whether past days should be disabled or not
   */
  const checkDisablePastDays = (field: MetaformField) => {
    if (field.allowPastDays === undefined) {
      return false;
    }
    
    return !field.allowPastDays;
  };

  /**
   * Renders date picker with disabled past dates and disabled current date 
   *
   * @param field field
   */
  const renderDatePicker = (field: MetaformField) => {
    const fieldName = field.name || "";
    const value = getFieldValue(fieldName);

    return (
      <LocalizationProvider dateAdapter={ AdapterDateFns } locale={ fiLocale }>
        <DatePicker
          disablePast={ checkDisablePastDays(field) }
          label={ strings.formComponent.datePicker }
          aria-label={ fieldName }
          shouldDisableDate={ MetaformUtils.shouldDisableHolidays(field.workdaysOnly || false) }
          value={ value ? new Date(value as string) : null }
          onChange={ (date: Date | null) => handleDateChange(date, fieldName) }
          views={["day", "month", "year"]}
          InputProps={{
            style: {
              height: 50,
              borderRadius: 0
            }
          }}
          renderInput={ params =>
            <TextField
              { ...params }
              label={ strings.formComponent.datePicker }
              InputLabelProps={{
                style: {
                  top: 5
                }
              }}
            />
          }
        />
      </LocalizationProvider>
    );
  };

  /**
   * Renders date time picker with disabled past dates and disabled current date 
   */
  const renderDatetimePicker = (field: MetaformField) => {
    const fieldName = field.name || "";
    const value = getFieldValue(fieldName);

    return (
      <LocalizationProvider dateAdapter={ AdapterDateFns } locale={ fiLocale }>
        <MobileDateTimePicker
          disablePast={ checkDisablePastDays(field) }
          aria-label={ fieldName }
          shouldDisableDate={ MetaformUtils.shouldDisableHolidays(field.workdaysOnly || false) }
          value={ value ? new Date(value as string) : null }
          onChange={ (date: Date | null) => handleDateTimeChange(date, fieldName) }
          InputProps={{
            style: {
              height: 50,
              borderRadius: 0
            },
            endAdornment: (
              <InputAdornment position="end">
                <DateRange/>
              </InputAdornment>
            )
          }}
          renderInput={ params =>
            <TextField
              { ...params }
              label={ strings.formComponent.dateTimePicker }
              InputLabelProps={{
                style: {
                  top: 5
                }
              }}
            />
          }
        />
      </LocalizationProvider>
    );
  };

  /**
   * Creates url with default format for accessing uploaded file
   * 
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
  const uploadFile = (fieldName: string, files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const item = files.item(i);
      if (item) {
        doUpload(fieldName, item, Api.createDefaultUploadUrl());
      }
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
    const img = URL.createObjectURL(data);
    window.open(img);

    /* Download image */
    /* MetaformUtils.downloadBlob(data, value.name || "attachment"); */
  };

  /**
   * Renders autocomplete component
   *
   * @param field field
   * @param readOnly form read only
   * @param value autocomplete form value
   */
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
      { !isReply && <FormLogo/> }
      <FormLayout>
        <MetaformComponent
          form={ metaform }
          formValues={ formValues }
          contexts={ contexts }
          formReadOnly={ false }
          titleColor={ titleColor }
          getFieldValue={ getFieldValue }
          setFieldValue={ setFieldValue }
          renderDatePicker={ renderDatePicker }
          renderDatetimePicker={ renderDatetimePicker }
          renderAutocomplete={ renderAutocomplete }
          uploadFile={ uploadFile }
          onFileDelete={ deleteFile }
          onFileShow={ showFile }
          renderIcon={ renderIcon }
          onSubmit={ onSubmit }
          saving={ saving }
          onValidationErrorsChange={ onValidationErrorsChange }
          renderBeforeField={(fieldname?: string) => {
            if (fieldname && uploadingFields.indexOf(fieldname) > -1) {
              return (<LinearProgress/>);
            }
          }}
        />
      </FormLayout>
    </FormContainer>
  );
};

export default Form;