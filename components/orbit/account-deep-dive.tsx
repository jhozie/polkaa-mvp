'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Building2, DollarSign, Users, Calendar, 
  MoreVertical, Pencil, Archive, Trash2, RefreshCw, Star,
  Plus, Mail, Phone, ShieldCheck, CheckCircle2, Clock, FileText,
  Send, MapPin, Smartphone, UserCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatRelativeTime, getAvatarColor, getInitials, type Account } from '@/lib/mock-data'
import { useOrbit } from './orbit-provider'
import { useToastActions } from './toast-provider'
import { SentimentOrb } from './sentiment-orb'
import { TimelineOfTruth } from './timeline-of-truth'
import { ExpansionTable } from './expansion-table'
import { EditableMetricCard } from './editable-metric-card'
import { ContactCard } from './contact-card'
import { AccountDeepDiveSkeleton } from './skeletons'
import { ConfirmModal } from './modals/confirm-modal'
import { ActivityModal } from './modals/activity-modal'
import { ContactModal } from './modals/contact-modal'
import { OpportunityModal } from './modals/opportunity-modal'
import type { Contact } from '@/lib/mock-data'

interface AccountDeepDiveProps {
  account: Account
  onBack: () => void
  onEdit: () => void
}

export function AccountDeepDive({ account, onBack, onEdit }: AccountDeepDiveProps) {
  const { 
    deleteAccount, 
    archiveAccount, 
    restoreAccount,
    updateAccount,
    deleteContact,
    getContactsForAccount,
    getActivitiesForAccount,
    getOpportunitiesForAccount,
  } = useOrbit()
  const toast = useToastActions()
  
  const [isLoading, setIsLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const [showOpportunityModal, setShowOpportunityModal] = useState(false)

  // Simulate loading state when switching accounts
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 250)
    return () => clearTimeout(timer)
  }, [account.id])

  const contacts = getContactsForAccount(account.id)
  const activities = getActivitiesForAccount(account.id)
  const opportunities = getOpportunitiesForAccount(account.id)
  
  const safeArr = typeof account.arr === 'number' && !isNaN(account.arr) ? account.arr : 25000
  const safeNrr = typeof account.nrr === 'number' && !isNaN(account.nrr) ? account.nrr : 100
  const safeHealthScore = typeof account.healthScore === 'number' && !isNaN(account.healthScore) ? account.healthScore : 95

  const isCollected = account.status === 'active'
  const isPending = account.status === 'at-risk'
  const isRefunded = account.status === 'churned'
  const isArchived = account.status === 'archived'

  const primaryBeneficiary = contacts[0]

  const handleDelete = () => {
    deleteAccount(account.id)
    toast.success(`Payment record for ${account.name} removed`)
    onBack()
  }

  const handleArchive = () => {
    archiveAccount(account.id)
    toast.info(`Payment record archived`)
    setShowMenu(false)
  }

  const handleRestore = () => {
    restoreAccount(account.id)
    toast.success(`Payment record restored`)
    setShowMenu(false)
  }

  const handleDownloadReceipt = () => {
    toast.success(`Audit Certificate #PK-RCP-${account.id.slice(-4).toUpperCase()} downloaded`)
  }

  const handleResendSMS = () => {
    toast.success(`SMS Token resent to ${primaryBeneficiary?.phone || '+234 803 ...'}`)
  }

  const handleReturnToWallet = () => {
    updateAccount(account.id, { status: 'churned' })
    toast.info(`₦${safeArr.toLocaleString('en-NG')} returned to AgriCorp Company Wallet`)
  }

  if (isLoading) {
    return <AccountDeepDiveSkeleton />
  }

  return (
    <motion.div 
      className="p-6 space-y-6 overflow-y-auto h-full max-w-[1400px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      {/* Header & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <motion.button
            onClick={onBack}
            className="w-8 h-8 rounded-md bg-secondary/40 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all mt-0.5 cursor-pointer"
            aria-label="Back to roster"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-foreground tracking-tight">
                {account.name}
              </h1>

              {isCollected && (
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-success/10 text-success border border-success/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Cash Collected
                </span>
              )}
              {isPending && (
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-warning/10 text-warning border border-warning/20 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Pending Pickup
                </span>
              )}
              {isRefunded && (
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-muted-foreground border border-border/40">
                  Auto-Refunded to Balance
                </span>
              )}
              {isArchived && (
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground">
                  Archived
                </span>
              )}
            </div>

            <p className="text-[12px] text-muted-foreground/70 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{account.website || "Northern Smallholder Granary"}</span>
              <span className="text-border/60">•</span>
              <span className="text-[11px]">Token: <strong>{account.voucherToken || `PK-${account.id.slice(-6).toUpperCase()}`}</strong></span>
              <span className="text-border/60">•</span>
              <span>Updated {formatRelativeTime(account.lastActivity)}</span>
            </p>
          </div>
        </div>

        {/* Corporate Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadReceipt}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-foreground bg-card border border-border/60 rounded-md hover:bg-secondary/40 shadow-sm transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-primary" />
            Audit Certificate (PDF)
          </button>

          {isPending && (
            <button
              onClick={handleResendSMS}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/15 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Resend SMS Token
            </button>
          )}

          {isPending && (
            <button
              onClick={handleReturnToWallet}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground bg-card border border-border/40 rounded-md hover:bg-secondary/30 transition-colors cursor-pointer"
              title="Return money to company wallet"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Return to Wallet
            </button>
          )}

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-md bg-card border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="More actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border/40 rounded-md shadow-lg z-20 py-1 text-[12px]"
                  >
                    <button
                      onClick={onEdit}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-foreground hover:bg-secondary/50 transition-colors text-left"
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      Edit Beneficiary
                    </button>
                    {isArchived ? (
                      <button
                        onClick={handleRestore}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-foreground hover:bg-secondary/50 transition-colors text-left"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Restore to Active Roster
                      </button>
                    ) : (
                      <button
                        onClick={handleArchive}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-foreground hover:bg-secondary/50 transition-colors text-left"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        Archive Record
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowMenu(false)
                        setShowDeleteConfirm(true)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-critical hover:bg-critical/10 transition-colors text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove from Roster
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Dual-Approval Maker-Checker Governance Banner */}
      <div className="bg-card rounded-md p-4 border border-border/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-foreground">
                Dual-Approval Corporate Governance
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-success/10 text-success border border-success/20">
                AUDIT VERIFIED
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-primary/10 text-primary border border-primary/20">
                MTN MoMo PSB RAIL
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground/70 mt-0.5">
              Maker: <strong>{account.signedByMaker || "Hajiya Fatima Bello (Field Operations Lead)"}</strong> &nbsp;•&nbsp; 
              Checker: <strong>{account.signedByChecker || "Dr. Aminu Garba (Finance Director, AgriCorp)"}</strong>
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase text-muted-foreground/60 block">
            MTN MoMo Verified Agent Point
          </span>
          <span className="text-[12px] font-medium text-foreground">
            {account.verifiedCashPoint || "MTN MoMo Agent Point #9842 (Kano Sabon Gari)"}
          </span>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-card rounded-md border border-border/40 shadow-sm">
          <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-1">
            Face Value Amount
          </span>
          <span className="text-2xl font-semibold text-foreground tabular-nums">
            {formatCurrency(safeArr)}
          </span>
          <span className="text-[10px] text-success font-medium block mt-1">
            100% Guaranteed Face Value
          </span>
        </div>

        <div className="p-4 bg-card rounded-md border border-border/40 shadow-sm">
          <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-1">
            Delivery Status
          </span>
          <span className="text-2xl font-semibold text-foreground tabular-nums">
            {isCollected ? "100%" : isPending ? "Active" : "Refunded"}
          </span>
          <span className="text-[10px] text-muted-foreground/60 block mt-1">
            {isCollected ? "Cash Collected OTC" : isPending ? "Awaiting 48h Pickup" : "Swept to Corporate Balance"}
          </span>
        </div>

        <div className="p-4 bg-card rounded-md border border-border/40 shadow-sm">
          <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-1">
            Disbursement Batch
          </span>
          <span className="text-2xl font-semibold text-foreground tracking-tight">
            WET-01
          </span>
          <span className="text-[10px] text-muted-foreground/60 block mt-1">
            {account.disbursementBatch || "BATCH-2026-WET-01"}
          </span>
        </div>

        <div className="p-4 bg-card rounded-md border border-border/40 shadow-sm">
          <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider block mb-1">
            Audit Trail Events
          </span>
          <span className="text-2xl font-semibold text-foreground tabular-nums">
            {activities.length}
          </span>
          <span className="text-[10px] text-primary font-medium block mt-1">
            Immutable Timestamps
          </span>
        </div>
      </div>

      {/* Main Content Grid: Cash Point & Beneficiary vs Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Beneficiary & Cash Point Details */}
        <div className="space-y-4">
          <div className="bg-card rounded-md p-5 border border-border/40 shadow-sm">
            <h3 className="text-[13px] font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-primary" />
              Beneficiary Profile
            </h3>

            <div className="space-y-2.5 text-[12px]">
              <div>
                <span className="text-muted-foreground/60 text-[11px] block">Full Name:</span>
                <span className="font-medium text-foreground">{account.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground/60 text-[11px] block">Phone Number (MSISDN):</span>
                <span className="text-foreground">{primaryBeneficiary?.phone || "+234 803 412 8901"}</span>
              </div>
              <div>
                <span className="text-muted-foreground/60 text-[11px] block">National Identification / Co-op ID:</span>
                <span className="text-foreground">{primaryBeneficiary?.nationalId || "NIN-84920194821"}</span>
              </div>
              <div>
                <span className="text-muted-foreground/60 text-[11px] block">Agricultural Cluster:</span>
                <span className="text-foreground">{account.website || "Dambatta Grain Growers, Kano"}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-md p-5 border border-border/40 shadow-sm">
            <h3 className="text-[13px] font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-primary" />
              SMS Withdrawal Code (*671# USSD)
            </h3>

            <div className="p-3 bg-secondary/40 rounded-md border border-border/40 mb-3 text-center">
              <span className="text-[10px] uppercase text-muted-foreground/70 tracking-widest block mb-0.5">
                6-Digit Cashout Code
              </span>
              <span className="text-2xl font-bold text-primary tracking-wider">
                {account.voucherToken || `PK-${account.id.slice(-6).toUpperCase()}`}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
              Sent via SMS. Redeemable at any licensed MTN MoMo agent via *671# without internet or a smartphone.
            </p>
          </div>
        </div>

        {/* Immutable Audit Trail (Timeline of Truth) */}
        <div className="lg:col-span-2 bg-card rounded-md p-5 border border-border/40 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[13px] font-semibold text-foreground">
                Payment History & Audit Trail
              </h3>
              <p className="text-[11px] text-muted-foreground/60">
                Detailed record of payment approvals, SMS delivery, and agent cash pickup timestamps
              </p>
            </div>
            <button
              onClick={() => setShowActivityModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/8 rounded-md transition-colors border border-primary/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Audit Note
            </button>
          </div>

          <div className="overflow-y-auto flex-1 max-h-[460px] pr-1">
            <TimelineOfTruth events={activities} accountId={account.id} />
          </div>
        </div>
      </div>

      {/* Program Allocation Tranches */}
      <div className="bg-card rounded-md p-5 border border-border/40 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[13px] font-semibold text-foreground">
              Corporate Program Budget Allocations (AgriCorp Tranches)
            </h3>
            <p className="text-[11px] text-muted-foreground/60">
              Regional budget allocations and payments under the ₦150M corporate grant
            </p>
          </div>
          <button
            onClick={() => setShowOpportunityModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/8 rounded-md transition-colors border border-primary/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Tranche
          </button>
        </div>
        <ExpansionTable opportunities={opportunities} accountId={account.id} />
      </div>

      {/* Delete / Archive Confirmations */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Remove Beneficiary Record?"
        message={`This will permanently remove ${account.name} from the active payment roster. Unclaimed funds remain safely in AgriCorp company wallet balance.`}
        confirmText="Remove Record"
        variant="danger"
      />

      <ConfirmModal
        isOpen={!!deletingContact}
        onClose={() => setDeletingContact(null)}
        onConfirm={() => {
          if (deletingContact) {
            deleteContact(deletingContact.id)
            setDeletingContact(null)
          }
        }}
        title="Delete Contact?"
        message={`Are you sure you want to delete ${deletingContact?.name}?`}
        confirmText="Delete"
        variant="danger"
      />

      <ActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        accountId={account.id}
      />

      <ContactModal
        isOpen={showContactModal}
        onClose={() => {
          setShowContactModal(false)
          setEditingContact(null)
        }}
        accountId={account.id}
        contact={editingContact || undefined}
      />

      <OpportunityModal
        isOpen={showOpportunityModal}
        onClose={() => setShowOpportunityModal(false)}
        accountId={account.id}
      />
    </motion.div>
  )
}
