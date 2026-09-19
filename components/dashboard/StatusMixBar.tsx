'use client'

import type { JobStatus } from '../../lib/types'
import { cn } from 'cn'

interface StatusMixBarProps {
  counts: Record<JobStatus, number>
  isLoading?: boolean
}

const STATUS_ORDER: JobStatus[] = [
  'pending',
  'in_progress',
  'delayed',
  'completed',
]

export function StatusMixBar({ counts, isLoading }: StatusMixBarProps) {
  if (isLoading) {
    return (
      <div className="mt-px flex h-[10px] w-full bg-rule">
        <div className="h-full w-full hazard-loading animate-stripe-slide" />
      </div>
    )
  }

  const total = Object.values(counts).reduce((sum, c) => sum + c, 0)

  if (total === 0) return null

  const ariaLabel = STATUS_ORDER.filter((status) => counts[status] > 0)
    .map((status) => `${counts[status]} ${status.replace('_', ' ')}`)
    .join(', ')

  return (
    <div
      className="mt-px flex h-[10px] w-full gap-px overflow-hidden bg-rule"
      role="img"
      aria-label={ariaLabel}
    >
      {STATUS_ORDER.map((status) => {
        const count = counts[status]
        if (count === 0) return null

        return (
          <div
            key={status}
            style={{ flexGrow: count, transition: 'flex-grow 400ms ease-out' }}
            className={cn(
              'h-full',
              status === 'pending' && 'border border-s-pending bg-paper',
              status === 'in_progress' && 'bg-s-progress',
              status === 'delayed' && 'hatch bg-s-delayed/20 text-s-delayed',
              status === 'completed' && 'bg-s-done'
            )}
          />
        )
      })}
    </div>
  )
}
