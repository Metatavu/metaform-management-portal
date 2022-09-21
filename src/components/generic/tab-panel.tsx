import * as React from "react";
import { Stack } from "@mui/material";

/**
 * Component properties
 */
interface Props {
  value: number;
  index: number;
  padding?: number;
}

/**
 * Tab panel component
 *
 * @param props component properties
 */
const TabPanel: React.FC<Props> = ({
  value,
  index,
  children,
  padding
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
        height: "auto",
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        flexDirection: "row",
        maxHeight: "100%"
      }}
      pl={ padding ?? 2 }
      pr={ padding ?? 2 }
      pt={ padding ?? 2 }
      pb={ padding ?? 7 }
    >
      { children }
    </Stack>
  );
};

export default TabPanel;