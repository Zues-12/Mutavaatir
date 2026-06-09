'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { OriginButton, originCircleColors } from '@/components/origin-button'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-white focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs dark:bg-input/30 dark:border-input',
        secondary: 'bg-secondary text-secondary-foreground',
        ghost: 'bg-transparent',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const variantCircleColors: Record<
  NonNullable<VariantProps<typeof buttonVariants>['variant']>,
  string
> = {
  default: 'oklch(0.35 0 0)',
  destructive: 'oklch(0.45 0.2 27)',
  outline: 'oklch(0.97 0 0)',
  secondary: 'oklch(0.92 0 0)',
  ghost: 'oklch(0.97 0 0)',
  link: 'transparent',
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  circleColor,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    circleColor?: string
  }) {
  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }

  const resolvedCircleColor =
    circleColor ??
    (variant ? variantCircleColors[variant] : variantCircleColors.default)

  return (
    <OriginButton
      data-slot="button"
      circleColor={resolvedCircleColor}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants, originCircleColors }
