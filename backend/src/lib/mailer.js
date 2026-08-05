import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  authMethod: 'LOGIN',
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

export async function sendAuditReportEmail({ to, url, overallScore, pdfBuffer }) {
  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to,
    subject: `Your Website Audit Report for ${url}`,
    html: `
      <p>Hi,</p>
      <p>Thanks for running a free website audit with Massive Designs. Your site scored
        <strong>${overallScore}/100</strong>. Your full detailed report is attached as a PDF.</p>
      <p>Want help fixing the issues we found? <a href="https://massive-designs.com/contact">Book a free consultation</a>
        and our team will walk you through it.</p>
      <p>&mdash; Massive Designs</p>
    `,
    attachments: [
      {
        filename: 'massive-designs-website-audit.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}
