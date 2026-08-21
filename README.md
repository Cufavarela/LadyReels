# 🎬 LadyReels Automation Studio

An automated short-form video editing studio powered by **Remotion (React)**, styled with **Tailwind CSS**, and orchestrated via **Claude Code AI**. This template automatically applies a locked-in viral aesthetic featuring the **Anton** font, thick black borders, text drop-shadows, and a dynamic moving violet highlight bubble.

---

## 🏗️ Project Architecture

```text
LadyReels/
├── public/
│   └── raw-clips/      <-- Drop your raw portrait phone clips (.mp4) here
├── outputs/            <-- Your finished, fully edited reels drop here
├── src/                
│   ├── Root.jsx        <-- Video dimensions (1080x1920) and config bridge
│   ├── Composition.jsx <-- Sequential clip timeline management
│   ├── Captions.jsx    <-- Dual-layer caption engine (White text + Violet bubble)
│   └── style.css       <-- Tailwind directive hub & Anton Google Font hook
├── config.json         <-- Permanent style configurations and active data target
├── .clauderc           <-- AI automation protocols and custom trigger rules
├── package.json
└── README.md           <-- This instruction manual
```

---

## 🚀 Setting Up on a New Computer

Follow these steps to pull your studio down from GitHub and prepare your environment on another machine:

### 1. Clone & Navigate
```bash
git clone https://github.com
cd LadyReels
```

### 2. Install Project Dependencies
Installs the Remotion rendering cores, Tailwind styling libraries, and native Google Font packages:
```bash
npm install
```

---

## 🤖 Hands-Free Automation Workflow with Claude Code

Once your project packages are installed, you never need to touch the code again. You can manage everything through natural conversation with Claude.

### The AI Automation Engine (`.clauderc`)
The root of the project contains a custom `.clauderc` protocol configuration. This file acts as a permanent system memory for Claude Code. It embeds custom workflow scripts directly into the AI, mapping natural language keywords to localized backend video-processing tasks.

### Run the Automated Video Editing
Once Claude Code is running on your machine, the AI handles the timeline compilation, audio transcription, and rendering behind the scenes.

1. Drop all your raw vertical video clips into the asset directory: `public/raw-clips/`
2. Open your terminal in the root folder and start the AI session by typing:
   ```bash
   claude
   ```
3. Inside the interactive Claude shell, simply type the trigger command:
   ```text
   run ladyReels
   ```

Claude will automatically trigger the `.clauderc` protocol pipeline.

---

## 🔒 Git Etiquette Safety Warning
Your `.gitignore` file is programmed to track your layout infrastructure while **blocking heavy media assets**. Do not force-upload your raw `.mp4` contents to GitHub, or your remote repository limits will crash. Keep heavy media stored entirely on your local hard drives!
