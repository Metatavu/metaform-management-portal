import { Add, Delete, DragHandle } from "@mui/icons-material";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { FieldDraggable } from "styled/generic/drag-handles";
import React from "react";

/**
 * Component properties
 */
interface Props {
  selected: boolean;
  onDeleteClick?: () => void;
}

/**
 * Component for field drag handle
 */
const FieldDragHandle: React.FC<Props> = ({
  selected,
  children,
  onDeleteClick
}) => (
  <Stack>
    { children }
    <FieldDraggable sx={{ ...(!selected && { height: 0 }) }}>
      { selected &&
        <>
          <Button disabled style={{ color: "#fff" }} startIcon={ <Add/> }/>
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
    </FieldDraggable>
  </Stack>
);

export default FieldDragHandle;