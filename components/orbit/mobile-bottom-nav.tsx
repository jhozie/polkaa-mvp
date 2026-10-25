'use client'

import React from 'react'
import {
  LayoutDashboard,
  Send,
  ArrowDownLeft,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewType } from './command-dock'
import { MoneyInIcon } from './money-icons'

interface MobileBottomNavProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

const navItems = [
  { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Overview' },
  { id: 'payouts' as ViewType, icon: Send, label: 'Payouts' },
  { id: 'collections' as ViewType, icon: MoneyInIcon, label: 'Collections', badge: '*671#' },
  { id: 'analytics' as ViewType, icon: BarChart3, label: 'Reports' },
  { id: 'settings' as ViewType, icon: Settings, label: 'Settings' },
]

export function MobileBottomNav({ activeView, onViewChange }: MobileBottomNavProps) {
  const currentView = activeView === 'accounts' ? 'payouts' : activeView

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/50 h-16 flex items-center justify-around px-2 pb-safe md:hidden select-none shadow-[0_-4px_16px_rgba(0,0,0,0.03)]"
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = currentView === item.id

        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              'relative flex flex-col items-center justify-center min-w-[54px] min-h-[48px] py-1 px-1 rounded-lg transition-colors cursor-pointer group',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground/70 hover:text-foreground'
            )}
          >
            {/* Active Pill Glow */}
            {isActive && (
              <span className="absolute -top-1 w-8 h-0.5 rounded-full bg-primary" />
            )}

            <div className="relative">
              <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-105')} />
              {item.badge && (
                <span className="absolute -top-1 -right-4 px-1 py-0.2 rounded-full text-[8px] font-bold bg-primary text-white tabular-nums">
                  {item.badge}
                </span>
              )}
            </div>

            <span className={cn(
              'text-[10px] mt-1 font-medium tracking-tight',
              isActive ? 'font-semibold text-primary' : 'text-muted-foreground'
            )}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default MobileBottomNav
