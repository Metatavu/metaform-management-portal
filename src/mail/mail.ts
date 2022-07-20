const { REACT_APP_EMAIL_URL } = process.env;

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
    if (!REACT_APP_EMAIL_URL) {
      throw new Error("Missing REACT_APP_EMAIL_URL env");
    }

    return (await fetch(REACT_APP_EMAIL_URL, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(email)
    })).ok;
  };

}