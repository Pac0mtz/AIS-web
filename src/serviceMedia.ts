import detailPhotos from './detailMedia.json'

export type ServiceMediaItem = {
  src: string
  alt: string
  caption: string
  width?: number
  height?: number
  author?: string
  sourceUrl?: string
  license?: string
  licenseUrl?: string
}

type SectionImages = [ServiceMediaItem] | [ServiceMediaItem, ServiceMediaItem]

const photo = (src: string, alt: string, caption: string): ServiceMediaItem => ({ src, alt, caption })
const gallery = (name: string, alt: string, caption: string) => photo(`/images/gallery/${name}.webp`, alt, caption)
const detail = (name: keyof typeof detailPhotos, alt: string, caption: string): ServiceMediaItem => ({ ...detailPhotos[name], alt, caption })

// Each photograph has one owner across the service pages. The build checks paths
// and file hashes so copying or renaming an image cannot reintroduce duplicates.
export const serviceSectionMedia: Record<string, Record<string, SectionImages>> = {
  asbestos: {
    materials: [photo('/images/asbestos-tile.webp', 'An older floor tile lifted to reveal the adhesive beneath', 'Older floor systems can contain more than one suspect layer')],
    inspection: [gallery('asbestos-material-survey', 'Inspector reviewing an interior building material', 'Define the affected materials before work begins')],
    removal: [gallery('asbestos-work-zone-controls', 'Protected technician working inside an isolated area', 'Work-area controls stay in place during removal')],
    encapsulation: [detail('pipe-insulation-intact', 'Intact insulated pipes along a finished room ceiling', 'Material condition and accessibility guide management options')],
    documentation: [gallery('asbestos-sample-documentation-scene', 'Technicians recording a closed sample container', 'A clear record connects the material to its location')],
  },
  lead: {
    'scope-review': [gallery('deteriorated-painted-trim-scene', 'Deteriorated paint on an older window sill', 'Identify the painted components within the removal scope')],
    removal: [gallery('lead-painted-trim-removal-scene', 'Protected workers removing deteriorated exterior painted trim', 'Controlled removal at the affected surface')],
    abatement: [gallery('lead-protective-removal', 'Respirator-equipped worker addressing an older painted wall', 'Methods are selected for the component and its condition')],
    safety: [gallery('lead-contained-work-area', 'Worker in protective clothing inside a sealed work area', 'Worker protection and separation from adjacent spaces')],
  },
  mold: {
    inspection: [gallery('mold-growth-corner', 'Visible mold growth along an interior wall corner', 'Growth patterns help direct the room review')],
    remediation: [gallery('mold-framing-cleaning-scene', 'Protected crew cleaning exposed wall framing', 'Detailed cleaning after affected finishes are opened')],
    moisture: [photo('/images/mold-testing.webp', 'Thermal imaging and a moisture meter used during a building assessment', 'Measure the conditions behind the visible damage')],
    'air-quality': [detail('hepa-cleaner', 'HEPA-equipped vacuum cleaner with hose and attachments', 'HEPA cleaning is part of the remediation process')],
  },
  windows: {
    'when-to-replace': [gallery('window-opening-preparation', 'Existing interior window opening and surrounding trim', 'Review the opening before deciding on replacement')],
    replacement: [gallery('window-frame-alignment-scene', 'Installers leveling a replacement window inside a room', 'Precise placement before the opening is finished')],
    'window-options': [gallery('window-finished-detail', 'Dark-framed window with divided glass panes', 'Frame, glass and operating style affect the final result')],
    benefits: [detail('wood-window-fitting', 'Craftsperson fitting a wood window frame into a prepared opening', 'Care at the opening supports long-term operation')],
  },
  'asbestos-testing': {
    'when-to-test': [detail('pipe-insulation-condition', 'Damaged outer covering on older pipe insulation', 'Damaged suspect insulation calls for a material-specific review')],
    'materials-tested': [gallery('asbestos-pipe-sampling', 'Protected technician collecting a localized pipe-insulation sample', 'Different building materials are sampled separately')],
    'sampling-process': [gallery('asbestos-localized-sampling', 'Technician collecting a sample in a localized work area', 'Representative collection with limited disturbance')],
    results: [detail('sample-vials', 'Laboratory sample vials arranged in a rack', 'Organized samples support laboratory analysis')],
  },
  'asbestos-surveys': {
    'survey-types': [gallery('asbestos-mechanical-survey', 'Inspector reviewing an accessible interior building area', 'Match the survey boundary to the planned work')],
    'accessible-areas': [gallery('asbestos-ceiling-survey-scene', 'Inspector examining an accessible ceiling with a light and tablet', 'Ceilings and service areas form part of the accessible review')],
    condition: [detail('damaged-roof-detail', 'Deteriorated roof shingles with visible wear and lifted edges', 'Exterior material condition also belongs in a building survey')],
    'survey-reporting': [detail('survey-plan', 'Archived building plan from an asbestos-containing-material survey', 'A material inventory organizes findings by building location')],
  },
  'commercial-asbestos': {
    'commercial-planning': [gallery('commercial-contained-crew', 'Protected crew preparing an isolated commercial work area', 'Coordinate access, crews and the building schedule')],
    'commercial-containment': [gallery('commercial-containment-air-control-scene', 'Workers checking ducting at a contained commercial work zone', 'Isolation and air-control equipment protect surrounding spaces')],
    'commercial-removal': [gallery('commercial-pipe-insulation', 'Protected technician working on pipe insulation inside a glove bag', 'Task-specific handling of mechanical-system materials')],
    'commercial-closeout': [gallery('abatement-floor-cleaning-scene', 'Crew vacuuming floor edges and collecting sealed waste inside containment', 'Detailed cleanup supports the handoff to the next trade')],
  },
  'asbestos-tile': {
    'tile-assessment': [gallery('floor-tile-and-mastic-scene', 'Protected worker reviewing tile and exposed dark adhesive', 'Review tile and adhesive as separate layers')],
    'tile-preparation': [gallery('tile-contained-floor-removal', 'Isolated flooring work area with protected openings and waste bags', 'Prepare the room and the path for removed materials')],
    'tile-removal-methods': [gallery('tile-mastic-detail', 'Gloved hand lifting a tile edge to expose the adhesive layer', 'Controlled lifting limits unnecessary breakage')],
    'tile-finish': [gallery('asbestos-contained-cleaning', 'Protected worker cleaning a contained floor area', 'Final cleaning before the substrate is reviewed')],
  },
  'asbestos-demolition': {
    'pre-demolition': [photo('/images/asbestos-demolition.webp', 'Protected worker opening a defined interior wall area', 'Define affected components before broader demolition')],
    'selective-demolition': [gallery('demolition-interior-stripout', 'Crew clearing debris during an interior strip-out', 'Selective work stays within the agreed boundaries')],
    'demolition-controls': [gallery('demolition-selective-floor', 'Crew using removal and extraction equipment on a commercial floor', 'Separate the removal area from the rest of the building')],
    'demolition-handoff': [gallery('selective-removal-cleanup-scene', 'Protected crew cleaning the edge of an opened interior wall', 'Review and clean the selective work area before handoff')],
  },
  'mold-testing': {
    'mold-inspection': [gallery('mold-thermal-assessment', 'Thermal camera displaying temperature differences along a room wall', 'Look beyond the first visible spot')],
    'moisture-assessment': [detail('moisture-reading', 'Technician measuring moisture along a building wall', 'Moisture measurements help trace the source')],
    'mold-sampling': [gallery('mold-surface-swab', 'Gloved hand collecting a surface sample from suspect growth', 'Surface sampling answers a defined question'), gallery('indoor-air-sampling-setup-scene', 'Technicians checking a tripod-mounted air sampling pump', 'Air sampling is selected when it adds useful context')],
    'mold-next-steps': [gallery('mold-protective-cleaning', 'Protected technician cleaning exposed affected building material', 'Findings guide containment, removal and cleaning')],
  },
  'water-damage': {
    'water-assessment': [gallery('water-floor-intrusion', 'Water spreading across a finished wood floor', 'Trace the source and the pathway of the water')],
    'water-extraction': [gallery('basement-floor-extraction', 'Restoration technician extracting water from an interior floor', 'Prompt extraction limits further migration')],
    'structural-drying': [gallery('water-structural-drying', 'Air movers arranged across a water-affected room', 'Drying equipment is arranged for the affected materials')],
    'restoration-plan': [gallery('water-restoration-drying-check-scene', 'Restoration crew checking equipment and a drying log', 'Moisture checks guide the repair handoff')],
  },
  'flooded-basement': {
    'basement-source': [photo('/images/flooded-basement.webp', 'Standing water along the walls and floor of a basement', 'Start with how water entered the lower level')],
    'basement-cleanup': [gallery('basement-extraction-drying', 'Extraction hoses and drying equipment in an unfinished basement', 'Remove water and expose wet building assemblies')],
    'basement-drying': [gallery('basement-air-mover-setup-scene', 'Technician positioning an air mover beside a basement wall', 'Air movement reaches the floor and bottom of the wall')],
    'basement-repair': [photo('/images/water-damage.webp', 'Interior corridor with wet finishes removed before reconstruction', 'Plan repairs after affected assemblies are opened and dried')],
  },
  roofing: {
    'roof-assessment': [detail('storm-damaged-roof', 'Roof shingles showing damage from fallen branches', 'Review surface wear and localized damage')],
    'roof-repair': [gallery('roof-flashing-repair', 'Roofer addressing flashing where a roof meets an exterior wall', 'Target the transition behind a localized leak')],
    'roof-replacement': [gallery('roof-replacement-crew', 'Roofing crew working on a residential roof', 'Coordinate removal, installation and cleanup')],
    'roof-water': [detail('weathered-roof', 'Heavily weathered roof shingles with gaps and deterioration', 'A deteriorated roof surface can allow water to enter')],
  },
  siding: {
    'siding-review': [gallery('siding-window-transition', 'Horizontal siding and white trim around a window', 'Review the joints as well as the visible panels')],
    'siding-repair': [gallery('siding-window-trim-scene', 'Installers fitting replacement trim around an exterior window', 'Coordinate repairs with surrounding trim')],
    'siding-installation': [gallery('siding-finished-exterior', 'Finished residential exterior with coordinated siding and trim', 'Review the complete cladding assembly')],
    'siding-coordination': [gallery('roof-to-wall-flashing-scene', 'Roofers working at the flashing beside a dormer wall', 'Roof and wall transitions need coordinated details')],
  },
  gutters: {
    'gutter-review': [gallery('gutter-roof-edge-review', 'Ladder positioned beside an existing gutter and roof edge', 'Review the run, attachment and roof-edge conditions')],
    'gutter-repair': [gallery('gutter-attachment-work', 'Worker fastening an exterior drainage component', 'Secure attachment helps restore the existing system')],
    'gutter-installation': [gallery('gutter-downspout-strap-scene', 'Installer fastening a downspout strap against brickwork', 'Support the drainage route from roof edge to discharge')],
    'drainage-impact': [detail('roof-drainage', 'Roof gutter and downspout connection against a cloudy sky', 'Follow the water path around the building envelope')],
  },
  doors: {
    'door-review': [gallery('door-alignment-sealing', 'Installer reviewing an exterior door and its surrounding frame', 'Assess the opening, clearances and existing finish')],
    'door-options': [detail('door-hardware', 'Lever-style door handle and lock on a finished door', 'Hardware and operation should suit the entrance')],
    'door-installation': [gallery('entry-door-jamb-alignment-scene', 'Installers checking an exterior door jamb with a level', 'Alignment matters before the trim is finished')],
    'door-finish': [gallery('door-finished-entry', 'Finished exterior entry door with coordinated trim', 'Review the complete entrance and operation')],
  },
}
