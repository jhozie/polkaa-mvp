'use client'

import React from "react"
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, Plus, Eye, EyeOff, PanelLeftClose, PanelLeft, Clock, CheckCircle2, RotateCcw, ShieldCheck, Sparkles, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrbit, type FilterChip } from './orbit-provider'
import { 
  formatCurrency, 
  formatRelativeTime, 
  getHealthStatus,
  type Account 
} from '@/lib/mock-data'

interface AccountListProps {
  selectedAccountId: string | null
  onSelectAccount: (account: Account) => void
  onNewAccount: () => void
}

type SortOption = 'arr' | 'health' | 'activity' | 'name'

const filterChipConfig: { id: FilterChip; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Roster', icon: <Sparkles className="w-3 h-3" /> },
  { id: 'healthy', label: 'Cash Collected', icon: <CheckCircle2 className="w-3 h-3 text-success" /> },
  { id: 'at-risk', label: 'Pending Pickup', icon: <Clock className="w-3 h-3 text-warning" /> },
  { id: 'enterprise', label: 'MTN MoMo Grain Grants', icon: <Building2 className="w-3 h-3 text-primary" /> },
]

export function AccountList({ selectedAccountId, onSelectAccount, onNewAccount }: AccountListProps) {
  const { accounts, settings, sidebarCollapsed, setSidebarCollapsed, filterChip, setFilterChip } = useOrbit()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('arr')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  const filteredAndSortedAccounts = useMemo(() => {
    let filtered = [...accounts]

    // Filter out archived unless showing
    if (!showArchived) {
      filtered = filtered.filter(acc => acc.status !== 'archived')
    }

    // Apply filter chip
    switch (filterChip) {
      case 'at-risk':
        filtered = filtered.filter(acc => acc.status === 'at-risk')
        break
      case 'enterprise':
        filtered = filtered.filter(acc => acc.tier === 'enterprise')
        break
      case 'healthy':
        filtered = filtered.filter(acc => acc.status === 'active')
        break
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (acc) =>
          acc.name.toLowerCase().includes(query) ||
          acc.industry.toLowerCase().includes(query) ||
          (acc.website && acc.website.toLowerCase().includes(query)) ||
          (acc.voucherToken && acc.voucherToken.toLowerCase().includes(query))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'arr':
          return b.arr - a.arr
        case 'health':
          return b.healthScore - a.healthScore
        case 'activity':
          return b.lastActivity.getTime() - a.lastActivity.getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [accounts, searchQuery, sortBy, showArchived, filterChip])

  const archivedCount = useMemo(() => 
    accounts.filter(acc => acc.status === 'archived').length
  , [accounts])

  const sortLabels: Record<SortOption, string> = {
    arr: 'Grant Amount',
    health: 'Delivery Status',
    activity: 'Recent Pickup',
    name: 'Beneficiary Name',
  }

  // Collapsed state
  if (sidebarCollapsed) {
    return (
      <div className="w-12 h-full border-r border-border/40 bg-card/50 flex flex-col items-center py-3 gap-2">
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="p-2 rounded-md hover:bg-secondary/60 transition-colors text-muted-foreground/70 hover:text-foreground"
          title="Expand Payout Roster"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        <div className="w-6 h-[1px] bg-border/40 my-1" />
        <span className="text-[10px] text-muted-foreground/60 rotate-90 whitespace-nowrap mt-4">
          ROSTER ({accounts.length})
        </span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 340, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="w-[340px] h-full border-r border-border/40 bg-card/50 flex flex-col shrink-0 select-none"
    >
      {/* Header controls */}
      <div className="p-3.5 space-y-2.5 border-b border-border/40 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[13px] font-semibold text-foreground tracking-tight">
              Payout Roster
            </h2>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
              {filteredAndSortedAccounts.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onNewAccount}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/8 rounded-md transition-colors border border-primary/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Disburse Batch
            </button>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-1 rounded-md hover:bg-secondary/60 transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4 text-muted-foreground/70" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search farmer, withdrawal code, cluster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-secondary/40 rounded-md text-[12px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:bg-secondary/60 transition-colors border border-transparent focus:border-border/60"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1">
          {filterChipConfig.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilterChip(chip.id)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-all duration-100',
                filterChip === chip.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              {chip.icon}
              {chip.label}
            </button>
          ))}
        </div>

        {/* Sort row */}
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1 text-muted-foreground/70 hover:text-muted-foreground transition-colors"
            >
              Sort by: <span className="text-foreground/90 font-medium">{sortLabels[sortBy]}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            <AnimatePresence>
              {showSortMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowSortMenu(false)} 
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.1 }}
                    className="absolute top-full left-0 mt-1 py-1 bg-popover rounded-md shadow-lg z-20 min-w-[130px] border border-border/40"
                  >
                    {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option)
                          setShowSortMenu(false)
                        }}
                        className={cn(
                          'w-full px-3 py-1.5 text-left text-[11px] transition-colors',
                          sortBy === option
                            ? 'bg-primary/8 text-primary font-medium'
                            : 'text-foreground hover:bg-secondary/50'
                        )}
                      >
                        {sortLabels[option]}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {archivedCount > 0 && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={cn(
                'flex items-center gap-1 text-[11px] transition-colors',
                showArchived ? 'text-primary' : 'text-muted-foreground/60 hover:text-muted-foreground'
              )}
            >
              {showArchived ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {archivedCount} settled
            </button>
          )}
        </div>
      </div>

      {/* Account / Beneficiary list */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/20">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedAccounts.map((account) => {
            const isSelected = selectedAccountId === account.id
            const isCollected = account.status === 'active'
            const isPending = account.status === 'at-risk'
            const isRefunded = account.status === 'churned'
            const isArchived = account.status === 'archived'

            return (
              <motion.button
                key={account.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.1 }}
                onClick={() => onSelectAccount(account)}
                className={cn(
                  'w-full px-4 py-3 text-left transition-all duration-100 relative group cursor-pointer',
                  isSelected
                    ? 'bg-primary/5'
                    : 'hover:bg-secondary/30',
                  isArchived && 'opacity-50'
                )}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-primary rounded-r-full" />
                )}
                
                <div className="flex items-start gap-2.5">
                  {/* Status indicator dot */}
                  <div className="mt-1.5 shrink-0">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        isCollected && 'bg-success shadow-[0_0_6px_rgba(34,197,94,0.3)]',
                        isPending && 'bg-warning shadow-[0_0_6px_rgba(234,179,8,0.3)]',
                        isRefunded && 'bg-muted-foreground/60'
                      )}
                    />
                  </div>

                  {/* Beneficiary Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {account.name}
                      </h3>
                      <span className="text-[12px] font-semibold text-foreground shrink-0 tabular-nums">
                        {formatCurrency(account.arr)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-muted-foreground/70 truncate max-w-[170px]">
                        {account.website || "Northern Granary"}
                      </span>
                      <span className="text-[10px] text-muted-foreground/50">
                        {formatRelativeTime(account.lastActivity)}
                      </span>
                    </div>

                    {/* Status Pill & Voucher Token */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/20">
                      <span className="text-[10px] text-muted-foreground/60">
                        {account.voucherToken || `PK-${account.id.slice(-6).toUpperCase()}`}
                      </span>

                      {isCollected && (
                        <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-success/10 text-success border border-success/20">
                          Cash Collected
                        </span>
                      )}
                      {isPending && (
                        <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-warning/10 text-warning border border-warning/20">
                          Pending Pickup
                        </span>
                      )}
                      {isRefunded && (
                        <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-secondary text-muted-foreground border border-border/40">
                          Auto-Refunded
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>

        {filteredAndSortedAccounts.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground/60 text-[12px] mb-3">
              {searchQuery ? `No recipients found for "${searchQuery}"` : 'No payments match this filter'}
            </p>
            {!searchQuery && (
              <button
                onClick={onNewAccount}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-primary hover:bg-primary/8 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Beneficiary
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="px-4 py-3 bg-secondary/30 border-t border-border/40">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground/70">
            {filteredAndSortedAccounts.filter(a => a.status !== 'archived').length} Beneficiaries
          </span>
          <span className="text-foreground font-semibold tabular-nums">
            {formatCurrency(
              filteredAndSortedAccounts
                .filter(a => a.status !== 'archived')
                .reduce((sum, acc) => sum + acc.arr, 0)
            )}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
