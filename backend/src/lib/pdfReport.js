import PDFDocument from 'pdfkit';

const CATEGORY_LABELS = {
  performance: 'Performance',
  seo: 'SEO',
  mobile: 'Mobile-Friendliness',
  security: 'Security',
  accessibility: 'Accessibility',
};

const PRIMARY_COLOR = '#7DB525';
const HEADING_COLOR = '#131217';
const MUTED_COLOR = '#5B5B5B';

const BOOKING_URL = 'https://massive-designs.com/contact';

export function generateAuditPdf({ url, overallScore, scores, issues }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc
      .fillColor(HEADING_COLOR)
      .fontSize(22)
      .text('Website Audit Report', { align: 'left' })
      .moveDown(0.2);

    doc
      .fillColor(MUTED_COLOR)
      .fontSize(11)
      .text(url, { align: 'left' })
      .moveDown(1);

    doc
      .fillColor(PRIMARY_COLOR)
      .fontSize(16)
      .text(`Overall Score: ${overallScore} / 100`)
      .moveDown(1);

    doc.fillColor(HEADING_COLOR).fontSize(14).text('Score Breakdown').moveDown(0.5);
    Object.entries(scores).forEach(([key, value]) => {
      doc
        .fillColor(MUTED_COLOR)
        .fontSize(11)
        .text(`${CATEGORY_LABELS[key] ?? key}: ${value} / 100`);
    });
    doc.moveDown(1);

    doc.fillColor(HEADING_COLOR).fontSize(14).text('Issues Found').moveDown(0.5);
    if (issues.length === 0) {
      doc.fillColor(MUTED_COLOR).fontSize(11).text('No significant issues found. Great work!');
    } else {
      issues.forEach((issue, index) => {
        doc
          .fillColor(HEADING_COLOR)
          .fontSize(12)
          .text(`${index + 1}. ${issue.title}`, { continued: false });
        doc
          .fillColor(MUTED_COLOR)
          .fontSize(10)
          .text(issue.description, { indent: 12 })
          .moveDown(0.6);
      });
    }

    doc.moveDown(1);
    doc
      .fillColor(MUTED_COLOR)
      .fontSize(9)
      .text(`Fixed by Massive Designs — book a free consultation at ${BOOKING_URL}`, {
        align: 'center',
      });

    doc.end();
  });
}
