import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  authMethod: 'PLAIN',
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

export async function sendClientWelcomeEmail({ to, name, loginUrl, embedSnippet }) {
  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to,
    subject: 'Your Analytics Dashboard is Ready',
    html: `
      <p>Hi ${name},</p>
      <p>Your analytics dashboard has been set up. Log in here:</p>
      <p><a href="${loginUrl}">${loginUrl}</a></p>
      <p>To start collecting data, add this snippet to your site (just before
        the closing <code>&lt;/body&gt;</code> tag works well):</p>
      <pre style="background:#f4f4f4;padding:12px;border-radius:6px;">${embedSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      <p>&mdash; Massive Designs</p>
    `,
  });
}

const SEVERITY_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#0ea5e9' };

export async function sendAlertEmail({ to, siteName, dashboardUrl, alert }) {
  const color = SEVERITY_COLOR[alert.severity] || '#64748b';
  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to,
    subject: `[${alert.severity.toUpperCase()}] ${siteName}: ${alert.whatHappened}`,
    html: `
      <p style="display:inline-block;padding:2px 10px;border-radius:12px;background:${color}22;color:${color};font-size:12px;font-weight:600;text-transform:uppercase;">${alert.severity} priority</p>
      <h2 style="margin:12px 0 4px;">${alert.whatHappened}</h2>
      <p><strong>Evidence:</strong> ${alert.evidence}</p>
      ${alert.suggestedAction ? `<p><strong>Suggested action:</strong> ${alert.suggestedAction}</p>` : ''}
      <p><a href="${dashboardUrl}">Open your dashboard</a></p>
    `,
  });
}

function fmtDuration(ms) {
  if (ms === null || ms === undefined) return 'N/A';
  const s = Math.round(ms / 1000);
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
}

function reportRows(items, render) {
  if (!items.length) return '<p style="color:#94a3b8;font-size:13px;margin:4px 0;">None</p>';
  return `<ul style="margin:4px 0;padding-left:18px;">${items.map((i) => `<li style="margin:2px 0;font-size:13px;">${render(i)}</li>`).join('')}</ul>`;
}

export async function sendPeriodicReportEmail({ to, siteName, dashboardUrl, frequency, report }) {
  const periodLabel = frequency === 'monthly' ? 'Monthly' : 'Weekly';
  const since = new Date(report.period.since).toLocaleDateString();
  const until = new Date(report.period.until).toLocaleDateString();
  const t = report.traffic;

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to,
    subject: `${siteName}: Your ${periodLabel} Analytics Report`,
    html: `
      <p style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">${periodLabel} Report &middot; ${since} &ndash; ${until}</p>
      <h2 style="margin:4px 0 16px;">${siteName}</h2>

      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:16px;">
        <tr>
          <td style="padding:8px 12px;background:#f8fafc;border-radius:6px;"><strong>${t.pageViews}</strong><br><span style="font-size:12px;color:#64748b;">Page views</span></td>
          <td style="width:8px;"></td>
          <td style="padding:8px 12px;background:#f8fafc;border-radius:6px;"><strong>${t.sessions}</strong><br><span style="font-size:12px;color:#64748b;">Sessions</span></td>
          <td style="width:8px;"></td>
          <td style="padding:8px 12px;background:#f8fafc;border-radius:6px;"><strong>${t.bounceRatePct ?? 'N/A'}${t.bounceRatePct !== null ? '%' : ''}</strong><br><span style="font-size:12px;color:#64748b;">Bounce rate</span></td>
          <td style="width:8px;"></td>
          <td style="padding:8px 12px;background:#f8fafc;border-radius:6px;"><strong>${fmtDuration(t.avgDurationMs)}</strong><br><span style="font-size:12px;color:#64748b;">Avg. duration</span></td>
        </tr>
      </table>

      <h3 style="margin:16px 0 4px;font-size:14px;">Top pages</h3>
      ${reportRows(report.topPages, (p) => `${p.page} &mdash; ${p.pageViews} views (${p.sharePct}%)`)}

      <h3 style="margin:16px 0 4px;font-size:14px;">Traffic channels</h3>
      ${reportRows(report.channels, (c) => `${c.channel} &mdash; ${c.sharePct}%`)}

      ${report.conversions.hasGoalsEnabled ? `
      <h3 style="margin:16px 0 4px;font-size:14px;">Conversions</h3>
      <p style="font-size:13px;margin:4px 0;">${report.conversions.totalConversions} total (${report.conversions.conversionRatePct ?? 'N/A'}${report.conversions.conversionRatePct !== null ? '%' : ''} of sessions)</p>
      ` : ''}

      ${report.opportunities.length ? `
      <h3 style="margin:16px 0 4px;font-size:14px;">Opportunities</h3>
      ${reportRows(report.opportunities.slice(0, 3), (o) => o.whatHappened)}
      ` : ''}

      ${report.anomalies.length ? `
      <h3 style="margin:16px 0 4px;font-size:14px;">Things that changed</h3>
      ${reportRows(report.anomalies.slice(0, 3), (a) => a.whatHappened)}
      ` : ''}

      <p style="margin-top:20px;"><a href="${dashboardUrl}" style="color:#4f46e5;">Open your full dashboard &rarr;</a></p>
      <p style="color:#94a3b8;font-size:12px;margin-top:24px;">You're receiving this because ${periodLabel.toLowerCase()} email reports are enabled for ${siteName}. You can turn them off anytime in Settings.</p>
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
