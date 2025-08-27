import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { loadConfig } from "../helper/config.hepler";

loadConfig();

export enum Transport {
  SMTP = "SMTP",
}

type Transporter = nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

const transporters: Record<Transport, Transporter | null> = {
  [Transport.SMTP]: null,
};

if (process.env.SMTP_ENABLE && parseInt(process.env.SMTP_ENABLE) == 1) {
  transporters[Transport.SMTP] = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_MAIL_USER,
      pass: process.env.SMTP_MAIL_PASS,
    },
  });
}

/**
 * Sends an email using the specified transport.
 * @param mailOptions The mail options to pass to nodemailer.
 * @param transport The transport to use. Defaults to SMTP.
 * @returns A promise that resolves when the email is sent.
 * @throws An error if the transport is not initialized.
 */
export const sendEmail = async (
  mailOptions: Mail.Options,
  transport: Transport = Transport.SMTP
): Promise<any> => {
  try {
    if (transporters[transport]) {
      return await transporters[transport].sendMail(mailOptions);
    } else {
      throw new Error(`${transport} not initialized`);
    }
  } catch (error: any) {
    console.log(error);
    // throw createHttpError(500, { message: error.message });
  }
};

/**
 * Returns an HTML string containing a link to reset a user's password.
 * The link is in the format `<a href="${process.env.FE_BASE_URL}/reset-password?token=${token}">here</a>`.
 * @param token The password reset token. Defaults to an empty string.
 * @returns An HTML string containing the password reset link.
 */
export const resetPasswordEmailTemplate = (token = ""): string => `
<html>
  <body>
    <h3>Welcome to app</h3>
    <p>Click <a href="${process.env.FE_BASE_URL}/reset-password?token=${token}">here</a> to reset your password</p>
  </body>
</html>`;
