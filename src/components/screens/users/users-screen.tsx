import { ContentWrapper } from "styled/layouts/admin-layout";
import PermissionFilter from "components/selectors/permission-filter";
import React from "react";

/**
 * Users screen component
 * If first selector isn't selected, then opacity 0.5 is applied to second selector
 */
const UsersScreen: React.FC = () => {
  return (
    <ContentWrapper>
      <PermissionFilter/>
    </ContentWrapper>
  );
};

export default UsersScreen;