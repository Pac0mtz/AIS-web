export type Industry = {
  id: string
  number: string
  name: string
  shortName: string
  summary: string
  description: string
  properties: string[]
  priorities: string[]
  serviceSlugs: string[]
}

export const industries: Industry[] = [
  { id: 'residential', number: '01', name: 'Residential & Homeowners', shortName: 'Residential', summary: 'Clear answers for the place you call home.', description: 'From a suspect floor tile to a wet basement or exterior upgrade, we help homeowners understand the condition, the scope and what happens before work begins.', properties: ['Single-family homes', 'Condominiums', 'Townhomes', 'Basements and attics'], priorities: ['Respect for furnishings and finished spaces', 'Clear testing and removal options', 'Moisture and source-control planning', 'Clean work areas and practical closeout'], serviceSlugs: ['asbestos-testing', 'lead-inspection', 'mold-testing', 'flooded-basement', 'roofing', 'windows'] },
  { id: 'property-management', number: '02', name: 'Multi-Family & Property Management', shortName: 'Multi-family', summary: 'Coordinated work across units and shared spaces.', description: 'We support property managers and owners with unit-specific concerns, common-area projects and broader building assessments that require careful scheduling and communication.', properties: ['Apartment buildings', 'Condominium associations', 'Mixed-use properties', 'Managed residential portfolios'], priorities: ['Unit and common-area scope definition', 'Occupant and access coordination', 'Repeatable documentation across locations', 'Phased work planning'], serviceSlugs: ['asbestos-surveys', 'commercial-asbestos', 'lead-inspection', 'mold-remediation', 'water-damage', 'gutters'] },
  { id: 'commercial', number: '03', name: 'Commercial & Retail Properties', shortName: 'Commercial', summary: 'Property work planned around business activity.', description: 'Offices, shops and customer-facing spaces need a clear work zone and schedule. We coordinate environmental and property services with the way the building is used.', properties: ['Offices and professional suites', 'Retail and restaurants', 'Mixed-use commercial spaces', 'Hospitality properties'], priorities: ['Customer and employee separation from work areas', 'Phased or scheduled project planning', 'Coordination with other trades', 'Documented material handling'], serviceSlugs: ['commercial-asbestos', 'asbestos-tile', 'mold-remediation', 'water-damage', 'roofing', 'doors'] },
  { id: 'industrial', number: '04', name: 'Industrial & Manufacturing Facilities', shortName: 'Industrial', summary: 'Defined scopes for complex working buildings.', description: 'Industrial properties can combine older mechanical systems, production areas and active operations. Surveys and removal plans are organized around the actual material and work area.', properties: ['Manufacturing facilities', 'Warehouses and logistics buildings', 'Mechanical and utility spaces', 'Industrial renovation sites'], priorities: ['Mechanical-system material review', 'Work-zone and access control', 'Selective demolition coordination', 'Disposal and closeout records'], serviceSlugs: ['asbestos-surveys', 'commercial-asbestos', 'asbestos-demolition', 'mold-testing', 'water-damage', 'roofing'] },
  { id: 'education', number: '05', name: 'Schools & Educational Facilities', shortName: 'Education', summary: 'Careful planning for learning environments.', description: 'We help educational property teams evaluate building materials, moisture concerns and exterior needs with attention to occupied areas and project timing.', properties: ['Schools and administrative buildings', 'Classroom and activity spaces', 'Gymnasiums and support areas', 'Campus maintenance projects'], priorities: ['Clear boundaries around work areas', 'Schedule and access coordination', 'Material-specific documentation', 'Closeout before follow-on work'], serviceSlugs: ['asbestos-surveys', 'asbestos-testing', 'lead-inspection', 'mold-testing', 'water-damage', 'roofing'] },
  { id: 'healthcare', number: '06', name: 'Healthcare & Senior-Living Facilities', shortName: 'Healthcare', summary: 'Extra attention to occupants and adjacent spaces.', description: 'Healthcare and senior-care properties require thoughtful coordination around vulnerable occupants, sensitive rooms and ongoing building operations.', properties: ['Medical and professional offices', 'Senior-living communities', 'Care-facility common areas', 'Support and service spaces'], priorities: ['Occupant-aware scope planning', 'Adjacent-space protection', 'Controlled access and cleaning', 'Clear communication with facility teams'], serviceSlugs: ['asbestos-testing', 'commercial-asbestos', 'lead-inspection', 'mold-remediation', 'water-damage', 'doors'] },
  { id: 'government', number: '07', name: 'Government & Municipal Buildings', shortName: 'Municipal', summary: 'Organized documentation for public-property work.', description: 'Municipal and public buildings benefit from a well-defined inventory, scope and closeout record, particularly when renovation or demolition involves multiple stakeholders.', properties: ['Municipal offices', 'Public works facilities', 'Community buildings', 'Public-property renovation sites'], priorities: ['Project-specific material inventories', 'Scope and disposal documentation', 'Contractor and stakeholder coordination', 'Phased renovation support'], serviceSlugs: ['asbestos-surveys', 'asbestos-demolition', 'commercial-asbestos', 'lead', 'mold-testing', 'roofing'] },
  { id: 'contractors', number: '08', name: 'General Contractors & Construction Partners', shortName: 'Contractors', summary: 'Environmental scopes that fit the construction sequence.', description: 'We work with project teams on testing, abatement and selective removal so affected materials are addressed before follow-on trades begin.', properties: ['Renovation projects', 'Demolition preparation', 'Tenant improvements', 'Property restoration work'], priorities: ['Pre-construction material review', 'Defined trade and scope boundaries', 'Schedule and access coordination', 'Closeout for the next phase'], serviceSlugs: ['asbestos-testing', 'asbestos-demolition', 'commercial-asbestos', 'lead-inspection', 'mold-remediation', 'water-damage'] },
]

export type StateCode = 'IL' | 'IN' | 'WI'
export type ServiceArea = {
  kind: 'state' | 'city'
  name: string
  slug: string
  state: string
  stateCode: StateCode
  stateSlug: string
  path: string
  context: string
  needs: string[]
}

const stateNeeds: Record<StateCode, string[]> = {
  IL: ['Asbestos surveys for renovation and demolition', 'Lead paint evaluation for older painted surfaces', 'Basement water, mold and moisture assessment', 'Roofing, siding, windows and drainage improvements'],
  IN: ['Asbestos testing before property improvements', 'Lead-aware planning for older homes and buildings', 'Water intrusion and mold remediation', 'Exterior repairs and moisture-control coordination'],
  WI: ['Asbestos and lead-paint assessment for older properties', 'Basement moisture, flooding and mold concerns', 'Water-damage drying and repair planning', 'Roofing, siding, gutter and window projects'],
}

const stateSeeds: Array<[string, string, StateCode, string]> = [
  ['Illinois', 'illinois', 'IL', 'homes, multi-unit buildings, offices, schools, industrial facilities and renovation projects across the state'],
  ['Indiana', 'indiana', 'IN', 'residential neighborhoods, commercial properties, industrial buildings and community facilities across Northwest Indiana and the wider state'],
  ['Wisconsin', 'wisconsin', 'WI', 'homes, apartments, businesses, manufacturing properties and public buildings across Southeast Wisconsin and the wider state'],
]

export const stateAreas: ServiceArea[] = stateSeeds.map(([name, slug, stateCode, context]) => ({
  kind: 'state', name, slug, state: name, stateCode, stateSlug: slug, path: `/service-areas/${slug}/`, context, needs: stateNeeds[stateCode],
}))

const citySeeds: Array<[string, string, StateCode, string]> = [
  ['Chicago', 'chicago-il', 'IL', 'city homes, two-flats and larger multi-unit buildings, storefronts, offices, schools and industrial properties'],
  ['Naperville', 'naperville-il', 'IL', 'single-family homes, townhomes, offices, schools, retail spaces and mixed-use properties'],
  ['Aurora', 'aurora-il', 'IL', 'older housing, newer subdivisions, commercial buildings, warehouses and community facilities'],
  ['Joliet', 'joliet-il', 'IL', 'residential properties, industrial and logistics buildings, offices and municipal spaces'],
  ['Evanston', 'evanston-il', 'IL', 'older homes, apartment and condominium buildings, institutional properties and neighborhood businesses'],
  ['Schaumburg', 'schaumburg-il', 'IL', 'homes, office properties, retail and hospitality spaces, warehouses and light-industrial buildings'],
  ['Oak Park', 'oak-park-il', 'IL', 'older single-family homes, multi-unit buildings, schools and local commercial properties'],
  ['Cicero', 'cicero-il', 'IL', 'homes, multi-unit residential buildings, industrial facilities and neighborhood commercial spaces'],
  ['Des Plaines', 'des-plaines-il', 'IL', 'homes, apartments, offices, hospitality properties and light-industrial buildings'],
  ['Rockford', 'rockford-il', 'IL', 'homes, manufacturing facilities, schools, healthcare properties and commercial buildings'],
  ['Elgin', 'elgin-il', 'IL', 'older properties, residential subdivisions, manufacturing spaces and neighborhood businesses'],
  ['Peoria', 'peoria-il', 'IL', 'homes, healthcare and educational properties, manufacturing facilities and commercial spaces'],
  ['Hinsdale', 'hinsdale-il', 'IL', 'single-family residences, professional offices, schools and local commercial buildings'],
  ['Glenview', 'glenview-il', 'IL', 'homes, offices, retail spaces, schools and light-industrial properties'],
  ['Morton Grove', 'morton-grove-il', 'IL', 'single-family homes, schools, local businesses and light-industrial buildings'],
  ['Skokie', 'skokie-il', 'IL', 'homes, apartment buildings, schools, retail properties and professional offices'],
  ['Arlington Heights', 'arlington-heights-il', 'IL', 'homes, multi-unit residences, downtown commercial properties and office buildings'],
  ['Oak Lawn', 'oak-lawn-il', 'IL', 'homes, healthcare properties, retail spaces, schools and professional offices'],
  ['Berwyn', 'berwyn-il', 'IL', 'older homes, multi-unit buildings, schools and neighborhood commercial properties'],
  ['Palatine', 'palatine-il', 'IL', 'homes, townhomes, schools, offices and light-industrial properties'],
  ['Orland Park', 'orland-park-il', 'IL', 'homes, retail and office properties, schools and community facilities'],
  ['Tinley Park', 'tinley-park-il', 'IL', 'homes, schools, retail spaces, offices and community buildings'],
  ['Wheaton', 'wheaton-il', 'IL', 'homes, schools, professional offices and local commercial properties'],
  ['Gary', 'gary-in', 'IN', 'older homes, multi-unit properties, industrial facilities, commercial buildings and redevelopment sites'],
  ['Hammond', 'hammond-in', 'IN', 'residential properties, schools, industrial buildings, offices and local businesses'],
  ['East Chicago', 'east-chicago-in', 'IN', 'homes, apartment buildings, industrial properties and neighborhood commercial spaces'],
  ['Merrillville', 'merrillville-in', 'IN', 'homes, offices, retail and hospitality properties, schools and commercial buildings'],
  ['Valparaiso', 'valparaiso-in', 'IN', 'single-family homes, multi-unit residences, educational properties and local businesses'],
  ['Crown Point', 'crown-point-in', 'IN', 'homes, professional offices, schools, municipal properties and commercial spaces'],
  ['Milwaukee', 'milwaukee-wi', 'WI', 'older homes, multi-unit buildings, offices, manufacturing properties and neighborhood businesses'],
  ['Kenosha', 'kenosha-wi', 'WI', 'homes, apartments, schools, industrial properties and commercial buildings'],
  ['Racine', 'racine-wi', 'WI', 'older residential properties, manufacturing facilities, offices and local commercial spaces'],
  ['Madison', 'madison-wi', 'WI', 'homes, apartments, educational and government properties, offices and commercial buildings'],
  ['Green Bay', 'green-bay-wi', 'WI', 'homes, multi-unit residences, industrial and logistics properties and commercial buildings'],
  ['Beloit', 'beloit-wi', 'WI', 'older homes, multi-unit properties, industrial buildings and local businesses'],
  ['Janesville', 'janesville-wi', 'WI', 'homes, schools, manufacturing facilities, offices and neighborhood commercial properties'],
  ['Waukesha', 'waukesha-wi', 'WI', 'single-family homes, apartments, offices, schools and light-industrial buildings'],
  ['Wauwatosa', 'wauwatosa-wi', 'WI', 'older homes, multi-unit residences, healthcare and professional properties and local businesses'],
  ['Pleasant Prairie', 'pleasant-prairie-wi', 'WI', 'homes, offices, retail spaces, warehouses and light-industrial properties'],
  ['West Allis', 'west-allis-wi', 'WI', 'homes, apartment buildings, schools, manufacturing properties and local businesses'],
  ['Burlington', 'burlington-wi', 'WI', 'single-family homes, older commercial properties, schools and light-industrial buildings'],
]

export const cityAreas: ServiceArea[] = citySeeds.map(([name, slug, stateCode, context]) => {
  const state = stateSeeds.find(seed => seed[2] === stateCode)!
  return { kind: 'city', name, slug, state: state[0], stateCode, stateSlug: state[1], path: `/service-areas/${slug}/`, context, needs: stateNeeds[stateCode] }
})

export const serviceAreas: ServiceArea[] = [...stateAreas, ...cityAreas]

export type Faq = { category: string; question: string; answer: string }
export const faqs: Faq[] = [
  { category: 'Getting started', question: 'How do I know which service to request?', answer: 'Start with what you can see or what work you are planning. You do not need to diagnose the material yourself. Tell us the property location, the affected area and any renovation or repair plans; we can help identify whether testing, inspection, removal or another service is the right first step.' },
  { category: 'Getting started', question: 'Do you provide free estimates?', answer: 'Yes. You can request a free project estimate online or by phone. The estimate process starts with the property address, service needed, affected area and your project goals. Testing or inspection may be needed before a final scope can be defined.' },
  { category: 'Getting started', question: 'Where does AIS Environmental work?', answer: 'AIS serves communities across Illinois, Indiana and Wisconsin, including Chicago and the surrounding suburbs, Northwest Indiana and Southeast Wisconsin. Visit the Service Areas page for individual state and city pages, or contact us to discuss scheduling for your property.' },
  { category: 'Asbestos', question: 'Can I tell whether a material contains asbestos by looking at it?', answer: 'No. Many asbestos-containing materials look like ordinary building products. Testing and laboratory analysis are needed to confirm whether a suspect material contains asbestos. Avoid cutting, sanding or removing it before the material is assessed.' },
  { category: 'Asbestos', question: 'When should an asbestos survey be scheduled?', answer: 'Schedule a survey before renovation, demolition or maintenance work that could disturb suspect materials. A survey can also be useful when older materials are damaged or when a property team needs a documented material inventory.' },
  { category: 'Asbestos', question: 'Does every asbestos-containing material need to be removed?', answer: 'Not always. The appropriate response depends on the material, its condition, its location and whether future work will disturb it. Management in place, encapsulation or removal may be considered after the material is assessed.' },
  { category: 'Lead and mold', question: 'Why is lead paint inspection important before renovation?', answer: 'Sanding, scraping and cutting lead-painted components can create hazardous dust and chips. Inspection identifies where lead is present so the project can use appropriate containment, removal, encapsulation or cleaning procedures.' },
  { category: 'Lead and mold', question: 'Is mold testing enough to solve a mold problem?', answer: 'Testing alone does not correct mold or the moisture that allowed it to grow. A useful inspection also considers visible growth, wet materials, leaks, humidity and ventilation. Remediation should address both the affected material and the moisture source.' },
  { category: 'Water damage', question: 'What should I do first after water enters a basement?', answer: 'Avoid entering areas with potential electrical or contamination hazards and stop the water source if it is safe to do so. Contact a qualified professional to assess extraction, damaged materials and structural drying. Photographs can help document the initial condition.' },
  { category: 'Water damage', question: 'How long does structural drying take?', answer: 'Drying time varies with the water source, affected materials, airflow, humidity and how long the materials remained wet. Moisture readings are more useful than a fixed timetable when deciding whether drying is complete.' },
  { category: 'Exterior services', question: 'Can exterior repairs be coordinated with water or mold work?', answer: 'Yes. Roofing, siding and gutter problems can contribute to interior moisture. The project can be planned so active water entry is addressed before damaged finishes are restored, with mold or material concerns assessed separately when needed.' },
  { category: 'Exterior services', question: 'Do windows and doors need full replacement?', answer: 'Not every issue requires full replacement. Drafts, hardware problems, damaged frames, fogged glass and moisture can have different causes. A review of the opening helps determine whether a localized repair or complete replacement is more practical.' },
]

export const projectTypes = [
  { number: '01', title: 'Pre-renovation asbestos assessment', text: 'Survey and sampling scopes organized around the materials and rooms that planned construction will disturb.', serviceSlugs: ['asbestos-surveys', 'asbestos-testing', 'asbestos-tile'], image: '/images/asbestos-hero.webp' },
  { number: '02', title: 'Commercial abatement coordination', text: 'Containment, removal and closeout planning for offices, retail, industrial and multi-family properties.', serviceSlugs: ['commercial-asbestos', 'asbestos-demolition'], image: '/images/asbestos-hero.webp' },
  { number: '03', title: 'Lead-safe property improvements', text: 'Inspection and surface-specific planning before older painted components are repaired, encapsulated or removed.', serviceSlugs: ['lead-inspection', 'lead'], image: '/images/lead-hero.webp' },
  { number: '04', title: 'Basement moisture and mold response', text: 'Moisture mapping, affected-material review, remediation and drying organized around the water source.', serviceSlugs: ['mold-testing', 'mold', 'flooded-basement'], image: '/images/mold-hero.webp' },
  { number: '05', title: 'Water-damage drying and repair', text: 'Extraction, selective material removal, structural drying and coordination with the repair phase.', serviceSlugs: ['water-damage', 'flooded-basement'], image: '/images/water-damage.webp' },
  { number: '06', title: 'Exterior envelope improvements', text: 'Roofing, siding, gutters, windows and doors considered together at the transitions that keep weather out.', serviceSlugs: ['roofing', 'siding', 'gutters', 'windows', 'doors'], image: '/images/siding.webp' },
]
