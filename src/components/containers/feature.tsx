import { IconButton, Tooltip, Box, ListItem, ListItemText } from "@mui/material";
import React, { FC, ReactElement } from "react";
import HelpIcon from "@mui/icons-material/Help";

export enum Strategy {
  HIDE = "hide",
  DISABLE = "disable",
  REPLACE = "replace"
}

interface FeatureProps {
  feature: string;
  children: ReactElement;
  featureName?: string;
  featureDescription?: string;
  strategy: Strategy;
}

/**
 * Component for features
 */
const Feature: FC<FeatureProps> = ({ feature, children, featureName, featureDescription, strategy }) => {
  const hasFeature = JSON.parse(process.env.REACT_APP_FEATURES || "[]").includes(feature);
  const [ showTooltip, setShowTooltip ] = React.useState(false);

  if (strategy === Strategy.HIDE && !hasFeature) {
    return null;
  }

  if (strategy === Strategy.DISABLE && !hasFeature) {
    return (
      <div style={{ position: "relative", flex: 1 }}>
        { children }
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(1.5px)",
            zIndex: 1,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Tooltip
            title={
              <ListItem dense>
                <ListItemText
                  primary={ featureName }
                  secondary={ featureDescription }
                  secondaryTypographyProps={{ color: "#ffffff90" }}
                />
              </ListItem>
            }
            disableHoverListener
            open={ showTooltip }
          >
            <IconButton onClick={ () => setShowTooltip(!showTooltip) } sx={{ alignSelf: "center" }}>
              <HelpIcon/>
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    );
  }

  return children;
};

export default Feature;