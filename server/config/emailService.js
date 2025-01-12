// emailService.js
import nodemailer from "nodemailer";

// Configure the SMTP server
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // e.g. smtp.gmail.com for Gmail
  port: 465, // Port for secure connections (SSL)
  secure: true, // Set to true for port 465 (SSL)
  auth: {
    user: process.env.EMAIL, // your SMTP username
    pass: process.env.EMAIL_PASS, // your SMTP password
  },
});

// Function to send email
async function sendEmail(to, subject, text, html) {
  try {
    // Ensure recipient email is valid
    if (!to || to.trim() === "") {
      throw new Error("No recipient defined");
    }

    console.log("Sending email to:", to); // Log recipient email for debugging

    const info = await transporter.sendMail({
      from: process.env.EMAIL, // Sender address
      to, // Recipient address (must be a valid email string)
      subject, // Subject line
      text, // Plain text body
      html, // HTML body
    });
    console.log("Email sent: " + info.messageId); // Log messageId for success
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

export default sendEmail;
