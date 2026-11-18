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
  'lead-inspection': [
    image('lead-xrf-trim', 'Inspector holding an XRF analyzer against interior painted trim', 'Component-by-component XRF assessment'),
    image('deteriorated-painted-trim-scene', 'Gloved hand and flashlight next to peeling paint on an older window sill', 'Deteriorated paint at a window sill'),
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
