'use client'

import { MetricCell } from './MetricCell'
import { StatusMixBar } from './StatusMixBar'
import type { JobStatus } from '../../lib/types'

interface SummaryBoardProps {
  metrics: {
    total: number
    delayed: number
    dueSoon: number
    completed: number
    dueToday: number
  }
  statusCounts: Record<JobStatus, number>
  currentFilter: 'total' | 'delayed' | 'dueSoon' | 'completed'
  onFilterChange: (
    filter: 'total' | 'delayed' | 'dueSoon' | 'completed'
  ) => void
  isLoading?: boolean
}

export function SummaryBoard({
  metrics,
  statusCounts,
  currentFilter,
  onFilterChange,
  isLoading,
}: SummaryBoardProps) {
  return (
    <div className="w-full">
      <div className="relative border border-ink">
        {/* Registration marks */}
        <div className="absolute -left-1 -top-1 z-10 h-2 w-2 border-l border-t border-ink" />
        <div className="absolute -right-1 -top-1 z-10 h-2 w-2 border-r border-t border-ink" />
        <div className="absolute -bottom-1 -left-1 z-10 h-2 w-2 border-b border-l border-ink" />
        <div className="absolute -bottom-1 -right-1 z-10 h-2 w-2 border-b border-r border-ink" />

        <div className="grid grid-cols-2 gap-px bg-rule md:grid-cols-4">
          <MetricCell
            label="Total Jobs"
            value={metrics.total}
            isActive={currentFilter === 'total'}
            onClick={() => onFilterChange('total')}
            isLoading={isLoading}
          />
          <MetricCell
            label="Delayed"
            value={metrics.delayed}
            isDelayed
            isActive={currentFilter === 'delayed'}
            onClick={() => onFilterChange('delayed')}
            isLoading={isLoading}
          />
          <MetricCell
            label="Due Soon"
            value={metrics.dueSoon}
            subLine={
              metrics.dueSoon > 0 ? `${metrics.dueToday} due today` : undefined
            }
            isActive={currentFilter === 'dueSoon'}
            onClick={() => onFilterChange('dueSoon')}
            isLoading={isLoading}
          />
          <MetricCell
            label="Completed"
            value={metrics.completed}
            isActive={currentFilter === 'completed'}
            onClick={() => onFilterChange('completed')}
            isLoading={isLoading}
          />
        </div>
      </div>

      <StatusMixBar counts={statusCounts} isLoading={isLoading} />
    </div>
  )
}
