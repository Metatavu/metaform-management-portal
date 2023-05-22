import { Delete } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
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
  <Box
    position="relative"
    sx={{
      cursor: "pointer"
    }}
  >
    { children }
    <SectionDraggable visibility={ !selected ? "hidden" : "visible" }>
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