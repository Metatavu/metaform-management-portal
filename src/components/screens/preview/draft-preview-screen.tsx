import { Metaform } from "generated/client";
import React, { FC, useContext, useState } from "react";
import strings from "localization/strings";
import DraftPreviewHeader from "../../preview/draft-preview-header";
import DraftPreviewShareDialog from "../../preview/draft-preview-dialog";
import { useNavigate, useParams } from "react-router-dom";
import { useApiClient, useAppSelector } from "app/hooks";
import { Alert, Snackbar } from "@mui/material";
import DraftPreview from "components/preview/draft-preview";
import { selectMetaform } from "features/metaform-slice";
import MetaformUtils from "utils/metaform-utils";
import Api from "api";
import { ErrorContext } from "components/contexts/error-handler";

/**
 * Metaform editor preview component
 */
const DraftPreviewScreen: FC = () => {
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ linkCopied, setLinkCopied ] = useState(false);
  const [ emailSent, setEmailSent ] = useState(false);
  const { metaformVersion } = useAppSelector(selectMetaform);
  const [draftForm, setDraftForm] = useState(metaformVersion?.data === undefined ?
    MetaformUtils.jsonToMetaform({}) :
    metaformVersion?.data as Metaform);

  const navigate = useNavigate();
  const { formSlug, draftId } = useParams();
  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, versionsApi } = apiClient;
  const errorContext = useContext(ErrorContext);

  const linkToShare = `${window.location}`;

  /**
   * Loads Metaform draft version to preview.
   */
  const loadDraftVersion = async () => {
    try {
      const form = await metaformsApi.findMetaform({ metaformSlug: formSlug });
      const draft = await versionsApi.findMetaformVersion({
        metaformId: form.id!,
        versionId: draftId!
      });
      
      setDraftForm(draft);
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.findDraft, e);
      navigate(window.location.pathname.replace("preview", "editor"));
    }
  };

  /**
   * Initializes component data
   */
  const initDraftPreview = async () => {
    console.log(metaformVersion);
    console.log(draftId);
    if (!metaformVersion || !draftId) {
      await loadDraftVersion();
    }
  };

  React.useEffect(() => {
    initDraftPreview();
  }, []);

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
    <>
      <DraftPreviewHeader onShareLinkClick={ onShareLinkClick }/>
      <DraftPreview
        metaform={ draftForm }
      />
      { renderShareLinkDialog() }
      { renderLinkSharedSnackbar() }
      { renderEmailSentSnackbar() }
    </>
  );
};

export default DraftPreviewScreen;