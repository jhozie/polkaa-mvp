# GEMINI.MD — POLKAA CORE ENGINEERING RULES & SYSTEM PROMPT

> **Project:** Polkaa Enterprise Corporate Payout Suite (Powered by MTN MoMo PSB)  
> **Domain:** polkaa.ng  
> **Primary Rail Partner:** MTN Mobile Money (MoMo PSB Nigeria)  
> **Technical Team Lead / CTO:** Joseph Nwankwo  
> **Product Lead & Originator:** Oladoyin Muhibi  
> **Status:** Active Production Rules (Mandatory for all AI and Human Contributors)

---

## 1. MISSION & THE MTN MoMo STRATEGIC MANDATE

1. **Core Architecture:** Polkaa is an institutional corporate disbursement and cash grant suite built specifically around the **MTN MoMo PSB infrastructure and Open API ecosystem**. It enables enterprise conglomerates (AgriCorp), international NGOs (UN WFP), and large construction employers to disburse mass cash grants to unbanked and rural beneficiaries using MTN MoMo's vast agent network, USSD (*671#) rails, and pre-funded float accounts.
2. **Attribution:**
   - **Oladoyin Muhibi** is Co-Founder, Product Lead & Originator.
   - **Joseph Nwankwo** is Technical Team Lead & CTO.
   - Never alter or invert these roles.

---

## 2. THE MTN MoMo BULK DISBURSEMENT PROCESS FLOW

The MVP and domain engine strictly follow the official MTN MoMo bulk disbursement lifecycle:

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

---

## 3. THE RULE OF CORPORATE PLAIN LANGUAGE & BRANDING

The UI must balance institutional corporate elegance with the everyday language of Nigerian fintech (like Moniepoint, OPay, and Kuda). Strictly avoid foreign academic textbook jargon:

| FORBIDDEN JARGON / BUZZWORD | MANDATORY EVERYDAY NIGERIAN FINTECH TERM | WHAT IT ACTUALLY MEANS |
|---|---|---|
| **Corporate MoMo Float** | **Company Wallet Balance** (or **Available Balance**) | Real money sitting in the company wallet ready to send. |
| **Cash Voucher / Token** | **Withdrawal Code** (or **Cashout Code**) | 6-digit SMS code a farmer collects cash with at an agent. |
| **OTC Cashout / OTC Fulfillment**| **Cash at Agent** | Walking to a local shop agent to collect physical paper Naira. |
| **Direct MoMo Wallet** | **Direct to Phone** | Money sent straight into their registered phone number. |
| **Auto-Sweep Reversal** | **Returned to Balance** | Unclaimed cash automatically returns to wallet after 48h. |
| **Maker-Checker Dual Approval** | **Two-Person Approval (PIN)** | Prepared by staff, approved by Director with 4-digit PIN (`4821`). |
| **Inflow vs. Outflow** | **Money In & Money Out** | Money received from customers vs. money paid out to farmers. |

---

## 4. THE RULE OF FINANCIAL INVARIANCE (ZERO LEAKAGE)

1. **Integer Minor Units Only:** All financial amounts are stored, computed, and transitioned in integer minor units (**kobo as `int64` / `number`**).
   - Example: ₦25,000.00 is strictly stored as `2500000`.
   - Never use floating point decimals for currency arithmetic.
2. **The Treasury Balance Equation:**
   $$\text{Total Program Budget} = \text{Money Sent} + \text{Awaiting Cashout} + \text{Returned to Balance} + \text{Available Wallet Balance}$$
3. **Presentation Layer Formatting:** Convert kobo to Naira only at the final view layer using `formatCurrency(kobo)` with `tabular-nums`.

---

## 5. THE RULE OF DESIGN PURITY (ORBIT DESIGN SYSTEM)

1. **Design Tokens:**
   - Background: `#FAFBFC`
   - Foreground: `#0F172A`
   - Primary Accent: Royal Blue `#004F71` 
   - Verification & Brand Accent: Sunshine Yellow `#FFCC05`
   - Supporting Accents: MoMo Dark Blue `#003654`, MoMo Light Blue `#4D849C`, Extra Light `#CCDCE3`
   - Border: `rgba(15, 23, 42, 0.06)`
   - Cards: `#FFFFFF` with ultra-subtle box shadow
   - Border Radius: `6px` (`rounded-md`)
2. **Typography & Tabular Numerals:** Strictly **Geist Sans** (`font-sans`) with `tabular-nums` for all financial figures, codes, and timestamps. Zero `font-mono` across all UI views and tables.
3. **Icons:** Exclusively `lucide-react` with standard stroke width.

---

## 6. THE RULE OF CTO MENTORSHIP & CONTINUOUS LEARNING

1. **Fintech Architecture Mastery:** Document all MTN MoMo API patterns (OAuth 2.0 Bearer tokens, `X-Reference-Id` idempotency, callback webhooks, float reconciliation) in the **Polkaa CTO Engineering Handbook**.
2. **Role:** Pair program as Senior Principal Fintech Systems Architect with Joseph Nwankwo as CTO.

---

## 7. THE RULE OF MOBILE RESPONSIVENESS & TOUCH ERGONOMICS (THE FINTECH STANDARD)

Mobile responsiveness is a safety-critical requirement. In financial applications, squeezed interfaces, hidden data, or misplaced touch targets lead to catastrophic payment errors. Every view in Polkaa must comply with the following mobile standards:

### 1. Viewport & Breakpoint Targets
* **Small Mobile (360px – 389px):** Common Android devices in Nigeria (Tecno, Infinix, itel). All layouts must render cleanly down to 360px with zero horizontal page scroll.
* **Standard Mobile (390px – 428px):** Modern smartphones (iPhone, Samsung Galaxy, Pixel).
* **Tablet / Desktop (≥768px `md:`, ≥1024px `lg:`):** Standard expanded workspace.

### 2. Dual-Shell Navigation Architecture
* **Desktop (≥768px):** Left vertical `CommandDock` sidebar (collapsible between 64px and 220px). Top minimal bar with screen title, quick actions, and `⌘K` search palette.
* **Mobile (<768px):**
  * The vertical sidebar MUST be hidden (`hidden md:flex`). It must never consume horizontal screen space on mobile.
  * **Bottom Navigation Bar:** Fixed at the bottom (`fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/50 h-16 pb-safe`). Provides 5 thumb-accessible tabs (Overview, Payouts, Collections, Reports, Settings).
  * **Top Mobile Header:** Slim `h-14` header showing Polkaa brand mark, active view name, and tap trigger for `⌘K` search.

### 3. Adaptive Table-to-Card Transformation (Zero Squeezed Tables)
* Traditional multi-column data tables (8–10 columns) are strictly prohibited on mobile viewports (<768px). Squeezing wide tables creates unreadable text and severe horizontal overflow.
* **Implementation Standard:**
  * **Desktop (≥768px):** Render full data table (`hidden md:table`).
  * **Mobile (<768px):** Render a stacked list of transaction cards (`flex flex-col gap-2.5 md:hidden`).
  * **Mobile Card Anatomy:**
    * **Header:** Recipient/Payer Name (bold) + Amount (right-aligned, bold `tabular-nums`, colored `text-foreground` or `text-success`).
    * **Subline:** Withdrawal Code or Reference ID pill + Status badge (`Cash Collected at Agent`, `Awaiting Cashout`, `Returned to Balance`).
    * **Footer:** Village cluster or payment channel + relative timestamp.
    * **Tap Trigger:** Tapping anywhere on the card opens the bottom sheet with full audit details.

### 4. Slide-Over to Native Bottom Sheet Adaptation
* **Desktop (≥768px):** Slide-over audit drawer anchored to the right edge (`w-full max-w-md right-0`).
* **Mobile (<768px):** Transform drawer into an anchored **Bottom Sheet**:
  * Anchored to screen bottom: `fixed bottom-0 inset-x-0 max-h-[90vh] rounded-t-2xl bg-card border-t shadow-2xl`.
  * Visual drag handle: `w-10 h-1 bg-border/80 rounded-full mx-auto my-2.5`.
  * Scrollable body with full audit details and receipt download.
  * Full-width sticky action button at the base (`min-h-[48px]`).
  * Dismissible via drag-down or tapping the darkened backdrop overlay.

### 5. Touch Target Ergonomics & Fat-Finger Safety
* **Minimum Touch Target:** All interactive controls (buttons, tabs, filter chips, action pills, modal close triggers) must have a clickable/tappable hit area of at least **48 × 48px** (or minimum 44 × 44px with generous hit padding).
* **Destructive Action Isolation:** Irreversible or high-stakes actions (e.g. *"Cancel Code & Return to Balance"*, *"Remove Record"*) must NEVER sit directly adjacent to primary CTA buttons (*"Approve"*, *"Send Money"*). They require distinct visual spacing (≥16px) and confirmation prompts.

### 6. Mobile Forms & Numeric Keypad Invocation
* **Font Sizing:** Input fields must have `text-base` (16px) on mobile (or `text-base sm:text-xs`) to prevent iOS Safari from aggressively auto-zooming into form fields on focus.
* **Numeric Keypads:** Financial input fields (Amounts, Phone Numbers, Approval PINs) must explicitly declare `inputMode="numeric"` or `inputMode="decimal"` to invoke the phone's native numeric keypad.

### 7. Fluid Financial Typography (Zero Number Clipping)
* Big financial numbers (e.g. `₦107,325,000.00`) must use responsive sizing: `text-2xl sm:text-3xl lg:text-4xl tabular-nums font-bold tracking-tight`.
* Figures must never clip, truncate with ellipsis, or overflow screen margins on a 360px screen. Always wrap summary metrics into a vertical stack or horizontal snap-carousel on mobile.

---

## SECTION 8: SKELETON PRELOAD ARCHITECTURE & ZERO CUMULATIVE LAYOUT SHIFT (CLS)

High-trust enterprise financial platforms (Stripe, Moniepoint, OPay) never show blank flashing pages or jarring content jumps during data loading or view transitions. Polkaa mandates standard skeleton preloading:

1. **Exact Geometric Mirroring:** Every skeleton must mirror the precise aspect ratio, border radius, and dimensions of the final loaded UI:
   * **Hero Balance Skeleton:** Rounded card matching the exact height of the ₦107M company balance card, including placeholder blocks for the dual action buttons.
   * **Metric Cards Grid Skeleton:** 2×2 grid on mobile (`grid-cols-2 lg:grid-cols-4`) matching card heights so metrics do not jump when loaded.
   * **Desktop Table Skeleton:** Table header with sticky background and 5–8 shimmering rows matching exact column widths (Reference, Recipient, Amount, Status, Time).
   * **Mobile Stacked Cards Skeleton:** List of 4–6 card blocks matching the stacked mobile view with badge, title, and amount placeholders.
2. **Zero Layout Shift (CLS = 0):** The container dimensions of the skeleton must equal the container dimensions of the loaded content to eliminate visual jumping.
3. **Smooth Shimmer & Pulse Animation:** Use `animate-pulse` with `bg-muted/40 rounded` with subtle opacity transition. Avoid harsh blinking or rapid strobe effects.
4. **Tab Switch & Refresh Preloading:** When switching between views (Overview, Payouts, Collections, Reports) or executing simulated data refreshes, display a micro-preload shimmer (150ms–250ms) to provide tactile, responsive feedback without stalling user interaction.

---

## SECTION 9: ENTERPRISE FINANCIAL PAGINATION STANDARDS

When disbursing to hundreds of outgrowers or tracking thousands of USSD transactions, rendering all items simultaneously degrades DOM performance, increases battery drain on mobile, and creates scroll fatigue. Polkaa mandates standard pagination:

1. **Default Page Size:**
   * **Mobile (<768px):** 10 items per page by default to fit comfortably within the viewport.
   * **Desktop (≥768px):** 10, 25, or 50 items per page with a quick rows-per-page selector.
2. **Clear Accounting Range Indicator:** Always display human-readable record ranges: e.g., `"Showing 1–10 of 48 transactions"`.
3. **Touch-Friendly Controls:**
   * **Previous / Next Buttons:** Minimum **44 × 44px** hit area with clear disabled states on first/last page.
   * **Page Indicators:** Highlight the active page number pill with distinct background.
4. **Filter & Search Synchronization:**
   * Changing a search query, status chip filter, or date range must immediately reset the active page index back to **Page 1**.
   * If the filtered dataset has 0 results, display the clear Empty State rather than empty pagination.
5. **Mobile Viewport Placement:**
   * On mobile, the pagination control bar sits directly below the stacked cards with safe-area spacing above the mobile bottom nav bar (`pb-4`).

---

## SECTION 10: STICKY ACTION HEADER ARCHITECTURE FOR SETTINGS & LONG WORKFLOWS

Long administrative and configuration screens (e.g., Security & Payment Settings with 7 comprehensive sections) must never force the user to scroll 2,000px back up or down to find the "Save" action:

1. **Sticky Header Pinning (`sticky top-0 z-30`):**
   * The page header containing the title ("Security & Payment Settings") and the primary "Save Configuration" button is pinned via `sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-xs`.
   * As the user scrolls down through multiple sections, the header remains pinned at the top of the viewport.
   * This guarantees immediate visibility and reachability of the Save action at any scroll position without floating arbitrary cards that obscure form inputs.
2. **End-of-Form Secondary Save Action:**
   * Provide a clean, grounded secondary Save Configuration button at the end of the final section to give users a natural finishing action when completing the entire form.
3. **No Mid-Screen Floating Capsules:**
   * Never render floating fixed cards that hover across the middle of form inputs or obscure interactive toggles and numeric fields.

---

## SECTION 11: FINANCIAL FLOW ICON SYMMETRY (MONEY OUT VS. MONEY IN)

Financial directional indicators must adhere to strict visual symmetry, stroke weight, and design language across all screens:

1. **Paired Inversion Standard:**
   * **Money Out (Disbursements / Payouts):** The standard icon is the `Send` paper airplane pointing diagonally up-right (`↗`), representing outgoing capital.
   * **Money In (Collections / USSD *671#):** Must strictly use the matching inverted counterpart (`MoneyInIcon` / `<Send className="rotate-180" />`) pointing diagonally down-left (`↙`), representing incoming capital.
2. **Zero Mismatched Metaphors:**
   * Never pair a paper airplane for Money Out with a simple line arrow (`ArrowDownLeft` or `ArrowUpRight`) for Money In. Both directions must share the identical geometric icon family.
3. **Cross-Platform Uniformity:**
   * The `Send` / inverted `Send` pair must be used consistently across:
     * Pulse Metric Cards (`portfolio-pulse.tsx`)
     * Desktop Sidebar Navigation (`command-dock.tsx`)
     * Mobile Bottom Navigation (`mobile-bottom-nav.tsx`)
     * Payment Summary & Audit Analytics (`analytics-view.tsx`)
     * Command-K Search Dialog (`command-k-menu.tsx`)



