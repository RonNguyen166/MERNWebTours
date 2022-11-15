import nodemailer from "nodemailer";
import config from "../config/config.js";
import { convert } from "html-to-text";
import pug from "pug";

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== "test") {
  transport
    .verify()
    .then(() => console.log("Connected to email server"))
    .catch(() =>
      console.log(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

const sendEmail = async (to, subject, html, text) => {
  const msg = { from: config.email.from, to, subject, html, text };
  await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  const restPassUrl = `${req.protocol}://${req.get(
    "host"
  )}/rest-password?token=${token}`;
  const html = pug.renderFile(`${__dirname}/../views/email/passwordReset.pug`, {
    url: restPassUrl,
    subject,
    name: to.name,
  });
  const text = convert(html, {
    wordwrap: 130,
  });
  await sendEmail(to.email, subject, html, text);
};

const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  const verificationEmailUrl = `${req.protocol}://${req.get(
    "host"
  )}verify-email?token=${token}`;
  const html = pug.renderFile(`${__dirname}/../views/email/welcome.pug`, {
    subject,
    url: verificationEmailUrl,
    name: to.name,
  });
  const text = convert(html, {
    wordwrap: 130,
  });
  await sendEmail(to.email, subject, html, text);
};

export { transport, sendEmail, sendResetPasswordEmail, sendVerificationEmail };
