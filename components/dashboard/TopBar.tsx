'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from 'cn'

interface TopBarProps {
  isRefreshing: boolean
  lastRefreshFailed?: boolean
  onRefresh: () => void
}

export function TopBar({
  isRefreshing,
  lastRefreshFailed,
  onRefresh,
}: TopBarProps) {
  const [timeStr, setTimeStr] = useState('')
  const [syncStr, setSyncStr] = useState('Synced 0s ago')
  const [lastSyncTime, setLastSyncTime] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setMounted(true)
      setLastSyncTime(Date.now())
    }, 0)

    const updateTime = () => {
      const d = new Date()
      const h = d.getHours()
      const m = d.getMinutes().toString().padStart(2, '0')
      let shift = 'C'
      if (h >= 6 && h < 14) shift = 'A'
      else if (h >= 14 && h < 22) shift = 'B'

      setTimeStr(`SHIFT ${shift} · ${h.toString().padStart(2, '0')}:${m}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (mounted && !isRefreshing && !lastRefreshFailed) {
      setTimeout(() => {
        setLastSyncTime(Date.now())
        setSyncStr('Synced 0s ago')
      }, 0)
    }
  }, [isRefreshing, lastRefreshFailed, mounted])

  useEffect(() => {
    if (!mounted || !lastSyncTime) return
    const updateSync = () => {
      const diff = Math.floor((Date.now() - lastSyncTime) / 1000)
      if (diff < 60) {
        setSyncStr(`Synced ${diff}s ago`)
      } else {
        const mins = Math.floor(diff / 60)
        setSyncStr(`Synced ${mins}m ago`)
      }
    }

    updateSync()
    const interval = setInterval(updateSync, 10000)
    return () => clearInterval(interval)
  }, [lastSyncTime, mounted])

  return (
    <header className="flex h-14 items-center justify-between border-b border-rule bg-paper px-4 lg:px-8">
      <div className="flex items-center gap-2 lg:gap-3 overflow-hidden pr-2">
        <div className="h-4 w-4 border border-ink hazard shrink-0" />
        <h1 className="font-display text-lg sm:text-xl font-extrabold uppercase tracking-tight text-ink lg:text-2xl truncate">
          Production Control
        </h1>
        <span className="sr-only">Production Control Dashboard</span>
      </div>

      <div className="flex items-center gap-4 lg:gap-8">
        {mounted && (
          <div className="hidden font-mono text-sm font-medium tabular-nums text-graphite lg:block">
            {timeStr}
          </div>
        )}

        <div className="flex items-center gap-3">
          {mounted && (
            <div
              className={cn(
                'font-mono text-xs sm:text-sm font-medium tabular-nums leading-tight text-right',
                lastRefreshFailed ? 'text-s-delayed' : 'text-graphite'
              )}
            >
              {lastRefreshFailed ? 'Sync failed. Retry' : syncStr}
            </div>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex h-10 w-10 items-center justify-center rounded-sm text-ink transition-colors hover:bg-sheet focus-visible:bg-sheet disabled:opacity-50"
            aria-label="Refresh data"
          >
            <RefreshCw
              className={cn('h-4 w-4', isRefreshing && 'animate-spin')}
            />
          </button>
        </div>
      </div>
    </header>
  )
}
