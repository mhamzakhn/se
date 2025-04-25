// backend/controller/adminController.js
import { sendMail } from "../utils/emailService.js";
import Profile from "../models/Profiles.js";

export const sendAdminEmail = async (req, res) => {
  const { subject, content } = req.body;

  if (!subject?.trim() || !content?.trim()) {
    return res
      .status(400)
      .json({ message: "Subject and content are required." });
  }

  try {
    // 1) Pull every user's email
    const profiles = await Profile.find({}, "email").lean();
    const emails = profiles.map((p) => p.email);

    if (emails.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found to send email to." });
    }

    // 2) Send one message, BCC'ing everyone
    await sendMail({
      to: process.env.SMTP_FROM,    // must supply a 'to'; using your own address
      bcc: emails,                  // hides recipients from each other
      subject,
      text: content,
      html: `<p>${content.replace(/\n/g, "<br>")}</p>`,
    });

    res.status(200).json({ message: "Emails sent successfully." });
  } catch (err) {
    console.error("sendAdminEmail error:", err);
    res.status(500).json({ message: "Failed to send emails." });
  }
};
