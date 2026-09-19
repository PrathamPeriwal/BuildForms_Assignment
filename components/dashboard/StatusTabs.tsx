import {
  CircleDashed,
  CircleDot,
  TriangleAlert,
  CircleCheck,
} from 'lucide-react'
import { useJobFilters } from '../../hooks/use-job-filters'
import type { JobStatus } from '../../lib/types'

type StatusTabsProps = {
  counts: Record<JobStatus, number>
  totalCount: number
}

export function StatusTabs({ counts, totalCount }: StatusTabsProps) {
  const { status: activeStatus, setStatus } = useJobFilters()

  const tabs = [
    { id: 'all', label: 'All', icon: null, count: totalCount, value: null },
    {
      id: 'pending',
      label: 'Pending',
      icon: CircleDashed,
      count: counts.pending,
      value: 'pending' as const,
      iconClass: 'text-s-pending',
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      icon: CircleDot,
      count: counts.in_progress,
      value: 'in_progress' as const,
      iconClass: 'text-s-in_progress',
    },
    {
      id: 'delayed',
      label: 'Delayed',
      icon: TriangleAlert,
      count: counts.delayed,
      value: 'delayed' as const,
      iconClass: 'text-s-delayed',
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CircleCheck,
      count: counts.completed,
      value: 'completed' as const,
      iconClass: 'text-s-completed',
    },
  ]

  return (
    <div
      role="group"
      aria-label="Status filters"
      className="flex flex-row overflow-x-auto snap-x snap-mandatory hide-scrollbar mt-6 lg:mt-8"
      style={{
        // Hide scrollbar styles for cross-browser
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `,
        }}
      />

      {tabs.map((tab) => {
        const isActive = activeStatus === tab.value

        return (
          <button
            key={tab.id}
            aria-pressed={isActive}
            onClick={() => setStatus(tab.value)}
            className={`
              flex-none snap-start group relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-t border-l border-r rounded-t-sm transition-colors whitespace-nowrap
              ${
                isActive
                  ? 'bg-sheet border-ink text-ink z-10'
                  : 'bg-paper border-rule text-graphite hover:text-ink hover:bg-sheet/50 border-b border-b-rule'
              }
            `}
            style={{
              // Overlap the table's top border by 1px by pushing it down slightly
              // and removing bottom border if active
              marginBottom: isActive ? '-1px' : '0',
              borderBottomColor: isActive ? 'transparent' : undefined,
            }}
          >
            {tab.icon && (
              <tab.icon className={`h-4 w-4 ${tab.iconClass || ''}`} />
            )}
            <span>{tab.label}</span>
            <span
              className={`font-mono text-xs ${isActive ? 'text-ink' : 'text-graphite group-hover:text-ink'}`}
            >
              {tab.count}
            </span>
          </button>
        )
      })}

      {/* Spacer to fill remaining width with border-b */}
      <div
        className="flex-1 border-b border-rule min-w-4"
        style={{ marginBottom: 0 }}
      ></div>
    </div>
  )
}
