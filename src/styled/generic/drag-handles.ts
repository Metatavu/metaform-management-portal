import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";

/**
 * Styled field draggable component
 */
export const FieldDraggable = styled(Stack, {
  label: "field-draggable"
})(({ theme }) => ({
  borderRadius: "0px 0px 20px 20px",
  transition: "height 0.3s ease-in, background-color 0.3s ease-in",
  marginTop: theme.spacing(1),
  justifyContent: "space-between",
  alignItems: "center",
  padding: `0 ${theme.spacing(2)}`,
  height: 50,
  backgroundColor: theme.palette.primary.light,
  cursor: "grabbing",
  flexDirection: "row"
}));

/**
 * Styled section draggable component
 */
export const SectionDraggable = styled(Stack, {
  label: "section-draggable"
})(({ theme }) => ({
  borderRadius: "10px 0px 0px 10px",
  transition: "background-color 0.3s ease-in",
  position: "absolute",
  left: -48,
  top: 0,
  justifyContent: "space-between",
  alignItems: "center",
  padding: `${theme.spacing(1.5)}px 0px`,
  height: 92,
  width: 48,
  backgroundColor: theme.palette.primary.light,
  cursor: "grabbing",
  boxShadow: "0px 3px 10px -1px rgb(0 0 0 / 40%)"
}));