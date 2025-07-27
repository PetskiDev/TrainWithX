import { env } from '@src/utils/env.js';
import fs from 'node:fs/promises';
import nodemailer from 'nodemailer';
import path from 'node:path';

/** Create transporter only once (singleton) */
const mailer = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: env.ZOHO_USER!,
    pass: env.ZOHO_PASS!,
  },
});

/** Default "from" field */
const FROM = `"TrainWithX" <${env.ZOHO_USER}>`;

/** Send a basic HTML email */
export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log(env.EMAIL_ENABLED);
  if (!env.EMAIL_ENABLED) {
    console.log(`[DEV] Skipping email to ${to}: ${subject}`);
    return;
  }
  try {
    await mailer.sendMail({ from: FROM, to, subject, html });
    console.log(`Mail sent to ${to} : ${subject}`);
  } catch (err) {
    console.error('❌ ERROR SENDING MAIL:', err);
  }
}

/** Load and send email from an HTML file with {{placeholders}} replaced */
export async function sendMailFromFile(
  to: string,
  subject: string,
  filename: string,
  replacements: Record<string, string> = {}
) {
  const templatePath = path.join(
    __dirname,
    '..',
    'templates',
    `${filename}.html`
  );
  let html = await fs.readFile(templatePath, 'utf8');

  for (const [key, val] of Object.entries(replacements)) {
    html = html.replaceAll(`{{${key}}}`, val);
  }

  await sendMail({ to, subject, html });
}
