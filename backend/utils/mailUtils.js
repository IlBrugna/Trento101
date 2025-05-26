import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter;

export async function initMailer() {
  if (process.env.SMTP_HOST) {
    // Usa SMTP configurato in .env
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Senno, crea un account Ethereal per test
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: testAccount,
    });
    console.log('Ethereal account →', testAccount.user);
  }

  await transporter.verify();
  console.log('Mail transporter ready');
}

export async function sendMail({ to, subject, text, html }) {
  if (!transporter) throw new Error('initMailer() non chiamato');

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || '"Trento101" <no-reply@example.com>',
    to,
    subject,
    text,
    html,
  });

  return info;
}