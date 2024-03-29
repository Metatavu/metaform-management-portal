import { createTheme, darkScrollbar } from "@mui/material";
import Config from "app/config";
import ThemeUtils from "utils/theme-utils";

/**
 * Values from default theme to use in custom theme
 */
const { breakpoints, palette } = createTheme();

/**
 * Custom theme for Material UI
 */
export default createTheme({

  sectionTitle: {
    fontFamily: Config.get().theme.fontFamily,
    fontWeight: 200,
    fontSize: 26
  },

  header: {
    background: ThemeUtils.getHeaderBackgroundColor(),
    main: ThemeUtils.getHeaderTextColor()
  },

  palette: {
    primary: {
      main: "#000000",
      contrastText: ThemeUtils.getContrastTextColor(Config.get().theme.paletteSecondaryMain)
    },
    secondary: {
      main: Config.get().theme.paletteSecondaryMain,
      light: ThemeUtils.lightenColor(Config.get().theme.paletteSecondaryMain, 0.9)
    },
    background: {
      default: "#666",
      paper: "#fff"
    },
    warning: {
      main: "#ff9800"
    },
    error: {
      main: "#f44336"
    },
    success: {
      main: "#4caf50"
    }
  },

  typography: {
    allVariants: {
      fontFamily: Config.get().theme.fontFamily
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
      fontWeight: 400,
      fontSize: 18
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
    subtitle1: {
      color: palette.text.secondary,
      fontWeight: 600
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
          justifyContent: "space-between",
          paddingInline: "16px !important"
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
    MuiAccordion: {
      styleOverrides: {
        root: {
          width: "100%"
        }
      },
      defaultProps: {
        elevation: 0
      }
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          backgroundOpacity: 0.5,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.25)",
          "@media (min-width: 600px)": {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: "#000",
          borderRadius: 0,
          padding: 20,
          paddingTop: 25,
          width: "90%",
          "@media (min-width: 400px)": {
            width: 500
          }
        },
        icon: {
          fontSize: 28
        }
      }
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontSize: 20,
          fontWeight: 600,
          color: "#fff"
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&.MuiInputBase-input": {
            whiteSpace: "normal"
          }
        }
      }
    }
  }

});