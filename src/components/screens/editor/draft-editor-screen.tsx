/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Divider, Stack, Tooltip, Typography } from "@mui/material";
import { Metaform, MetaformFieldType, MetaformMemberGroup, MetaformVersion, MetaformVersionType, Template, TemplateVisibility } from "generated/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import MetaformUtils from "utils/metaform-utils";
import MetaformEditor from "components/form-editor/metaform-editor";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import { Preview, Public, Save, SaveAs, Delete, GetApp } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { ErrorContext } from "components/contexts/error-handler";
import Api from "api";
import { useApiClient, useAppDispatch, useAppSelector } from "app/hooks";
import GenericLoaderWrapper from "components/generic/generic-loader";
import { RoundActionButton } from "styled/generic/form";
import { selectMetaform, setMetaformVersion, setMetaformSelectionsUndefined } from "features/metaform-slice";
import { setSnackbarMessage } from "features/snackbar-slice";
import ConfirmDialog from "components/generic/confirm-dialog";
import TemplateDialog from "components/generic/template-dialog";
import FileUtils from "utils/file-utils";

/**
 * Draft editor screen component
 */
const DraftEditorScreen: React.FC = () => {
  const errorContext = useContext(ErrorContext);
  const params = useParams();
  const navigate = useNavigate();
  const { formSlug, draftId } = params;

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformMemberGroupsApi, metaformsApi, versionsApi, templatesApi } = apiClient;

  const dispatch = useAppDispatch();
  const { metaformVersion } = useAppSelector(selectMetaform);
  const pendingForm = MetaformUtils.jsonToMetaform(MetaformUtils.getDraftForm(metaformVersion));
  const draftForm = MetaformUtils.getDraftForm(metaformVersion);
  const editorRef = useRef<HTMLDivElement>(null);
  const [ loading, setLoading ] = useState(false);
  const [ savedTemplateId, setSavedTemplateId ] = useState("");
  const [ publishDialogOpen, setPublishDialogOpen ] = useState(false);
  const [ templateDialogOpen, setTemplateDialogOpen ] = useState(false);
  const [ memberGroups, setMemberGroups ] = useState<MetaformMemberGroup[]>([]);
  const [ hasMemberGroups, setHasMemberGroups ] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Template[]>([]);

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
   * Check if form have some member groups defined
   */
  const checkIfMemberGroups = () => {
    if (pendingForm.defaultPermissionGroups) {
      if (pendingForm.defaultPermissionGroups!.editGroupIds!.length > 0 ||
          pendingForm.defaultPermissionGroups!.notifyGroupIds!.length > 0 ||
          pendingForm.defaultPermissionGroups!.viewGroupIds!.length > 0) {
        setHasMemberGroups(true);
      } else {
        pendingForm.sections?.forEach((section => {
          section.fields?.forEach((field => {
            if (field.type === MetaformFieldType.Select || field.type === MetaformFieldType.Checklist || field.type === MetaformFieldType.Radio) {
              field.options?.forEach((option => {
                if (option.permissionGroups) {
                  if (option.permissionGroups!.editGroupIds!.length > 0 ||
                      option.permissionGroups!.notifyGroupIds!.length > 0 ||
                      option.permissionGroups!.viewGroupIds!.length > 0) {
                    setHasMemberGroups(true);
                  }
                }
              }));
            }
          }));
        }));
      }
    }
  };

  useEffect(() => {
    setHasMemberGroups(false);
    checkIfMemberGroups();
  }, [pendingForm]);

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
   * Checks if template name is unique
   *
   * @param templateTitle string
   */
  const checkTemplateNameIsUnique = async (templateTitle: string) => {
    let currentTemplates = templates;
    if (!currentTemplates.length) {
      try {
        currentTemplates = await templatesApi.listTemplates({
          visibility: TemplateVisibility.Public
        });
        setTemplates(currentTemplates);
      } catch (e) {
        errorContext.setError(strings.errorHandling.draftEditorScreen.fetchTemplates, e);
      }
    }

    return !currentTemplates.some(template => template.data.title === templateTitle);
  };

  /**
   * Saves draft form as a template
   *
   * @param templateTitle template title string
   */
  const saveTemplate = async (templateTitle: string) => {
    setTemplateDialogOpen(false);
    setLoading(true);

    try {
      const createdTemplate = await templatesApi.createTemplate({
        template: {
          visibility: TemplateVisibility.Public,
          data: {
            title: templateTitle,
            sections: draftForm.sections,
            exportThemeId: draftForm.exportThemeId
          }
        }
      });
      dispatch(setSnackbarMessage(strings.successSnackbars.draftEditor.saveTemplateSuccessText));
      setSavedTemplateId(createdTemplate.id!);
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.saveTemplate, e);
    }
    setLoading(false);
  };

  /**
   * Delete form template
   *
   * @param templateId form template string
   */
  const deleteTemplate = async (templateId: string) => {
    try {
      setLoading(true);
      await templatesApi.deleteTemplate({
        templateId: templateId
      });
      dispatch(setSnackbarMessage(strings.successSnackbars.draftEditor.deleteTemplateSuccessText));
      setSavedTemplateId("");
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.deleteTemplate, e);
    }
    setLoading(false);
  };

  /**
   * Renders dialog for saving template
   */
  const renderTemplateDialog = () => (
    <TemplateDialog
      onCancel={ () => setTemplateDialogOpen(false) }
      onSubmit={ saveTemplate }
      open={ templateDialogOpen }
      checkTemplateNameIsUnique={ checkTemplateNameIsUnique }
    />
  );

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
      {savedTemplateId
        ? (
          <RoundActionButton
            onClick={ () => deleteTemplate(savedTemplateId) }
            startIcon={ <Delete/> }
            color="error"
          >
            <Typography>{ strings.draftEditorScreen.deleteTemplate }</Typography>
          </RoundActionButton>)
        : (
          <RoundActionButton
            onClick={ () => setTemplateDialogOpen(true) }
            startIcon={ <SaveAs/> }
          >
            <Typography>{ strings.draftEditorScreen.saveTemplate }</Typography>
          </RoundActionButton>)}
      <Tooltip title={ strings.draftEditorScreen.editor.form.publishNoMemberGroupsDescription } disableHoverListener={ hasMemberGroups }>
        <span>
          <RoundActionButton
            startIcon={ <Public/> }
            onClick={ () => setPublishDialogOpen(true) }
            disabled={ !pendingForm?.sections || pendingForm?.sections?.length! === 0 || !hasMemberGroups }
          >
            <Typography>{ strings.draftEditorScreen.publish }</Typography>
          </RoundActionButton>
        </span>
      </Tooltip>
      <RoundActionButton
        onClick={() => FileUtils.exportToZip(draftForm)}
        startIcon={<GetApp/>}
      >
        <Typography>{ strings.draftEditorScreen.exportToZip }</Typography>
      </RoundActionButton>
    </Stack>
  );

  return (
    <Stack flex={ 1 } overflow="hidden">
      { renderPublishConfirmDialog() }
      { renderTemplateDialog() }
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