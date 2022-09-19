import { Metaform } from "generated/client";
import React, { useState } from "react";
import strings from "localization/strings";
import DraftPreviewHeader from "../../preview/draft-preview-header";
import DraftPreviewShareDialog from "../../preview/draft-preview-dialog";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "app/hooks";
import { Alert, Snackbar } from "@mui/material";
import DraftPreview from "components/preview/draft-preview";
import { selectMetaform } from "features/metaform-slice";

/**
 * Metaform editor preview component
 */
const DraftPreviewScreen: React.FC = () => {
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ linkCopied, setLinkCopied ] = useState(false);
  const [ emailSent, setEmailSent ] = useState(false);
  const { metaformVersion } = useAppSelector(selectMetaform);
  const metaformData = metaformVersion?.data as Metaform;

  const navigate = useNavigate();
  const { formSlug, draftId } = useParams();

  const linkToShare = `${window.location.origin}/${formSlug}`;

  React.useEffect(() => {
    if (!metaformVersion || metaformData.slug !== formSlug || metaformVersion.id !== draftId) {
      navigate(window.location.pathname.replace("preview", "editor"));
    }
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
        metaform={ metaformData }
      />
      { renderShareLinkDialog() }
      { renderLinkSharedSnackbar() }
      { renderEmailSentSnackbar() }
    </>
  );
};

export default DraftPreviewScreen;