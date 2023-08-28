import { Tooltip, IconButton, Typography, Stack } from "@mui/material";
import React, { FC } from "react";
import HelpIcon from "@mui/icons-material/Help";
import { FeatureProps, FeatureStrategy } from "types";
import Config from "app/config";
import { DisabledFeatureWrapper } from "styled/react-components/react-components";
import { Close } from "@mui/icons-material";
import strings from "localization/strings";

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
          onClick={ () => !showTooltip && setShowTooltip(true) }
          sx={{ cursor: "pointer" }}
        >
          <Tooltip
            open={ showTooltip }
            title={
              <>
                <Stack direction="row" justifyContent="space-between" p={ 1 } pb={ 0 }>
                  <Typography>{ title }</Typography>
                  <IconButton size="small" color="inherit" onClick={ () => setShowTooltip(false) }>
                    <Close fontSize="small"/>
                  </IconButton>
                </Stack>
                <Stack sx={{ p: 1 }} spacing={ 0.5 }>
                  <Typography variant="caption">{ description }</Typography>
                  <Typography variant="caption">
                    {`${strings.features.askForMoreInfo} ${Config.get().featureContactEmail}`}
                  </Typography>
                </Stack>
              </>
            }
          >
            <IconButton color="inherit">
              <HelpIcon/>
            </IconButton>
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