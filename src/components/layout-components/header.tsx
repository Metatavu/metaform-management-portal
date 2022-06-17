import { Stack, TextField, Toolbar, Typography } from "@mui/material";
import strings from "localization/strings";
import React from "react";
import { Root } from "styled/layout-components/header";
import theme from "theme";

/**
 * Component properties
 */
interface Props {
}

/**
 * Header component
 *
 * @param props component properties
 */
const Header: React.FC<Props> = ({
  children
}) => {
  return (
    <Root position="relative">
      <Toolbar>
        <Stack
          width="100%"
          direction="row"
          spacing={ 150 }
          sx={{
            alignItems: "center",
            justifyContent: "stretch",
            flexGrow: 1
          }}
        >
          <Typography variant="h1">
            { strings.header.logo }
          </Typography>
          <TextField
            sx={{
              width: 300,
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius
            }}
            label={ strings.header.user }
            select
          />
        </Stack>
      </Toolbar>
      { children }
    </Root>
  );
};

export default Header;