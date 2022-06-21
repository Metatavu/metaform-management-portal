import { Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavigationLinks } from "types";
import LocalizationUtils from "utils/localization-utils";
import NavigationLink from "./navigation-link";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import strings from "localization/strings";
/**
 * Navigation header component
 */
const NavigationHeader: React.FC = () => {
  const navigate = useNavigate();
  // TODO change location init
  const [ location, setLocation ] = React.useState<NavigationLinks>(NavigationLinks.FORMS);
  const [ title, description ] = LocalizationUtils.getLocalizedNavigationLink(location);

  /**
   * On navigate forms click
   */
  const onNavigateFormsClick = () => {
    setLocation(NavigationLinks.FORMS);
    navigate("/forms");
  };

  /**
   * On navigate users click
   */
  const onNavigateUsersClick = () => {
    setLocation(NavigationLinks.USERS);
    navigate("/users");
  };

  /**
   * On navigate editor click
   */
  const onNavigateEditorClick = () => {
    setLocation(NavigationLinks.EDITOR);
    navigate("/editor");
  };

  /**
   * Renders header text
   */
  const renderHeaderText = () => (
    <Stack>
      <Typography variant="h1">{ title }</Typography>
      <Typography variant="h4">{ description }</Typography>
    </Stack>
  );

  /**
   * Renders navigation links
   */
  const renderNavigationLinks = () => (
    <Stack direction="row">
      <NavigationLink
        selected={ NavigationLinks.FORMS === location }
        title={ strings.navigationHeader.formsScreens.title }
        onClick={ onNavigateFormsClick }
        renderIcon={ color => <FormatAlignJustifyIcon htmlColor={ color }/> }
      />
      <NavigationLink
        selected={ NavigationLinks.USERS === location }
        title={ strings.navigationHeader.usersScreens.title }
        onClick={ onNavigateUsersClick }
        renderIcon={ color => <GroupIcon htmlColor={ color }/> }
      />
      <NavigationLink
        selected={ NavigationLinks.EDITOR === location }
        title={ strings.navigationHeader.editorScreens.title }
        onClick={ onNavigateEditorClick }
        renderIcon={ color => <EditIcon htmlColor={ color }/> }
      />
    </Stack>
  );

  /**
   * Component render
   */
  return (
    // TODO move to style
    <Stack
      px={ 4 }
      flex={ 1 }
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ backgroundColor: "#fff" }}
    >
      { renderHeaderText() }
      { renderNavigationLinks() }
    </Stack>
  );
};

export default NavigationHeader;