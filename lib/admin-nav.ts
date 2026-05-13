import type { LucideIcon } from 'lucide-react'
import { BookOpen, LayoutDashboard, Package, Settings, Users } from 'lucide-react'

export type AdminNavItem = {
  readonly href: string
  readonly label: string
  readonly icon: LucideIcon
}

export const adminNavItems: readonly AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Users },
  { href: '/admin/books', label: 'Books', icon: BookOpen },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
] as const
