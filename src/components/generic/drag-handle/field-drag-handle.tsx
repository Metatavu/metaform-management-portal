import { Delete } from "@mui/icons-material";
import { IconButton, Stack, SxProps, Theme, alpha } from "@mui/material";
import React from "react";
import theme from "theme";

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
}) => {
  const selectedStyle: SxProps<Theme> = {
    backgroundColor: alpha(theme.palette.secondary.main, 0.02),
    border: "1px solid #000",
    borderRadius: 2,
    borderTopRightRadius: 0,
    p: 2
  };
  
  return (
    <Stack
      position="relative"
      sx={ selected ? selectedStyle : { cursor: "pointer" } }
    >
      { children }
      { selected &&
        <IconButton
          onClick={ onDeleteClick }
          disabled={ !onDeleteClick }
          size="medium"
          sx={{
            position: "absolute",
            right: -56,
            top: -1,
            backgroundColor: "#000",
            padding: 2,
            color: "#fff",
            borderRadius: 4,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            "&:hover": {
              backgroundColor: "#000"
            }
          }}
        >
          <Delete/>
        </IconButton>
      }
    </Stack>
  );
};

export default FieldDragHandle;