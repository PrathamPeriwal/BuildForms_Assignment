import { SearchX, PackageOpen } from 'lucide-react'

type EmptyStateProps = {
  type: 'search' | 'filter' | 'empty'
  searchValue?: string
  onClearFilters?: () => void
}

export function EmptyState({
  type,
  searchValue,
  onClearFilters,
}: EmptyStateProps) {
  let title = ''
  let actionLabel = ''
  let Icon = PackageOpen

  if (type === 'search') {
    title = `Nothing on the floor matches "${searchValue}".`
    actionLabel = 'Clear filters'
    Icon = SearchX
  } else if (type === 'filter') {
    title = 'No matching jobs right now.'
    actionLabel = 'Show all jobs'
  } else {
    title = 'No jobs scheduled.'
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 border border-ink bg-sheet relative rounded-[2px] overflow-hidden">
      <div className="absolute top-0 right-0 w-8 h-8 hatch border-l border-b border-rule opacity-50" />
      <Icon className="w-8 h-8 text-graphite mb-4 stroke-[1.5]" />
      <p className="text-ink mb-6 text-sm">{title}</p>
      {actionLabel && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="border border-ink bg-paper px-4 py-1.5 hover:bg-highlighter transition-colors text-sm font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
