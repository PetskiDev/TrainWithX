import { sendMailFromFile } from "@src/utils/mail.js";
import { env } from "@src/utils/env.js";

type ContactMessage = {
  email: string;
  reason: string;
  customReason?: string;
  message: string;
};

export async function sendContactMessage({
  email,
  reason,
  customReason,
  message,
}: ContactMessage) {
  const finalReason =
    reason === "other" && customReason ? customReason : reason;

  await sendMailFromFile(
    env.CONTACT_EMAIL, // Define this in env.ts as the internal recipient
    `Contact Form Message: ${reason}`,
    "contact-message", // You’ll need to create a matching template
    {
      email,
      reason: finalReason,
      message,
      year: new Date().getFullYear().toString(),
    }
  );

  await sendMailFromFile(
    email,
    `Contact Form Message Recieved`,
    "contact-message",
    {
      email,
      reason: finalReason,
      message,
      year: new Date().getFullYear().toString(),
    }
  );
}
