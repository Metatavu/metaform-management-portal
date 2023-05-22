import { MenuItem, Stack, TextField, TextareaAutosize } from "@mui/material";
import Api from "api";
import { useApiClient } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import GenericLoaderWrapper from "components/generic/generic-loader";
import { ScriptType } from "generated/client";
import strings from "localization/strings";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * Script edtior
 */
const ScriptEditorScreen: React.FC = () => {
  const [ scriptName, setScriptName ] = useState<string>("");
  const [ scriptType, setScriptType ] = useState<ScriptType>(ScriptType.ExportXlsx);
  const [ scriptContent, setScriptContent ] = useState<string>("");
  const [ loading, setLoading ] = useState(false);
  const params = useParams();
  const { scriptId: foundScriptId } = params;
  const api = useApiClient(Api.getApiClient);
  const errorContext = useContext(ErrorContext);

  /**
   * Loads scriptData
   */
  const loadData = async (scriptId: string) => {
    setLoading(true);

    try {
      const script = await api.scriptsApi.findScript({ scriptId: scriptId });
      setScriptName(script.name);
      setScriptType(script.type);
      setScriptContent(script.content);
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsScreen.listForms, e);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (foundScriptId) {
      loadData(foundScriptId);
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
      </Stack>
    </GenericLoaderWrapper>
  );
};

export default ScriptEditorScreen;