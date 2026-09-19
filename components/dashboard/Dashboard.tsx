'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { useJobs } from '../../hooks/use-jobs'
import { useJobFilters } from '../../hooks/use-job-filters'
import type { JobStatus } from '../../lib/types'
import { TopBar } from './TopBar'
import { SummaryBoard } from './SummaryBoard'
import { JobsToolbar } from './JobsToolbar'
import { StatusTabs } from './StatusTabs'
import { JobsTable } from './JobsTable'
import { JobDetailSheet } from './JobDetailSheet'
import { TableSkeleton, TicketSkeleton } from './Skeletons'
import { ErrorState } from './ErrorState'

export function Dashboard() {
  const {
    jobs,
    machines,
    phase,
    errorMessage,
    isRefreshing,
    load,
    updateStatus,
  } = useJobs()

  const {
    search,
    debouncedSearch,
    status: statusFilter,
    dueSoon: dueSoonFilter,
    sort,
    setStatus,
    setDueSoon,
    toggleSort,
    clearFilters,
    isFiltered,
    setSearch,
    setSort,
  } = useJobFilters()

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [flashJobId, setFlashJobId] = useState<string | null>(null)
  const lastSelectedJobIdRef = useRef<string | null>(null)

  const handleSelectJob = (id: string | null) => {
    if (id) {
      lastSelectedJobIdRef.current = id
      setSelectedJobId(id)
    } else {
      setSelectedJobId(null)
      // Return focus after a short delay for the sheet to unmount/animate out
      if (lastSelectedJobIdRef.current) {
        const rowId = `job-row-${lastSelectedJobIdRef.current}`
        setTimeout(() => {
          document.getElementById(rowId)?.focus()
        }, 10)
      }
    }
  }

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // If sheet is open, let it handle the close, but we can also just enforce state clear here.
        // If not open, we clear the search.
        if (selectedJobId) {
          handleSelectJob(null)
        } else if (search) {
          setSearch('')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedJobId, search, setSearch])

  const todayStr = useMemo(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  }, [])

  const threeDaysFromNowStr = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toISOString().split('T')[0]
  }, [])

  const metrics = useMemo(() => {
    let total = 0
    let delayed = 0
    let dueSoon = 0
    let completed = 0
    let dueToday = 0

    jobs.forEach((job) => {
      total++
      if (job.status === 'delayed') delayed++
      if (job.status === 'completed') completed++

      const isCompleted = job.status === 'completed'
      if (!isCompleted) {
        if (job.dueDate >= todayStr && job.dueDate <= threeDaysFromNowStr) {
          dueSoon++
        }
        if (job.dueDate === todayStr) {
          dueToday++
        }
      }
    })

    return { total, delayed, dueSoon, completed, dueToday }
  }, [jobs, todayStr, threeDaysFromNowStr])

  const { searchFilteredJobs, tabCounts, totalSearchFiltered } = useMemo(() => {
    let totalSearchFiltered = 0
    const counts: Record<JobStatus, number> = {
      pending: 0,
      in_progress: 0,
      delayed: 0,
      completed: 0,
    }

    const lowerSearch = debouncedSearch.toLowerCase().trim()
    const filtered = jobs.filter((job) => {
      if (!lowerSearch) return true
      return (
        job.id.toLowerCase().includes(lowerSearch) ||
        job.product.toLowerCase().includes(lowerSearch) ||
        job.customer.toLowerCase().includes(lowerSearch)
      )
    })

    filtered.forEach((job) => {
      totalSearchFiltered++
      counts[job.status]++
    })

    return {
      searchFilteredJobs: filtered,
      tabCounts: counts,
      totalSearchFiltered,
    }
  }, [jobs, debouncedSearch])

  const visibleJobs = useMemo(() => {
    // Filter by status and dueSoon
    const filtered = searchFilteredJobs.filter((job) => {
      if (statusFilter && job.status !== statusFilter) return false
      if (dueSoonFilter) {
        if (job.status === 'completed') return false
        if (job.dueDate < todayStr || job.dueDate > threeDaysFromNowStr)
          return false
      }
      return true
    })

    // Sort
    return filtered.sort((a, b) => {
      let cmp = 0
      if (sort.key === 'dueDate') {
        cmp = a.dueDate.localeCompare(b.dueDate)
      } else if (sort.key === 'quantity') {
        cmp = a.quantity - b.quantity
      }
      return sort.direction === 'asc' ? cmp : -cmp
    })
  }, [
    searchFilteredJobs,
    statusFilter,
    dueSoonFilter,
    sort,
    todayStr,
    threeDaysFromNowStr,
  ])

  const currentFilter = useMemo(() => {
    if (statusFilter === 'delayed') return 'delayed'
    if (statusFilter === 'completed') return 'completed'
    if (dueSoonFilter) return 'dueSoon'
    return 'total'
  }, [statusFilter, dueSoonFilter])

  const handleFilterChange = (
    filter: 'total' | 'delayed' | 'dueSoon' | 'completed'
  ) => {
    if (filter === 'total') {
      setStatus(null)
      setDueSoon(false)
    } else if (filter === 'delayed') {
      setStatus('delayed')
      setDueSoon(false)
    } else if (filter === 'dueSoon') {
      setStatus(null)
      setDueSoon(true)
    } else if (filter === 'completed') {
      setStatus('completed')
      setDueSoon(false)
    }
  }

  const getEmptyStateType = () => {
    if (jobs.length === 0) return 'empty'
    if (debouncedSearch && searchFilteredJobs.length === 0) return 'search'
    return 'filter'
  }

  const filterKey = `${debouncedSearch}-${statusFilter}-${dueSoonFilter}-${sort.key}-${sort.direction}`
  const isLoading = phase === 'loading'
  const isError = phase === 'error' && jobs.length === 0

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <TopBar
        isRefreshing={isRefreshing}
        lastRefreshFailed={!!errorMessage && jobs.length > 0}
        onRefresh={load}
      />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <SummaryBoard
            metrics={metrics}
            statusCounts={tabCounts}
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
            isLoading={isLoading || isError}
          />

          <div className="mt-4 lg:mt-8">
            <JobsToolbar
              totalJobs={jobs.length}
              filteredJobsCount={visibleJobs.length}
              search={search}
              onSearchChange={setSearch}
              sort={sort}
              onSortChange={setSort}
              isFiltered={isFiltered}
              onClearFilters={clearFilters}
              dueSoon={dueSoonFilter}
              onDueSoonChange={setDueSoon}
              disabled={isLoading || isError}
            >
              <StatusTabs counts={tabCounts} totalCount={totalSearchFiltered} />
            </JobsToolbar>

            <div className="mt-4">
              {isError ? (
                <ErrorState
                  message={errorMessage || 'Something went wrong.'}
                  onRetry={load}
                />
              ) : isLoading ? (
                <>
                  <TicketSkeleton />
                  <TableSkeleton />
                </>
              ) : (
                <JobsTable
                  jobs={visibleJobs}
                  machines={machines}
                  sort={sort}
                  onSort={toggleSort}
                  selectedJobId={selectedJobId}
                  onSelectJob={(id) =>
                    handleSelectJob(id === selectedJobId ? null : id)
                  }
                  emptyStateType={getEmptyStateType()}
                  searchValue={search}
                  onClearFilters={clearFilters}
                  filterKey={filterKey}
                  flashJobId={flashJobId}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <JobDetailSheet
        job={jobs.find((j) => j.id === selectedJobId) || null}
        machine={machines.find(
          (m) => m.id === jobs.find((j) => j.id === selectedJobId)?.machineId
        )}
        onClose={() => handleSelectJob(null)}
        updateStatus={updateStatus}
        onSaveSuccess={(id) => {
          setFlashJobId(id)
          setTimeout(() => setFlashJobId(null), 1000)
        }}
        isFilteredOut={
          selectedJobId
            ? !visibleJobs.some((j) => j.id === selectedJobId)
            : false
        }
      />
    </div>
  )
}
