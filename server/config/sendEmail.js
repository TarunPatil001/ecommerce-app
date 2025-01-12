// sendEmailFun.js
import sendEmail from "./emailService.js";

const sendEmailFun = async (to, subject, text, html) => {
  // Check if email recipient is valid
  if (!to || to.trim() === "") {
    console.error("Recipient email is missing or empty.");
    return false; // early exit if there's no recipient
  }

  // Log the email address to ensure it's passed correctly
  console.log("Sending email to:", to);

  const result = await sendEmail(to, subject, text, html);
  return result.success;
}

export default sendEmailFun;
