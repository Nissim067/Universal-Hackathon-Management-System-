"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = require("./logger");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.SMTP_HOST,
    port: env_1.env.SMTP_PORT,
    secure: env_1.env.SMTP_PORT === 465,
    auth: {
        user: env_1.env.SMTP_USER,
        pass: env_1.env.SMTP_PASS,
    },
});
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: env_1.env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        logger_1.logger.info(`Email sent: ${info.messageId}`);
        return info;
    }
    catch (error) {
        logger_1.logger.error(`Error sending email: ${error instanceof Error ? error.message : String(error)}`);
        throw new Error('Failed to send email');
    }
};
exports.sendEmail = sendEmail;
