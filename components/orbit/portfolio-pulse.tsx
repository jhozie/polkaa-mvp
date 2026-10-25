"use client";

import React from "react";
import { 
  Send, ArrowDownLeft, UploadCloud, Plus, RefreshCw, Landmark, 
  Smartphone, Clock, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck,
  Building2, QrCode
} from "lucide-react";
import { useOrbit } from "./orbit-provider";
import { formatCurrency, formatRelativeTime } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { MoneyInIcon } from "./money-icons";

interface PortfolioPulseProps {
  onNewPayout?: () => void;
  onBulkImport?: () => void;
}

export function PortfolioPulse({ onNewPayout, onBulkImport }: PortfolioPulseProps) {
  const { accounts, collections, setActiveView } = useOrbit();

  // Financial aggregates
  const activeAccounts = accounts.filter((acc) => acc.status !== 'archived');
  const totalPayouts = activeAccounts.reduce((sum, a) => sum + a.arr, 0);
  const settledPayouts = activeAccounts.filter(a => a.status === 'active').reduce((sum, a) => sum + a.arr, 0);
  const pendingEscrow = activeAccounts.filter(a => a.status === 'at-risk').reduce((sum, a) => sum + a.arr, 0);
  const autoSwept = activeAccounts.filter(a => a.status === 'churned').reduce((sum, a) => sum + a.arr, 0);

  const totalCollections = collections.reduce((sum, c) => sum + c.amount, 0);

  const pendingAccounts = activeAccounts.filter((acc) => acc.status === 'at-risk');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-[1400px] overflow-y-auto h-full pb-8">
      {/* Top Banner - Company Wallet Balance Card */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-card to-secondary/30 rounded-lg border border-border/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Company Wallet Balance • Active
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
              MTN MoMo Rails
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tabular-nums tracking-tight">
              ₦107,325,000.00
            </h1>
            <span className="text-xs text-success font-semibold sm:font-medium">
              Available to Send
            </span>
          </div>

          <div className="text-[11px] sm:text-xs text-muted-foreground mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span>Wallet ID: <strong className="text-foreground tabular-nums">MOMO-CORP-0124891049</strong></span>
            <span className="hidden sm:inline">•</span>
            <span>Linked Bank: <strong className="text-foreground">Zenith Bank (1014829104)</strong></span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-border/30">
          <button
            onClick={onNewPayout}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-colors cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Send Money (New Payment)
          </button>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <button
              onClick={onBulkImport}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-foreground bg-card border border-border/60 rounded-md hover:bg-secondary/60 shadow-sm transition-colors cursor-pointer min-h-[44px]"
            >
              <UploadCloud className="w-3.5 h-3.5 text-primary" />
              Bulk CSV
            </button>
            <button
              onClick={() => setActiveView('collections')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-foreground bg-secondary/50 border border-border/40 rounded-md hover:bg-secondary transition-colors cursor-pointer min-h-[44px]"
            >
              <Smartphone className="w-3.5 h-3.5 text-primary" />
              USSD *671#
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial Pulse Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Money Sent (Payouts) */}
        <div 
          onClick={() => setActiveView('payouts')}
          className="p-5 bg-card rounded-md border border-border/40 shadow-sm hover:border-primary/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Money Sent (Payouts)
            </span>
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl font-bold text-foreground block tabular-nums">
            {formatCurrency(totalPayouts)}
          </span>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-muted-foreground">Settled: {formatCurrency(settledPayouts)}</span>
            <span className="text-primary font-medium flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Money Received (USSD Collections) */}
        <div 
          onClick={() => setActiveView('collections')}
          className="p-5 bg-card rounded-md border border-border/40 shadow-sm hover:border-primary/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Money Received (USSD)
            </span>
            <div className="w-7 h-7 rounded-md bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
              <MoneyInIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl font-bold text-success block tabular-nums">
            {formatCurrency(totalCollections)}
          </span>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-muted-foreground">Dial *671*44#</span>
            <span className="text-primary font-medium flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Awaiting Cashout (48h) */}
        <div 
          onClick={() => setActiveView('payouts')}
          className="p-5 bg-card rounded-md border border-border/40 shadow-sm hover:border-warning/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Awaiting Cashout (48h)
            </span>
            <div className="w-7 h-7 rounded-md bg-warning/10 flex items-center justify-center text-warning group-hover:scale-110 transition-transform">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl font-bold text-warning block tabular-nums">
            {formatCurrency(pendingEscrow)}
          </span>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-muted-foreground">{pendingAccounts.length} Codes Active</span>
            <span className="text-warning font-medium">Safe 48h Window</span>
          </div>
        </div>

        {/* Returned to Balance */}
        <div 
          onClick={() => setActiveView('payouts')}
          className="p-5 bg-card rounded-md border border-border/40 shadow-sm hover:border-primary/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Returned to Balance
            </span>
            <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl font-bold text-muted-foreground block tabular-nums">
            {formatCurrency(autoSwept)}
          </span>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-muted-foreground">Unclaimed codes returned</span>
            <span className="text-muted-foreground">Zero Loss</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Pickups vs Recent MoMo Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Withdrawal Codes */}
        <div className="bg-card rounded-md p-5 border border-border/40 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-warning" />
                Active Withdrawal Codes (Awaiting Agent Cashout)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                SMS codes sent to recipients. Redeemable for physical cash at any agent shop. Returns to balance if uncollected after 2 days.
              </p>
            </div>
            <button
              onClick={() => setActiveView('payouts')}
              className="text-xs text-primary font-medium hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {pendingAccounts.map((account) => (
              <div 
                key={account.id}
                onClick={() => setActiveView('payouts')}
                className="p-3 bg-secondary/30 rounded-md border border-border/40 flex items-center justify-between hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">{account.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                      {account.voucherToken || `PK-${account.id.slice(-6).toUpperCase()}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {account.website || 'Kano Cluster'} • Nearest Point: {account.verifiedCashPoint?.split(':')[1] || 'Kano Sabon Gari #9842'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-xs text-foreground block">
                    {formatCurrency(account.arr)}
                  </span>
                  <span className="text-[10px] text-warning font-medium">
                    Approaching 48h SLA
                  </span>
                </div>
              </div>
            ))}

            {pendingAccounts.length === 0 && (
              <div className="py-8 text-center text-xs text-muted-foreground">
                All withdrawal codes have been collected or deposited directly to phone. Zero money pending.
              </div>
            )}
          </div>
        </div>

        {/* Live MoMo Activity Stream */}
        <div className="bg-card rounded-md p-5 border border-border/40 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Latest Transaction Stream
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time disbursements, collections, and Maker-Checker releases
              </p>
            </div>
            <button
              onClick={() => setActiveView('payouts')}
              className="text-xs text-primary font-medium hover:underline cursor-pointer"
            >
              Full Ledger
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {collections.slice(0, 3).map((col) => (
              <div key={col.id} className="p-3 bg-success/5 rounded-md border border-success/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{col.payerName}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-success/10 text-success border border-success/20">
                      INFLOW
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Via {col.channel} • Ref: {col.reference}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xs text-success block">
                    +{formatCurrency(col.netAmount)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatRelativeTime(col.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {activeAccounts.slice(0, 3).map((payout) => (
              <div key={payout.id} className="p-3 bg-secondary/30 rounded-md border border-border/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{payout.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                      PAYOUT
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {payout.status === 'active' ? 'Cash Collected at Agent' : payout.status === 'at-risk' ? 'SMS Code Sent (*671#)' : 'Returned to Balance'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xs text-foreground block">
                    -{formatCurrency(payout.arr)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatRelativeTime(payout.lastActivity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioPulse;
