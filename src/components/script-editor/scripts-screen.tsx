import { Add } from "@mui/icons-material";
import { Divider, Stack } from "@mui/material";
import { DataGrid, GridColDef, fiFI } from "@mui/x-data-grid";
import Api from "api";
import { useApiClient } from "app/hooks";
import { ErrorContext } from "components/contexts/error-handler";
import { useNavigate } from "react-router-dom";
import NavigationTab from "components/layouts/navigations/navigation-tab";
import { Script } from "generated/client";
import strings from "localization/strings";
import React, { useContext, useEffect, useState } from "react";
import { RoundActionButton } from "styled/generic/form";
import { NavigationTabContainer } from "styled/layouts/navigations";
import { AdminFormListStack, AdminFormTypographyField } from "styled/react-components/react-components";
import theme from "theme";
import ListIcon from "@mui/icons-material/List";

/**
 * Scripts screen
 */
const ScriptsScreen: React.FC = () => {
  const [ loading, setLoading ] = useState<boolean>(false);
  const errorContext = useContext(ErrorContext);
  const [ scripts, setScripts ] = useState<Script[]>([]);
  const navigate = useNavigate();
  const apiClient = useApiClient(Api.getApiClient);
  const { scriptsApi } = apiClient;

  /**
   * Load scripts
   */
  const loadScripts = async () => {
    setLoading(true);

    try {
      setScripts(await scriptsApi.listScripts());
    } catch (e) {
      errorContext.setError(strings.errorHandling.adminFormsScreen.listForms, e);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadScripts();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: strings.scriptsScreen.scriptsTable.script,
      flex: 1,
      renderHeader: params => {
        return (
          <AdminFormListStack direction="row">
            <ListIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField sx={{ fontWeight: "bold" }}>{ params.colDef.headerName }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      },
      renderCell: params => {
        return (
          <AdminFormListStack direction="row">
            <ListIcon style={ { fill: "darkgrey" } }/>
            <AdminFormTypographyField>{ params.row.name }</AdminFormTypographyField>
          </AdminFormListStack>
        );
      }
    }
  ];

  return (
    <Stack overflow="hidden" flex={ 1 }>
      <NavigationTabContainer>
        <NavigationTab
          text={ strings.navigationHeader.scriptsScreens.scriptsScreen }
        />
        <RoundActionButton
          endIcon={ <Add/> }
          onClick={() => {} }
          sx={{ mr: theme.spacing(2) }}
        >
          { strings.navigationHeader.scriptsScreens.newScriptButton }
        </RoundActionButton>
      </NavigationTabContainer>
      <Divider/>
      <DataGrid
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
        localeText={ fiFI.components.MuiDataGrid.defaultProps.localeText }
        loading={ loading }
        rows={ scripts.map(script => ({ name: script.name, id: script.id })) }
        columns={ columns }
        onRowDoubleClick={ rowParams => navigate(`${rowParams.row.id}/`) }
      />
    </Stack>
  );
};

export default ScriptsScreen;