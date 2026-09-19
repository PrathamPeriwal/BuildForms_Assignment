import { Search, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import type { SortKey, SortDirection, Sort } from '../../hooks/use-job-filters'

type JobsToolbarProps = {
  totalJobs: number
  filteredJobsCount: number
  search: string
  onSearchChange: (val: string) => void
  sort: Sort
  onSortChange: (sort: Sort) => void
  isFiltered: boolean
  onClearFilters: () => void
  dueSoon: boolean
  onDueSoonChange: (val: boolean) => void
  children?: React.ReactNode
  disabled?: boolean
}

export function JobsToolbar({
  totalJobs,
  filteredJobsCount,
  search,
  onSearchChange,
  sort,
  onSortChange,
  isFiltered,
  onClearFilters,
  dueSoon,
  onDueSoonChange,
  children,
  disabled,
}: JobsToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        if (
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA' ||
          document.activeElement?.tagName === 'SELECT' ||
          (document.activeElement as HTMLElement)?.isContentEditable
        ) {
          return
        }
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (search) {
        onSearchChange('')
      } else {
        inputRef.current?.blur()
      }
    }
  }

  const handleSortChange = (value: string) => {
    const [key, direction] = value.split('-') as [SortKey, SortDirection]
    onSortChange({ key, direction })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-y-4 lg:gap-x-4">
      {/* 1. Search */}
      <div className="relative w-full lg:max-w-[360px] order-1 lg:col-start-1 lg:row-start-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search job ID, product or customer"
          className="pl-9 pr-9 font-mono text-sm bg-sheet border-rule text-ink focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink rounded-sm h-10 disabled:opacity-50"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
          {search ? (
            <button
              onClick={() => onSearchChange('')}
              className="text-graphite hover:text-ink focus:outline-none p-2 -mr-2"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="hidden lg:inline-block text-[11px] font-mono text-graphite border border-rule px-1 rounded-sm bg-paper leading-none py-[2px]">
              /
            </span>
          )}
        </div>
      </div>

      {/* 2. Tabs (mobile: middle, lg: bottom) */}
      {children && (
        <div className="order-2 lg:col-start-1 lg:col-span-2 lg:row-start-2">
          {children}
        </div>
      )}

      {/* 3. Sort + Meta (mobile: bottom, lg: top right) */}
      <div className="flex flex-wrap items-center gap-3 text-sm order-3 lg:col-start-2 lg:row-start-1 lg:justify-end mt-2 lg:mt-0">
        <div className="lg:hidden w-full sm:w-auto mb-2">
          <Select
            value={`${sort.key}-${sort.direction}`}
            onValueChange={handleSortChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-sheet border-rule rounded-sm font-mono text-xs h-9 disabled:opacity-50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate-asc">
                Due date, earliest first
              </SelectItem>
              <SelectItem value="dueDate-desc">
                Due date, latest first
              </SelectItem>
              <SelectItem value="quantity-desc">
                Quantity, high to low
              </SelectItem>
              <SelectItem value="quantity-asc">
                Quantity, low to high
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div
          aria-live="polite"
          className="font-mono text-xs text-graphite h-9 flex items-center"
        >
          Showing {filteredJobsCount} of {totalJobs}
        </div>

        {dueSoon && (
          <div className="flex items-center bg-highlight text-ink px-2 py-1 text-xs font-mono border border-ink rounded-sm">
            Due within 3 days
            <button
              onClick={() => onDueSoonChange(false)}
              className="ml-1 hover:opacity-70 focus:outline-none p-2 -mr-2 -my-2"
              aria-label="Remove due soon filter"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {isFiltered && (
          <button
            onClick={onClearFilters}
            className="text-xs text-graphite hover:text-ink underline underline-offset-2 focus:outline-none"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
