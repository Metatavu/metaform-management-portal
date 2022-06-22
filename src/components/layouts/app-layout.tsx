import Header from "components/layout-components/header";
import React from "react";
import { Content, ContentWrapper, Root } from "styled/layouts/app-layout";
import Breadcrumbs from "./breadcrumbs/breadcrumbs";
import NavigationHeader from "./navigations/navigation-header";

/**
 * App layout component
 *
 * @param props component properties
 */
const AppLayout: React.FC = ({ children }) => {
  /**
   * Component render
   */
  return (
    <Root>
      <Header/>
      <NavigationHeader/>
      <Breadcrumbs/>
      <ContentWrapper>
        <Content>
          { children }
        </Content>
      </ContentWrapper>
    </Root>
  );
};

export default AppLayout;