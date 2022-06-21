import Header from "components/layout-components/header";
import React from "react";
import { Content, Root } from "styled/layouts/app-layout";
import Breadcrumbs from "components/layout-components/breadcrumbs/breadcrumbs";

/**
 * App layout component
 *
 * @param props component properties
 */
const AppLayout: React.FC = ({ children }) => {
  return (
    <Root>
      <Header/>
      <Breadcrumbs/>
      <Content>
        { children }
      </Content>
    </Root>
  );
};

export default AppLayout;