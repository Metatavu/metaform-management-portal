import React, { useEffect } from "react";

interface Props {
  active: boolean;
  children: JSX.Element;
}

/**
 * LeavePageHandler component
 */
const LeavePageHandler: React.FC<Props> = ({
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
  const handleActive = () => {
    if (active) {
      window.addEventListener("beforeunload", handleUserAlert);
    } else {
      window.removeEventListener("beforeunload", handleUserAlert);
    }
  };

  useEffect(() => {
    return () => handleActive();
  }, [active]);

  useEffect(() => {
    return () => window.removeEventListener("beforeunload", handleUserAlert);
  }, []);

  return (
    children
  );
};

export default LeavePageHandler;