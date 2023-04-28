import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Config from "app/config";
import theme from "theme";

/**
 * Styled root component
 */
export const Root = styled(Box, {
  label: "basic-layout--root"
})(() => ({
  height: "100vh",
  width: "100vw",
  overflow: "auto",
  display: "grid",
  gridTemplateRows: "auto auto auto 1fr",
  backgroundColor: theme.palette.background.paper,
  backgroundImage: `url(${Config.get().theme.backgroundImagePath})`,
  backgroundPosition: "center",
  backgroundRepeat: " no-repeat",
  backgroundSize: "75%",
  backgroundAttachment: "fixed"
}));

export default Root;