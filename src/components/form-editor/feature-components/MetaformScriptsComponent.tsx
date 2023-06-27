import { IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useApiClient, useAppSelector } from "app/hooks";
import { selectMetaform } from "features/metaform-slice";
import { Script } from "generated/client";
import produce from "immer";
import React, { FC, useContext, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { RoundActionButton } from "styled/generic/form";
import strings from "localization/strings";
import MetaformUtils from "utils/metaform-utils";
import Api from "api";
import { ErrorContext } from "components/contexts/error-handler";
import GenericLoaderWrapper from "components/generic/generic-loader";

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
    pendingForm.scripts && loadScripts(pendingForm.scripts);
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
    <Stack spacing={ 2 }>
      <TextField
        select
        fullWidth
        label={ strings.draftEditorScreen.scripts.addNewScript }
        value={ newScript }
        onChange={ ({ target }) => setNewScript(availableScripts.find(script => script.id === target.value)) }
      >
        {
          availableScripts.map(script => (
            <MenuItem value={ script.id }>
              { script.name }
            </MenuItem>
          ))
        }
      </TextField>
      <RoundActionButton
        fullWidth
        onClick={ addNewScript }
      >
        <Typography>
          { strings.draftEditorScreen.scripts.addNewScript }
        </Typography>
      </RoundActionButton>
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
      spacing={ 2 }
      direction="row"
      alignItems="center"
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