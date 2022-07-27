import { NewUserButton } from "styled/layouts/admin-layout";
import strings from "localization/strings";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import PermissionFilter from "components/selectors/permission-filter";
import { PersonAdd } from "@mui/icons-material";
import React from "react";
import { ErrorContext } from "components/contexts/error-handler";

/**
 * Users screen component
 */
const UsersScreen: React.FC = () => {
  const errorContext = React.useContext(ErrorContext);
  /**
   * generate error message
   */
  const generateErrorMessage = () => {
    errorContext.setError("Let there be errors", "Testivirhe 5, error message");
  };
  return (
    <>
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.usersScreens.subheader }
        />
        <NewUserButton onClick={ generateErrorMessage } variant="outlined" endIcon={<PersonAdd/>}>{ strings.navigationHeader.usersScreens.button.text }</NewUserButton>
      </NavigationTabContainer>
      <PermissionFilter/>
    </>
  );
};

export default UsersScreen;