import { StatusPill } from './StatusPill'
import { getDueDisplay, statusRailConfig } from './JobRow'
import { cn } from 'cn'
import type { Job } from '../../lib/types'

type JobTicketProps = {
  job: Job
  machineName?: string
  isSelected: boolean
  onClick: () => void
  className?: string
  style?: React.CSSProperties
}

export function JobTicket({
  job,
  machineName,
  isSelected,
  onClick,
  className,
  style,
}: JobTicketProps) {
  const due = getDueDisplay(job.dueDate, job.status)
  const railClass = statusRailConfig[job.status]

  return (
    <button
      id={`job-row-${job.id}`}
      onClick={onClick}
      style={style}
      data-state={isSelected ? 'selected' : undefined}
      className={cn(
        'group relative w-full text-left bg-sheet border border-ink overflow-hidden rounded-sm',
        'hover:bg-highlighter/10 data-[state=selected]:bg-highlighter/25 transition-colors duration-120 flex flex-col min-h-[44px]',
        className
      )}
    >
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 transition-[width] duration-120',
          isSelected ? 'w-2' : 'w-1',
          railClass
        )}
      />
      <div className="p-3 pl-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="font-mono font-semibold text-ink text-sm">
            {job.id}
          </div>
          <StatusPill status={job.status} />
        </div>
        <div className="mb-1 text-ink font-semibold line-clamp-2">
          {job.product}
        </div>
        <div className="text-graphite text-sm truncate mb-1">
          {job.customer}
        </div>
      </div>

      <div className="border-t border-dashed border-rule flex items-center justify-between p-3 pl-4">
        <div>
          <div className="micro text-graphite mb-1">QTY</div>
          <div className="font-mono num text-ink text-sm">
            {new Intl.NumberFormat('en-US').format(job.quantity)}
          </div>
        </div>

        <div>
          <div className="micro text-graphite mb-1">DUE</div>
          <div className="font-mono text-ink text-sm flex flex-col items-start leading-tight">
            <span>{due.absolute}</span>
            {due.hint && (
              <span className={cn('font-sans text-xs mt-0.5', due.hintClass)}>
                {due.hint}
              </span>
            )}
          </div>
        </div>

        <div className="text-right flex flex-col items-end justify-start h-full">
          <div className="micro text-graphite mb-1">MACHINE</div>
          <div className="font-mono text-sm leading-tight">
            {machineName ? (
              <span className="text-ink">{machineName}</span>
            ) : (
              <span className="inline-block px-1.5 py-0.5 border border-ink text-graphite text-[10px] hatch opacity-80 rounded-[2px] leading-none mt-0.5">
                Unassigned
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
