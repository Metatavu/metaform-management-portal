import Header from "components/layout-components/header";
import React from "react";
import { Content, Root } from "styled/layouts/app-layout";

/**
 * App layout component
 *
 * @param props component properties
 */
const AppLayout: React.FC = ({ children }) => {
  return (
    <Root>
      <Header/>
      <Content>
        { children }
      </Content>
    </Root>
  );
};

export default AppLayout;