export type ServiceMediaItem = {
  src: string
  alt: string
  caption: string
}

const image = (name: string, alt: string, caption: string): ServiceMediaItem => ({
  src: `/images/gallery/${name}.webp`,
  alt,
  caption,
})

export const serviceMedia: Record<string, [ServiceMediaItem, ServiceMediaItem]> = {
  asbestos: [
    image('abatement-floor-cleaning-scene', 'Respirator-equipped technicians vacuuming the floor edge and handling a waste bag inside containment', 'Detailed cleanup inside containment'),
    image('asbestos-work-zone-controls', 'Technician in respiratory protection working within a sealed area', 'Task-specific controls inside the work zone'),
  ],
  lead: [
    image('lead-painted-trim-removal-scene', 'Two protected technicians removing deteriorated paint from exterior window trim with a scraper and vacuum', 'Controlled removal of deteriorated painted trim'),
    image('lead-contained-work-area', 'Protective-suited worker preparing a sealed remediation work area', 'Protective setup before remediation begins'),
  ],
  mold: [
    image('mold-framing-cleaning-scene', 'Protected technicians vacuuming exposed wall framing with HEPA equipment', 'Detailed cleaning of exposed framing'),
    image('mold-growth-corner', 'Dark mold growth along an interior wall and ceiling corner', 'Visible growth is traced back to moisture'),
  ],
  windows: [
    image('window-frame-alignment-scene', 'Two installers leveling a white replacement window from inside the room', 'Leveling a new window in the opening'),
    image('window-finished-detail', 'Finished dark-framed window with divided glass panes', 'Frame, glazing and finished-trim details'),
  ],
  'asbestos-testing': [
    image('asbestos-localized-sampling', 'Technician preparing a localized material sampling area', 'Representative samples with limited disturbance'),
    image('asbestos-sample-documentation-scene', 'Two protected technicians documenting a closed material sample container', 'Recording the sample and its location'),
  ],
  'asbestos-surveys': [
    image('asbestos-material-survey', 'Inspector reviewing a suspect building material during a property survey', 'Accessible materials reviewed by location'),
    image('asbestos-ceiling-survey-scene', 'Building inspector reviewing a suspended ceiling with a flashlight and tablet', 'Visual review of accessible materials'),
  ],
  'commercial-asbestos': [
    image('commercial-contained-crew', 'Protective-suited abatement crew working inside a contained commercial space', 'Coordinated crews and sealed work zones'),
    image('commercial-containment-air-control-scene', 'Two protected technicians checking flexible ducting at a contained work area', 'Air controls inside commercial containment'),
  ],
  'asbestos-tile': [
    image('tile-contained-floor-removal', 'Contained flooring removal area with sealed waste bags and floor equipment', 'Floor removal with the room isolated'),
    image('floor-tile-and-mastic-scene', 'Protected technician reviewing the boundary between intact floor tile and exposed dark adhesive', 'Tile and adhesive reviewed as separate layers'),
  ],
  'asbestos-demolition': [
    image('selective-removal-cleanup-scene', 'Protected crew vacuuming the edge of an opened wall inside a contained work area', 'Cleanup after selective removal'),
    image('demolition-interior-stripout', 'Workers clearing debris during a controlled interior strip-out', 'Debris control and separation during strip-out'),
  ],
  'mold-testing': [
    image('mold-surface-swab', 'Gloved technician collecting a surface swab from suspect growth', 'Surface sampling for a defined question'),
    image('indoor-air-sampling-setup-scene', 'Technicians checking a tripod-mounted air sampling pump and recording the room location', 'Indoor air sampling equipment setup'),
  ],
  'water-damage': [
    image('water-floor-intrusion', 'Water spreading across a finished wood floor', 'Assessment starts with the water pathway'),
    image('water-restoration-drying-check-scene', 'Restoration technicians checking a portable dehumidifier and a drying log in a hallway', 'Dehumidifier setup and drying checks'),
  ],
  'flooded-basement': [
    image('basement-air-mover-setup-scene', 'Technician adjusting an air mover next to a basement masonry wall after water extraction', 'Air movement after water extraction'),
    image('basement-floor-extraction', 'Technician operating water-extraction equipment in a large basement', 'Water removal across the affected floor'),
  ],
  roofing: [
    image('roof-replacement-crew', 'Roofing crew working on a sloped roof in early-morning light', 'Roof-surface removal and replacement planning'),
    image('roof-to-wall-flashing-scene', 'Roofers with safety harnesses working on metal flashing where a shingled roof meets a dormer', 'Flashing at a roof-to-wall transition'),
  ],
  siding: [
    image('siding-window-trim-scene', 'Two installers fitting white trim where horizontal siding meets a window', 'Fitting trim at the siding and window joint'),
    image('siding-finished-exterior', 'Completed house exterior with siding and coordinated trim', 'A consistent finished building envelope'),
  ],
  gutters: [
    image('gutter-roof-edge-review', 'Ladder positioned at the roof edge of a home during gutter work', 'Roof-edge access and existing-run review'),
    image('gutter-downspout-strap-scene', 'Installer fastening a white downspout strap against an exterior brick wall', 'Securing the downspout to the wall'),
  ],
  doors: [
    image('entry-door-jamb-alignment-scene', 'Two installers checking the alignment of an exterior door jamb with a level', 'Checking door alignment at the jamb'),
    image('door-finished-entry', 'Finished dark entry door with white trim and a threshold', 'Finished trim, hardware and weather sealing'),
  ],
} satisfies Record<string, [ServiceMediaItem, ServiceMediaItem]>

// Reuse the local image collection, with each selection tied to the section's topic.
const photos = {
  floorLayers: serviceMedia['asbestos-tile'][1],
  pipeInsulation: image('commercial-pipe-insulation', 'Protected technician working around pipe insulation inside a glove bag', 'Pipe insulation requires a material-specific plan'),
  materialSurvey: serviceMedia['asbestos-surveys'][0],
  ceilingSurvey: serviceMedia['asbestos-surveys'][1],
  mechanicalSurvey: image('asbestos-mechanical-survey', 'Inspector reviewing an interior building area with a clipboard', 'Reviewing the building before work begins'),
  sampling: serviceMedia['asbestos-testing'][0],
  pipeSampling: image('asbestos-pipe-sampling', 'Respirator-equipped technician collecting a sample from pipe insulation', 'Targeted sampling of suspect pipe insulation'),
  documentation: serviceMedia['asbestos-testing'][1],
  containment: serviceMedia.asbestos[1],
  cleanup: serviceMedia.asbestos[0],
  commercialCrew: serviceMedia['commercial-asbestos'][0],
  airControls: serviceMedia['commercial-asbestos'][1],
  floorRemoval: serviceMedia['asbestos-tile'][0],
  mastic: image('tile-mastic-detail', 'Gloved hand lifting a floor tile to expose the adhesive layer beneath', 'The adhesive beneath the tile is reviewed separately'),
  selectiveCleanup: serviceMedia['asbestos-demolition'][0],
  demolition: serviceMedia['asbestos-demolition'][1],
  selectiveFloor: image('demolition-selective-floor', 'Crew removing flooring with extraction equipment in a commercial room', 'Selective removal within the defined work area'),
  paintCondition: image('deteriorated-painted-trim-scene', 'Gloved hand and flashlight next to peeling paint on an older window sill', 'Deteriorated paint at a window sill'),
  leadRemoval: serviceMedia.lead[0],
  leadProtection: serviceMedia.lead[1],
  leadSurface: image('lead-protective-removal', 'Respirator-equipped worker addressing a deteriorated painted wall surface', 'Surface condition guides the removal scope'),
  moldGrowth: serviceMedia.mold[1],
  moldCleaning: serviceMedia.mold[0],
  moldProtection: image('mold-protective-cleaning', 'Technician in protective equipment cleaning an exposed interior wall', 'Protected cleaning of affected building materials'),
  thermal: image('mold-thermal-assessment', 'Thermal camera displaying temperature differences along an interior wall', 'Thermal observations help direct the moisture review'),
  swab: serviceMedia['mold-testing'][0],
  airSampling: serviceMedia['mold-testing'][1],
  waterIntrusion: serviceMedia['water-damage'][0],
  dryingCheck: serviceMedia['water-damage'][1],
  structuralDrying: image('water-structural-drying', 'Air movers and dehumidification equipment arranged across a water-affected room', 'Drying equipment arranged for the affected space'),
  basementAirflow: serviceMedia['flooded-basement'][0],
  extraction: serviceMedia['flooded-basement'][1],
  basementDrying: image('basement-extraction-drying', 'Extraction hoses and drying equipment inside an unfinished basement', 'Water removal and drying in a basement work area'),
  windowOpening: image('window-opening-preparation', 'Existing interior window opening with exposed perimeter trim', 'The opening is reviewed before replacement'),
  windowAlignment: serviceMedia.windows[0],
  windowFinish: serviceMedia.windows[1],
  roofingCrew: serviceMedia.roofing[0],
  flashing: serviceMedia.roofing[1],
  roofRepair: image('roof-flashing-repair', 'Worker making a localized repair where roofing meets an exterior wall', 'Targeted repair at a roof transition'),
  sidingTrim: serviceMedia.siding[0],
  sidingFinish: serviceMedia.siding[1],
  sidingTransition: image('siding-window-transition', 'Horizontal siding meeting white trim around a finished window', 'Window trim and siding meet at the wall opening'),
  gutterReview: serviceMedia.gutters[0],
  downspout: serviceMedia.gutters[1],
  gutterAttachment: image('gutter-attachment-work', 'Installer using a drill to secure an exterior downspout against brickwork', 'Secure attachment along the drainage route'),
  doorAlignment: serviceMedia.doors[0],
  doorFinish: serviceMedia.doors[1],
  doorOpening: image('door-alignment-sealing', 'Installer reviewing a glazed exterior door and its interior frame', 'Reviewing the frame, opening and surrounding finish'),
}

type SectionImages = [ServiceMediaItem] | [ServiceMediaItem, ServiceMediaItem]

export const serviceSectionMedia: Record<string, Record<string, SectionImages>> = {
  asbestos: {
    materials: [photos.floorLayers, photos.pipeInsulation],
    inspection: [photos.materialSurvey, photos.sampling],
    removal: [photos.containment, photos.cleanup],
    encapsulation: [photos.mechanicalSurvey],
    documentation: [photos.documentation],
  },
  lead: {
    'scope-review': [photos.paintCondition],
    removal: [photos.leadRemoval, photos.leadProtection],
    abatement: [photos.leadSurface],
    safety: [photos.leadProtection],
  },
  mold: {
    inspection: [photos.moldGrowth],
    remediation: [photos.moldCleaning, photos.moldProtection],
    moisture: [photos.thermal],
    'air-quality': [photos.airSampling],
  },
  windows: {
    'when-to-replace': [photos.windowOpening],
    replacement: [photos.windowAlignment],
    'window-options': [photos.windowFinish],
    benefits: [photos.sidingTransition],
  },
  'asbestos-testing': {
    'when-to-test': [photos.materialSurvey],
    'materials-tested': [photos.floorLayers, photos.pipeInsulation],
    'sampling-process': [photos.sampling, photos.pipeSampling],
    results: [photos.documentation],
  },
  'asbestos-surveys': {
    'survey-types': [photos.materialSurvey],
    'accessible-areas': [photos.ceilingSurvey, photos.mechanicalSurvey],
    condition: [photos.floorLayers],
    'survey-reporting': [photos.documentation],
  },
  'commercial-asbestos': {
    'commercial-planning': [photos.mechanicalSurvey],
    'commercial-containment': [photos.airControls, photos.commercialCrew],
    'commercial-removal': [photos.pipeInsulation, photos.cleanup],
    'commercial-closeout': [photos.documentation],
  },
  'asbestos-tile': {
    'tile-assessment': [photos.floorLayers],
    'tile-preparation': [photos.floorRemoval],
    'tile-removal-methods': [photos.mastic],
    'tile-finish': [photos.cleanup],
  },
  'asbestos-demolition': {
    'pre-demolition': [photos.mechanicalSurvey],
    'selective-demolition': [photos.demolition, photos.selectiveFloor],
    'demolition-controls': [photos.airControls, photos.selectiveCleanup],
    'demolition-handoff': [photos.documentation],
  },
  'mold-testing': {
    'mold-inspection': [photos.moldGrowth],
    'moisture-assessment': [photos.thermal],
    'mold-sampling': [photos.swab, photos.airSampling],
    'mold-next-steps': [photos.moldCleaning],
  },
  'water-damage': {
    'water-assessment': [photos.waterIntrusion, photos.thermal],
    'water-extraction': [photos.extraction],
    'structural-drying': [photos.structuralDrying],
    'restoration-plan': [photos.dryingCheck],
  },
  'flooded-basement': {
    'basement-source': [photos.waterIntrusion],
    'basement-cleanup': [photos.extraction, photos.basementDrying],
    'basement-drying': [photos.basementAirflow],
    'basement-repair': [photos.dryingCheck],
  },
  roofing: {
    'roof-assessment': [photos.gutterReview, photos.flashing],
    'roof-repair': [photos.roofRepair],
    'roof-replacement': [photos.roofingCrew],
    'roof-water': [photos.thermal],
  },
  siding: {
    'siding-review': [photos.sidingTransition],
    'siding-repair': [photos.sidingTrim],
    'siding-installation': [photos.sidingFinish],
    'siding-coordination': [photos.flashing],
  },
  gutters: {
    'gutter-review': [photos.gutterReview],
    'gutter-repair': [photos.gutterAttachment],
    'gutter-installation': [photos.downspout],
    'drainage-impact': [photos.basementDrying],
  },
  doors: {
    'door-review': [photos.doorOpening],
    'door-options': [photos.doorFinish],
    'door-installation': [photos.doorAlignment],
    'door-finish': [photos.doorFinish],
  },
}
