import assert from 'node:assert/strict'
import test from 'node:test'
import {
  AIS_COMPANY_NAME,
  AIS_QUOTE_EMAIL_BRAND,
  SAMPLE_QUOTE_LEAD,
  renderQuoteNotification,
  resolveQuoteFromName,
} from './quote-email-template.mjs'

const hostile = {
  ...SAMPLE_QUOTE_LEAD,
  name: 'Ann <script>alert(1)</script> "quoted"',
  email: 'ann@example.com',
  description: 'Line one\n<img src=x onerror=alert(1)> & more',
  service: '<b>Mold</b>',
}

test('subject matches the A&B / Fieldtaskpro lead notification', () => {
  const message = renderQuoteNotification(SAMPLE_QUOTE_LEAD)
  assert.equal(message.subject, 'New lead · AIS Environmental Inc.: Jordan Hale')
  const injected = renderQuoteNotification({ name: 'Ann\r\nBcc: evil@example.com', email: 'ann@example.com', submittedAt: '2026-01-02T00:00:00.000Z' })
  assert.equal(injected.subject.includes('\n'), false)
  assert.equal(injected.subject.includes('\r'), false)
  assert.equal(injected.subject, 'New lead · AIS Environmental Inc.: Ann Bcc: evil@example.com')
})

test('html escapes user input and includes the quote fields', () => {
  const { html, text } = renderQuoteNotification(hostile)
  assert.equal(html.includes('<script>'), false)
  assert.equal(html.includes('<img src=x'), false)
  assert.equal(html.includes('<b>Mold</b>'), false)
  assert.match(html, /Ann &lt;script&gt;alert\(1\)&lt;\/script&gt; &quot;quoted&quot;/)
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt; &amp; more/)
  assert.match(html, /&lt;b&gt;Mold&lt;\/b&gt;/)
  for (const field of ['Name', 'Email', 'Phone', 'Service', 'Property type', 'Property address', 'City', 'State', 'ZIP', 'Timeline', 'Description', 'Submitted']) {
    assert.match(html, new RegExp(field))
    assert.match(text, new RegExp(field))
  }
  assert.match(html, /https:\/\/aisenvironmentalinc\.com\/ais-logo\.png/)
  assert.match(html, /2524 Scott St\., Franklin Park, IL 60131/)
  assert.match(html, /\(708\) 240-9468/)
  assert.match(html, /https:\/\/aisenvironmentalinc\.com\/"/)
  assert.match(html, /New lead/)
  assert.match(html, /Project details/)
  assert.match(text, /Reply to this email to reach/)
  assert.match(text, /info@aisenvironmentalinc\.com/)
})

test('missing fields use the same placeholders as the previous notification', () => {
  const { html, text } = renderQuoteNotification({ name: 'Pat', email: 'pat@example.com', submittedAt: '2026-01-02T00:00:00.000Z' })
  assert.match(html, /Not provided/)
  assert.match(html, /No description/)
  assert.match(text, /Service: Not provided/)
  assert.match(html, /#152773/)
  assert.match(html, /#d90002/)
})

test('photos section lists the count and filenames without raw html', () => {
  const { html, text } = renderQuoteNotification({
    ...SAMPLE_QUOTE_LEAD,
    photos: [{ filename: 'kitchen.jpg' }, { filename: 'ceiling <img>.png' }],
  })
  assert.match(html, />Photos</)
  assert.match(html, /2 photos/)
  assert.match(html, /kitchen\.jpg/)
  assert.match(html, /ceiling &lt;img&gt;\.png/)
  assert.equal(html.includes('ceiling <img>'), false)
  assert.match(text, /Photos/)
  assert.match(text, /Count: 2 photos/)
  assert.match(text, /kitchen\.jpg/)
  assert.match(text, /ceiling <img>\.png/)
})

test('a quote with no photos still lists a zero count', () => {
  const { html, text } = renderQuoteNotification(SAMPLE_QUOTE_LEAD)
  assert.match(html, /0 photos/)
  assert.match(html, /None/)
  assert.match(text, /Count: 0 photos/)
  assert.match(text, /Files: None/)
})

test('from display name defaults to AIS Environmental Inc. and corrects the misspelling', () => {
  assert.equal(resolveQuoteFromName(undefined), AIS_COMPANY_NAME)
  assert.equal(resolveQuoteFromName(''), AIS_COMPANY_NAME)
  assert.equal(resolveQuoteFromName('AIS Environmental'), AIS_COMPANY_NAME)
  assert.equal(resolveQuoteFromName('AIS Envrionmental Services'), AIS_COMPANY_NAME)
  assert.equal(resolveQuoteFromName('  AIS Envrionmental Services\n'), AIS_COMPANY_NAME)
  assert.equal(resolveQuoteFromName('Custom Desk'), 'Custom Desk')
  assert.equal(AIS_QUOTE_EMAIL_BRAND.companyName, AIS_COMPANY_NAME)
})
