# Design — PlanRCM

A single organic/natural design system for the travel-planning app. All routes use these same tokens and visual rules.

## Genre

Playful, grounded, calm — never childish or decorative for its own sake.

## Macrostructure family

- Marketing: Narrative Workflow — an invitation followed by three practical moments in the journey.
- App: Workbench — functional cards with clear status, then itinerary or market content.
- Content: Long-document rhythm — readable itinerary details with gentle visual breaks.

## Theme

- Paper is a warm, off-white rice-paper ground (`--color-paper`).
- Moss green (`--color-moss`) is the primary action and focus color.
- Terracotta (`--color-clay`) is a sparing warm companion, never a competing primary action.
- Surfaces are pale, softly bordered, and may use asymmetric organic radii.

## Typography

- Display: Fraunces, 600–800, roman only.
- Body: Nunito, 400–800.
- Mono: JetBrains Mono, labels only.
- Headings use warm serif contrast; controls and dense metadata use the rounded body face.

## Spacing & motion

- Named four-point scale lives in `tokens.css`.
- Generous vertical space, soft tinted shadows, and only transform/opacity motion.
- Reduced motion removes spatial movement.

## CTA voice

- Primary: moss-green pill with pale text, tactile scale-down on press.
- Secondary: transparent clay-outline pill.
- Inputs: translucent paper surfaces with a visible moss focus ring.

## App-wide rules

- Grain is a fixed, low-opacity layer; it is never interactive.
- Buttons, nav links, and CTAs stay on one line.
- Mobile stacks complex rows before text begins to wrap.
- Logo asset: `/brand/planrcm-logo-organic.png`.
