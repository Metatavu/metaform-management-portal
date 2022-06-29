import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

/**
 * Styled root component
 */
export const Root = styled(Box, {
  label: "basic-layout--root"
})(() => ({
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  display: "grid",
  gridTemplateRows: "auto auto auto 1fr",
  background: "linear-gradient(180deg, #375AA3 0%, #4FA3DF 100%)"
}));

export default Root;