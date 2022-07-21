import { NewUserButton } from "styled/layouts/admin-layout";
import strings from "localization/strings";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import PermissionFilter from "components/selectors/permission-filter";
import { PersonAdd } from "@mui/icons-material";
import React from "react";

/**
 * Users screen component
 */
const UsersScreen: React.FC = () => {
  return (
    <>
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.usersScreens.subheader }
        />
        <NewUserButton variant="outlined" endIcon={<PersonAdd/>}>{ strings.navigationHeader.usersScreens.button.text }</NewUserButton>
      </NavigationTabContainer>
      <PermissionFilter/>
    </>
  );
};

export default UsersScreen;