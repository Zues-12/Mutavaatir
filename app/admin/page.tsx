import type { Metadata } from 'next'
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of Mutavaatir subscriptions, orders and revenue.',
  robots: { index: false, follow: false },
}

type Stat = {
  readonly label: string
  readonly value: string
  readonly delta: string
  readonly trend: 'up' | 'flat'
  readonly icon: typeof Users
}

const stats: readonly Stat[] = [
  { label: 'Active subscribers', value: '1,284', delta: '+12.4%', trend: 'up', icon: Users },
  { label: 'Books shipped (MTD)', value: '963', delta: '+8.1%', trend: 'up', icon: Package },
  { label: 'Revenue (MTD)', value: '$24,910', delta: '+5.6%', trend: 'up', icon: DollarSign },
  { label: 'Books in catalogue', value: '142', delta: '+3 new', trend: 'flat', icon: BookOpen },
] as const

type ShipmentRow = {
  readonly id: string
  readonly subscriber: string
  readonly book: string
  readonly status: 'Shipped' | 'Packing' | 'Scheduled'
  readonly date: string
}

const recentShipments: readonly ShipmentRow[] = [
  { id: 'MV-10472', subscriber: 'Ahmed Khan',     book: 'The Conference of the Birds', status: 'Shipped',   date: 'Today' },
  { id: 'MV-10471', subscriber: 'Sara Iqbal',     book: 'Letters to a Young Poet',     status: 'Packing',   date: 'Today' },
  { id: 'MV-10470', subscriber: 'Hamza Raza',     book: 'Meditations',                 status: 'Shipped',   date: 'Yesterday' },
  { id: 'MV-10469', subscriber: 'Mariam Yousaf',  book: 'The Prophet',                 status: 'Scheduled', date: 'Tomorrow' },
  { id: 'MV-10468', subscriber: 'Omar Siddiqui',  book: 'East of Eden',                status: 'Shipped',   date: '2 days ago' },
] as const

const statusToneMap: Record<ShipmentRow['status'], string> = {
  Shipped: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  Packing: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  Scheduled: 'border-brand-clay/50 bg-brand-clay/10 text-brand-mist',
}

export default function AdminDashboardPage() {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-display text-[0.7rem] font-medium uppercase tracking-[0.35em] text-brand-clay">
            Overview
          </p>
          <h1 className="font-display text-3xl font-normal leading-tight tracking-normal text-brand-mist sm:text-4xl lg:text-5xl">
            DASHBOARD
          </h1>
          <div className="h-px w-12 bg-brand-clay" aria-hidden />
          <p className="max-w-2xl text-sm leading-relaxed text-brand-dust sm:text-base">
            Track subscriptions, shipments and revenue at a glance. Numbers below
            are placeholders until the Supabase data layer is wired up.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start border border-brand-earth/60 bg-brand-void/40 px-3 py-2 text-xs text-brand-dust sm:self-auto">
          <Calendar className="h-4 w-4 text-brand-clay" aria-hidden />
          <span>{formattedDate}</span>
        </div>
      </header>

      <section aria-label="Key metrics" className="mb-12">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <li
                key={stat.label}
                className="group relative flex flex-col gap-4 border border-brand-earth/60 bg-brand-void/40 p-5 transition-colors duration-200 hover:border-brand-clay/70"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-[0.65rem] font-medium uppercase tracking-[0.25em] text-brand-earth">
                    {stat.label}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-earth/30 text-brand-clay transition-colors group-hover:bg-brand-earth/50">
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                </div>
                <p className="font-display text-3xl font-normal leading-none tracking-normal text-brand-mist">
                  {stat.value}
                </p>
                <p
                  className={cn(
                    'inline-flex items-center gap-1 text-xs',
                    stat.trend === 'up' ? 'text-emerald-300' : 'text-brand-dust',
                  )}
                >
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  )}
                  <span>{stat.delta}</span>
                  <span className="text-brand-earth">vs last month</span>
                </p>
              </li>
            )
          })}
        </ul>
      </section>

      <section
        aria-labelledby="recent-shipments-heading"
        className="border border-brand-earth/60 bg-brand-void/40"
      >
        <header className="flex flex-col gap-2 border-b border-brand-earth/60 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="font-display text-[0.65rem] font-medium uppercase tracking-[0.3em] text-brand-clay">
              Activity
            </p>
            <h2
              id="recent-shipments-heading"
              className="font-display text-xl font-normal tracking-normal text-brand-mist sm:text-2xl"
            >
              RECENT SHIPMENTS
            </h2>
          </div>
          <span className="text-xs uppercase tracking-wider text-brand-earth">
            Last 7 days
          </span>
        </header>

        <div className="scrollbar-brand overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-earth/40 text-[0.65rem] uppercase tracking-[0.2em] text-brand-earth">
                <th scope="col" className="px-5 py-3 font-medium sm:px-6">Order</th>
                <th scope="col" className="px-5 py-3 font-medium sm:px-6">Subscriber</th>
                <th scope="col" className="px-5 py-3 font-medium sm:px-6">Book</th>
                <th scope="col" className="px-5 py-3 font-medium sm:px-6">Status</th>
                <th scope="col" className="px-5 py-3 font-medium sm:px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-earth/30">
              {recentShipments.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors duration-150 hover:bg-brand-earth/10"
                >
                  <td className="px-5 py-4 font-mono text-xs text-brand-dust sm:px-6">
                    {row.id}
                  </td>
                  <td className="px-5 py-4 text-brand-mist sm:px-6">{row.subscriber}</td>
                  <td className="px-5 py-4 text-brand-dust sm:px-6">{row.book}</td>
                  <td className="px-5 py-4 sm:px-6">
                    <span
                      className={cn(
                        'inline-flex items-center border px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider',
                        statusToneMap[row.status],
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-brand-earth sm:px-6">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-10 text-xs leading-relaxed text-brand-earth">
        Placeholder data. Connect Supabase tables for subscribers, books and
        shipments to populate live values.
      </p>
    </div>
  )
}
