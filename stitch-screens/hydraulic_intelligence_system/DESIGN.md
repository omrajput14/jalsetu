---
name: Hydraulic Intelligence System
colors:
  surface: '#0f1418'
  surface-dim: '#0f1418'
  surface-bright: '#353a3e'
  surface-container-lowest: '#0a0f13'
  surface-container-low: '#171c20'
  surface-container: '#1b2024'
  surface-container-high: '#252b2f'
  surface-container-highest: '#30353a'
  on-surface: '#dee3e9'
  on-surface-variant: '#bec8d2'
  inverse-surface: '#dee3e9'
  inverse-on-surface: '#2c3135'
  outline: '#88929b'
  outline-variant: '#3e4850'
  surface-tint: '#89ceff'
  primary: '#89ceff'
  on-primary: '#00344d'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#006591'
  secondary: '#5de6ff'
  on-secondary: '#00363e'
  secondary-container: '#00cbe6'
  on-secondary-container: '#00515d'
  tertiary: '#6bd8cb'
  on-tertiary: '#003732'
  tertiary-container: '#38ac9f'
  on-tertiary-container: '#003a35'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#a2eeff'
  secondary-fixed-dim: '#2fd9f4'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5a'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#0f1418'
  on-background: '#dee3e9'
  surface-variant: '#30353a'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-metrics:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  container-max: 1440px
  gutter: 20px
---

## Brand & Style

The design system is engineered for **JalSetu**, a premier smart water distribution platform. The brand personality is authoritative yet innovative, blending the reliability required for critical infrastructure with the cutting-edge intelligence of modern SaaS. It evokes a sense of "digital utility"—essential, invisible, and highly efficient.

The visual style is **Sophisticated Tech-Industrial**, drawing heavy influence from high-end developer tools like Linear and Vercel. It utilizes a **Dark Mode** foundation to reduce eye strain during long monitoring sessions and to allow vibrant data visualizations to pop. 

**Key Characteristics:**
- **Glassmorphism:** Surfaces use subtle backdrop blurs and semi-transparent fills to create a sense of depth without heavy shadows.
- **Precision:** High-density layouts with crisp, thin borders ($1px$) to reflect the accuracy of sensor data.
- **Atmospheric Depth:** Strategic use of radial gradients and "glow" effects to highlight active water flow and system health.

## Colors

The palette is rooted in deep aquatic tones, transitioning from the void of the night (backgrounds) to vibrant bioluminescent teals and cyans (data and actions).

- **Primary (#0EA5E9):** "Flow Blue." Used for primary actions, active states, and successful system pings.
- **Secondary (#22D3EE):** "Cyan Pulse." Used for high-priority data points, interactive hover states, and glow effects.
- **Tertiary (#0D9488):** "Teal Depth." Reserved for secondary metrics, "Safe" status indicators, and subtle accents in visualizations.
- **Neutrals:** A range of Slate and Navy grays. The background is a near-black Navy (`#020617`), ensuring the glass effects have enough contrast to be perceptible.

## Typography

Typography in this design system balances the technical aesthetic of Geist with the universal legibility of Inter.

- **Geist** is used for headings, labels, and numeric displays to provide a precise, monospaced-adjacent feel that suits "Gov-Tech."
- **Inter** handles all body copy and long-form descriptions to ensure maximum readability against dark backgrounds.
- **Numeric Data:** For flow rates and pressure readings, use `label-md` or custom mono-weighted Geist to ensure numbers don't shift during live updates (tabular lining).

## Layout & Spacing

This design system employs a **Fluid Grid** model built on an 8px rhythmic scale, optimized for data-heavy dashboards.

- **Desktop (1440px+):** 12-column grid with 24px gutters. Sidebars are fixed at 240px to maximize the central "Command Center" view.
- **Tablet (768px - 1439px):** 8-column grid with 20px gutters. Sidebars collapse into an icon-only rail.
- **Mobile (<768px):** 4-column grid with 16px gutters. Stacked cards become the primary data delivery method.

Spacing should be used to group related sensor data tightly while leaving significant "breathing room" (xl or 2xl) between major sections of the application to prevent cognitive overload.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Glassmorphism** rather than traditional drop shadows.

1.  **Level 0 (Background):** `#020617`. The base "canvas."
2.  **Level 1 (Sub-surface):** Slightly lighter navy with a 1px border. Used for sidebar containers and footer bars.
3.  **Level 2 (Glass Cards):** The primary UI container. Uses a semi-transparent fill (`rgba(15, 23, 42, 0.6)`) with a `backdrop-filter: blur(12px)`. Borders are thin and use a top-to-bottom gradient to simulate a subtle top-down light source.
4.  **Level 3 (Modals/Popovers):** Higher transparency, higher blur (`24px`), and a subtle outer glow using the Primary color at 5% opacity to indicate "Floating" status.

## Shapes

The shape language is **Soft (Level 1)**, leaning towards a professional, architectural aesthetic.

- **Standard Elements:** 4px (0.25rem) radius for inputs, small buttons, and tags.
- **Cards & Containers:** 8px (0.5rem) radius (`rounded-lg`) for the primary glass containers.
- **Outer Modals:** 12px (0.75rem) radius (`rounded-xl`) to soften the impact of large overlaying elements.

This low-radius approach maintains the "precise" feel of a technical tool while avoiding the aggressive sharpness of pure brutalism.

## Components

### Buttons
- **Primary:** Solid `#0EA5E9` with white text. Hover state introduces a subtle outer glow.
- **Ghost:** Transparent background with a `1px` border of `#1E293B`. On hover, the border brightens to the Primary color.
- **Action Icons:** Small, square buttons with 4px rounding, used primarily in dashboard toolbars.

### Glass Cards
The signature component. Must include:
- `backdrop-filter: blur(12px)`
- `background: rgba(15, 23, 42, 0.7)`
- `border: 1px solid rgba(255, 255, 255, 0.05)`
- Padding should default to `lg (24px)`.

### Inputs & Selects
Dark backgrounds (`#0F172A`) with a subtle `1px` border. The focus state uses a Cyan Pulse (`#22D3EE`) border and a very faint inner glow to indicate activity.

### Status Chips
Small, high-contrast pills. 
- **Active Flow:** Tertiary color background (low opacity) with solid Tertiary text.
- **Critical Alert:** Red-orange text with a soft pulse animation.

### Data Visualizations
Charts should use "Area" styles with gradients that bleed into the background. Use the Secondary color (`#22D3EE`) for the stroke and a 10% opacity version of the same color for the fill.