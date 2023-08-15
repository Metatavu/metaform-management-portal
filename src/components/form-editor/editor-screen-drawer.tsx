import { Box, Drawer, FormControl, FormControlLabel, FormHelperText, FormLabel, IconButton, Radio, RadioGroup, Stack, TextField, Typography, Link } from "@mui/material";
import { Save, Clear } from "@mui/icons-material";
import strings from "localization/strings";
import React, { FC, useContext, useEffect, useState } from "react";
import theme from "theme";
import { Metaform, MetaformSection, MetaformVisibility } from "generated/client";
import slugify from "slugify";
import SosmetaUtils from "utils/sosmeta-utils";
import GenericLoaderWrapper from "components/generic/generic-loader";
import { ErrorContext } from "components/contexts/error-handler";
import Config from "app/config";
import Feature from "components/containers/feature";
import { FeatureType, FeatureStrategy } from "types";
import { DrawerSection } from "styled/editor/metaform-editor";

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

  /**
   * Toggle drawer
   */
  const toggleDrawerOpen = () => {
    setOpen(!open);
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
   * Renders Drawer template section
   */
  const renderDrawerTemplateSection = () => {
    return (
      <DrawerSection>
        <FormLabel required>{ strings.editorScreen.drawer.formTemplate }</FormLabel>
        <RadioGroup
          value={ formSettings.formTemplate }
          defaultValue={ true }
          onChange={ onInputFieldChange }
          name="formTemplate"
        >
          <FormControlLabel value={ false } control={ <Radio/> } label={ strings.editorScreen.drawer.formTemplateCustom }/>
          <FormHelperText>
            { strings.editorScreen.drawer.formTemplateCustomHelper }
          </FormHelperText>
          <FormControlLabel value={ true } control={ <Radio/> } label={ strings.editorScreen.drawer.formTemplateSosmeta }/>
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
          <Feature
            feature={ FeatureType.SOSMETA}
            strategy={ FeatureStrategy.HIDE}
          >
            { renderDrawerTemplateSection() }
          </Feature>
          { renderDrawerAuthenticationSection() }
        </FormControl>
      </GenericLoaderWrapper>
    </Drawer>
  );
};

export default EditorScreenDrawer;