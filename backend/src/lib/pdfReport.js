import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo.png');

const CATEGORY_LABELS = {
  performance: 'Performance',
  seo: 'SEO',
  mobile: 'Mobile-Friendliness',
  security: 'Security',
  accessibility: 'Accessibility',
};

const PRIMARY = '#5C9A0E';
const HEADING = '#131217';
const MUTED = '#6B6B6B';
const TRACK = '#EDEDED';
const RED = '#D64545';
const AMBER = '#C98A1A';
const CTA_BG = '#F2F9E7';
const CTA_BORDER = '#CFE8A8';

const PAGE_WIDTH = 595.28;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_TEXT = 'Fixed by Massive Designs — book a free consultation at https://massive-designs.com/contact';

const CONTACT_EMAIL = 'info@massive-designs.com';
const CONTACT_PHONE_DISPLAY = '+1 786 936 4483';
const CONTACT_PHONE_TEL = 'tel:+17869364483';
const CONTACT_URL = 'https://massive-designs.com/contact';

function tierColor(score) {
  if (score >= 80) return PRIMARY;
  if (score >= 50) return AMBER;
  return RED;
}

function drawFooter(doc) {
  // Drawing this close to the physical bottom edge would normally trip
  // pdfkit's own page-break check inside text(), silently creating a
  // trailing blank page. Zeroing the bottom margin while we draw here
  // suppresses that check without affecting the rest of the layout.
  const bottomMargin = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;

  const y = doc.page.height - 55;
  doc
    .save()
    .moveTo(MARGIN, y)
    .lineTo(PAGE_WIDTH - MARGIN, y)
    .lineWidth(0.5)
    .strokeColor(TRACK)
    .stroke()
    .restore();

  doc
    .fillColor(MUTED)
    .font('Helvetica')
    .fontSize(8)
    .text(FOOTER_TEXT, MARGIN, y + 12, { width: CONTENT_WIDTH, align: 'center' });

  doc.page.margins.bottom = bottomMargin;
}

function drawScoreBar(doc, x, y, width, score) {
  const height = 8;
  doc.roundedRect(x, y, width, height, height / 2).fill(TRACK);
  const fillWidth = Math.max(height, (width * score) / 100);
  doc.roundedRect(x, y, fillWidth, height, height / 2).fill(tierColor(score));
}

function drawCtaSection(doc) {
  const padding = 20;
  const innerWidth = CONTENT_WIDTH - padding * 2;
  const heading = 'Want These Issues Fixed For You?';
  const body =
    "You don't have to tackle this alone. Massive Designs can handle everything in this report — performance, SEO, security, and every issue in between — so your website works the way it should. Reach out and we'll take it from here.";
  const buttonHeight = 30;

  doc.font('Helvetica-Bold').fontSize(14);
  const headingHeight = doc.heightOfString(heading, { width: innerWidth });
  doc.font('Helvetica').fontSize(10.5);
  const bodyHeight = doc.heightOfString(body, { width: innerWidth });

  const boxHeight = padding * 2 + headingHeight + 8 + bodyHeight + 18 + buttonHeight + 28;

  if (doc.y + boxHeight > doc.page.height - 90) {
    doc.addPage();
  }

  const boxTop = doc.y;
  doc.roundedRect(MARGIN, boxTop, CONTENT_WIDTH, boxHeight, 12).fillAndStroke(CTA_BG, CTA_BORDER);

  let cursorY = boxTop + padding;
  doc.fillColor(HEADING).font('Helvetica-Bold').fontSize(14).text(heading, MARGIN + padding, cursorY, {
    width: innerWidth,
  });
  cursorY += headingHeight + 8;

  doc.fillColor(MUTED).font('Helvetica').fontSize(10.5).text(body, MARGIN + padding, cursorY, { width: innerWidth });
  cursorY += bodyHeight + 18;

  const emailLabel = `Email Us: ${CONTACT_EMAIL}`;
  const bookLabel = 'Book a Free Consultation';
  doc.font('Helvetica-Bold').fontSize(10.5);
  const emailBtnWidth = doc.widthOfString(emailLabel) + 32;
  const bookBtnWidth = doc.widthOfString(bookLabel) + 32;

  const emailBtnX = MARGIN + padding;
  doc.roundedRect(emailBtnX, cursorY, emailBtnWidth, buttonHeight, buttonHeight / 2).fill(PRIMARY);
  doc
    .fillColor('#FFFFFF')
    .text(emailLabel, emailBtnX, cursorY + 9, { width: emailBtnWidth, align: 'center', lineBreak: false });
  doc.link(emailBtnX, cursorY, emailBtnWidth, buttonHeight, `mailto:${CONTACT_EMAIL}`);

  const bookBtnX = emailBtnX + emailBtnWidth + 12;
  doc
    .roundedRect(bookBtnX, cursorY, bookBtnWidth, buttonHeight, buttonHeight / 2)
    .lineWidth(1.2)
    .stroke(PRIMARY);
  doc
    .fillColor(PRIMARY)
    .text(bookLabel, bookBtnX, cursorY + 9, { width: bookBtnWidth, align: 'center', lineBreak: false });
  doc.link(bookBtnX, cursorY, bookBtnWidth, buttonHeight, CONTACT_URL);

  cursorY += buttonHeight + 16;

  const phoneLabel = `Or call us: ${CONTACT_PHONE_DISPLAY}`;
  doc.font('Helvetica').fontSize(10);
  const phoneWidth = doc.widthOfString(phoneLabel);
  doc.fillColor(HEADING).text(phoneLabel, MARGIN + padding, cursorY, { lineBreak: false });
  doc.link(MARGIN + padding, cursorY - 2, phoneWidth, 14, CONTACT_PHONE_TEL);

  doc.y = boxTop + boxHeight + 12;
}

export function generateAuditPdf({ url, overallScore, scores, issues }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: MARGIN, bufferPages: true });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    try {
      doc.image(LOGO_PATH, MARGIN, 40, { width: 28, height: 28 });
    } catch {
      // logo missing on disk shouldn't break report generation
    }
    doc
      .fillColor(HEADING)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('MASSIVE DESIGNS', MARGIN + 38, 48, { characterSpacing: 1 });

    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(9)
      .text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), MARGIN, 48, {
        width: CONTENT_WIDTH,
        align: 'right',
      });

    doc.moveTo(MARGIN, 84).lineTo(PAGE_WIDTH - MARGIN, 84).lineWidth(1).strokeColor(TRACK).stroke();

    doc.y = 104;
    doc.fillColor(HEADING).font('Helvetica-Bold').fontSize(24).text('Website Audit Report');
    doc.moveDown(0.15);
    doc.fillColor(MUTED).font('Helvetica').fontSize(11).text(url);

    // Overall score
    doc.moveDown(1.2);
    const scoreTop = doc.y;
    const scoreText = String(overallScore);
    doc.font('Helvetica-Bold').fontSize(48);
    const scoreWidth = doc.widthOfString(scoreText);
    doc.fillColor(tierColor(overallScore)).text(scoreText, MARGIN, scoreTop);
    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(18)
      .text(' / 100', MARGIN + scoreWidth, scoreTop + 22);
    doc.fillColor(MUTED).font('Helvetica').fontSize(10).text('OVERALL SCORE', MARGIN, scoreTop + 54);
    doc.y = scoreTop + 70;

    // Score breakdown
    doc.moveDown(0.6);
    doc.fillColor(HEADING).font('Helvetica-Bold').fontSize(14).text('Score Breakdown');
    doc.moveDown(0.6);

    const barWidth = 220;
    Object.entries(scores).forEach(([key, value]) => {
      const rowY = doc.y;
      doc.fillColor(HEADING).font('Helvetica').fontSize(10).text(CATEGORY_LABELS[key] ?? key, MARGIN, rowY + 1, {
        width: 150,
      });
      drawScoreBar(doc, MARGIN + 155, rowY + 3, barWidth, value);
      doc
        .fillColor(tierColor(value))
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(`${value}/100`, MARGIN + 155 + barWidth + 10, rowY + 1, { width: 50, align: 'right' });
      doc.y = rowY + 20;
    });

    // Issues
    doc.moveDown(1);
    doc
      .fillColor(HEADING)
      .font('Helvetica-Bold')
      .fontSize(14)
      .text(issues.length > 0 ? `Issues Found (${issues.length})` : 'Issues Found');
    doc.moveDown(0.6);

    if (issues.length === 0) {
      doc.fillColor(MUTED).font('Helvetica').fontSize(10).text('No significant issues found. Great work!');
    } else {
      issues.forEach((issue, index) => {
        if (doc.y > doc.page.height - 140) {
          doc.addPage();
        }

        const badgeY = doc.y;
        const badgeRadius = 9;
        doc.circle(MARGIN + badgeRadius, badgeY + badgeRadius, badgeRadius).fill(PRIMARY);
        doc
          .fillColor('#FFFFFF')
          .font('Helvetica-Bold')
          .fontSize(8)
          .text(String(index + 1), MARGIN, badgeY + badgeRadius - 4, {
            width: badgeRadius * 2,
            align: 'center',
            lineBreak: false,
          });

        doc
          .fillColor(HEADING)
          .font('Helvetica-Bold')
          .fontSize(11)
          .text(issue.title, MARGIN + 24, badgeY, { width: CONTENT_WIDTH - 24 });

        doc
          .fillColor(MUTED)
          .font('Helvetica')
          .fontSize(9.5)
          .text(issue.description, MARGIN + 24, doc.y + 2, { width: CONTENT_WIDTH - 24 });

        doc.moveDown(0.3);
        doc
          .fillColor(PRIMARY)
          .font('Helvetica-Bold')
          .fontSize(9.5)
          .text('How to fix: ', MARGIN + 24, doc.y, { continued: true, width: CONTENT_WIDTH - 24 })
          .fillColor(HEADING)
          .font('Helvetica')
          .text(issue.fix);

        doc.moveDown(0.9);
      });
    }

    doc.moveDown(0.4);
    drawCtaSection(doc);

    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i += 1) {
      doc.switchToPage(range.start + i);
      drawFooter(doc);
    }

    doc.end();
  });
}
