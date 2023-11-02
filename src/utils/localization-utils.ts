import { AuditLogEntryType, MetaformFieldType } from "generated/client";
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
    [NavigationLinks.SCRIPTS]: [ strings.navigationHeader.scriptsScreens.title, strings.navigationHeader.scriptsScreens.description ],
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
    [FormContext.MANAGEMENT_LIST]: strings.formContext.managementList,
    [FormContext.META]: ""
  })[context];

  /**
   * Returns localized metaform form context
   *
   * @param context metaform context
   */
  export const getLocalizedFieldType = (fieldType: MetaformFieldType) => ({
    [MetaformFieldType.Html]: strings.draftEditorScreen.editor.fields.html,
    [MetaformFieldType.Boolean]: strings.draftEditorScreen.editor.fields.boolean,
    [MetaformFieldType.Select]: strings.draftEditorScreen.editor.fields.select,
    [MetaformFieldType.Slider]: strings.draftEditorScreen.editor.fields.slider,
    [MetaformFieldType.Checklist]: strings.draftEditorScreen.editor.fields.checklist,
    [MetaformFieldType.Radio]: strings.draftEditorScreen.editor.fields.radio,
    [MetaformFieldType.Text]: strings.draftEditorScreen.editor.fields.text,
    [MetaformFieldType.Number]: strings.draftEditorScreen.editor.fields.number,
    [MetaformFieldType.Memo]: strings.draftEditorScreen.editor.fields.memo,
    [MetaformFieldType.Date]: strings.draftEditorScreen.editor.fields.date,
    [MetaformFieldType.DateTime]: strings.draftEditorScreen.editor.fields.dateAndTime,
    [MetaformFieldType.Files]: strings.draftEditorScreen.editor.fields.files,
    [MetaformFieldType.Table]: strings.draftEditorScreen.editor.fields.table,
    [MetaformFieldType.Submit]: strings.draftEditorScreen.editor.fields.submit,
    [MetaformFieldType.Url]: strings.draftEditorScreen.editor.fields.url,
    [MetaformFieldType.Email]: strings.draftEditorScreen.editor.fields.email,
    // MetaformFieldTypes below are not currently used and have no localization
    [MetaformFieldType.Hidden]: strings.generic.unknown,
    [MetaformFieldType.Time]: strings.generic.unknown,
    [MetaformFieldType.Logo]: strings.generic.unknown,
    [MetaformFieldType.SmallText]: strings.generic.unknown,
    [MetaformFieldType.Autocomplete]: strings.generic.unknown,
    [MetaformFieldType.AutocompleteMultiple]: strings.generic.unknown
  })[fieldType];

  /**
   * Returns localized name boolean value
   *
   * @param bool boolean value
   */
  export const getLocalizedBoolean = (bool: boolean): string => (bool ? strings.generic.yes : strings.generic.no);

}

export default LocalizationUtils;