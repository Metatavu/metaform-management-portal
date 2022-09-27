/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Divider, Stack, Typography } from "@mui/material";
import { Metaform, MetaformVersion, MetaformVersionType } from "generated/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import MetaformUtils from "utils/metaform-utils";
import MetaformEditor from "components/editor/metaform-editor";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import { Preview, Public, Save } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { ErrorContext } from "components/contexts/error-handler";
import Api from "api";
import { useApiClient, useAppDispatch, useAppSelector } from "app/hooks";
import GenericLoaderWrapper from "components/generic/generic-loader";
import { RoundActionButton } from "styled/generic/form";
import { selectMetaform, setMetaformVersion } from "features/metaform-slice";
import ConfirmDialog from "components/generic/confirm-dialog";

/**
 * Draft editor screen component
 */
const DraftEditorScreen: React.FC = () => {
  const params = useParams();
  const { formSlug, draftId } = params;
  const navigate = useNavigate();
  const errorContext = useContext(ErrorContext);
  const dispatch = useAppDispatch();
  const { metaformVersion } = useAppSelector(selectMetaform);
  const draftForm = metaformVersion?.data === undefined ?
    MetaformUtils.jsonToMetaform({}) :
    metaformVersion?.data as Metaform;

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, versionsApi } = apiClient;

  const editorRef = useRef<HTMLDivElement>(null);
  const [ loading, setLoading ] = useState(false);
  const [ publishDialogOpen, setPublishDialogOpen ] = useState(false);

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

      dispatch(setMetaformVersion(draft));
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.findDraft, e);
      navigate("./../..");
    }

    setLoading(false);
  };

  /**
   * Saves changes to Metaform
   */
  const saveMetaformVersion = async () => {
    setLoading(true);

    if (!draftId || !formSlug) {
      return;
    }

    try {
      await versionsApi.updateMetaformVersion({
        metaformId: draftForm.id!,
        versionId: draftId,
        metaformVersion: {
          type: MetaformVersionType.Draft,
          data: { ...draftForm } as { [key: string]: object }
        }
      });
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.saveDraft, e);
    }

    navigate("./../..");
  };
  
  /**
   * Publishes Metaform
   */
  const publishMetaformVersion = async () => {
    setLoading(true);

    if (!draftId || !formSlug) {
      return;
    }

    try {
      const form = await metaformsApi.findMetaform({ metaformSlug: formSlug });
      await metaformsApi.updateMetaform({
        metaformId: form.id!,
        metaform: draftForm
      });

      await versionsApi.updateMetaformVersion({
        metaformId: form.id!,
        versionId: draftId,
        metaformVersion: {
          type: MetaformVersionType.Archived,
          data: { ...form } as { [key: string]: object }
        }
      });
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.publishDraft, e);
    }

    navigate("./../..");
  };

  /**
   * Renders confirmation for publishing form
   */
  const renderPublishConfirmDialog = () => (
    <ConfirmDialog
      onClose={ () => setPublishDialogOpen(false) }
      onCancel={ () => setPublishDialogOpen(false) }
      onConfirm={ publishMetaformVersion }
      cancelButtonText={ strings.generic.cancel }
      positiveButtonText={ strings.generic.confirm }
      title={ strings.draftEditorScreen.publishDialog.title }
      text={ strings.formatString(strings.draftEditorScreen.publishDialog.contentText, draftForm.slug!) as string }
      open={ publishDialogOpen }
    />
  );

  useEffect(() => {
    if (metaformVersion === undefined || metaformVersion.id !== draftId) {
      loadMetaformVersion();
    }
  }, []);

  /**
   * Sets pending form
   *
   * @param form pending form
   */
  const setPendingForm = async (form: Metaform) => {
    const updatedMetaformVersion = { ...metaformVersion, data: form } as MetaformVersion;
    dispatch(setMetaformVersion(updatedMetaformVersion));
  };

  /**
   * Renders draft editor actions
   */
  const draftEditorActions = () => (
    <Stack direction="row" spacing={ 2 }>
      <RoundActionButton
        startIcon={ <Save/> }
        onClick={ saveMetaformVersion }
      >
        <Typography>{ strings.generic.save }</Typography>
      </RoundActionButton>
      <RoundActionButton
        onClick={ () => navigate(window.location.pathname.replace("editor", "preview")) }
        startIcon={ <Preview/> }
      >
        <Typography>{ strings.draftEditorScreen.preview }</Typography>
      </RoundActionButton>
      <RoundActionButton
        startIcon={ <Public/> }
        onClick={ () => setPublishDialogOpen(true) }
      >
        <Typography>{ strings.draftEditorScreen.publish }</Typography>
      </RoundActionButton>
    </Stack>
  );

  return (
    <Stack flex={ 1 } overflow="hidden">
      { renderPublishConfirmDialog() }
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.editorScreens.draftEditorScreen }
          renderActions={ draftEditorActions }
        />
      </NavigationTabContainer>
      <Divider/>
      <GenericLoaderWrapper loading={ loading }>
        <MetaformEditor
          editorRef={ editorRef }
          pendingForm={ MetaformUtils.jsonToMetaform(draftForm) }
          setPendingForm={ setPendingForm }
        />
      </GenericLoaderWrapper>
    </Stack>
  );
};

export default DraftEditorScreen;