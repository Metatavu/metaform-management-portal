/* eslint-disable */ // Remove when refactoring is done
import { LinearProgress, Slider, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformFieldSourceType, MetaformFieldType, Reply } from "generated/client";
import { FileFieldValueItem, ValidationErrors, FieldValue, FileFieldValue } from "../../metaform-react/types";
import React from "react";
import FormContainer from "styled/generic/form";
import MetaformUtils from "utils/form-editor-utils";
import strings from "localization/strings";
import DatePicker from "@mui/lab/DatePicker";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import fiLocale from "date-fns/locale/fi";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { MetaformComponent } from "metaform-react/MetaformComponent";
import { AccessToken, Dictionary, SignedToken } from "types";
import { selectKeycloak } from "features/auth-slice";
import Api from "api";
import { useAppSelector } from "app/hooks";
import Config from "app/config";
import { ErrorContext } from "components/contexts/error-handler";
import json from "4f735ca3-7e94-4578-a7dd-82c7e0cb0ca1.json";
import FormUtils from "utils/form-utils";

const AUTOSAVE_COOLDOWN_IN_MILLISECONDS = 500;

/**
 * Interface for component props
 */
interface Props {
  contexts: string[];
  metaform: Metaform;
  accessToken?: AccessToken;
  ownerKey?: string;
  getFieldValue: (fieldName: string) => FieldValue;
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
  onSubmit: (source: Metaform) => void;
  onValidationErrorsChange?: (validationErrors: ValidationErrors) => void;
  accessTokenNotValid?: boolean;
}

/**
 * Form component
 */
const Form: React.FC = (props) => {
  const errorContext = React.useContext(ErrorContext);
  const accessToken = useAppSelector(selectKeycloak);

  const [ autosaving, setAutosaving ] = React.useState<boolean>(false);
  const [ contexts, setContexts ] = React.useState<string[]>(["FORM"]);
  const [ draftId, setDraftId ] = React.useState<string | null>(null);
  const [ draftSaveVisible, setDraftSaveVisible ] = React.useState<boolean>(false);
  const [ formValues, setFormValues ] = React.useState<Dictionary<FieldValue>>({});
  const [ formValid, setFormValid ] = React.useState<boolean>(false);
  const [ formValueChangeTimeout, setFormValueChangeTimeout ] = React.useState<any>(null);
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ metaform, setMetaform ] = React.useState<Metaform>(MetaformUtils.jsonToMetaform(json));
  const [ ownerKey, setOwnerKey ] = React.useState<string | undefined>(undefined);
  const [ replyDeleteVisible, setReplyDeleteVisible ] = React.useState<boolean>(false);
  const [ redirectTo, setRedirectTo ] = React.useState<string>();
  const [ reply, setReply ] = React.useState<Reply>();
  const [ saving, setSaving ] = React.useState<boolean>(false);
  const [ savedVisible, setSavedVisible ] = React.useState<boolean>(false);
  const [ uploadingFields, setUploadingFields ] = React.useState<string[]>([]);
  const [ uploading, setUploading ] = React.useState<boolean>(false);

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
   * Performs file upload request
   * 
   * @param fieldName field name
   * @param file file to upload
   * @param path upload path
   */
  const doUpload = (fieldName: string, file: File, path: string) => {
    const { getFieldValue } = this.props;
    
    setUploadingFields([ ...uploadingFields, fieldName ]);
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
        url: FormUtils.createDefaultFileUrl(data.fileRef)
      } as FileFieldValueItem;
      (currentFiles as FileFieldValue).files.push(value);
      setFieldValue(fieldName, {...currentFiles as FileFieldValue});
      setUploadingFields([ ...uploadingFields.filter(f => f !== fieldName) ]);
    })
    .catch((e) => {
      setUploadingFields([ ...uploadingFields.filter(f => f !== fieldName) ]);
    })
  };

  /**
   * Deletes uploaded file
   * Only unsecure (not yet persisted) files can be deleted, otherwise they are just removed from data
   *
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
    if (!value.persisted) {
      fetch(FormUtils.createDefaultFileUrl(value.id), { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            console.log("Deleted from server");
          }
        })
      }
    } ;

  /**
   * Shows uploaded file
   * 
   * @param fieldName field name
   * @param value uploaded value
   */
  const showFile = async (fieldName: string, value: FileFieldValueItem) => {
    if (!value.persisted) {
      window.open(value.url, "blank");
      return
    }
    if (accessToken) {
      const attachmentApi = Api.getAttachmentsApi(accessToken);
      const data = await attachmentApi.findAttachmentData({attachmentId: value.id, ownerKey: ownerKey});
      MetaformUtils.downloadBlob(data, value.name || "attachment");
    }
  };

  /*************************************** */

  /**
   * Finds the draft from API
   * 
   * @param draftId draft id
   * @returns found draft or null if not found
   */
  const findDraft = async (draftId: string) => {
    if (!accessToken) {
      return null;
    };

    try {
      const metaformId = Config.getMetaformId();
      
      const draftApi = Api.getDraftsApi(accessToken);
      return await draftApi.findDraft({
        metaformId: metaformId,
        draftId: draftId
      });
    } catch (e) {
      return null;
    }
  }

  /**
   * Creates new reply
   * 
   * @param metaform metaform
   * @returns created reply
   */
  const createReply = async (metaform: Metaform) => {
    if (!accessToken) {
      return;
    }
    const repliesApi = Api.getRepliesApi(accessToken.token);
    
    return await repliesApi.createReply({
      metaformId: Config.getMetaformId(),
      reply: {
        data: getFormValues(metaform)
      },
      replyMode: Config.getReplyMode()
    });
  }

    /**
   * Processes reply from server into form that is understood by ui
   * 
   * @param metaform metaform that is being viewed
   * @param reply reply loaded from server
   * @param ownerKey owner key for the reply
   * 
   * @return data processes to be used by ui
   */
    const processReplyData = async (metaform: Metaform, reply: Reply, ownerKey: string) => {
      if (!accessToken) {
        return;
      }
      
      const attachmentsApi = Api.getAttachmentsApi(accessToken);
      let values = reply.data;
      for (let i = 0; i < (metaform.sections || []).length; i++) {
        let section = metaform.sections && metaform.sections[i] ? metaform.sections[i] : undefined;
        if (section) {
          for (let j = 0; j < (section.fields || []).length; j++) {
            let field = section.fields && section.fields[j] ? section.fields[j] : undefined;
            if (field &&
                field.type === MetaformFieldType.Files &&
                values &&
                field.name &&
                values[field.name]) {
              let fileIds = Array.isArray(values[field.name]) ? values[field.name] : [values[field.name]]; 
              let attachmentPromises = (fileIds as string[]).map((fileId) => {
                return attachmentsApi.findAttachment({attachmentId: fileId, ownerKey: ownerKey});
              });
              let attachments = await Promise.all(attachmentPromises);
              values[field.name] = {
                files: attachments.map((a) => {
                  return {
                    name: a.name,
                    id: a.id,
                    persisted: true
                  }
                })
              };
            }
          }
        }
      }
      return values;
    }

  /**
   * Saves the reply
   */
  const saveReply = async () => {
    let newReply = reply;

    if (!metaform || !metaform.id) {
      return;
    }

    setSaving(true);

    try {
      if (newReply && newReply.id && ownerKey) {
        newReply = await updateReply(metaform, newReply, ownerKey);
        setReply(newReply);
      } else {
        newReply = await createReply(metaform);
        setReply(newReply);
      }

      const updatedOwnerKey = ownerKey || newReply?.ownerKey;
      let updatedValues = newReply?.data;
      if (updatedOwnerKey && newReply) {
        updatedValues = await processReplyData(metaform, newReply, updatedOwnerKey);
      }
      setSaving(false);
      setSavedVisible(true);
      setReply(newReply);
      setOwnerKey(updatedOwnerKey);
      setFormValues(updatedValues as any);
    } catch (error) {
      setSaving(false);
      errorContext.setError(strings.errorHandling.form.saveReply, error); 
    };
  }

  /**
   * Method for submitting form
   */
  const onSubmit = async () => {
    await saveReply();
  };

  /**
   * Event handler for validation errors change
   * 
   * @param validationErrors validation errors
   */
  const onValidationErrorsChange = (validationErrors: ValidationErrors) => {
    const isFormValid = Object.keys(validationErrors).length === 0;

    if (isFormValid !== formValid) {
      setFormValid(isFormValid);

      if (formValid && metaform?.autosave) {
        scheduleAutosave();
      }
    }
  }

  /**
   * Returns form values as map
   * 
   * @param metaform metaform
   * @returns form values as map
   */
  const getFormValues = (metaform: Metaform): { [ key: string]: object } => {
    const values = { ...formValues };

    metaform.sections?.forEach((section) => {
      section.fields?.forEach((field) => {
        if (field.type === MetaformFieldType.Files) {
          let value = getFieldValue(field.name as string);
          if (!value) {
            value = { files: [] }
          }
          values[field.name as string] = (value as FileFieldValue).files.map(file => file.id);
        } 
      })
    });

    return values as { [ key: string]: object };
  }

  /**
   * Updates existing reply
   * 
   * @param metaform metaform
   * @param reply reply
   * @param ownerKey owner key
   * @returns updated reply
   */
  const updateReply = async (metaform: Metaform, reply: Reply, ownerKey: string | null | undefined) => {
    if (!accessToken) {
      return;
    }

    const repliesApi = Api.getRepliesApi(accessToken.token);
    
    await repliesApi.updateReply({
      metaformId: Config.getMetaformId(),
      replyId: reply.id!,
      ownerKey: ownerKey || undefined,
      reply: {
        data: getFormValues(metaform)
      }
    });

    return await repliesApi.findReply({
      metaformId: Config.getMetaformId(),
      replyId: reply.id!,
      ownerKey: ownerKey || undefined
    });
  }

  /**
   * Autosaves the form
   */
  const autosave = async () => {
    setFormValueChangeTimeout(null);

    if (!formValid) {
      return;
    }

    if (autosaving) {
      scheduleAutosave();
      return;
    }

    if (!metaform || !metaform.id || !reply) {
      return;
    }

    try {
      setAutosaving(true);

      await updateReply(metaform, reply, ownerKey);        

      setAutosaving(false);
    } catch (error) {
      setAutosaving(false);
      console.log(error); // TODO: Implement error handling
    };
  }

  /**
   * Schedules an autosave. If new autosave is scheduled before given cooldown period 
   * the old autosave is cancelled and replaced with the new one
   */
  const scheduleAutosave = () => {
    if (formValueChangeTimeout) {
      clearTimeout(formValueChangeTimeout);
      setFormValueChangeTimeout(null);
    }

    setFormValueChangeTimeout(setTimeout(autosave, AUTOSAVE_COOLDOWN_IN_MILLISECONDS));
  }

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

      if (formValid && metaform?.autosave) {
        scheduleAutosave();
      }
    }
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
   * Renders autocomplete component
   * TODO: Implement (from metaform-ui) and move this to autocomplete field component
   * @param field field
   * @param readOnly form read only
   * @param value autocomplete form value
   */
  const renderAutocomplete = (field: MetaformField, readOnly: boolean, value: FieldValue) => {
    return (
      <Typography>
        { strings.generic.notImplemented }
      </Typography>
    );
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