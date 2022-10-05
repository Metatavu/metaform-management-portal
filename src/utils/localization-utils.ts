import { AuditLogEntryType } from "generated/client";
import strings from "localization/strings";
import moment from "moment";
import { FormContext, NavigationLinks, ReplyStatus } from "types";

namespace LocalizationUtils {

  /**
   * Returns Finnish localized formatted date string
   *
   * @param date date
   */
  export const getLocalizedDate = (date?: Date): string => (date ? moment(date).format("DD.MM.YYYY") : "");

  /**
   * Returns Finnish localized formatted date time string
   *
   * @param date date
   */
  export const getLocalizedDateTime = (date?: Date): string => (date ? moment(date).format("DD.MM.YYYY HH:mm") : "");

  /**
   * Returns localized navigation link title and description
   *
   * @param navigationLink navigation link
   */
  export const getLocalizedNavigationLink = (navigationLink: NavigationLinks): string[] => ({
    [NavigationLinks.EDITOR]: [ strings.navigationHeader.editorScreens.title, strings.navigationHeader.editorScreens.description ],
    [NavigationLinks.FORMS]: [ strings.navigationHeader.formsScreens.title, strings.navigationHeader.formsScreens.description ],
    [NavigationLinks.USERS]: [ strings.navigationHeader.usersScreens.title, strings.navigationHeader.usersScreens.description ]
  })[navigationLink];

  /**
   * Returns localized status of reply
   *
   * @param status status of reply
   */
  export const getLocalizedStatusOfReply = (status: ReplyStatus) => ({
    [ReplyStatus.WAITING]: strings.repliesScreen.statusWaiting,
    [ReplyStatus.PROCESSING]: strings.repliesScreen.statusProcessing,
    [ReplyStatus.DONE]: strings.repliesScreen.statusDone
  })[status];

  /**
   * Returns localized audit log entry type
   *
   * @param type audit log entry type
   */
  export const getLocalizedAuditLogEntryType = (type: AuditLogEntryType) => ({
    [AuditLogEntryType.ViewReply]: strings.auditLogEntryType.viewReply,
    [AuditLogEntryType.ListReply]: strings.auditLogEntryType.listReply,
    [AuditLogEntryType.ModifyReply]: strings.auditLogEntryType.modifyReply,
    [AuditLogEntryType.DeleteReply]: strings.auditLogEntryType.deleteReply,
    [AuditLogEntryType.CreateReply]: strings.auditLogEntryType.createReply,
    [AuditLogEntryType.ViewReplyAttachment]: strings.auditLogEntryType.viewReplyAttachment,
    [AuditLogEntryType.DownloadReplyAttachment]: strings.auditLogEntryType.downloadReplyAttachment,
    [AuditLogEntryType.ExportReplyPdf]: strings.auditLogEntryType.exportReplyPdf,
    [AuditLogEntryType.ExportReplyXlsx]: strings.auditLogEntryType.exportReplyXlsx
  })[type];

  /**
   * Returns localized metaform form context
   *
   * @param context metaform context
   */
  export const getLocalizedFormContext = (context: FormContext) => ({
    [FormContext.FORM]: strings.formContext.form,
    [FormContext.MANAGEMENT]: strings.formContext.management,
    [FormContext.MANAGEMENT_LIST]: strings.formContext.managementList
  })[context];

  /**
   * Returns localized name boolean value
   *
   * @param bool boolean value
   */
  export const getLocalizedBoolean = (bool: boolean): string => (bool ? strings.generic.yes : strings.generic.no);

}

export default LocalizationUtils;