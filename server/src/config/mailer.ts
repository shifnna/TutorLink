import nodemailer from "nodemailer";

export async function sendOTP(
  email: string,
  otpCode: string
): Promise<void> {
  try {
    const transporter =
      nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user:
            process.env.EMAIL_USER,
          pass:
            process.env.EMAIL_PASS,
        },
      });

    const mailOptions = {
      from:
        process.env.EMAIL_USER,
      to: email,
      subject:
        "Your OTP Code",
      text: `Your OTP code is ${otpCode}. It will expire in 1 minute.`,
      html: `
        <h2>Your OTP Code</h2>
        <p><b>${otpCode}</b></p>
        <p>This code will expire in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(
      mailOptions
    );

    console.log(
      "OTP email sent to:",
      email
    );
  } catch (error: unknown) {
  console.error(error instanceof Error ? `error sending otp email ${error.message}` : error);

    throw new Error(
      "Failed to send OTP email",
      {
        cause: error,
      }
    );
  }
}