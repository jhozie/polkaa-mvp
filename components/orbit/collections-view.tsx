'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { 
  ArrowDownLeft, Smartphone, QrCode, RefreshCw, Download, 
  Search, CheckCircle2, Building2, Landmark, Copy, Check, ArrowRight, X, FileText, ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useOrbit } from './orbit-provider'
import { useToastActions } from './toast-provider'
import { formatCurrency, formatRelativeTime, type CollectionTransaction } from '@/lib/mock-data'
import { FintechPagination } from './fintech-pagination'
import { MoneyInIcon } from './money-icons'

export function CollectionsView() {
  const { collections } = useOrbit()
  const toast = useToastActions()

  const [searchQuery, setSearchQuery] = useState('')
  const [channelFilter, setChannelFilter] = useState<'all' | 'ussd' | 'wallet' | 'qr'>('all')
  const [copiedUSSD, setCopiedUSSD] = useState(false)
  const [isLiquidating, setIsLiquidating] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<CollectionTransaction | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Reset to page 1 upon filter or search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, channelFilter])

  // Filtered collections
  const filteredCollections = useMemo(() => {
    let list = [...collections]

    if (channelFilter === 'ussd') {
      list = list.filter(c => c.channel.includes('USSD'))
    } else if (channelFilter === 'wallet') {
      list = list.filter(c => c.channel.includes('Wallet'))
    } else if (channelFilter === 'qr') {
      list = list.filter(c => c.channel.includes('QR'))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        c =>
          c.payerName.toLowerCase().includes(q) ||
          c.payerPhone.toLowerCase().includes(q) ||
          c.reference.toLowerCase().includes(q)
      )
    }

    return list
  }, [collections, channelFilter, searchQuery])

  // Paginated slice for current page
  const paginatedCollections = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredCollections.slice(start, start + pageSize)
  }, [filteredCollections, currentPage, pageSize])

  // Aggregate sums
  const totalGross = useMemo(() => collections.reduce((sum, c) => sum + c.amount, 0), [collections])
  const totalNet = useMemo(() => collections.reduce((sum, c) => sum + c.netAmount, 0), [collections])
  const totalFees = useMemo(() => collections.reduce((sum, c) => sum + c.fee, 0), [collections])

  const handleCopyUSSD = () => {
    navigator.clipboard.writeText('*671*44#')
    setCopiedUSSD(true)
    toast.success('USSD string *671*44# copied to clipboard')
    setTimeout(() => setCopiedUSSD(false), 2000)
  }

  const handleTransferToFloat = () => {
    toast.success('₦14,775,000.00 transferred from Collections into Company Wallet')
  }

  const handleLiquidateToBank = async () => {
    setIsLiquidating(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLiquidating(false)
    toast.success('₦23,098,250.00 sent to Zenith Bank (Account: 1014829104)')
  }

  const handleDownloadReceipt = (col: CollectionTransaction) => {
    toast.success(`Payment receipt #${col.reference} downloaded`)
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto md:overflow-hidden bg-background relative">
      {/* Header & Metrics */}
      <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border/40 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                Money Received (Collections)
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 shrink-0">
                MTN MoMo Business
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Receive customer payments from outgrowers, buyers, and distributors via USSD *671#, MoMo Wallets, and QR
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleTransferToFloat}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 text-xs font-medium text-foreground bg-card border border-border/60 rounded-md hover:bg-secondary/40 active:bg-secondary/60 shadow-sm transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
            >
              <RefreshCw className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">Move to Wallet</span>
            </button>
            <button
              onClick={handleLiquidateToBank}
              disabled={isLiquidating}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 active:bg-primary/80 rounded-md shadow-sm transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
            >
              <Landmark className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{isLiquidating ? 'Sending...' : 'Send to Bank'}</span>
            </button>
          </div>
        </div>

        {/* Dedicated Channel Banner */}
        <div className="p-3.5 sm:p-4 bg-secondary/30 rounded-md border border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* USSD Channel */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase text-muted-foreground block">
                Company USSD Code
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-bold text-foreground tabular-nums">*671*44#</span>
                <button
                  onClick={handleCopyUSSD}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title="Copy USSD Code"
                >
                  {copiedUSSD ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Merchant ID */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-muted-foreground shrink-0 border border-border/40">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase text-muted-foreground block">
                MoMo Merchant ID
              </span>
              <span className="text-xs sm:text-sm font-semibold text-foreground mt-0.5 block tabular-nums truncate">
                MOMO-MERCHANT-849201
              </span>
            </div>
          </div>

          {/* Bank Account for Received Money */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-muted-foreground shrink-0 border border-border/40">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase text-muted-foreground block">
                Bank for Received Money
              </span>
              <span className="text-xs font-semibold text-foreground block mt-0.5 tabular-nums truncate">
                Zenith Bank • 1014829104
              </span>
            </div>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="p-3 sm:p-3.5 bg-card rounded-md border border-border/40 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-0.5 sm:mb-1">
              Money Received
            </span>
            <span className="text-base sm:text-xl font-semibold text-foreground tabular-nums block">
              {formatCurrency(totalGross)}
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              Customer payments
            </span>
          </div>

          <div className="p-3 sm:p-3.5 bg-card rounded-md border border-border/40 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-0.5 sm:mb-1">
              Send to Bank
            </span>
            <span className="text-base sm:text-xl font-semibold text-success tabular-nums block">
              {formatCurrency(totalNet)}
            </span>
            <span className="text-[10px] text-success/80 block mt-0.5">
              Ready for transfer
            </span>
          </div>

          <div className="p-3 sm:p-3.5 bg-card rounded-md border border-border/40 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-0.5 sm:mb-1">
              Fee (1.5%)
            </span>
            <span className="text-base sm:text-xl font-semibold text-muted-foreground tabular-nums block">
              {formatCurrency(totalFees)}
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              MTN MoMo fee
            </span>
          </div>

          <div className="p-3 sm:p-3.5 bg-card rounded-md border border-border/40 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-0.5 sm:mb-1">
              Transactions
            </span>
            <span className="text-base sm:text-xl font-semibold text-foreground tabular-nums block">
              {collections.length} Paid
            </span>
            <span className="text-[10px] text-primary block mt-0.5">
              100% Reconciled
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 bg-card/40">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setChannelFilter('all')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap min-h-[36px] sm:min-h-0 flex items-center',
              channelFilter === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            )}
          >
            All Channels ({collections.length})
          </button>
          <button
            onClick={() => setChannelFilter('ussd')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap min-h-[36px] sm:min-h-0',
              channelFilter === 'ussd'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            )}
          >
            <Smartphone className="w-3 h-3" />
            USSD (*671#)
          </button>
          <button
            onClick={() => setChannelFilter('wallet')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap min-h-[36px] sm:min-h-0',
              channelFilter === 'wallet'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            )}
          >
            <MoneyInIcon className="w-3 h-3" />
            MoMo Wallet
          </button>
          <button
            onClick={() => setChannelFilter('qr')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap min-h-[36px] sm:min-h-0',
              channelFilter === 'qr'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            )}
          >
            <QrCode className="w-3 h-3" />
            QR Code
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payer, phone, ref..."
            className="w-full h-9 sm:h-8 pl-8 pr-3 text-base sm:text-xs bg-secondary/40 border border-border/60 rounded-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Collections Content: Desktop Table & Mobile Stacked Cards */}
      <div className="flex-1 md:overflow-y-auto pb-6">
        {/* Desktop Table (Hidden on Mobile) */}
        <div className="hidden md:block">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-secondary/30 sticky top-0 border-b border-border/40 text-muted-foreground z-10">
              <tr>
                <th className="py-2.5 px-6 font-medium">Reference ID</th>
                <th className="py-2.5 px-4 font-medium">Payer / Organization</th>
                <th className="py-2.5 px-4 font-medium">Phone Number</th>
                <th className="py-2.5 px-4 font-medium">Payment Channel</th>
                <th className="py-2.5 px-4 font-medium text-right">Amount Paid (₦)</th>
                <th className="py-2.5 px-4 font-medium text-right">MTN Fee (1.5%)</th>
                <th className="py-2.5 px-4 font-medium text-right">You Receive (₦)</th>
                <th className="py-2.5 px-4 font-medium text-center">Status</th>
                <th className="py-2.5 px-6 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {paginatedCollections.map((col) => (
                <tr 
                  key={col.id} 
                  onClick={() => setSelectedCollection(col)}
                  className="hover:bg-secondary/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-6 font-medium text-foreground group-hover:text-primary transition-colors tabular-nums">
                    {col.reference}
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">
                    {col.payerName}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground tabular-nums">
                    {col.payerPhone}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/8 px-2 py-0.5 rounded border border-primary/20">
                      {col.channel}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-right text-foreground tabular-nums">
                    {formatCurrency(col.amount)}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground/80 tabular-nums">
                    {formatCurrency(col.fee)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-right text-success tabular-nums">
                    {formatCurrency(col.netAmount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-success/10 text-success border border-success/20">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Settled
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right text-muted-foreground/70 text-[11px] tabular-nums">
                    {formatRelativeTime(col.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card List (Visible on <md screens) */}
        <div className="block md:hidden divide-y divide-border/20">
          {paginatedCollections.map((col) => (
            <div
              key={col.id}
              onClick={() => setSelectedCollection(col)}
              className="p-4 space-y-2.5 hover:bg-secondary/30 active:bg-secondary/50 transition-colors cursor-pointer"
            >
              {/* Row 1: Reference, Payer, and Amount */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-primary tabular-nums">
                      {col.reference}
                    </span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-xs font-semibold text-foreground truncate">
                      {col.payerName}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground tabular-nums mt-0.5">
                    {col.payerPhone}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-foreground tabular-nums block">
                    {formatCurrency(col.amount)}
                  </span>
                  <span className="text-[10px] text-success font-medium tabular-nums block">
                    Net: {formatCurrency(col.netAmount)}
                  </span>
                </div>
              </div>

              {/* Row 2: Channel Pill & Status Badge */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                    {col.channel}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 tabular-nums">
                    {formatRelativeTime(col.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-success/10 text-success border border-success/20">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Settled
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Pagination Bar */}
        <FintechPagination
          totalItems={filteredCollections.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemName="collections"
        />

        {filteredCollections.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground text-xs mb-3">
              No collection records match this filter
            </p>
          </div>
        )}
      </div>

      {/* Slide-over / Bottom-Sheet Transaction Detail Drawer */}
      <AnimatePresence>
        {selectedCollection && (
          <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
              onClick={() => setSelectedCollection(null)}
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
              <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-border/40 bg-card shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-primary tracking-wider block">
                    Payment Receipt & Audit
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mt-0.5 tabular-nums">
                    {selectedCollection.reference}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCollection(null)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
                {/* Total Received Amount Hero */}
                <div className="p-4 sm:p-5 rounded-md bg-secondary/30 border border-border/40 text-center space-y-1">
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground uppercase font-medium tracking-wider">
                    Total Amount Received
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    {formatCurrency(selectedCollection.amount)}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success border border-success/20 mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Settled & Reconciled
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Financial Breakdown
                  </h4>
                  <div className="p-3.5 rounded-md bg-secondary/20 border border-border/40 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Paid by Customer:</span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {formatCurrency(selectedCollection.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>MTN Fee (1.5%):</span>
                      <span className="tabular-nums text-muted-foreground/80">
                        -{formatCurrency(selectedCollection.fee)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border/40 flex justify-between items-center">
                      <span className="font-semibold text-foreground">Net Credited:</span>
                      <span className="font-bold text-success text-sm tabular-nums">
                        {formatCurrency(selectedCollection.netAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Payer Information
                  </h4>
                  <div className="p-3.5 rounded-md bg-secondary/20 border border-border/40 space-y-2">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">Organization / Payer</span>
                      <span className="font-semibold text-foreground text-xs">{selectedCollection.payerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">Phone Number</span>
                      <span className="font-medium text-foreground text-xs tabular-nums">{selectedCollection.payerPhone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">Payment Method</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/8 px-2 py-0.5 rounded border border-primary/20 mt-0.5">
                        {selectedCollection.channel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Destination Bank Account */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Destination Bank
                  </h4>
                  <div className="p-3.5 rounded-md bg-secondary/20 border border-border/40 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">Zenith Bank Plc</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      Account: 1014829104 (AgriCorp Nigeria Ltd)
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">
                      Auto-transferred directly into corporate treasury.
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 sm:p-5 border-t border-border/40 bg-card space-y-2 shrink-0">
                <button
                  onClick={() => handleDownloadReceipt(selectedCollection)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary/90 active:bg-primary/80 transition-colors cursor-pointer shadow-sm min-h-[44px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Official Receipt (PDF)</span>
                </button>
                <button
                  onClick={() => setSelectedCollection(null)}
                  className="w-full py-2.5 px-4 bg-secondary/40 text-foreground border border-border/40 rounded-md text-xs font-medium hover:bg-secondary/70 transition-colors cursor-pointer min-h-[44px]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CollectionsView
