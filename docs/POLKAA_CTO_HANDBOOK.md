# The Polkaa CTO Engineering Handbook: MTN MoMo Enterprise Architecture

> **Author:** Joseph Nwankwo (Technical Team Lead / CTO) & Principal Fintech Systems Architect  
> **Product Lead & Originator:** Oladoyin Muhibi  
> **Organization:** Polkaa (`polkaa.ng`)  
> **Primary Rail Partner:** MTN Mobile Money (MoMo PSB Nigeria)  
> **Document Classification:** Internal Technical Standards & Architecture Reference  
> **Version:** 2.0.0 (MTN MoMo PSB Production Blueprint)

---

## Table of Contents
1. [The Strategic Thesis: Why Polkaa is Built Around MTN MoMo PSB](#1-the-strategic-thesis-why-polkaa-is-built-around-mtn-momo-psb)
2. [The MTN MoMo Bulk Disbursement Process & Lifecycle](#2-the-mtn-momo-bulk-disbursement-process--lifecycle)
3. [The Zero-Leakage Double-Entry Ledger Engine](#3-the-zero-leakage-double-entry-ledger-engine)
4. [The MTN MoMo API Technical Integration Specification](#4-the-mtn-momo-api-technical-integration-specification)
5. [Enterprise Security & Dual-Approval (Maker-Checker)](#5-enterprise-security--dual-approval-maker-checker)
6. [Phase 2 Migration Blueprint: In-Memory to PostgreSQL & Prisma](#6-phase-2-migration-blueprint-in-memory-to-postgresql--prisma)
7. [CTO Mastery Curriculum: Key Lessons for Joseph Nwankwo](#7-cto-mastery-curriculum-key-lessons-for-joseph-nwankwo)

---

## 1. The Strategic Thesis: Why Polkaa is Built Around MTN MoMo PSB

### 1.1 The Context of MTN MoMo’s ₦152 Billion Recapitalization
MTN Group recently injected **₦152.06 Billion** into MoMo PSB Nigeria to achieve Tier-1 regulatory capital adequacy and hired **Bode Abifarin** (former Chief Operating Officer of Flutterwave) as CEO of MoMo PSB.

MTN MoMo operates the largest physical agent infrastructure in Nigeria (>500,000 registered points), paired with the country’s most ubiquitous USSD string (`*671#`). However, MTN MoMo faces a major barrier to scaling corporate enterprise volume:
* **The Raw API Gap:** MTN MoMo’s Developer Portal and MoMo Business interfaces provide developer endpoints and retail merchant tools, but **do not provide institutional governance** (maker-checker authorization chains, zero-leakage kobo ledgers, 48-hour automated escrow float sweeps, or auditor-certified PDF receipts).
* **The Walled Garden Limitation:** Corporate clients have beneficiaries on Airtel, Glo, and 9mobile alongside MTN users, and need a unified solution that doesn't reject non-MTN recipients.

### 1.2 Polkaa’s Strategic Positioning
**Polkaa is the institutional enterprise suite built on top of MTN MoMo PSB.**
* We give corporate clients (AgriCorp, UN WFP, Julius Berger) a sovereign, Moniepoint/Stripe-grade treasury portal.
* We leverage **MTN MoMo PSB as our primary settlement rail and rural distribution network**.
* We convert unbanked and rural beneficiaries into active MTN MoMo users through seamless OTC cash pickup incentives, driving massive active volume across MTN’s rural agent network.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        POLKAA + MTN MoMo STACK                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ Enterprise Client ] ──► AgriCorp Nigeria / UN WFP / Julius Berger   │
│                                   │                                    │
│                                   ▼                                    │
│  [ POLKAA PLATFORM ]   ──► Dual-Approval Maker-Checker Suite           │
│                            Zero-Leakage Double-Entry Accounting        │
│                            48-Hour Automated Escrow Float Sweep        │
│                            Corporate Audit Certificates (PDF)          │
│                                   │                                    │
│                                   ▼ (Open API Integration)             │
│  [ MTN MoMo PSB RAILS ] ──► Pre-funded Escrow Float (`*671#`)          │
│                             MTN MoMo Bulk Disbursement API             │
│                             MTN MoMo Verified Agent Network (OTC Cash) │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The MTN MoMo Bulk Disbursement Process & Lifecycle

Polkaa's domain engine implements the strict 7-step enterprise disbursement process:

```
┌────────────────────────────────────────────────────────────────────────┐
│               POLKAA ➔ MTN MoMo DISBURSEMENT LIFECYCLE                 │
├────────────────────────────────────────────────────────────────────────┤
│ 1. PRE-FUNDED FLOAT CHECK : Verify corporate float on MoMo PSB balance │
│ 2. BATCH UPLOAD (MAKER)   : Ingest beneficiary roster (MSISDN + Name)  │
│ 3. ACCOUNT VALIDATION     : Pre-validate phone numbers on MoMo network │
│ 4. DUAL AUTHORIZATION     : Finance Director checker release signature │
│ 5. MoMo API DISPATCH      : Execute POST /disbursement/v1_0/transfer   │
│ 6. MoMo AGENT OTC CASHOUT : Beneficiary picks up 100% cash via *671#   │
│ 7. ZERO-LEAKAGE AUTO-SWEEP: Unclaimed vouchers revert after 48h        │
└────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Pre-Funded Float & Balance Verification
The enterprise funds a dedicated corporate escrow account with MTN MoMo PSB (e.g. ₦150,000,000 for AgriCorp). Before any disbursement instruction can be created, Polkaa verifies that:
$$\text{MoMo Escrow Float} \ge \sum \text{Batch Vouchers} + \text{Applicable Rail Fees}$$

### Step 2: Batch Upload (The Maker Step)
The Field Operations Lead (Hajiya Fatima Bello) uploads the beneficiary roster CSV (Full Name, MSISDN Phone Number, Agricultural Cluster, Grant Amount). The state enters `ALLOCATED (DRAFT)`.

### Step 3: Account Validation Check
Polkaa's engine queries the recipient phone numbers against the telco network to detect active MSISDNs. For recipients on MTN, it flags existing MoMo wallet eligibility; for recipients on other networks (Airtel, Glo), it configures the offline OTC Cash Point route.

### Step 4: Dual Authorization (The Checker Step)
The Finance Director (Dr. Aminu Garba) reviews the batch metrics, village clusters, and total capital allocation. Upon checker authorization, cryptographic signatures are affixed, and the engine triggers the disbursement.

### Step 5: MoMo API Transfer Dispatch
Polkaa calls MTN MoMo's `POST /disbursement/v1_0/transfer` with a unique UUID idempotency key (`X-Reference-Id`). The beneficiary receives a branded GSM SMS with a secure 6-digit OTC pickup token (e.g., `PK-749201`).

### Step 6: Recipient Cash-Out OTC at MTN MoMo Agents
The beneficiary visits any **MTN MoMo Verified Cash Point**. The agent enters the voucher code into their terminal or dials `*671#`. The beneficiary verifies via OTP, and the agent pays **100% face-value cash** (₦25,000) with **zero deductions**.

### Step 7: Zero-Leakage 48-Hour Auto-Sweep
If a voucher is unclaimed after 48 hours, Polkaa’s automated reconciliation sweep invalidates the token and credits 100% of the face value back to the client's corporate escrow float balance.

---

## 3. The Zero-Leakage Double-Entry Ledger Engine

### 3.1 Minor-Unit Math Invariant
Computers cannot accurately represent decimal fractions in binary floating-point (IEEE 754):
```javascript
0.1 + 0.2 === 0.30000000000000004 // TRUE
```
In Polkaa, **every financial amount is strictly stored and calculated as an integer count of Kobo** ($1 \text{ Naira} = 100 \text{ Kobo}$).
* ₦25,000.00 is represented as `2500000` kobo.
* ₦150,000,000.00 is represented as `15000000000` kobo.

### 3.2 The Treasury Invariant Equation
At every second, the ledger must balance to zero leakage:
$$\text{Total Program Budget} = \text{Cash Collected} + \text{Pending Pickup} + \text{Auto-Refunded} + \text{Available Float}$$

---

## 4. The MTN MoMo API Technical Integration Specification

### 4.1 Authentication & Environment
* **Sandbox Base URL:** `https://sandbox.momodeveloper.mtn.com`
* **Production Base URL:** `https://proxy.momoapi.mtn.com`
* **Auth Protocol:** OAuth 2.0 Bearer Token generated via API User & API Key.

```http
POST /disbursement/token/ HTTP/1.1
Host: proxy.momoapi.mtn.com
Authorization: Basic <base64(api_user:api_key)>
Ocp-Apim-Subscription-Key: <subscription_key>
```

### 4.2 Single Disbursement Instruction (`POST /transfer`)
To disburse funds to a beneficiary or agent settlement point:

```http
POST /disbursement/v1_0/transfer HTTP/1.1
Host: proxy.momoapi.mtn.com
Authorization: Bearer <oauth_token>
X-Reference-Id: 550e8400-e29b-41d4-a716-446655440000
X-Target-Environment: live
Ocp-Apim-Subscription-Key: <subscription_key>
Content-Type: application/json

{
  "amount": "25000",
  "currency": "NGN",
  "externalId": "PK-VCH-749201",
  "payee": {
    "partyIdType": "MSISDN",
    "partyId": "2348034128901"
  },
  "payerMessage": "AgriCorp Wet Season Grain Subsidy",
  "payeeNote": "Polkaa Verified Cash Point 100% Face Value"
}
```

### 4.3 Idempotency & Failure Recovery
* **The `X-Reference-Id` Rule:** In rural Nigeria, telco timeouts frequently occur while waiting for HTTP responses. Polkaa uses the voucher's deterministic UUID as `X-Reference-Id`. If the network times out, Polkaa retries the request safely—MTN MoMo will recognize the reference and return the existing status without charging the float twice.

---

## 5. Enterprise Security & Dual-Approval (Maker-Checker)

Enterprise compliance strictly prohibits single-signer disbursements. Polkaa enforces:
* **The Maker:** Field Operations Lead (Hajiya Fatima Bello) compiles the roster.
* **The Checker:** Finance Director (Dr. Aminu Garba) signs the cryptographic batch release.
* **The Audit Stamp:** Every downstream certificate embeds both signatures alongside the MTN MoMo transaction reference.

---

## 6. Phase 2 Migration Blueprint: In-Memory to PostgreSQL & Prisma

Our data models map 1-to-1 to production Prisma schemas:

```prisma
enum VoucherStatus {
  ALLOCATED
  PENDING_PICKUP
  CASH_COLLECTED
  AUTO_REFUNDED
}

model Voucher {
  id              String         @id @default(uuid())
  programId       String
  beneficiaryId   String
  amountKobo      BigInt         // In kobo (e.g. 2500000 = ₦25,000)
  status          VoucherStatus  @default(ALLOCATED)
  voucherToken    String         @unique // e.g. PK-749201
  momoReferenceId String?        // MTN MoMo X-Reference-Id
  momoAgentId     String?        // MTN MoMo Verified Agent Point
  signedByMaker   String
  signedByChecker String
  expiryTimestamp DateTime
  collectedAt     DateTime?
  createdAt       DateTime       @default(now())
}
```

---

## 7. CTO Mastery Curriculum: Key Lessons for Joseph Nwankwo

1. **Be the Aggregator, Not the Rail:** Building physical telco towers and POS hardware is a capital-intensive trap. Building the software layer that moves enterprise billions over MTN's ₦152B balance sheet is how multi-billion dollar fintechs are created.
2. **Eliminate Recipient Friction:** The rural farmer does not care about APIs. They care that an SMS arrived, they visited a MoMo agent, and they walked away with clean cash.
3. **Reconciliation is the Moat:** Enterprises stay with Polkaa because when auditors review their books, every single kobo matches the bank statement to the exact penny.
