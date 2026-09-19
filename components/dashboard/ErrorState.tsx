import { ServerCrash } from 'lucide-react'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full bg-sheet border border-ink rounded-sm overflow-hidden">
      <div className="h-2 w-full hazard" />
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <ServerCrash className="w-8 h-8 text-s-delayed mb-4" />
        <h3 className="font-display text-2xl font-bold text-ink mb-2">
          Couldn&apos;t load the job list
        </h3>
        <p className="font-mono text-graphite mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="bg-ink text-paper px-4 py-2 font-semibold hover:bg-ink/90 transition-colors rounded-[2px]"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
