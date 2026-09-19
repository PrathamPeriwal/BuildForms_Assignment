function parseLocal(dueDate: string): Date {
  const [y, m, d] = dueDate.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function localMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function daysUntil(dueDate: string, today = new Date()): number {
  const due = parseLocal(dueDate).getTime()
  const base = localMidnight(today).getTime()
  return Math.round((due - base) / 86_400_000)
}

export function dueHint(dueDate: string, today = new Date()): string {
  const d = daysUntil(dueDate, today)
  if (d === 0) return 'today'
  if (d > 0) return `in ${d}d`
  return `${Math.abs(d)}d late`
}

export function formatDue(dueDate: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(parseLocal(dueDate))
}

export function formatStamp(iso: string): string {
  const d = new Date(iso)
  const date = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(d)
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
  return `${date} · ${time}`
}

export function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 10) return 'just now'
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
