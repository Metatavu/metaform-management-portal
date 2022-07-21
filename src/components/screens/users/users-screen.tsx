import { ContentWrapper } from "styled/layouts/admin-layout";
import strings from "localization/strings";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import PermissionFilter from "components/selectors/permission-filter";
import React from "react";

/**
 * Users screen component
 */
const UsersScreen: React.FC = () => {
  return (
    <>
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.usersScreens }
        />
      </NavigationTabContainer>
      <ContentWrapper>
        <PermissionFilter/>
      </ContentWrapper>
    </>
  );
};

export default UsersScreen;