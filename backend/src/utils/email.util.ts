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
    token: string,
    route: string
): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/${route}?token=${token}`;

    const mailOptions = {
        from: `${process.env.SMTP_USER_NAME} <${process.env.SMTP_USER}>`,
        to,
        subject: "Please Verify yourself",
        html: `
      <p>Thanks for Verification!</p>
      <p>Please verify yourself by clicking the link below:</p>
      <a href="${verificationUrl}">Verify yourself</a>
      <p>If you did not create an account / ask for reset-password, you can ignore this email.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
}

