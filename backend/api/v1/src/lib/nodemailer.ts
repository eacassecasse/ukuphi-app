import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async (
  target: string,
  subject: string,
  templateName: string,
  variables: Record<string, string>
) => {
  try {
    const templatePath = path.join(
      __dirname,
      "..",
      "config",
      "templates",
      `${templateName}.html`
    );
    const html = fs.readFileSync(templatePath, "utf-8");

    const populatedHtml = Object.keys(variables).reduce((content, key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      return content.replace(regex, variables[key]);
    }, html);

    const mailOptions = {
      from: `"Ukuphi Support" <${process.env.EMAIL_USER}>`,
      to: target,
      subject,
      html: populatedHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    throw error;
  }
};
