import { Tooltip, ListItem, ListItemText } from "@mui/material";
import React, { FC } from "react";
import HelpIcon from "@mui/icons-material/Help";
import { FeatureProps, FeatureStrategy } from "types";
import Config from "app/config";
import { DisabledFeatureWrapper } from "styled/react-components/react-components";

/**
 * Component for features
 */
const Feature: FC<FeatureProps> = ({ feature, children, title, description, strategy, replacement }) => {
  const hasFeature = Config.get().features.includes(feature);
  const [ showTooltip, setShowTooltip ] = React.useState(false);

  if (strategy === FeatureStrategy.HIDE && !hasFeature) {
    return null;
  }

  if (strategy === FeatureStrategy.DISABLE && !hasFeature) {
    return (
      <div style={{ position: "relative", flex: 1 }}>
        { children }
        <DisabledFeatureWrapper
          onMouseEnter={ () => setShowTooltip(true) }
          onMouseLeave={ () => setShowTooltip(false) }
        >
          <Tooltip
            open={ showTooltip }
            title={
              <ListItem dense>
                <ListItemText
                  primary={ title }
                  secondary={ description }
                  secondaryTypographyProps={{ color: "#ffffff90" }}
                />
              </ListItem>
            }
          >
            <HelpIcon
              onMouseEnter={ () => setShowTooltip(true) }
              onMouseLeave={ () => setShowTooltip(false) }
            />
          </Tooltip>
        </DisabledFeatureWrapper>
      </div>
    );
  }

  if (strategy === FeatureStrategy.REPLACE && !hasFeature) {
    return replacement || null;
  }

  return children;
};

export default Feature;