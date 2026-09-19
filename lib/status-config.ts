import {
  CircleDashed,
  CircleDot,
  TriangleAlert,
  CircleCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { JobStatus, MachineState } from './types'

type StatusConfig = {
  label: string
  icon: LucideIcon
  order: number
  // fully-written Tailwind strings — no dynamic construction
  text: string
  bg: string
  border: string
  rail: string
}

export const STATUS_CONFIG: Record<JobStatus, StatusConfig> = {
  pending: {
    label: 'Pending',
    icon: CircleDashed,
    order: 0,
    text: 'text-s-pending',
    bg: 'bg-s-pending/10',
    border: 'border-s-pending border-dashed',
    rail: 'bg-s-pending/40',
  },
  in_progress: {
    label: 'In Progress',
    icon: CircleDot,
    order: 1,
    text: 'text-s-progress',
    bg: 'bg-s-progress/10',
    border: 'border-s-progress',
    rail: 'bg-s-progress',
  },
  delayed: {
    label: 'Delayed',
    icon: TriangleAlert,
    order: 2,
    text: 'text-s-delayed',
    // hatch pattern applied via .hatch utility alongside this bg
    bg: 'bg-s-delayed/10',
    border: 'border-s-delayed',
    rail: 'bg-s-delayed',
  },
  completed: {
    label: 'Completed',
    icon: CircleCheck,
    order: 3,
    text: 'text-s-done',
    bg: 'bg-s-done/10',
    border: 'border-s-done',
    rail: 'bg-s-done',
  },
}

export const STATUS_ORDER: JobStatus[] = [
  'pending',
  'in_progress',
  'delayed',
  'completed',
]

type MachineStateConfig = {
  label: string
  text: string
  bg: string
}

export const MACHINE_STATE_CONFIG: Record<MachineState, MachineStateConfig> = {
  running: {
    label: 'Running',
    text: 'text-s-done',
    bg: 'bg-s-done/10',
  },
  idle: {
    label: 'Idle',
    text: 'text-s-pending',
    bg: 'bg-s-pending/10',
  },
  down: {
    label: 'Down',
    text: 'text-s-delayed',
    bg: 'bg-s-delayed/10',
  },
}
