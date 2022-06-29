import Header from "components/layout-components/header";
import React from "react";
import { Content, ContentWrapper } from "styled/layouts/admin-layout";
import Breadcrumbs from "./breadcrumbs/breadcrumbs";
import NavigationHeader from "./navigations/navigation-header";

/**
 * Admin layout component
 *
 * @param props component properties
 */
const AdminLayout: React.FC = ({ children }) => {
  /**
   * Component render
   */
  return (
    <>
      <Header/>
      <NavigationHeader/>
      <Breadcrumbs/>
      <ContentWrapper>
        <Content>
          {children}
        </Content>
      </ContentWrapper>
    </>
  );
};

export default AdminLayout;