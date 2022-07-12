import { Content, ContentWrapper } from "styled/layouts/admin-layout";
import React from "react";

/**
 * Users screen component
 */
const UsersScreen: React.FC = ({ children }) => {
  return (
    <ContentWrapper>
      <Content>
        {children}
      </Content>
    </ContentWrapper>
  );
};

export default UsersScreen;