import { StatusSelector } from './StatusSelector'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../ui/sheet'
import { STATUS_CONFIG } from '../../lib/status-config'
import {
  formatDue,
  dueHint,
  daysUntil,
  formatStamp,
} from '../../lib/date-helpers'
import { TriangleAlert, Loader2 } from 'lucide-react'
import { cn } from 'cn'
import type { Job, Machine, JobStatus } from '../../lib/types'

// MatchMedia hook for responsive side
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}




function DottedRow({
  label,
  value,
  hint,
  overdue,
}: {
  label: string
  value: React.ReactNode
  hint?: string
  overdue?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-baseline w-full">
        <span className="text-graphite pr-2 whitespace-nowrap">{label}</span>
        <div className="flex-1 border-b border-dotted border-rule/50 relative -top-[4px]"></div>
        <span className="pl-2 font-mono tabular-nums text-right flex items-baseline gap-2">
          {value}
          {hint && (
            <span className="text-graphite text-xs ml-1 font-sans">{hint}</span>
          )}
        </span>
      </div>
      {overdue && (
        <div className="text-s-delayed text-sm text-right">
          Overdue by {hint?.replace(' late', '')}
        </div>
      )}
    </div>
  )
}




function MachineChip({
  machine,
  jobStatus,
  isDelayed,
}: {
  machine?: Machine
  jobStatus: string
  isDelayed: boolean
}) {
  if (!machine) {
    return (
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center self-start gap-2 border border-rule px-3 py-1 bg-sheet hatch">
          <span className="font-mono tabular-nums text-ink">
            No machine assigned
          </span>
        </div>
        <p className="text-sm text-graphite">This job needs to be scheduled.</p>
      </div>
    )
  }

  const isDown = machine.state === 'down'

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          'inline-flex items-center self-start gap-2 border px-3 py-1',
          isDown
            ? 'border-s-delayed bg-s-delayed/5 hatch'
            : 'border-rule bg-sheet'
        )}
      >
        <span className="font-mono tabular-nums text-ink">{machine.name}</span>
        <div className="flex items-center gap-1.5">
          {machine.state === 'running' && (
            <span
              className="w-2 h-2 rounded-full bg-s-done animate-pulse"
              style={{ animationDuration: '2s' }}
            />
          )}
          {machine.state === 'idle' && (
            <span className="w-2 h-2 rounded-full border border-s-pending" />
          )}
          {machine.state === 'down' && (
            <span className="w-2 h-2 rounded-full bg-s-delayed" />
          )}
          <span className="text-sm font-medium text-ink">
            {machine.state.charAt(0).toUpperCase() + machine.state.slice(1)}
          </span>
        </div>
      </div>

      {isDown && jobStatus !== 'completed' && (
        <div className="flex items-start gap-3 border-l-4 border-s-delayed bg-s-delayed/5 hatch p-3">
          <TriangleAlert className="w-5 h-5 text-s-delayed shrink-0 mt-0.5" />
          <div className="text-sm text-ink leading-relaxed">
            <span className="font-medium">{machine.name}</span> is down. This
            job can&apos;t progress until it&apos;s back.
            {isDelayed && ' Likely cause of the delay.'}
          </div>
        </div>
      )}
    </div>
  )
}




function NotesLog({ notes }: { notes: Job['notes'] }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-sm text-graphite py-2">
        No notes logged for this job.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className={cn(
            'flex flex-col gap-1 p-3 bg-sheet',
            note.severity === 'issue'
              ? 'border-l-[6px] border-s-delayed hazard'
              : 'border-l border-rule'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono tabular-nums text-xs text-graphite">
              {formatStamp(note.at)}
            </span>
            {note.severity === 'issue' && (
              <span className="micro flex items-center gap-1 text-s-delayed">
                <TriangleAlert className="w-3 h-3" />
                ISSUE
              </span>
            )}
          </div>
          <p className="text-sm text-ink whitespace-pre-wrap">{note.text}</p>
        </div>
      ))}
    </div>
  )
}




function StatusStamp({ status }: { status: Job['status'] }) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <div
      key={status}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 transform mix-blend-multiply relative bg-paper animate-stamp-thump',
        config.text
      )}
      style={{
        boxShadow: `0 0 0 1px currentColor, 0 0 0 3px var(--paper), 0 0 0 4px currentColor`,
      }}
    >
      <Icon className="w-4 h-4" strokeWidth={2.5} />
      <span className="micro tracking-widest text-ink font-bold">
        {config.label}
      </span>
    </div>
  )
}




interface JobDetailSheetProps {
  job: Job | null
  machine?: Machine
  onClose: () => void
  updateStatus: (id: string, status: JobStatus) => Promise<void>
  onSaveSuccess: (id: string) => void
  isFilteredOut: boolean
}

export function JobDetailSheet({
  job,
  machine,
  onClose,
  updateStatus,
  onSaveSuccess,
  isFilteredOut,
}: JobDetailSheetProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  if (!job) {
    return (
      <Sheet open={false} onOpenChange={onClose}>
        <SheetContent
          side={isDesktop ? 'right' : 'bottom'}
          className="p-0 border-none outline-none overflow-hidden"
        >
          <SheetTitle className="sr-only">Job Details</SheetTitle>
          <SheetDescription className="sr-only">
            Job details side panel
          </SheetDescription>
        </SheetContent>
      </Sheet>
    )
  }

  const d = daysUntil(job.dueDate)
  const isOverdue = d < 0 && job.status !== 'completed'
  const hnt = dueHint(job.dueDate)

  return (
    <Sheet open={!!job} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={isDesktop ? 'right' : 'bottom'}
        className="p-0 flex flex-col sm:max-w-[480px] w-full max-h-[85vh] lg:max-h-none border-t-2 lg:border-t-0 border-ink outline-none"
        showCloseButton={false}
      >
        {/* Mobile drag handle area */}
        {!isDesktop && (
          <div className="w-full h-6 flex items-center justify-center shrink-0 absolute top-0 left-0">
            <div className="w-12 h-1.5 bg-rule rounded-full" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto pt-6 lg:pt-0">
          {/* Header */}
          <div className="p-6 pb-8 border-b border-rule bg-sheet relative">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col">
                <span className="micro text-graphite mb-1">JOB TRAVELLER</span>
                <SheetTitle className="font-display font-extrabold text-[44px] leading-none tracking-tight text-ink">
                  {job.id}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Details for job {job.id} - {job.product}
                </SheetDescription>
                <p className="font-sans font-semibold text-lg text-ink mt-2">
                  {job.product}
                </p>
              </div>
              <div className="pt-2 pr-2">
                <StatusStamp status={job.status} />
              </div>
            </div>
          </div>

          {/* Body Sections */}
          <div className="p-6 flex flex-col gap-8 bg-paper">
            {/* 01 ORDER */}
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="micro">01 ORDER</h3>
                <div className="h-px bg-rule w-full" />
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <DottedRow label="Customer" value={job.customer} />
                <DottedRow
                  label="Quantity"
                  value={job.quantity.toLocaleString()}
                />
                <DottedRow
                  label="Due date"
                  value={formatDue(job.dueDate)}
                  hint={hnt}
                  overdue={isOverdue}
                />
              </div>
            </section>

            {/* 02 MACHINE */}
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="micro">02 MACHINE</h3>
                <div className="h-px bg-rule w-full" />
              </div>
              <div className="mt-2">
                <MachineChip
                  machine={machine}
                  jobStatus={job.status}
                  isDelayed={job.status === 'delayed'}
                />
              </div>
            </section>

            {/* 03 NOTES & ISSUES */}
            <section className="flex flex-col gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <h3 className="micro">03 NOTES & ISSUES</h3>
                <div className="h-px bg-rule w-full" />
              </div>
              <div className="mt-2">
                <NotesLog notes={job.notes} />
              </div>
            </section>
          </div>
        </div>

        {/* Status Selector Footer */}
        <StatusSelector
          key={job.id}
          job={job}
          machine={machine}
          updateStatus={updateStatus}
          onSaveSuccess={onSaveSuccess}
          isFilteredOut={isFilteredOut}
          onClose={onClose}
        />
      </SheetContent>
    </Sheet>
  )
}




