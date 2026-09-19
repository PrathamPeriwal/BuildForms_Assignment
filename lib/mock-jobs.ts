import type { Job, Machine } from './types'

export const machines: Machine[] = [
  { id: 'CNC-03', name: 'CNC-03', state: 'down' },
  { id: 'CNC-07', name: 'CNC-07', state: 'running' },
  { id: 'Lathe-02', name: 'Lathe-02', state: 'running' },
  { id: 'Press-12', name: 'Press-12', state: 'idle' },
  { id: 'Laser-01', name: 'Laser-01', state: 'running' },
  { id: 'Weld-04', name: 'Weld-04', state: 'running' },
  { id: 'Moulder-05', name: 'Moulder-05', state: 'idle' },
  { id: 'Grinder-02', name: 'Grinder-02', state: 'running' },
]

export function buildJobs(today: Date): Job[] {
  function dueIn(days: number): string {
    const d = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + days
    )
    return d.toISOString().slice(0, 10)
  }

  function ago(hours: number): string {
    return new Date(today.getTime() - hours * 3_600_000).toISOString()
  }

  return [
    // ── Pending (6) ──────────────────────────────────────────────────────────
    {
      id: 'WO-4102',
      product: 'Hydraulic Manifold Block — Series 7 High-Pressure Porting',
      customer: 'Vantage Fluid Systems',
      quantity: 12,
      dueDate: dueIn(8),
      status: 'pending',
      machineId: null, // unassigned
      notes: [],
    },
    {
      id: 'WO-4117',
      product: 'Sheet-Metal Enclosure 400×300×200',
      customer: 'Nexon Controls',
      quantity: 50,
      dueDate: dueIn(5),
      status: 'pending',
      machineId: 'Press-12',
      notes: [
        {
          id: 'n-4117-1',
          at: ago(3),
          text: 'Drawing rev C approved, tooling confirmed on Press-12.',
          severity: 'info',
        },
      ],
    },
    {
      id: 'WO-4131',
      product: 'Injection-Moulded Cap — 38mm Snap-Fit',
      customer: 'Meridian Packaging',
      quantity: 250000, // huge quantity edge case
      dueDate: dueIn(14),
      status: 'pending',
      machineId: 'Moulder-05',
      notes: [],
    },
    {
      id: 'WO-4155',
      product: 'Bearing Retainer — Deep-Groove 6205',
      customer: 'Stelford Drives',
      quantity: 200,
      dueDate: dueIn(10),
      status: 'pending',
      machineId: 'Grinder-02',
      notes: [],
    },
    {
      id: 'WO-4163',
      product: 'Flange Adapter DN50 PN16',
      customer: 'Kestrel Process Engineering',
      quantity: 30,
      dueDate: dueIn(7),
      status: 'pending',
      machineId: 'Lathe-02',
      notes: [],
    },
    {
      id: 'WO-4178',
      product: 'Gear Shaft — Module 3, 24T Spur',
      customer: 'Halcyon Gearbox Co.',
      quantity: 8,
      dueDate: dueIn(12),
      status: 'pending',
      machineId: 'CNC-07',
      notes: [],
    },

    // ── In Progress (9) ──────────────────────────────────────────────────────
    {
      id: 'WO-4088',
      product: 'Hydraulic Housing — Low-Pressure Return Block',
      customer: 'Vantage Fluid Systems',
      quantity: 6,
      dueDate: dueIn(0), // due today
      status: 'in_progress',
      machineId: 'CNC-07',
      notes: [
        {
          id: 'n-4088-1',
          at: ago(6),
          text: 'Roughing ops complete. Finishing pass scheduled 14:00.',
          severity: 'info',
        },
        {
          id: 'n-4088-2',
          at: ago(1),
          text: 'Finishing done. Deburring in progress, on track for dispatch.',
          severity: 'info',
        },
      ],
    },
    {
      id: 'WO-4091',
      product: 'Sheet-Metal Enclosure 600×400×250 — IP65 Gasketed',
      customer: 'Stromberg Industrial',
      quantity: 20,
      dueDate: dueIn(2), // due soon
      status: 'in_progress',
      machineId: 'Laser-01',
      notes: [
        {
          id: 'n-4091-1',
          at: ago(4),
          text: 'Laser cutting done. Forming on Press-12 starts next shift.',
          severity: 'info',
        },
      ],
    },
    {
      id: 'WO-4096',
      product: 'Gear Shaft — Module 2, 32T Helical',
      customer: 'Halcyon Gearbox Co.',
      quantity: 15,
      dueDate: dueIn(3), // due soon (boundary)
      status: 'in_progress',
      machineId: 'Lathe-02',
      notes: [],
    },
    {
      id: 'WO-4099',
      product: 'Bearing Retainer — Tapered 30205',
      customer: 'Apex Motion Ltd.',
      quantity: 80,
      dueDate: dueIn(6),
      status: 'in_progress',
      machineId: 'Grinder-02',
      notes: [
        {
          id: 'n-4099-1',
          at: ago(2),
          text: 'Surface finish Ra 0.8 achieved on first batch of 40.',
          severity: 'info',
        },
      ],
    },
    {
      id: 'WO-4108',
      product: 'Injection-Moulded Cap — 52mm Bayonet',
      customer: 'Meridian Packaging',
      quantity: 18000,
      dueDate: dueIn(9),
      status: 'in_progress',
      machineId: 'Moulder-05',
      notes: [],
    },
    {
      id: 'WO-4114',
      product: 'Flange Adapter DN80 PN10 — Raised Face',
      customer: 'Kestrel Process Engineering',
      quantity: 16,
      dueDate: dueIn(4),
      status: 'in_progress',
      machineId: 'Weld-04',
      notes: [
        {
          id: 'n-4114-1',
          at: ago(5),
          text: 'Root pass welded and inspected. Cap pass tomorrow morning.',
          severity: 'info',
        },
      ],
    },
    {
      id: 'WO-4122',
      product: 'Hydraulic Manifold Block — Series 4 Sub-Plate',
      customer: 'Thornfield Hydraulics',
      quantity: 4,
      dueDate: dueIn(11),
      status: 'in_progress',
      machineId: 'CNC-07',
      // job with 5+ notes mixing info and issue
      notes: [
        {
          id: 'n-4122-1',
          at: ago(48),
          text: "Material cert received. D'Arcy alloy EN24T confirmed.",
          severity: 'info',
        },
        {
          id: 'n-4122-2',
          at: ago(36),
          text: 'Coolant pump tripped on CNC-07, waiting on maintenance.',
          severity: 'issue',
        },
        {
          id: 'n-4122-3',
          at: ago(30),
          text: 'Coolant pump back online. Roughing resumed.',
          severity: 'info',
        },
        {
          id: 'n-4122-4',
          at: ago(18),
          text: 'Dimensional check at op 30 — all within ±0.02.',
          severity: 'info',
        },
        {
          id: 'n-4122-5',
          at: ago(8),
          text: 'Tool life exceeded on 10mm end mill, replaced, offset updated.',
          severity: 'issue',
        },
        {
          id: 'n-4122-6',
          at: ago(1),
          text: 'Op 50 tapping complete. Moving to deburring bench.',
          severity: 'info',
        },
      ],
    },
    {
      id: 'WO-4139',
      product: 'Sheet-Metal Bracket — DIN Rail Mount 35mm',
      customer: 'Nexon Controls',
      quantity: 120,
      dueDate: dueIn(2), // due soon
      status: 'in_progress',
      machineId: 'Press-12',
      notes: [],
    },
    {
      id: 'WO-4148',
      product: 'Gear Shaft — Module 4, 18T Bevel',
      customer: 'Helix Transmission',
      quantity: 6,
      dueDate: dueIn(13),
      status: 'in_progress',
      machineId: 'Lathe-02',
      notes: [],
    },

    // ── Delayed (4) ──────────────────────────────────────────────────────────
    {
      id: 'WO-4073',
      // overdue delayed job on the DOWN machine with an issue note
      product: 'Hydraulic Housing — High-Flow Valve Body',
      customer: 'Thornfield Hydraulics',
      quantity: 3,
      dueDate: dueIn(-4), // overdue
      status: 'delayed',
      machineId: 'CNC-03', // DOWN machine
      notes: [
        {
          id: 'n-4073-1',
          at: ago(72),
          text: 'CNC-03 spindle bearing failed. Machine tagged out, maintenance raised work order.',
          severity: 'issue',
        },
        {
          id: 'n-4073-2',
          at: ago(24),
          text: 'Replacement bearing on back-order, ETA 3 days. Customer notified.',
          severity: 'issue',
        },
      ],
    },
    {
      id: 'WO-4081',
      // delayed on a running machine — material shortage cause
      product: 'Bearing Retainer — Cylindrical 32310',
      customer: 'Apex Motion Ltd.',
      quantity: 60,
      dueDate: dueIn(-2), // overdue
      status: 'delayed',
      machineId: 'Grinder-02',
      notes: [
        {
          id: 'n-4081-1',
          at: ago(96),
          text: 'Bar stock short by 40 pcs, supplier ETA Thursday.',
          severity: 'issue',
        },
        {
          id: 'n-4081-2',
          at: ago(20),
          text: 'Partial batch of 20 pcs ground and staged. Waiting on remaining stock.',
          severity: 'info',
        },
      ],
    },
    {
      id: 'WO-4094',
      product: 'Injection-Moulded Cap — 25mm Plug-Fit',
      customer: 'Meridian Packaging',
      quantity: 45000,
      dueDate: dueIn(-1), // overdue
      status: 'delayed',
      machineId: 'Moulder-05',
      notes: [
        {
          id: 'n-4094-1',
          at: ago(30),
          text: 'Mould temperature instability causing short shots. Process engineer reviewing.',
          severity: 'issue',
        },
      ],
    },
    {
      id: 'WO-4127',
      product: 'Flange Adapter DN100 PN25 — RTJ Face, Inconel 625 Overlay Weld',
      customer: 'Orinoco Subsea Ltd.',
      quantity: 2,
      dueDate: dueIn(1),
      status: 'delayed',
      machineId: 'Weld-04',
      notes: [
        {
          id: 'n-4127-1',
          at: ago(16),
          text: 'Inconel wire delivery delayed by freight hold at customs.',
          severity: 'issue',
        },
      ],
    },

    // ── Completed (6) ────────────────────────────────────────────────────────
    {
      id: 'WO-4051',
      product: 'Gear Shaft — Module 2, 20T Spur',
      customer: 'Halcyon Gearbox Co.',
      quantity: 10,
      dueDate: dueIn(-6),
      status: 'completed',
      machineId: 'Lathe-02',
      notes: [], // completed job with no notes
    },
    {
      id: 'WO-4058',
      product: 'Sheet-Metal Enclosure 200×150×100',
      customer: 'Nexon Controls',
      quantity: 75,
      dueDate: dueIn(-5),
      status: 'completed',
      machineId: 'Press-12',
      notes: [
        {
          id: 'n-4058-1',
          at: ago(144),
          text: 'All 75 enclosures powder-coated and packed. QC passed.',
          severity: 'info',
        },
      ],
    },
    {
      id: 'WO-4062',
      product: 'Hydraulic Manifold Block — Series 3 Cetop-5',
      customer: 'Vantage Fluid Systems',
      quantity: 8,
      dueDate: dueIn(-3),
      status: 'completed',
      machineId: 'CNC-07',
      notes: [
        {
          id: 'n-4062-1',
          at: ago(120),
          text: 'Pressure test at 350 bar passed on all 8 units.',
          severity: 'info',
        },
      ],
    },
    {
      id: 'WO-4067',
      product: 'Bearing Retainer — Angular Contact 7208',
      customer: 'Stelford Drives',
      quantity: 40,
      dueDate: dueIn(-7),
      status: 'completed',
      machineId: 'Grinder-02',
      notes: [],
    },
    {
      id: 'WO-4071',
      product: 'Injection-Moulded Cap — 65mm Locking Ring',
      customer: 'Meridian Packaging',
      quantity: 30000,
      dueDate: dueIn(-2),
      status: 'completed',
      machineId: 'Moulder-05',
      notes: [
        {
          id: 'n-4071-1',
          at: ago(60),
          text: 'Run complete. Sample batch sent to lab for dimensional audit.',
          severity: 'info',
        },
        {
          id: 'n-4071-2',
          at: ago(48),
          text: 'Lab report clear. Released for despatch.',
          severity: 'info',
        },
      ],
    },
    {
      id: 'WO-4079',
      product: 'Flange Adapter DN40 PN16',
      customer: 'Kestrel Process Engineering',
      quantity: 24,
      dueDate: dueIn(-1),
      status: 'completed',
      machineId: 'Weld-04',
      notes: [],
    },
  ]
}
