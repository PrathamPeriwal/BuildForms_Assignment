'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Slot } from 'radix-ui'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-none border text-sm font-medium whitespace-nowrap transition-colors select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 active:translate-y-px',
  {
    variants: {
      variant: {
        // solid: ink bg, paper text
        default:
          'border-ink bg-ink text-paper hover:bg-highlighter hover:text-ink hover:border-highlighter',
        // outline: 1px ink border, transparent bg
        outline:
          'border-ink bg-transparent text-ink hover:bg-highlighter hover:border-highlighter',
        // ghost: no border, subtle hover
        ghost:
          'border-transparent bg-transparent text-ink hover:bg-highlighter hover:text-ink',
        destructive:
          'border-s-delayed bg-s-delayed text-paper hover:bg-highlighter hover:text-ink hover:border-highlighter',
      },
      size: {
        default: 'h-8 gap-1.5 px-3',
        sm: 'h-7 gap-1 px-2.5 text-xs',
        lg: 'h-9 gap-1.5 px-4',
        icon: 'size-8',
        'icon-sm': 'size-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
