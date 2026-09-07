# Small Proofs

**[Open the public site](https://erdos-proof-playground.vercel.app/)** · [Download all ten proofs](https://erdos-proof-playground.vercel.app/proofs/ten-erdos-proofs.zip) · [GitHub](https://github.com/lorem111/erdos-proof-playground)

Ten real Erdős proofs, explained through forty interactive browser-animation steps and the actual Lean source. React + TypeScript + Vite; runs with normal local npm. No backend or API keys.

## Run

Requires Node.js 22.13+.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. `npm run build` creates the static site in `dist/`; `npm run preview` serves the production build.

## The collection

| Problem | Walkthrough | Core move |
| --- | --- | --- |
| 399 | One example wins | Supply and check a witness |
| 493 | A number-making machine | A symbolic two-number recipe |
| 1193 | Everyone gets a partner | Unfold a counting definition |
| 231 | The anti-copy scanner | Check all 56 even windows |
| 316 | Two bins. No way | Exhaust all 2,048 subset assignments |
| 692 | The dip that breaks a rule | Exact periodic counts and inequalities |
| 794 | A ticket factory loophole | Test a fixed nine-vertex construction |
| 397 | The great cancellation | Cancel factors; build an infinite family |
| 363 | The square-making machine | A polynomial square identity |
| 645 | Every escape route closes | Case splits, color symmetry, and induction |

Each has four narrated-in-text stages, an HTML/CSS animation, and exact line references. Play/pause, speed control, keyboard navigation, presentation mode, reduced-motion support, and per-step URLs such as `/#316/2` work without a backend. Progress is stored only in the viewer's browser. The final three entries introduce deeper ideas; “approachable” describes the walkthrough, not the full proof's difficulty.

## What is actually verified

These are illustrated source walkthroughs, not a Lean interpreter inside the browser. JavaScript computes the interactive examples independently. The symbolic Lean proofs cover their formal statements, including infinite families and arbitrary inputs that no slider can exhaust.

The source is pinned to [plby/lean-proofs](https://github.com/plby/lean-proofs/tree/f06c4076c5352252d1dbab91ae3afa28037f466c), commit `f06c4076c5352252d1dbab91ae3afa28037f466c`, using Lean/Mathlib 4.33.0. Eleven original `.lean` files (ten main files plus #231's helper) are in `public/proofs/ErdosProblems/`. Original author and license notices are preserved. This educational app is independent of the upstream authors, Erdős Problems, and the Lean project.

Read [`public/proofs/verification.json`](public/proofs/verification.json) for the local compilation report. Reproduce it with an installed [elan](https://github.com/leanprover/elan):

```sh
cp -R public/proofs/ErdosProblems verification/
cd verification
lake exe cache get
lake build ErdosProblems.Erdos399 ErdosProblems.Erdos493 ErdosProblems.Erdos1193 ErdosProblems.Erdos231 ErdosProblems.Erdos316 ErdosProblems.Erdos692 ErdosProblems.Erdos794 ErdosProblems.Erdos397 ErdosProblems.Erdos363 ErdosProblems.Erdos645
```

On a memory-constrained machine, build one target at a time. The pinned `lake-manifest.json` records dependency revisions.

Scope caveats are visible under each walkthrough:

- #1193 formally proves the convolution identity. The density consequence is in source comments.
- #692 formally defines the proportion over a common period, proves periodicity, and proves two inequalities. A separate limiting-density identification is not formalized here.
- #794's finite construction is checked; its upstream universal wrapper uses a fixed `V_set` in `has_subgraph` and omits an edge-containment condition. We explicitly explain the fixed construction rather than silently treating the wrapper as a stronger general theorem.
- #231 is a finite counterexample, not the stronger infinite-word result.

## Validation and maintenance

```sh
npm test
npm run build
# With the dev server running (Chrome installed):
npm run test:browser
# Or check the public deployment:
APP_URL=https://erdos-proof-playground.vercel.app npm run test:browser
```

The tests check exact arithmetic, positive controls for the word scanner, every packing and hypergraph case, large integer identities, and source hashes. UI source: `app/page.tsx`, `app/arcade-scenes.tsx`, `app/arcade.css`. Story content: `lib/arcade/content.ts`. Example calculations: `lib/arcade/math.ts`.

`python3 scripts/curate-ten.py /path/to/lean-proofs` refreshes the copies from a local checkout **only at the pinned commit**. Changes to the proof version require a deliberate content and scope review.

## Publish

The app is configured for Vercel's Vite framework. Import this repository into Vercel or run `npx vercel --prod`. No environment variables are required. The production branch is `main`.

Earlier local swap, #728, and film experiments remain in the repository for continuity; they are not the collection's homepage. See `docs/earlier-experiments.md`. Large rendered film assets are excluded from Vercel uploads.
