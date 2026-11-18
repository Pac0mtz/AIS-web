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
    image('asbestos-contained-cleaning', 'Protective-suited technician cleaning a contained abatement area', 'Contained removal and detailed cleaning'),
    image('asbestos-work-zone-controls', 'Technician in respiratory protection working within a sealed area', 'Task-specific controls inside the work zone'),
  ],
  lead: [
    image('lead-protective-removal', 'Respirator-equipped technician removing deteriorated material from a wall', 'Protective equipment for disturbance and removal'),
    image('lead-contained-work-area', 'Protective-suited worker preparing a sealed remediation work area', 'Protective setup before remediation begins'),
  ],
  mold: [
    image('mold-protective-cleaning', 'Technician in protective equipment applying treatment inside a work area', 'Protective equipment and controlled cleaning'),
    image('mold-growth-corner', 'Dark mold growth along an interior wall and ceiling corner', 'Visible growth is traced back to moisture'),
  ],
  windows: [
    image('window-opening-preparation', 'New window unit positioned within a prepared exterior opening', 'Opening preparation and unit placement'),
    image('window-finished-detail', 'Finished dark-framed window with divided glass panes', 'Frame, glazing and finished-trim details'),
  ],
  'asbestos-testing': [
    image('asbestos-localized-sampling', 'Technician preparing a localized material sampling area', 'Representative samples with limited disturbance'),
    image('asbestos-pipe-sampling', 'Protective-suited technician sampling insulation around a mechanical pipe', 'Material-specific sampling and documentation'),
  ],
  'asbestos-surveys': [
    image('asbestos-material-survey', 'Inspector reviewing a suspect building material during a property survey', 'Accessible materials reviewed by location'),
    image('asbestos-mechanical-survey', 'Inspector documenting conditions in a mechanical service area', 'Condition and disturbance priorities recorded'),
  ],
  'commercial-asbestos': [
    image('commercial-contained-crew', 'Protective-suited abatement crew working inside a contained commercial space', 'Coordinated crews and sealed work zones'),
    image('commercial-pipe-insulation', 'Technician enclosing pipe insulation within protective wrapping', 'Controlled handling of mechanical insulation'),
  ],
  'asbestos-tile': [
    image('tile-contained-floor-removal', 'Contained flooring removal area with sealed waste bags and floor equipment', 'Floor removal with the room isolated'),
    image('tile-mastic-detail', 'Gloved hand working adhesive residue on an old floor surface', 'Adhesive and mastic addressed as separate layers'),
  ],
  'asbestos-demolition': [
    image('demolition-selective-floor', 'Operator using floor-removal equipment during selective interior demolition', 'Selective removal within a defined scope'),
    image('demolition-interior-stripout', 'Workers clearing debris during a controlled interior strip-out', 'Debris control and separation during strip-out'),
  ],
  'lead-inspection': [
    image('lead-xrf-trim', 'Inspector holding an XRF analyzer against interior painted trim', 'Component-by-component XRF assessment'),
    image('lead-dust-wipe', 'Technician collecting a dust-wipe sample from a window sill', 'Dust sampling where the scope calls for it'),
  ],
  'mold-testing': [
    image('mold-surface-swab', 'Gloved technician collecting a surface swab from suspect growth', 'Surface sampling for a defined question'),
    image('mold-thermal-assessment', 'Thermal camera displaying temperature patterns across an interior room', 'Thermal imaging helps guide the moisture review'),
  ],
  'water-damage': [
    image('water-floor-intrusion', 'Water spreading across a finished wood floor', 'Assessment starts with the water pathway'),
    image('water-structural-drying', 'Air movers and drying hoses arranged throughout a stripped interior', 'Air movement and targeted structural drying'),
  ],
  'flooded-basement': [
    image('basement-extraction-drying', 'Technician extracting standing water from a basement beside drying equipment', 'Extraction followed by equipment setup'),
    image('basement-floor-extraction', 'Technician operating water-extraction equipment in a large basement', 'Water removal across the affected floor'),
  ],
  roofing: [
    image('roof-replacement-crew', 'Roofing crew working on a sloped roof in early-morning light', 'Roof-surface removal and replacement planning'),
    image('roof-flashing-repair', 'Roofer repairing shingles beside an exterior wall transition', 'Localized repairs and flashing details'),
  ],
  siding: [
    image('siding-window-transition', 'Horizontal siding and trim surrounding an exterior window', 'Cladding, trim and window transitions'),
    image('siding-finished-exterior', 'Completed house exterior with siding and coordinated trim', 'A consistent finished building envelope'),
  ],
  gutters: [
    image('gutter-roof-edge-review', 'Ladder positioned at the roof edge of a home during gutter work', 'Roof-edge access and existing-run review'),
    { src: '/images/gutters.webp', alt: 'Installer working at a downspout connection beside horizontal siding', caption: 'Downspout connections and exterior drainage' },
  ],
  doors: [
    image('door-alignment-sealing', 'Installer sealing around a newly positioned exterior door unit', 'Opening preparation, alignment and sealing'),
    image('door-finished-entry', 'Finished dark entry door with white trim and a threshold', 'Finished trim, hardware and weather sealing'),
  ],
} satisfies Record<string, [ServiceMediaItem, ServiceMediaItem]>
