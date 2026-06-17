'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { format, startOfMonth, subDays } from 'date-fns'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  formatDateParam,
  formatDateRangeLabel,
  parseDateRangeFilter,
} from '@/lib/admin/date-range'
import { cn } from '@/lib/utils'

type Preset = {
  label: string
  getRange: () => { from: Date; to: Date }
}

const presets: Preset[] = [
  {
    label: 'Last 7 days',
    getRange: () => ({ from: subDays(new Date(), 6), to: new Date() }),
  },
  {
    label: 'This month',
    getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }),
  },
]

function applyRange(
  pathname: string,
  searchParams: URLSearchParams,
  router: ReturnType<typeof useRouter>,
  from?: Date,
  to?: Date,
) {
  const params = new URLSearchParams(searchParams.toString())

  if (from) params.set('from', formatDateParam(from))
  else params.delete('from')

  if (to) params.set('to', formatDateParam(to))
  else params.delete('to')

  const query = params.toString()
  router.push(query ? `${pathname}?${query}` : pathname)
}

export default function DashboardDateRangePicker() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const fromParam = searchParams.get('from') ?? undefined
  const toParam = searchParams.get('to') ?? undefined

  const activeRange = useMemo(
    () => parseDateRangeFilter(fromParam, toParam),
    [fromParam, toParam],
  )

  const selectedRange: DateRange | undefined = activeRange
    ? { from: activeRange.from, to: activeRange.to }
    : undefined

  const label = formatDateRangeLabel(activeRange)

  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from) return
    if (range.to) {
      applyRange(pathname, searchParams, router, range.from, range.to)
      setOpen(false)
    }
  }

  const handlePreset = (preset: Preset) => {
    const { from, to } = preset.getRange()
    applyRange(pathname, searchParams, router, from, to)
    setOpen(false)
  }

  const handleClear = () => {
    applyRange(pathname, searchParams, router)
    setOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className="inline-flex items-center gap-2 border border-brand-earth/60 bg-brand-void/40 px-3 py-2 text-xs text-brand-dust transition-colors hover:border-brand-clay hover:text-brand-mist"
        >
          <CalendarIcon className="h-4 w-4 text-brand-clay" aria-hidden />
          <span>{label}</span>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-auto border-brand-earth/60 bg-brand-void p-0 text-brand-mist"
        >
          <div className="flex flex-col gap-3 border-b border-brand-earth/60 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-[0.65rem] font-medium uppercase tracking-[0.25em] text-brand-earth">
              Select date range
            </p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className="font-display border border-brand-earth/60 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-brand-dust transition-colors hover:border-brand-clay hover:text-brand-mist"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <Calendar
            mode="range"
            numberOfMonths={2}
            defaultMonth={selectedRange?.from ?? new Date()}
            selected={selectedRange}
            onSelect={handleSelect}
            disabled={{ after: new Date() }}
            className="bg-brand-void text-brand-mist"
            classNames={{
              months: 'flex flex-col gap-4 sm:flex-row',
              month: 'flex flex-col gap-4',
              caption_label: 'text-brand-mist',
              weekday: 'text-brand-earth text-[0.7rem]',
              outside: 'text-brand-earth/40',
              disabled: 'text-brand-earth/30',
            }}
          />
          {activeRange ? (
            <div className="border-t border-brand-earth/60 p-3">
              <p className="mb-2 text-xs text-brand-dust">
                {format(activeRange.from, 'MMM d, yyyy')} –{' '}
                {format(activeRange.to, 'MMM d, yyyy')}
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-xs text-brand-clay transition-colors hover:text-brand-mist"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Clear range
              </button>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>

      {activeRange ? (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'inline-flex items-center gap-1 text-xs text-brand-earth transition-colors hover:text-brand-mist',
          )}
          aria-label="Clear date range"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
          Clear
        </button>
      ) : null}
    </div>
  )
}
