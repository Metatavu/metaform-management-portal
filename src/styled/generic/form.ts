import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * Styled metaform container
 */
export const FormContainer = styled(Box, {
  label: "metaform-container"
})(() => ({
  display: "flex",
  overflow: "auto",
  "& .metaform": {
    fontSize: "1rem",
  
    "& p": {
      marginTop: 0
    },
  
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      marginBottom: ".5rem",
      fontWeight: 500,
      lineHeight: 1.2
    },
    
    "& h3": {
      fontSize: "1.75rem"
    },
  
    "& .metaform-field": {
      marginTop: 10
    },
  
    "& fieldset": {
      border: "none",
      padding: 0
    },
    
    "& input[type='text'], & input[type='number'], & input[type='email'], & select, & textarea": {
      width: "100%",
      padding: "10px"
    },
    
    "& input::placeholder, & select::placeholder": {
      color: "#6c757d"
    },
  
    "& .metaform-react-file-value-container": {
      paddingTop: "10px",
      paddingBottom: "10px",
      borderBottom: "1px solid #aaa",
      marginBottom: "10px",
      display: "flex"
    },
  
    "& .metaform-react-file-field-open-button": {
      marginLeft: "auto",
      padding: "5px",
      marginRight: "10px"
    },
  
    "& .metaform-react-file-field-delete-button": {
      padding: "5px"
    },
        
    "& input[type='submit']": {
      padding: "10px 20px",
      fontSize: "18px",
      borderRadius: "0.3rem",
      border: 0,
      background: "#007bff",
      color: "#fff"
    },
  
    "& input[type='submit']:hover": {
      background: "#0069d9"
    },
  
    "& .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root']": {
      padding: 0
    },
  
    "& .MuiAutocomplete-input:first-child": {
      paddingLeft: "10px"
    },
  
    "& .MuiAutocomplete-endAdornment": {
      background: "#fff"
    }
  }
}));

export default FormContainer;