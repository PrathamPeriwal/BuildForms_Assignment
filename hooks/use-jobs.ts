import { useState, useRef, useCallback } from 'react'
import type { Job, Machine, JobStatus } from '../lib/types'
import { fetchJobs, patchJobStatus } from '../lib/api'

type Phase = 'loading' | 'ready' | 'error'

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [machines, setMachines] = useState<Machine[]>([])
  const [phase, setPhase] = useState<Phase>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const requestIdRef = useRef(0)

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current

    setErrorMessage(null)
    if (jobs.length === 0) {
      setPhase('loading')
    } else {
      setIsRefreshing(true)
    }

    try {
      const data = await fetchJobs()
      
      if (requestIdRef.current !== requestId) return

      setJobs(data.jobs)
      setMachines(data.machines)
      setPhase('ready')
      setLastSyncedAt(new Date())
    } catch (err) {
      if (requestIdRef.current !== requestId) return

      const msg = err instanceof Error ? err.message : 'Unknown error'
      setErrorMessage(msg)
      
      if (jobs.length === 0) {
        setPhase('error')
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setIsRefreshing(false)
      }
    }
  }, [jobs.length])

  const updateStatus = async (id: string, nextStatus: JobStatus) => {
    const previousJob = jobs.find((j) => j.id === id)
    if (!previousJob) return

    // Optimistic update
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === id ? { ...job, status: nextStatus } : job
      )
    )

    try {
      const updatedJob = await patchJobStatus(id, nextStatus)
      // Replace with server response on success
      setJobs((currentJobs) =>
        currentJobs.map((job) => (job.id === id ? updatedJob : job))
      )
    } catch (err) {
      // Restore snapshot on failure
      setJobs((currentJobs) =>
        currentJobs.map((job) => (job.id === id ? previousJob : job))
      )
      throw err
    }
  }

  return {
    jobs,
    machines,
    phase,
    errorMessage,
    lastSyncedAt,
    isRefreshing,
    load,
    updateStatus,
  }
}
