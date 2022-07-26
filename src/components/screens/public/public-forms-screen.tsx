import { Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

/**
 * Public forms screen component
 */
const PublicFormsScreen: React.FC = () => (
  <Grid container spacing={ 2 }>
    <Grid item xs={ 12 }>
      <Typography>
        Public forms
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary={
            <Typography>
              <Link to="/1">Form 1</Link>
            </Typography>}
          />
        </ListItem>
      </List>
    </Grid>
  </Grid>
);

export default PublicFormsScreen;