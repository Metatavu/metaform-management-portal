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
        overflowY: "auto",
        overflowX: "hidden",
        height: "100%",
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        flexDirection: "row"
      }}
      p={ padding ?? 1 }
    >
      { children }
    </Stack>
  );
};

export default TabPanel;