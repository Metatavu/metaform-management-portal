import React from "react";
import { Link } from "react-router-dom";
import { Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import Api from "api";
import { useApiClient } from "app/hooks";
import { MetaformVisibility } from "generated/client";

/**
 * Public forms screen component
 */
const PublicFormsScreen: React.FC = () => {
  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi } = apiClient;

  /**
   * Fetch metaforms from the API
   */
  const fetchForms = async () => {
    return metaformsApi.listMetaforms({ visibility: MetaformVisibility.Public });
  };

  const [forms, setForms] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchForms().then(setForms);
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">
          Public forms
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <List>
          {forms.map(form => (
            <ListItem key={form.id}>
              <Link to={`/${form.id}`}>
                <ListItemText primary={form.title}/>
              </Link>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default PublicFormsScreen;