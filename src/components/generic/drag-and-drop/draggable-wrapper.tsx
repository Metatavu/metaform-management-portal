import * as React from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";

/**
 * Component properties
 */
interface Props {
  index: number;
  draggableId: string;
  isDragDisabled: boolean;
}

/**
 * Draggable wrapper component
 *
 * @param props component properties
 */
const DraggableWrapper: React.FC<Props> = ({
  index,
  draggableId,
  isDragDisabled,
  children
}) => (
    <Draggable
      index={ index }
      draggableId={ draggableId }
      isDragDisabled={ isDragDisabled }
    >
      { (providedDraggable: DraggableProvided, _) => (
        <div
          ref={ providedDraggable.innerRef }
          { ...providedDraggable.draggableProps }
          { ...providedDraggable.dragHandleProps }
        >
          { children }
        </div>
      ) }
    </Draggable>
  );

export default DraggableWrapper;