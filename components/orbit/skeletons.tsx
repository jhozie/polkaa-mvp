'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// Base skeleton element with shimmer effect
export function Skeleton({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        'rounded-md bg-slate-200/90 dark:bg-slate-800/80 shimmer border border-slate-300/40 dark:border-slate-700/40',
        className
      )} 
      style={style}
      {...props}
    />
  )
}

// Account card skeleton
export function AccountCardSkeleton() {
  return (
    <div className="p-3 border-b border-border/50">
      <div className="flex items-start gap-3">
        <Skeleton className="w-2 h-2 rounded-full mt-2" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-1 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Metric card skeleton
export function MetricCardSkeleton() {
  return (
    <div className="card-surface p-4">
      <Skeleton className="w-6 h-6 mb-2" />
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

// Timeline event skeleton
export function TimelineEventSkeleton() {
  return (
    <div className="relative pl-10">
      <Skeleton className="absolute left-0 w-8 h-8 rounded-full" />
      <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4 mt-1" />
      </div>
    </div>
  )
}

// Contact card skeleton
export function ContactCardSkeleton() {
  return (
    <div className="card-surface p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Health gauge skeleton
export function HealthGaugeSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 80, md: 120, lg: 160 }
  const width = sizeMap[size]
  
  return (
    <div className="flex flex-col items-center">
      <Skeleton className="rounded-full" style={{ width, height: width / 2 + 10 }} />
      <Skeleton className="h-5 w-16 mt-2 rounded-full" />
    </div>
  )
}

// Chart skeleton
export function ChartSkeleton() {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <div className="h-[300px] flex items-end gap-4 px-8">
        {[...Array(12)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1" 
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  )
}

// Full account deep dive skeleton
export function AccountDeepDiveSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <HealthGaugeSkeleton size="lg" />
          <div className="space-y-3">
            <ContactCardSkeleton />
            <ContactCardSkeleton />
          </div>
        </div>

        {/* Middle column - timeline */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-16 rounded-md" />
            ))}
          </div>
          <TimelineEventSkeleton />
          <TimelineEventSkeleton />
          <TimelineEventSkeleton />
        </div>
      </div>
    </motion.div>
  )
}

// Loading overlay with spinner
export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </motion.div>
  )
}

// ==========================================
// POLKAA FINTECH SKELETON PRELOAD ARCHITECTURE
// ==========================================

/**
 * Hero Balance Skeleton matching the ₦107M Company Wallet Card
 */
export function HeroBalanceSkeleton() {
  return (
    <div className="p-5 sm:p-7 rounded-xl bg-card border border-border/60 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-9 sm:h-11 w-64 sm:w-80" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>
    </div>
  )
}

/**
 * Metric Cards Grid Skeleton (2x2 on mobile, 4-col on desktop)
 */
export function MetricCardsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-3 sm:p-3.5 bg-card rounded-md border border-border/40 shadow-sm space-y-2">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-6 sm:h-7 w-24 sm:w-28" />
          <Skeleton className="h-2 w-20" />
        </div>
      ))}
    </div>
  )
}

/**
 * Disbursement Table & Stacked Cards Skeleton Preload
 */
export function DisbursementTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {/* Search & Filter Bar Placeholder */}
      <div className="flex items-center justify-between gap-3 p-4 sm:p-6 pb-0">
        <div className="flex items-center gap-2 flex-1">
          <Skeleton className="h-8 w-44 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md hidden sm:block" />
        </div>
        <Skeleton className="h-8 w-48 rounded-md" />
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block px-6">
        <div className="border border-border/40 rounded-md overflow-hidden bg-card">
          <div className="h-10 bg-secondary/30 border-b border-border/40 flex items-center px-4 gap-4">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-24 ml-auto" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="divide-y divide-border/20">
            {[...Array(rows)].map((_, i) => (
              <div key={i} className="h-14 flex items-center px-4 gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-7 h-7 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                </div>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-4 w-24 ml-auto" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Stacked Cards Skeleton */}
      <div className="block md:hidden px-4 space-y-2.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-3.5 bg-card rounded-lg border border-border/50 shadow-xs space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-2.5 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-border/20">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Collections Table Skeleton Preload
 */
export function CollectionsTableSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Channels Banner Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3 bg-card rounded-md border border-border/40 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-2.5 w-44" />
          </div>
        ))}
      </div>

      {/* Metric Cards */}
      <MetricCardsGridSkeleton />

      {/* Table & Cards */}
      <DisbursementTableSkeleton rows={5} />
    </div>
  )
}

/**
 * Overview Dashboard Skeleton
 */
export function OverviewSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <HeroBalanceSkeleton />
      <MetricCardsGridSkeleton />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <DisbursementTableSkeleton rows={4} />
      </div>
    </div>
  )
}

/**
 * Universal Polkaa View Preloader
 */
export function PolkaaViewPreloader({ view = 'dashboard' }: { view?: string }) {
  return (
    <div className="w-full h-full overflow-hidden animate-in fade-in duration-100">
      {view === 'dashboard' && <OverviewSkeleton />}
      {(view === 'payouts' || view === 'accounts') && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-80" />
          </div>
          <MetricCardsGridSkeleton />
          <DisbursementTableSkeleton rows={6} />
        </div>
      )}
      {view === 'collections' && <CollectionsTableSkeleton />}
      {view === 'analytics' && (
        <div className="p-4 sm:p-6 space-y-4">
          <Skeleton className="h-6 w-44" />
          <MetricCardsGridSkeleton />
          <div className="h-64 rounded-xl border border-border/40 p-4 space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-48 w-full rounded-md" />
          </div>
        </div>
      )}
      {view === 'settings' && (
        <div className="p-4 sm:p-6 space-y-4 max-w-[1400px]">
          <div className="space-y-2">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-3 w-72" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 bg-card rounded-md border border-border/40 space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <Skeleton className="h-9 w-full rounded" />
                <Skeleton className="h-9 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

