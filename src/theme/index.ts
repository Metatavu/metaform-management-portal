import { createTheme, darkScrollbar } from "@mui/material";

/**
 * Values from default theme to use in custom theme
 */
const { breakpoints, palette } = createTheme();

/**
 * Custom theme for Material UI
 */
export default createTheme({

  palette: {
    primary: {
      main: "#000000"
    },
    secondary: {
      main: "#F9473B",
      light: "#39a849"
    },
    text: {
      primary: "#333333",
      secondary: "#ffffff"
    },
    background: {
      default: "#E0E0E0",
      paper: "#ffffff"
    }
  },

  typography: {
    allVariants: {
      fontFamily: "acumin-pro, sans-serif",
      fontWeight: 400
    },
    h1: {
      fontFamily: "ambroise-std, serif",
      fontWeight: 800,
      fontSize: 42,
      letterSpacing: "0.05em",
      [breakpoints.down("sm")]: {
        fontSize: "1.75rem"
      }
    },
    h2: {
      fontFamily: "ambroise-std, serif",
      fontWeight: 800,
      fontSize: 30
    },
    h3: {
      fontSize: 26
    },
    h4: {
      fontSize: 20
    },
    body1: {
      fontSize: 18
    },
    h5: {
      fontSize: 16
    },
    h6: {
      fontSize: 12
    },
    body2: {
      fontSize: 16,
      lineHeight: 1.63
    }
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@global": {
          a: {
            textDecoration: "none"
          }
        },
        body: palette.mode === "dark" ? darkScrollbar() : null
      }
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: "fixed"
      },
      styleOverrides: {
        root: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        },
        colorPrimary: {
          backgroundColor: "#000"
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          width: "100%"
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "rgba(0, 0, 0, 0.54)"
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small"
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          alignItems: "center",
          justifyContent: "space-between"
        }
      }
    }
  }

});