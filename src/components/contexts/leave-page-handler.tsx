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
  loadData?: Metaform;
  children: JSX.Element;
}

/**
 * LeavePageHandler component
 */
const LeavePageHandler: FC<Props> = ({
  active,
  loadData,
  children
}) => {
  const navigate = useNavigate();
  const [ confirmLeavePageWithoutSaving, setConfirmLeavePageWithoutSaving ] = useState(false);
  const [ clickedButtonNavigation, setClickedButtonNavigation ] = useState<NavigationLinks>();
  const [ clickedBreadcrumb, setClickedBreadcrumb ] = useState<string>("");
  const [ confirmDialogState, setConfirmDialogState ] = useState<boolean>(false);
  const breadcrumbs = useBreadcrumbs(getRoutes(), { disableDefaults: true });

  /**
   * Handles user alert
   */
  const handleUserAlert = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
    return e.returnValue;
  }, []);

  /**
   * Checks whether are any changes made to form
   * @returns boolean 
   */
  const changesMadeToForm = () : boolean => {
    if (loadData != null && localStorage.getItem("formData") != null) {
      return localStorage.getItem("formData") !== JSON.stringify(loadData);
    }
    return false;
  };

  /**
   * Prevents navlink or breadcrumb link from triggering page change 
   */
  const preventLinkDefaultAction = (e : Event) => {
    setConfirmLeavePageWithoutSaving(true);
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  /**
   * Adds confirm dialog handler for navButtons and links
   */
  const addConfirmDialogForButtons = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLAnchorElement;
    const targetTextContent = target.textContent;
    const navHeader = strings.navigationHeader;
    window.removeEventListener("beforeunload", handleUserAlert);

    if (target.href !== undefined && clickedButtonNavigation === undefined) {
      setClickedBreadcrumb(target.getAttribute("href") as string);
      preventLinkDefaultAction(e);
    } else if (targetTextContent === navHeader.formsScreens.title ||
               targetTextContent === navHeader.usersScreens.title ||
               targetTextContent === navHeader.editorScreens.title) {
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
   * @param setConfirmDialog Set confirm dialog visible values true or false 
   */
  const handleConfirmDialog = (setConfirmDialog : boolean) => {
    if (setConfirmDialog !== confirmDialogState) {
      const allNavButtons = Array.from(document.querySelectorAll("button, a"));
      allNavButtons.forEach(button => {
        button.removeEventListener("click", addConfirmDialogForButtons);
        const isLastBreadDrumb = breadcrumbs.length - 1 === Number(button.getAttribute("a-key"));
        if (setConfirmDialog && !isLastBreadDrumb) {
          button.addEventListener("click", addConfirmDialogForButtons);
        }
      });
      setConfirmDialogState(setConfirmDialog);
    }
  };

  useEffect(() => {
    if (loadData !== undefined) {
      const formDataKeys = Object.keys(JSON.parse(JSON.stringify(loadData)));

      if (localStorage.getItem("formData") == null && formDataKeys.length !== 0) {
        localStorage.setItem("formData", JSON.stringify(loadData));
      }
    }
    if (changesMadeToForm()) {
      handleConfirmDialog(true);
      window.addEventListener("beforeunload", handleUserAlert);
    } else {
      handleConfirmDialog(false);
      window.removeEventListener("beforeunload", handleUserAlert);
    }
  }, [loadData]);

  /**
   * Renders page leaving confirmation dialog
   */
  const renderConfirmLeavePageWithoutSaving = () => {
    return (
      <ConfirmDialog
        onClose={ () => { setConfirmLeavePageWithoutSaving(false); setClickedBreadcrumb(""); setClickedButtonNavigation(undefined); window.addEventListener("beforeunload", handleUserAlert); } }
        onCancel={ () => { setConfirmLeavePageWithoutSaving(false); setClickedBreadcrumb(""); setClickedButtonNavigation(undefined); window.addEventListener("beforeunload", handleUserAlert); } }
        onConfirm={ () => {
          if (clickedBreadcrumb === "") {
            navigate(NavigationUtils.getTranslatedNavigation(clickedButtonNavigation!));
          } else {
            navigate(`../../../${clickedBreadcrumb}`);
          }
        } }
        cancelButtonText={ strings.generic.cancel }
        positiveButtonText={ strings.generic.confirm }
        title={ strings.draftEditorScreen.unsavedChanges }
        text={ strings.draftEditorScreen.confirmLeavePageWithoutSaving }
        open={ confirmLeavePageWithoutSaving }
      />
    );
  };

  /**
   * Handles whether this components event listeners should be active
   */
  const handleActive = () => (active ? window.addEventListener("beforeunload", handleUserAlert) : window.removeEventListener("beforeunload", handleUserAlert));

  window.onunload = () => {
    if (localStorage.getItem("formData") != null) {
      localStorage.removeItem("formData");
    }
  };

  useEffect(() => {
    handleActive();
  }, [active]);

  useEffect(() => {
    return () => window.removeEventListener("beforeunload", handleUserAlert);
  }, []);

  return (
    <>
      { children }
      { renderConfirmLeavePageWithoutSaving() }
    </>
  );
};

export default LeavePageHandler;