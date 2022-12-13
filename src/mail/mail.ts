import Config from "app/config";

/**
 * Interface describing an email
 */
export interface Email {
  to: string;
  from: string;
  subject: string;
  html: string;
}

/**
 * Class for sending emails
 */
export default class Mail {

  /**
   * Sends an email
   *
   * @param email email data
   */
  public static sendMail = async (email: Email) => {
    return (await fetch(Config.getEmailUrl(), {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(email)
    })).ok;
  };

}