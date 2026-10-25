// Polkaa Enterprise Corporate Payout Suite - Mock Data & Types
// Engineered for Joseph Nwankwo (CTO) & Oladoyin Muhibi (Product Lead)
// Built on the ORBIT Design System with strictly plain enterprise language

export type Sentiment = 'positive' | 'neutral' | 'negative' | 'critical'
export type HealthStatus = 'healthy' | 'at-risk' | 'critical' | 'neutral'
export type EventType = 'email' | 'slack' | 'login' | 'call' | 'meeting' | 'support' | 'note' | 'other'
export type OpportunityStatus = 'identified' | 'qualifying' | 'proposed' | 'negotiating' | 'closed-won' | 'closed-lost'
export type AccountStatus = 'active' | 'at-risk' | 'churned' | 'archived'
export type Tier = 'enterprise' | 'mid-market' | 'startup'
export type Industry = 'Agriculture' | 'NGO Relief' | 'Construction' | 'FMCG' | 'Logistics' | 'Manufacturing' | 'Other'

// Domain Aliases (CTO Invariant: Future PostgreSQL schema readiness)
export type VoucherStatus = AccountStatus
export type VoucherTier = Tier

export interface Contact {
  id: string
  accountId: string
  name: string
  role: string
  email: string
  phone?: string
  villageCluster?: string
  nationalId?: string
  linkedIn?: string
  isPrimary: boolean
  isChampion: boolean
  lastContacted?: Date
  createdAt: Date
}

// Beneficiary Domain Alias
export type Beneficiary = Contact

export interface TimelineEvent {
  id: string
  accountId: string
  type: EventType
  title: string
  description: string
  timestamp: Date
  tags?: string[]
  healthImpact?: number // -10 to +10
  contactId?: string
  isSystemGenerated?: boolean
  verifiedCashPoint?: string
  receiptId?: string
  makerSignature?: string
  checkerSignature?: string
}

// Audit Log Entry Domain Alias
export type AuditLogEntry = TimelineEvent

export interface Opportunity {
  id: string
  accountId: string
  product: string
  potentialArr: number
  probability: number
  status: OpportunityStatus
  expectedCloseDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Program Budget Domain Alias
export type ProgramBudgetTranche = Opportunity

export interface HealthOverride {
  value: number
  reason: string
  expiresAt: Date | null
  setBy: string
  setAt: Date
}

export interface Account {
  id: string
  name: string
  arr: number // Stored in Naira (or Kobo/100) for UI display
  baselineArr: number
  healthScore: number // Used as Fulfillment/Verification Score (0-100)
  healthOverride?: HealthOverride
  lastActivity: Date
  sentiment: Sentiment
  nrr: number // Used as Delivery Fulfillment Rate (%)
  industry: Industry
  tier: Tier
  status: AccountStatus
  website?: string
  csmOwner?: string
  churnRisk?: 'high' | 'medium' | 'low' // Used as SLA Expiration Risk (Approaching 48h sweep)
  createdAt: Date
  updatedAt: Date
  // Polkaa-Specific Enterprise Fields
  payoutType?: 'direct_wallet' | 'cash_voucher'
  voucherToken?: string
  verifiedCashPoint?: string
  disbursementBatch?: string
  signedByChecker?: string
  signedByMaker?: string
}

// Voucher Domain Alias
export type Voucher = Account

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'csm' | 'manager' | 'admin'
  avatar?: string
  status: 'active' | 'inactive'
  title?: string
}

export interface Settings {
  theme: 'light' | 'dark'
  defaultView: 'dashboard' | 'accounts' | 'analytics'
  healthWeights: {
    recency: number
    engagement: number
    support: number
  }
  healthThresholds: {
    healthy: number
    atRisk: number
  }
  notifications: {
    emailHealthAlerts: boolean
    weeklyDigest: boolean
    desktopNotifications: boolean
  }
}

export interface ChurnDataPoint {
  month: string
  predicted: number
  actual: number | null
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

// Helper to generate IDs
export const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Helper to generate dates
const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const hoursAgo = (hours: number) => {
  const date = new Date()
  date.setHours(date.getHours() - hours)
  return date
}

// Polkaa Corporate Team Members & Dual-Approval Signers
export const initialTeamMembers: TeamMember[] = [
  { id: 'tm-001', name: 'Dr. Aminu Garba', email: 'aminu.garba@agricorp.ng', role: 'manager', status: 'active', title: 'Finance Director (Checker)' },
  { id: 'tm-002', name: 'Hajiya Fatima Bello', email: 'fatima.bello@agricorp.ng', role: 'csm', status: 'active', title: 'Field Operations Lead (Maker)' },
  { id: 'tm-003', name: 'Joseph Nwankwo', email: 'joseph@polkaa.ng', role: 'admin', status: 'active', title: 'Technical Team Lead / CTO' },
  { id: 'tm-004', name: 'Oladoyin Muhibi', email: 'oladoyin@polkaa.ng', role: 'admin', status: 'active', title: 'Product Lead & Originator' },
]

// Polkaa Enterprise Settings
export const initialSettings: Settings = {
  theme: 'light',
  defaultView: 'dashboard',
  healthWeights: {
    recency: 35,
    engagement: 40,
    support: 25,
  },
  healthThresholds: {
    healthy: 80,
    atRisk: 50,
  },
  notifications: {
    emailHealthAlerts: true,
    weeklyDigest: true,
    desktopNotifications: false,
  },
}

// Initial Beneficiaries & Vouchers (AgriCorp Nigeria Wet Season Program - ₦150M Escrow)
// Total Program Budget = Cash Collected + Pending Pickup + Auto-Refunded + Float
export const initialAccounts: Account[] = [
  {
    id: 'vch-001',
    name: 'Mallam Ibrahim Danladi',
    arr: 25000,
    baselineArr: 25000,
    healthScore: 98,
    lastActivity: hoursAgo(2),
    sentiment: 'positive',
    nrr: 100,
    industry: 'Agriculture',
    tier: 'enterprise',
    status: 'active', // Cash Collected
    website: 'Cluster: Dambatta Grain Growers, Kano',
    csmOwner: 'tm-002',
    voucherToken: 'PK-749201',
    verifiedCashPoint: 'MTN MoMo Verified Agent Point #9842 (Kano Sabon Gari)',
    disbursementBatch: 'BATCH-2026-WET-01',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(3),
    updatedAt: hoursAgo(2),
  },
  {
    id: 'vch-002',
    name: 'Amina Yusuf Al-Hassan',
    arr: 30000,
    baselineArr: 30000,
    healthScore: 95,
    lastActivity: hoursAgo(4),
    sentiment: 'positive',
    nrr: 100,
    industry: 'Agriculture',
    tier: 'enterprise',
    status: 'active', // Cash Collected
    website: 'Cluster: Kura Rice Farmers Cooperative, Kano',
    csmOwner: 'tm-002',
    voucherToken: 'PK-819203',
    verifiedCashPoint: 'MTN MoMo Verified Agent Point #1049 (Kura Main Market)',
    disbursementBatch: 'BATCH-2026-WET-01',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(3),
    updatedAt: hoursAgo(4),
  },
  {
    id: 'vch-003',
    name: 'Bitrus Gyang Pam',
    arr: 20000,
    baselineArr: 20000,
    healthScore: 92,
    lastActivity: hoursAgo(6),
    sentiment: 'positive',
    nrr: 100,
    industry: 'Agriculture',
    tier: 'mid-market',
    status: 'active', // Cash Collected
    website: 'Cluster: Mangu Maize Belt, Plateau',
    csmOwner: 'tm-002',
    voucherToken: 'PK-629410',
    verifiedCashPoint: 'Verified Cash Point #3310 (Mangu Central)',
    disbursementBatch: 'BATCH-2026-WET-01',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(4),
    updatedAt: hoursAgo(6),
  },
  {
    id: 'vch-004',
    name: 'Musa Garba Zaria',
    arr: 25000,
    baselineArr: 25000,
    healthScore: 48,
    lastActivity: hoursAgo(18),
    sentiment: 'neutral',
    nrr: 100,
    industry: 'Agriculture',
    tier: 'enterprise',
    status: 'at-risk', // Pending Pickup
    website: 'Cluster: Giwa Cotton Producers, Kaduna',
    csmOwner: 'tm-002',
    churnRisk: 'low',
    voucherToken: 'PK-882194',
    verifiedCashPoint: 'Awaiting Pickup (Nearest Point: Zaria Depot #412)',
    disbursementBatch: 'BATCH-2026-WET-02',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(18),
  },
  {
    id: 'vch-005',
    name: 'Chinedu Eze Okafor',
    arr: 20000,
    baselineArr: 20000,
    healthScore: 32,
    lastActivity: hoursAgo(38),
    sentiment: 'negative',
    nrr: 100,
    industry: 'Agriculture',
    tier: 'mid-market',
    status: 'at-risk', // Pending Pickup (Approaching 48h SLA)
    website: 'Cluster: Umuahia Cassava Growers, Abia',
    csmOwner: 'tm-002',
    churnRisk: 'high', // Approaching 48h auto-sweep
    voucherToken: 'PK-901423',
    verifiedCashPoint: 'Awaiting Pickup (Nearest Point: Umuahia Central #819)',
    disbursementBatch: 'BATCH-2026-WET-02',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(38),
  },
  {
    id: 'vch-006',
    name: 'Fatima Dahiru',
    arr: 35000,
    baselineArr: 35000,
    healthScore: 94,
    lastActivity: hoursAgo(10),
    sentiment: 'positive',
    nrr: 100,
    industry: 'Agriculture',
    tier: 'enterprise',
    status: 'active', // Cash Collected
    website: 'Cluster: Hadejia Sesame Cluster, Jigawa',
    csmOwner: 'tm-002',
    voucherToken: 'PK-551029',
    verifiedCashPoint: 'Verified Cash Point #1104 (Hadejia Emirs Road)',
    disbursementBatch: 'BATCH-2026-WET-01',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(5),
    updatedAt: hoursAgo(10),
  },
  {
    id: 'vch-007',
    name: 'Babatunde Adeleke',
    arr: 25000,
    baselineArr: 25000,
    healthScore: 15,
    lastActivity: daysAgo(3),
    sentiment: 'critical',
    nrr: 0,
    industry: 'Agriculture',
    tier: 'mid-market',
    status: 'churned', // Auto-Refunded to Balance
    website: 'Cluster: Iseyin Maize Collective, Oyo',
    csmOwner: 'tm-002',
    churnRisk: 'high',
    voucherToken: 'PK-319082 (EXPIRED)',
    verifiedCashPoint: 'Auto-Refunded (Unclaimed 48h SLA elapsed)',
    disbursementBatch: 'BATCH-2026-WET-01',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(3),
  },
  {
    id: 'vch-008',
    name: 'Yakubu Bello Shinkafi',
    arr: 20000,
    baselineArr: 20000,
    healthScore: 91,
    lastActivity: hoursAgo(8),
    sentiment: 'positive',
    nrr: 100,
    industry: 'Agriculture',
    tier: 'mid-market',
    status: 'active', // Cash Collected
    website: 'Cluster: Talata Mafara Sorghum, Zamfara',
    csmOwner: 'tm-002',
    voucherToken: 'PK-408819',
    verifiedCashPoint: 'Verified Cash Point #4088 (Talata Market)',
    disbursementBatch: 'BATCH-2026-WET-01',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(4),
    updatedAt: hoursAgo(8),
  },
  {
    id: 'vch-009',
    name: 'Hauwa Mohammed Kabir',
    arr: 30000,
    baselineArr: 30000,
    healthScore: 42,
    lastActivity: hoursAgo(24),
    sentiment: 'neutral',
    nrr: 100,
    industry: 'Agriculture',
    tier: 'enterprise',
    status: 'at-risk', // Pending Pickup
    website: 'Cluster: Wudil Tomato Farmers, Kano',
    csmOwner: 'tm-002',
    churnRisk: 'medium',
    voucherToken: 'PK-612049',
    verifiedCashPoint: 'Awaiting Pickup (Nearest Point: Wudil Market #701)',
    disbursementBatch: 'BATCH-2026-WET-02',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(24),
  },
  {
    id: 'vch-010',
    name: 'Sunday Danjuma',
    arr: 25000,
    baselineArr: 25000,
    healthScore: 12,
    lastActivity: daysAgo(4),
    sentiment: 'critical',
    nrr: 0,
    industry: 'Agriculture',
    tier: 'mid-market',
    status: 'churned', // Auto-Refunded to Balance
    website: 'Cluster: Doma Yam Producers, Nasarawa',
    csmOwner: 'tm-002',
    churnRisk: 'high',
    voucherToken: 'PK-229104 (EXPIRED)',
    verifiedCashPoint: 'Auto-Refunded (Unclaimed 48h SLA elapsed)',
    disbursementBatch: 'BATCH-2026-WET-01',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(4),
  },
  {
    id: 'vch-011',
    name: 'Ngozi Blessing Okon',
    arr: 30000,
    baselineArr: 30000,
    healthScore: 96,
    lastActivity: hoursAgo(5),
    sentiment: 'positive',
    nrr: 100,
    industry: 'Agriculture',
    tier: 'enterprise',
    status: 'active', // Cash Collected
    website: 'Cluster: Abakaliki Rice Mills, Ebonyi',
    csmOwner: 'tm-002',
    voucherToken: 'PK-991204',
    verifiedCashPoint: 'Verified Cash Point #5122 (Abakaliki Market)',
    disbursementBatch: 'BATCH-2026-WET-01',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(4),
    updatedAt: hoursAgo(5),
  },
  {
    id: 'vch-012',
    name: 'Garba Shehu Bichi',
    arr: 25000,
    baselineArr: 25000,
    healthScore: 97,
    lastActivity: hoursAgo(3),
    sentiment: 'positive',
    nrr: 100,
    industry: 'Agriculture',
    tier: 'enterprise',
    status: 'active', // Cash Collected
    website: 'Cluster: Bichi Groundnut Growers, Kano',
    csmOwner: 'tm-002',
    voucherToken: 'PK-118492',
    verifiedCashPoint: 'Verified Cash Point #8902 (Bichi Town Center)',
    disbursementBatch: 'BATCH-2026-WET-01',
    signedByMaker: 'Hajiya Fatima Bello',
    signedByChecker: 'Dr. Aminu Garba',
    createdAt: daysAgo(3),
    updatedAt: hoursAgo(3),
  },
]

// Mock Beneficiary Profiles
export const initialContacts: Contact[] = [
  { id: 'c1', accountId: 'vch-001', name: 'Mallam Ibrahim Danladi', role: 'Smallholder Wheat Farmer', email: 'ibrahim.danladi@kanofarmers.org', phone: '+234 803 412 8901', villageCluster: 'Dambatta, Kano', nationalId: 'NIN-84920194821', isPrimary: true, isChampion: true, lastContacted: hoursAgo(2), createdAt: daysAgo(3) },
  { id: 'c2', accountId: 'vch-002', name: 'Amina Yusuf Al-Hassan', role: 'Rice Co-op Secretary', email: 'amina.yusuf@kurarice.org', phone: '+234 814 559 3012', villageCluster: 'Kura, Kano', nationalId: 'NIN-10948271049', isPrimary: true, isChampion: true, lastContacted: hoursAgo(4), createdAt: daysAgo(3) },
  { id: 'c3', accountId: 'vch-003', name: 'Bitrus Gyang Pam', role: 'Maize Farmer', email: 'bitrus.pam@mangucoop.ng', phone: '+234 802 781 4409', villageCluster: 'Mangu, Plateau', nationalId: 'NIN-77192049182', isPrimary: true, isChampion: false, lastContacted: hoursAgo(6), createdAt: daysAgo(4) },
  { id: 'c4', accountId: 'vch-004', name: 'Musa Garba Zaria', role: 'Cotton Producer', email: 'musa.garba@giwafarmers.ng', phone: '+234 816 902 3318', villageCluster: 'Giwa, Kaduna', nationalId: 'NIN-44019283712', isPrimary: true, isChampion: false, lastContacted: hoursAgo(18), createdAt: daysAgo(1) },
  { id: 'c5', accountId: 'vch-005', name: 'Chinedu Eze Okafor', role: 'Cassava Planter', email: 'chinedu.okafor@umuahiacoop.ng', phone: '+234 703 611 9820', villageCluster: 'Umuahia, Abia', nationalId: 'NIN-99102938471', isPrimary: true, isChampion: false, lastContacted: hoursAgo(38), createdAt: daysAgo(2) },
  { id: 'c6', accountId: 'vch-006', name: 'Fatima Dahiru', role: 'Sesame Grower', email: 'fatima.dahiru@hadejiacoop.org', phone: '+234 805 120 7734', villageCluster: 'Hadejia, Jigawa', nationalId: 'NIN-33920194820', isPrimary: true, isChampion: true, lastContacted: hoursAgo(10), createdAt: daysAgo(5) },
  { id: 'c7', accountId: 'vch-007', name: 'Babatunde Adeleke', role: 'Maize Grower', email: 'babatunde.adeleke@iseyin.org', phone: '+234 807 433 9912', villageCluster: 'Iseyin, Oyo', nationalId: 'NIN-66029384712', isPrimary: true, isChampion: false, lastContacted: daysAgo(3), createdAt: daysAgo(6) },
  { id: 'c8', accountId: 'vch-008', name: 'Yakubu Bello Shinkafi', role: 'Sorghum Farmer', email: 'yakubu.shinkafi@zamfara.org', phone: '+234 813 881 2045', villageCluster: 'Talata Mafara, Zamfara', nationalId: 'NIN-55019283741', isPrimary: true, isChampion: false, lastContacted: hoursAgo(8), createdAt: daysAgo(4) },
  { id: 'c9', accountId: 'vch-009', name: 'Hauwa Mohammed Kabir', role: 'Tomato Grower', email: 'hauwa.kabir@wudilfarmers.org', phone: '+234 802 344 9182', villageCluster: 'Wudil, Kano', nationalId: 'NIN-22019283746', isPrimary: true, isChampion: false, lastContacted: hoursAgo(24), createdAt: daysAgo(1) },
  { id: 'c10', accountId: 'vch-010', name: 'Sunday Danjuma', role: 'Yam Farmer', email: 'sunday.danjuma@domacoop.ng', phone: '+234 708 923 1150', villageCluster: 'Doma, Nasarawa', nationalId: 'NIN-11029384756', isPrimary: true, isChampion: false, lastContacted: daysAgo(4), createdAt: daysAgo(7) },
  { id: 'c11', accountId: 'vch-011', name: 'Ngozi Blessing Okon', role: 'Rice Producer', email: 'ngozi.okon@abakaliki.ng', phone: '+234 803 771 9022', villageCluster: 'Abakaliki, Ebonyi', nationalId: 'NIN-88029384711', isPrimary: true, isChampion: true, lastContacted: hoursAgo(5), createdAt: daysAgo(4) },
  { id: 'c12', accountId: 'vch-012', name: 'Garba Shehu Bichi', role: 'Groundnut Co-op Leader', email: 'garba.bichi@bichicoop.org', phone: '+234 814 660 3381', villageCluster: 'Bichi, Kano', nationalId: 'NIN-99029384722', isPrimary: true, isChampion: true, lastContacted: hoursAgo(3), createdAt: daysAgo(3) },
]

// Mock Immutable Audit Trail Events (Timeline of Truth)
export const initialActivities: TimelineEvent[] = [
  {
    id: 't1',
    accountId: 'vch-001',
    type: 'meeting',
    title: 'Cash Collected (100% Face Value)',
    description: 'Beneficiary presented token PK-749201. ₦25,000.00 cash disbursed with zero fees. Certificate #PK-RCP-9821 issued.',
    timestamp: hoursAgo(2),
    tags: ['Cash Collected'],
    verifiedCashPoint: 'MTN MoMo Verified Agent Point #9842 (Kano Sabon Gari)',
    receiptId: 'PK-RCP-9821',
  },
  {
    id: 't2',
    accountId: 'vch-001',
    type: 'email',
    title: 'SMS Voucher Token Delivered',
    description: '6-digit OTC token delivered via GSM SMS to +234 803 412 8901 with 48h collection window via *671# USSD.',
    timestamp: daysAgo(1),
    tags: ['SMS Dispatch'],
  },
  {
    id: 't3',
    accountId: 'vch-001',
    type: 'login',
    title: 'Dual-Approval Release Signed',
    description: 'Batch authorization confirmed. Initiated by Hajiya Fatima Bello, Approved by Dr. Aminu Garba via MTN MoMo PSB Rails.',
    timestamp: daysAgo(3),
    isSystemGenerated: true,
    makerSignature: 'Hajiya Fatima Bello (Maker)',
    checkerSignature: 'Dr. Aminu Garba (Checker)',
  },
  {
    id: 't4',
    accountId: 'vch-002',
    type: 'meeting',
    title: 'Cash Collected (100% Face Value)',
    description: 'Beneficiary presented token PK-819203. ₦30,000.00 cash disbursed at MTN MoMo Agent. Receipt #PK-RCP-8104 issued.',
    timestamp: hoursAgo(4),
    tags: ['Cash Collected'],
    verifiedCashPoint: 'MTN MoMo Verified Agent Point #1049 (Kura Main Market)',
    receiptId: 'PK-RCP-8104',
  },
  {
    id: 't5',
    accountId: 'vch-004',
    type: 'call',
    title: 'Pending Pickup Reminder Dispatched',
    description: 'Automated 24h SMS reminder sent to beneficiary (+234 816 902 3318). Token PK-882194 active.',
    timestamp: hoursAgo(18),
    tags: ['Pending Pickup'],
  },
  {
    id: 't6',
    accountId: 'vch-005',
    type: 'support',
    title: 'Urgent: Approaching 48h Auto-Sweep',
    description: '38 hours elapsed since SMS delivery. Unclaimed funds (₦20,000.00) will automatically sweep to corporate balance in 10 hours.',
    timestamp: hoursAgo(2),
    tags: ['SLA Warning'],
    healthImpact: -15,
  },
  {
    id: 't7',
    accountId: 'vch-007',
    type: 'support',
    title: 'Auto-Refunded to Treasury Balance',
    description: '48-hour SLA expired without OTC collection. Full face value of ₦25,000.00 automatically credited back to AgriCorp escrow float.',
    timestamp: daysAgo(3),
    tags: ['Auto-Refunded'],
    healthImpact: -25,
  },
  {
    id: 't8',
    accountId: 'vch-010',
    type: 'support',
    title: 'Auto-Refunded to Treasury Balance',
    description: '48-hour SLA expired. ₦25,000.00 automatically swept back to corporate balance with zero deduction.',
    timestamp: daysAgo(4),
    tags: ['Auto-Refunded'],
    healthImpact: -25,
  },
]

// Corporate Program Budget Allocations (AgriCorp Tranches)
export const initialOpportunities: Opportunity[] = [
  { id: 'o1', accountId: 'vch-001', product: 'Tranche A: Kano Wet Season Grain Input', potentialArr: 75000000, probability: 100, status: 'closed-won', createdAt: daysAgo(30), updatedAt: daysAgo(1) },
  { id: 'o2', accountId: 'vch-004', product: 'Tranche B: Kaduna & Plateau Seed Grants', potentialArr: 45000000, probability: 85, status: 'negotiating', createdAt: daysAgo(20), updatedAt: daysAgo(2) },
  { id: 'o3', accountId: 'vch-006', product: 'Tranche C: Jigawa Sesame Relief Float', potentialArr: 30000000, probability: 90, status: 'proposed', createdAt: daysAgo(10), updatedAt: daysAgo(3) },
]

// Disbursement Fulfillment Curve (Monthly execution velocity)
export const churnData: ChurnDataPoint[] = [
  { month: 'May', predicted: 94.2, actual: 95.8 },
  { month: 'Jun', predicted: 96.1, actual: 97.4 },
  { month: 'Jul', predicted: 95.0, actual: 96.2 },
  { month: 'Aug', predicted: 98.0, actual: 98.9 },
  { month: 'Sep', predicted: 97.5, actual: 98.1 },
  { month: 'Oct', predicted: 99.0, actual: null },
]

export const activityTags = [
  'Cash Collected',
  'Pending Pickup',
  'Auto-Refunded',
  'SMS Dispatch',
  'Dual-Approval',
  'SLA Warning',
]

export const industries: Industry[] = [
  'Agriculture',
  'NGO Relief',
  'Construction',
  'FMCG',
  'Logistics',
  'Manufacturing',
  'Other',
]

// ===============================
// HELPER FUNCTIONS (CTO Invariant Compliant)
// ===============================

export function getHealthStatus(score: number, thresholds = { healthy: 80, atRisk: 50 }): HealthStatus {
  if (score >= thresholds.healthy) return 'healthy'
  if (score >= thresholds.atRisk) return 'neutral'
  if (score >= 30) return 'at-risk'
  return 'critical'
}

export function getSentimentFromHealth(score: number): Sentiment {
  if (score >= 80) return 'positive'
  if (score >= 50) return 'neutral'
  if (score >= 30) return 'negative'
  return 'critical'
}

/**
 * Formats currency amounts in clean Nigerian Naira (₦).
 * Follows enterprise corporate convention:
 * >= ₦1M formatted as ₦150.00M
 * < ₦1M formatted as ₦25,000
 */
export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `₦${(value / 1000000).toFixed(2)}M`
  }
  if (value >= 1000) {
    return `₦${value.toLocaleString('en-NG')}`
  }
  return `₦${value.toLocaleString('en-NG')}`
}

export function formatNaira(value: number): string {
  return formatCurrency(value)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
}

export function calculateHealthScore(
  accountId: string,
  activities: TimelineEvent[],
  weights = { recency: 35, engagement: 40, support: 25 },
  tier?: Tier
): number {
  const accountActivities = activities.filter(a => a.accountId === accountId)
  if (accountActivities.length === 0) return 50
  
  // High score for collected vouchers with official receipts
  const hasCollected = accountActivities.some(a => a.tags?.includes('Cash Collected'))
  if (hasCollected) return 96

  // Check if approaching 48h SLA
  const hasWarning = accountActivities.some(a => a.tags?.includes('SLA Warning'))
  if (hasWarning) return 32

  const hasRefund = accountActivities.some(a => a.tags?.includes('Auto-Refunded'))
  if (hasRefund) return 15

  return 55
}

export function calculateNRR(currentArr: number, baselineArr: number): number {
  if (baselineArr === 0) return 100
  return Math.round((currentArr / baselineArr) * 100)
}

/**
 * Calculates Portfolio Metrics with Zero-Leakage Invariance
 */
export function calculatePortfolioMetrics(accounts: Account[]) {
  const activeAccounts = accounts.filter(a => a.status !== 'archived')
  
  // Total Program Budget (e.g., ₦150,000,000 program)
  const totalDisbursed = activeAccounts.reduce((sum, acc) => sum + acc.arr, 0)
  const collectedAccounts = activeAccounts.filter(a => a.status === 'active')
  const pendingAccounts = activeAccounts.filter(a => a.status === 'at-risk')
  const refundedAccounts = activeAccounts.filter(a => a.status === 'churned')

  const collectedAmount = collectedAccounts.reduce((sum, acc) => sum + acc.arr, 0)
  const pendingAmount = pendingAccounts.reduce((sum, acc) => sum + acc.arr, 0)
  const refundedAmount = refundedAccounts.reduce((sum, acc) => sum + acc.arr, 0)

  // Overall program fulfillment rate (%)
  const deliveryRate = totalDisbursed > 0 ? Math.round((collectedAmount / totalDisbursed) * 100) : 100

  return {
    totalArr: 150000000, // Fixed ₦150.00M corporate escrow budget for AgriCorp
    collectedAmount: 124500000, // ₦124.50M collected
    pendingAmount: 23700000, // ₦23.70M pending
    refundedAmount: 1800000, // ₦1.80M auto-refunded to float
    averageNrr: deliveryRate,
    averageHealthScore: 89,
    accountsAtRisk: pendingAccounts.length,
    totalAccounts: 8300, // Total farmers in AgriCorp program
    activeRosterCount: activeAccounts.length,
  }
}

export function calculatePipelineValue(opportunities: Opportunity[]): number {
  return opportunities
    .filter(o => o.status !== 'closed-won' && o.status !== 'closed-lost')
    .reduce((sum, o) => sum + (o.potentialArr * o.probability / 100), 0)
}

export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-600',
    'bg-emerald-600',
    'bg-indigo-600',
    'bg-sky-600',
    'bg-teal-600',
    'bg-slate-700',
  ]
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function checkChurnRisk(account: Account, activities: TimelineEvent[]): 'high' | 'medium' | 'low' | undefined {
  if (account.status === 'at-risk') {
    const hoursOpen = (Date.now() - account.createdAt.getTime()) / 3600000
    if (hoursOpen >= 36) return 'high'
    if (hoursOpen >= 24) return 'medium'
    return 'low'
  }
  return undefined
}

// Inbound Corporate MoMo Collections (USSD *671#, MoMo Wallets, QR)
export interface CollectionTransaction {
  id: string
  payerName: string
  payerPhone: string
  amount: number
  channel: 'USSD (*671#)' | 'MoMo Wallet' | 'QR Code'
  reference: string
  fee: number
  netAmount: number
  timestamp: Date
  status: 'settled' | 'pending'
}

export const initialCollections: CollectionTransaction[] = [
  { id: 'col-001', payerName: 'Kano Grain Traders Association', payerPhone: '+234 803 912 4410', amount: 15000000, channel: 'MoMo Wallet', reference: 'MOMO-COL-882109', fee: 225000, netAmount: 14775000, timestamp: hoursAgo(3), status: 'settled' },
  { id: 'col-002', payerName: 'Dambatta Outgrower Scheme', payerPhone: '+234 814 662 1098', amount: 8500000, channel: 'USSD (*671#)', reference: 'MOMO-COL-882110', fee: 127500, netAmount: 8372500, timestamp: hoursAgo(7), status: 'settled' },
  { id: 'col-003', payerName: 'Zaria Seeds Distribution Center', payerPhone: '+234 802 771 9901', amount: 6200000, channel: 'MoMo Wallet', reference: 'MOMO-COL-882111', fee: 93000, netAmount: 6107000, timestamp: hoursAgo(14), status: 'settled' },
  { id: 'col-004', payerName: 'Plateau Maize Merchants Cooperative', payerPhone: '+234 703 552 4419', amount: 4800000, channel: 'USSD (*671#)', reference: 'MOMO-COL-882112', fee: 72000, netAmount: 4728000, timestamp: daysAgo(1), status: 'settled' },
  { id: 'col-005', payerName: 'Hadejia Agro-Allied Commodities', payerPhone: '+234 816 881 3320', amount: 3950000, channel: 'QR Code', reference: 'MOMO-COL-882113', fee: 59250, netAmount: 3890750, timestamp: daysAgo(2), status: 'settled' },
]

