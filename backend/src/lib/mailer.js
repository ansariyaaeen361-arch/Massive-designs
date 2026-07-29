import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export async function sendContactEmail({ name, email, phone, company, message }) {
  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to: process.env.MAIL_TO_EMAIL,
    replyTo: email,
    subject: 'New Contact Form Submission',
    html: `
      <strong>Name:</strong> ${name} <br>
      <strong>Email:</strong> ${email} <br>
      <strong>Phone/Skype:</strong> ${phone || '-'} <br>
      <strong>Company:</strong> ${company || '-'} <br>
      <strong>Message:</strong><br>${message}
    `,
  });
}
