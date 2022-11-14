import { Delete, DragHandle, Edit } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";
import { SectionDraggable } from "styled/generic/drag-handles";

/**
 * Component properties
 */
interface Props {
  selected: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

/**
 * Component for basic section drag handle
 */
const SectionDragHandle: React.FC<Props> = ({
  selected,
  children,
  onEditClick,
  onDeleteClick
}) => (
  <Box position="relative">
    { children }
    <SectionDraggable visibility={ !selected ? "hidden" : "visible" }>
      <DragHandle htmlColor="#fff"/>
      <IconButton
        disabled={ !onEditClick }
        style={{ color: "#fff" }}
        onClick={ onEditClick }
      >
        <Edit/>
      </IconButton>
      <IconButton
        disabled={ !onDeleteClick }
        sx={{ color: "#fff" }}
        onClick={ onDeleteClick }
      >
        <Delete/>
      </IconButton>
    </SectionDraggable>
  </Box>
);

export default SectionDragHandle;