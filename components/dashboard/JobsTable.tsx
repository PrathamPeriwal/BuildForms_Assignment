import { useEffect, useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { Table, TableHeader, TableBody, TableHead, TableRow } from '../ui/table'
import { JobRow } from './JobRow'
import { JobTicket } from './JobTicket'
import { EmptyState } from './EmptyState'
import { cn } from 'cn'
import type { Job, Machine } from '../../lib/types'

type SortState = {
  key: 'dueDate' | 'quantity' | null
  direction: 'asc' | 'desc'
}

type JobsTableProps = {
  jobs: Job[]
  machines: Machine[]
  sort: SortState
  onSort: (key: 'dueDate' | 'quantity') => void
  selectedJobId?: string | null
  onSelectJob: (id: string) => void
  emptyStateType?: 'search' | 'filter' | 'empty'
  searchValue?: string
  onClearFilters?: () => void
  filterKey: string // used to trigger remount animation
  flashJobId?: string | null
}

function SortableHead({
  label,
  sortKey,
  currentSort,
  onSort,
  alignRight = false,
}: {
  label: string
  sortKey: 'dueDate' | 'quantity'
  currentSort: SortState
  onSort: (k: 'dueDate' | 'quantity') => void
  alignRight?: boolean
}) {
  const isActive = currentSort.key === sortKey
  const ariaSort = isActive
    ? currentSort.direction === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none'

  return (
    <TableHead
      aria-sort={ariaSort}
      className={cn(
        'group cursor-pointer select-none hover:text-ink transition-colors'
      )}
      onClick={() => onSort(sortKey)}
    >
      <div
        className={cn(
          'flex items-center gap-1',
          alignRight ? 'justify-end flex-row-reverse' : 'justify-start'
        )}
      >
        <span>{label}</span>
        {isActive ? (
          currentSort.direction === 'asc' ? (
            <ChevronUp className="w-3.5 h-3.5 text-ink" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-ink" />
          )
        ) : (
          <ChevronsUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
        )}
      </div>
    </TableHead>
  )
}

export function JobsTable({
  jobs,
  machines,
  sort,
  onSort,
  selectedJobId,
  onSelectJob,
  emptyStateType,
  searchValue,
  onClearFilters,
  filterKey,
  flashJobId,
}: JobsTableProps) {
  const [isInitialRender, setIsInitialRender] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialRender(false)
    }, 500) // enough time for the animation to finish
    return () => clearTimeout(timer)
  }, [])

  if (jobs.length === 0 && emptyStateType) {
    return (
      <EmptyState
        type={emptyStateType}
        searchValue={searchValue}
        onClearFilters={onClearFilters}
      />
    )
  }

  const machineMap = new Map(machines.map((m) => [m.id, m.name]))

  return (
    <div className="relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes list-stagger {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes list-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-stagger {
          animation: list-stagger 200ms ease-out both;
        }
        .animate-fade {
          animation: list-fade 120ms ease-out both;
        }
      `,
        }}
      />

      {/* Mobile/Tablet View */}
      <div
        className={cn(
          'flex flex-col gap-2 lg:hidden',
          !isInitialRender && 'animate-fade'
        )}
        key={`mobile-${filterKey}`}
      >
        {jobs.map((job, index) => {
          const rowStyle = isInitialRender
            ? {
                animationDelay: `${Math.min(index, 10) * 20}ms`,
              }
            : {}

          return (
            <JobTicket
              key={job.id}
              job={job}
              machineName={
                job.machineId ? machineMap.get(job.machineId) : undefined
              }
              isSelected={selectedJobId === job.id}
              onClick={() => onSelectJob(job.id)}
              className={cn(
                isInitialRender && 'animate-stagger',
                flashJobId === job.id && 'animate-flash-row'
              )}
              style={rowStyle}
            />
          )
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block border border-ink bg-sheet rounded-sm rounded-tl-none overflow-hidden relative">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-1 p-0" />
              <TableHead>Job ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <SortableHead
                label="Qty"
                sortKey="quantity"
                currentSort={sort}
                onSort={onSort}
                alignRight
              />
              <SortableHead
                label="Due"
                sortKey="dueDate"
                currentSort={sort}
                onSort={onSort}
              />
              <TableHead>Status</TableHead>
              <TableHead>Machine</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody
            key={filterKey}
            className={cn(!isInitialRender && 'animate-fade')}
          >
            {jobs.map((job, index) => {
              const rowStyle = isInitialRender
                ? {
                    animationDelay: `${Math.min(index, 10) * 20}ms`,
                  }
                : {}

              return (
                <JobRow
                  key={job.id}
                  job={job}
                  machineName={
                    job.machineId ? machineMap.get(job.machineId) : undefined
                  }
                  isSelected={selectedJobId === job.id}
                  onClick={() => onSelectJob(job.id)}
                  className={cn(
                    isInitialRender && 'animate-stagger',
                    flashJobId === job.id && 'animate-flash-row'
                  )}
                  style={rowStyle}
                />
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
