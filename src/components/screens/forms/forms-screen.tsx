import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { NavigationTabContainer } from "styled/layouts/navigations";
import NavigationTab from "components/layouts/navigations/navigation-tab";

/**
 * Forms screen component
 */
const FormsScreen: React.FC = () => (
  <>
    <NavigationTabContainer>
      <NavigationTab
        title="Forms"
        description="Forms desc"
      />
      <NavigationTab
        title="Forms"
        description="Forms desc"
        to="data"
      />
    </NavigationTabContainer>
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