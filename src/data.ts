import { additionalServices } from './serviceCatalog'

export type ServiceCategory = 'Asbestos' | 'Lead & Mold' | 'Water Damage' | 'Exterior'

export type ServiceSection = {
  id: string
  title: string
  intro: string
  points: string[]
}

export type Service = {
  path: string
  slug: string
  name: string
  shortName: string
  number: string
  eyebrow: string
  headline: string
  slogan: string
  intro: string
  description: string
  image: string
  imageAlt: string
  quoteOption: string
  category: ServiceCategory
  featured?: boolean
  scope: string
  sections: ServiceSection[]
}

export const services: Service[] = [
  {
    path: '/asbestos-services/', slug: 'asbestos', name: 'Asbestos removal', shortName: 'Asbestos', number: '01',
    eyebrow: 'Testing · Abatement · Documentation', headline: 'Asbestos Removal in Chicago',
    slogan: 'Asbestos removal in Chicago.',
    intro: 'A methodical approach to identifying, containing and removing asbestos-containing materials from residential, commercial and industrial properties.',
    description: 'Asbestos testing, removal and abatement for Chicago homes, businesses and industrial properties, with careful containment and clear documentation.',
    image: '/images/asbestos-hero.webp', imageAlt: 'Protective-suited technicians working inside a contained asbestos abatement area', quoteOption: 'Asbestos', category: 'Asbestos', featured: true,
    scope: 'From suspect floor tile and pipe insulation to roofing materials, every project starts with a clear understanding of the material and the space around it.',
    sections: [
      { id: 'materials', title: 'Know the materials', intro: 'Asbestos can be present in building materials that look ordinary. Disturbing them without a plan can release microscopic fibers into the air.', points: ['Floor and ceiling tile', 'Vermiculite and pipe insulation', 'Roofing and siding materials', 'Adhesives, plaster and older building products'] },
      { id: 'inspection', title: 'Inspect before disturbing', intro: 'The inspection defines the condition, location and likely scope of asbestos-containing materials before renovation, demolition or removal begins.', points: ['Visual examination of accessible materials', 'Sample collection and laboratory testing', 'Thermal imaging and laser scanning where useful', 'A defined work area and removal plan'] },
      { id: 'removal', title: 'Contain. Remove. Clean.', intro: 'Removal is organized around preventing fibers from traveling beyond the work area and protecting the people inside it.', points: ['Physical containment and negative-air equipment', 'Protective clothing and respirators', 'Wet removal methods and air monitoring', 'Sealed packaging and approved disposal'] },
      { id: 'encapsulation', title: 'Encapsulation when appropriate', intro: 'When material is intact and removal is not the right immediate approach, an encapsulant may be used to seal fibers in place. The right option depends on material condition and future work planned for the space.', points: ['Bridging encapsulants form a protective surface layer', 'Penetrating encapsulants soak into the material', 'Condition and accessibility guide the recommendation', 'Encapsulated material still requires future awareness'] },
      { id: 'documentation', title: 'Close the loop', intro: 'The closeout record gives owners, occupants and project teams a useful account of the completed work.', points: ['Certificate of completion', 'Disposal documentation', 'Available air-testing results', 'A clear record for future property work'] },
    ],
  },
  {
    path: '/lead-paint-removal/', slug: 'lead', name: 'Lead removal & abatement', shortName: 'Lead', number: '02',
    eyebrow: 'Removal · Abatement · Containment', headline: 'Lead Paint Removal & Abatement in Chicago',
    slogan: 'Lead paint, handled with care.',
    intro: 'Lead paint removal and abatement for older painted surfaces, with containment, controlled work practices and detailed cleaning built into the plan.',
    description: 'Lead paint removal and abatement for Chicago-area homes and properties, with careful containment, controlled removal and detailed cleaning.',
    image: '/images/lead-hero.webp', imageAlt: 'Respirator-equipped technician removing deteriorated paint from an older window frame', quoteOption: 'Lead', category: 'Lead & Mold', featured: true,
    scope: 'Lead paint becomes a particular concern when it chips, peels or is disturbed during repairs. We help property owners understand the condition and choose a practical next step.',
    sections: [
      { id: 'scope-review', title: 'Define the removal scope', intro: 'We review the affected painted components, existing project documentation and planned renovations to organize the removal and abatement work.', points: ['Affected windows, doors, trim and other components', 'Existing lead reports supplied by the property owner', 'Work-area boundaries and access', 'Protection of surrounding rooms and finishes'] },
      { id: 'removal', title: 'Control dust at the source', intro: 'Work is planned to isolate the area, limit spread and remove deteriorated paint without turning a localized issue into a property-wide cleanup.', points: ['Sealed work rooms and protected adjacent areas', 'Task-appropriate protective equipment', 'HEPA vacuuming and wet cleaning', 'Detailed post-work cleaning and waste handling'] },
      { id: 'abatement', title: 'Plan the abatement around the surface', intro: 'The affected components and their condition guide the work sequence. We coordinate removal, access and waste handling around the property and the agreed scope.', points: ['Methods matched to the affected components', 'Controlled handling of painted materials', 'Protection of adjacent finishes and occupied spaces', 'Cleanup and disposal coordination'] },
      { id: 'safety', title: 'Renovate with a lead-aware plan', intro: 'Older homes and buildings deserve extra care before sanding, cutting or demolition. Work practices should address exposure risks for occupants and workers.', points: ['Discuss planned renovations before work starts', 'Keep occupants away from active work zones', 'Use lead-appropriate work and cleaning practices', 'Review the completed scope and closeout documentation'] },
    ],
  },
  {
    path: '/mold-remediation/', slug: 'mold', name: 'Mold remediation', shortName: 'Mold', number: '03',
    eyebrow: 'Inspection · Remediation · Moisture control', headline: 'Mold Remediation in Chicago',
    slogan: 'Mold removal starts with moisture.',
    intro: 'A source-first remediation process: inspect the space, contain the affected area, remove contamination and correct the conditions that allowed growth.',
    description: 'Mold inspection and remediation in Chicago, including containment, HEPA filtration, moisture correction and follow-up indoor-air-quality testing.',
    image: '/images/mold-hero.webp', imageAlt: 'Technician using a moisture meter to assess a basement wall', quoteOption: 'Mold', category: 'Lead & Mold', featured: true,
    scope: 'Visible mold is only part of the picture. Lasting remediation depends on finding water intrusion, humidity or condensation and addressing it alongside the cleanup.',
    sections: [
      { id: 'inspection', title: 'Read the whole room', intro: 'The inspection maps visible growth, likely moisture pathways and areas that may be affected beyond the first visible spot.', points: ['Moisture-meter readings', 'Air and surface sampling where appropriate', 'Laboratory analysis of collected samples', 'Thermal imaging to help locate hidden moisture'] },
      { id: 'remediation', title: 'A six-step work sequence', intro: 'Each phase builds on the last, from isolation through cleaning and final deodorization. The exact scope is adapted to the affected materials and building.', points: ['Contain the work area', 'Protect workers and occupants', 'Correct the moisture source', 'Clean with appropriate antimicrobial methods', 'Apply fogging or disinfection where specified', 'Deodorize and complete final cleaning'] },
      { id: 'moisture', title: 'Fix the reason it grew', intro: 'Removing visible growth without correcting moisture leaves the conditions in place for a repeat problem. Source control is an essential part of the conversation.', points: ['Identify leaks and water intrusion', 'Address persistent condensation', 'Review ventilation and humidity conditions', 'Dry affected materials and verify moisture levels'] },
      { id: 'air-quality', title: 'Filter, clean and follow up', intro: 'HEPA filtration and detailed cleaning help manage particles during remediation. Follow-up testing may be used to evaluate conditions after the work.', points: ['HEPA air filtration during work', 'Detailed cleaning of affected surfaces', 'Treatment options matched to the space', 'Follow-up indoor-air-quality testing where specified'] },
    ],
  },
  {
    path: '/windows-installation/', slug: 'windows', name: 'Window installation', shortName: 'Windows', number: '04',
    eyebrow: 'Replacement · Efficiency · Finish', headline: 'Window Installation in Chicago',
    slogan: 'Better windows. A better room.',
    intro: 'Thoughtful window replacement for comfort, efficiency and curb appeal—from the first measurement through the final cleanup.',
    description: 'Window replacement and installation for Chicago-area homes, with vinyl, wood, aluminum and fiberglass options and a clean, careful installation process.',
    image: '/images/windows-hero.webp', imageAlt: 'Two installers fitting a dark-framed window into a brick residence', quoteOption: 'Windows', category: 'Exterior', featured: true,
    scope: 'Drafts, difficult operation and damaged frames are practical signals that it may be time to review your windows. We help narrow the options and plan a clean installation.',
    sections: [
      { id: 'when-to-replace', title: 'When replacement makes sense', intro: 'One issue does not automatically mean every window needs replacing. A room-by-room review helps separate maintenance needs from broader performance problems.', points: ['Drafts and rising energy bills', 'Condensation or fogging between panes', 'Rot, water damage or deteriorated frames', 'Difficult operation, damaged screens and outside noise'] },
      { id: 'replacement', title: 'Measured. Installed. Finished.', intro: 'A successful replacement depends on accurate dimensions, careful removal and attention to the interior and exterior finish.', points: ['Initial consultation and product review', 'Precise measurements', 'Removal and disposal of old windows', 'Trim, surface protection and final cleanup'] },
      { id: 'window-options', title: 'Choose for the way you live', intro: 'Material, glazing and operation all affect the final result. We help compare the practical differences rather than defaulting to one package for every opening.', points: ['Vinyl, wood, aluminum and fiberglass frames', 'Double- and triple-pane glass', 'Tinted and Low-E options', 'Multiple operating styles, screens and accessories'] },
      { id: 'benefits', title: 'Comfort you can feel', intro: 'Well-selected, correctly installed windows can improve day-to-day comfort while refreshing the look of the property.', points: ['Improved energy performance', 'More consistent room comfort', 'Reduced exterior noise and UV exposure', 'Updated appearance and durable operation'] },
    ],
  },
  ...additionalServices,
]

export type PostSection = { heading: string; paragraphs: string[]; points?: string[] }
export type Post = {
  path: string
  slug: string
  title: string
  shortTitle: string
  category: 'Health' | 'Home Improvement'
  categoryPath: string
  date: string
  excerpt: string
  image: string
  servicePath: string
  serviceName: string
  sections: PostSection[]
}

export const posts: Post[] = [
  {
    path: '/2023/12/27/the-dangers-of-asbestos-and-how-ais-environmental-inc-can-help/', slug: 'the-dangers-of-asbestos-and-how-ais-environmental-inc-can-help',
    title: 'The Dangers of Asbestos and How AIS Environmental Inc. Can Help', shortTitle: 'The dangers of asbestos', category: 'Health', categoryPath: '/category/health/', date: 'December 27, 2023',
    excerpt: 'Where asbestos may be found, why disturbance matters, and how a careful inspection and abatement plan helps reduce exposure.', image: '/images/asbestos-hero.webp', servicePath: '/asbestos-services/', serviceName: 'Asbestos services',
    sections: [
      { heading: 'What is asbestos?', paragraphs: ['Asbestos is a group of naturally occurring minerals valued in building products for heat resistance and durability. Its microscopic fibers become a concern when asbestos-containing material is damaged or disturbed and fibers become airborne.', 'Because those fibers can remain in the air and be inhaled, suspect materials should not be sanded, cut or removed without an appropriate assessment and work plan.'] },
      { heading: 'Where might it be found?', paragraphs: ['Older properties can contain asbestos in a range of ordinary-looking materials. Its presence cannot be confirmed by appearance alone.'], points: ['Insulation around pipes, boilers and ducts', 'Floor tiles, ceiling tiles and adhesives', 'Roofing, siding and cement products', 'Textured coatings and some older plasters'] },
      { heading: 'Why professional handling matters', paragraphs: ['A professional process focuses on identifying the material, isolating the work area and limiting the spread of fibers. Depending on the material and its condition, the plan may involve removal, encapsulation or another management approach.', 'AIS Environmental Inc. provides inspection, testing and abatement services for property owners planning repairs, renovation or removal. The goal is a clear scope, controlled work practices and useful closeout documentation.'] },
    ],
  },
  {
    path: '/2023/12/27/the-potential-dangers-of-mold-insights-from-ais-environmental-inc/', slug: 'the-potential-dangers-of-mold-insights-from-ais-environmental-inc',
    title: 'The Potential Dangers of Mold: Insights from AIS Environmental Inc.', shortTitle: 'Understanding mold risk', category: 'Health', categoryPath: '/category/health/', date: 'December 27, 2023',
    excerpt: 'Mold is a moisture problem as much as a cleaning problem. Learn what to look for and why source control belongs in the remediation plan.', image: '/images/mold-hero.webp', servicePath: '/mold-remediation/', serviceName: 'Mold remediation',
    sections: [
      { heading: 'Mold and indoor spaces', paragraphs: ['Mold spores are common in the environment, but uncontrolled growth indoors can damage materials and affect the quality of the space. Musty odors, staining and visible growth are reasons to investigate rather than simply cover the surface.', 'Responses vary by person and situation. If occupants have health concerns, they should consult a qualified medical professional while the building condition is assessed separately.'] },
      { heading: 'The moisture connection', paragraphs: ['Mold needs moisture to grow. Leaks, flooding, condensation, high humidity and inadequate ventilation can all create suitable conditions. Cleanup that ignores the source can leave the property vulnerable to recurrence.'], points: ['Check plumbing and roof leaks', 'Review damp basements and crawl spaces', 'Address condensation around windows and cold surfaces', 'Dry water-damaged areas promptly and thoroughly'] },
      { heading: 'A structured remediation response', paragraphs: ['An inspection helps define the affected area and likely moisture source. Remediation may then combine containment, removal or cleaning of affected materials, HEPA filtration and drying.', 'AIS Environmental Inc. approaches mold as both a contamination and moisture-management issue, with the scope adapted to the property rather than a one-size-fits-all treatment.'] },
    ],
  },
  {
    path: '/2023/12/27/understanding-the-health-issues-associated-with-lead-paint/', slug: 'understanding-the-health-issues-associated-with-lead-paint',
    title: 'Understanding the Health Issues Associated with Lead Paint', shortTitle: 'Lead paint: what owners should know', category: 'Health', categoryPath: '/category/health/', date: 'December 27, 2023',
    excerpt: 'Why deteriorated lead paint and renovation dust deserve attention, and what property owners can do before work begins.', image: '/images/lead-hero.webp', servicePath: '/lead-paint-removal/', serviceName: 'Lead paint services',
    sections: [
      { heading: 'Why lead paint is a concern', paragraphs: ['Lead-based paint was used in many older homes and buildings. When it remains intact and undisturbed it may present a different immediate risk than paint that is peeling, chalking or being sanded and cut during renovation.', 'Lead dust and chips can contaminate floors, soil and other surfaces. Exposure is especially important to discuss with a medical professional when children, pregnant people or other vulnerable occupants are involved.'] },
      { heading: 'Common exposure pathways', paragraphs: ['The concern is not limited to large peeling areas. Normal wear on friction surfaces and ordinary repairs can create dust if the work is not planned appropriately.'], points: ['Deteriorated paint chips and contaminated dust', 'Sanding, scraping, cutting or demolition', 'Opening and closing older painted windows and doors', 'Soil near older exterior painted surfaces'] },
      { heading: 'Practical next steps', paragraphs: ['Work on confirmed lead-based paint should use suitable containment, removal and cleaning procedures. Existing project documentation and the affected components help define the abatement scope.', 'AIS Environmental Inc. provides lead paint removal and abatement. We help owners organize the work area and plan controlled removal before dust spreads beyond the repair area.'] },
    ],
  },
  {
    path: '/2023/12/27/do-i-need-new-windows-ais-environmental-inc-2/', slug: 'do-i-need-new-windows-ais-environmental-inc-2',
    title: 'Do I Need New Windows? – AIS Environmental Inc.', shortTitle: 'Do I need new windows?', category: 'Home Improvement', categoryPath: '/category/home-improvement/', date: 'December 27, 2023',
    excerpt: 'Drafts, fogged glass and difficult operation can signal different problems. Here is how to think through repair versus replacement.', image: '/images/windows-hero.webp', servicePath: '/windows-installation/', serviceName: 'Window installation',
    sections: [
      { heading: 'Start with the symptoms', paragraphs: ['Windows affect comfort, energy use, noise and the appearance of a room. Drafts, rising utility bills, condensation between panes and deteriorated frames are all useful signals—but they do not all point to the same solution.', 'A careful review of each opening helps determine whether a localized repair is reasonable or whether replacement is the more practical long-term investment.'] },
      { heading: 'Signs worth a closer look', paragraphs: ['Performance issues often appear gradually. Comparing rooms and noting when problems occur can make the assessment more useful.'], points: ['Noticeable drafts and inconsistent room temperatures', 'Moisture or fogging trapped between glass panes', 'Rot, soft wood or water-damaged trim', 'Windows that stick, will not lock or are difficult to open', 'Excess outdoor noise or dated, damaged frames'] },
      { heading: 'Choosing the replacement', paragraphs: ['Frame material, glass package and operating style should match the property and the way the room is used. Vinyl, wood, aluminum and fiberglass each offer different maintenance and appearance considerations.', 'AIS Environmental Inc. provides consultation, measurement, removal, installation and finishing. The aim is a window that fits correctly, operates smoothly and feels considered from both inside and outside the home.'] },
    ],
  },
]

export const contact = {
  phoneDisplay: '(708) 240-9468',
  phoneHref: 'tel:+17082409468',
  email: 'info@aisenvironmentalinc.com',
  publicEmail: 'aisenviroservice@gmail.com',
  address: '2524 Scott St. Franklin Park, IL 60131',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=2524+Scott+St+Franklin+Park+IL+60131',
}

export const processSteps = [
  { number: '01', title: 'Start a conversation', text: 'Tell us what you are seeing, where it is and what work you are planning.' },
  { number: '02', title: 'Schedule the visit', text: 'We coordinate a practical time to review the property and define the scope.' },
  { number: '03', title: 'Inspect and plan', text: 'The space and materials guide the recommended testing, containment or installation plan.' },
  { number: '04', title: 'Complete and document', text: 'We carry out the agreed work, clean the area and review the relevant closeout details.' },
]
