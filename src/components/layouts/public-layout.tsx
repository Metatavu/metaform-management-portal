import React from "react";
import { Content, ContentWrapper, Root } from "styled/layouts/app-layout";

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
    <Root>
      <ContentWrapper>
        <Content>
          { children }
        </Content>
      </ContentWrapper>
    </Root>
  );
};

export default PublicLayout;