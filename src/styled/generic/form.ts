import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import theme from "theme";

/**
 * Styled metaform container
 */
export const FormContainer = styled(Box, {
  label: "metaform-container"
})(() => ({
  display: "flex",
  overflow: "auto",
  justifyContent: "center",
  
  "& .metaform": {
    maxWidth: "50vw",
    flexDirection: "column",
    display: "flex",

    "& section": {
      border: "none",
      borderRadius: "0.5rem",
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      backgroundColor: "#fff",
      boxShadow: "5px 5px 5px rgba(0,0,0,0.5)"
    },

    "& fieldset": {
      padding: 0,
      border: "none"
    },

    "& .metaform-field": {
      marginBottom: theme.spacing(1)
    },

    "& .metaform-field-label": {
      color: "rgba(0,0,0,.5)"
    },

    "& h1": {
      textAlign: "center",
      color: theme.palette.secondary.dark
    },

    "& h2": {
      fontWeight: 600,
      fontSize: 20,
      paddingBottom: theme.spacing(1)
    },

    "& h3": {
      fontWeight: 100,
      fontSize: 20
    }
  }
}));

export default FormContainer;