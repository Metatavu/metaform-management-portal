/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Divider, Stack, Typography } from "@mui/material";
import { Metaform, MetaformMemberGroup, MetaformVersion, MetaformVersionType } from "generated/client";
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
import { selectMetaform, setMetaformVersion, setMetaformSelectionsUndefined } from "features/metaform-slice";
import { setSnackbarMessage } from "features/snackbar-slice";
import ConfirmDialog from "components/generic/confirm-dialog";
import LeavePageHandler from "components/contexts/leave-page-handler";

/**
 * Draft editor screen component
 */
const DraftEditorScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);
  const params = useParams();
  const navigate = useNavigate();
  const { formSlug, draftId } = params;

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformMemberGroupsApi, metaformsApi, versionsApi } = apiClient;

  const dispatch = useAppDispatch();
  const { metaformVersion } = useAppSelector(selectMetaform);
  
  const draftForm = MetaformUtils.getDraftForm(metaformVersion);
  const editorRef = useRef<HTMLDivElement>(null);
  const [ loading, setLoading ] = useState(false);
  const [ publishDialogOpen, setPublishDialogOpen ] = useState(false);
  const [ memberGroups, setMemberGroups ] = useState<MetaformMemberGroup[]>([]);

  /**
   * Loads MetaformVersion to edit.
   */
  const loadData = async () => {
    dispatch(setMetaformSelectionsUndefined(undefined));
    setLoading(true);

    let formId: string;

    try {
      if (metaformVersion === undefined || metaformVersion.id !== draftId) {
        const form = await metaformsApi.findMetaform({ metaformSlug: formSlug });

        formId = form.id!;
        const draft = await versionsApi.findMetaformVersion({
          metaformId: form.id!,
          versionId: draftId!
        });
        dispatch(setMetaformVersion(draft));
      } else {
        const form = MetaformUtils.jsonToMetaform(metaformVersion.data);
        formId = form.id!;
      }

      const loadedMemberGroups = await metaformMemberGroupsApi.listMetaformMemberGroups({
        metaformId: formId
      });

      setMemberGroups(loadedMemberGroups);
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.findDraft, e);
      navigate("./../..");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
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

    dispatch(setSnackbarMessage(strings.successSnackbars.draftEditor.saveDraftSuccessText));
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

      const newDraftForm: Metaform = MetaformUtils.jsonToMetaform(draftForm);
      newDraftForm?.sections?.[0].fields?.push(...MetaformUtils.createFormsMetadataFields());

      await metaformsApi.updateMetaform({
        metaformId: form.id!,
        metaform: newDraftForm
      });

      await versionsApi.updateMetaformVersion({
        metaformId: form.id!,
        versionId: draftId,
        metaformVersion: {
          type: MetaformVersionType.Archived,
          data: { ...form } as { [key: string]: object }
        }
      });

      dispatch(setSnackbarMessage(strings.successSnackbars.draftEditor.publishDraftSuccessText));
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
      text={ strings.formatString(strings.draftEditorScreen.publishDialog.contentText, draftForm.slug ?? "") as string }
      open={ publishDialogOpen }
    />
  );

  /**
   * Renders draft editor actions
   */
  const draftEditorActions = () => (
    <LeavePageHandler active={ true } loadData={MetaformUtils.jsonToMetaform(draftForm)}>
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
          disabled={ !draftForm?.sections || draftForm?.sections?.length! === 0 }
        >
          <Typography>{ strings.draftEditorScreen.publish }</Typography>
        </RoundActionButton>
      </Stack>
    </LeavePageHandler>
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
          memberGroups={ memberGroups }
          pendingForm={ MetaformUtils.jsonToMetaform(draftForm) }
          setPendingForm={ setPendingForm }
        />
      </GenericLoaderWrapper>
    </Stack>
  );
};

export default DraftEditorScreen;