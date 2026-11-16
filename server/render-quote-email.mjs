/**
 * Render a fake quote lead with the AIS notification template and the same
 * layout branded as A&B, for visual comparison. Does not send mail.
 *
 *   node server/render-quote-email.mjs [output-dir]
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { AIS_QUOTE_EMAIL_BRAND, SAMPLE_QUOTE_LEAD, renderQuoteNotification } from './quote-email-template.mjs'

const AB_QUOTE_EMAIL_BRAND = {
  companyName: 'A&B Environmental Construction, Inc.',
  logoUrl: 'https://abenvironmentalcons.com/ab-logo.png',
  color: '#1e40af',
  accent: '#1e40af',
  address: '1534 N Mannheim Rd, Stone Park, IL 60165',
  phone: '(708) 344-0190',
  phoneHref: 'tel:+17083440190',
  website: 'https://abenvironmentalcons.com',
  websiteLabel: 'abenvironmentalcons.com',
  email: 'info@abenvironmentalcons.com',
}

const outDir = path.resolve(process.argv[2] || 'server/samples')
const ais = renderQuoteNotification(SAMPLE_QUOTE_LEAD, AIS_QUOTE_EMAIL_BRAND)
const ab = renderQuoteNotification(SAMPLE_QUOTE_LEAD, AB_QUOTE_EMAIL_BRAND)

mkdirSync(outDir, { recursive: true })
writeFileSync(path.join(outDir, 'ais-quote-email.html'), ais.html)
writeFileSync(path.join(outDir, 'ais-quote-email.txt'), ais.text)
writeFileSync(path.join(outDir, 'ab-quote-email.html'), ab.html)
writeFileSync(
  path.join(outDir, 'comparison.html'),
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Quote notification comparison</title>
  <style>
    body { margin: 0; background: #e2e8f0; font-family: Georgia, serif; color: #0f172a; }
    header { padding: 28px 32px 8px; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    p { margin: 0; max-width: 820px; line-height: 1.5; }
    .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 24px 32px 48px; }
    figure { margin: 0; }
    figcaption { font-family: system-ui, sans-serif; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 10px; }
    iframe { width: 100%; height: 1320px; border: 0; background: #f1f5f9; border-radius: 12px; }
  </style>
</head>
<body>
  <header>
    <h1>Lead notification emails</h1>
    <p>Same fake quote, same template. A&amp;B on the left, AIS Environmental Inc. on the right. Nothing was emailed.</p>
  </header>
  <div class="pair">
    <figure>
      <figcaption>A&amp;B Environmental</figcaption>
      <iframe title="A&amp;B lead email" src="ab-quote-email.html"></iframe>
    </figure>
    <figure>
      <figcaption>AIS Environmental Inc.</figcaption>
      <iframe title="AIS lead email" src="ais-quote-email.html"></iframe>
    </figure>
  </div>
</body>
</html>
`,
)

console.log(ais.subject)
console.log(outDir)
