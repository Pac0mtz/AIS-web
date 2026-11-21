import { services, type Service } from './data'

export const relatedServiceSlugs: Record<string, [string, string, string]> = {
  asbestos: ['asbestos-testing', 'asbestos-surveys', 'commercial-asbestos'],
  lead: ['asbestos', 'asbestos-demolition', 'mold'],
  mold: ['mold-testing', 'water-damage', 'flooded-basement'],
  windows: ['doors', 'siding', 'gutters'],
  'asbestos-testing': ['asbestos-surveys', 'asbestos', 'asbestos-tile'],
  'asbestos-surveys': ['asbestos-testing', 'commercial-asbestos', 'asbestos-demolition'],
  'commercial-asbestos': ['asbestos-surveys', 'asbestos-demolition', 'asbestos-tile'],
  'asbestos-tile': ['asbestos-testing', 'asbestos', 'asbestos-demolition'],
  'asbestos-demolition': ['asbestos-surveys', 'commercial-asbestos', 'asbestos'],
  'mold-testing': ['mold', 'water-damage', 'flooded-basement'],
  'water-damage': ['flooded-basement', 'mold-testing', 'mold'],
  'flooded-basement': ['water-damage', 'mold-testing', 'mold'],
  roofing: ['gutters', 'siding', 'water-damage'],
  siding: ['windows', 'doors', 'gutters'],
  gutters: ['roofing', 'siding', 'flooded-basement'],
  doors: ['windows', 'siding', 'lead'],
}

export function getRelatedServices(service: Service): Service[] {
  return relatedServiceSlugs[service.slug].map(slug => services.find(item => item.slug === slug)!)
}
