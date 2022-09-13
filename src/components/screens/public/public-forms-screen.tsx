import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import strings from "localization/strings";

/**
 * Public forms screen component
 */
const PublicFormsScreen: React.FC = () => {
  return (
    <Box bgcolor="#375AA3" height="100vh">
      <Box margin="auto" mt="200px" width="500px" bgcolor="white" borderRadius="15px" boxShadow="10">
        <Container
          disableGutters
        >
          <Typography variant="body1" padding="30px 50px" textAlign="center">{ strings.publicFormsScreen.welcomeInfo }</Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            padding="0px 0px 20px 0px "
          >
            <Container
              sx={{
                justifyContent: "center",
                textAlign: "center"
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  bgcolor: "white",
                  borderRadius: "15px"
                }}
                href="https://www.essote.fi"
              >
                { strings.publicFormsScreen.backToEssote }
              </Button>
            </Container>
            <Container
              sx={{
                justifyContent: "center",
                textAlign: "center"
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  bgcolor: "white",
                  borderRadius: "15px"
                }}
                href="/admin"
              >
                { strings.generic.login }
              </Button>
            </Container>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicFormsScreen;