import React from "react";
import { Button, Dialog, DialogActions, DialogContent, Divider } from "@mui/material";
import strings from "localization/strings";
import Root from "styled/layouts/basic-layout";
import theme from "theme";
import { alpha } from "@mui/material/styles";
import { DialogTitleWrapper } from "styled/react-components/react-components";

/**
 * Public forms screen component
 */
const PublicWelcomeScreen: React.FC = () => {
  return (
    <Root>
      <Dialog open hideBackdrop>
        <DialogTitleWrapper>
          { strings.publicFormsScreen.welcome }
        </DialogTitleWrapper>
        <Divider/>
        <DialogContent sx={{ backgroundColor: alpha(theme.palette.secondary.main, 0.1), textAlign: "center" }}>
          { strings.publicFormsScreen.welcomeInfo }
        </DialogContent>
        <DialogActions sx={{ backgroundColor: alpha(theme.palette.secondary.main, 0.1) }}>
          <Button
            variant="outlined"
            href="https://etelasavonha.fi/"
            fullWidth
            sx={{ height: 60, textAlign: "center" }}
          >
            { strings.publicFormsScreen.backToEssote }
          </Button>
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
    </Root>
  );
};

export default PublicWelcomeScreen;