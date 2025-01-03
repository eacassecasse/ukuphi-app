import nodemailer from "nodemailer";

export async function sendOTP(
  target: string,
  otp: string,
  method: "phone" | "email"
) {
  if (method === "email") {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Ukuphi Support" <${process.env.EMAIL_USER}>`,
      to: target,
      subject: "Email Activation OTP",
      text: `Use this code to verify your account ${otp}.\nExpires in 5 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to email: ${target}`);
    } catch (error) {
      console.error(`Failed to send OTP to ${target}:`, error);
      throw new Error("Failed to send OTP");
    }
  } else if (method === "phone") {

    const message = {
      body: `Use this code to verify your account ${otp}, expires in 5 minutes.`,
      to: target,
    };

    // Implement the logic to send OTP via SMS
  }
}
