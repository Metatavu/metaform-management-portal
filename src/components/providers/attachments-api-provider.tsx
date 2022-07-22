/* eslint-disable react/jsx-no-constructed-context-values */
import Api from "api";
import { useAppSelector } from "app/hooks";
import { selectKeycloak } from "features/auth-slice";
import { FindAttachmentRequest } from "generated/client";
import React from "react";
import { AttachmentsApiContextType } from "types";

const initialAttachment = {};

export const AttachmentsApiContext = React.createContext<AttachmentsApiContextType>({
  findAttachment: async () => initialAttachment
});

/**
 * Attachments API provider
 */
const AttachmentsApiProvider: React.FC = ({ children }) => {
  const auth = useAppSelector(selectKeycloak);

  /**
   * Finds an attachment
   * 
   * @param request request
   */
  const findAttachment = async (request: FindAttachmentRequest) => {
    try {
      if (!auth?.token) {
        throw new Error("No access token");
      }

      return await Api.getAttachmentsApi(auth.token).findAttachment(request);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * Component render
   */
  return (
    <AttachmentsApiContext.Provider
      value={{ findAttachment: findAttachment }}
    >
      { children }
    </AttachmentsApiContext.Provider>
  );
};

export default AttachmentsApiProvider;