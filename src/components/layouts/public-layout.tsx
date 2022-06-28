import React from "react";
import { Content, ContentWrapper } from "styled/layouts/public-layout";
import BasicLayout from "./basic-layout";

/**
 * Public layout component
 *
 * @param props component properties
 */
const PublicLayout: React.FC = ({ children }) => {
  /**
   * Component render
   */
  return (
    <BasicLayout>
      <ContentWrapper>
        <Content>
          { children }
        </Content>
      </ContentWrapper>
    </BasicLayout>
  );
};

export default PublicLayout;