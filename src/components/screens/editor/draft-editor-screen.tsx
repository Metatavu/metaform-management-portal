/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Divider, Stack, Typography } from "@mui/material";
import { Metaform, MetaformVersionType } from "generated/client";
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
import { useApiClient, useAppDispatch } from "app/hooks";
import GenericLoaderWrapper from "components/generic/generic-loader";
import { RoundActionButton } from "styled/generic/form";
import { setMetaform } from "features/metaform-slice";

/**
 * Draft editor screen component
 */
const DraftEditorScreen: React.FC = () => {
  const params = useParams();
  const { formSlug, draftId } = params;
  const navigate = useNavigate();
  const errorContext = useContext(ErrorContext);
  const dispatch = useAppDispatch();

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, versionsApi } = apiClient;

  const editorRef = useRef<HTMLDivElement>(null);
  const [ draftForm, setDraftForm ] = useState<Metaform>(MetaformUtils.jsonToMetaform({}));
  const [ loading, setLoading ] = useState(false);

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

      const draftMetaform = draft.data as Metaform;
      setDraftForm(draftMetaform);
      dispatch(setMetaform(draftMetaform));
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.findDraft, e);
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
      await versionsApi.createMetaformVersion({
        metaformId: draftForm.id!,
        metaformVersion: {
          type: MetaformVersionType.Draft,
          data: { ...draftForm } as { [key: string]: object }
        }
      });
      await versionsApi.deleteMetaformVersion({
        metaformId: draftForm.id!,
        versionId: draftId
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
      // TODO: Investigate possibility of adding PUT method to MetaformVersions API to simplify this.
      await versionsApi.createMetaformVersion({
        metaformId: form.id!,
        metaformVersion: {
          type: MetaformVersionType.Archived,
          data: { ...form } as { [key: string]: object }
        }
      });
      await versionsApi.deleteMetaformVersion({
        metaformId: form.id!,
        versionId: draftId
      });
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.publishDraft, e);
    }

    navigate(-1);
  };

  useEffect(() => {
    loadMetaformVersion();
    return () => {
      dispatch(setMetaform());
    };
  }, []);

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
        onClick={ publishMetaformVersion }
      >
        <Typography>{ strings.draftEditorScreen.publish }</Typography>
      </RoundActionButton>
    </Stack>
  );

  return (
    <Stack flex={ 1 } overflow="hidden">
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
          setPendingForm={ setDraftForm }
        />
      </GenericLoaderWrapper>
    </Stack>
  );
};

export default DraftEditorScreen;