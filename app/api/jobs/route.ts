import { NextRequest, NextResponse } from 'next/server'
import { getAll } from '@/lib/job-store'

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('fail') === 'load') {
    return NextResponse.json(
      { error: "Couldn't reach the job service" },
      { status: 500 }
    )
  }

  await delay(700)
  return NextResponse.json(getAll())
}
