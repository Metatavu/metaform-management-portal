/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import React, { FC, useEffect } from "react";

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
  /**
   * Handles user alert
   */
  const handleUserAlert = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";

    return e.returnValue;
  };

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
    children
  );
};

export default LeavePageHandler;