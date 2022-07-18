/* eslint-disable */
import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";

import { History, Location } from "history";
import BasicLayout, { SnackbarMessage } from "../../layouts/basic-layout";

import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { Metaform, MetaformFieldSourceType, MetaformFieldType, Reply } from "../../../generated/client";
import Form from "../../generic/form";
import strings from "../../../localization/strings";
import EmailDialog from "../../generic/email-dialog";
import ConfirmDialog from "../../generic/confirm-dialog";
import { Snackbar, Alert, withStyles } from "@mui/material";
import { Dictionary } from "@reduxjs/toolkit";
import Config from "app/config";
import { FieldValue, FileFieldValue, ValidationErrors } from "metaform-react/types";
import { Link } from "react-router-dom";
import { SignedToken, AccessToken } from "types";
import Api from "api";
import Mail from "utils/mail-utils";
import FormUtils from "utils/form-utils";

const AUTOSAVE_COOLDOWN = 500;

/**
 * Component props
 */
interface Props {
  history: History;
  location: Location;
  keycloak: KeycloakInstance;
  signedToken?: SignedToken;
  anonymousToken?: AccessToken;
}

/**
 * Component state
 */
interface State {
  snackbarMessage?: SnackbarMessage;
  error?: string | Error | Response | unknown;
  loading: boolean;
  saving: boolean;
  autosaving: boolean;
  formValid: boolean;
  draftSavedVisible: boolean;
  draftSaveVisible: boolean;
  draftEmailDialogVisible: boolean;
  draftId: string | null;
  replySavedVisible: boolean;
  replyEmailDialogVisible: boolean;
  replyDeleteVisible: boolean;
  replyDeleteConfirmVisible: boolean;
  reply?: Reply;
  ownerKey: string | null;
  metaform?: Metaform;
  formValues: Dictionary<FieldValue>;
  redirectTo?: string;
}

/**
 * Component for exhibitions screen
 */
export class FormScreen extends React.Component<Props, State> {

  private formValueChangeTimeout: any = null;

  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      saving: false,
      autosaving: false,
      formValid: true,
      draftSaveVisible: false,
      draftSavedVisible: false,
      draftEmailDialogVisible: false,
      replySavedVisible: false,
      replyEmailDialogVisible: false,
      replyDeleteVisible: false,
      replyDeleteConfirmVisible: false,
      draftId: null,
      ownerKey: null,
      formValues: {}
    };
  }

  /**
   * Component did mount life cycle event
   */
  public async componentDidMount() {
    const { location, signedToken } = this.props;

    const accessToken = this.getAccessToken();
    const query = new URLSearchParams(location.search);

    const draftId = query.get("draft");
    const replyId = query.get("reply");
    const ownerKey = query.get("owner-key");

    const metaformId = Config.getMetaformId();

    try {
      this.setState({
        loading: true,
        draftId: draftId
      });

      const metaformsApi = Api.getMetaformsApi(accessToken);

      const metaform = await metaformsApi.findMetaform({
        metaformId: metaformId,
        replyId: replyId || undefined,
        ownerKey: ownerKey || undefined
      });
      
      document.title = metaform.title ? metaform.title : "Metaform";

      const formValues = this.prepareFormValues(metaform);

      if (replyId && ownerKey) {
        const reply = await this.findReply(replyId, ownerKey);
        if (reply) {
          const replyData = await this.processReplyData(metaform, reply, ownerKey);
          if (replyData) {
            Object.keys(replyData as any).forEach(replyKey => {
              formValues[replyKey] = replyData[replyKey] as any;
            });
          }

          this.setState({
            reply: reply,
            ownerKey: ownerKey,
            replyDeleteVisible: !!ownerKey
          });
        } else {
          this.setState({
            snackbarMessage: {
              message: strings.formScreen.replyNotFound,
              severity: "error"
            }
          });
        }
      } else if (draftId) {
        const draft = await this.findDraft(draftId);
        const draftData = draft?.data || {};
        Object.keys(draftData).forEach(draftKey => {
          formValues[draftKey] = draftData[draftKey] as any;
        });
      }

      this.setState({
        metaform: metaform,
        formValues: formValues,
        loading: false
      });
    } catch (e) {
      if (e instanceof Response && e.status === 403 && !signedToken) {
        this.setState({
          redirectTo: "/protected/form"
        });
      } else {
        this.setState({
          loading: false,
          error: e
        });
      }
    }
  }

  /**
   * Component render method
   */
  public render() {
    const { redirectTo, loading, saving, snackbarMessage, error } = this.state;

    return (
      <BasicLayout
        loading={ loading || saving }
        loadMessage={ saving ? strings.formScreen.savingReply : undefined }
        snackbarMessage={ snackbarMessage }
        error={ error }
        redirectTo={ redirectTo }
        clearError={ this.clearError }
        clearSnackbar={ this.clearSnackbar }
      >
        <div>
          { this.renderForm() }
          { this.renderReplySaved() }
          { this.renderReplyEmailDialog() }
          { this.renderReplyDelete() }
          { this.renderReplyDeleteConfirm() }
          { this.renderDraftSave() }
          { this.renderDraftSaved() }
          { this.renderDraftEmailDialog() }
          { this.renderAutosaving() }
          { this.renderLogoutLink() }
        </div>
      </BasicLayout>
    );
  }

  /**
   * Renders the form
   */
  private renderForm = () => {
    const { metaform } = this.state;

    if (!metaform) {
      return null;
    }

    const accessToken = this.getAccessToken();

    return (
      <Form
        accessToken={ accessToken }
        ownerKey={ this.state.ownerKey || "" }
        contexts={ ["FORM"] }
        metaform={ metaform }
        getFieldValue={ this.getFieldValue }
        setFieldValue={ this.setFieldValue }
        onSubmit={ this.onSubmit }
        onValidationErrorsChange={ this.onValidationErrorsChange }
      />
    );
  };

  /**
   * Processes reply from server into form that is understood by ui
   * 
   * @param metaform metaform that is being viewed
   * @param reply reply loaded from server
   * @param ownerKey owner key for the reply
   * 
   * @return data processes to be used by ui
   */
  private processReplyData = async (metaform: Metaform, reply: Reply, ownerKey: string) => {
    const accessToken = this.getAccessToken();
    
    const attachmentsApi = Api.getAttachmentsApi(accessToken);
    const values = reply.data;
    for (let i = 0; i < (metaform.sections || []).length; i++) {
      const section = metaform.sections && metaform.sections[i] ? metaform.sections[i] : undefined;
      if (section) {
        for (let j = 0; j < (section.fields || []).length; j++) {
          const field = section.fields && section.fields[j] ? section.fields[j] : undefined;
          if (field &&
              field.type === MetaformFieldType.Files &&
              values &&
              field.name &&
              values[field.name]) {
            const fileIds = Array.isArray(values[field.name]) ? values[field.name] : [values[field.name]];
            const attachmentPromises = (fileIds as string[]).map(fileId => {
              return attachmentsApi.findAttachment({ attachmentId: fileId, ownerKey: ownerKey });
            });
            const attachments = await Promise.all(attachmentPromises);
            values[field.name] = {
              files: attachments.map(a => {
                return {
                  name: a.name,
                  id: a.id,
                  persisted: true
                };
              })
            };
          }
        }
      }
    }
    return values;
  };

  /**
   * Renders draft save dialog
   */
  private renderDraftSave = () => {
    const { draftSaveVisible } = this.state;

    return (
      <Snackbar open={ draftSaveVisible } onClose={ this.onDraftSaveClose }>
        <Alert onClose={ this.onDraftSaveClose } severity="info">
          <span>
            {" "}
            { strings.formScreen.saveDraft }
            {" "}
          </span>
          <Link to="#" onClick={ this.onSaveDraftLinkClick }>
            {" "}
            { strings.formScreen.saveDraftLink }
            {" "}
          </Link>
        </Alert>
      </Snackbar>
    );
  };

  /**
   * Renders draft saved dialog
   */
  private renderDraftSaved = () => {
    const { draftSavedVisible } = this.state;
    const draftLink = this.getDraftLink();

    if (!draftLink) {
      return null;
    }

    return (
      <Snackbar open={ draftSavedVisible } onClose={ this.onDraftSavedClose } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={ this.onDraftSavedClose } severity="success">
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
            <Link to="#" onClick={ this.onDraftEmailLinkClick }>
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
  private renderAutosaving = () => {
    const { autosaving } = this.state;

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
   * Renders reply email dialog
   */
  private renderDraftEmailDialog = () => {
    return (
      <EmailDialog
        text={ strings.formScreen.draftEmailDialogText }
        open={ this.state.draftEmailDialogVisible }
        onSend={ this.onDraftEmailDialogSend }
        onCancel={ this.onDraftEmailDialogCancel }
      />
    );
  };

  /**
   * Renders reply saved dialog
   */
  private renderReplySaved = () => {
    const replyEditLink = this.getReplyEditLink();

    if (replyEditLink) {
      return (
        <Snackbar open={ this.state.replySavedVisible } onClose={ this.onReplySavedClose } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={ this.onReplySavedClose  } severity="success">
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
              <Link to="#" onClick={ this.onReplyEmailLinkClick }>
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
      <Snackbar open={ this.state.replySavedVisible } onClose={ this.onReplySavedClose } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={ this.onReplySavedClose  } severity="success">
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
  private renderReplyEmailDialog = () => {
    return (
      <EmailDialog
        text={ strings.formScreen.replyEditEmailDialogText }
        open={ this.state.replyEmailDialogVisible }
        onSend={ this.onReplyEmailDialogSend }
        onCancel={ this.onReplyEmailDialogCancel }
      />
    );
  };

  /**
   * Renders reply delete dialog
   */
  private renderReplyDelete = () => {
    return (
      <Snackbar open={ this.state.replyDeleteVisible } onClose={ this.onReplyDeleteClose }>
        <Alert onClose={ this.onReplyDeleteClose  } severity="warning">
          <span>
            {" "}
            { strings.formScreen.replyDeleteText }
            {" "}
          </span>
          <Link to="#" onClick={ this.onReplyDeleteLinkClick }>
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
  private renderReplyDeleteConfirm = () => {
    return (
      <ConfirmDialog
        onClose={ this.onReplyDeleteConfirmClose }
        onCancel={ this.onReplyDeleteConfirmClose }
        onConfirm={ this.onReplyDeleteConfirmConfirm }
        cancelButtonText={ strings.generic.cancel }
        positiveButtonText={ strings.generic.confirm }
        title={ strings.formScreen.confirmDeleteReplyTitle }
        text={ strings.formScreen.confirmDeleteReplyText }
        open={ this.state.replyDeleteConfirmVisible }
      />
    );
  };

  /**
   * Renders logout link
   */
  private renderLogoutLink = () => {
    const { signedToken } = this.props;
    if (!signedToken) {
      return null;
    }

    return (
      <div style={{
        margin: "auto", width: "70%", maxWidth: "777px"
      }}
      >
        <Link to="#" style={{ cursor: "pointer" }} onClick={ this.onLogoutClick }>
          { strings.formScreen.logout }
        </Link>
      </div>
    );
  };

  /**
   * Prepares form values for the form. 
   *
   * @param metaform metaform
   * @returns prepared form values
   */
  private prepareFormValues = (metaform: Metaform): Dictionary<FieldValue> => {
    const { formValues } = this.state;
    const { keycloak } = this.props;
    const result = { ...formValues };

    metaform.sections?.forEach(section => {
      section.fields?.forEach(field => {
        const { name, _default, options, source } = field;

        if (field.type === MetaformFieldType.Files && !field.uploadUrl) {
          field.uploadUrl = Api.createDefaultUploadUrl();
        }

        if (name) {
          if (_default) {
            result[name] = _default;
          } else if (options && options.length) {
            const selectedOption = options.find(option => option.selected || option.checked);
            if (selectedOption) {
              result[name] = selectedOption.name;
            }
          }

          if (keycloak) {
            const { tokenParsed } = keycloak;

            if (source && source.type === MetaformFieldSourceType.AccessToken && tokenParsed) {
              const accessTokenAttribute = source.options?.accessTokenAttribute;
              const accessTokenValue = accessTokenAttribute ? (tokenParsed as any)[accessTokenAttribute] : null;
              if (accessTokenValue) {
                result[name] = accessTokenValue;
              }
            }
          }
        }
      });
    });

    return result;
  };

  /**
   * Method for getting field value
   *
   * @param fieldName field name
   */
  private getFieldValue = (fieldName: string): FieldValue => {
    return this.state.formValues[fieldName];
  };

  /**
   * Method for setting field value
   *
   * @param fieldName field name
   * @param fieldValue field value
   */
  private setFieldValue = (fieldName: string, fieldValue: FieldValue) => {
    const { formValues, metaform, formValid } = this.state;

    if (formValues[fieldName] !== fieldValue) {
      formValues[fieldName] = fieldValue;
      
      this.setState({
        formValues: formValues,
        draftSaveVisible: !!this.state.metaform?.allowDrafts
      });

      if (formValid && metaform?.autosave) {
        this.scheduleAutosave();
      }
    }
  };

  /**
   * Clears error
   */
  private clearError = () => {
    this.setState({
      error: undefined
    });
  };

  /**
   * Clears snackbar message
   */
  private clearSnackbar = () => {
    this.setState({
      snackbarMessage: undefined
    });
  };

  /**
   * Finds the draft from API
   * 
   * @param draftId draft id
   * @returns found draft or null if not found
   */
  private findDraft = async (draftId: string) => {
    try {
      const accessToken = this.getAccessToken();
      const metaformId = Config.getMetaformId();
      
      const draftApi = Api.getDraftsApi(accessToken);
      return await draftApi.findDraft({
        metaformId: metaformId,
        draftId: draftId
      });
    } catch (e) {
      return null;
    }
  };

  /**
   * Finds the reply from API
   * 
   * @param replyId reply id
   * @param ownerKey owner key
   * @returns found reply or null if not found
   */
  private findReply = async (replyId: string, ownerKey: string) => {
    try {
      const accessToken = this.getAccessToken();
      const metaformId = Config.getMetaformId();

      const replyApi = Api.getRepliesApi(accessToken);
      return await replyApi.findReply({
        metaformId: metaformId,
        replyId: replyId,
        ownerKey: ownerKey
      });
    } catch (e) {
      return null;
    }
  };

  /**
   * Save the reply as draft
   */
  private saveDraft = async () => {
    try {
      const { metaform, formValues, draftId } = this.state;
      const accessToken = this.getAccessToken();
      
      if (!metaform || !metaform.id) {
        return;
      }

      this.setState({
        loading: true,
        draftSaveVisible: false
      });

      const draftsApi = Api.getDraftsApi(accessToken);
      let draft;

      if (draftId) {
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

      this.setState({
        draftId: draft.id!,
        draftSavedVisible: true,
        loading: false
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  };

  /**
   * Sends draft link to given email
   * 
   * @param email email
   */
  private sendDraftEmail = async (email: string) => {
    const { metaform } = this.state;
    const { REACT_APP_EMAIL_FROM } = process.env;
    const draftLink = this.getDraftLink();
    
    if (!draftLink || !metaform) {
      return;
    }

    try {
      this.setState({
        draftEmailDialogVisible: false,
        loading: true
      });

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

      this.setState({
        loading: false,
        snackbarMessage: {
          message: strings.formScreen.draftEmailSent,
          severity: "success"
        }
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  };

  /**
   * Sends reply link to given email
   * 
   * @param email email
   */
  private sendReplyEmail = async (email: string) => {
    const { metaform } = this.state;
    const { REACT_APP_EMAIL_FROM } = process.env;
    const replyEditLink = this.getReplyEditLink();
    
    if (!replyEditLink || !metaform) {
      return;
    }

    try {
      this.setState({
        replyEmailDialogVisible: false,
        loading: true
      });

      if (!REACT_APP_EMAIL_FROM) {
        throw new Error("Missing REACT_APP_EMAIL_FROM env");
      }

      const formTitle = metaform.title || "";
      const subject = strings.formatString(strings.formScreen.replyEditEmailSubject, formTitle) as string;
      const html = strings.formatString(strings.formScreen.replyEditEmailContent, formTitle, replyEditLink) as string;

      await Mail.sendMail({
        from: REACT_APP_EMAIL_FROM,
        html: html,
        subject: subject,
        to: email
      });

      this.setState({
        loading: false,
        snackbarMessage: {
          message: strings.formScreen.replyEditEmailSent,
          severity: "success"
        }
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  };

  /**
   * Deletes the reply
   */
  private deleteReply = async () => {
    const accessToken = this.getAccessToken();
    const { reply, ownerKey } = this.state;

    try {
      this.setState({
        replyDeleteConfirmVisible: false,
        loading: true
      });

      const repliesApi = Api.getRepliesApi(accessToken);

      if (reply && reply.id && ownerKey) {
        await repliesApi.deleteReply({
          metaformId: Config.getMetaformId(),
          replyId: reply.id,
          ownerKey: ownerKey
        });
      } else {
        throw new Error("Missing parameters, failed to delete reply");
      }

      this.setState({
        loading: false,
        replyDeleteVisible: false,
        reply: undefined,
        ownerKey: null,
        snackbarMessage: {
          message: strings.formScreen.replyDeleted,
          severity: "success"
        }
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  };

  /**
   * Returns draft link
   * 
   * @returns draft link or null if not available
   */
  private getDraftLink = () => {
    const { draftId } = this.state;
    if (!draftId) {
      return null;
    }

    const { location } = window;
    return (new URL(`${location.protocol}//${location.hostname}:${location.port}${location.pathname}?draft=${draftId}`)).toString();
  };

  /**
   * Returns reply edit link
   * 
   * @returns reply edit link or null if not available
   */
  private getReplyEditLink = () => {
    const { reply, ownerKey } = this.state;
    if (!reply?.id || !ownerKey) {
      return null;
    }

    return FormUtils.createOwnerKeyLink(reply.id, ownerKey);
  };

  /**
   * Returns either signed token or anonymous token if signed is absent
   * 
   * @return either signed token or anonymous token if signed is absent
   */
  private getAccessToken = () => {
    const { signedToken, anonymousToken } = this.props;
    return signedToken || anonymousToken as AccessToken;
  };

  /**
   * Returns form values as map
   * 
   * @param metaform metaform
   * @returns form values as map
   */
  private getFormValues = (metaform: Metaform): { [ key: string]: object } => {
    const { formValues } = this.state;
    const values = { ...formValues };

    metaform.sections?.forEach(section => {
      section.fields?.forEach(field => {
        if (field.type === MetaformFieldType.Files) {
          let value = this.getFieldValue(field.name as string);
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
   * Saves the reply
   */
  private saveReply = async () => {
    const { metaform, ownerKey } = this.state;
    let { reply } = this.state;

    if (!metaform || !metaform.id) {
      return;
    }

    this.setState({
      saving: true
    });

    try {
      if (reply && reply.id && ownerKey) {
        reply = await this.updateReply(metaform, reply, ownerKey);
      } else {
        reply = await this.createReply(metaform);
      }

      const updatedOwnerKey = ownerKey || reply.ownerKey;
      let updatedValues = reply.data;
      if (updatedOwnerKey) {
        updatedValues = await this.processReplyData(metaform, reply, updatedOwnerKey);
      }
      this.setState({
        saving: false,
        replySavedVisible: true,
        reply: reply,
        ownerKey: updatedOwnerKey || null,
        formValues: updatedValues as any
      });
    } catch (e) {
      this.setState({
        saving: false,
        error: e
      });
    }
  };

  /**
   * Creates new reply
   * 
   * @param metaform metaform
   * @returns created reply
   */
  private createReply = async (metaform: Metaform) => {
    const accessToken = this.getAccessToken();
    const repliesApi = Api.getRepliesApi(accessToken);
    
    return repliesApi.createReply({
      metaformId: Config.getMetaformId(),
      reply: {
        data: this.getFormValues(metaform)
      },
      replyMode: Config.getReplyMode()
    });
  };

  /**
   * Updates existing reply
   * 
   * @param metaform metaform
   * @param reply reply
   * @param ownerKey owner key
   * @returns updated reply
   */
  private updateReply = async (metaform: Metaform, reply: Reply, ownerKey: string | null) => {
    const accessToken = this.getAccessToken();
    const repliesApi = Api.getRepliesApi(accessToken);
    
    await repliesApi.updateReply({
      metaformId: Config.getMetaformId(),
      replyId: reply.id!,
      ownerKey: ownerKey || undefined,
      reply: {
        data: this.getFormValues(metaform)
      }
    });

    return repliesApi.findReply({
      metaformId: Config.getMetaformId(),
      replyId: reply.id!,
      ownerKey: ownerKey || undefined
    });
  };

  /**
   * Schedules an autosave. If new autosave is scheduled before given cooldown period 
   * the old autosave is cancelled and replaced with the new one
   */
  private scheduleAutosave = () => {
    if (this.formValueChangeTimeout) {
      clearTimeout(this.formValueChangeTimeout);
      this.formValueChangeTimeout = null;
    }

    this.formValueChangeTimeout = setTimeout(this.autosave, AUTOSAVE_COOLDOWN);
  };

  /**
   * Autosaves the form
   */
  private autosave = async () => {
    this.formValueChangeTimeout = null;

    const { formValid, metaform, ownerKey, autosaving } = this.state;
    const { reply } = this.state;

    if (!formValid) {
      return;
    }

    if (autosaving) {
      this.scheduleAutosave();
      return;
    }

    if (!metaform || !metaform.id || !reply) {
      return;
    }

    try {
      this.setState({
        autosaving: true
      });

      await this.updateReply(metaform, reply, ownerKey);

      this.setState({
        autosaving: false
      });
    } catch (e) {
      this.setState({
        autosaving: false,
        error: e
      });
    }
  };

  /**
   * Method for submitting form
   */
  private onSubmit = async () => {
    await this.saveReply();
  };

  /**
   * Event handler for validation errors change
   * 
   * @param validationErrors validation errors
   */
  private onValidationErrorsChange = (validationErrors: ValidationErrors) => {
    const { metaform } = this.state;

    const formValid = Object.keys(validationErrors).length === 0;

    if (formValid !== this.state.formValid) {
      this.setState({
        formValid: formValid
      });

      if (formValid && metaform?.autosave) {
        this.scheduleAutosave();
      }
    }
  };

  /**
   * Event handler for draft save snackbar close
   */
  private onDraftSaveClose = () => {
    this.setState({
      draftSaveVisible: false
    });
  };

  /**
   * Event handler for draft save snackbar close
   */
  private onDraftSavedClose = () => {
    this.setState({
      draftSavedVisible: false
    });
  };

  /**
   * Event handler for draft save link click
   */
  private onSaveDraftLinkClick = () => {
    this.saveDraft();
  };

  /**
   * Event handler for draft email link click
   */
  private onDraftEmailLinkClick = () => {
    this.setState({
      draftSavedVisible: false,
      draftEmailDialogVisible: true
    });
  };

  /**
   * Event handler for draft email dialog send click
   * 
   * @param email email
   */
  private onDraftEmailDialogSend = (email: string) => {
    this.sendDraftEmail(email);
  };

  /**
   * Event handler for draft email dialog cancel click
   * 
   * @param email email
   */
  private onDraftEmailDialogCancel = () => {
    this.setState({
      draftEmailDialogVisible: false
    });
  };

  /**
   * Event handler for reply email link click
   */
  private onReplyEmailLinkClick = () => {
    this.setState({
      replySavedVisible: false,
      replyEmailDialogVisible: true
    });
  };

  /**
   * Event handler for reply email dialog send click
   * 
   * @param email email
   */
  private onReplyEmailDialogSend = (email: string) => {
    this.sendReplyEmail(email);
  };

  /**
   * Event handler for reply email dialog cancel click
   * 
   * @param email email
   */
  private onReplyEmailDialogCancel = () => {
    this.setState({
      replyEmailDialogVisible: false
    });
  };

  /**
   * Event handler for reply saved snackbar close
   */
  private onReplySavedClose  = () => {
    this.setState({
      replySavedVisible: false
    });
  };

  /**
   * Event handler for reply delete snackbar close
   */
  private onReplyDeleteClose = () => {
    this.setState({
      replyDeleteVisible: false
    });
  };

  /**
   * Event handler for reply delete link click
   */
  private onReplyDeleteLinkClick = () => {
    this.setState({
      replyDeleteConfirmVisible: true
    });
  };

  /**
   * Event handler for reply delete confirm dialog close
   */
  private onReplyDeleteConfirmClose = () => {
    this.setState({
      replyDeleteConfirmVisible: false
    });
  };
  
  /**
   * Event handler for reply delete confirm dialog confirm
   */
  private onReplyDeleteConfirmConfirm = () => {
    this.deleteReply();
  };

  /**
     * Event handler for logout button click
     */
  private onLogoutClick = () => {
    const { keycloak } = this.props;
    keycloak.logout();
  };

}

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 */
function mapStateToProps(state: ReduxState) {
  return {
    keycloak: state.auth.keycloak as KeycloakInstance,
    signedToken: state.auth.signedToken,
    anonymousToken: state.auth.anonymousToken
  };
}

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FormScreen));