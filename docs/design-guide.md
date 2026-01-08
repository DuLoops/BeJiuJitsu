# Design Guidelines: The Digital Dojo Scroll (Dual Theme)

This design treats the app interface, **Do Jits (BJJ App)**, not as a "website," but as a high-fidelity digital manuscript. We use the warmth and authority of traditional martial arts texts (scrolls, woodblock prints) but apply them with the precision of a high-end Japanese whisky label. This version introduces a robust **Dual Theme (Light/Dark)** structure to maintain this aesthetic in all environments.

---

## 1. Color Palette: "Shou Sugi Ban & Indigo"

The color scheme utilizes a muted, high-contrast palette. Light mode evokes a traditional manuscript on rich paper (Vellum). Dark mode shifts to **"Shou Sugi Ban" (Charred Wood)** and **"Indigo Dye,"** creating a deep, immersive dojo atmosphere.

### App Background
* **Usage:** Root canvas, furthest layer back.
* **Light Mode (Aged Scroll):** Aged Vellum (`#FAF3DD`)
* **Dark Mode (Sumi Wash):** Sumi Wash (`#0F1419`) — *The deepest dark, like ink on a stone.*

### View Background (Cards/Tablets)
* **Usage:** Elevated UI elements (Cards, Navigation).
* **Light Mode:** Pure White (`#FFFFFF`)
* **Dark Mode:** Deep Indigo (`#1E2833`) — *Dark Indigo Tablets or Slate resting on the charcoal background.*

### Primary Text
* **Usage:** Main content, headers, active input fields.
* **Light Mode:** Sumi Charcoal (`#2B2B2B`)
* **Dark Mode:** Vellum White (`#F0EFE7`) — *High contrast against the deep indigo.*

### Accent/Action
* **Usage:** Critical actions (Hanko Stamp effect).
* **Light Mode:** Vermilion Stamp (`#B73225`)
* **Dark Mode:** Vermilion Stamp (`#B73225`) — *Remains Constant.*

### Secondary UI
* **Usage:** Metadata, borders, inactive icons.
* **Light Mode:** Slate Indigo (`#405059`)
* **Dark Mode:** Faded Slate (`#849BAA`)

### Success/Affirmative
* **Usage:** "Marked Complete" or success feedback.
* **Light Mode:** Success Green (`#3B704E`)
* **Dark Mode:** Success Green (`#3B704E`)

### Theme Rationale
* **Light Mode:** Uses Pure White cards (`#FFFFFF`) against the slightly warmer Aged Vellum background (`#FAF3DD`) to create subtle visual depth (the **"woodblock print" effect**).
* **Dark Mode:** Uses **Deep Indigo cards (`#1E2833`)** against the **Sumi Wash background (`#0F1419`)**. This creates a "Shou Sugi Ban" aesthetic—charred wood and deep indigo dye—giving the interface a premium, calm, and focused feel.

---

## 2. Typography: "The Scribe's Hand"

We balance character with utility, providing the **"feel" of a serif** without sacrificing readability for data.

* **Primary Headers (Titles):** `Crimson Text` (Serif, Google Fonts). Used for titles and key headings to maintain a literary, traditional feel.
* **Body Text & Data:** `Lato` or `Source Sans Pro` (Sans-serif). Used for long descriptions, data tables (reps, timers), and instructions to ensure modern legibility.
    * *Contrast:* Headings are the "Art," the Body is the "Instruction".
* **The "Clean" Constraint:** Generous whitespace must be maintained; do not pack text. Let the typography breathe like a haiku.

---

## 3. Textures & Imagery: "Subtle Imperfections"

The goal is to provide a tactile sense of the manuscript without obscuring text or appearing muddy.

* **Background Texture:** Apply a CSS "Noise" filter set to **2% opacity** over the solid background color (`AppBackground`). This gives the page a tactile "tooth" (i.e., the feel of paper fiber).
* **Iconography:** Use stroke-based icons (e.g., Feather Icons, Heroicons) but soften the sharp edges slightly (`border-radius`) to mimic a traditional brush stroke.
* **Dividers:** Avoid standard 1px solid lines. Instead, use a **2px line** colored with the `Secondary UI` color (`Slate Indigo` or `Faded Slate`) at **30% opacity**.
* **The Red Stamp (Feedback):** For accomplishments (e.g., completing a session/move), animate a red stamp graphic (using `AccentColor`) slamming onto the UI element with a subtle scale-down effect. This provides weight to the accomplishment (**gamification**).

---

## 4. UI Application: Putting it on the Mats

### Cards (Training Logs)
* **Specification:** Background: `ViewBackground` (White/Aged Vellum).
* **Design Notes:** Elevated via color change and a prominent border/shadow effect.

### Card Shadow
* **Specification:** `box-shadow: 4px 4px 0px #2B2B2B;` (Sumi Charcoal)
* **Design Notes:** Use **"Hard Shadows"** (solid blocks of color) instead of soft drop shadows to explicitly mimic the aesthetic of a woodblock print.

### Metadata
* **Specification:** Text Color: `SecondaryText` (Slate Indigo/Faded Slate).
* **Design Notes:** Separates data (dates/tags) from primary content, cooled down by the blue/slate tone  .

### Navigation Bar
* **Specification:** Background: `AppBackground`. Top Border: `SecondaryText`.
* **Design Notes:** Inactive Icons: `SecondaryText` (50% opacity). Active Icon: `AccentColor` (Vermilion Red, 100% opacity).

### Video Player
* **Specification:** Sharp, rectangular, **no rounded corners**.
* **Design Notes:** Should look like a window onto the technique, contrasting with the manuscript design.

### Instruction Steps
* **Specification:** Step Number: Large, Serif, `AccentColor` (Vermilion Red). Instruction Text: Sans-serif, `PrimaryText` (Charcoal/Vellum White).
* **Design Notes:** Uses the type contrast: the large serif number is the "Art," and the plain sans-serif text is the "Instruction".

### CTA Button
* **Specification:** Example: "Mark as Drilled". Background: `PrimaryText` (Charcoal). Text: `Vellum White`. Shape: Rectangular with very slightly rounded corners (2px).
* **Design Notes:** High contrast, Charcoal on Vellum white, for maximum emphasis.

---

## 📝 Summary for the Designer

* **DO:** Use the **Slate Indigo** (`SecondaryText`) primarily to color metadata, borders, and inactive icons. It cools down the warmth of the cream background effectively.
* **DO:** Mix **Serif Headers** (`Crimson Text`) with **Sans-Serif Body** text (`Lato`/`Source Sans Pro`) for a sophisticated "Modern Classic" look.
* **DO:** Use **"Hard Shadows"** (`box-shadow: 4px 4px 0px #2B2B2B;`) instead of soft drop shadows to mimic woodblock printing.
* **DON'T:** Let the UI look muddy. If the Slate Indigo or Deep Indigo looks too dark, **lower the opacity** of the foreground elements, do not lighten the color itself.