import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import { activeOffers, catalogServices, featuredServices, services, servicesBySlug, servicesItemList, serviceKeyToSlug } from '../services'
import { serviceAttribution, serviceContactHref, withServiceAttribution } from '../../lib/service-attribution'

test('catalogue preserves four immersive destinations and exposes seven complete services', () => {
  assert.equal(services.length, 7)
  assert.equal(new Set(services.map((service) => service.slug)).size, 7)
  assert.deepEqual(featuredServices.map((service) => service.slug), Object.values(serviceKeyToSlug))
  assert.equal(activeOffers.length, 17)
  assert.equal(new Set(activeOffers.map((offer) => offer.id)).size, 17)
  for (const service of services) {
    assert.equal(servicesBySlug[service.slug], service)
    assert.ok(existsSync(`public${service.img}`))
    assert.ok(service.offers.some((offer) => offer.active))
    for (const field of ['metaTitle', 'metaDescription', 'heroTitle', 'heroSubtitle', 'heroCta', 'ctaTitle', 'ctaBody'] as const) assert.ok(service[field])
    assert.ok(service.valueProps.length && service.faqs.length)
    assert.equal(service.process.length, 4)
    assert.equal(service.results.length, 4)
    assert.ok(service.results.every((result) => !/\d/.test(result.value)))
    for (const offer of service.offers) {
      assert.ok(offer.outcome && offer.audience.length && offer.included.length && offer.channels.length)
      assert.match(offer.priceLabel, /desde|a partir de|sob diagnóstico/)
    }
  }
})

test('list schema uses ordered canonical destinations without commercial Offer schema', () => {
  assert.equal(servicesItemList.numberOfItems, services.length)
  assert.deepEqual(servicesItemList.itemListElement.map((item) => item.url), catalogServices.map((service) => `https://ag47.pt/servicos/${service.slug}`))
  assert.deepEqual(servicesItemList.itemListElement.map((item) => item.position), [1, 2, 3, 4, 5, 6, 7])
  assert.ok(!JSON.stringify(servicesItemList).includes('"Offer"'))
})

test('origin survives catalogue, LP, anchor and contact with safe encoding', () => {
  const query = '?utm_source=olx&utm_medium=marketplace&utm_campaign=site%20%26%20caf%C3%A9&utm_content=oferta-197&unrelated=private'
  const href = withServiceAttribution('/servicos/websites-landing-pages#ofertas', query)
  assert.ok(href.endsWith('#ofertas'))
  assert.equal(serviceAttribution(new URL(href, 'https://ag47.pt').search), serviceAttribution(query))
  const contact = serviceContactHref('Websites & Landing Pages', 'Site profissional', query)
  const fields = new URLSearchParams(contact.split('?')[1])
  assert.match(fields.get('subject')!, /Websites & Landing Pages — Site profissional/)
  assert.match(fields.get('body')!, /utm_source=olx/)
  assert.ok(!contact.includes('private'))
  assert.equal(withServiceAttribution('/servicos#grid-servicos', ''), '/servicos#grid-servicos')
  assert.ok(!decodeURIComponent(serviceContactHref('IA & Automação')).includes('Origem:'))
})
