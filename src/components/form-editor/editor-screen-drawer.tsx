import { Box, Drawer, FormControl, FormControlLabel, FormHelperText, FormLabel, IconButton, Radio, RadioGroup, Stack, TextField, Typography, Link, MenuItem, LinearProgress } from "@mui/material";
import { Save, Clear } from "@mui/icons-material";
import strings from "localization/strings";
import React, { FC, useContext, useEffect, useState } from "react";
import theme from "theme";
import { Metaform, MetaformSection, MetaformVisibility, Template, TemplateVisibility } from "generated/client";
import slugify from "slugify";
import SosmetaUtils from "utils/sosmeta-utils";
import GenericLoaderWrapper from "components/generic/generic-loader";
import { ErrorContext } from "components/contexts/error-handler";
import Config from "app/config";
import Feature from "components/containers/feature";
import { FeatureType, FeatureStrategy } from "types";
import { DrawerSection } from "styled/editor/metaform-editor";
import { useApiClient } from "app/hooks";
import Api from "api";
import { RoundActionButton } from "styled/generic/form";
import MetaformUtils from "utils/metaform-utils";

/**
 * Component props
 */
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  createMetaform: (metaform: Metaform) => void;
  setSnackbarMessage: (message: string) => void;
}

/**
 * Interface for Metaforms settings
 */
interface FormSettings {
  formName: string;
  formSlug: string;
  formUrl: string;
  formTemplate: boolean;
  formSchema: string;
  formAuthentication: boolean;
  formSections?: MetaformSection[];
  exportThemeId?: string;
}

/**
 * Editor Screen Drawer component
 */
const EditorScreenDrawer: FC<Props> = ({
  open,
  setOpen,
  createMetaform,
  setSnackbarMessage
}) => {
  const currentHostname = window.location.hostname;
  const errorContext = useContext(ErrorContext);
  const apiClient = useApiClient(Api.getApiClient);
  const { templatesApi } = apiClient;

  const [ formSettings, setFormSettings ] = useState<FormSettings>({
    formName: "",
    formSlug: "",
    formUrl: "",
    formTemplate: false,
    formSchema: "",
    formAuthentication: false
  });
  const [ valid, setValid ] = useState<boolean>(false);
  const [ converting, setConverting ] = useState<boolean>(false);
  const [ templates, setTemplates ] = useState<Template[]>([]);
  const [ selectedTemplate, setSelectedTemplate ] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Toggle drawer
   */
  const toggleDrawerOpen = () => {
    setOpen(!open);
  };

  /**
   * Gets a list of templates
   */
  const getTemplates = async () => {
    if (!templates.length && open) {
      try {
        setLoading(true);
        const foundTemplates = await templatesApi.listTemplates({
          visibility: TemplateVisibility.Public
        });
        setTemplates(foundTemplates);
      } catch (e) {
        errorContext.setError(strings.errorHandling.draftEditorScreen.fetchTemplates, e);
      }
      setLoading(false);
    }
  };

  /**
   * Applies template sections to form
   */
  const applyTemplateToForm = () => {
    const foundTemplate = templates.find(template => template.id === selectedTemplate);

    if (!foundTemplate?.data?.sections || !foundTemplate?.data?.title) return;

    setFormSettings({
      ...formSettings,
      formName: formSettings.formName || "",
      formSections: foundTemplate.data.sections
    });
  };

  /**
   * Handles conversion of Sosmeta schemas to Metaform
   */
  const handleSosmetaConversion = async () => {
    setConverting(true);

    try {
      const convertedForm = await SosmetaUtils.convertSosmetaToMetaform(formSettings.formSchema);

      setSnackbarMessage(strings.successSnackbars.formEditor.convertSchemaSuccessText);
      setFormSettings({
        ...formSettings,
        formName: convertedForm.title!,
        formSections: convertedForm.sections!
      });
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsScreen.convertSosmetaError, e);
    }
    setConverting(false);
  };

  /**
   * Handles Save icon click
   */
  const handleFormSubmit = async () => {
    createMetaform({
      allowAnonymous: !formSettings.formAuthentication,
      visibility: formSettings.formAuthentication ? MetaformVisibility.Private : MetaformVisibility.Public,
      title: formSettings.formName,
      slug: formSettings.formSlug,
      sections: formSettings.formSections,
      exportThemeId: Config.getDefaultExportThemeId()
    });
  };

  /**
   * Event handler for input element change
   * This method is being used by not only textfields but also radio buttons that return a boolean value.
   * Radio buttons do not return boolean, but rather true or false as a string.
   * Therefore that is being converterd to boolean.
   *
   * @param event event
   */
  const onInputFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = event;
    if (name === "formTemplate" || name === "formAuthentication") {
      setFormSettings({ ...formSettings, [name]: value === "true" });
    } else {
      setFormSettings({ ...formSettings, [name]: value });
    }
  };

  /**
   * Handles file change for import
   *
   * @param event event
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      errorContext.setError(strings.errorHandling.adminFormsScreen.parsingJsonFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        if (!importedData.sections) {
          throw new Error(strings.errorHandling.adminFormsScreen.jsonContainsNoSections);
        }

        const cleanedData = MetaformUtils.removePermissionGroups(importedData);

        setFormSettings({
          ...formSettings,
          formName: formSettings.formName || "",
          formSections: cleanedData.sections
        });
      } catch (err) {
        errorContext.setError(strings.errorHandling.adminFormsScreen.parsingJsonFile, err);
      }
    };

    reader.readAsText(file);
  };

  /**
   * Handles close icon click
   */
  const handleCloseClick = () => {
    setOpen(!open);
  };

  /**
   * Renders Drawer header
   */
  const renderDrawerHeader = () => {
    return (
      <Stack>
        <Box sx={{
          padding: 2,
          backgroundColor: theme.palette.grey[100],
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
        >
          <Typography variant="h2">
            { strings.editorScreen.drawer.newForm }
          </Typography>
          <Stack direction="row" spacing={ 1 }>
            <IconButton
              sx={{
                border: `1px solid ${valid ? theme.palette.primary.main : theme.palette.text.disabled}`,
                borderRadius: "15px"
              }}
              disabled={ !valid }
              onClick={ handleFormSubmit }
            >
              <Save color={ valid ? "primary" : "disabled" }/>
            </IconButton>
            <RoundActionButton
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                type="file"
                id="file-input"
                accept=".json"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Typography>{ strings.editorScreen.drawer.importJson }</Typography>
            </RoundActionButton>
            <IconButton
              sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: "15px"
              }}
              onClick={ handleCloseClick }
            >
              <Clear color="primary"/>
            </IconButton>
          </Stack>
        </Box>
        <DrawerSection>
          <Typography align="center">
            { strings.editorScreen.drawer.helper }
          </Typography>
        </DrawerSection>
      </Stack>
    );
  };

  /**
   * Renders Drawer info section
   */
  const renderDrawerInfoSection = () => {
    return (
      <DrawerSection>
        <FormLabel required>{ strings.editorScreen.drawer.formInfo }</FormLabel>
        <TextField
          fullWidth
          required
          label={ strings.editorScreen.drawer.formName }
          value={ formSettings.formName }
          onChange={ onInputFieldChange }
          name="formName"
        />
        <TextField
          fullWidth
          disabled
          label={ strings.editorScreen.drawer.formUrl }
          value={ formSettings.formUrl }
          name="formUrl"
        />
      </DrawerSection>
    );
  };

  /**
   * Renders drawer template section
   */
  const renderDrawerTemplateSection = () => (
    <DrawerSection>
      <FormLabel>{ strings.editorScreen.drawer.formTemplates }</FormLabel>
      { loading
        ? <LinearProgress/>
        : (
          <TextField
            select
            label={ strings.editorScreen.drawer.formTemplateSelect }
            value={ selectedTemplate || "" }
            onChange={ e => setSelectedTemplate(e.target.value) }
          >
            <MenuItem value="">
              { strings.editorScreen.drawer.noFormTemplateSelected }
            </MenuItem>
            { templates.map(template =>
              <MenuItem value={template.id} key={template.id}>
                { template.data.title }
              </MenuItem>) }
          </TextField>
        )
      }
    </DrawerSection>
  );

  /**
   * Renders Drawer template section
   */
  const renderDrawerSosmetaTemplateSection = () => {
    return (
      <DrawerSection>
        <FormLabel required>{ strings.editorScreen.drawer.formTemplate }</FormLabel>
        <RadioGroup
          value={ formSettings.formTemplate }
          defaultValue={ true }
          onChange={ onInputFieldChange }
          name="formTemplate"
        >
          <FormControlLabel
            value={ false }
            control={ <Radio/> }
            label={ strings.editorScreen.drawer.formTemplateCustom }
            disabled={ !!selectedTemplate }
          />
          <FormHelperText>
            { strings.editorScreen.drawer.formTemplateCustomHelper }
          </FormHelperText>
          <FormControlLabel
            value={ true }
            control={ <Radio/> }
            label={ strings.editorScreen.drawer.formTemplateSosmeta }
            disabled={ !!selectedTemplate }
          />
          <FormHelperText>
            { strings.editorScreen.drawer.formTemplateSosmetaHelper }
            <Link href="https://sosmeta.thl.fi/document-definitions/list" target="_blank">
              { strings.editorScreen.drawer.formTemplateSosmetaLink }
            </Link>
          </FormHelperText>
        </RadioGroup>
        { formSettings.formTemplate &&
          <TextField
            fullWidth
            label={ strings.editorScreen.drawer.formTemplateSchema }
            value={ formSettings.formSchema }
            onChange={ onInputFieldChange }
            name="formSchema"
          />
        }
      </DrawerSection>
    );
  };

  /**
   * Renders Drawer authentication section
   */
  const renderDrawerAuthenticationSection = () => {
    return (
      <DrawerSection>
        <FormLabel required>{ strings.editorScreen.drawer.formIdentification }</FormLabel>
        <RadioGroup
          value={ formSettings.formAuthentication }
          defaultValue={ true }
          onChange={ onInputFieldChange }
          name="formAuthentication"
        >
          <FormControlLabel value={ false } control={ <Radio/> } label={ strings.editorScreen.drawer.formIdentificationNone }/>
          <Feature
            feature={ FeatureType.STRONG_AUTHENTICATION }
            title={ strings.features.strongAuthentication.title }
            description={ strings.features.strongAuthentication.description }
            strategy={ FeatureStrategy.DISABLE }
          >
            <>
              <FormControlLabel value={ true } control={ <Radio/> } label={ strings.editorScreen.drawer.formIdentificationService }/>
              <FormHelperText>
                { strings.editorScreen.drawer.formIdentificationHelper }
              </FormHelperText>
            </>
          </Feature>
        </RadioGroup>
      </DrawerSection>
    );
  };

  /**
   * Checks if form settings are correctly set
   * If so, allows clicking of Save icon e.g. moving to form editor screen
   */
  const validateFormSettings = () => {
    const templateSectionValid = formSettings.formTemplate ? formSettings.formTemplate && !!formSettings.formSchema : !formSettings.formTemplate;
    setValid(!!formSettings.formName && templateSectionValid);
  };

  /**
   * Resets formSchema field if user un-checks "Sosmeta template" -field.
   */
  const resetFormSchema = () => {
    if (!formSettings.formTemplate) {
      setFormSettings({ ...formSettings, formSchema: "" });
    }
  };

  /**
   * Updates formSlug and formUrl values
   */
  const updateFormSlugAndUrl = () => {
    const updatedSlug = slugify(formSettings.formName, { lower: true });
    setFormSettings({
      ...formSettings,
      formSlug: updatedSlug,
      formUrl: `${currentHostname}/${updatedSlug}`
    });
  };

  useEffect(() => {
    getTemplates();
  }, [open]);

  useEffect(() => {
    applyTemplateToForm();
  }, [selectedTemplate]);

  useEffect(() => {
    if (formSettings.formSchema) {
      handleSosmetaConversion();
    }
  }, [formSettings.formSchema]);

  useEffect(() => {
    validateFormSettings();
  }, [formSettings]);

  useEffect(() => {
    resetFormSchema();
  }, [formSettings.formTemplate]);

  useEffect(() => {
    updateFormSlugAndUrl();
  }, [formSettings.formName]);

  return (
    <Drawer
      PaperProps={{
        sx: {
          width: "20vw",
          minWidth: "400px",
          borderRadius: "15px 0 0 15px"
        }
      }}
      anchor="right"
      open={ open }
      onClose={ toggleDrawerOpen }
    >
      <GenericLoaderWrapper loading={ converting }>
        <FormControl fullWidth>
          { renderDrawerHeader() }
          { renderDrawerInfoSection() }
          { renderDrawerTemplateSection() }
          <Feature
            feature={ FeatureType.SOSMETA}
            strategy={ FeatureStrategy.HIDE}
          >
            { renderDrawerSosmetaTemplateSection() }
          </Feature>
          { renderDrawerAuthenticationSection() }
        </FormControl>
      </GenericLoaderWrapper>
    </Drawer>
  );
};

export default EditorScreenDrawer;