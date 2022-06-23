import { Box, Button, FormControl, InputLabel, OutlinedInput, Paper, Stack, TextField, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformFieldType, MetaformSection } from "generated/client";
import strings from "localization/strings";
import React from "react";
import { DraggingMode } from "types";
import { DraggableLocation, DropResult, ResponderProvided, DragStart, DragDropContext, Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";
import MetaformUtils from "utils/metaform";
import produce from "immer";
import MetaformEditorRightDrawer from "./metaform-editor-right-drawer";
import MetaformEditorLeftDrawer from "./metaform-editor-left-drawer";
import metaform from "utils/metaform";
import SectionDragHandle from "components/generic/drag-handle/section-drag-handle";
import FieldDragHandle from "components/generic/drag-handle/field-drag-handle";
import { Add } from "@mui/icons-material";
import { EditorContent, EditorWrapper } from "styled/editor/metaform-editor";

/**
 * Component properties
 */
interface Props {
  pendingForm: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Draft editor screen component
 */
const MetaformEditor: React.FC<Props> = ({
  pendingForm,
  setPendingForm
}) => {
  const [ selectedFieldIndex, setSelectedFieldIndex ] = React.useState<number>();
  const [ selectedSectionIndex, setSelectedSectionIndex ] = React.useState<number>();
  const [ draggingMode, setDraggingMode ] = React.useState<DraggingMode>();

  /**
   * Event handler for field add
   *
   * @param fieldType metaform field type
   * @param droppableSource droppable source
   * @param droppableDestination droppable destination
   */
  const onFieldAdd = (fieldType: MetaformFieldType, droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
    const defaultField = MetaformUtils.createEmptyField(fieldType);
    const sectionId = parseInt(droppableDestination.droppableId);
    const fieldId = droppableDestination.index;

    if (!pendingForm?.sections || sectionId < 0) {
      return;
    }

    const updatedSection = { ...pendingForm.sections[sectionId] };
    updatedSection.fields?.splice(fieldId, 0, defaultField);
    const updatedSections = [ ...pendingForm.sections ];
    updatedSections.splice(sectionId, 1, updatedSection);

    const updatedMetaform = {
      ...pendingForm,
      sections: updatedSections
    } as Metaform;

    setPendingForm(updatedMetaform);
    setSelectedFieldIndex(fieldId);
    setSelectedSectionIndex(sectionId);
  };

  /**
   * Event handler for section move
   *
   * @param droppableSource droppable source
   * @param droppableDestination droppable destination
   */
  const onSectionMove = (droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
    const originSectionIndex = droppableSource.index;
    const destinationSectionIndex = droppableDestination.index;

    if (!pendingForm?.sections || originSectionIndex < 0 || destinationSectionIndex < 0) {
      return;
    }

    const updatedForm = produce(pendingForm, formDraft => {
      const draggedSection = formDraft?.sections?.[originSectionIndex];
      formDraft?.sections?.splice(originSectionIndex, 1);
      formDraft?.sections?.splice(destinationSectionIndex, 0, draggedSection!);
    });

    setPendingForm(updatedForm);
    setSelectedSectionIndex(destinationSectionIndex);
  };

  /**
   * Event handler for field move
   *
   * @param droppableSource droppable source
   * @param droppableDestination droppable destination
   */
  const onSectionFieldMove = (droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
    const fromSectionId = parseInt(droppableSource.droppableId);
    const toSectionId = parseInt(droppableDestination.droppableId);

    if (!pendingForm?.sections || fromSectionId < 0 || toSectionId < 0) {
      return;
    }

    const fromFieldId = droppableSource.index;
    const toFieldId = droppableDestination.index;

    const updatedForm = produce(pendingForm, formDraft => {
      const draggedField = formDraft.sections?.[fromSectionId].fields?.[fromFieldId];
      formDraft.sections?.[fromSectionId].fields?.splice(fromFieldId, 1);
      formDraft.sections?.[toSectionId].fields?.splice(toFieldId, 0, draggedField!);
    });

    setPendingForm(updatedForm);
    setSelectedFieldIndex(toFieldId);
    setSelectedSectionIndex(toSectionId);
  };

  /**
   * Event handler for drag start
   *
   * @param initial drag start data
   * @param provided responder provided
   */
  const onDragStart = (initial: DragStart, provided: ResponderProvided) => {
    const { source } = initial;

    switch (source.droppableId) {
      case "componentList":
        setDraggingMode(DraggingMode.FIELD);
        break;
      case "sectionList":
        setDraggingMode(DraggingMode.SECTION);
        break;
    }
  };

  /**
   * Event handler for drag end
   *
   * @param result drop result
   * @param provided responder provided
   */
  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { draggableId, source, destination } = result;

    if (!destination) {
      return;
    }

    // from section list
    if (draggableId.startsWith("section") && destination.droppableId === "sectionList") {
      onSectionMove(source, destination);
    // from section
    } else if (draggableId.startsWith("field") && !isNaN(parseInt(destination.droppableId))) {
      onSectionFieldMove(source, destination);
    // from component list
    } else if (source.droppableId === "componentList" && !isNaN(parseInt(destination.droppableId))) {
      onFieldAdd(
        draggableId as MetaformFieldType,
        source,
        destination
      );
    }

    setDraggingMode(undefined);
  };

  // /**
  //  * Event handler for empty space click
  //  */
  // const onGlobalClick = (event: MouseEvent) => {
  //   if (editorRef && editorRef.current && !editorRef.current.contains(event.target as Node)) {

  //     setSelectedFieldIndex(undefined);
  //     setSelectedSectionIndex(undefined);
  //   }
  // }

  /**
   * Returns field's id
   *
   * @param field metaform field
   *
   * @returns field's id
   */
  const getFieldId = (field : MetaformField) => {
    return `${pendingForm.id}-field-${field.name}`;
  };

  /**
   * Returns field label's id
   *
   * @param field metaform field
   * @returns field label's id
   */
  const getFieldLabelId = (field : MetaformField) => {
    return `${getFieldId(field)}-label`;
  };

  /**
   * Event handler for new section add
   */
  const onAddNewSectionClick = () => {
    const createdSection = MetaformUtils.createEmptySection();

    const updatedForm = produce(pendingForm, draftForm => {
      !draftForm.sections && (draftForm.sections = []);
      draftForm.sections?.push(createdSection);
    });

    setPendingForm(updatedForm);
  };

  /**
   * Event handler for section click
   *
   * @param sectionIndex section index
   */
  const onSectionClick = (sectionIndex: number) => () => {
    if (selectedSectionIndex !== sectionIndex) {
      setSelectedFieldIndex(undefined);
      setSelectedSectionIndex(sectionIndex);
    }
  };

  /**
   * Event handler for field click
   *
   * @param sectionIndex section index
   * @param fieldIndex field index
   */
  const onFieldClick = (sectionIndex: number, fieldIndex: number) => () => {
    setSelectedFieldIndex(fieldIndex);
    setSelectedSectionIndex(sectionIndex);
  };

  /**
   * Event handler for section delete click
   *
   * @param sectionIndex section index
   */
  const onSectionDeleteClick = (sectionIndex: number) => () => {
    if (!pendingForm?.sections || pendingForm.sections.length <= sectionIndex) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.splice(sectionIndex, 1);
    });

    setPendingForm(updatedForm);
    setSelectedFieldIndex(undefined);
    setSelectedSectionIndex(undefined);
  };

  /**
   * Event handler for field update
   *
   * @param sectionIndex  section index
   * @param fieldIndex field index
   */
  const onFieldUpdate = (sectionIndex: number, fieldIndex: number) => (newMetaformField: MetaformField) => {
    const updatedMetaform = {
      ...metaform
    } as Metaform;

    const field = pendingForm.sections?.[sectionIndex]?.fields?.[fieldIndex];

    if (!pendingForm?.sections || !field) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 1, newMetaformField);
    });

    setPendingForm(updatedForm);
  };

  /**
   * Event handler for field delete click
   *
   * @param sectionIndex section index
   * @param fieldIndex field index
   */
  const onFieldDeleteClick = (sectionIndex: number, fieldIndex: number) => () => {
    if (!pendingForm?.sections || pendingForm.sections.length <= sectionIndex) {
      return;
    }

    const section = pendingForm.sections[sectionIndex];

    if (!section.fields || section.fields.length <= fieldIndex) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex].fields?.splice(fieldIndex, 1);
    });

    setPendingForm(updatedForm);
    setSelectedFieldIndex(undefined);
  };

  /**
  * Renders form editor components
  *
  * @param field metaform field
  * @param sectionIndex section index
  * @param fieldIndex field index
  */
  const renderInput = (field: MetaformField, sectionIndex: number, fieldIndex: number) => {
    return (
      <TextField
        key={ getFieldId(field) }
        value={ getFieldId(field) }
        label={ getFieldLabelId(field) }
      />
    );
    // TODO add all the component
    // switch (field.type) {
    //   case MetaformFieldType.Text:
    //     return (
    //       <MetaformTextFieldComponent
    //         field={ field }
    //         fieldLabelId={ getFieldLabelId(field) }
    //         fieldId={ getFieldId(field) }
    //         onFieldUpdate={ onFieldUpdate(sectionIndex, fieldIndex) }
    //       />
    //     );
    //   case MetaformFieldType.Html:
    //     return (
    //       <MetaformHtmlComponent
    //         fieldLabelId={ getFieldLabelId(field) }
    //         fieldId={ getFieldId(field) }
    //         field={ field }
    //         onFieldUpdate={ onFieldUpdate(sectionIndex, fieldIndex) }
    //       />
    //     );
    //   case MetaformFieldType.Radio:
    //     return (
    //       <MetaformRadioFieldComponent
    //         fieldLabelId={ getFieldLabelId(field) }
    //         fieldId={ getFieldId(field) }
    //         field={ field }
    //         onFieldUpdate={ onFieldUpdate(sectionIndex, fieldIndex) }
    //       />
    //     );
    //   case MetaformFieldType.Submit:
    //     return (
    //       <MetaformSubmitFieldComponent
    //         fieldId={ getFieldId(field) }
    //         field={ field }
    //         onFieldUpdate={ onFieldUpdate(sectionIndex, fieldIndex) }
    //       />
    //     );
    //   case MetaformFieldType.Number:
    //     return (
    //       <MetaformNumberFieldComponent
    //         fieldLabelId={ getFieldLabelId(field) }
    //         fieldId={ getFieldId(field) }
    //         field={ field }
    //         onFieldUpdate={ onFieldUpdate(sectionIndex, fieldIndex) }
    //       />
    //     );
    //   default:
    //     return (
    //       <div style={{ color: "red" }}>
    //         `$
    //         { strings.formEditScreen.unknownFieldType }
    //         : $
    //         { field.type }
    //         `
    //       </div>
    //     );
    // }
  };

  /**
   * Renders form section
   *
   * @param section metaform section
   * @param sectionIndex section index
   */
  const renderFormSection = (section: MetaformSection, sectionIndex: number) => (
    <Draggable
      draggableId={ `section-${sectionIndex}` }
      index={ sectionIndex }
      isDragDisabled={ selectedSectionIndex !== sectionIndex }
    >
      {(providedDraggable:DraggableProvided, snapshotDraggable:DraggableStateSnapshot) => (
        <div
          ref={ providedDraggable.innerRef }
          { ...providedDraggable.draggableProps }
          { ...providedDraggable.dragHandleProps }
        >
          <SectionDragHandle
            selected={ selectedSectionIndex === sectionIndex }
            onDeleteClick={ onSectionDeleteClick(sectionIndex) }
          >
            <Droppable droppableId={ sectionIndex.toString() } isDropDisabled={ draggingMode !== DraggingMode.FIELD }>
              {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                <Paper
                  onClick={ onSectionClick(sectionIndex) }
                  // className={
                  //   classNames(
                  //     classes.formEditorSection,
                  //     { draggingOver: !(selectedSectionIndex === sectionIndex) && snapshot.isDraggingOver },
                  //     { selected: selectedSectionIndex === sectionIndex }
                  //   )
                  // }
                >
                  <div ref={ provided.innerRef } >
                    <Stack spacing={ 2 }>
                      { (section.fields && section.fields.length > 0) ?
                        section.fields.map((field, index) => renderFormField(field, sectionIndex, index)) :
                        <Typography>
                          strings.formEditScreen.emptySection
                        </Typography>
                      }
                    </Stack>
                  </div>
                </Paper>
              )}
            </Droppable>
          </SectionDragHandle>
        </div>
      )}
    </Draggable>
  );

  /**
     * Renders a single form field
     *
     * @param section metaform section
     * @param sectionIndex section index
     * @param fieldIndex field index
     */
  const renderFormField = (field: MetaformField, sectionIndex: number, fieldIndex: number) => {
    const selected = selectedFieldIndex === fieldIndex && selectedSectionIndex === sectionIndex;

    return (
      <Draggable
        index={ fieldIndex }
        draggableId={ `field-${sectionIndex.toString()}-${fieldIndex.toString()}` }
        isDragDisabled={ selectedFieldIndex !== fieldIndex || selectedSectionIndex !== sectionIndex }
      >
        {(providedDraggable:DraggableProvided, snapshotDraggable:DraggableStateSnapshot) => (
          <div
            ref={ providedDraggable.innerRef }
            { ...providedDraggable.draggableProps }
            { ...providedDraggable.dragHandleProps }
          >
            <Box onClick={ onFieldClick(sectionIndex, fieldIndex) }>
              <FieldDragHandle
                selected={ selected }
                onDeleteClick={ onFieldDeleteClick(sectionIndex, fieldIndex) }
              >
                { renderInput(field, sectionIndex, fieldIndex) }
              </FieldDragHandle>
            </Box>
          </div>
        )}
      </Draggable>
    );
  };

  /**
   * Renders form editor
   */
  const renderFormEditor = () => (
    <EditorContent spacing={ 2 }>
      <Typography variant="h1">{ pendingForm.title }</Typography>
      <Droppable droppableId="sectionList" isDropDisabled={ draggingMode !== DraggingMode.SECTION }>
        {/* TODO DND generic component? */}
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div ref={ provided.innerRef } style={{ width: "100%" }}>
            <Stack spacing={ 2 }>
              { pendingForm.sections?.map(renderFormSection) }
            </Stack>
          </div>
        )}
      </Droppable>
      <Button
        variant="text"
        startIcon={ <Add/> }
        onClick={ onAddNewSectionClick }
      >
        <Typography>
          TODO add new section
        </Typography>
      </Button>
    </EditorContent>
  );

  /**
   * Component render
   */
  return (
    <EditorWrapper>
      <DragDropContext onDragEnd={ onDragEnd } onDragStart={ onDragStart }>
        <MetaformEditorLeftDrawer
          pendingForm={ pendingForm }
          setPendingForm={ setPendingForm }
        />
        { renderFormEditor() }
      </DragDropContext>
      <MetaformEditorRightDrawer
        pendingForm={ pendingForm }
        setPendingForm={ setPendingForm }
      />
    </EditorWrapper>
  );
};

export default MetaformEditor;