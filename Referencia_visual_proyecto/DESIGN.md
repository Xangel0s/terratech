---
name: Terratech Industrial OS
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#564338'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#897267'
  outline-variant: '#ddc1b3'
  surface-tint: '#9b4500'
  primary: '#903f00'
  on-primary: '#ffffff'
  primary-container: '#b45309'
  on-primary-container: '#fff1eb'
  inverse-primary: '#ffb68e'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006444'
  on-tertiary: '#ffffff'
  tertiary-container: '#007f58'
  on-tertiary-container: '#ccffe3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb68e'
  on-primary-fixed: '#331200'
  on-primary-fixed-variant: '#763300'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: '0'
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-data:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers a high-trust, mission-critical workspace engineered for industrial safety compliance, environmental management, and occupational health (SSOMA). The design philosophy balances rigorous technical utility with modern executive refinement. 

The aesthetic draws from Modern Corporate systems and Precision Instrument UI: high-contrast legibility, tactile structural grouping, calm atmospheric backgrounds, and warm amber functional cues derived from industrial safety standards. The interface minimizes cognitive fatigue in high-stress compliance scenarios while providing clear visual governance across audits, incidents, worker accreditations, and regulatory reporting.

## Colors

The palette establishes an authoritative, daylight-calibrated field interface:

- **Canvas & Surfaces**: The base canvas is `#f8fafc` (Slate 50), accented with `#f1f5f9` (Slate 100) for structural sidebars and inactive panel zones. Elevated operational surfaces use pure `#ffffff` cards framed by a razor-thin `#e2e8f0` structural rule.
- **Brand & Safety Primary**: `#b45309` (Amber 700) provides heavy-duty prominence with WCAG AAA compliance on light surfaces, complemented by `#d97706` for interaction states.
- **Corporate Slate**: Text levels descend through `#0f172a` (Headings, critical markers), `#334155` (Body text, tabular rows), and `#64748b` (Meta-labels, metadata, placeholder text).
- **Compliance Status Semantics**:
  - Valid / Certified: `#059669` (Emerald 600) with `#ecfdf5` background tints.
  - Inspection / Warning: `#d97706` (Amber 600) with `#fffbeb` background tints.
  - Non-Compliant / Restricted: `#dc2626` (Red 600) with `#fef2f2` background tints.

## Typography

The typographic hierarchy enforces a dual-engine architecture:
- **Primary Human Interface (`Inter`)**: Applied to all headings, descriptive body paragraphs, operational dialogues, and interactive button text. Renders with tight negative tracking at scale to project structured authority.
- **Instrument Monospace (`JetBrains Mono`)**: Strict requirement for machine-readable information, compliance codes, ISO tracking numbers, dates, timestamps, worker identification (DNI/SSN), and sensor telemetry readings. Monospace figures preserve optical grid alignment across dense audits and real-time tabular data.

## Layout & Spacing

The system runs on a 12-column responsive fluid grid pinned to an 8px base rhythm (with a 4px sub-grid for internal component micro-spacing).

- **Desktop (1280px+)**: 12 columns, `gutter-lg` (32px), `margin-lg` (40px) outer framing. Data dashboards follow modular 4-col and 6-col analytical card distributions.
- **Tablet (768px - 1279px)**: 8 columns, `gutter` (24px), `margin` (24px). Sidebar navigations collapse to an icon rail, wrapping operational metrics into paired blocks.
- **Mobile (< 768px)**: 4 columns, `gutter-sm` (16px), `margin-sm` (16px). Form layouts collapse into single-column flows; data cards stack vertically with persistent floating compliance CTAs.

## Elevation & Depth

To preserve the clean corporate environment without skeuomorphic noise, the design system utilizes low-contrast structural boundaries paired with subtle ambient diffusion:

- **Border Hierarchy**: All interactive containers utilize a persistent `1px solid #e2e8f0` stroke. Hover states softly step the border to `#cbd5e1`.
- **Card Rest Depth**: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)` provides surface detachment without visual clutter.
- **Floating Overlays & Menus**: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)` with a structural border tint of `#cbd5e1`.
- **Surface Elevation Layers**:
  - `Base`: `#f8fafc` (Canvas)
  - `Level 1`: `#ffffff` (Card containers, standard tables)
  - `Level 2`: `#ffffff` + Ambient Shadow (Modals, alert flyouts, floating action controls)

## Shapes

The interface offsets rigid industrial engineering with progressive, organic geometry:
- **Card Containers**: Standardized to `rounded-2xl` (16px to 24px) to soften massive dashboards into approachable, scannable modules.
- **Form Controls & Inputs**: Standardized to `rounded-xl` (12px) for comfortable click-and-touch targets on field tablets.
- **Status Badges, Chips, & Primary CTAs**: Standardized to `rounded-full` pills to clearly differentiate operational status and primary actions from rectangular data containers.

## Components

### Buttons
- **Primary Industrial CTA**: Background `#b45309`, label in white Inter Semibold, shape `rounded-full`, padding `0.75rem 1.5rem`. Hover shifts to `#d97706`. Focus uses a `3px` ring of `#fde68a`.
- **Secondary Corporate Action**: Background `#ffffff`, border `1px solid #e2e8f0`, text `#0f172a`. Hover transitions to `#f8fafc` with border `#cbd5e1`.
- **Critical Action**: Background `#dc2626`, text white. Used strictly for emergency shut-offs, hazard flagging, or permit revocation.

### Chips & Compliance Badges
- **Geometry**: `rounded-full` pill structure, padding `0.25rem 0.75rem`.
- **Typographic Treatment**: `JetBrains Mono`, text size `11px`, all caps tracking.
- **Variants**:
  - *Certified / Active*: Green surface `#ecfdf5`, text `#059669`, border `1px solid #a7f3d0`.
  - *Pending / Audit*: Amber surface `#fffbeb`, text `#b45309`, border `1px solid #fde68a`.
  - *Restricted / Critical*: Red surface `#fef2f2`, text `#dc2626`, border `1px solid #fecaca`.

### Input Fields
- White background (`#ffffff`), `1px solid #cbd5e1` border, `rounded-xl` shape, height 44px for field ergonomics.
- Label positioned outside in `Inter` Medium (`13px`, text `#334155`). Helper or format requirements (e.g., `ISO-YYYY-MM-DD`) styled in `JetBrains Mono` (`12px`, text `#64748b`).
- Focus state: Border transitions to `#b45309` accompanied by a `2px` glow of `#fef3c7`.

### Cards & Container Panels
- Base `#ffffff` canvas with `rounded-2xl` geometry and `1px solid #e2e8f0` outline. Internal padding follows `1.5rem` (`space-lg`).
- Modular Card Header: Separated by a thin divider line (`#f1f5f9`), featuring a primary title in `Inter` (`16px`, semi-bold) paired with a technical reference code in `JetBrains Mono` at the trailing edge.

### Tabular Compliance Grids
- Clean alternating or clear-rule rows (`1px solid #f1f5f9`).
- Column headers set in `Inter` uppercase (`11px`, tracking `0.05em`, text `#64748b`).
- DNI, certification IDs, equipment serials, and timestamps exclusively rendered in `JetBrains Mono` (`13px`, text `#0f172a`).