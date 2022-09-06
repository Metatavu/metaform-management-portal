import React, { FC } from "react";
import { CircularProgress, Stack } from "@mui/material";

/**
 * Component properties
 */
interface Props {
  loading?: boolean;
  children: JSX.Element;
}

/**
 * Generic loader component
 *
 * @param props component properties
 */
const GenericLoaderWrapper: FC<Props> = ({
  loading,
  children
}) => {
  /**
   * Renders loader if loading is true
   */
  if (loading) {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        style={{
          flex: 1,
          height: "100%"
        }}
      >
        <CircularProgress/>
      </Stack>
    );
  }

  return children;
};

export default GenericLoaderWrapper;