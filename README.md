# 🎬 LadyReels Automation Studio

An automated short-form video editing studio powered by **Remotion (React)**, styled with **Tailwind CSS**, and orchestrated via **Claude Code AI**. This production suite automatically applies a locked-in viral aesthetic featuring the **Anton** font, thick black text borders, heavy 3D drop-shadows, local punch-in zooms, static overlays, and a dynamic moving violet highlight subtitle block.

---

## 🏗️ Project Architecture

```text
LadyReels/
├── public/
│   ├── raw-clips/      <-- Drop your raw portrait phone clips (.mp4) here
│   └── editor-rules.txt<-- Dynamic rules hub: [REEL_TITLE], [ZOOM_KEYWORDS], [GRAPHIC_KEYWORDS]
├── outputs/            <-- Your finished, fully edited reels drop here (.mp4)
├── scripts/
│   └── ladyreels.ts    <-- Local pipeline: extracts audio, runs Whisper, structures JSON
├── src/                
│   ├── Root.jsx        <-- Dynamic multi-scene timeline duration calculation bridge
│   ├── Composition.jsx <-- Sequential clip timeline switcher & active zoom router
│   ├── MotionGraphics.jsx<-- Modular layout hub for structural banners (Welcome, Details, Farewell)
│   ├── Captions.jsx    <-- Dual-layer localized caption engine (4-word chunks + TRAILING_HOLD)
│   └── style.css       <-- Tailwind directive hub & Anton Google Font hook
├── config.json         <-- Main blueprint: managed timeline schema (scenes, text, shifts)
├── .clauderc           <-- AI automation protocols and custom trigger rules
├── package.json
└── README.md           <-- This instruction manual
```

---

## 🚀 Setting Up on Your Mac (or New Environment)

Follow these steps to pull your studio down from GitHub and prepare your environment instantly:

### 1. Clone & Navigate
```bash
git clone https://github.com
cd LadyReels
```

### 2. Install Project Dependencies
Installs the native Remotion rendering system, Tailwind styling controllers, TypeScript runners, and Google Font packages:
```bash
npm install
```

---

## 🎛️ The Hybrid Workflow Hub

Your studio operates on a dual-logic design. You manage content strategy using an open text file, while the background assets adapt automatically.

### Step 1: Manage Content Rules (`public/editor-rules.txt`)
Before running any render passes, configure your metadata here:
* **`[REEL_TITLE]`**: Set the overarching headline text for your video hook.
* **`[REEL_FAREWELL_TITLE]`**: Set the overarching headline text for your closing msg.
* **`[ZOOM_KEYWORDS]`**: Add comma-separated terms to force immediate 1.3x punch-in camera cuts.
* **`[GRAPHIC_KEYWORDS]`**: Map operational tags (e.g., `detalles: TEXT`) to trigger upper helper labels.

---

## 🤖 Hands-Free Automation with Claude Code

Once your raw video files are placed inside `public/raw-clips/`, open your terminal and fire up your AI editor assistant:

```bash
claude
```

Inside the interactive Claude shell, simply type the trigger command:
```text
run ladyReels
```

Claude will read your `.clauderc` protocol configuration and handle the heavy lifting:
1. **Audio Transcription pass:** Launches your automated local audio script (`npm run process-clips`) to measure frame metrics and gather words.
2. **Creative Timeline Trimming:** Analyzes spoken clips to slice out dead air or silences, writing precise `startFrom`, `endAt`, and structural `durationInFrames` dimensions into `config.json`.
3. **Local Word Re-indexing:** Shifts subtitle ranges back to a local `0` timeline origin so words match your mouth position even if frames are clipped or transition-blended.
4. **Final Render Compilation:** Launches the Remotion builder (`npm run render`) to compile and drop your finished short directly into `outputs/final-cut.mp4`.


