import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendVerificationEmail(
    to: string,
    token: string
): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: `${process.env.SMTP_USER_NAME} <${process.env.SMTP_USER}>`,
        to,
        subject: "Verify your email address",
        html: `
      <p>Thanks for signing up!</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you did not create an account, you can ignore this email.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
}
