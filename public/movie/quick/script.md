# Erdős #728 — five moves in a Lean proof

Original educational animation. Narration: Samantha, a macOS synthetic voice.

Scope: the final assembly of `Erdos728b.erdos_728_fc`; supporting lemmas summarized. The proof chooses the epsilon interval (0, 1/2).

## 00:00 — THREE NUMBERS. SIX CHECKS.

Source line 1377:

```lean
∃ a b n : ℕ, ...
```

Three mystery numbers. Six checks. Can we make every light turn green?

One check means a perfect fit: divide, with nothing left over.

Math layer: Find a,b,n: positive n; a,b > εn; a!b! ∣ n!k!; C log n < k < C′ log n. Here k = a+b−n.

## 00:09 — GIVE YOURSELF SOME ROOM.

Source line 1386:

```lean
set c := (C + C') / 2 with hc_def
```

First, pick a middle setting. Now we've got wiggle room on both sides.

Math layer: 0 < C < C′. Choose c = (C+C′)/2, so C < c < C′.

## 00:13 — ONE SETTING. FIVE GREEN LIGHTS.

Source line 1390:

```lean
obtain ⟨M, hM⟩
```

Five helpers need a big enough number. Crank it up until every helper is ready.

Now we get the number, plus proof that all five are ready.

Math layer: Choose M beyond five eventual thresholds; hM packages the five guarantees.

## 00:22 — THEY CAN'T ALL LOSE.

Source line 1403:

```lean
obtain ⟨ m, hm ⟩ := hM.2.2.2.2.2;
```

The bad candidates get knocked out. But the proof says there aren't enough bad ones to remove everybody.

Someone survives. Take that number, and its proof.

Math layer: Counting lemma: |bad| < M+1 = |[M,2M]|. Extract m outside the bad set and its evidence hm.

## 00:31 — WATCH THE BLUE PIECES.

Source line 1404:

```lean
use m + k_val c M, m, 2 * m;
```

Build our three numbers from these pieces. Now add the first two and subtract the third.

Blue cancels blue. Again. What's left? Just the yellow piece. That's the gap we needed to control.

Math layer: a=m+k, b=m, n=2m; k=⌊c log M⌋. Thus a+b−n = (m+k)+m−2m = k.

## 00:43 — BRING THE RECEIPTS.

Source line 1411:

```lean
refine' ⟨ by linarith, _, _, this.2.2.2.2.1, this.2.2.2.2.2, _ ⟩;
```

Building the numbers isn't enough. Each check needs evidence.

The earlier lemmas bring the receipts. Lean checks every one. Six green lights.

Math layer: The construction lemma supplies divisibility and bounds; refine assembles them; linarith/nlinarith finish inequalities.

## 00:52 — BUILD IT. PROVE IT. DONE.

Source line 1419:

```lean
#print axioms erdos_728_fc
```

That's the idea: build numbers so the gap becomes simple, then prove every requirement.

The full proof checked in Lean. The deeper lemmas are summarized here.

Math layer: erdos_728_fc: the proof uses 0<ε<1/2 and 0<C<C′. Standard axioms: propext, Classical.choice, Quot.sound; no sorryAx.

Source: https://github.com/plby/lean-proofs/blob/f06c4076c5352252d1dbab91ae3afa28037f466c/src/v4.24.0/ErdosProblems/Erdos728b.lean
