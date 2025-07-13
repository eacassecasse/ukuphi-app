"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const transporter = nodemailer_1.default.createTransport({
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
const sendMail = async (target, subject, templateName, variables) => {
    try {
        const templatePath = path_1.default.join(__dirname, "..", "config", "templates", `${templateName}.html`);
        const html = fs_1.default.readFileSync(templatePath, "utf-8");
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
    }
    catch (error) {
        throw error;
    }
};
exports.sendMail = sendMail;
