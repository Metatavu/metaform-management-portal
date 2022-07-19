import { ContentWrapper } from "styled/layouts/admin-layout";
import PermissionFilter from "components/selectors/permission-filter";
import React from "react";

/**
 * Users screen component
 */
const UsersScreen: React.FC = () => {
  return (
    <ContentWrapper>
      <PermissionFilter/>
    </ContentWrapper>
  );
};

export default UsersScreen;