import * as React from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";

/**
 * Component properties
 */
interface Props {
  droppableId: string;
  isDropDisabled: boolean;
}

/**
 * Droppable wrapper
 *
 * @param props component properties
 */
const DroppableWrapper: React.FC<Props> = ({
  droppableId,
  isDropDisabled,
  children
}) => (
  <Droppable
    droppableId={ droppableId }
    isDropDisabled={ isDropDisabled }
  >
    {(provided: DroppableProvided) => (
      <div
        ref={ provided.innerRef }
      >
        { children }
        { provided.placeholder }
      </div>
    )}
  </Droppable>
);

export default DroppableWrapper;