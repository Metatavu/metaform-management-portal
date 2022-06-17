import { AppBar } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Styled header
 */
export const Root = styled(AppBar, {
  label: "header-root"
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.default,
  display: "flex",
  flexDirection: "row",
  paddingBottom: theme.spacing(2)
}));

export default Root;