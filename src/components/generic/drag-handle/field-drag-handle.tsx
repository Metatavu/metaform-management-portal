import { Add, Delete, DragHandle } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
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
          {/* TODO add option to field */}
          <Button
            variant="text"
            disabled
            sx={{ color: "#fff" }}
            startIcon={ <Add/> }
          />
          <DragHandle htmlColor="#fff"/>
          <IconButton
            disabled={ !onDeleteClick }
            sx={{ color: "#fff" }}
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