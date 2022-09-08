import React, { useEffect } from "react";

interface Props {
  children: JSX.Element;
}

/**
 * LeavePageHandler component
 */
const LeavePageHandler: React.FC<Props> = ({ children }) => {
  /**
   * Handles user alert
   */
  const handleUserAlert = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "Are you sure you wish to leave this page?";

    return e.returnValue;
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleUserAlert);

    return () => {
      window.removeEventListener("beforeunload", handleUserAlert);
    };
  }, []);

  return (
    children
  );
};

export default LeavePageHandler;