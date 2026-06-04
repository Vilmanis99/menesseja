---
name: Modern Folklore Calendar
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c2c8c1'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c928c'
  outline-variant: '#424843'
  surface-tint: '#accfb6'
  primary: '#accfb6'
  on-primary: '#173625'
  primary-container: '#2d4c39'
  on-primary-container: '#99bca3'
  inverse-primary: '#466551'
  secondary: '#ffb59c'
  on-secondary: '#5c1900'
  secondary-container: '#7b2e10'
  on-secondary-container: '#ff9b79'
  tertiary: '#c1c7cf'
  on-tertiary: '#2b3137'
  tertiary-container: '#40464d'
  on-tertiary-container: '#aeb4bb'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c7ebd1'
  primary-fixed-dim: '#accfb6'
  on-primary-fixed: '#012111'
  on-primary-fixed-variant: '#2e4d3a'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59c'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#7b2e10'
  tertiary-fixed: '#dde3eb'
  tertiary-fixed-dim: '#c1c7cf'
  on-tertiary-fixed: '#161c22'
  on-tertiary-fixed-variant: '#41474e'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Literata
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Literata
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Literata
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Literata
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

This design system establishes a "Modern Folklore" aesthetic, bridging ancient Latvian agricultural wisdom with contemporary digital precision. The brand personality is grounded, mystical, and rhythmic, reflecting the cyclical nature of lunar cycles and seasonal growth. 

The visual style is a hybrid of **Minimalism** and **Tactile** design. It prioritizes clarity for complex astronomical data while using subtle organic textures and ethnographic symbols—such as the *Jumis* (fertility/double-ear) and *Zalktis* (wisdom/snake) signs—as functional UI accents or background watermarks. The emotional response should be one of quiet confidence, connecting the user to the earth’s natural tempo through a sophisticated, modern lens.

## Colors

The palette is derived from the Latvian landscape at twilight. The primary color is a **Deep Forest Green**, used for key interaction points and representing growth. The secondary **Earthy Terracotta** provides a warm, clay-like contrast, ideal for highlighting planting windows and urgent lunar warnings. 

The background utilizes a **Night-sky Navy**, creating a high-contrast environment where **Moonlit Silver** (Tertiary) elements can shine. Semantic colors for success (verdant green) and warning (burnt orange) must remain within this earthy, desaturated spectrum to maintain the atmospheric integrity of the design system.

## Typography

The typographic hierarchy employs a "Traditional vs. Technical" contrast. **Literata** is used for all headlines and display text, providing an authoritative, literary feel that evokes old Latvian almanacs.

**Hanken Grotesk** handles all utility, calendar data, and navigational elements. Its sharp, contemporary architecture ensures that small-scale data (like moon degrees or specific planting times) remains legible and professional. Label styles should use uppercase and slight tracking to distinguish data headers from narrative body text.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop, centered within a maximum width of 1200px, transitioning to a fluid layout on mobile devices. The underlying rhythm is based on an 8px square system.

- **Desktop (12 columns):** 24px gutters, 48px margins. Content is primarily organized into tactile cards spanning 3, 4, or 6 columns.
- **Mobile (4 columns):** 16px gutters, 16px margins. Cards stack vertically to prioritize the daily lunar status.
- **Reflow:** In the calendar view, data cells should maintain a square aspect ratio where possible, mirroring the geometric nature of Latvian weaving patterns.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a sense of physical objects resting on a dark surface. Depth is not achieved through stark whites, but through varying shades of Navy and Forest Green.

- **Surface 0 (Background):** Night-sky Navy (#0F172A).
- **Surface 1 (Cards):** A slightly lighter navy-green mix with a subtle linen-like texture overlay (2% opacity).
- **Shadows:** Use extra-diffused, low-opacity shadows tinted with the primary green (#1B3022) to prevent the "muddy" look of pure black shadows. 
- **Active States:** Elements appear to "lift" using a secondary terracotta glow or a thin silver inner-stroke, simulating moonlight catching an edge.

## Shapes

The shape language is **Rounded (Level 2)**. A base corner radius of 0.5rem (8px) provides a friendly, organic feel that contrasts with the sharp geometry of the ethnographic icons. Large containers and main dashboard cards use `rounded-xl` (1.5rem/24px) to emphasize the tactile, "cushioned" nature of the UI. Buttons and interactive chips use a consistent 8px radius to feel sturdy and intentional.

## Components

### Cards
The primary container. Cards should feature a subtle 1px border in Moonlit Silver (10% opacity) and a soft ambient shadow. For "Peak Planting" windows, cards may feature a Terracotta top-border.

### Buttons
- **Primary:** Filled with Forest Green, using Hanken Grotesk Bold.
- **Secondary:** Outlined in Moonlit Silver with a slight blur backdrop.
- **Icon Buttons:** Used for lunar cycle navigation, featuring stylized ethnographic signs (Zalktis for "Next", backward-Jumis for "Home").

### Chips & Tags
Used for soil types or plant categories. These should have a pill-shape and use Earthy Terracotta at low opacity for background, with full-opacity text for high contrast.

### Input Fields
Inputs are dark-themed with a subtle bottom-border. On focus, the border transitions to a Forest Green glow. Use Literata for labels and Hanken Grotesk for the user's input.

### Moon Phase Indicator
A custom component utilizing high-contrast Silver and Navy. The shadow of the moon should be rendered with a soft gradient rather than a hard line to match the ambient depth style.