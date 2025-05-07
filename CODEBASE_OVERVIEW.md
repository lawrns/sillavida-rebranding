# SillaVida Codebase Overview

*Last updated: 2025-05-06T10:31:19-06:00*

---

## 1. Global Styles & Design Tokens

The project uses **CSS custom properties** defined in `src/index.css` (imported by Tailwind) to drive all theme colours, spacing and typography.

```css
:root {
  /* Base palette */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;

  /* Primary / Secondary */
  --primary: 162 73% 46%;     /* #1DDBA6 – legacy teal */
  --secondary: 145 63% 42%;   /* #28A76F */

  /* Accent */
  --color-gold: 46 71% 52%;   /* #D4AF37 */
  --color-cream: 60 90% 91%;

  /* Semantic roles */
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 162 73% 46%;
  --destructive: 0 84.2% 60.2%;
}
```

> **NOTE:** The intended redesign swaps the teal primary (`#1DDBA6`) for the clone-site red (`#d71920`).  Update `--primary`, `--secondary`, and their Tailwind mappings to adopt the new palette.

### Dark-mode overrides
A `.dark` class on `html`/`body` re-defines the same variables for dark themes.

---

## 2. Tailwind Configuration (`tailwind.config.js`)

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          gold: '#D4AF37',
          cream: '#FDFBD4',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        neutral: {
          white: '#FFFFFF',
          offwhite: '#F8F8F6',
          lightgray: '#E6E6E4',
          gray: '#9A9A9A',
          darkgray: '#4A4A4A',
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'Arial', 'Helvetica', 'sans-serif'],
        body: ['Roboto', 'Arial', 'Helvetica', 'sans-serif'],
        special: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '0 0' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(33,37,41,0.1)',
        'card-hover': '0 4px 12px rgba(33,37,41,0.15)',
      },
    },
  },
  plugins: [],
};
```

---

## 3. Project Layout

```
src/
  components/           # Reusable UI pieces (≈60 files)
  components/product/   # Product-detail sub-components
  pages/                # Route components (react-router-dom v6)
  context/              # React context providers (Cart, Theme…)
  lib/                  # Shopify API helpers & utilities
  styles/               # Additional atomic CSS modules
```

> **Tip:** use semantic Tailwind classes (`bg-primary`) instead of hard-coded teal classes.

---

## 4. Key Components

| Component | Purpose | Notes |
|-----------|---------|-------|
| `Navbar.tsx` (19 kB) | Desktop & mobile header, dropdowns, cart badge. | Contains teal utility classes that need palette swap. |
| `VidaNavbar.tsx` (9 kB) | Alternative lifestyle-focused header. | Uses same data hooks. |
| `Footer.tsx` (7 kB) | 4-column footer. | Colors/links still teal. |
| `HeroSlider.tsx` (15 kB) | Framer-motion hero; pulls slides via Shopify Metaobjects. | Background overlay & CTA buttons use teal. |
| `ProductCard.tsx` (8 kB) | Generic product card (PLP). | Hover animation, price display. |
| `product/ProductGallery.tsx` | Thumbnails, zoom, 360 viewer. | Works on desktop & mobile.
| `ProductPage.tsx` | Detail page container; side-by-side layout. | Features/specs tabs via `ProductFeatures.tsx`. |
| `CartPage.tsx` | Lists cart items & totals; checkout link. | Uses `CartContext`. |

(Full source of any file available on request.)

---

## 5. Data Flow & APIs

* **Shopify Storefront GraphQL** – wrapper functions in `lib/shopify.ts` handle `getProducts`, `getProductByHandle`, `getCollections`, etc.
* **Cart Management** – `CartContext` stores items locally and syncs with Shopify Checkout via storefront mutations.
* **Metaobjects** – Dynamic homepage hero & banner content fetched from Shopify **Metaobject** definitions (`lib/metaobjects.ts`).

---

## 6. Outstanding Redesign Tasks (completed)

| ID | Change | Status |
|----|--------|--------|
| TASK-073 | Global style system | Completed |
| TASK-074 | Header / Navbar | Completed |
| TASK-075 | Footer | Completed |
| TASK-076 | Hero Slider | Completed |
| TASK-077 | Product Card | Completed |
| TASK-078 | Product Page layout | Completed |
| TASK-079 | Product Gallery | Completed |
| TASK-080 | Feature / Spec tabs | Completed |

---

## 7. Next-Step Recommendations

1. **Palette update** – swap teal variables for the clone-site red (`#d71920`) + black/white neutral scheme.
2. **Class audit** – search for `text-teal`, `bg-[#1DDBA6]`, etc.; convert to semantic utilities.
3. **Layout parity** – adjust header, hero, product card paddings and breakpoints to match clone widths.
4. **Remove legacy CSS** – files in `styles/sillavida-original-theme.css` can be deprecated after audit.

---

## 8. How to Use This Document

Hand this file to Manus (or any AI agent) so it can:
* Understand the current tech stack, styling system, and component responsibilities.
* Generate new corrective tasks focusing on color-palette swap and residual layout inconsistencies.
* Maintain Shopify data integrity throughout visual changes.

---

Happy hacking! 🎉
