import { DataGrid } from "@mui/x-data-grid";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import strings from "localization/strings";
import React from "react";
import { NavigationTabContainer } from "styled/layouts/navigations";

/**
 * Forms data screen component
 */
const FormsDataScreen: React.FC = () => (
  <>
    <NavigationTabContainer>
      <NavigationTab
        text={ strings.navigationHeader.formsScreens.formScreen }
        to="../"
      />
      <NavigationTab
        text={ strings.navigationHeader.formsScreens.formDataScreen }
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

export default FormsDataScreen;