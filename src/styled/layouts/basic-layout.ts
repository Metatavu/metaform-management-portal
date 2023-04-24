import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
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
  backgroundImage: `url(${process.env.REACT_APP_THEME_BACKGROUNDIMAGE_PATH})`,
  backgroundPosition: "center",
  backgroundRepeat: " no-repeat",
  backgroundSize: "75%",
  backgroundAttachment: "fixed"
}));

export default Root;