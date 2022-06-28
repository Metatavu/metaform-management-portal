import { Metaform, MetaformField } from "generated/client";
import { DraggingMode } from "types";

/**
 * Utility class for drag and drop
 */
namespace DragAndDropUtils {
  export const FIELD = "field";
  export const SECTION = "section";
  export const LABEL = "label";

  /**
   * Returns field's id
   *
   * @param metaform metaform
   * @param field metaform field
   *
   * @returns field's id
   */
  export const getFieldId = (metaform: Metaform, field : MetaformField) => `${metaform.id}-${FIELD}-${field.name}`;

  /**
   * Returns field label's id
   *
   * @param metaform metaform
   * @param field metaform field
   * @returns field label's id
   */
  export const getFieldLabelId = (metaform: Metaform, field : MetaformField) =>
    `${getFieldId(metaform, field)}-${LABEL}`;

  /**
   * Returns section draggable id
   *
   * @param sectionIndex section index
   * @returns section draggable id
   */
  export const getSectionDraggableId = (sectionIndex: number) =>
    `${SECTION}-${sectionIndex}`;

  /**
   * Returns field draggable id
   *
   * @param sectionIndex section index
   * @param fieldIndex field index
   * @returns field draggable id
   */
  export const getFieldDraggableId = (sectionIndex: number, fieldIndex: number): string =>
    `${FIELD}-${sectionIndex.toString()}-${fieldIndex.toString()}`;

  /**
   * Is moving section
   *
   * @param draggableId draggable id
   * @param destinationDroppableId field index
   * @returns boolean for true for false
   */
  export const isMovingSection = (draggableId: string, destinationDroppableId: string): boolean =>
    draggableId.startsWith(SECTION) && destinationDroppableId === DraggingMode.SECTION.toString();

  /**
   * Is moving field
   *
   * @param draggableId draggable id
   * @param destinationDroppableId field index
   * @returns boolean for true for false
   */
  export const isMovingField = (draggableId: string, destinationDroppableId: string): boolean =>
    draggableId.startsWith(FIELD) && !Number.isNaN(parseInt(destinationDroppableId, 10));

  /**
   * Is adding field
   *
   * @param sourceDroppableId section index
   * @param destinationDroppableId field index
   * @returns boolean for true for false
   */
  export const isAddingField = (sourceDroppableId: string, destinationDroppableId: string): boolean =>
    sourceDroppableId === DraggingMode.ADD_FIELD.toString() && !Number.isNaN(parseInt(destinationDroppableId, 10));

}

export default DragAndDropUtils;