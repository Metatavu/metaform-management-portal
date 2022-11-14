import { AppBar, Box, Select, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Styled header
 */
export const Root = styled(AppBar, {
  label: "header-root"
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer,
  backgroundColor: "transparent",
  padding: `${theme.spacing(2)} 0`
}));

/**
 * Styled logo toolbar content component
 */
export const HeaderToolbar = styled(Toolbar, {
  label: "header-toolbar"
})(() => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
}));

/**
 * Styled logo container component
 */
export const LogoContainer = styled(Box, {
  label: "logo-container"
})(() => ({
  display: "flex",
  width: 150
}));

/**
 * Styled logo container component
 */
export const Logo = styled(Box, {
  label: "logo"
})(({ theme }) => ({
  width: "100%",
  backgroundImage: `url(${theme.logo.logoPath})`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  height: 62
}));

/**
 * Styled select box component
 */
export const HeaderSelect = styled(Select, {
  label: "select-box"
})(() => ({
  ".MuiSvgIcon-root": {
    fill: "white !important"
  },
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(228, 219, 233, 0.5)"
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(228, 219, 233, 0.5)"
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(228, 219, 233, 0.5)"
  },
  color: "#fff",
  borderRadius: "1rem"
}));

export default Root;