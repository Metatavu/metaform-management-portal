/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { useEffect, useState } from "react";
import BasicLayout, { SnackbarMessage } from "components/layouts/basic-layout";
import strings from "localization/strings";
import { Metaform, Reply } from "generated/client";
import { FieldValue, ValidationErrors } from "metaform-react/types";
import { Dictionary } from "@reduxjs/toolkit";
import { Alert, Link, Snackbar } from "@mui/material";
import MetaformUtils from "utils/metaform-utils";
import Mail from "mail/mail";
import ConfirmDialog from "components/generic/confirm-dialog";
import EmailDialog from "components/generic/email-dialog";
import Form from "components/generic/form";

/**
 * Component props
 */
interface Props {
}

/**
 * Component for exhibitions screen
 */
const FormScreen: React.FC<Props> = () => {
  const [ , setLoading ] = useState(false);
  const [ , setSaving ] = useState(false);
  const [ , setSnackbarMessage ] = useState<SnackbarMessage>();

  const [ , setReplyConfirmVisible ] = useState(false);
  const [ accessTokenNotValid ] = useState(true);
  const [ metaform ] = useState<Metaform>();
  const [ ownerKey, setOwnerKey ] = useState<string>();
  const [ formValues, setFormValues ] = useState<Dictionary<FieldValue>>({});
  const [ formValid, setFormValid ] = useState(true);
  const [ draftSaveVisible, setDraftSaveVisible ] = useState(false);
  const [ autosaving ] = useState(false);
  const [ draftSavedVisible, setDraftSavedVisible ] = useState(false);
  const [ reply, setReply ] = useState<Reply>();
  const [ replySavedVisible, setReplySavedVisible ] = useState(false);
  const [ draftId ] = useState<string | null>(null);
  const [ draftEmailDialogVisible, setDraftEmailDialogVisible ] = useState(false);
  const [ replyEmailDialogVisible, setReplyEmailDialogVisible ] = useState(false);
  const [ replyDeleteVisible, setReplyDeleteVisible ] = useState(false);
  const [ replyDeleteConfirmVisible ] = useState(false);

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
   * Implement later
   */
  const saveDraft = async () => {};

  /**
   * Implement later
   */
  const getAccessToken = () => {
    return undefined;
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
   * Method for setting field value
   *
   * @param fieldName field name
   * @param fieldValue field value
   */
  const setFieldValue = (fieldName: string, fieldValue: FieldValue) => {
    if (formValues[fieldName] !== fieldValue) {
      formValues[fieldName] = fieldValue;
      
      setFormValues(formValues);
      setDraftSaveVisible(!!metaform?.allowDrafts);

      if (formValid && metaform?.autosave) {
        /** Implement autosave */
      }
    }
  };

  /**
   * Implement later
   */
  const processReplyData = async () => {
    return {};
  };

  /** 
   * Implement later
   */
  const updateReply = () => {
    return {};
  };

  /** 
   * Implement later
   */
  const createReply = () => {
    return {};
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
        replyToUpdate = await updateReply();
      } else {
        replyToUpdate = await createReply();
      }

      const updatedOwnerKey = ownerKey || reply?.ownerKey;
      let updatedValues = replyToUpdate?.data;
      if (updatedOwnerKey && reply) {
        updatedValues = await processReplyData();
      }

      setSaving(false);
      setReply(reply);
      setOwnerKey(updatedOwnerKey);
      setFormValues(updatedValues as any);
      setReplySavedVisible(true);
    } catch (e) {
      /** Implement error handling */
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
        /**
         * Implement autosave later
         */
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
      /**
       * Implement error handling
       */
    }
  };
  
  /**
   * Implement later
   */
  const deleteReply = async () => {};

  /**
   * Renders the form
   */
  const renderForm = () => {
    if (!metaform) {
      return null;
    }

    const accessToken = getAccessToken();

    return (
      <Form
        accessToken={ accessToken }
        ownerKey={ ownerKey || "" }
        contexts={ ["FORM"] }
        metaform={ metaform }
        getFieldValue={ getFieldValue }
        setFieldValue={ setFieldValue }
        onSubmit={ saveReply }
        onValidationErrorsChange={ onValidationErrorsChange }
        accessTokenNotValid={ accessTokenNotValid }
      />
    );
  };

  /**
   * Renders draft save dialog
   */
  const renderDraftSave = () => {
    return (
      <Snackbar open={ draftSaveVisible } onClose={ () => setDraftSaveVisible(false) }>
        <Alert onClose={ () => setDraftSaveVisible(false) } severity="info">
          <span>
            {" "}
            { strings.formScreen.saveDraft }
            {" "}
          </span>
          <Link href="#" onClick={ saveDraft }>
            {" "}
            { strings.formScreen.saveDraftLink }
            {" "}
          </Link>
        </Alert>
      </Snackbar>
    );
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

      setLoading(false);
      setSnackbarMessage({
        message: strings.formScreen.draftEmailSent,
        severity: "success"
      });
    } catch (e) {
      /**
       * Implement error handling
       */
    }
  };

  /**
   * Renders draft saved dialog
   */
  const renderDraftSaved = () => {
    const draftLink = getDraftLink();

    if (!draftLink) {
      return null;
    }

    return (
      <Snackbar open={ draftSavedVisible } onClose={ () => setDraftSavedVisible(false) } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={ () => setDraftSavedVisible(false) } severity="success">
          <span>
            {" "}
            { strings.formScreen.draftSaved }
            {" "}
          </span>
          <br/>
          <br/>
          <a href={ draftLink }>
            {" "}
            { draftLink }
            {" "}
          </a>
          <p>
            { strings.formScreen.draftEmailText }
            <Link href="#" onClick={ onDraftEmailLinkClick }>
              {" "}
              { strings.formScreen.draftEmailLink }
              {" "}
            </Link>
          </p>
        </Alert>
      </Snackbar>
    );
  };

  /**
   * Renders autosave dialog
   */
  const renderAutosaving = () => {
    return (
      <Snackbar open={ autosaving }>
        <Alert severity="info">
          <span>
            {" "}
            { strings.formScreen.autosaving }
            {" "}
          </span>
        </Alert>
      </Snackbar>
    );
  };

  /**
   * Finish later
   */
  const renderDraftEmailDialog = () => {
    return (
      <EmailDialog
        text={ strings.formScreen.draftEmailDialogText }
        open={ draftEmailDialogVisible }
        onSend={ sendDraftEmail }
        onCancel={ () => setDraftEmailDialogVisible(false) }
      />
    );
  };

  /**
   * Renders reply saved dialog
   */
  const renderReplySaved = () => {
    const replyEditLink = getReplyEditLink();

    if (replyEditLink) {
      return (
        <Snackbar open={ replySavedVisible } onClose={ () => setReplySavedVisible(false) } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={ () => setReplySavedVisible(false) } severity="success">
            <span>
              {" "}
              { strings.formScreen.replySaved }
              {" "}
            </span>
            <p>
              {" "}
              { strings.formScreen.replyEdit }
              {" "}
            </p>
            <div style={{
              textOverflow: "ellipsis", overflow: "hidden", maxWidth: "50vw", whiteSpace: "nowrap"
            }}
            >
              <a href={ replyEditLink }>
                {" "}
                { replyEditLink }
                {" "}
              </a>
            </div>
            <p>
              { strings.formScreen.replyEditEmailText }
              <Link href="#" onClick={ onReplyEmailLinkClick }>
                {" "}
                { strings.formScreen.replyEditEmailLink }
                {" "}
              </Link>
            </p>
          </Alert>
        </Snackbar>
      );
    }
    return (
      <Snackbar open={ replySavedVisible } onClose={ () => setReplySavedVisible(false) } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={ () => setReplySavedVisible(false) } severity="success">
          <span>
            {" "}
            { strings.formScreen.replySaved }
            {" "}
          </span>
        </Alert>
      </Snackbar>
    );
  };

  /**
   * Renders reply email dialog
   */
  const renderReplyEmailDialog = () => {
    return (
      <EmailDialog
        text={ strings.formScreen.replyEditEmailDialogText }
        open={ replyEmailDialogVisible }
        onSend={ sendReplyEmail }
        onCancel={ () => setReplyEmailDialogVisible(false) }
      />
    );
  };

  /**
   * Renders reply delete dialog
   */
  const renderReplyDelete = () => {
    return (
      <Snackbar open={ replyDeleteVisible } onClose={ () => setReplyDeleteVisible(false) }>
        <Alert onClose={ () => setReplyDeleteVisible(false) } severity="warning">
          <span>
            {" "}
            { strings.formScreen.replyDeleteText }
            {" "}
          </span>
          <Link href="#" onClick={ () => setReplyConfirmVisible(true) }>
            {" "}
            { strings.formScreen.replyDeleteLink }
            {" "}
          </Link>
        </Alert>
      </Snackbar>
    );
  };

  /**
   * Renders delete reply confirm dialog
   */
  const renderReplyDeleteConfirm = () => {
    return (
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
    );
  };

  /**
   * Implement later
   */
  const renderLogoutLink = () => {};

  /**
   * Implement when Keycloak and API connected to the project
   */
  const setup = async () => {};

  useEffect(() => {
    setup();
  }, []);

  return (
    /**
     * Implement layout later
     */
    <BasicLayout>
      <div>
        { renderForm() }
        { renderReplySaved() }
        { renderReplyEmailDialog() }
        { renderReplyDelete() }
        { renderReplyDeleteConfirm() }
        { renderDraftSave() }
        { renderDraftSaved() }
        { renderDraftEmailDialog() }
        { renderAutosaving() }
        { renderLogoutLink() }
      </div>
    </BasicLayout>
  );
};

export default FormScreen;