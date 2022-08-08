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
      main: "#4FA3DF",
      dark: "#375AA3"
    },
    secondary: {
      main: "#4FA3DF",
      dark: "#fff"
    },
    text: {
      primary: "#333333",
      secondary: "#222"
    },
    background: {
      default: "#405da3",
      paper: "#ffffff"
    }
  },

  typography: {
    allVariants: {
      fontFamily: "poppins, sans-serif"
    },
    h1: {
      fontWeight: 600,
      fontSize: 24,
      [breakpoints.down("sm")]: {
        fontSize: "1.75rem"
      }
    },
    h2: {
      fontWeight: 600,
      fontSize: 20
    },
    h3: {
      fontWeight: 100,
      fontSize: 20
    },
    h4: {
      fontWeight: 100,
      fontSize: 16
    },
    body1: {
      fontSize: 16
    },
    h5: {
      fontSize: 16
    },
    h6: {
      fontSize: 12
    },
    body2: {
      fontSize: 14
    },
    subtitle2: {
      fontSize: 14,
      color: "#fff",
      fontWeight: 600
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
        body: {
          ...palette.mode === "dark" ? darkScrollbar() : null
        }
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
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0
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
    },
    MuiListItemText: {
      defaultProps: {
        primaryTypographyProps: {
          fontSize: 24,
          fontWeight: 600
        },
        secondaryTypographyProps: {
          fontSize: 16,
          fontWeight: 600,
          color: palette.grey[400]
        }
      }
    },
    MuiButton: {
      defaultProps: {
        variant: "outlined"
      }
    },
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          color: "rgba(0, 0, 0, 0.54)"
        },
        root: {
          flex: 1
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          padding: 0
        },
        notchedOutline: {
          borderColor: "#fff !important",
          ":hover": {
            borderColor: "#fff"
          }
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#fff !important"
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          padding: "0.5rem 0",
          borderRadius: "0.5rem",
          border: "1px solid rgba(0, 0, 0, .5)",
          maxHeight: 50,
          display: "flex",
          alignItems: "center"
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: "100%"
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "none"
        }
      }
    }
  }

});