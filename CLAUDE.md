# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

《请替我沉默 / Keep Silent For Me》is a 30-minute narrative puzzle game where players control a parasitic entity ("消音体") that feeds on unsaid words. The game uses a unique mechanic: drag a black bar to mask parts of dialogue, with masked text becoming the creature's body while remaining text is spoken aloud.

**Current Status**: Pre-Production Complete, Ready for Development  
**Tech Stack**: Web (HTML5 + CSS + JavaScript, no frameworks)  
**Target**: 7-day development cycle for vertical slice

## Architecture

### Document Hierarchy (Single Source of Truth)

1. **台本.md** - Authoritative source for all 35 dialogue sentences, 6 chapters, video storyboards
2. **script/chapters.json** - Machine-readable game data (generated from 台本.md)
3. **schedule.md** - Complete game design + Web implementation guide (§11 Program Assembly Manual)

**Critical Rule**: When dialogue content conflicts between files, 台本.md 以丰富的为准 (use the richer source as standard).

### Core Game Loop

```
Complete sentence appears on screen
→ Player drags black bar to cover continuous text zone
→ Covered text is "eaten" by creature (grows visually)
→ Remaining text is spoken aloud
→ NPC/audience reacts
→ Next sentence or chapter settlement
```

**Constraint**: Player can ONLY mask 3-4 pre-defined continuous zones per sentence, no free-form text editing.

### Data Structure (script/chapters.json)

```javascript
{
  "chapters": [
    {
      "id": "L0",           // Chapter ID
      "title": "开场",      
      "scene": "apartment_rain",
      "lines": [
        {
          "id": "L0_S01",
          "raw": "完整句子",           // Full sentence shown to player
          "face": "依赖",              // Character expression
          "zones": [                   // 3-4 maskable zones
            {
              "text": "可遮挡的文字",  // MUST be continuous substring of raw
              "remain": "遮后剩余句",   // Hand-written sentence after masking
              "npc": "NPC反馈",
              "flags": ["pass+"],      // Flag modifications
              "eat": "进入消音体的低语"
            }
          ]
        }
      ]
    }
  ]
}
```

**Critical**: `zone.text` must be an exact continuous substring of `line.raw`. Web implementation uses `raw.indexOf(zone.text)` to locate zones.

### Web Implementation Strategy

**Key Technical Solution**: Use DOM `<span>` wrappers for zones, then `getBoundingClientRect()` to get precise screen positions. NO manual character bounding box calculation needed.

```html
<!-- Zone wrapping example -->
<div id="dialogue-text">
  我<span class="zone" data-id="0">其实没什么经验，而且我经常会说错话，</span>但我真的很需要这份工作。
</div>
```

```javascript
// Get zone position
const zone = document.querySelector('[data-id="0"]');
const rect = zone.getBoundingClientRect(); // {x, y, width, height}
```

**Project Structure** (when creating web/ directory):
```
web/
├── index.html
├── css/
│   ├── style.css
│   ├── dialogue.css
│   └── animations.css
├── js/
│   ├── game.js           # Core game state machine
│   ├── drag-handler.js   # Black bar drag + snap logic
│   ├── video-player.js   # HTML5 video with preload
│   └── save-manager.js   # localStorage save/load
└── assets/
    ├── data/chapters.json  # Copy from script/
    ├── bg/                 # 4-5 scene backgrounds
    ├── char/               # Character poses + expressions
    ├── creature/           # 3 creature stages
    ├── video/              # 9-11 outro videos
    └── audio/              # SFX + BGM
```

## Development Workflow

### Day 0: Technical Validation (MUST DO FIRST)

```bash
# 1. Test zone wrapping (copy from WEB_TECH_STACK.md §Day 0)
# Create test-zone.html and verify getBoundingClientRect() works

# 2. Generate 1 test video (V0_out)
# Use the current storyboard prompts under storyboard/demo-effects/prompts/
# Verify doomer style consistency

# 3. Test mobile browser
# Touch drag, video autoplay, localStorage
```

### Day 1+: Start Development

```bash
# Copy Day 1 demo template from WEB_TECH_STACK.md §Quick Start
# 160-line HTML with full drag-snap implementation

# Local development server
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Asset Generation

```bash
# Base prompts live under art/prompts/; the current playable pack uses
# art/v4/playable/prompts/ and generate.sh. Use the edit endpoint with the
# canonical reference image for identity-sensitive layers.
# Model: gpt-image-2
# Validate with: python3 art/v4/playable/validate.py
```

## Critical Constraints

### Doomer Art Style (NON-NEGOTIABLE)

From art-style.md:
- **Color**: Deep black, blue-black, dirty grey-green, minimal red (≤2%)
- **Lighting**: Single desk lamp + rain window, 35mm grain
- **NO**: Bright colors, cute idol style, cyberpunk neon, glossy 3D

**Creature Design**: 消音体 is abstract text/ink entity. **ABSOLUTELY NO facial features, eyes, or ghost face**. Think: living calligraphy, sentient ink stain.

### Game Design Rules

1. **Only one action**: Drag black bar to mask text (no typing, no menus, no other skills)
2. **Continuous masking**: Can only mask one continuous text segment, not multiple scattered words
3. **3-4 zones per sentence**: Pre-defined zones, no free-form NLP
4. **Failure is narrative**: Failed attempts restart chapter with story context, not Game Over screen
5. **No numeric UI**: No HP bars, no affection meters, no follower counts

### Flag System

Flags are counters tracked in `gameState.flags`:
- `pass`/`fail` - Chapter 1 settlement (need pass≥4 && fail<2)
- `hate_leak` - Chapter 2 settlement
- `apology_perform`/`apology_refuse` - Chapter 4 branching
- `mask`, `truth`, `bond`, `crack`, `control` - Optional for easter eggs/reversal

## Key Documents Quick Reference

| Document | Purpose |
|----------|---------|
| **WEB_TECH_STACK.md** | Complete Web implementation guide + Day 1 demo code |
| **art-style.md** | Canonical doomer art direction and visual constraints |
| **art/v4/playable/README.md** | Current playable asset generation and runtime binding guide |
| **schedule.md §11** | Program assembly manual (state machine, JSON contract) |
| **schedule.md §12** | Art asset specs and file naming |
| **schedule.md §13** | Audio resources (Freesound.org, Incompetech.com) |

## Deployment

```bash
# Vercel (recommended)
npm install -g vercel
vercel

# Netlify (drag-drop)
# Visit app.netlify.com/drop

# GitHub Pages
# Settings → Pages → Deploy from main branch
```

## Common Pitfalls

1. **Don't auto-generate `remain` text**: Each zone's `remain` field is hand-written for narrative quality. Never use string manipulation to generate it.

2. **Don't create zone coordinates manually**: Web solution uses DOM span wrapping, not manual x/y/w/h coordinates.

3. **Don't give creature a face**: 消音体 stages must remain abstract text/ink masses. Any facial features violate core art direction.

4. **Don't add numeric UI**: No health bars, no meters. Flags are invisible counters for branching logic only.

5. **Validate zone.text is substring of raw**: At game startup, verify every `zone.text` exists in its `line.raw` via `indexOf()`. Fail loudly if not found.

## NetEase Leihuo Game Jam Context

This project is for 网易雷火游戏比赛 (NetEase Leihuo Game Jam). Target is a complete vertical slice in 7 days with potential for 2-3 week polish cycle. Focus on completing core loop (L0+L1) before expanding to all chapters.
