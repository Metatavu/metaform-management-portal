import React from "react";
import { Button, Dialog, DialogActions, DialogContent, Divider } from "@mui/material";
import strings from "localization/strings";
import Root from "styled/layouts/basic-layout";
import theme from "theme";
import { alpha } from "@mui/material/styles";
import { DialogTitleWrapper } from "styled/react-components/react-components";
import Config from "app/config";
import { FormLogo } from "styled/layout-components/header";

/**
 * Public forms screen component
*/
const PublicWelcomeScreen: React.FC = () => {
  const { leaveSiteUrl } = Config.get().theme;
  
  if (!leaveSiteUrl) {
    window.location.href = "/admin";
  }

  return (
    <Root>
      { leaveSiteUrl &&
        <>
          <FormLogo/>
          <Dialog open hideBackdrop>
            <DialogTitleWrapper>
              { strings.publicFormsScreen.welcome }
            </DialogTitleWrapper>
            <Divider/>
            <DialogContent sx={{ backgroundColor: alpha(theme.palette.secondary.main, 0.1), textAlign: "center" }}>
              { strings.publicFormsScreen.welcomeInfo }
            </DialogContent>
            <DialogActions sx={{ backgroundColor: alpha(theme.palette.secondary.main, 0.1) }}>
              { Config.get().theme.leaveSiteUrl &&
                <Button
                  variant="outlined"
                  href={Config.get().theme.leaveSiteUrl}
                  fullWidth
                  sx={{ height: 60, textAlign: "center" }}
                >
                  { strings.publicFormsScreen.backToEssote }
                </Button>
              }
              <Button
                variant="outlined"
                href="/admin"
                fullWidth
                sx={{ height: 60, textAlign: "center" }}
              >
                { strings.generic.login }
              </Button>
            </DialogActions>
          </Dialog>
        </>
      }
    </Root>
  );
};

export default PublicWelcomeScreen;