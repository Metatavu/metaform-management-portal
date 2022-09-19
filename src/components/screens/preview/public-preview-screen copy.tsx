import { Metaform } from "generated/client";
import React, { useContext, useState } from "react";
import strings from "localization/strings";
import { FieldValue } from "metaform-react/types";
import DraftPreviewHeader from "../../preview/draft-preview-header";
import DraftPreviewShareDialog from "../../preview/draft-preview-dialog";
import { useParams } from "react-router-dom";
import { ErrorContext } from "components/contexts/error-handler";
import Api from "api";
import { useApiClient } from "app/hooks";
import MetaformUtils from "utils/metaform-utils";
import GenericLoaderWrapper from "components/generic/generic-loader";
import Form from "components/generic/form";
import { Dictionary } from "@reduxjs/toolkit";
import { Alert, Snackbar } from "@mui/material";
import DraftPreview from "components/preview/draft-preview";

/**
 * Metaform editor preview component
 */
const PublicPreviewScreen: React.FC = () => {
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ draftForm, setDraftForm ] = useState<Metaform>(MetaformUtils.jsonToMetaform({}));
  const [ formValues, setFormValues ] = useState<Dictionary<FieldValue>>({});
  const [ linkCopied, setLinkCopied ] = useState(false);
  const [ emailSent, setEmailSent ] = useState(false);

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, versionsApi } = apiClient;
  const { formSlug, draftId } = useParams();
  const errorContext = useContext(ErrorContext);

  const linkToShare = `${window.location.origin}/${formSlug}`;

  /**
   * Loads MetaformVersion to edit.
   */
  const loadMetaformVersion = async () => {
    setLoading(true);

    try {
      const form = await metaformsApi.findMetaform({ metaformSlug: formSlug });
      const draft = await versionsApi.findMetaformVersion({
        metaformId: form.id!,
        versionId: draftId!
      });

      const parsedDraft = draft.data as Metaform;
      setDraftForm(parsedDraft);
      // setFormValues(MetaformUtils.prepareFormValues(parsedDraft, formValues!, undefined));
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.findDraft, e);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    loadMetaformVersion();
  }, []);

  /**
   * Method for getting field value
   *
   * @param fieldName field name
   */
  const getFieldValue = (fieldName: string): FieldValue => formValues[fieldName] || null;

  /**
   * Method for setting field value
   *
   * @param fieldName field name
   * @param fieldValue field value
   */
  const setFieldValue = (fieldName: string, fieldValue: FieldValue) => {
    if (formValues[fieldName] !== fieldValue) {
      setFormValues({ ...formValues, [fieldName]: fieldValue });
    }
  };

  /**
   * On share link click
   */
  const onShareLinkClick = () => {
    setDialogOpen(true);
  };

  /**
   * Renders share link dialog
   */
  const renderShareLinkDialog = () => (
    <DraftPreviewShareDialog
      open={ dialogOpen }
      onCancel={ () => setDialogOpen(false) }
      linkToShare={ linkToShare }
      setEmailSent={ setEmailSent }
      setLinkCopied={ setLinkCopied }
    />
  );

  /**
   * Renders link copied snackbar
   */
  const renderLinkSharedSnackbar = () => (
    <Snackbar
      open={ linkCopied }
      onClose={ () => setLinkCopied(false) }
    >
      <Alert severity="info">
        <span>
          {" "}
          { strings.draftEditorScreen.formPreview.shareLinkDialog.linkCopied }
          {" "}
        </span>
      </Alert>
    </Snackbar>
  );

  /**
   * Renders email sent snackbar
   */
  const renderEmailSentSnackbar = () => (
    <Snackbar
      open={ emailSent }
      onClose={ () => setEmailSent(false) }
    >
      <Alert severity="info">
        <span>
          {" "}
          { strings.draftEditorScreen.formPreview.previewEmail.emailSent }
          {" "}
        </span>
      </Alert>
    </Snackbar>
  );

  return (
    <GenericLoaderWrapper loading={ loading }>
      <>
        <DraftPreviewHeader onShareLinkClick={ onShareLinkClick }/>
        <DraftPreview
          metaform={ draftForm }
        />
        { renderShareLinkDialog() }
        { renderLinkSharedSnackbar() }
        { renderEmailSentSnackbar() }
      </>
    </GenericLoaderWrapper>
  );
};

export default PublicPreviewScreen;