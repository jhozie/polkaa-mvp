'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Loader2, Check, UploadCloud, FileSpreadsheet, ShieldCheck, 
  CheckCircle2, Smartphone, Lock, ArrowRight, UserPlus, FileCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrbit } from '../orbit-provider'
import { useToastActions } from '../toast-provider'
import { 
  type Account, 
  type Tier, 
  type Industry, 
  type AccountStatus, 
  industries, 
  formatCurrency 
} from '@/lib/mock-data'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  account?: Account
  onSuccess?: (account: Account) => void
}

interface FormData {
  name: string
  industry: Industry
  tier: Tier
  arr: string
  csmOwner: string
  website: string
  primaryContactName: string
  primaryContactPhone: string
  nationalId: string
  status: AccountStatus
}

interface BatchBeneficiary {
  id: string
  name: string
  phone: string
  nationalId: string
  cluster: string
  amount: number
  tier: Tier
  industry: Industry
  verified: boolean
}

const sampleBatchData: BatchBeneficiary[] = [
  { id: 'b1', name: 'Kabiru Sanusi Gaya', phone: '+234 803 219 4011', nationalId: 'NIN-89102938411', cluster: 'Gaya Rice Hub, Kano', amount: 30000, tier: 'enterprise', industry: 'Agriculture', verified: true },
  { id: 'b2', name: 'Zainab Abdullahi Danbatta', phone: '+234 814 662 8901', nationalId: 'NIN-77192038492', cluster: 'Dambatta Grain Cluster, Kano', amount: 25000, tier: 'enterprise', industry: 'Agriculture', verified: true },
  { id: 'b3', name: 'Haruna Aliyu Zaria', phone: '+234 802 881 3320', nationalId: 'NIN-44019283755', cluster: 'Giwa Maize Collective, Kaduna', amount: 25000, tier: 'enterprise', industry: 'Agriculture', verified: true },
  { id: 'b4', name: 'Patience Nkechi Nnamdi', phone: '+234 703 441 9022', nationalId: 'NIN-99102938488', cluster: 'Abakaliki Rice Belt, Ebonyi', amount: 25000, tier: 'mid-market', industry: 'Agriculture', verified: true },
  { id: 'b5', name: 'Idris Mustapha Hadejia', phone: '+234 816 772 1094', nationalId: 'NIN-33920194883', cluster: 'Hadejia Sesame Cluster, Jigawa', amount: 25000, tier: 'enterprise', industry: 'Agriculture', verified: true },
]

const tiers: { value: Tier; label: string }[] = [
  { value: 'enterprise', label: 'MTN MoMo Grain Grant (Tier 1)' },
  { value: 'mid-market', label: 'MoMo Relief Cash Subsidy' },
  { value: 'startup', label: 'Daily Wage Payroll' },
]

const statuses: { value: AccountStatus; label: string }[] = [
  { value: 'active', label: 'Cash Collected (Settled)' },
  { value: 'at-risk', label: 'Pending Pickup (Active 48h SLA)' },
  { value: 'churned', label: 'Auto-Refunded to Balance' },
]

export function AccountModal({ isOpen, onClose, account, onSuccess }: AccountModalProps) {
  const { addAccount, updateAccount, teamMembers, addContact } = useOrbit()
  const toast = useToastActions()
  const isEditMode = !!account

  const [modalTab, setModalTab] = useState<'batch' | 'single'>('batch')
  const [batchItems, setBatchItems] = useState<BatchBeneficiary[]>(sampleBatchData)
  const [hasLoadedBatch, setHasLoadedBatch] = useState(false)
  const [checkerPin, setCheckerPin] = useState('4821')

  const [formData, setFormData] = useState<FormData>({
    name: '',
    industry: 'Agriculture',
    tier: 'enterprise',
    arr: '25000',
    csmOwner: '',
    website: 'Dambatta Grain Cluster, Kano',
    primaryContactName: '',
    primaryContactPhone: '+234 803 412 8901',
    nationalId: 'NIN-84920194821',
    status: 'at-risk',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (account) {
        setFormData({
          name: account.name,
          industry: account.industry,
          tier: account.tier,
          arr: account.arr.toString(),
          csmOwner: account.csmOwner || '',
          website: account.website || '',
          primaryContactName: '',
          primaryContactPhone: '',
          nationalId: '',
          status: account.status,
        })
        setModalTab('single')
      } else {
        setFormData({
          name: '',
          industry: 'Agriculture',
          tier: 'enterprise',
          arr: '25000',
          csmOwner: teamMembers[0]?.id || '',
          website: 'Dambatta Grain Cluster, Kano',
          primaryContactName: '',
          primaryContactPhone: '+234 803 412 8901',
          nationalId: 'NIN-84920194821',
          status: 'at-risk',
        })
        setModalTab('batch')
        setHasLoadedBatch(false)
      }
    }
  }, [isOpen, account, teamMembers])

  const totalBatchAmount = batchItems.reduce((acc, curr) => acc + curr.amount, 0)

  const handleLoadSampleBatch = () => {
    setBatchItems(sampleBatchData)
    setHasLoadedBatch(true)
    toast.success('AgriCorp Wet Season Batch loaded (5 beneficiaries • ₦130,000.00)')
  }

  // Handle Single Beneficiary Submission
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.arr) return
    setIsSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 350))
    
    try {
      if (isEditMode && account) {
        updateAccount(account.id, {
          name: formData.name,
          industry: formData.industry,
          tier: formData.tier,
          arr: parseFloat(formData.arr),
          csmOwner: formData.csmOwner || undefined,
          website: formData.website || undefined,
          status: formData.status,
        })
        toast.success(`Beneficiary ${formData.name} updated`)
        onSuccess?.(account)
      } else {
        const tokenNumber = Math.floor(100000 + Math.random() * 900000)
        const newAccount = addAccount({
          name: formData.name,
          industry: formData.industry,
          tier: formData.tier,
          arr: parseFloat(formData.arr),
          baselineArr: parseFloat(formData.arr),
          csmOwner: formData.csmOwner || undefined,
          website: formData.website || 'Northern Granary',
          status: 'at-risk', // Newly issued vouchers start in Pending Pickup
          lastActivity: new Date(),
        })

        updateAccount(newAccount.id, {
          voucherToken: `PK-${tokenNumber}`,
          verifiedCashPoint: 'Awaiting Pickup (Nearest MTN MoMo Agent Point: Kano Sabon Gari #9842)',
          disbursementBatch: 'BATCH-2026-WET-02',
          signedByMaker: 'Hajiya Fatima Bello (Field Operations Lead)',
          signedByChecker: 'Dr. Aminu Garba (Finance Director)',
        })
        
        addContact({
          accountId: newAccount.id,
          name: formData.primaryContactName || formData.name,
          email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@agricorp.ng`,
          phone: formData.primaryContactPhone || '+234 803 412 8901',
          nationalId: formData.nationalId || 'NIN-84920194821',
          villageCluster: formData.website || 'Dambatta, Kano',
          role: 'Smallholder Farmer',
          isPrimary: true,
          isChampion: true,
        })
        
        toast.success(`Withdrawal Code PK-${tokenNumber} generated and sent via SMS (*671#)`)
        onSuccess?.(newAccount)
      }
      
      onClose()
    } catch {
      toast.error('Failed to generate withdrawal code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Batch Disbursement Submission
  const handleBatchSubmit = async () => {
    if (batchItems.length === 0) return
    setIsSubmitting(true)

    // Simulate MTN MoMo Open API call and Maker-Checker 2FA verification
    await new Promise(resolve => setTimeout(resolve, 600))

    try {
      let firstCreated: Account | null = null

      batchItems.forEach((item) => {
        const tokenNumber = Math.floor(100000 + Math.random() * 900000)
        const newAcc = addAccount({
          name: item.name,
          industry: item.industry,
          tier: item.tier,
          arr: item.amount,
          baselineArr: item.amount,
          csmOwner: teamMembers[0]?.id || undefined,
          website: item.cluster,
          status: 'at-risk', // Pending 48h pickup
          lastActivity: new Date(),
        })

        updateAccount(newAcc.id, {
          voucherToken: `PK-${tokenNumber}`,
          verifiedCashPoint: `Awaiting Pickup (Nearest MTN MoMo Agent Point: ${item.cluster.split(',')[0]} #4810)`,
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

        if (!firstCreated) firstCreated = newAcc
      })

      toast.success(
        `Batch BATCH-2026-WET-03 (${batchItems.length} recipients • ₦${totalBatchAmount.toLocaleString('en-NG')}) disbursed via MTN MoMo PSB Rails!`
      )

      if (firstCreated) onSuccess?.(firstCreated)
      onClose()
    } catch {
      toast.error('Batch payment failed. Please check wallet balance.')
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
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/40 bg-card shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                    {isEditMode ? 'Edit Recipient Record' : 'Send Money (MTN MoMo)'}
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                    MTN MoMo PSB
                  </span>
                </div>
                <p className="text-[11px] sm:text-[12px] text-muted-foreground/70 mt-0.5">
                  {isEditMode 
                    ? 'Update recipient details and location' 
                    : 'Send cash to rural workers and farmers via SMS Withdrawal Code redeemable at any local MTN MoMo agent'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wallet Balance Banner */}
            {!isEditMode && (
              <div className="px-4 sm:px-6 py-2 bg-secondary/30 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] gap-1 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_6px_rgba(34,197,94,0.4)] shrink-0" />
                  <span className="text-muted-foreground/80">Wallet:</span>
                  <span className="font-semibold text-foreground truncate">MOMO-CORP-0124891049</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground/70">Available:</span>
                  <span className="text-success font-semibold tabular-nums">₦107,325,000.00</span>
                </div>
              </div>
            )}

            {/* Mode Tabs (Only in Create Mode) */}
            {!isEditMode && (
              <div className="flex items-center gap-1 px-4 sm:px-6 pt-2 border-b border-border/40 bg-card overflow-x-auto scrollbar-none shrink-0">
                <button
                  type="button"
                  onClick={() => setModalTab('batch')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[36px] sm:min-h-0',
                    modalTab === 'batch'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Batch Spreadsheet (.CSV)
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('single')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[36px] sm:min-h-0',
                    modalTab === 'single'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Single Beneficiary Grant
                </button>
              </div>
            )}

            {/* Tab 1: Batch Upload Workflow */}
            {!isEditMode && modalTab === 'batch' && (
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
                {/* Upload Box / Load Sample */}
                <div className="border border-dashed border-border/80 rounded-md p-5 bg-secondary/20 hover:bg-secondary/30 transition-colors flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-semibold text-foreground mb-1">
                    Upload Recipient Roster (.CSV or .XLSX)
                  </h3>
                  <p className="text-[11px] text-muted-foreground/70 max-w-sm mb-3">
                    Columns: <code className="text-foreground font-semibold">MSISDN, Name, Amount, Cluster, NIN</code>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadSampleBatch}
                      className="px-3 py-1.5 text-xs font-medium bg-card text-foreground border border-border/60 rounded-md hover:bg-secondary/40 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-primary" />
                      Load Sample Batch (5 Farmers • ₦130,000)
                    </button>
                  </div>
                </div>

                {/* Batch Table Preview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        Batch Preview ({batchItems.length} Beneficiaries)
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-success/10 text-success border border-success/20">
                        ALL MSISDN VALIDATED
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      Total: {formatCurrency(totalBatchAmount)}
                    </span>
                  </div>

                  <div className="border border-border/40 rounded-md overflow-hidden bg-card">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-secondary/40 border-b border-border/40 text-muted-foreground">
                        <tr>
                          <th className="py-2 px-3 font-medium">Beneficiary</th>
                          <th className="py-2 px-3 font-medium">Phone (MSISDN)</th>
                          <th className="py-2 px-3 font-medium">Cluster Hub</th>
                          <th className="py-2 px-3 font-medium text-right">Grant Amount</th>
                          <th className="py-2 px-3 font-medium text-center">MoMo Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {batchItems.map((item) => (
                          <tr key={item.id} className="hover:bg-secondary/20">
                            <td className="py-2 px-3 font-medium text-foreground">{item.name}</td>
                            <td className="py-2 px-3 text-muted-foreground/80">{item.phone}</td>
                            <td className="py-2 px-3 text-muted-foreground/70 truncate max-w-[150px]">{item.cluster}</td>
                            <td className="py-2 px-3 font-semibold text-right text-foreground">
                              {formatCurrency(item.amount)}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-success/10 text-success border border-success/20">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Maker-Checker Corporate Dual Authorization */}
                <div className="p-4 bg-secondary/20 rounded-md border border-border/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-foreground">
                        Maker-Checker Dual Authorization
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/70">
                      SLA: 48h Auto-Sweep Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 bg-card border border-border/40 rounded-md">
                      <span className="text-muted-foreground/60 text-[10px] block">Maker Signer (Initiator):</span>
                      <span className="font-semibold text-foreground">Hajiya Fatima Bello</span>
                      <span className="text-muted-foreground/70 block text-[10px]">Field Operations Lead</span>
                    </div>

                    <div className="p-2.5 bg-card border border-border/40 rounded-md">
                      <span className="text-muted-foreground/60 text-[10px] block">Checker Signer (Authorizer):</span>
                      <span className="font-semibold text-foreground">Dr. Aminu Garba</span>
                      <span className="text-muted-foreground/70 block text-[10px]">Finance Director</span>
                    </div>
                  </div>

                  {/* Checker Security PIN */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="relative flex-1">
                      <Lock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="password"
                        value={checkerPin}
                        onChange={(e) => setCheckerPin(e.target.value)}
                        placeholder="Enter 4-digit Checker Authorization PIN"
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
            )}

            {/* Tab 2: Single Beneficiary Form OR Edit Mode */}
            {(isEditMode || modalTab === 'single') && (
              <form onSubmit={handleSingleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Beneficiary Name */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Beneficiary Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-9 px-3 bg-card border border-border/60 rounded-md text-xs text-foreground focus:outline-none focus:border-primary"
                    placeholder="e.g. Mallam Sani Abubakar"
                    required
                  />
                </div>

                {/* Sector & Grant Tier */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Sector <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value as Industry }))}
                      className="w-full h-9 px-3 bg-card border border-border/60 rounded-md text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Grant Category <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value as Tier }))}
                      className="w-full h-9 px-3 bg-card border border-border/60 rounded-md text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      {tiers.map(tier => (
                        <option key={tier.value} value={tier.value}>{tier.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Face Value Amount */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Face Value Grant Amount (₦) <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₦</span>
                    <input
                      type="number"
                      value={formData.arr}
                      onChange={(e) => setFormData(prev => ({ ...prev, arr: e.target.value }))}
                      className="w-full h-9 pl-7 pr-3 bg-card border border-border/60 rounded-md text-xs font-medium text-foreground focus:outline-none focus:border-primary"
                      placeholder="25000"
                      min="1000"
                      required
                    />
                  </div>
                </div>

                {/* Village Cluster / Location */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Village Cluster / Agricultural Hub
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full h-9 px-3 bg-card border border-border/60 rounded-md text-xs text-foreground focus:outline-none focus:border-primary"
                    placeholder="e.g. Dambatta Grain Cluster, Kano"
                  />
                </div>

                {/* Phone & National ID (Create mode only) */}
                {!isEditMode && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        Phone Number (MSISDN) <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.primaryContactPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, primaryContactPhone: e.target.value }))}
                        className="w-full h-9 px-3 bg-card border border-border/60 rounded-md text-xs text-foreground focus:outline-none focus:border-primary"
                        placeholder="+234 803 412 8901"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        National ID / Co-op ID
                      </label>
                      <input
                        type="text"
                        value={formData.nationalId}
                        onChange={(e) => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
                        className="w-full h-9 px-3 bg-card border border-border/60 rounded-md text-xs text-foreground focus:outline-none focus:border-primary"
                        placeholder="NIN-84920194821"
                      />
                    </div>
                  </div>
                )}

                {/* Status (Edit mode only) */}
                {isEditMode && (
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Disbursement Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as AccountStatus }))}
                      className="w-full h-9 px-3 bg-card border border-border/60 rounded-md text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </form>
            )}

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-card">
              <div className="text-[11px] text-muted-foreground/70 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-primary" />
                <span>Zero beneficiary deductions • 100% face-value cash OTC</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-3.5 py-2 sm:py-1.5 text-xs font-medium text-foreground bg-card border border-border/60 rounded-md hover:bg-secondary/40 transition-colors cursor-pointer min-h-[40px] sm:min-h-0"
                >
                  Cancel
                </button>

                {!isEditMode && modalTab === 'batch' ? (
                  <button
                    type="button"
                    onClick={handleBatchSubmit}
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
                ) : (
                  <button
                    type="button"
                    onClick={handleSingleSubmit}
                    disabled={isSubmitting || !formData.name.trim()}
                    className={cn(
                      'flex-1 sm:flex-none px-4 py-2 sm:py-1.5 text-xs font-medium text-white rounded-md transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer min-h-[40px] sm:min-h-0',
                      !isSubmitting && formData.name.trim()
                        ? 'bg-primary hover:bg-primary/90'
                        : 'bg-primary/50 cursor-not-allowed'
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{isEditMode ? 'Save Changes' : 'Send Money'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
