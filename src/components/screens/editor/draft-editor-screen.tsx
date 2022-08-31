import { Divider, Stack, Typography } from "@mui/material";
import { Metaform, MetaformVersionType } from "generated/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import MetaformUtils from "utils/metaform-utils";
import MetaformEditor from "components/editor/metaform-editor";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import { Preview, Public, Save } from "@mui/icons-material";
import { IconActionButton } from "styled/layouts/admin-layout";
import { useParams, useNavigate } from "react-router-dom";
import { ErrorContext } from "components/contexts/error-handler";
import Api from "api";
import { useApiClient } from "app/hooks";
import GenericLoaderWrapper from "components/generic/generic-loader";

/**
 * Draft editor screen component
 */
const DraftEditorScreen: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const errorContext = useContext(ErrorContext);

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, versionsApi } = apiClient;
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [ draftForm, setDraftForm ] = useState<Metaform>(MetaformUtils.jsonToMetaform({}));

  const [ loading, setLoading ] = useState<boolean>(false);

  /**
   * Loads MetaformVersion to edit.
   */
  const loadMetaformVersion = async () => {
    setLoading(true);
    const { formSlug, draftId } = params;

    try {
      const form = await metaformsApi.findMetaform({ metaformSlug: formSlug });
      const draft = await versionsApi.findMetaformVersion({
        metaformId: form.id!,
        versionId: draftId!
      });

      if (draft) {
        setDraftForm(draft.data as Metaform);
      } else {
        setDraftForm(form);
      }
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

    try {
      await versionsApi.createMetaformVersion({
        metaformId: draftForm.id!,
        metaformVersion: {
          type: MetaformVersionType.Draft,
          data: { ...draftForm } as any
        }
      });
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.saveDraft, e);
    }

    navigate(-1);
  };

  useEffect(() => {
    loadMetaformVersion();
  }, []);

  /**
   * Renders draft editor actions
   */
  const draftEditorActions = () => (
    <Stack direction="row" spacing={ 2 }>
      <IconActionButton
        startIcon={ <Save/> }
        onClick={ saveMetaformVersion }
      >
        <Typography>{ strings.generic.save }</Typography>
      </IconActionButton>
      <IconActionButton onClick={ () => editorRef.current?.requestFullscreen?.() } startIcon={ <Preview/> }>
        <Typography>{ strings.draftEditorScreen.preview }</Typography>
      </IconActionButton>
      <IconActionButton disabled startIcon={ <Public/> }>
        <Typography>{ strings.draftEditorScreen.publish }</Typography>
      </IconActionButton>
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