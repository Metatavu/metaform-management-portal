import { IconButton, Stack, TextField, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { selectMetaform } from "features/metaform-slice";
import { MetaformField } from "generated/client";
import produce from "immer";
import React, { FC, useEffect } from "react";
import MetaformUtils from "utils/metaform-utils";
import DeleteIcon from "@mui/icons-material/Delete";
import strings from "localization/strings";
import AddCircleIcon from "@mui/icons-material/AddCircle";

/**
 * Component properties
 */
interface Props {
  updateFormFieldDebounced: (updatedField: MetaformField) => void;
}

/**
 *  Draft editor right drawer classifiers component
 */
const MetaformFieldClassifiersComponent: FC<Props> = ({
  updateFormFieldDebounced
}) => {
  const { metaformVersion, metaformFieldIndex, metaformSectionIndex } = useAppSelector(selectMetaform);
  const pendingForm = MetaformUtils.jsonToMetaform(MetaformUtils.getDraftForm(metaformVersion));
  const [ metaformField, setMetaformField ] = React.useState<MetaformField>();
  const [ classifierName, setClassifierName ] = React.useState<string>("");

  useEffect(() => {
    if (metaformSectionIndex !== undefined && metaformFieldIndex !== undefined) {
      setMetaformField(pendingForm.sections?.[metaformSectionIndex].fields?.[metaformFieldIndex]);
    }
  }, [metaformFieldIndex, metaformSectionIndex, metaformVersion]);

  /**
   * Add a new classifier
   */
  const addNewClassifier = () => {
    if (!metaformField) {
      return;
    }

    const updatedField = produce(metaformField, draftField => {
      draftField.classifiers = [ ...(draftField.classifiers || []), classifierName ];
    });
    setMetaformField(updatedField);
    updateFormFieldDebounced(updatedField);
    setClassifierName("");
  };

  /**
   * Renders a button to add a new field classifier
   */
  const renderNewFieldClassifier = () => (
    <Stack direction="row" justifyContent="space-between">
      <TextField
        value={ classifierName }
        placeholder={ strings.draftEditorScreen.editor.features.field.addNewClassifier }
        fullWidth
        onChange={ e => setClassifierName(e.target.value) }
      />
      <IconButton
        disabled={ !classifierName }
        color="success"
        onClick={ () => addNewClassifier() }
      >
        <AddCircleIcon/>
      </IconButton>
    </Stack>
  );

  /**
   * Update field classifiers
   *
   * @param fieldClassifier field classifier
   * @param classifierIndex indef of the current classifier
   */
  const updateFieldClassifier = (fieldClassifier: string, classifierIndex: number) => {
    if (!metaformField) {
      return;
    }

    const updatedField = produce(metaformField, draftField => {
      draftField.classifiers?.splice(classifierIndex, 1, fieldClassifier);
    });
    setMetaformField(updatedField);
    updateFormFieldDebounced(updatedField);
  };

  /**
   * Delete classifier
   *
   * @param classifierIndex index value of current classifier we are deleting
   */
  const deleteClassifier = (classifierIndex: number) => {
    if (!metaformField) {
      return;
    }

    const updatedField = produce(metaformField, draftField => {
      draftField.classifiers?.splice(classifierIndex, 1);
    });
    setMetaformField(updatedField);
    updateFormFieldDebounced(updatedField);
  };
  
  /**
   * Renders classifier
   *
   * @param classifier classifier
   * @param index index
   */
  const renderClassifierEdit = (classifier: string, index: number) => (
    <Stack
      key={ `column-${index}` }
      direction="row"
      justifyContent="space-between"
    >
      <TextField
        value={ classifier }
        label={ index }
        fullWidth
        onChange={ event => updateFieldClassifier(event.target.value, index)}
      />
      <IconButton
        color="error"
        value={ index }
        onClick={ () => deleteClassifier(index) }
      >
        <DeleteIcon color="error"/>
      </IconButton>
    </Stack>
  );

  /**
   * Renders features for adding, editing and deleting field classifiers
   *
   * @param field field
   */
  const renderClassifierOptions = (field?: MetaformField) => {
    const field2 = field;
    if (field2) {
      return (
        <Stack spacing={ 2 }>
          { field2.classifiers?.map(renderClassifierEdit) }
          { renderNewFieldClassifier() }
        </Stack>
      );
    }
  };

  /**
   * Component render
   */
  return (
    <>
      <Typography variant="subtitle1" style={{ width: "100%" }}>
        { strings.draftEditorScreen.editor.features.field.classifiers }
      </Typography>
      { renderClassifierOptions(metaformField) }
    </>
  );
};

export default MetaformFieldClassifiersComponent;