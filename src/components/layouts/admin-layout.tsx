import Header from "components/layout-components/header";
import React from "react";
import { Content, ContentWrapper } from "styled/layouts/admin-layout";
import BasicLayout from "./basic-layout";
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
    <BasicLayout>
      <Header/>
      <NavigationHeader/>
      <Breadcrumbs/>
      <ContentWrapper>
        <Content>
          { children }
        </Content>
      </ContentWrapper>
    </BasicLayout>
  );
};

export default AdminLayout;