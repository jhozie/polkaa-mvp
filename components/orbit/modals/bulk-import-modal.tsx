'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Loader2, Check, UploadCloud, FileSpreadsheet, ShieldCheck, 
  CheckCircle2, Smartphone, Clock, Lock, FileCheck, Download
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrbit } from '../orbit-provider'
import { useToastActions } from '../toast-provider'
import { formatCurrency, type Account } from '@/lib/mock-data'

interface BulkImportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface BatchItem {
  id: string
  name: string
  phone: string
  cluster: string
  amount: number
  nationalId: string
}

const sampleBatch: BatchItem[] = [
  { id: 'sb-1', name: 'Kabiru Sanusi Gaya', phone: '+234 803 219 4011', cluster: 'Gaya Rice Hub, Kano', amount: 30000, nationalId: 'NIN-89102938411' },
  { id: 'sb-2', name: 'Zainab Abdullahi Danbatta', phone: '+234 814 662 8901', cluster: 'Dambatta Grain Cluster, Kano', amount: 25000, nationalId: 'NIN-77192038492' },
  { id: 'sb-3', name: 'Haruna Aliyu Zaria', phone: '+234 802 881 3320', cluster: 'Giwa Maize Collective, Kaduna', amount: 25000, nationalId: 'NIN-44019283755' },
  { id: 'sb-4', name: 'Patience Nkechi Nnamdi', phone: '+234 703 441 9022', cluster: 'Abakaliki Rice Belt, Ebonyi', amount: 25000, nationalId: 'NIN-99102938488' },
  { id: 'sb-5', name: 'Idris Mustapha Hadejia', phone: '+234 816 772 1094', cluster: 'Hadejia Sesame Cluster, Jigawa', amount: 25000, nationalId: 'NIN-33920194883' },
]

export function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  const { addAccount, updateAccount, addContact, teamMembers } = useOrbit()
  const toast = useToastActions()

  const [payoutMethod, setPayoutMethod] = useState<'direct_wallet' | 'cash_voucher'>('cash_voucher')
  const [batchItems, setBatchItems] = useState<BatchItem[]>(sampleBatch)
  const [checkerPin, setCheckerPin] = useState('4821')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalAmount = batchItems.reduce((acc, c) => acc + c.amount, 0)

  const handleLoadSample = () => {
    setBatchItems(sampleBatch)
    toast.success('AgriCorp Wet Season Roster loaded (5 beneficiaries • ₦130,000.00)')
  }

  const handleDownloadTemplate = () => {
    toast.success('Sample template downloaded (polkaa_payout_template.csv)')
  }

  const handleSubmit = async () => {
    if (batchItems.length === 0) return
    setIsSubmitting(true)

    // Simulate API batch dispatch
    await new Promise(resolve => setTimeout(resolve, 600))

    try {
      batchItems.forEach((item) => {
        const tokenNumber = Math.floor(100000 + Math.random() * 900000)
        const isVoucher = payoutMethod === 'cash_voucher'

        const newAcc = addAccount({
          name: item.name,
          industry: 'Agriculture',
          tier: 'enterprise',
          arr: item.amount,
          baselineArr: item.amount,
          csmOwner: teamMembers[0]?.id || undefined,
          website: item.cluster,
          status: isVoucher ? 'at-risk' : 'active', // direct wallet is instantly active/settled
          lastActivity: new Date(),
        })

        updateAccount(newAcc.id, {
          payoutType: payoutMethod,
          voucherToken: isVoucher ? `PK-${tokenNumber}` : undefined,
          verifiedCashPoint: isVoucher 
            ? `Awaiting Pickup (Nearest MTN MoMo Agent Point: ${item.cluster.split(',')[0]} #4810)`
            : 'Settled to MoMo Wallet',
          disbursementBatch: 'BATCH-2026-WET-03',
          signedByMaker: 'Hajiya Fatima Bello (Maker)',
          signedByChecker: 'Dr. Aminu Garba (Checker)',
        })

        addContact({
          accountId: newAcc.id,
          name: item.name,
          email: `${item.name.toLowerCase().replace(/\s+/g, '.')}@agricorp.ng`,
          phone: item.phone,
          nationalId: item.nationalId,
          villageCluster: item.cluster,
          role: 'Grant Recipient',
          isPrimary: true,
          isChampion: true,
        })
      })

      toast.success(
        `Batch of ${batchItems.length} payouts (₦${totalAmount.toLocaleString('en-NG')}) successfully processed via MTN MoMo PSB Rails!`
      )

      onSuccess?.()
      onClose()
    } catch {
      toast.error('Failed to process batch payout. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.16 }}
            className="relative w-full max-w-2xl bg-card border border-border/60 rounded-md shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/40 bg-card shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                    Bulk CSV Disbursement
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                    MTN MoMo Rails
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                  Upload a spreadsheet of recipient phone numbers and amounts for instant mass payout
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wallet Balance Banner */}
            <div className="px-4 sm:px-6 py-2 bg-secondary/30 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] gap-1 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_6px_rgba(34,197,94,0.4)] shrink-0" />
                <span className="text-muted-foreground">Wallet:</span>
                <span className="font-semibold text-foreground truncate">MOMO-CORP-0124891049</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Available:</span>
                <span className="text-success font-semibold tabular-nums">₦107,325,000.00</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
              {/* Option C: Payout Method Selection */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Select How Recipients Receive Money
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div
                    onClick={() => setPayoutMethod('direct_wallet')}
                    className={cn(
                      'p-3 sm:p-3.5 rounded-md border text-left cursor-pointer transition-all',
                      payoutMethod === 'direct_wallet'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border/60 bg-card hover:bg-secondary/30'
                    )}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs text-foreground mb-1">
                      <Smartphone className="w-4 h-4 text-success shrink-0" />
                      <span>Direct to Phone</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Instant credit sent directly to recipient&apos;s phone number.
                    </p>
                  </div>

                  <div
                    onClick={() => setPayoutMethod('cash_voucher')}
                    className={cn(
                      'p-3 sm:p-3.5 rounded-md border text-left cursor-pointer transition-all',
                      payoutMethod === 'cash_voucher'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border/60 bg-card hover:bg-secondary/30'
                    )}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs text-foreground mb-1">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      <span>Withdrawal Code (Cash at Agent)</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      SMS code to collect cash at any nearby agent. <strong>Returns to balance</strong> if uncollected in 2 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border border-dashed border-border/80 rounded-md p-5 bg-secondary/20 hover:bg-secondary/30 transition-colors flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-semibold text-foreground mb-1">
                  Upload CSV or Excel File
                </h3>
                <p className="text-[11px] text-muted-foreground max-w-sm mb-3">
                  Columns: <code className="text-foreground font-semibold">Phone, Name, Amount, Cluster, NationalID</code>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="px-3 py-1.5 text-xs font-medium bg-card text-foreground border border-border/60 rounded-md hover:bg-secondary/40 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-primary" />
                    Load Sample Roster (5 Farmers)
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Template
                  </button>
                </div>
              </div>

              {/* Roster Table Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      Batch Roster ({batchItems.length} Recipients)
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-success/10 text-success border border-success/20">
                      MSISDN VALIDATED
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    Total: {formatCurrency(totalAmount)}
                  </span>
                </div>

                <div className="border border-border/40 rounded-md overflow-hidden bg-card">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-secondary/40 border-b border-border/40 text-muted-foreground">
                      <tr>
                        <th className="py-2 px-3 font-medium">Beneficiary</th>
                        <th className="py-2 px-3 font-medium">Phone (MSISDN)</th>
                        <th className="py-2 px-3 font-medium">Cluster Hub</th>
                        <th className="py-2 px-3 font-medium text-right">Amount</th>
                        <th className="py-2 px-3 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {batchItems.map((item) => (
                        <tr key={item.id} className="hover:bg-secondary/20">
                          <td className="py-2 px-3 font-medium text-foreground">{item.name}</td>
                          <td className="py-2 px-3 text-muted-foreground">{item.phone}</td>
                          <td className="py-2 px-3 text-muted-foreground truncate max-w-[150px]">{item.cluster}</td>
                          <td className="py-2 px-3 font-semibold text-right text-foreground">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-success/10 text-success border border-success/20">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Valid
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Two-Person Approval */}
              <div className="p-4 bg-secondary/20 rounded-md border border-border/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">
                      Two-Person Approval
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {payoutMethod === 'cash_voucher' ? '2-Day Return Active' : 'Instant Direct Transfer'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 bg-card border border-border/40 rounded-md">
                    <span className="text-muted-foreground text-[10px] block">Payment Prepared By:</span>
                    <span className="font-semibold text-foreground">Hajiya Fatima Bello</span>
                    <span className="text-muted-foreground block text-[10px]">Operations Lead</span>
                  </div>

                  <div className="p-2.5 bg-card border border-border/40 rounded-md">
                    <span className="text-muted-foreground text-[10px] block">Approved By (PIN):</span>
                    <span className="font-semibold text-foreground">Dr. Aminu Garba</span>
                    <span className="text-muted-foreground block text-[10px]">Finance Director</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="relative flex-1">
                    <Lock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      value={checkerPin}
                      onChange={(e) => setCheckerPin(e.target.value)}
                      placeholder="Enter 4-digit Approval PIN"
                      className="w-full h-8 pl-8 pr-3 text-xs bg-card border border-border/60 rounded-md text-foreground focus:outline-none focus:border-primary"
                      maxLength={4}
                    />
                  </div>
                  <span className="text-[10px] text-success font-medium flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    PIN Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-border/40 bg-card gap-2.5 sm:gap-0 shrink-0">
              <span className="text-xs text-muted-foreground">
                Total Payout: <strong className="text-foreground tabular-nums">{formatCurrency(totalAmount)}</strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-3.5 py-2 sm:py-1.5 text-xs font-medium text-foreground bg-card border border-border/60 rounded-md hover:bg-secondary/40 transition-colors cursor-pointer min-h-[40px] sm:min-h-0"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || batchItems.length === 0}
                  className={cn(
                    'flex-1 sm:flex-none px-4 py-2 sm:py-1.5 text-xs font-medium text-white rounded-md transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer min-h-[40px] sm:min-h-0',
                    !isSubmitting
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-primary/50 cursor-not-allowed'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Disbursing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Disburse Batch ({batchItems.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
