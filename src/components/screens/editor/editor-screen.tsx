import { Divider, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useApiClient } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import strings from "localization/strings";
import React, { useContext, useEffect, useState } from "react";
import Api from "api";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import { Metaform, MetaformVersion, MetaformVersionType, User } from "generated/client";
import EditorScreenDrawer from "../../editor/editor-screen-drawer";
import { useNavigate } from "react-router-dom";
import GenericLoaderWrapper from "components/generic/generic-loader";
import EditorScreenTable from "../../editor/editor-screen-table";
import theme from "theme";
import { RoundActionButton } from "styled/generic/form";

/**
 * Editor screen component
 */
const EditorScreen: React.FC = () => {
  const currentPath = window.location.pathname;
  const errorContext = useContext(ErrorContext);
  const navigate = useNavigate();

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, versionsApi, usersApi } = apiClient;

  const [ metaforms, setMetaforms ] = useState<Metaform[]>([]);
  const [ metaformVersions, setMetaformVersions ] = useState<MetaformVersion[]>([]);
  const [ lastModifiers, setLastModifiers ] = useState<User[]>([]);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ drawerOpen, setDrawerOpen ] = useState<boolean>(false);

  /**
   * Gets last modifiers for Metaforms and Metaform Versions
   */
  const loadLastModifiers = async () => {
    setLoading(true);

    try {
      const formUsers = metaforms.map(form => form.lastModifierId);
      const versionUsers = metaformVersions.map(version => version.lastModifierId);
      const allUsers = [ ...formUsers, ...versionUsers ];
      const distinctUsers = [ ...new Set(allUsers) ];
      const lastModifierUsers = await Promise.all(distinctUsers.map(user =>
        usersApi.findUser({ userId: user! })));

      setLastModifiers(lastModifierUsers);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsScreen.getLastModifiers, e);
    }

    setLoading(false);
  };

  /**
   * Gets Metaforms and Metaform Versions
   */
  const loadMetaforms = async () => {
    setLoading(true);

    try {
      const forms = await metaformsApi.listMetaforms({});
      const versions = await Promise.all(forms.map(form => versionsApi.listMetaformVersions({ metaformId: form.id! })));

      setMetaforms(forms);
      setMetaformVersions(versions.flat());
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsScreen.listForms, e);
    }

    setLoading(false);
  };

  /**
   * Creates new Metaform and  MetaformVersion and navigates to DraftEditorScreen
   */
  const createMetaform = async (metaform: Metaform) => {
    try {
      if (metaforms.find(existingForm => existingForm.title === metaform.title)) {
        throw new Error(strings.errorHandling.adminFormsScreen.createFormDuplicateNameError);
      }
      const newMetaform = await metaformsApi.createMetaform({ metaform: metaform });
      const newMetaformVersion = await versionsApi.createMetaformVersion({
        metaformId: newMetaform.id!,
        metaformVersion: {
          type: MetaformVersionType.Draft,
          data: { ...newMetaform } as any
        }
      });

      navigate(`${currentPath}/${newMetaform.slug}/${newMetaformVersion.id}`);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsScreen.createForm, e);
    }
  };

  /**
   * Handle Archive to Draft conversion
   *
   * @param versionToEdit Version to edit
   */
  const handleArchiveToDraft = async (versionToEdit: MetaformVersion) => {
    const { id } = versionToEdit.data as Metaform;
    const { slug } = metaforms.find(metaform => metaform.id === (versionToEdit.data as Metaform).id)!;

    if (!slug || !id) {
      return;
    }

    const oldDraftVersion = metaformVersions.find(metaformVersion =>
      (metaformVersion.data as Metaform).id === id &&
      metaformVersion.type === MetaformVersionType.Draft);

    if (oldDraftVersion) {
      await versionsApi.updateMetaformVersion({
        metaformId: id,
        versionId: oldDraftVersion.id!,
        metaformVersion: {
          type: MetaformVersionType.Archived,
          data: { ...oldDraftVersion.data }
        }
      });
    }

    await versionsApi.updateMetaformVersion({
      metaformId: id,
      versionId: versionToEdit.id!,
      metaformVersion: {
        type: MetaformVersionType.Draft,
        data: { ...versionToEdit.data }
      }
    });

    return navigate(`${currentPath}/${slug}/${versionToEdit.id!}`);
  };

  /**
   * Navigates to MetaformEditor.
   * Creates new MetaformVersion when
   * user wants to edit production grade Metaform.
   *
   *  @param id id
   */
  const goToEditor = async (id: string) => {
    const metaformToEdit = metaforms.find(metaform => metaform.id === id);

    if (metaformToEdit) {
      const version = metaformVersions.find(metaformVersion =>
        (metaformVersion.data as Metaform).id === metaformToEdit.id &&
        metaformVersion.type === MetaformVersionType.Draft);

      if (version) {
        navigate(`${currentPath}/${metaformToEdit.slug}/${version.id}`);
      } else {
        const newMetaformVersion = await versionsApi.createMetaformVersion({
          metaformId: metaformToEdit.id!,
          metaformVersion: {
            type: MetaformVersionType.Draft,
            data: { ...metaformToEdit } as { [key: string]: object }
          }
        });

        navigate(`${currentPath}/${metaformToEdit.slug}/${newMetaformVersion.id}`);
      }
    }

    const versionToEdit = metaformVersions.find(version => version.id === id);

    if (!versionToEdit) {
      return;
    }

    const { slug } = metaforms.find(metaform => metaform.id === (versionToEdit.data as Metaform).id)!;

    if (versionToEdit.type === MetaformVersionType.Archived) {
      handleArchiveToDraft(versionToEdit);
    }

    navigate(`${currentPath}/${slug}/${versionToEdit.id}`);
  };

  /**
   * Deletes a Metaform or MetaformVersion
   */
  const deleteMetaformOrVersion = async (id: string) => {
    setLoading(true);

    try {
      if (metaforms.find(metaform => metaform.id === id)) {
        await metaformsApi.deleteMetaform({ metaformId: id });

        setMetaforms(metaforms.filter(metaform => metaform.id !== id));
      } else {
        const metaformToDelete = metaformVersions.find(version => version.id === id)?.data as Metaform;
        await versionsApi.deleteMetaformVersion({
          metaformId: metaformToDelete.id!,
          versionId: id
        });

        setMetaformVersions(metaformVersions.filter(version => version.id !== id));
      }
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsScreen.deleteVersion, e);
    }

    setLoading(false);
  };

  /**
   * Toggles drawer
   */
  const toggleEditorDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    loadLastModifiers();
  }, [ metaforms, metaformVersions ]);

  useEffect(() => {
    loadMetaforms();
  }, []);

  return (
    <>
      <EditorScreenDrawer
        open={ drawerOpen }
        setOpen={ setDrawerOpen }
        createMetaform={ createMetaform }
      />
      <Stack overflow="hidden" flex={ 1 }>
        <NavigationTabContainer>
          <NavigationTab
            text={ strings.navigationHeader.editorScreens.editorScreen }
          />
          <RoundActionButton
            endIcon={ <Add/> }
            onClick={ toggleEditorDrawer }
            sx={{ mr: theme.spacing(2) }}
          >
            { strings.navigationHeader.editorScreens.newFormButton }
          </RoundActionButton>
        </NavigationTabContainer>
        <Divider/>
        <GenericLoaderWrapper loading={ loading }>
          <EditorScreenTable
            loading={ loading }
            metaforms={ metaforms }
            metaformVersions={ metaformVersions }
            lastModifiers={ lastModifiers }
            deleteMetaformOrVersion={ deleteMetaformOrVersion }
            goToEditor={ goToEditor }
          />
        </GenericLoaderWrapper>
      </Stack>
    </>
  );
};

export default EditorScreen;