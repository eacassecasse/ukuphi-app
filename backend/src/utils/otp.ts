import { sendMail } from "../lib/nodemailer";

export async function sendOTP(
  target: string,
  otp: string,
  method: "phone" | "email"
) {
  if (method === "email") {
    await sendMail(target, "Ukuphi Verification Code", "otp", {
      otp,
      expiry: "5",
    });
  } else if (method === "phone") {
    const message = {
      body: `Use this code to verify your account ${otp}, expires in 5 minutes.`,
      to: target,
    };

    // Implement the logic to send OTP via SMS
  }
}
