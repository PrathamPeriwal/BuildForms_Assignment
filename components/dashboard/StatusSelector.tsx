import { useState } from 'react'
import type { Job, Machine, JobStatus } from '../../lib/types'
import { STATUS_CONFIG } from '../../lib/status-config'
import { Loader2 } from 'lucide-react'
import { cn } from 'cn'

export function StatusSelector({
  job,
  machine,
  updateStatus,
  onSaveSuccess,
  isFilteredOut,
  onClose,
}: {
  job: Job
  machine?: Machine
  updateStatus: (id: string, status: JobStatus) => Promise<void>
  onSaveSuccess: (id: string) => void
  isFilteredOut: boolean
  onClose: () => void
}) {
  const [draft, setDraft] = useState<JobStatus>(job.status)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [showConfirmReopen, setShowConfirmReopen] = useState(false)

  const handleSave = async () => {
    if (draft === job.status) return

    if (
      job.status === 'completed' &&
      draft !== 'completed' &&
      !showConfirmReopen
    ) {
      setShowConfirmReopen(true)
      return
    }

    setIsSaving(true)
    setSaveError(false)

    try {
      await updateStatus(job.id, draft)
      onSaveSuccess(job.id)
      setShowConfirmReopen(false)
      setTimeout(() => {
        onClose()
      }, 600)
    } catch {
      setSaveError(true)
    } finally {
      setIsSaving(false)
    }
  }

  const isDownOrUnassigned = !machine || machine.state === 'down'
  const showMachineHint = draft === 'in_progress' && isDownOrUnassigned

  if (showConfirmReopen) {
    return (
      <div className="border-t border-ink bg-sheet p-6 shrink-0 flex flex-col gap-4">
        <span className="text-ink text-sm font-semibold">
          Reopen this completed job? It goes back on the floor.
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-ink text-paper py-3 font-semibold text-sm hover:bg-ink/90 flex justify-center items-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Confirm'}
          </button>
          <button
            onClick={() => setShowConfirmReopen(false)}
            disabled={isSaving}
            className="flex-1 border border-ink text-ink py-3 font-semibold text-sm hover:bg-paper"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-ink bg-sheet p-6 shrink-0 flex flex-col gap-4">
      <div className="flex flex-col gap-2 w-full">
        <span className="micro text-graphite">UPDATE STATUS</span>
        <div
          role="radiogroup"
          className="grid grid-cols-2 lg:grid-cols-4 gap-2"
        >
          {(['pending', 'in_progress', 'delayed', 'completed'] as const).map(
            (s) => {
              const cfg = STATUS_CONFIG[s]
              const Icon = cfg.icon
              const isSelected = draft === s
              return (
                <button
                  key={s}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setDraft(s)
                    setSaveError(false)
                    setShowConfirmReopen(false)
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 p-2 border transition-colors',
                    isSelected
                      ? 'bg-ink text-paper border-ink shadow-[inset_0_3px_0_rgba(0,0,0,1)]'
                      : 'bg-sheet text-ink border-ink hover:bg-paper'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0',
                      isSelected ? 'text-paper' : cfg.text
                    )}
                    strokeWidth={2.5}
                  />
                  <span className="text-[11px] sm:text-xs font-semibold truncate max-w-full text-center leading-tight">
                    {cfg.label}
                  </span>
                </button>
              )
            }
          )}
        </div>
      </div>

      <div aria-live="polite" className="flex flex-col gap-2 mt-2">
        {saveError && (
          <span className="text-s-delayed text-sm font-semibold">
            Couldn&apos;t save. Status reverted.
          </span>
        )}
        {showMachineHint && !saveError && (
          <span className="text-graphite text-sm">
            {!machine ? 'No machine assigned' : `${machine.name} is down`}
          </span>
        )}
        {isFilteredOut && !saveError && draft === job.status && (
          <span className="text-graphite text-sm">
            Moved to {STATUS_CONFIG[job.status].label}. Hidden by the current
            filter.
          </span>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving || draft === job.status}
          className="w-full bg-ink text-paper py-3 font-semibold text-sm hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save status'}
        </button>
      </div>
    </div>
  )
}
