import { buildJobs, machines } from './mock-jobs'
import type { Job, JobStatus, Machine } from './types'

// On serverless each cold start gets a fresh store; updates don't persist across instances.
let jobs: Job[] | null = null

function init(): Job[] {
  if (!jobs) jobs = buildJobs(new Date())
  return jobs
}

export function getAll(): { jobs: Job[]; machines: Machine[] } {
  return { jobs: init(), machines }
}

export function updateStatus(id: string, status: JobStatus): Job | null {
  const store = init()
  const idx = store.findIndex((j) => j.id === id)
  if (idx === -1) return null
  store[idx] = { ...store[idx], status }
  return store[idx]
}
