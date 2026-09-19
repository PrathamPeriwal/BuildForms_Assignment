import { useState } from 'react'
import type { JobStatus } from '../lib/types'
import { useDebouncedValue } from './use-debounced-value'

export type SortKey = 'dueDate' | 'quantity'
export type SortDirection = 'asc' | 'desc'
export type Sort = { key: SortKey; direction: SortDirection }

export type JobFilters = {
  search: string
  status: JobStatus | null
  dueSoon: boolean
  sort: Sort
}

export function useJobFilters() {
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    status: null,
    dueSoon: false,
    sort: { key: 'dueDate', direction: 'asc' },
  })

  const debouncedSearch = useDebouncedValue(filters.search, 150)

  const isFiltered = filters.search !== '' || filters.status !== null || filters.dueSoon

  const setSearch = (search: string) => setFilters((f) => ({ ...f, search }))
  const setStatus = (status: JobStatus | null) => setFilters((f) => ({ ...f, status }))
  const setDueSoon = (dueSoon: boolean) => setFilters((f) => ({ ...f, dueSoon }))

  const toggleSort = (key: SortKey) => {
    setFilters((f) => {
      if (f.sort.key === key) {
        return {
          ...f,
          sort: { key, direction: f.sort.direction === 'asc' ? 'desc' : 'asc' },
        }
      }
      return {
        ...f,
        sort: { key, direction: key === 'dueDate' ? 'asc' : 'desc' },
      }
    })
  }

  const clearFilters = () => {
    setFilters((f) => ({
      ...f,
      search: '',
      status: null,
      dueSoon: false,
    }))
  }

  const setSort = (sort: Sort) => setFilters((f) => ({ ...f, sort }))

  return {
    ...filters,
    debouncedSearch,
    isFiltered,
    setSearch,
    setStatus,
    setDueSoon,
    toggleSort,
    setSort,
    clearFilters,
  }
}
