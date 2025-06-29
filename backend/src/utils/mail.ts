import { env } from '@src/utils/env';
import nodemailer from 'nodemailer';

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const mailer = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
      user: env.ZOHO_USER!,
      pass: env.ZOHO_PASS!,
    },
  });

  await mailer.sendMail({
    from: `"TrainWithX" <${process.env.ZOHO_USER}>`,
    to,
    subject,
    html,
  });
  console.log('SENT?');
}
