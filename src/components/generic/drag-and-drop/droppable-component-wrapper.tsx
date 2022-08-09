import * as React from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import theme from "theme";

/**
 * Component properties
 */
interface Props {
  droppableId: string;
  isDropDisabled: boolean;
}

/**
 * Droppable component wrapper
 *
 * @param props component properties
 */
const DroppableComponentWrapper: React.FC<Props> = ({
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
        style={{
          padding: theme.spacing(2),
          borderRadius: 4,
          backgroundColor: "rgba(0,0,0,0.1)",
          display: "flex",
          flex: 1,
          minWidth: "44%",
          height: 100,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        { children }
        { provided.placeholder }
      </div>
    )}
  </Droppable>
);

export default DroppableComponentWrapper;