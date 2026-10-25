'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Send, ArrowDownLeft, BarChart3, Settings,
  PanelLeftClose, PanelLeftOpen, ChevronRight, Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrbit } from './orbit-provider'
import { MoneyInIcon } from './money-icons'

export type ViewType = 'dashboard' | 'payouts' | 'collections' | 'analytics' | 'settings' | 'accounts'

interface CommandDockProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

const navItems: { id: ViewType; icon: React.ComponentType<any>; label: string; badge?: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
  { id: 'payouts', icon: Send, label: 'Payouts' },
  { id: 'collections', icon: MoneyInIcon, label: 'Collections', badge: '*671#' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export function CommandDock({ activeView, onViewChange }: CommandDockProps) {
  const { sidebarCollapsed, setSidebarCollapsed } = useOrbit()
  const currentView = activeView === 'accounts' ? 'payouts' : activeView

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 220 }}
      transition={{ duration: 0.18, ease: 'easeInOut' }}
      className="hidden md:flex h-full flex-col py-4 bg-card border-r border-border/40 select-none shrink-0 z-20 overflow-hidden"
    >
      {/* Top Header: Brand & Collapse Toggle */}
      <div className={cn(
        'flex items-center px-3 mb-6',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {/* Brand Logo & Title */}
        <div
          onClick={() => onViewChange('dashboard')}
          className="flex items-center cursor-pointer group select-none"
          title="Polkaa Enterprise Suite"
        >
          {sidebarCollapsed ? (
            <img
              src="/icon-512x512.png"
              alt="Polkaa Mark"
              className="w-8 h-8 rounded-full shrink-0 shadow-xs group-hover:scale-105 transition-transform"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="flex items-center"
            >
              <img
                src="/polkaa-logo-light.png"
                alt="Polkaa Enterprise Suite"
                className="h-[30px] w-auto object-contain dark:hidden group-hover:opacity-90 transition-opacity"
              />
              <img
                src="/polkaa-logo-dark.png"
                alt="Polkaa Enterprise Suite"
                className="h-[30px] w-auto object-contain hidden dark:block group-hover:opacity-90 transition-opacity"
              />
            </motion.div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button */}
        {!sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* If Collapsed: Small Expand Button */}
      {sidebarCollapsed && (
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'relative flex items-center rounded-md transition-all duration-150 cursor-pointer group',
                sidebarCollapsed
                  ? 'w-11 h-11 justify-center mx-auto'
                  : 'w-full h-10 px-3 gap-3 justify-start',
                isActive
                  ? 'text-primary bg-primary/10 font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
              )}

              <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.2 : 1.75} />

              {/* Label & Badge when Expanded */}
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between flex-1 min-w-0"
                >
                  <span className="text-xs truncate">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-primary/15 text-primary">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              )}

              {/* Tooltip when Collapsed */}
              {sidebarCollapsed && (
                <div className="absolute left-14 px-2.5 py-1 bg-foreground text-background rounded-md text-[11px] font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl flex items-center gap-1.5">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1 py-0.2 rounded text-[9px] bg-primary text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Corporate User Profile: AgriCorp Nigeria */}
      <div className={cn(
        'pt-3 border-t border-border/40 mt-auto',
        sidebarCollapsed ? 'px-2 flex justify-center' : 'px-3'
      )}>
        <div className={cn(
          'flex items-center gap-2.5 p-1 rounded-md hover:bg-secondary/40 transition-colors cursor-pointer group',
          sidebarCollapsed && 'justify-center'
        )}>
          <div className="w-8 h-8 rounded-md bg-secondary border border-border/60 flex items-center justify-center text-[11px] font-semibold text-foreground shrink-0 group-hover:border-primary transition-colors">
            AG
          </div>

          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">AgriCorp Ltd</span>
              <span className="text-[10px] text-muted-foreground truncate">Dr. Aminu Garba</span>
            </div>
          )}

          {sidebarCollapsed && (
            <div className="absolute left-14 bottom-3 px-2.5 py-1 bg-foreground text-background rounded-md text-[11px] font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
              <p className="font-semibold text-white">AgriCorp Ltd</p>
              <p className="text-[10px] text-muted">Dr. Aminu Garba</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
