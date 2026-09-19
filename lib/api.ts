import type { Job, Machine } from './types'

type JobsResponse = { jobs: Job[]; machines: Machine[] }

function failParam(name: string): string {
  if (typeof window === 'undefined') return ''
  const val = new URLSearchParams(window.location.search).get('fail')
  return val === name ? `?fail=${name}` : ''
}

export async function fetchJobs(): Promise<JobsResponse> {
  const res = await fetch(`/api/jobs${failParam('load')}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? "Couldn't reach the job service")
  }
  return res.json()
}

export async function patchJobStatus(id: string, status: string): Promise<Job> {
  const qs = failParam('save')
  const res = await fetch(`/api/jobs/${encodeURIComponent(id)}${qs}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? "Couldn't save the status update")
  }
  return res.json()
}
