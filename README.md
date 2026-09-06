# Erdős Distance Lab

An interactive 2D evaluation of finite examples of Erdős problem 93. Choose a square, rectangle, pentagon, or hexagon; walk through each convexity check, the target, and every unordered pair's measurement and grouping. All presets use integer coordinates and squared distances are compared exactly.

This is an example evaluator, not a general proof or a Lean execution trace. The upstream statement is `Erdos93.erdos_93` in `FormalConjectures/ErdosProblems/93.lean`. That file contains a `sorry` placeholder and a link to a separate formal proof.

## Development

- `npm install`
- `npm run dev`
- `npm run build`
- `npx tsc --noEmit`
- `node --experimental-strip-types --test tests/experiment.test.mjs`

The calculation tests cover independently checked distance sets, convexity, pair uniqueness, complete traversal, grouping timing, and pair revisit targets for all presets.

## Optional agent interaction

When the browser supports `document.modelContext`, `navigate_distance_run` selects a shape and a 1-based step, pauses playback, and updates the visible experiment. Inputs are validated before state changes. It is feature-detected and unregistered on unmount. No supported browser/WebMCP context was available during creation, so browser interactions and the WebMCP contract have not been runtime-verified.

## Sources

- https://www.erdosproblems.com/93
- https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/ErdosProblems/93.lean
