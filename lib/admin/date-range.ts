export type DateRangeFilter = {
  readonly from: Date
  readonly to: Date
}

const DATE_PARAM_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function formatDateParam(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateParam(value: string): Date | null {
  const match = DATE_PARAM_PATTERN.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
}

export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export function parseDateRangeFilter(
  from?: string,
  to?: string,
): DateRangeFilter | null {
  const fromDate = from ? parseDateParam(from) : null
  const toDate = to ? parseDateParam(to) : null

  if (!fromDate && !toDate) return null

  if (fromDate && toDate) {
    const start = startOfDay(fromDate)
    const end = endOfDay(toDate)
    if (start <= end) return { from: start, to: end }
    return { from: startOfDay(toDate), to: endOfDay(fromDate) }
  }

  const single = fromDate ?? toDate!
  return { from: startOfDay(single), to: endOfDay(single) }
}

export function isWithinDateRange(createdAt: Date, range: DateRangeFilter | null): boolean {
  if (!range) return true
  return createdAt >= range.from && createdAt <= range.to
}

export function formatDateRangeLabel(range: DateRangeFilter | null): string {
  if (!range) return 'All time'

  const sameDay = formatDateParam(range.from) === formatDateParam(range.to)
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  if (sameDay) return formatter.format(range.from)
  return `${formatter.format(range.from)} – ${formatter.format(range.to)}`
}
