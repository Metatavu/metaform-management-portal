import { Box, Divider, Drawer, FormControl, FormControlLabel, FormHelperText, FormLabel, IconButton, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { Save, Clear } from "@mui/icons-material";
import strings from "localization/strings";
import React, { useEffect, useState } from "react";
import theme from "theme";
import { Metaform } from "generated/client";

/**
 * Component props
 */
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  createMetaform: (metaform: Metaform) => void;
}

/**
 * Interface for Metaforms settings
 */
interface FormSettings {
  formId: string;
  formName: string;
  formUrl: string;
  formTemplate: boolean;
  formSchema: string;
  formIdentification: boolean;
}

/**
 * Editor Screen Drawer component 
 */
const EditorScreenDrawer: React.FC<Props> = ({
  open,
  setOpen,
  createMetaform
}) => {
  const [ formSettings, setFormSettings ] = useState<FormSettings>({
    formId: "",
    formName: "",
    formUrl: "",
    formTemplate: true,
    formSchema: "",
    formIdentification: true
  });
  const [ valid, setValid ] = useState<boolean>(false);

  /**
   * Toggle drawer
   */
  const toggleDrawerOpen = () => {
    setOpen(!open);
  };

  /**
   * Handles Save icon click
   */
  const handleFormSubmit = () => {
    createMetaform({
      allowAnonymous: !formSettings.formIdentification,
      title: formSettings.formName
    });
  };

  /* eslint-disable no-unneeded-ternary */
  /**
   * Event handler for input element change
   * 
   * @param event event
   */
  const onInputFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = event;
    const updatedForm: any = { ...formSettings };
    if (name === "formTemplate" || name === "formIdentification") {
      updatedForm[name] = value === "true" ? true : false;
    } else {
      updatedForm[name] = value;
    }
    setFormSettings(updatedForm);
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
          padding: 2, height: 72, backgroundColor: "#F5F5F5", display: "flex", flexDirection: "row", justifyContent: "space-between"
        }}
        >
          <Typography variant="h4" fontWeight="bold" textAlign="start">
            { strings.editorScreen.drawer.newForm }
          </Typography>
          <Box>
            <IconButton
              sx={{
                border: `1px solid ${valid ? theme.palette.primary.main : theme.palette.text.disabled}`,
                borderRadius: "15px",
                m: 1
              }}
              disabled={ !valid }
              onClick={ handleFormSubmit }
            >
              <Save color={ valid ? "primary" : "disabled" }/>
            </IconButton>
            <IconButton
              sx={{
                border: "1px solid rgba(79, 163, 223, 0.5)",
                borderRadius: "15px",
                m: 1
              }}
              onClick={ handleCloseClick }
            >
              <Clear color="primary"/>
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{ height: 42, justifyContent: "center" }}
        >
          <Typography sx={{ fontSize: 12 }} align="center">
            { strings.editorScreen.drawer.helper }
          </Typography>
        </Box>
      </Stack>
    );
  };

  /**
   * Renders Drawer info section
   */
  const renderDrawerInfoSection = () => {
    return (
      <Box
        sx={{ padding: 2 }}
      >
        <Stack spacing={2}>
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
            label={ strings.editorScreen.drawer.formUrl }
            value={ formSettings.formUrl }
            onChange={ onInputFieldChange }
            name="formUrl"
          />
        </Stack>
      </Box>
    );
  };

  /**
   * Renders Drawer template section
   */
  const renderDrawerTemplateSection = () => {
    return (
      <Box
        sx={{ padding: 2 }}
      >
        <Stack spacing={2}>
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
            </FormHelperText>
          </RadioGroup>
          <TextField
            fullWidth
            label={ strings.editorScreen.drawer.formTemplateSchema }
            value={ formSettings.formSchema }
            disabled={ !formSettings.formTemplate }
            onChange={ onInputFieldChange }
            name="formSchema"
          />
        </Stack>
      </Box>
    );
  };

  /**
   * Renders Drawer identification section
   */
  const renderDrawerIdentificationSection = () => {
    return (
      <Box
        sx={{ padding: 2 }}
      >
        <Stack spacing={2}>
          <FormLabel required>{ strings.editorScreen.drawer.formIdentification }</FormLabel>
          <RadioGroup
            value={ formSettings.formIdentification }
            defaultValue={ true }
            onChange={ onInputFieldChange }
            name="formIdentification"
          >
            <FormControlLabel value={ true } control={ <Radio/> } label={ strings.editorScreen.drawer.formIdentificationService }/>
            <FormHelperText>
              { strings.editorScreen.drawer.formIdentificationHelper }
            </FormHelperText>
            <FormControlLabel value={ false } control={ <Radio/> } label={ strings.editorScreen.drawer.formIdentificationNone }/>
          </RadioGroup>
        </Stack>
      </Box>
    );
  };

  useEffect(() => {
    const templateSectionValid = formSettings.formTemplate ? formSettings.formTemplate && !!formSettings.formSchema : !formSettings.formTemplate;
    setValid(!!formSettings.formName && templateSectionValid);
  }, [formSettings]);

  useEffect(() => {
    if (!formSettings.formTemplate) {
      setFormSettings({ ...formSettings, formSchema: "" });
    }
  }, [formSettings.formTemplate]);

  return (
    <Drawer
      PaperProps={{
        sx: {
          width: "400px", borderRadius: "15px 0 0 15px"
        }
      }}
      anchor="right"
      open={ open }
      onClose={ toggleDrawerOpen }
    >
      <Stack spacing={2} direction="column">
        <FormControl
          fullWidth
        >
          { renderDrawerHeader() }
          <Divider/>
          { renderDrawerInfoSection() }
          <Divider/>
          { renderDrawerTemplateSection() }
          <Divider/>
          { renderDrawerIdentificationSection() }
        </FormControl>
      </Stack>
    </Drawer>
  );
};

export default EditorScreenDrawer;