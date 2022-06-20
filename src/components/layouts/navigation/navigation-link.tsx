import { Divider, Stack, Typography } from "@mui/material";
import theme from "theme";
import React from "react";

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
    theme.palette.primary.main :
    theme.palette.grey[500];
  console.log("color: ", color);

  /**
   * Component render
   */
  return (
    <Stack
      width={ 120 }
      alignItems="center"
      onClick={ onClick }
    >
      <Stack
        p={ 1 }
        spacing={ 1 }
        alignItems="center"
      >
        { renderIcon(color) }
        <Typography color={ color }>{ title }</Typography>
      </Stack>
      { selected && <Divider color={ color }/> }
    </Stack>
  );
};

export default NavigationLink;