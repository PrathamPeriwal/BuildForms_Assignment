import {
  CircleDashed,
  CircleDot,
  TriangleAlert,
  CircleCheck,
} from 'lucide-react'
import { cn } from 'cn'
import type { JobStatus } from '../../lib/types'

const statusConfig = {
  pending: {
    icon: CircleDashed,
    label: 'Pending',
    colorClass: 'text-s-pending',
    borderClass: 'border-s-pending border-dashed',
  },
  in_progress: {
    icon: CircleDot,
    label: 'In Progress',
    colorClass: 'text-s-progress',
    borderClass: 'border-s-progress',
  },
  delayed: {
    icon: TriangleAlert,
    label: 'Delayed',
    colorClass: 'text-s-delayed',
    borderClass: 'border-s-delayed',
  },
  completed: {
    icon: CircleCheck,
    label: 'Completed',
    colorClass: 'text-s-done',
    borderClass: 'border-s-done',
  },
}

export function StatusPill({
  status,
  className,
}: {
  status: JobStatus
  className?: string
}) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-1.5 py-1 border bg-paper text-[13px] font-medium text-ink rounded-sm',
        config.borderClass,
        className
      )}
    >
      <Icon className={cn('h-3.5 w-3.5', config.colorClass)} />
      <span>{config.label}</span>
    </div>
  )
}
