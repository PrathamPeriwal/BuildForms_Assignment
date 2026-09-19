export type JobStatus = 'pending' | 'in_progress' | 'delayed' | 'completed'

export type MachineState = 'running' | 'idle' | 'down'

export type Machine = {
  id: string
  name: string
  state: MachineState
}

export type JobNote = {
  id: string
  at: string // ISO datetime
  text: string
  severity: 'info' | 'issue'
}

export type Job = {
  id: string
  product: string
  customer: string
  quantity: number
  dueDate: string // 'YYYY-MM-DD'
  status: JobStatus
  machineId: string | null
  notes: JobNote[]
}
