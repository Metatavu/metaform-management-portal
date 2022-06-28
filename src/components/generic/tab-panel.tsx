import * as React from "react";
import { Stack } from "@mui/material";

/**
 * Component properties
 */
interface Props {
  value: number;
  index: number;
}

/**
 * Tab panel component
 *
 * @param props component properties
 */
const TabPanel: React.FC<Props> = ({
  value,
  index,
  children
}) => {
  if (value !== index) return null;

  /**
   * Component render
   */
  return (
    <Stack p={ 2 } spacing={ 2 }>
      { children }
    </Stack>
  );
};

export default TabPanel;