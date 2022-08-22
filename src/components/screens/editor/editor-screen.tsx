import { Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useApiClient } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import strings from "localization/strings";
import React, { useContext, useEffect, useState } from "react";
import Api from "api";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import { Metaform, MetaformVersion, MetaformVersionType } from "generated/client";
import { NewUserButton } from "styled/layouts/admin-layout";
import EditorScreenDrawer from "./editor-screen-drawer";
import { useNavigate } from "react-router-dom";
import GenericLoaderWrapper from "components/generic/generic-loader";
import EditorScreenTable from "./editor-table";

/**
 * Editor screen component
 */
const EditorScreen: React.FC = () => {
  const currentPath = window.location.pathname;
  const errorContext = useContext(ErrorContext);
  const navigate = useNavigate();

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi, versionsApi } = apiClient;

  const [ metaforms, setMetaforms ] = useState<Metaform[]>([]);
  const [ metaformVersions, setMetaformVersions ] = useState<MetaformVersion[]>([]);
  const [ selectedId, setSelectedId ] = useState<string | undefined>();

  const [ loading, setLoading ] = useState<boolean>(false);

  const [ drawerOpen, setDrawerOpen ] = useState<boolean>(false);

  /* eslint-disable @typescript-eslint/return-await */
  /**
   * Gets Metaforms and MetaformVersions 
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
  /* eslint-enable @typescript-eslint/return-await */

  /**
   * Creates new Metaform and  MetaformVersion and navigates to DraftEditorScreen
   */
  const createMetaform = async (metaform: Metaform) => {
    try {
      if (metaforms.find(existingForm => existingForm.title === metaform.title)) {
        throw new Error(strings.editorScreen.createFormDuplicateNameError);
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
   * Deletes a Metaform or MetaformVersion
   */
  const deleteMetaformOrVersion = async () => {
    const id = selectedId!;
    setLoading(true);

    try {
      const deleteMetaform = !!metaforms.find(metaform => metaform.id === id);

      if (deleteMetaform) {
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

    setSelectedId(undefined);
    setLoading(false);
  };

  /**
   * If selected version is in production, navigates to FormEditorScreen, else to DraftEditorScreen
   */
  const editMetaformOrDraft = async () => {
    const id = selectedId;
    let slug;
    const editMetaform = metaforms.find(metaform => metaform.id === id);

    if (editMetaform) {
      slug = editMetaform.slug;
      navigate(`${currentPath}/${slug}`);
    } else {
      navigate(`${currentPath}/${slug}/${id}`);
    }
  };

  /**
   * Toggles drawer
   */
  const toggleEditorDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

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
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.editorScreens.editorScreen }
        />
        <NewUserButton
          endIcon={ <Add/> }
          onClick={ toggleEditorDrawer }
        >
          { strings.navigationHeader.editorScreens.newFormButton }
        </NewUserButton>
      </NavigationTabContainer>
      <Divider/>
      <GenericLoaderWrapper loading={ loading }>
        <EditorScreenTable
          loading={ loading }
          metaforms={ metaforms }
          metaformVersions={ metaformVersions }
          deleteMetaformOrVersion={ deleteMetaformOrVersion }
          setSelectedId={ setSelectedId }
          editMetaform={ editMetaformOrDraft }
        />
      </GenericLoaderWrapper>
    </>
  );
};

export default EditorScreen;