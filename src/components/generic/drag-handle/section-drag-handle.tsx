import { Delete, DragHandle } from "@mui/icons-material";
import { Box, IconButton, Stack } from "@mui/material";
import React from "react";
import { SectionDraggable } from "styled/generic/drag-handles";

/**
 * Component properties
 */
interface Props {
  selected: boolean;
  onDeleteClick?: () => void;
}

/**
 * Component for basic section drag handle
 */
const SectionDragHandle: React.FC<Props> = ({
  selected,
  children,
  onDeleteClick
}) => (
  <Box position="relative">
    { children }
    <SectionDraggable sx={{ ...(!selected && { width: 0 }) }}>
      { selected &&
        <>
          <DragHandle htmlColor="#fff"/>
          <IconButton
            disabled={ !onDeleteClick }
            style={{ color: "#fff" }}
            onClick={ onDeleteClick }
          >
            <Delete/>
          </IconButton>
        </>
      }
    </SectionDraggable>
  </Box>
);


export default SectionDragHandle;