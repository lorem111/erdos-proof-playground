# Erdős #728 — Seedance 2.5 production script

**Five clips × 8 seconds = 40 seconds.** This condenses the longer local animation into the five requested story scenes. The choice of c is folded into clip 2; the closing recap is folded into clip 5.

## Shared direction — prepend to every clip prompt

Create an 8-second educational 3D motion-graphics shot, 16:9. Midnight navy background (#080f1c), softly lit solid blocks, restrained highlights, large readable shapes, generous empty space. A consistent visual language throughout: blue blocks represent m; yellow blocks represent k; teal indicates established evidence; coral indicates rejected candidates. Use the same three containers and the same six hinged doors throughout. Their order never changes. Camera nearly frontal with slight depth; smooth deliberate movement; one visual action at a time. Each movement must explain a logical step. No people, mascots, scenery, decorative particles, dramatic camera sweeps, music, logos, or extra objects. Preserve exact object counts. Hold the completed state for the final second.

Narration: warm, patient, matter-of-fact adult voice; everyday English; no imitation of a specific person. Speak only the supplied sentence, comfortably within eight seconds. Small soft clicks may mark a successful action, quieter than narration.

Generate the visual objects and motion with clean blank areas for typography. Add the exact labels, mathematical symbols, captions, and Lean code listed below as editing overlays. This keeps the mathematical text under our control. Labels should remain attached to the corresponding objects.

Use the supplied reference images to preserve the visual design. They are layout/style references, not instructions to reproduce every object at every moment. The timecoded prompt determines what appears and moves.

## Clip 1 — The mission (00:00–00:08)

Reference: `01-mission.png`

**Generation prompt:**

0–2s: Three empty open containers arrive gently from the left and settle across the upper half of the frame. Blue, violet, and teal edge accents distinguish them. The camera settles with them.

2–4s: Exactly six closed rectangular doors rise into a row below. Each has one small golden padlock. Nothing unlocks. Let the viewer count the objects.

4–6.5s: A small golden pulse visits the six locks one at a time. The camera moves slightly closer, making the unfinished requirements the focus. Keep all three empty containers visible.

6.5–8s: Hold the entire composition: three empty containers above, six locked doors below. The story has a clear unfinished task.

**Voiceover:** “We need three numbers. But they must satisfy six requirements. Each locked door needs its own proof.”

**Exact editing overlays:**
- Containers, left to right: `a = ?` · `b = ?` · `n = ?`
- Doors, left to right: `Positive n` · `a large enough` · `b large enough` · `Exact division` · `Gap above limit` · `Gap below limit`
- Bottom source ribbon: `∃ a b n : ℕ, ...` — source line 1377.
- Small title: `Three numbers. Six requirements.`

## Clip 2 — Make every helper work (00:08–00:16)

Reference: `02-promises.png`

**Generation prompt:**

0–2s: Two small input tiles slide into a simple central processing block. A teal output tile emerges below it. This is the average operation. Keep the motion short and visually explicit.

2–3s: Pull the processing block upward and out of focus. Reveal exactly five checkpoint blocks in a row, each with a coral status light.

3–6s: One large yellow number-token travels beneath all five checkpoints from left to right. As it passes, each light turns teal. Previously passed lights stay teal; none turns green before the token reaches it.

6–7s: The five green checkpoints feed five thin connections into one teal receipt next to the yellow token. This shows that the number comes with evidence.

7–8s: Hold on the single number, its receipt, and all five green lights.

**Voiceover:** “Choose the middle. Then choose M big enough for every helper. All five promises now hold.”

**Exact editing overlays:**
- 0–2s: inputs `C`, `C′`; processing block `(C + C′) / 2`; output `c`.
- 2–8s: checkpoints `M ≥ M₁` through `M ≥ M₅`; traveling token `M`; receipt `hM`.
- 3–8s, below checkpoints: `M = M₁ + M₂ + M₃ + M₄ + M₅ + 2`.
- Bottom source ribbon, first 2s: `set c := (C + C') / 2 with hc_def` — line 1386.
- Bottom source ribbon, remaining 6s: `obtain ⟨M, hM⟩` — line 1390.

## Clip 3 — Someone must survive (00:16–00:24)

Reference: `03-survivor.png`

**Generation prompt:**

0–2s: Reveal exactly twelve small blue candidate tiles in two rows of six. Keep enough space between them to track individual movement.

2–4s: Nine tiles turn coral in a staggered sequence and fall out of the frame. Exactly three blue tiles remain. Do not remove all twelve. No new tiles appear.

4–5.5s: Pause on the three survivors. A gentle teal outline forms around them. The visual point is that the rejected group could not occupy the whole crowd.

5.5–7s: Choose one survivor visually: slide it forward to center and enlarge it. Dim the other two without removing them. A separate teal evidence receipt moves alongside the selected tile.

7–8s: Hold on the survivor and its receipt as a pair, with the other surviving tiles behind them.

**Voiceover:** “Bad candidates cannot fill the whole interval. Someone survives. We take that number together with its evidence.”

**Exact editing overlays:**
- Above the crowd: `Candidates between M and 2M`.
- While tiles fall: `# bad < # candidates`.
- Selected survivor: `m`; accompanying receipt: `hm`.
- Persistent small note: `Illustration of a counting proof — not a numerical search`.
- Bottom source ribbon: `obtain ⟨ m, hm ⟩ := hM.2.2.2.2.2;` — line 1403.

The twelve pictured candidates and nine rejections are illustrative counts, not values extracted from Lean.

## Clip 4 — The cancellation (00:24–00:32)

References: `04-cancellation-start.png`, `04-cancellation-end.png`

**Generation prompt:**

0–2s: Bring back the same three containers. Fill the first with one blue block and one yellow block. Fill the second with one blue block. Fill the third with two blue blocks. Exactly five blocks total: four blue, one yellow. Leave these source containers visible.

2–3.5s: Make one visual copy of each block and move the five copies into a single row below. The row represents the extra amount. From left to right: positive blue, positive yellow, positive blue, negative blue, negative blue. Distinguish the two negative blocks with thin coral outlines. Do not rely on color alone: editing overlays supply their minus signs.

3.5–5s: Move the first positive blue copy and the first negative blue copy together. When they meet, both shrink away. The other three copies remain stationary.

5–6.5s: Repeat with the remaining positive blue copy and negative blue copy. Both disappear. Do not remove the yellow copy or the original blocks in the upper containers.

6.5–8s: Slide the only remaining lower-row block, the yellow one, to center and enlarge it slightly. Hold. The whole extra amount has become this single piece.

**Voiceover:** “Choose the numbers this way. In their extra amount, both pairs of m cancel. Only k remains.”

**Exact editing overlays:**
- Containers: `a = m + k` · `b = m` · `n = 2m`.
- Blue blocks: `m`; yellow blocks: `k`.
- Lower row: `m + k + m − m − m`.
- During first cancellation: `m − m = 0`; repeat for the second pair.
- Final hold: `a + b − n = k`.
- Small persistent definition: `k = ⌊c log M⌋`.
- Bottom source ribbon: `use m + k_val c M, m, 2 * m;` — line 1404.

## Clip 5 — Bring back the evidence (00:32–00:40)

References: `05-doors-locked.png`, `05-doors-open.png`

**Generation prompt:**

0–1.5s: Return to the same six closed doors from clip 1, in precisely the same order. The three filled containers are visible above them. The locks are still closed: choosing numbers alone did not prove the requirements.

1.5–5.5s: Exactly six small teal evidence receipts move toward the six corresponding locks, one after another. Each receipt must reach its lock before that lock opens. As it arrives, the golden shackle lifts and the door swings inward on its hinge, revealing one teal checkmark behind it. Keep the other doors stationary until their receipts arrive.

5.5–7s: The final receipt arrives and the sixth door opens. Pull back slightly so all six open doors and all three filled containers are visible together.

7–8s: Hold the completed composition. Exactly six checkmarks. No locked doors. A quiet final click; no confetti or celebratory distractions.

**Voiceover:** “The lemmas supply evidence. Lean checks every requirement. All six doors open. Nothing is left unproved.”

**Exact editing overlays:**
- Requirements, kept readable even after doors open: `n > 0` · `εn < a` · `εn < b` · `a! b! ∣ n! k!` · `C log n < k` · `k < C′ log n`.
- Evidence origin label: `Supporting lemmas + inequality tactics`.
- Bottom source ribbon (two lines):
  `refine' ⟨ by linarith, _, _,`
  `this.2.2.2.2.1, this.2.2.2.2.2, _ ⟩;` — line 1411.
- Final title: `Lean checked. No sorry.`
- Small footer: `Final assembly of erdos_728_fc · earlier lemmas summarized`.

## Assembly

Place the five clips consecutively without overlapping their durations: exactly 40 seconds. Keep the same narrator and audio level. Add the exact typography and voiceover captions in the edit. Use each completed clip's final frame as an additional reference when generating the next clip. Keep at least one second of each important completed state on screen.

This is a compressed explanation of the final proof assembly, not a complete explanation of the earlier number theory. The checked construction works for 0 < ε < 1/2 and 0 < C < C′. Standard Lean axioms are used; there is no sorryAx dependency.

Source proof: https://github.com/plby/lean-proofs/blob/f06c4076c5352252d1dbab91ae3afa28037f466c/src/v4.24.0/ErdosProblems/Erdos728b.lean

Official Seedance 2.5 reference-control information: https://seed.bytedance.com/en/seedance2_5
