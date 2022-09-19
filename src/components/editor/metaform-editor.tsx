import { Box, Button, Stack, Typography } from "@mui/material";
import { Metaform, MetaformField, MetaformFieldType, MetaformSection } from "generated/client";
import React from "react";
import { DraggingMode } from "types";
import { DraggableLocation, DropResult, DragStart, DragDropContext } from "react-beautiful-dnd";
import MetaformUtils from "utils/metaform-utils";
import produce from "immer";
import MetaformEditorRightDrawer from "./metaform-editor-right-drawer";
import MetaformEditorLeftDrawer from "./metaform-editor-left-drawer";
import SectionDragHandle from "components/generic/drag-handle/section-drag-handle";
import FieldDragHandle from "components/generic/drag-handle/field-drag-handle";
import { Add } from "@mui/icons-material";
import { EditorContent, EditorSection, EditorWrapper } from "styled/editor/metaform-editor";
import DroppableWrapper from "components/generic/drag-and-drop/droppable-wrapper";
import DraggableWrapper from "components/generic/drag-and-drop/draggable-wrapper";
import DragAndDropUtils from "utils/drag-and-drop-utils";
import AddableFieldRenderer from "./field-renderer/addable-field-renderer";
import strings from "localization/strings";

/**
 * Component properties
 */
interface Props {
  editorRef: React.RefObject<HTMLDivElement>
  pendingForm: Metaform;
  setPendingForm: (metaform: Metaform) => void;
}

/**
 * Metaform editor component
 */
const MetaformEditor: React.FC<Props> = ({
  pendingForm,
  editorRef,
  setPendingForm
}) => {
  const [ selectedFieldIndex, setSelectedFieldIndex ] = React.useState<number>();
  const [ selectedSectionIndex, setSelectedSectionIndex ] = React.useState<number>();
  const [ draggingMode, setDraggingMode ] = React.useState<DraggingMode>();
  
  /**
   * Event handler for empty space click
   */
  const onGlobalClick = (event: MouseEvent) => {
    if (!editorRef.current?.contains(event.target as Node)) {
      return null;
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", onGlobalClick);
    return () => document.removeEventListener("click", onGlobalClick);
  }, []);

  /**
   * Event handler for field add
   *
   * @param fieldType metaform field type
   * @param droppableDestination droppable destination
   */
  const onFieldAdd = (fieldType: MetaformFieldType, droppableDestination: DraggableLocation) => {
    const defaultField = MetaformUtils.createField(fieldType);
    const sectionIndex = parseInt(droppableDestination.droppableId, 10);
    const fieldIndex = droppableDestination.index;

    if (!pendingForm?.sections || fieldIndex < 0) {
      return;
    }

    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex]?.fields?.splice(fieldIndex, 0, defaultField);
    });

    setPendingForm(updatedForm);
    setSelectedFieldIndex(fieldIndex);
    setSelectedSectionIndex(sectionIndex);
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
    const fromSectionIndex = parseInt(droppableSource.droppableId, 10);
    const toSectionIndex = parseInt(droppableDestination.droppableId, 10);

    if (!pendingForm?.sections || fromSectionIndex < 0 || toSectionIndex < 0) {
      return;
    }

    const fromFieldIndex = droppableSource.index;
    const toFieldIndex = droppableDestination.index;

    const updatedForm = produce(pendingForm, formDraft => {
      const draggedField = formDraft.sections?.[fromSectionIndex].fields?.[fromFieldIndex];
      formDraft.sections?.[fromSectionIndex].fields?.splice(fromFieldIndex, 1);
      formDraft.sections?.[toSectionIndex].fields?.splice(toFieldIndex, 0, draggedField!);
    });

    setPendingForm(updatedForm);
    setSelectedFieldIndex(toFieldIndex);
    setSelectedSectionIndex(toSectionIndex);
  };

  /**
   * Event handler for drag start
   *
   * @param initial drag start data
   */
  const onDragStart = (initial: DragStart) => {
    if (!Number.isNaN(parseInt(initial.source.droppableId, 10))) {
      setDraggingMode(DraggingMode.FIELD);
    }

    setDraggingMode(initial.source.droppableId as DraggingMode);
  }; // TODO add field mode in drawer

  /**
   * Event handler for drag end
   *
   * @param result drop result
   */
  const onDragEnd = (result: DropResult) => {
    const { draggableId, source, destination } = result;

    if (!destination) {
      return;
    }

    if (DragAndDropUtils.isMovingSection(draggableId, destination.droppableId)) {
      onSectionMove(source, destination);
    } else if (DragAndDropUtils.isAddingField(source.droppableId, destination.droppableId)) {
      onFieldAdd(draggableId as MetaformFieldType, destination);
    } else if (DragAndDropUtils.isMovingField(draggableId, destination.droppableId)) {
      onSectionFieldMove(source, destination);
    }

    setDraggingMode(undefined);
  };

  /**
   * Event handler for new section add
   */
  const onAddNewSectionClick = () => {
    const createdSection = MetaformUtils.createSection();

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
   * 
   */
  const onSectionClick = (sectionIndex: number) => () => {
    if (selectedSectionIndex !== sectionIndex) {
      setSelectedSectionIndex(sectionIndex);
      setSelectedFieldIndex(undefined);
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
   * Event handler for field delete click
   * if deleted Field is used as visibleIf condition, deletes all visibleIf where it is used
   *
   * @param sectionIndex section index
   * @param fieldIndex field index
   */
  const onFieldDeleteClick = (sectionIndex: number, fieldIndex: number) => () => {
    if (!pendingForm?.sections || pendingForm.sections.length <= sectionIndex) {
      return;
    }

    const section = pendingForm.sections[sectionIndex];
    const field = section.fields?.[fieldIndex];

    if (!section.fields || section.fields.length <= fieldIndex) {
      return;
    }
    const updatedForm = produce(pendingForm, draftForm => {
      draftForm.sections?.[sectionIndex].fields?.splice(fieldIndex, 1);
      draftForm.sections?.forEach(currentSection => {
        if (currentSection.visibleIf) {
          if (currentSection.visibleIf.field === field?.title) {
            delete currentSection.visibleIf;
          }
        }
        currentSection.fields?.forEach(currentField => {
          if (currentField.visibleIf) {
            if (currentField.visibleIf.field === field?.title) {
              delete currentField.visibleIf;
            }
          }
        });
      });
    });
    setSelectedFieldIndex(undefined);
    setPendingForm(updatedForm);
  };

  /**
   * Renders a single form field
   *
   * @param field metaform field
   * @param sectionIndex section index
   * @param fieldIndex field index
   */
  const renderFormField = (field: MetaformField, sectionIndex: number, fieldIndex: number) => {
    const selected = selectedFieldIndex === fieldIndex && selectedSectionIndex === sectionIndex;

    return (
      <DraggableWrapper
        index={ fieldIndex }
        draggableId={ DragAndDropUtils.getFieldDraggableId(sectionIndex, fieldIndex) }
        isDragDisabled={ selectedFieldIndex !== fieldIndex || selectedSectionIndex !== sectionIndex }
      >
        <Box onClick={ onFieldClick(sectionIndex, fieldIndex) }>
          <FieldDragHandle
            selected={ selected }
            onDeleteClick={ onFieldDeleteClick(sectionIndex, fieldIndex) }
          >
            <Typography sx={{ color: "gray", mr: "5px" }}>
              { field.required === true ? `${field.title} *` : field.title }
            </Typography>
            <AddableFieldRenderer
              key="key"
              field={ field }
              fieldId={ DragAndDropUtils.getFieldId(pendingForm, field) }
              fieldLabelId={ DragAndDropUtils.getFieldLabelId(pendingForm, field) }
            />
          </FieldDragHandle>
        </Box>
      </DraggableWrapper>
    );
  };

  /**
   * Renders form section
   *
   * @param section metaform section
   * @param sectionIndex section index
   */
  const renderFormSection = (section: MetaformSection, sectionIndex: number) => (
    <DraggableWrapper
      draggableId={ DragAndDropUtils.getSectionDraggableId(sectionIndex) }
      index={ sectionIndex }
      isDragDisabled={ selectedSectionIndex !== sectionIndex }
    >
      <SectionDragHandle
        selected={ selectedSectionIndex === sectionIndex }
        onDeleteClick={ onSectionDeleteClick(sectionIndex) }
      >
        <EditorSection
          onClick={ onSectionClick(sectionIndex) }
        >
          <Typography variant="h1" sx={{ mb: 0 }}>
            { section.title }
          </Typography>
          <DroppableWrapper
            droppableId={ sectionIndex.toString() }
            isDropDisabled={ draggingMode === DraggingMode.SECTION }
          >
            <Stack spacing={ 2 }>
              { (section.fields && section.fields.length > 0) ?
                section.fields.map((field, index) => renderFormField(field, sectionIndex, index)) :
                <Typography>
                  { strings.draftEditorScreen.editor.emptySection }
                </Typography>
              }
            </Stack>
          </DroppableWrapper>
        </EditorSection>
      </SectionDragHandle>
    </DraggableWrapper>
  );

  /**
   * Renders form editor
   */
  const renderFormEditor = () => (
    <EditorContent spacing={ 2 } ref={ editorRef }>
      <Typography variant="h1">{ pendingForm.title }</Typography>
      <DroppableWrapper
        droppableId={ DraggingMode.SECTION.toString() }
        isDropDisabled={ draggingMode !== DraggingMode.SECTION }
      >
        <Stack spacing={ 2 }>
          { pendingForm.sections?.map(renderFormSection) }
        </Stack>
      </DroppableWrapper>
      <Button
        variant="text"
        startIcon={ <Add/> }
        onClick={ onAddNewSectionClick }
      >
        <Typography>
          { strings.draftEditorScreen.editor.addSection }
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
        fieldIndex={ selectedFieldIndex }
        sectionIndex={ selectedSectionIndex }
      />
    </EditorWrapper>
  );
};

export default MetaformEditor;