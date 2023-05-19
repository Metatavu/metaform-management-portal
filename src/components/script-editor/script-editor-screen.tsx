import { MenuItem, Stack, TextField, TextareaAutosize } from "@mui/material";
import { ScriptType } from "generated/client";
import strings from "localization/strings";
import React, { useState } from "react";

/**
 * Script edtior
 */
const ScriptEditorScreen: React.FC = () => {
  const [ name, setName ] = useState<String>("");
  const [ scriptType, setScriptType ] = useState<ScriptType>(ScriptType.ExportXlsx);

  return (
    <Stack overflow="hidden" flex={ 1 }>
      <TextField
        value={ name }
        onChange={ ({ target }) => setName(target.value) }
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
        placeholder={ strings.scriptEditorScreen.scriptContent }
        style={{ margin: 20 }}
        minRows={ 30 }
        maxRows={ 30 }
      />
    </Stack>
  );
};

export default ScriptEditorScreen;