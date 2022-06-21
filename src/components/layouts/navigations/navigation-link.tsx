import { Button, Divider, Typography } from "@mui/material";
import theme from "theme";
import React from "react";
import NavigationWrapper from "styled/layouts/navigations/navigation-link";

/**
 * Component properties
 */
interface Props {
  title: string;
  selected: boolean;
  onClick: () => void;
  renderIcon: (color: string) => React.ReactNode;
}

/**
 * Draft editor screen component
 */
const NavigationLink: React.FC<Props> = ({
  title,
  selected,
  onClick,
  renderIcon
}) => {
  const color = selected ?
    theme.palette.secondary.main :
    theme.palette.grey[500];
  console.log("color: ", color);

  /**
   * Component render
   */
  return (
    <Button
      sx={{ padding: 0 }}
      onClick={ onClick }
    >
      <NavigationWrapper spacing={ 1 }>
        { renderIcon(color) }
        <Typography color={ color }>{ title }</Typography>
        { selected && <Divider sx={{ height: 2 }} color={ color }/> }
      </NavigationWrapper>
    </Button>
  );
};

export default NavigationLink;