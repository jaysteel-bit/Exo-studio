# Exo-studio

Exo's HyperFrames home: the Exo block registry, brand files, a project template, and the Exo video projects themselves. Videos are HTML compositions ([HyperFrames](https://github.com/heygen-com/hyperframes), Apache-2.0), so every project here can be edited, diffed and rendered without any one app.

**Clone it to `~/Desktop/exo-studio`.** Flow OS → Exo Launch → Launch Studio lists the projects in that folder (and in `~/.hyperframes-studio`, where the HyperFrames app creates them). The **Exo editor** side of Launch Studio opens any of them; the **HyperFrames app** side is HeyGen's desktop app docked in the pane.

## Layout

| Path | What |
|---|---|
| `registry/` | The Exo block registry, in HyperFrames' registry format (`registry.json` + one folder per block). |
| `brand/` | Brand files every project gets: Google Sans (OFL) and the Exo orb + icons. |
| `templates/exo-film/` | Starting `index.html` for a new project (Exo ground/ink tokens, fonts, GSAP). |
| `scripts/` | `new-project.mjs` (create a correctly named project), `sync-brand.mjs` (restore brand files after a clone). |
| `YYYY-MM-DD__campaign__piece/` | Projects, at the repo root. |

## Naming projects

```
YYYY-MM-DD__<campaign>__<piece>[-<format>]
```

- `YYYY-MM-DD`: the day the project starts.
- `campaign`: what it is for, lowercase with hyphens (`exo-launch`, `exo-academy`, `exo-membership`).
- `piece`: the deliverable (`product-film`, `exa-teaser`, `hook-test-b`).
- `format`: left off for 16:9; otherwise `9x16`, `1x1` or `4x5`.

Examples: `2026-10-26__exo-launch__product-film`, `2026-11-20__exo-academy__exa-teaser-9x16`.

The folder name is the project's id (HyperFrames writes it into `meta.json` and `project.json`), so create projects with the script rather than by hand, and rename one only with the HyperFrames app closed.

```bash
node scripts/new-project.mjs exo-launch product-film
node scripts/new-project.mjs exo-academy exa-teaser --format 9x16 --date 2026-11-20
```

## Blocks

New projects point their registry at this repo (`hyperframes.json` → `registry`), so Exo blocks install like HeyGen's:

```bash
npx --yes hyperframes@0.8.204 add exo-cta-lockup --dir "2026-11-20__exo-academy__exa-teaser-9x16"
```

| Block | Beat | Length | Needs in the project |
|---|---|---|---|
| `exo-hook-hero-reveal` | hook: a hero photo burns in heat and clears to the real image, the line steps in | 3.6 s | a 16:9 hero photo at `assets/brand/runner-16x9.jpg` |
| `exo-proof-inbox-sheet` | proof: Exo joins the inbox, the Membership sheet rolls in | 7.5 s | (ships the orb) |
| `exo-turn-go-further` | turn: punch through "Go further" into a giant Exo | 4.0 s | a hero photo at `assets/brand/runner.jpg` |
| `exo-cta-lockup` | CTA: goal or experience, one Exo, Apply | 6.3 s | (ships the orb and icons) |

All four come from the first Exo launch film (2026-10-26) and are 1920×1080. They need Google Sans at `assets/fonts/` (every project made by the script has it). Still to add: a fonts/tokens component, the orb on its own, a music-bed slot, and 9:16 versions.

To use a HeyGen registry block in an Exo project, set `registry` in that project's `hyperframes.json` back to `https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry`, add the block, then set it back.

## What is not in git

This repo is public. Renders, caches and per-project font copies are ignored; run `node scripts/sync-brand.mjs` after cloning to put the fonts back. Licensed or third-party media (music beds, stock or client photos, footage) goes in a project's `assets/local/`, which is ignored, and stays on the machine or in Exo's media storage.

## Rendering

```bash
cd "2026-10-26__exo-launch__product-film" && npx --yes hyperframes@0.8.204 render
```

Volume renders are planned to run on the Contabo render queue (one render at a time, memory-capped).
