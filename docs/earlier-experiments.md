# Visual Lean proofs

A local React + Vite walkthrough of a complete four-line proof:

```lean
theorem swap_and (A B : Prop) (h : A ∧ B) : B ∧ A := by
  constructor
  · exact h.right
  · exact h.left
```

The visual shows two supplied facts and the slots they fill. `constructor` splits the AND goal; `h.right` supplies B; `h.left` supplies A. The example labels “has a ticket” and “has an ID” help explain A and B; the theorem proves the result for any propositions A and B.

Four selectable steps, synchronized source highlighting, 3D connections, goal counts, previous/next, replay, and playback. The final step has no remaining goals.

## Run locally

Requires Node.js 22.13+ and npm. Fonts, source, and recorded proof states are bundled locally.

```sh
cd path/to/erdos-visualizer
npm install
npm run dev
```

Open the URL printed by Vite, normally http://127.0.0.1:5173.

## Verification

```sh
npm run verify:proof
npm test
npm run build
```

`verify:proof` requires Lean on PATH (checked with Lean 4.33.1). It checks `lib/source/swap_and.lean`, instruments a temporary copy with `trace_state`, and records the resulting states and source SHA-256 in `lib/source/proof-check.json`. It also checks that the theorem depends on no axioms. The browser replays these real recorded states; it does not run Lean itself.

Tests ensure source fidelity to the checked hash, exact line mappings, goal counts, and the correct order of fact matching. The build type-checks TypeScript and writes a standalone static app to `dist/`. Use `npm run preview` to serve it locally.

The earlier Erdős source snapshot is retained in `lib/source/93.lean` for reference; it is not part of the active walkthrough.

## Erdős #728 tab

The second tab uses the exact `Erdos728b.lean` source cited in §6 of the supplied paper, arXiv:2601.07421v5. The earlier related file `Erdos728p.lean` is not used.

Five grouped stages explain the final theorem `Erdos728b.erdos_728_fc`, with exact source expressions and an interactive Three.js proof graph. The prior helper lemmas are collapsed, and the diagram is not a recorded tactic-state trace. The separate theorem `erdos_728` proves an infinite-family formulation; this tab specifically covers the two-sided logarithmic-window existence theorem.

The full reproducible Lean project is in `../erdos728-proof`, pinned to Lean 4.24.0 and the upstream Mathlib revision. Verification status is recorded there and mirrored in `lib/source/erdos728-check.json`. Both tabs retain their step when switched; switching tabs pauses playback.


## 3D graphs and narrated film

Both walkthroughs use Three.js WebGL scenes. Drag to orbit, scroll or pinch to zoom, click a node to select a step, and use Reset view to restore the camera. The HTML step buttons provide keyboard navigation. Only the visible graph mounts a renderer; GPU resources are disposed when switching tabs. Rendering is on demand.

The **Watch proof** tab plays a locally generated, captioned 720p animation of the final five steps of `erdos_728_fc`. MP4 video, MP3 narration, Markdown script, and WebVTT captions are in `public/movie/`. Earlier supporting lemmas are summarized; this is an explanation, not a live Lean execution trace. The narration uses the macOS Samantha synthetic voice.

To regenerate (macOS `say`, FFmpeg, and Chrome required; otherwise install Playwright Chromium for the renderer):

```sh
npm run dev
# In a second terminal:
npm run film:audio
npm run film:render
```

Edit `scripts/film/script.json` for narration, or `scripts/film/scene.js` for the Three.js animation. Sentence audio durations generate the chapter timeline and caption timestamps. The renderer captures 24 frames per second and encodes an H.264/AAC MP4. Intermediate renders live in ignored `.film-cache/`.

The revised film tells the proof through six locked doors, five threshold checkpoints, falling candidates, two separate cancellation movements, and evidence receipts unlocking the doors. Animation events use measured sentence timestamps from the narration. `public/movie/seedance/production-script.md` condenses the story into five eight-second Seedance prompts; `seedance-production-kit.zip` includes the prompts and seven reference frames.


## Quick visual cut

The default Watch proof experience is a separate ~62-second cut with rounded 3D pieces, an illustrative exact-division example, a surviving-candidate animation, two cancellation collisions, and six proof checks. Short sound cues are synchronized to these events. A quiet math strip and expandable current-step explanation retain exact mathematical context. The original ~3:23 doors cut remains selectable. Switching versions stops playback and loads the matching script, captions and downloads.

New assets live in `public/movie/quick/`; edit `scripts/quick/script.json` and `scripts/quick/scene.js`. With Vite running, regenerate using `npm run film:quick:audio`, then `npm run film:quick:render`. The narration download is voice-only; the video includes the mixed sound cues.
