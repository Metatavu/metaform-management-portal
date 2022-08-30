/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { useEffect, useState } from "react";
import BasicLayout, { SnackbarMessage } from "components/layouts/basic-layout";
import strings from "localization/strings";
import { Metaform, MetaformFieldType, Reply } from "generated/client";
import { FieldValue, FileFieldValue, ValidationErrors } from "metaform-react/types";
import MetaformUtils from "utils/metaform-utils";
import Mail from "mail/mail";
import ConfirmDialog from "components/generic/confirm-dialog";
import EmailDialog from "components/generic/email-dialog";
import Form from "components/generic/form";
import ReplySaved from "./form/ReplySaved";
import ReplyEmailDialog from "./form/ReplyEmailDialog";
import ReplyDelete from "./form/ReplyDelete";
import Autosaving from "./form/Autosaving";
import DraftSaveDialog from "./form/DraftSaveDialog";
import DraftSavedDialog from "./form/DraftSavedDialog";
import { ErrorContext } from "components/contexts/error-handler";
import Api from "api";
import { useApiClient, useAppSelector } from "app/hooks";
import { selectKeycloak } from "features/auth-slice";
import { Dictionary } from "types";
import { useParams } from "react-router-dom";

/**
 * Component props
 */
interface Props {
}

/**
 * Component for exhibitions screen
 */
const FormScreen: React.FC<Props> = () => {
  const AUTOSAVE_COOLDOWN = 500;

  const errorContext = React.useContext(ErrorContext);

  const [ , setLoading ] = useState(false);
  const [ savingReply, setSaving ] = useState(false);
  const [ , setSnackbarMessage ] = useState<SnackbarMessage>();
  const [ , setReplyConfirmVisible ] = useState(false);
  const [ metaform, setMetaform ] = useState<Metaform>(MetaformUtils.jsonToMetaform({}));
  const [ ownerKey, setOwnerKey ] = useState<string | null>();
  const [ formValues, setFormValues ] = useState<Dictionary<FieldValue>>({});
  const [ formValid, setFormValid ] = useState(true);
  const [ draftSaveVisible, setDraftSaveVisible ] = useState(false);
  const [ autosaving, setAutosaving ] = useState(false);
  const [ draftSavedVisible, setDraftSavedVisible ] = useState(false);
  const [ reply, setReply ] = useState<Reply>();
  const [ replySavedVisible, setReplySavedVisible ] = useState(false);
  const [ draftId, setDraftId ] = useState<string | null>(null);
  const [ draftEmailDialogVisible, setDraftEmailDialogVisible ] = useState(false);
  const [ replyEmailDialogVisible, setReplyEmailDialogVisible ] = useState(false);
  const [ replyDeleteVisible, setReplyDeleteVisible ] = useState(false);
  const [ replyDeleteConfirmVisible, setReplyDeleteConfirmVisble ] = useState(false);
  const [ formValueChangeTimeout, setFormValueChangeTimeout ] = useState<NodeJS.Timeout>();
  const [ metaformId, setMetaformId ] = useState<string>();
  const params = useParams();
  const { metaformSlug } = params;

  const apiClient = useApiClient(Api.getApiClient);
  const keycloak = useAppSelector(selectKeycloak);

  /**
   * Finds the reply from API
   *
   * @param replyId reply id
   * @param currentOwnerKey owner key
   * @returns found reply or null if not found
   */
  const findReply = async (replyId: string, currentOwnerKey: string) => {
    try {
      const replyApi = apiClient.repliesApi;
      return await replyApi.findReply({
        metaformId: metaformId!!,
        replyId: replyId,
        ownerKey: currentOwnerKey
      });
    } catch (e) {
      return null;
    }
  };

  /**
   * Finds the draft from API
   *
   * @param draftToFindId draft id
   * @returns found draft or null if not found
   */
  const findDraft = async (draftToFindId: string) => {
    try {
      const { draftsApi } = apiClient;
      return await draftsApi.findDraft({
        metaformId: metaformId!!,
        draftId: draftToFindId
      });
    } catch (e) {
      return null;
    }
  };

  /**
   * Loads data
   */
  const loadData = async () => {
    const query = new URLSearchParams(location.search);

    setDraftId(query.get("draft"));
    const replyId = query.get("reply");
    const currentOwnerKey = query.get("owner-key");

    if (!metaformSlug) {
      return;
    }

    try {
      setLoading(true);
      const { metaformsApi } = apiClient;

      const foundMetaform = await metaformsApi.findMetaform({
        metaformSlug: metaformSlug
      });

      document.title = foundMetaform.title ? foundMetaform.title : "Metaform";

      const preparedFormValues = MetaformUtils.prepareFormValues(foundMetaform, formValues, keycloak);

      if (replyId && currentOwnerKey) {
        const foundReply = await findReply(replyId, currentOwnerKey);
        if (foundReply) {
          const replyData = await MetaformUtils.processReplyData(foundMetaform, foundReply, apiClient.attachmentsApi, currentOwnerKey);
          if (replyData) {
            Object.keys(replyData as any).forEach(replyKey => {
              preparedFormValues[replyKey] = replyData[replyKey] as any;
            });
          }

          setReply(foundReply);
          setOwnerKey(currentOwnerKey);
          setReplyDeleteVisible(!!currentOwnerKey);
        } else {
          setSnackbarMessage({
            message: strings.formScreen.replyNotFound,
            severity: "error"
          });
        }
      } else if (draftId) {
        const draft = await findDraft(draftId);
        const draftData = draft?.data || {};
        Object.keys(draftData).forEach(draftKey => {
          formValues[draftKey] = draftData[draftKey] as any;
        });
      }

      setMetaformId(foundMetaform.id);
      setMetaform(foundMetaform);
      setFormValues(preparedFormValues);
    } catch (e) {
      errorContext.setError(strings.errorHandling.formScreen.findMetaform, e);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Returns reply edit link
   *
   * @returns reply edit link or null if not available
   */
  const getReplyEditLink = () => {
    if (!reply?.id || !ownerKey) {
      return null;
    }

    return MetaformUtils.createOwnerKeyLink(reply.id, ownerKey);
  };

  /**
   * Saves the current draft
   */
  const saveDraft = async () => {
    try {
      if (!metaform || !metaform.id) {
        return;
      }

      setLoading(true);
      setDraftSaveVisible(false);

      const { draftsApi } = apiClient;
      let draft;

      if (draftId) {
        draft = await draftsApi.updateDraft({
          metaformId: metaform.id,
          draftId: draftId,
          draft: {
            data: formValues as any
          }
        });
      } else {
        draft = await draftsApi.createDraft({
          metaformId: metaform.id,
          draft: {
            data: formValues as any
          }
        });
      }

      setDraftId(draft.id!);
      setDraftSaveVisible(true);
    } catch (e) {
      errorContext.setError(strings.errorHandling.formScreen.saveDraft, e);
    }

    setLoading(false);
  };

  /**
   * Method for getting field value
   *
   * @param fieldName field name
   */
  const getFieldValue = (fieldName: string): FieldValue => {
    return formValues[fieldName] || null;
  };

  /**
   * Returns form values as map
   *
   * @param currentMetaform metaform
   * @returns form values as map
   */
  const getFormValues = (currentMetaform: Metaform): { [ key: string]: object } => {
    const values = { ...formValues };

    currentMetaform.sections?.forEach(section => {
      section.fields?.forEach(field => {
        if (field.type === MetaformFieldType.Files) {
          let value = getFieldValue(field.name as string);
          if (!value) {
            value = { files: [] };
          }
          values[field.name as string] = (value as FileFieldValue).files.map(file => file.id);
        }
      });
    });

    return values as { [ key: string]: object };
  };

  /**
   * Implement later
   */
  const updateReply = async (currentMetaform: Metaform, currentReply: Reply, currentOwnerKey: string | null | undefined) => {
    const { repliesApi } = apiClient;

    await repliesApi.updateReply({
      metaformId: metaformId!!,
      replyId: currentReply.id!,
      ownerKey: currentOwnerKey || undefined,
      reply: {
        data: getFormValues(currentMetaform)
      }
    });

    return repliesApi.findReply({
      metaformId: metaformId!!,
      replyId: currentReply.id!,
      ownerKey: currentOwnerKey || undefined
    });
  };

  /**
   * Autosaves the form
   */
  const autosave = async () => {
    setFormValueChangeTimeout(undefined);

    if (!formValid) {
      return;
    }

    if (autosaving) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      scheduleAutosave();
      return;
    }

    if (!metaform || !metaform.id || !reply || ownerKey) {
      return;
    }

    try {
      setAutosaving(true);

      await updateReply(metaform, reply, ownerKey);
    } catch (e) {
      errorContext.setError(strings.errorHandling.formScreen.autosave, e);
    }

    setAutosaving(false);
  };

  /**
   * Schedules an autosave. If new autosave is scheduled before given cooldown period
   * the old autosave is cancelled and replaced with the new one
   */
  const scheduleAutosave = () => {
    if (formValueChangeTimeout) {
      clearTimeout(formValueChangeTimeout);
      setFormValueChangeTimeout(undefined);
    }

    const timeout = setTimeout(autosave, AUTOSAVE_COOLDOWN);
    setFormValueChangeTimeout(timeout);
  };

  /**
   * Method for setting field value
   *
   * @param fieldName field name
   * @param fieldValue field value
   */
  const setFieldValue = (fieldName: string, fieldValue: FieldValue) => {
    if (formValues[fieldName] !== fieldValue) {
      setFormValues({ ...formValues, [fieldName]: fieldValue });

      if (formValid && metaform?.autosave) {
        scheduleAutosave();
      }
    }
  };

  /**
   * Creates new reply
   *
   * @param currentMetaform metaform
   */
  const createReply = async (currentMetaform: Metaform) => {
    const { repliesApi } = apiClient;

    return repliesApi.createReply({
      metaformId: metaformId!!,
      reply: {
        data: getFormValues(currentMetaform)
      },
      replyMode: "CUMULATIVE"
    });
  };

  /**
   * Saves the reply
   */
  const saveReply = async () => {
    if (!metaform || !metaform.id) {
      return;
    }
    let replyToUpdate: Reply;
    setSaving(true);

    try {
      if (reply && reply.id && ownerKey) {
        replyToUpdate = await updateReply(metaform, reply, ownerKey);
      } else {
        replyToUpdate = await createReply(metaform);
      }

      const updatedOwnerKey = ownerKey || reply?.ownerKey;
      let updatedValues = replyToUpdate?.data;
      if (updatedOwnerKey && reply) {
        updatedValues = await MetaformUtils.processReplyData(metaform, replyToUpdate, apiClient.attachmentsApi, updatedOwnerKey);
      }

      setSaving(false);
      setReply(replyToUpdate);
      setOwnerKey(updatedOwnerKey);
      setFormValues(updatedValues as any);
      setReplySavedVisible(true);
    } catch (e) {
      errorContext.setError(strings.errorHandling.formScreen.saveReply, e);
    }
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
  };

  /**
   * Sends reply link to given email
   *
   * @param email email
   */
  const sendReplyEmail = async (email: string) => {
    const { REACT_APP_EMAIL_FROM } = process.env;
    const replyEditLink = getReplyEditLink();

    if (!replyEditLink || !metaform) {
      return;
    }

    try {
      setReplyEmailDialogVisible(false);
      setLoading(true);

      if (!REACT_APP_EMAIL_FROM) {
        throw new Error("Missing REACT_APP_EMAIL_FROM env");
      }

      const formTitle = metaform.title || "";
      const subject = strings.formatString(strings.formScreen.replyEditEmailSubject, formTitle) as string;
      const html = strings.formatString(strings.formScreen.replyEditEmailContent, formTitle, replyEditLink) as string;

      await Mail.sendMail({
        from: REACT_APP_EMAIL_FROM,
        html: html,
        subject: subject,
        to: email
      });

      setLoading(false);
      setSnackbarMessage({
        message: strings.formScreen.replyEditEmailSent,
        severity: "success"
      });
    } catch (e) {
      errorContext.setError(strings.errorHandling.formScreen.sendReplyEmail, e);
    }
  };

  /**
   * Deletes the reply
   */
  const deleteReply = async () => {
    try {
      setReplyDeleteConfirmVisble(false);
      setLoading(true);

      const { repliesApi } = apiClient;

      if (reply && reply.id && ownerKey) {
        await repliesApi.deleteReply({
          metaformId: metaformId!!,
          replyId: reply.id,
          ownerKey: ownerKey
        });
      } else {
        throw new Error("Missing parameters, failed to delete reply");
      }

      setReplyDeleteVisible(false);
      setReply(undefined);
      setOwnerKey(null);
      setSnackbarMessage({
        message: strings.formScreen.replyDeleted,
        severity: "success"
      });
    } catch (e) {
      errorContext.setError(strings.errorHandling.formScreen.deleteReply, e);
    }

    setLoading(false);
  };

  /**
   * Returns draft link
   *
   * @returns draft link or null if not available
   */
  const getDraftLink = () => {
    if (!draftId) {
      return null;
    }

    const windowLocation = window.location;
    return (new URL(`${windowLocation.protocol}//${windowLocation.hostname}:${windowLocation.port}${windowLocation.pathname}?draft=${draftId}`)).toString();
  };

  /**
   * Event handler for draft email link click
   */
  const onDraftEmailLinkClick = () => {
    setDraftSavedVisible(false);
    setDraftEmailDialogVisible(true);
  };

  /**
   * Event handler for reply email link click
   */
  const onReplyEmailLinkClick = () => {
    setReplySavedVisible(false);
    setReplyEmailDialogVisible(true);
  };

  /**
   * Sends draft link to given email
   *
   * @param email email
   */
  const sendDraftEmail = async (email: string) => {
    const { REACT_APP_EMAIL_FROM } = process.env;
    const draftLink = getDraftLink();

    if (!draftLink || !metaform) {
      return;
    }

    try {
      setDraftEmailDialogVisible(false);
      setLoading(true);

      if (!REACT_APP_EMAIL_FROM) {
        throw new Error("Missing REACT_APP_EMAIL_FROM env");
      }

      const formTitle = metaform.title || "";
      const subject = strings.formatString(strings.formScreen.draftEmailSubject, formTitle) as string;
      const html = strings.formatString(strings.formScreen.draftEmailContent, formTitle, draftLink) as string;

      await Mail.sendMail({
        from: REACT_APP_EMAIL_FROM,
        html: html,
        subject: subject,
        to: email
      });

      setSnackbarMessage({
        message: strings.formScreen.draftEmailSent,
        severity: "success"
      });
    } catch (e) {
      errorContext.setError(strings.errorHandling.formScreen.sendReplyEmail, e);
    }
  };

  /**
   * Implement later
   */
  const renderLogoutLink = () => {};

  /**
   * Renders the form
   */
  const renderForm = () => {
    if (!metaform) {
      return null;
    }

    return (
      <Form
        ownerKey={ ownerKey || "" }
        contexts={ ["FORM"] }
        metaform={ metaform }
        getFieldValue={ getFieldValue }
        setFieldValue={ setFieldValue }
        onSubmit={ saveReply }
        onValidationErrorsChange={ onValidationErrorsChange }
        saving={ savingReply }
      />
    );
  };

  return (
    /**
     * Implement layout later
     */
    <BasicLayout>
      <div>
        { renderForm() }
        <ReplySaved
          getReplyEditLink={ getReplyEditLink }
          replySavedVisible={ replySavedVisible }
          onReplyEmailLinkClick={ onReplyEmailLinkClick }
          setReplySavedVisible={ setReplySavedVisible }
        />
        <ReplyEmailDialog
          replyEmailDialogVisible={ replyEmailDialogVisible }
          setReplyEmailDialogVisible={ setReplyEmailDialogVisible }
          sendReplyEmail={ sendReplyEmail }
        />
        <ReplyDelete
          replyDeleteVisible={ replyDeleteVisible }
          setReplyConfirmVisible={ setReplyConfirmVisible }
          setReplyDeleteVisible={ setReplyDeleteVisible }
        />
        <ConfirmDialog
          onClose={ () => setReplyConfirmVisible(false) }
          onCancel={ () => setReplyConfirmVisible(false) }
          onConfirm={ deleteReply }
          cancelButtonText={ strings.generic.cancel }
          positiveButtonText={ strings.generic.confirm }
          title={ strings.formScreen.confirmDeleteReplyTitle }
          text={ strings.formScreen.confirmDeleteReplyText }
          open={ replyDeleteConfirmVisible }
        />
        <DraftSaveDialog
          setDraftSaveVisible={ setDraftSaveVisible }
          draftSaveVisible={ draftSaveVisible }
          saveDraft={ saveDraft }
        />
        <DraftSavedDialog
          setDraftSavedVisible={ setDraftSavedVisible }
          draftSavedVisible={ draftSavedVisible }
          getDraftLink={ getDraftLink }
          onDraftEmailLinkClick={ onDraftEmailLinkClick }
        />
        <EmailDialog
          text={ strings.formScreen.draftEmailDialogText }
          open={ draftEmailDialogVisible }
          onSend={ sendDraftEmail }
          onCancel={ () => setDraftEmailDialogVisible(false) }
        />
        <Autosaving autosaving={ autosaving }/>
        { renderLogoutLink() }
      </div>
    </BasicLayout>
  );
};

export default FormScreen;