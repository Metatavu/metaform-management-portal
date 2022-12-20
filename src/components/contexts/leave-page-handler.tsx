/* eslint-disable no-console */
import ConfirmDialog from "components/generic/confirm-dialog";
import strings from "localization/strings";
import React, { FC, useCallback, useEffect, useState } from "react";
import { NavigationLinks } from "types";
import NavigationUtils from "utils/navigation-utils";
import { useNavigate } from "react-router-dom";
import { Metaform } from "generated/client";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import getRoutes from "components/layouts/breadcrumbs/routes";

interface Props {
  active: boolean;
  updatedFormData?: Metaform;
  children: JSX.Element;
}

/**
 * LeavePageHandler component
 */
const LeavePageHandler: FC<Props> = ({
  active,
  updatedFormData,
  children
}) => {
  const navigate = useNavigate();
  const [ confirmLeavePageWithoutSaving, setConfirmLeavePageWithoutSaving ] = useState(false);
  const [ clickedButtonNavigation, setClickedButtonNavigation ] = useState<NavigationLinks>();
  const [ clickedBreadcrumb, setClickedBreadcrumb ] = useState("");
  const [ confirmDialogState, setConfirmDialogState ] = useState(false);
  const breadcrumbs = useBreadcrumbs(getRoutes(), { disableDefaults: true });

  /**
   * Handles user alert
   * 
   * @param e BeforeUnloadEvent
   */
  const handleUserAlert = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
    return e.returnValue;
  }, []);

  /**
   * Checks whether are any changes made to form
   * 
   * @returns boolean 
   */
  const isFormChanged = () : boolean => {
    const storedFormData = localStorage.getItem("formData");
    if (updatedFormData !== undefined && storedFormData !== null) {
      return storedFormData !== JSON.stringify(updatedFormData);
    }
    return false;
  };

  /**
   * Prevents navlink or breadcrumb link from triggering page change 
   * 
   * @param e Event
   */
  const preventLinkDefaultAction = (e : Event) => {
    setConfirmLeavePageWithoutSaving(true);
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  /**
   * Adds confirm dialog handler for navButtons and links
   * 
   * @param e Event
   */
  const onNavButtonClick = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLAnchorElement;
    const targetTextContent : string = target.textContent as string;
    const navHeader = strings.navigationHeader;
    window.removeEventListener("beforeunload", handleUserAlert);

    if (target.href !== undefined && clickedButtonNavigation === undefined) {
      setClickedBreadcrumb(target.getAttribute("href") as string);
      preventLinkDefaultAction(e);
    } else if ([navHeader.formsScreens.title, navHeader.usersScreens.title, navHeader.editorScreens.title].includes(targetTextContent)) {
      switch (targetTextContent) {
        case navHeader.formsScreens.title:
          setClickedButtonNavigation(NavigationLinks.FORMS);
          break;
        case navHeader.usersScreens.title:
          setClickedButtonNavigation(NavigationLinks.USERS);
          break;
        case navHeader.editorScreens.title:
          setClickedButtonNavigation(NavigationLinks.EDITOR);
          break;
        default:
          setClickedButtonNavigation(undefined);
          break;
      }
      preventLinkDefaultAction(e);
    }
  }, []);
 
  /**
   * Handles confirm dialog of navbuttons and links
   * 
   * @param setConfirmDialog Set confirm dialog visible values true or false 
   */
  const handleConfirmDialog = (setConfirmDialog : boolean) => {
    if (setConfirmDialog !== confirmDialogState) {
      const allNavButtons = Array.from(document.querySelectorAll("button, a"));
      allNavButtons.forEach(button => {
        const isLastBreadDrumb = breadcrumbs.length - 1 === Number(button.getAttribute("a-key"));
        if (setConfirmDialog && !isLastBreadDrumb) {
          button.addEventListener("click", onNavButtonClick);
        } else {
          button.removeEventListener("click", onNavButtonClick);
        }
      });
      setConfirmDialogState(setConfirmDialog);
    }
  };

  /**
   * Stores form data in Local Storage
   */
  const storeFormData = () => {
    if (updatedFormData !== undefined) {
      const formDataKeys = Object.keys(JSON.parse(JSON.stringify(updatedFormData)));

      if (localStorage.getItem("formData") == null && formDataKeys.length !== 0) {
        localStorage.setItem("formData", JSON.stringify(updatedFormData));
      }
    }
  };

  /**
   * Handles the actions of navlinks if form data has changed
   */
  const handleConfirmDialogIfDataChanged = () => {
    if (isFormChanged()) {
      handleConfirmDialog(true);
      window.addEventListener("beforeunload", handleUserAlert);
    } else {
      handleConfirmDialog(false);
      window.removeEventListener("beforeunload", handleUserAlert);
    }
  };

  /**
   *  Removes confirmation pop up
   */
  const resetNavLinks = () => {
    setConfirmLeavePageWithoutSaving(false);
    setClickedBreadcrumb("");
    setClickedButtonNavigation(undefined);
    window.addEventListener("beforeunload", handleUserAlert);
  };

  /**
   * Navigates to corresponding page
   */
  const navigateToPage = () => {
    if (clickedBreadcrumb === "" && clickedButtonNavigation !== undefined) {
      navigate(NavigationUtils.getTranslatedNavigation(clickedButtonNavigation));
    } else {
      navigate(`../../../${clickedBreadcrumb}`);
    }
  };

  /**
   * Handles whether this components event listeners should be active
   */
  const handleActive = () => (active ? window.addEventListener("beforeunload", handleUserAlert) : window.removeEventListener("beforeunload", handleUserAlert));

  useEffect(() => {
    storeFormData();
    handleConfirmDialogIfDataChanged();
  }, [updatedFormData]);

  useEffect(() => {
    handleActive();
  }, [active]);

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", handleUserAlert);
      const allNavButtons = Array.from(document.querySelectorAll("button, a"));
      allNavButtons.forEach(button => {
        button.removeEventListener("click", onNavButtonClick);
      });
    };
  }, []);

  window.onunload = () => {
    if (localStorage.getItem("formData") != null) {
      localStorage.removeItem("formData");
    }
  };

  /**
   * Renders page leaving confirmation dialog
   */
  const renderConfirmLeavePageWithoutSaving = () => {
    return (
      <ConfirmDialog
        onClose={ resetNavLinks }
        onCancel={ resetNavLinks }
        onConfirm={ navigateToPage }
        cancelButtonText={ strings.generic.cancel }
        positiveButtonText={ strings.generic.confirm }
        title={ strings.draftEditorScreen.unsavedChanges }
        text={ strings.draftEditorScreen.confirmLeavePageWithoutSaving }
        open={ confirmLeavePageWithoutSaving }
      />
    );
  };

  return (
    <>
      { children }
      { renderConfirmLeavePageWithoutSaving() }
    </>
  );
};

export default LeavePageHandler;