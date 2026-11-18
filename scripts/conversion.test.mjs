import assert from 'node:assert/strict'
import { test } from 'node:test'
import { callClickEvents, createQuoteConversionScheduler, spaPageViewEvents } from '../src/lib/quote-conversion.mjs'
import { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID, REQUEST_QUOTE_CONVERSION_LABEL } from '../src/lib/tracking-ids.mjs'

function harness() {
  let store = 'pending'
  let fires = 0
  const timers = new Map()
  let nextId = 1
  const schedule = createQuoteConversionScheduler({
    getItem: () => store,
    setItem: value => { store = value },
    send: () => { fires += 1 },
    setTimeout: fn => {
      const id = nextId++
      timers.set(id, fn)
      return id
    },
    clearTimeout: id => { timers.delete(id) },
  })
  return {
    schedule,
    flush() {
      for (const [id, fn] of [...timers]) {
        timers.delete(id)
        fn()
      }
    },
    get fires() { return fires },
    get store() { return store },
    set store(value) { store = value },
  }
}

test('a successful quote schedules one conversion and a refresh does not repeat it', () => {
  const run = harness()
  const cancelFirst = run.schedule()
  cancelFirst()
  const cancelSecond = run.schedule()
  run.flush()
  assert.equal(typeof cancelSecond, 'function')
  assert.equal(run.fires, 1)
  assert.equal(run.store, 'fired')
  run.schedule()
  run.flush()
  assert.equal(run.fires, 1)
})

test('a thank-you visit without a successful submit does not convert', () => {
  const run = harness()
  run.store = ''
  run.schedule()
  run.flush()
  assert.equal(run.fires, 0)
})

test('a second successful submit can convert once more', () => {
  const run = harness()
  run.schedule()
  run.flush()
  run.store = 'pending'
  run.schedule()
  run.flush()
  assert.equal(run.fires, 2)
})

test('phone clicks are generic click_to_call events for Ads and GA4, not a call conversion', () => {
  const events = callClickEvents('tel:+17082409468', { adsId: GOOGLE_ADS_ID, ga4Id: GA4_MEASUREMENT_ID })
  assert.deepEqual(events.map(event => event.name), ['click_to_call', 'click_to_call'])
  assert.equal(events[0].params.send_to, GOOGLE_ADS_ID)
  assert.equal(events[1].params.send_to, GA4_MEASUREMENT_ID)
  assert.equal(events.some(event => String(event.params.send_to).includes('/')), false)
  assert.equal(REQUEST_QUOTE_CONVERSION_LABEL, 'lRxqCJnzvOUYENH2tqoC')
})

test('client-side page views do not send an Ads page_view on /thank-you', () => {
  const thankYou = spaPageViewEvents('/thank-you', { adsId: GOOGLE_ADS_ID, ga4Id: GA4_MEASUREMENT_ID })
  assert.deepEqual(thankYou.map(event => event.params.send_to), [GA4_MEASUREMENT_ID])
  const about = spaPageViewEvents('/about/', { adsId: GOOGLE_ADS_ID, ga4Id: GA4_MEASUREMENT_ID })
  assert.deepEqual(about.map(event => event.params.send_to), [GA4_MEASUREMENT_ID, GOOGLE_ADS_ID])
})
