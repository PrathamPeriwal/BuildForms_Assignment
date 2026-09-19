import { TableRow, TableCell } from '../ui/table'
import { StatusPill } from './StatusPill'
import { cn } from 'cn'
import type { Job, JobStatus } from '../../lib/types'

type JobRowProps = {
  job: Job
  machineName?: string
  isSelected: boolean
  onClick: () => void
  className?: string
  style?: React.CSSProperties
}

export function getDueDisplay(dueDateStr: string, status: JobStatus) {
  const dueTime = new Date(dueDateStr + 'T00:00:00').getTime()
  const now = new Date()
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime()

  const diffDays = Math.round((dueTime - today) / (1000 * 60 * 60 * 24))

  const formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
  })
  const absolute = formatter.format(dueTime)

  if (status === 'completed') {
    return { absolute, hint: null, hintClass: '' }
  }

  if (diffDays < 0) {
    const lateText = diffDays === -1 ? '1d late' : `${-diffDays}d late`
    return {
      absolute,
      hint: lateText,
      hintClass: 'text-s-delayed font-semibold',
    }
  }

  if (diffDays === 0) {
    return { absolute, hint: 'today', hintClass: 'text-ink font-semibold' }
  }

  if (diffDays <= 3) {
    return { absolute, hint: `in ${diffDays}d`, hintClass: 'text-graphite' }
  }

  return { absolute, hint: null, hintClass: '' }
}

export const statusRailConfig = {
  pending: 'bg-s-pending',
  in_progress: 'bg-s-progress',
  delayed: 'bg-s-delayed hatch',
  completed: 'bg-s-done',
}

export function JobRow({
  job,
  machineName,
  isSelected,
  onClick,
  className,
  style,
}: JobRowProps) {
  const due = getDueDisplay(job.dueDate, job.status)
  const railClass = statusRailConfig[job.status]

  return (
    <TableRow
      id={`job-row-${job.id}`}
      tabIndex={0}
      data-selected={isSelected ? '' : undefined}
      data-state={isSelected ? 'selected' : undefined}
      aria-current={isSelected ? 'true' : undefined}
      onClick={onClick}
      style={style}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        'group cursor-pointer relative h-11 lg:h-12 border-b border-rule hover:bg-highlighter/10 data-[state=selected]:bg-highlighter/25 transition-colors duration-120',
        className
      )}
    >
      <TableCell className="p-0 w-0 align-top relative">
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 transition-[width] duration-120',
            isSelected ? 'w-2' : 'w-1',
            railClass
          )}
        />
      </TableCell>
      <TableCell className="pl-4 py-2 font-mono font-semibold text-ink">
        {job.id}
      </TableCell>
      <TableCell className="py-2 w-full max-w-0">
        <div className="truncate text-ink" title={job.product}>
          {job.product}
        </div>
      </TableCell>
      <TableCell className="py-2 text-graphite truncate max-w-[120px] lg:max-w-[160px]">
        {job.customer}
      </TableCell>
      <TableCell className="py-2 font-mono text-right num">
        {new Intl.NumberFormat('en-US').format(job.quantity)}
      </TableCell>
      <TableCell className="py-2 font-mono text-ink whitespace-nowrap">
        <span>{due.absolute}</span>
        {due.hint && (
          <span className={cn('ml-2 font-sans text-sm', due.hintClass)}>
            {due.hint}
          </span>
        )}
      </TableCell>
      <TableCell className="py-2">
        <StatusPill status={job.status} />
      </TableCell>
      <TableCell className="py-2 font-mono">
        {machineName ? (
          <span className="text-ink">{machineName}</span>
        ) : (
          <span className="inline-block px-1.5 py-0.5 border border-ink text-graphite text-xs hatch opacity-80 rounded-[2px]">
            Unassigned
          </span>
        )}
      </TableCell>
    </TableRow>
  )
}
