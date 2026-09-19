'use client'

import { cn } from 'cn'
import { useCountUp } from '../../hooks/use-count-up'

interface MetricCellProps {
  label: string
  value: number
  subLine?: string
  isActive: boolean
  isDelayed?: boolean
  onClick: () => void
  className?: string
  isLoading?: boolean
}

export function MetricCell({
  label,
  value,
  subLine,
  isActive,
  isDelayed,
  onClick,
  className,
  isLoading,
}: MetricCellProps) {
  const displayValue = useCountUp(value)

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        'relative flex h-full w-full flex-col items-start justify-center p-4 text-left transition-colors sm:p-6',
        isDelayed && value > 0 && !isLoading
          ? 'hatch bg-s-delayed/10 text-s-delayed/20 hover:bg-s-delayed/20'
          : 'bg-paper hover:bg-sheet',
        isActive &&
          (isDelayed && value > 0 && !isLoading
            ? 'bg-s-delayed/20'
            : 'bg-sheet'),
        className
      )}
    >
      <div className="micro mb-1 text-ink lg:mb-2">{label}</div>
      <div
        className={cn(
          'font-display text-4xl sm:text-[44px] font-extrabold leading-none tabular-nums lg:text-[64px]',
          isDelayed && value > 0 && !isLoading ? 'text-s-delayed' : 'text-ink'
        )}
      >
        {isLoading ? (
          <div className="h-9 sm:h-11 lg:h-16 w-16 sm:w-20 hazard-loading animate-stripe-slide rounded-[2px]" />
        ) : (
          displayValue
        )}
      </div>
      {subLine && !isLoading && (
        <div className="mt-1 font-mono text-xs font-medium tabular-nums text-graphite">
          {subLine}
        </div>
      )}
      {isActive && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-highlighter" />
      )}
    </button>
  )
}
