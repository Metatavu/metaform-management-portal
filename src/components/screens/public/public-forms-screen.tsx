import React from "react";
import { Link } from "react-router-dom";
import { Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import Api from "api";
import { useApiClient } from "app/hooks";
import { MetaformVisibility } from "generated/client";
import strings from "localization/strings";
import { ErrorContext } from "components/contexts/error-handler";

/**
 * Public forms screen component
 */
const PublicFormsScreen: React.FC = () => {
  const errorContext = React.useContext(ErrorContext);

  const apiClient = useApiClient(Api.getApiClient);
  const { metaformsApi } = apiClient;
  
  const [forms, setForms] = React.useState<any[]>([]);

  /**
   * Fetch metaforms from the API
   */
  const fetchForms = async () => {
    try {
      setForms(await metaformsApi.listMetaforms({ visibility: MetaformVisibility.Public }));
    } catch (err) {
      errorContext.setError(strings.errorHandling.publicFormsScreen.fetchForms, err);
    }
  };

  React.useEffect(() => {
    fetchForms();
  }, []);

  return (
    <Grid container spacing={ 3 }>
      <Grid item xs={ 12 }>
        <Typography variant="h4">
          { strings.publicFormsScreen.title }
        </Typography>
      </Grid>
      <Grid item xs={ 12 }>
        <List>
          {forms.map(form => (
            <ListItem key={form.slug}>
              <Link to={`/${form.slug}`}>
                <ListItemText
                  primary={form.title}
                  primaryTypographyProps={{ variant: "h1" }}
                />
              </Link>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default PublicFormsScreen;