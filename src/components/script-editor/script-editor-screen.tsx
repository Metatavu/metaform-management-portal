import { Save } from "@mui/icons-material";
import { MenuItem, Stack, TextField, TextareaAutosize } from "@mui/material";
import Api from "api";
import { useApiClient } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import GenericLoaderWrapper from "components/generic/generic-loader";
import { ScriptType } from "generated/client";
import strings from "localization/strings";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoundActionButton } from "styled/generic/form";

/**
 * Script edtior
 */
const ScriptEditorScreen: React.FC = () => {
  const [ scriptName, setScriptName ] = useState("");
  const [ scriptType, setScriptType ] = useState<ScriptType>(ScriptType.ExportXlsx);
  const [ scriptContent, setScriptContent ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const params = useParams();
  const { scriptId } = params;
  const api = useApiClient(Api.getApiClient);
  const errorContext = useContext(ErrorContext);
  const navigate = useNavigate();

  /**
   * Loads scriptData
   * 
   * @param id script id
   */
  const loadScriptData = async (id: string) => {
    setLoading(true);

    try {
      const script = await api.scriptsApi.findScript({ scriptId: id });
      setScriptName(script.name);
      setScriptType(script.type);
      setScriptContent(script.content);
    } catch (e) {
      errorContext.setError(strings.errorHandling.scriptEditorScreen.findScript, e);
    }

    setLoading(false);
  };

  /**
   * Saves script data
   */
  const saveScriptData = async () => {
    setLoading(true);

    try {
      const script = {
        id: scriptId,
        name: scriptName,
        type: scriptType,
        language: "js",
        content: scriptContent
      };
      
      if (scriptId) {
        await api.scriptsApi.updateScript({ scriptId: scriptId, script: script });
      } else {
        await api.scriptsApi.createScript({ script: script });
      }

      navigate("/admin/scripts/");
    } catch (e) {
      errorContext.setError(strings.errorHandling.scriptEditorScreen.saveScript, e);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (scriptId) {
      loadScriptData(scriptId);
    }
  }, []);

  return (
    <GenericLoaderWrapper loading={ loading }>
      <Stack overflow="hidden" flex={ 1 }>
        <TextField
          value={ scriptName }
          onChange={ ({ target }) => setScriptName(target.value) }
          style={{ margin: 20 }}
          label={ strings.scriptEditorScreen.scriptName }
        />
        <TextField
          select
          style={{ margin: 20 }}
          label={ strings.scriptEditorScreen.scriptType }
          value={ scriptType }
          onChange={ ({ target }) => setScriptType(target.value as ScriptType) }
        >
          <MenuItem value={ ScriptType.AfterCreateReply }>
            { ScriptType.AfterCreateReply }
          </MenuItem>
          <MenuItem value={ ScriptType.AfterUpdateReply }>
            { ScriptType.AfterUpdateReply }
          </MenuItem>
          <MenuItem value={ ScriptType.ExportXlsx }>
            { ScriptType.ExportXlsx }
          </MenuItem>
        </TextField>
        <TextareaAutosize
          value={ scriptContent }
          onChange={ ({ target }) => setScriptContent(target.value) }
          placeholder={ strings.scriptEditorScreen.scriptContent }
          style={{ margin: 20 }}
          minRows={ 30 }
          maxRows={ 30 }
        />
        <RoundActionButton
          endIcon={ <Save/> }
          onClick={() => saveScriptData() }
          style={{ margin: 20 }}
        >
          { strings.scriptEditorScreen.saveScript }
        </RoundActionButton>
      </Stack>
    </GenericLoaderWrapper>
  );
};

export default ScriptEditorScreen;