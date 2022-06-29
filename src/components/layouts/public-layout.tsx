import React from "react";
import { Content, ContentWrapper } from "styled/layouts/public-layout";

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
    <ContentWrapper>
      <Content>
        { children }
      </Content>
    </ContentWrapper>
  );
};

export default PublicLayout;