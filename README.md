# Oryzo AI — 3D Autonomous Surface Landing Page

A premier, high-fidelity 3D product landing page inspired by [oryzo.ai](https://oryzo.ai/) (crafted by Lusion Studio, Awwwards Site of the Day & CSS Design Awards winner) and engineered following the exact folder structure and SCSS modular architecture of **henleyfashion-front**.

---

## ⚡ Tech Stack & Architecture

- **Framework**: [Next.js](https://nextjs.org/) (App Router: `src/app/`)
- **Styling**: SCSS Modular Architecture (`src/styles/` with tokens, mixins, reset, typography, layout, and component modules)
- **3D Graphics**: [Three.js](https://threejs.org/) (WebGL real-time interactive 3D model with 360° rotation, exploded view, infrared thermal visualization, and CAD wireframe)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: Web Audio API Procedural Synthesizer (`src/lib/audio.js`) for futuristic sci-fi sound design
- **State Management**: React Context (`ProductContext.jsx`, `SettingsContext.jsx`)

---

## 📁 Folder Structure (Matching Henley Fashion)

```text
3d-landing/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx              # Glassmorphic Navbar with audio toggle & live status
│   │   │   ├── TopAnnouncement.jsx     # Live batch countdown & launch ticker
│   │   │   ├── Footer.jsx              # Tech footer with coordinates & satire disclaimer
│   │   │   └── FloatingActions.jsx     # Floating 3D view, audio FX, and pre-order triggers
│   │   └── sections/
│   │       ├── HeroBanner.jsx          # Cinematic hero with 2.5D holographic card & telemetry
│   │       ├── Interactive3DViewer.jsx # Three.js WebGL 3D Canvas (Studio, Exploded, Thermal, CAD)
│   │       ├── FeatureHighlights.jsx   # 6 patented engineering breakthrough cards
│   │       ├── ThermalScanner.jsx      # Interactive FLIR radiometric infrared comparison slider
│   │       ├── MicroscopicZoom.jsx     # Nanoscale canvas with crawling tardigrade easter eggs
│   │       ├── MaterialCustomizer.jsx  # 4 luxury finishes (Obsidian, Titanium, Amber, Bio-Cork)
│   │       ├── TechSpecs.jsx           # Technical specifications and architecture matrix
│   │       ├── PressReviews.jsx        # Awwwards SOTD, Wired, and TechCrunch accolades
│   │       └── OrderForm.jsx           # Batch 01 reservation form with live price calculation
│   ├── context/
│   │   ├── ProductContext.jsx          # Finishes, 3D mode, sound state, and cart state
│   │   └── SettingsContext.jsx         # Site configuration and global metadata
│   ├── lib/
│   │   └── audio.js                    # Procedural Web Audio sci-fi sound effects
│   └── styles/
│       ├── globals.scss                # Global SCSS master bundle
│       ├── abstracts/
│       │   ├── _tokens.scss            # Cyber noir color palette, glowing tokens, fonts
│       │   └── _mixins.scss            # Glassmorphism, cyber glow, and flex helpers
│       ├── base/
│       │   ├── _reset.scss             # Modern dark-mode reset & scrollbars
│       │   └── _typography.scss        # Plus Jakarta Sans, Syne, and JetBrains Mono typography
│       ├── layout/
│       │   ├── _container.scss         # Responsive containers
│       │   └── _utilities.scss         # Glow buttons, glass buttons, radar & float animations
│       └── modules/                    # Individual component SCSS stylesheets
├── jsconfig.json                       # Path alias mapping (@/* -> ./src/*)
├── next.config.mjs                     # Next.js configuration
└── package.json                        # Project dependencies and build scripts
```

---

## 🚀 Getting Started

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

