/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import ConfirmDialog from "components/generic/confirm-dialog";
import strings from "localization/strings";
import React, { FC, useEffect, useState } from "react";
import { NavigationLinks } from "types";
import NavigationUtils from "utils/navigation-utils";
import { useNavigate } from "react-router-dom";

interface Props {
  active: boolean;
  children: JSX.Element;
}

/**
 * LeavePageHandler component
 */
const LeavePageHandler: FC<Props> = ({
  active,
  children
}) => {
  const navigate = useNavigate();
  const [ confirmLeavePageWithoutSaving, setConfirmLeavePageWithoutSaving ] = useState(false);
  const [ clickButtonNavigation, setClickButtonNavigation ] = useState<NavigationLinks>();
  const [ navButtonHandlersAdded, setNavButtonHandlersAdded ] = useState(false);
  /**
   * Handles user alert
   */
  const handleUserAlert = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";

    return e.returnValue;
  };
  let clickedButtonNavigation: NavigationLinks;

  useEffect(() => {
    if (navButtonHandlersAdded) return;

    const navButtons = document.querySelectorAll("button[type='button']");

    navButtons.forEach(button => {
      button.childNodes.forEach(child => {
        const childText = child.textContent;

        if (childText === strings.navigationHeader.formsScreens.title ||
            childText === strings.navigationHeader.usersScreens.title ||
            childText === strings.navigationHeader.editorScreens.title) {
          button.addEventListener("click", e => {
            const target = e.currentTarget as HTMLTextAreaElement;
            if (target === null) return;
            clickedButtonNavigation = target.childNodes[0].childNodes[1].textContent! as NavigationLinks;

            switch (true) {
              case clickedButtonNavigation === strings.navigationHeader.formsScreens.title:
                setClickButtonNavigation(NavigationLinks.FORMS);
                break;
              case clickedButtonNavigation === strings.navigationHeader.usersScreens.title:
                setClickButtonNavigation(NavigationLinks.USERS);
                break;
              case clickedButtonNavigation === strings.navigationHeader.editorScreens.title:
                setClickButtonNavigation(NavigationLinks.EDITOR);
                break;
              default:
                setClickButtonNavigation(undefined);
                break;
            }
            e.stopImmediatePropagation();
            setConfirmLeavePageWithoutSaving(true);
          });
        }
      });
    });
    return () => {
      setNavButtonHandlersAdded(true);
    };
  }, []);
  /**
 * Renders page leaving confirmation dialog
 */
  const renderConfirmLeavePageWithoutSaving = () => (
    <ConfirmDialog
      onClose={ () => { setConfirmLeavePageWithoutSaving(false); } }
      onCancel={ () => { setConfirmLeavePageWithoutSaving(false); } }
      onConfirm={ () => { navigate(NavigationUtils.getTranslatedNavigation(clickButtonNavigation!)); } }
      cancelButtonText={ strings.generic.cancel }
      positiveButtonText={ strings.generic.confirm }
      title={ strings.draftEditorScreen.unsavedChanges }
      text={ strings.draftEditorScreen.confirmLeavePageWithoutSaving }
      open={ confirmLeavePageWithoutSaving }
    />
  );

  const breadcrumbs = document.querySelectorAll("span");

  breadcrumbs.forEach(breadcrumb => {
    const childText = breadcrumb.textContent;
    
    if (childText === strings.breadcrumb.editor || childText === strings.breadcrumb.home) {
      breadcrumb.addEventListener("click", e => {
        e.stopImmediatePropagation();
        setConfirmLeavePageWithoutSaving(true);
      });
    }
  });

  /**
   * Handles wheter this components event listeners should be active
   */
  const handleActive = () => (active ? window.addEventListener("beforeunload", handleUserAlert) : window.removeEventListener("beforeunload", handleUserAlert));

  useEffect(() => {
    handleActive();
  }, [active]);

  useEffect(() => {
    return () => window.removeEventListener("beforeunload", handleUserAlert);
  }, []);

  return (
    <>
      { children }
      { renderConfirmLeavePageWithoutSaving()}
    </>
  );
};

export default LeavePageHandler;