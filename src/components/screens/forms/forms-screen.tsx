import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";

/**
 * Forms screen component
 */
const FormsScreen: React.FC = () => (
  <>
    <NavigationTabContainer>
      <NavigationTab
        text={ strings.navigationHeader.formsScreens.formScreen }
      />
      <NavigationTab
        text={ strings.navigationHeader.formsScreens.formDataScreen }
        to="data"
      />
    </NavigationTabContainer>
    {/* TODO tune datagrid */}
    <DataGrid
      rows={ [] }
      columns={ [] }
      autoHeight
      disableColumnMenu
      disableColumnSelector
      disableSelectionOnClick
    />
  </>
);

export default FormsScreen;