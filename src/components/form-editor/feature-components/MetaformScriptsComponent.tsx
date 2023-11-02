import { IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useApiClient, useAppSelector } from "app/hooks";
import { selectMetaform } from "features/metaform-slice";
import { Script } from "generated/client";
import produce from "immer";
import React, { FC, useContext, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import strings from "localization/strings";
import MetaformUtils from "utils/metaform-utils";
import Api from "api";
import { ErrorContext } from "components/contexts/error-handler";
import GenericLoaderWrapper from "components/generic/generic-loader";
import AddCircleIcon from "@mui/icons-material/AddCircle";

/**
 * Component properties
 */
interface Props {
  updateFormScripts: (scripts: Script[]) => void;
}

/**
 *  Draft editor left drawer scripts component
 */
const MetaformScriptsComponent: FC<Props> = ({
  updateFormScripts
}) => {
  const [ loading, setLoading ] = useState(false);
  const errorContext = useContext(ErrorContext);
  const [ newScript, setNewScript ] = useState<Script>();
  const [ formScripts, setFormScripts ] = useState<Script[]>([]);
  const [ scripts, setScripts ] = useState<Script[]>([]);
  const [ availableScripts, setAvailableScripts ] = useState<Script[]>([]);
  const { metaformVersion } = useAppSelector(selectMetaform);
  const pendingForm = MetaformUtils.jsonToMetaform(MetaformUtils.getDraftForm(metaformVersion));
  const api = useApiClient(Api.getApiClient);

  /**
   * Load scripts
   * 
   * @param scriptIds script ids
   */
  const loadScripts = async (scriptIds: string[]) => {
    setLoading(true);

    try {
      const loadedScripts = await api.scriptsApi.listScripts();
      setScripts(loadedScripts);
      setFormScripts(loadedScripts.filter(script => scriptIds.includes(script.id!!)));
      setAvailableScripts(loadedScripts.filter(script => !scriptIds.includes(script.id!!)));
    } catch (e) {
      errorContext.setError(strings.errorHandling.draftEditorScreen.loadScripts, e);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadScripts(pendingForm.scripts?.length ? pendingForm.scripts : []);
  }, [metaformVersion]);

  /**
   * Add a new script
   */
  const addNewScript = () => {
    if (!newScript) {
      return;
    }

    const updatedFormScripts = [ ...formScripts, newScript ];
    setFormScripts(updatedFormScripts);
    setAvailableScripts(scripts.filter(script => !updatedFormScripts.map(formScript => formScript.id).includes(script.id!!)));

    setNewScript(undefined);

    updateFormScripts(updatedFormScripts);
  };

  /**
   * Renders available scripts and a button to add one to the form
   */
  const renderNewFormScript = () => (
    <Stack direction="row">
      <TextField
        select
        fullWidth
        label={ strings.draftEditorScreen.scripts.addNewScript }
        value={ newScript }
        onChange={ ({ target }) => setNewScript(availableScripts.find(script => script.id === target.value)) }
      >
        {
          availableScripts.length > 0 ?
            availableScripts.map(script => (
              <MenuItem value={ script.id } key={ script.id }>
                { script.name }
              </MenuItem>
            )) :
            <MenuItem key="no-scripts">
              { strings.draftEditorScreen.scripts.noScripts }
            </MenuItem>
        }
      </TextField>
      <IconButton
        color="success"
        disabled={ !newScript }
        onClick={ addNewScript }
      >
        <AddCircleIcon/>
      </IconButton>
    </Stack>
  );

  /**
   * Delete scripts
   *
   * @param scriptIndex index value of current script we are deleting
   */
  const deleteScripts = (scriptIndex: number) => {
    if (!formScripts) {
      return;
    }

    const updatedFormScripts = produce(formScripts, draftScripts => {
      draftScripts.splice(scriptIndex, 1);
    });

    setFormScripts(updatedFormScripts);
    setAvailableScripts(scripts.filter(script => !updatedFormScripts.map(formScript => formScript.id).includes(script.id!!)));
    updateFormScripts(updatedFormScripts);
  };
  
  /**
   * Renders a button for removing a script
   *
   * @param script script
   * @param index index
   */
  const renderRemoveScriptButton = (script: Script, index: number) => (
    <Stack
      key={ `column-${index}` }
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography>{ script.name }</Typography>
      <IconButton
        color="error"
        value={ index }
        onClick={ () => deleteScripts(index) }
      >
        <DeleteIcon color="error"/>
      </IconButton>
    </Stack>
  );

  /**
   * Renders features for adding and removing form scripts
   */
  const renderScriptOptions = () => {
    return (
      <GenericLoaderWrapper loading={ loading }>
        <Stack spacing={ 2 }>
          { formScripts.map(renderRemoveScriptButton) }
          { renderNewFormScript() }
        </Stack>
      </GenericLoaderWrapper>
    );
  };

  /**
   * Component render
   */
  return (
    <>
      <Typography variant="subtitle1" style={{ width: "100%" }}>
        { strings.draftEditorScreen.scripts.scripts }
      </Typography>
      { renderScriptOptions() }
    </>
  );
};

export default MetaformScriptsComponent;