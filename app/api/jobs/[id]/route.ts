import { NextRequest, NextResponse } from 'next/server'
import { updateStatus } from '@/lib/job-store'
import type { JobStatus } from '@/lib/types'

const VALID_STATUSES: JobStatus[] = [
  'pending',
  'in_progress',
  'delayed',
  'completed',
]

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (req.nextUrl.searchParams.get('fail') === 'save') {
    return NextResponse.json(
      { error: "Couldn't save the status update" },
      { status: 500 }
    )
  }

  const { id } = await params
  const body = await req.json()
  const { status } = body as { status: unknown }

  if (!VALID_STATUSES.includes(status as JobStatus)) {
    return NextResponse.json(
      { error: `Invalid status: ${status}` },
      { status: 400 }
    )
  }

  await delay(400)

  const updated = updateStatus(id, status as JobStatus)
  if (!updated) {
    return NextResponse.json({ error: `Job ${id} not found` }, { status: 404 })
  }

  return NextResponse.json(updated)
}
