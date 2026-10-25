# Polkaa Special Asset Vault & Engineering Hub
> **Central Repository for Official Polkaa Brand Assets, Logomarks, Favicons & Architecture Standards**  
> **Technical Team Lead / CTO:** Joseph Nwankwo  
> **Product Lead & Originator:** Oladoyin Muhibi  
> **Domain:** [polkaa.ng](https://polkaa.ng) • **Primary Rail:** MTN Mobile Money (MoMo PSB Nigeria)

---

## 📁 Directory Structure Overview

The `polkaa-special/` directory is the single source of truth for all current and future official Polkaa assets:

```
polkaa-special/
│
├── README.md                           <- Master Asset Catalog & Implementation Guide
├── HANDBOOK.md                         <- Logo & Brand Engineering Handbook (Straight to the Point)
│
├── logos/                              <- Strict 300x70 px Production Logomarks
│   ├── polkaa-logo-light.png           (Flagship Light Mode - 300x70 Transparent)
│   ├── polkaa-logo-light.svg           (Vector SVG Equivalent)
│   ├── polkaa-logo-dark.png            (Dark Mode - 300x70 Transparent)
│   ├── polkaa-logo-dark.svg            (Vector SVG Equivalent)
│   ├── polkaa-logo-soft-light.png      (Soft Ice-Blue Tint - 300x70 Transparent)
│   ├── polkaa-logo-soft-light.svg      (Vector SVG Equivalent)
│   ├── polkaa-logo-inverted.png        (Inverted Brand Blue - 300x70 Transparent)
│   ├── polkaa-logo-inverted.svg        (Vector SVG Equivalent)
│   ├── polkaa-logo-mono-black.png      (Monochrome Black - Print/Invoices)
│   ├── polkaa-logo-mono-black.svg      (Vector SVG Equivalent)
│   ├── polkaa-logo-mono-white.png      (Monochrome White - Video/Overlays)
│   └── polkaa-logo-mono-white.svg      (Vector SVG Equivalent)
│
├── favicons/                           <- High-Definition Favicons & Mobile App Icons
│   ├── favicon.ico                     (Multi-res: 16x16, 32x32, 48x48)
│   ├── favicon-16x16.png               (Legacy browser tab icon)
│   ├── favicon-32x32.png               (Standard modern browser tab icon)
│   ├── favicon-dark-32x32.png          (Dark mode browser tab icon)
│   ├── apple-touch-icon.png            (180x180 px iOS Home Screen Bookmark)
│   ├── icon-192x192.png                (192x192 px Android Web App Icon)
│   ├── icon-512x512.png                (512x512 px Master App Store Icon)
│   └── favicon.svg                     (Pure Vector Favicon)
│
├── scripts/                            <- Python Production Automation Pipelines
│   └── generate_opt2_round_suite.py    (Master script that builds entire suite)
│
└── showcase/                           <- Interactive HTML Browser Showcase
    └── logo-showcase.html              (Visual test bench across all surfaces)
```

---

## 🎨 Asset Specifications

All logo marks strictly follow the corporate engineering requirements:
* **Canvas Dimensions:** Strictly **300 × 70 px**
* **Background:** **100% Alpha Transparent (RGBA)**
* **Content Fill:** $262 \times 54\text{ px}$ (Fills available space with **zero leftover awkward margins**)
* **Spacing Margins:** $19\text{ px}$ Left, $19\text{ px}$ Right, $8\text{ px}$ Top, $8\text{ px}$ Bottom
* **Color Balance:** 
  * Primary: MoMo Royal Blue (`#004F71`) & Deep Navy (`#003654`)
  * Micro-Accent: Subtle Sunshine Yellow (`#FFCC05`) at $5\%$ visual weight
* **Zero Telco Clutter:** No "MoMo" text badges on the logo mark.

---

## 💻 Quick Implementation Snippets

### 1. In React / Next.js Navbar:
```tsx
import Image from 'next/image';

export function PolkaaHeaderLogo() {
  return (
    <Image
      src="/polkaa-logo-light.png"
      alt="Polkaa Enterprise Suite"
      width={300}
      height={70}
      priority
      className="h-[40px] w-auto object-contain"
    />
  );
}
```

### 2. In Next.js `layout.tsx` (Metadata / Favicon):
```typescript
export const metadata: Metadata = {
  title: 'Polkaa Enterprise — Corporate Payout & Collection Suite',
  description: 'Enterprise B2B disbursement and collection suite built on MTN MoMo PSB Rails.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
};
```

### 3. In HTML / Email Templates:
```html
<a href="https://polkaa.ng">
  <img src="https://polkaa.ng/polkaa-logo-light.png" width="300" height="70" alt="Polkaa" style="display:block;border:0;" />
</a>
```

---

## 🔄 How to Regenerate or Update Assets

If you ever wish to modify letter spacing, badge dimensions, or color hexes, run the automated Python pipeline:

```bash
python polkaa-special/scripts/generate_opt2_round_suite.py
```

The script will automatically:
1. Re-render all vector elements at $4\times\text{ DPI}$.
2. Run PIL alpha channel thresholding to trim extraneous whitespace.
3. Scale proportionally to fit within $300\times70\text{ px}$.
4. Output optimized PNGs, vector SVGs, and favicon mipmaps.

---

## 🚀 Adding Future Polkaa Collateral to this Vault

As Polkaa grows, use this folder to house:
* `polkaa-special/decks/` — Enterprise pitch decks & product one-pagers for AgriCorp / UN WFP.
* `polkaa-special/guidelines/` — Press kits and brand compliance documentation.
* `polkaa-special/contracts/` — MoMo PSB partnership agreements and service level specifications.
