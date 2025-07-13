"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = sendOTP;
const nodemailer_1 = require("../lib/nodemailer");
async function sendOTP(target, otp, method) {
    if (method === "email") {
        await (0, nodemailer_1.sendMail)(target, "Ukuphi Verification Code", "otp", {
            otp,
            expiry: "5",
        });
    }
    else if (method === "phone") {
        const message = {
            body: `Use this code to verify your account ${otp}, expires in 5 minutes.`,
            to: target,
        };
        // Implement the logic to send OTP via SMS
    }
}
