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
    <Stack
      style={{
        overflowY: "scroll",
        overflowX: "hidden",
        height: "100%",
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        flexDirection: "row"
      }}
      pl={ 2 }
      pr={ 2 }
      pt={ 2 }
      pb={ 7 }
    >
      { children }
    </Stack>
  );
};

export default TabPanel;