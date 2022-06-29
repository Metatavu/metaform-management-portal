import React from "react";
import { Root } from "styled/layouts/basic-layout";

/**
 * Basic layout component
 *
 * @param props component properties
 */
const BasicLayout: React.FC = ({ children }) => {
  /**
   * Component render
   */
  return (
    <Root>
      { children }
    </Root>
  );
};

export default BasicLayout;