```markdown
# Design System Strategy: Utilitarian Brutalism

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Monolith Editor."** 

This system rejects the "friendly" and "rounded" tropes of modern SaaS in favor of a raw, unyielding, and hyper-functional aesthetic. Inspired by the uncompromising minimalism of high-end streetwear and industrial design, it treats code as a structural material. We achieve a premium feel not through decoration, but through **extreme intentionality**: massive negative space, radical high-contrast typography, and a "No-UI" philosophy where the content *is* the interface.

The design breaks the "template" look by ignoring standard grid gutters in favor of large, asymmetrical margins and "floating" monospace blocks. It is a digital environment that feels like a physical architectural blueprint.

---

## 2. Colors & Surface Logic
The palette is a high-contrast study in obsidian and stark white. Every color choice is driven by functional hierarchy.

### The "No-Line" Rule
**Borders are strictly prohibited for layout sectioning.** To separate a sidebar from the editor or a terminal from the code view, you must use background shifts. 
- A `surface-container-low` (#1B1B1B) section sitting against a `background` (#131313) base creates a structural break that is felt rather than seen.

### Surface Hierarchy & Nesting
Treat the UI as a series of heavy, interlocking slabs.
- **Base Level:** `background` (#131313) — The infinite canvas.
- **Primary Workspaces:** `surface-container` (#1F1F1F) — The main editor area.
- **Active Overlays:** `surface-bright` (#393939) — Modals or pop-overs that demand focus.
- **Deep Recess:** `surface-container-lowest` (#0E0E0E) — Used for inactive terminal or background logs to "push" them into the distance.

### Signature Textures
While the system is brutalist, it is not "cheap." Use a subtle vertical gradient on main CTAs transitioning from `primary` (#FFFFFF) to `secondary` (#C7C6C6) to give a "milled metal" feel. 

---

## 3. Typography
Typography is the primary driver of the "Utilitarian" brand. We utilize a dual-font strategy to balance industrial strength with technical precision.

- **The Display Language (Space Grotesk):** Used for `display`, `headline`, and `label` roles. This provides a bold, wide, and aggressive architectural feel. Use `headline-lg` (2rem) for section headers to create "editorial" impact.
- **The Technical Language (Inter / Monospace):** Used for `body` and `title` roles. In a code editor context, ensure the "Inter" body text is typeset with tight letter spacing for a dense, "data-heavy" look.
- **High Contrast Scaling:** To achieve the signature look, jump scales aggressively. Pair a `display-lg` (3.5rem) header directly next to a `label-sm` (0.6875rem) meta-tag. The tension between the massive and the minuscule is where the premium aesthetic lives.

---

## 4. Elevation & Depth
In this system, "Elevation" does not mean shadows; it means **Tonal Layering.**

- **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-highest` (#353535) element placed on top of a `background` (#131313) implies it is physically closer to the user.
- **The "Ghost Border" Fallback:** If high-density data requires containment, use an `outline-variant` (#444748) at **15% opacity**. It should be a whisper of a line, barely visible, serving only to guide the eye.
- **Glassmorphism & Depth:** For floating "IntelliSense" or command palettes, use `surface-container-high` (#2A2A2A) with a `backdrop-filter: blur(20px)`. This creates a "frosted obsidian" effect that maintains the dark aesthetic while allowing code colors to bleed through subtly.

---

## 5. Components

### Buttons
- **Primary:** Stark `primary` (#FFFFFF) background with `on-primary` (#2F3131) text. **Radius: 0px.** 
- **Secondary:** Transparent background with a 1px `outline` (#8E9192). 
- **Interaction:** On hover, invert the colors completely. The transition should be instant (0ms) or extremely fast (50ms) to feel "raw."

### Input Fields
- Use `surface-container-low` (#1B1B1B) for the field background.
- No borders. Use a 2px `primary` (#FFFFFF) bottom-bar that only appears when the field is focused.
- Labels should use `label-sm` (Space Grotesk) in all-caps for a blueprint feel.

### Cards & Lists
- **Forbid Divider Lines.** Use the Spacing Scale `8` (2.75rem) to separate list groups. 
- Active items in a list should use `surface-container-highest` (#353535) with no rounded corners.

### Editor-Specific Components
- **Line Numbers:** Use `on-surface-variant` (#C4C7C8) in `label-sm`.
- **Gutter/Margin:** Use the `20` spacing token (7rem) for the main left margin of the editor to create a "Yeezy-esque" asymmetrical layout.
- **The "Status Slab":** A full-width bar at the bottom using `primary` (#FFFFFF) with `on-primary-fixed` (#1A1C1C) text, containing technical metadata in `label-sm`.

---

## 6. Do's and Don'ts

### Do
- **Embrace the 0px Radius:** Everything must be sharp. Roundness is the enemy of this aesthetic.
- **Use Massive Margins:** If a layout feels "crowded," double the spacing. Use the `24` (8.5rem) token for page headers.
- **Monochrome-First:** Only use `error` (#FFB4AB) for critical syntax failures. Everything else should stay within the black/white/grey spectrum.

### Don't
- **No Soft Shadows:** Never use a standard drop shadow. Use background color shifts to define layers.
- **No Icons without Labels:** Icons alone are too "app-like." Pair every icon with a `label-sm` monospace text element to maintain the utilitarian feel.
- **No Centering:** Stick to hard-left or hard-right alignments. Centered text feels too "marketing-heavy" for a code editor context.