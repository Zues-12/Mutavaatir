'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Tab = 'order' | 'history' | 'details'

type SubscriberDetailTabsProps = {
  orderPanel: React.ReactNode
  historyPanel: React.ReactNode
  detailsPanel: React.ReactNode
  showOrderTab: boolean
  showHistoryTab: boolean
}

export default function SubscriberDetailTabs({
  orderPanel,
  historyPanel,
  detailsPanel,
  showOrderTab,
  showHistoryTab,
}: SubscriberDetailTabsProps) {
  const defaultTab: Tab = showOrderTab ? 'order' : showHistoryTab ? 'history' : 'details'
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab)

  const tabs: Array<{ id: Tab; label: string; visible: boolean }> = [
    { id: 'order', label: 'Current order', visible: showOrderTab },
    { id: 'history', label: 'History', visible: showHistoryTab },
    { id: 'details', label: 'Application', visible: true },
  ]

  return (
    <div>
      <div
        className="mb-6 flex flex-wrap gap-2 border-b border-brand-earth/40 pb-4"
        role="tablist"
        aria-label="Subscriber sections"
      >
        {tabs
          .filter((tab) => tab.visible)
          .map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'font-display border px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider transition-colors',
                activeTab === tab.id
                  ? 'border-brand-clay bg-brand-earth/20 text-brand-mist'
                  : 'border-brand-earth/60 text-brand-dust hover:border-brand-clay/70 hover:text-brand-mist',
              )}
            >
              {tab.label}
            </button>
          ))}
      </div>

      {activeTab === 'order' && showOrderTab ? orderPanel : null}
      {activeTab === 'history' && showHistoryTab ? historyPanel : null}
      {activeTab === 'details' ? detailsPanel : null}
    </div>
  )
}
