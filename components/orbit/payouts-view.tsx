'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Plus, UploadCloud, FileText, CheckCircle2, Clock, 
  RotateCcw, Smartphone, ShieldCheck, Download, ChevronRight, X,
  Building2, MapPin, Send, ArrowUpRight, Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrbit } from './orbit-provider'
import { useToastActions } from './toast-provider'
import { formatCurrency, formatRelativeTime, type Account } from '@/lib/mock-data'
import { FintechPagination } from './fintech-pagination'

interface PayoutsViewProps {
  onNewPayout: () => void
  onBulkImport: () => void
}

type PayoutFilter = 'all' | 'direct_wallet' | 'cash_voucher' | 'pending' | 'refunded'

export function PayoutsView({ onNewPayout, onBulkImport }: PayoutsViewProps) {
  const { accounts, getContactsForAccount, getActivitiesForAccount, updateAccount } = useOrbit()
  const toast = useToastActions()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<PayoutFilter>('all')
  const [selectedPayout, setSelectedPayout] = useState<Account | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Reset to page 1 upon filter or search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilter])

  // Filtered accounts
  const filteredPayouts = useMemo(() => {
    let list = accounts.filter(a => a.status !== 'archived')

    if (activeFilter === 'direct_wallet') {
      list = list.filter(a => a.payoutType === 'direct_wallet' || (!a.voucherToken?.includes('PK-') && a.status === 'active'))
    } else if (activeFilter === 'cash_voucher') {
      list = list.filter(a => a.payoutType === 'cash_voucher' || a.voucherToken?.startsWith('PK-'))
    } else if (activeFilter === 'pending') {
      list = list.filter(a => a.status === 'at-risk')
    } else if (activeFilter === 'refunded') {
      list = list.filter(a => a.status === 'churned')
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          (a.website && a.website.toLowerCase().includes(q)) ||
          (a.voucherToken && a.voucherToken.toLowerCase().includes(q))
      )
    }

    return list
  }, [accounts, activeFilter, searchQuery])

  // Paginated slice for current page
  const paginatedPayouts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredPayouts.slice(start, start + pageSize)
  }, [filteredPayouts, currentPage, pageSize])

  // Key metrics
  const totalAmount = useMemo(() => accounts.filter(a => a.status !== 'archived').reduce((acc, c) => acc + c.arr, 0), [accounts])
  const settledAmount = useMemo(() => accounts.filter(a => a.status === 'active').reduce((acc, c) => acc + c.arr, 0), [accounts])
  const pendingAmount = useMemo(() => accounts.filter(a => a.status === 'at-risk').reduce((acc, c) => acc + c.arr, 0), [accounts])
  const refundedAmount = useMemo(() => accounts.filter(a => a.status === 'churned').reduce((acc, c) => acc + c.arr, 0), [accounts])

  const handleDownloadReceipt = (payout: Account) => {
    toast.success(`Transaction Receipt #PK-RCP-${payout.id.slice(-4).toUpperCase()} downloaded`)
  }

  const handleManualSweep = (payout: Account) => {
    updateAccount(payout.id, { status: 'churned' })
    toast.info(`₦${payout.arr.toLocaleString('en-NG')} swept back to corporate balance`)
    if (selectedPayout?.id === payout.id) {
      setSelectedPayout(prev => prev ? { ...prev, status: 'churned' } : null)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto md:overflow-hidden bg-background">
      {/* Top Header & Metrics Bar */}
      <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border/40 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                Disbursements & Payouts
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 shrink-0">
                MTN MoMo PSB
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send money directly to phone numbers or generate SMS withdrawal codes for cash collection at any nearby agent
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 w-full sm:w-auto">
            <button
              onClick={onBulkImport}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 text-xs font-medium text-foreground bg-card border border-border/60 rounded-md hover:bg-secondary/40 active:bg-secondary/60 shadow-sm transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
            >
              <UploadCloud className="w-4 h-4 text-primary shrink-0" />
              <span>Bulk CSV</span>
            </button>
            <button
              onClick={onNewPayout}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 active:bg-primary/80 rounded-md shadow-sm transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>New Payout</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="p-3 sm:p-3.5 bg-card rounded-md border border-border/40 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-0.5 sm:mb-1">
              Money Sent
            </span>
            <span className="text-base sm:text-xl font-semibold text-foreground tabular-nums block">
              {formatCurrency(totalAmount)}
            </span>
            <span className="text-[10px] text-muted-foreground/70 block mt-0.5">
              {accounts.filter(a => a.status !== 'archived').length} Dispatched
            </span>
          </div>

          <div className="p-3 sm:p-3.5 bg-card rounded-md border border-border/40 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-0.5 sm:mb-1">
              Collected
            </span>
            <span className="text-base sm:text-xl font-semibold text-success tabular-nums block">
              {formatCurrency(settledAmount)}
            </span>
            <span className="text-[10px] text-success/80 block mt-0.5">
              100% Cash in Hand
            </span>
          </div>

          <div className="p-3 sm:p-3.5 bg-card rounded-md border border-border/40 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-0.5 sm:mb-1">
              Awaiting Cashout
            </span>
            <span className="text-base sm:text-xl font-semibold text-warning tabular-nums block">
              {formatCurrency(pendingAmount)}
            </span>
            <span className="text-[10px] text-warning/80 block mt-0.5">
              Active at Agents
            </span>
          </div>

          <div className="p-3 sm:p-3.5 bg-card rounded-md border border-border/40 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-0.5 sm:mb-1">
              Returned
            </span>
            <span className="text-base sm:text-xl font-semibold text-muted-foreground tabular-nums block">
              {formatCurrency(refundedAmount)}
            </span>
            <span className="text-[10px] text-muted-foreground/70 block mt-0.5">
              Reversed to Balance
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 bg-card/40">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap min-h-[36px] sm:min-h-0 flex items-center',
              activeFilter === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            )}
          >
            All ({accounts.filter(a => a.status !== 'archived').length})
          </button>
          <button
            onClick={() => setActiveFilter('direct_wallet')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap min-h-[36px] sm:min-h-0',
              activeFilter === 'direct_wallet'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            )}
          >
            <Smartphone className="w-3 h-3" />
            Direct to Phone
          </button>
          <button
            onClick={() => setActiveFilter('cash_voucher')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap min-h-[36px] sm:min-h-0',
              activeFilter === 'cash_voucher'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            )}
          >
            <Clock className="w-3 h-3" />
            Withdrawal Codes
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer text-warning whitespace-nowrap min-h-[36px] sm:min-h-0 flex items-center',
              activeFilter === 'pending'
                ? 'bg-warning/20 border border-warning/40 font-semibold'
                : 'hover:bg-warning/10'
            )}
          >
            Awaiting Cashout
          </button>
          <button
            onClick={() => setActiveFilter('refunded')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer text-muted-foreground whitespace-nowrap min-h-[36px] sm:min-h-0 flex items-center',
              activeFilter === 'refunded'
                ? 'bg-secondary border border-border/60 text-foreground font-semibold'
                : 'hover:bg-secondary/60'
            )}
          >
            Returned to Balance
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipient, phone, code..."
            className="w-full h-9 sm:h-8 pl-8 pr-3 text-base sm:text-xs bg-secondary/40 border border-border/60 rounded-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Payouts Content: Desktop Table & Mobile Stacked Cards */}
      <div className="flex-1 md:overflow-y-auto pb-6">
        {/* Desktop Table (Hidden on Mobile) */}
        <div className="hidden md:block">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-secondary/30 sticky top-0 border-b border-border/40 text-muted-foreground z-10">
              <tr>
                <th className="py-2.5 px-6 font-medium">Recipient Name</th>
                <th className="py-2.5 px-4 font-medium">Phone Number</th>
                <th className="py-2.5 px-4 font-medium">Payment Method</th>
                <th className="py-2.5 px-4 font-medium">Location / Cluster</th>
                <th className="py-2.5 px-4 font-medium text-right">Amount (₦)</th>
                <th className="py-2.5 px-4 font-medium text-center">Status</th>
                <th className="py-2.5 px-4 font-medium">Batch & Time</th>
                <th className="py-2.5 px-6 font-medium text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {paginatedPayouts.map((payout) => {
                const contacts = getContactsForAccount(payout.id)
                const primaryContact = contacts[0]
                const isCollected = payout.status === 'active'
                const isPending = payout.status === 'at-risk'
                const isRefunded = payout.status === 'churned'
                const isVoucher = payout.payoutType === 'cash_voucher' || payout.voucherToken?.startsWith('PK-')

                return (
                  <tr 
                    key={payout.id}
                    onClick={() => setSelectedPayout(payout)}
                    className="hover:bg-secondary/30 transition-colors cursor-pointer group"
                  >
                    {/* Recipient Name */}
                    <td className="py-3 px-6">
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {payout.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground/70">
                        {primaryContact?.nationalId || 'NIN Verified'}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 text-foreground">
                      {primaryContact?.phone || '+234 803 412 8901'}
                    </td>

                    {/* Payout Method */}
                    <td className="py-3 px-4">
                      {isVoucher ? (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                            <Clock className="w-3 h-3" />
                            Cash at Agent
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            Code: {payout.voucherToken || `PK-${payout.id.slice(-6).toUpperCase()}`}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
                          <Smartphone className="w-3 h-3" />
                          Direct to Phone
                        </span>
                      )}
                    </td>

                    {/* Cluster Hub */}
                    <td className="py-3 px-4 text-muted-foreground/80 truncate max-w-[180px]">
                      {payout.website || 'Northern Granary'}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 font-semibold text-right text-foreground tabular-nums">
                      {formatCurrency(payout.arr)}
                    </td>

                    {/* Delivery Status */}
                    <td className="py-3 px-4 text-center">
                      {isCollected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-success/10 text-success border border-success/20">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {isVoucher ? 'Cash Collected' : 'Wallet Credited'}
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-warning/10 text-warning border border-warning/20">
                          <Clock className="w-2.5 h-2.5" />
                          Awaiting Cashout (48h)
                        </span>
                      )}
                      {isRefunded && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-muted-foreground border border-border/40">
                          <RotateCcw className="w-2.5 h-2.5" />
                          Returned to Balance
                        </span>
                      )}
                    </td>

                    {/* Time & Batch */}
                    <td className="py-3 px-4 text-muted-foreground/70 text-[11px]">
                      <div>{formatRelativeTime(payout.lastActivity)}</div>
                      <div className="text-[10px] opacity-70">
                        {payout.disbursementBatch || 'BATCH-2026-WET-01'}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-6 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadReceipt(payout)
                        }}
                        className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        title="Download Transaction Receipt (PDF)"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card List (Visible on <md screens) */}
        <div className="block md:hidden divide-y divide-border/20">
          {paginatedPayouts.map((payout) => {
            const contacts = getContactsForAccount(payout.id)
            const primaryContact = contacts[0]
            const isCollected = payout.status === 'active'
            const isPending = payout.status === 'at-risk'
            const isRefunded = payout.status === 'churned'
            const isVoucher = payout.payoutType === 'cash_voucher' || payout.voucherToken?.startsWith('PK-')

            return (
              <div
                key={payout.id}
                onClick={() => setSelectedPayout(payout)}
                className="p-4 space-y-2.5 hover:bg-secondary/30 active:bg-secondary/50 transition-colors cursor-pointer"
              >
                {/* Row 1: Name and Amount */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {payout.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      {primaryContact?.phone || '+234 803 412 8901'} • {primaryContact?.nationalId || 'NIN Verified'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-foreground tabular-nums block">
                      {formatCurrency(payout.arr)}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      {formatRelativeTime(payout.lastActivity)}
                    </span>
                  </div>
                </div>

                {/* Row 2: Method Pill & Status Badge */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isVoucher ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                        <Clock className="w-3 h-3" />
                        Code: {payout.voucherToken || `PK-${payout.id.slice(-6).toUpperCase()}`}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-success/10 text-success border border-success/20">
                        <Smartphone className="w-3 h-3" />
                        Direct to Phone
                      </span>
                    )}

                    <span className="text-[10px] text-muted-foreground/70 truncate max-w-[120px]">
                      {payout.website || 'Northern Granary'}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isCollected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-success/10 text-success border border-success/20">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Delivered
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-warning/10 text-warning border border-warning/20">
                        <Clock className="w-2.5 h-2.5" />
                        Pending
                      </span>
                    )}
                    {isRefunded && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-muted-foreground border border-border/40">
                        <RotateCcw className="w-2.5 h-2.5" />
                        Reversed
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Enterprise Pagination Bar */}
        <FintechPagination
          totalItems={filteredPayouts.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemName="disbursements"
        />

        {filteredPayouts.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground text-xs mb-3">
              No disbursement records match this filter
            </p>
            <button
              onClick={onNewPayout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/15 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Disburse New Payout
            </button>
          </div>
        )}
      </div>

      {/* Slide-Over / Bottom-Sheet Payout Details Drawer */}
      <AnimatePresence>
        {selectedPayout && (
          <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
              onClick={() => setSelectedPayout(null)}
            />

            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full md:max-w-md bg-card border-t md:border-t-0 md:border-l border-border/60 shadow-2xl rounded-t-2xl md:rounded-none max-h-[88vh] md:max-h-full h-auto md:h-full flex flex-col z-10"
            >
              {/* Drag Handle Indicator for Mobile */}
              <div className="pt-2 pb-1 md:hidden flex justify-center shrink-0">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              {/* Drawer Header */}
              <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-border/40 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Payout Receipt & Audit Details
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    MTN MoMo PSB Reference: PK-RCP-{selectedPayout.id.slice(-4).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPayout(null)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1 text-xs">
                {/* Face Value Card */}
                <div className="p-3.5 sm:p-4 bg-secondary/30 rounded-md border border-border/40 text-center">
                  <span className="text-[10px] uppercase text-muted-foreground/80 tracking-wider block mb-1">
                    Face Value Amount
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums block">
                    {formatCurrency(selectedPayout.arr)}
                  </span>
                  <span className="text-[10px] text-success font-medium block mt-1">
                    Zero Deductions • 100% Cash Guarantee
                  </span>
                </div>

                {/* Recipient Details */}
                <div className="space-y-2 border-t border-border/40 pt-3.5">
                  <h4 className="font-semibold text-foreground text-xs">Recipient Profile</h4>
                  <div className="flex justify-between py-1 border-b border-border/20">
                    <span className="text-muted-foreground">Full Name:</span>
                    <span className="font-medium text-foreground">{selectedPayout.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/20">
                    <span className="text-muted-foreground">Phone (MSISDN):</span>
                    <span className="text-foreground tabular-nums">
                      {getContactsForAccount(selectedPayout.id)[0]?.phone || '+234 803 412 8901'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/20">
                    <span className="text-muted-foreground">Cluster / Hub:</span>
                    <span className="text-foreground">{selectedPayout.website || 'Kano Cluster'}</span>
                  </div>
                </div>

                {/* SMS Code & Agent Redemption (If Cashout Code) */}
                {(selectedPayout.payoutType === 'cash_voucher' || selectedPayout.voucherToken?.startsWith('PK-')) && (
                  <div className="p-3.5 sm:p-4 bg-primary/5 border border-primary/20 rounded-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        SMS Withdrawal Code
                      </span>
                      <span className="text-[10px] text-muted-foreground">Dial *671# at any agent</span>
                    </div>
                    <div className="p-2 bg-card rounded border border-border/40 text-center">
                      <span className="text-xl font-bold text-primary tracking-widest tabular-nums">
                        {selectedPayout.voucherToken || `PK-${selectedPayout.id.slice(-6).toUpperCase()}`}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Agent Pickup Point: <strong>{selectedPayout.verifiedCashPoint || 'MTN MoMo Agent Point #9842 (Kano Sabon Gari)'}</strong>
                    </p>
                  </div>
                )}

                {/* Two-Person Approval Signatures */}
                <div className="space-y-2 border-t border-border/40 pt-3.5">
                  <h4 className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    Two-Person Approval (PIN Verified)
                  </h4>
                  <div className="p-2.5 bg-secondary/30 rounded border border-border/40 space-y-1.5 text-[11px]">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Payment Prepared By:</span>
                      <span className="font-medium text-foreground">
                        {selectedPayout.signedByMaker || 'Hajiya Fatima Bello (Operations)'}
                      </span>
                    </div>
                    <div className="border-t border-border/20 pt-1.5">
                      <span className="text-muted-foreground block text-[10px]">Approved By (PIN):</span>
                      <span className="font-medium text-foreground">
                        {selectedPayout.signedByChecker || 'Dr. Aminu Garba (Finance Director)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline / Activity */}
                <div className="space-y-2 border-t border-border/40 pt-3.5">
                  <h4 className="font-semibold text-foreground text-xs">Activity Log</h4>
                  <div className="space-y-2">
                    {getActivitiesForAccount(selectedPayout.id).map((event) => (
                      <div key={event.id} className="p-2 bg-secondary/20 rounded border border-border/20 text-[11px]">
                        <div className="flex items-center justify-between font-medium text-foreground">
                          <span>{event.title}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatRelativeTime(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-border/40 flex items-center justify-between gap-2 bg-card shrink-0">
                {selectedPayout.status === 'at-risk' && (
                  <button
                    onClick={() => handleManualSweep(selectedPayout)}
                    className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/50 rounded-md transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
                  >
                    Cancel & Return
                  </button>
                )}

                <button
                  onClick={() => handleDownloadReceipt(selectedPayout)}
                  className="ml-auto px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 active:bg-primary/80 rounded-md shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] sm:min-h-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
