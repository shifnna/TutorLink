import nodemailer from "nodemailer";

export async function sendOTP(email: string, otpCode: string) {
  try {
    // transporter setup
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or use SMTP
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}. It will expire in 1 minute.`,
      html: `<h2>Your OTP Code</h2>
             <p><b>${otpCode}</b></p>
             <p>This code will expire in 5 minutes.</p>`,
    };

    // send email
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to:", email);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}
