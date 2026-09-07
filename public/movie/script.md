# Erdős #728 — five moves in a Lean proof

Original educational animation. Narration: Samantha, a macOS synthetic voice.

Scope: the final assembly of `Erdos728b.erdos_728_fc`; supporting lemmas summarized. The proof chooses the epsilon interval (0, 1/2).

## 00:00 — Three empty boxes. Six locked doors.

Source line 1377:

```lean
∃ a b n : ℕ, ...
```

Our story starts with three empty boxes: a, b, and n. We have to put whole numbers inside them.

But any old numbers will not do. There are six locked doors. Each door is a requirement, and each needs its own piece of evidence.

One door asks for factorial division with no remainder. Two others put limits on the extra amount, a plus b minus n.

Keep those doors in mind. We will build the numbers first, then bring back the evidence that opens them.

## 00:30 — First, leave room on both sides.

Source line 1386:

```lean
set c := (C + C') / 2 with hc_def
```

We are given a positive lower limit, capital C, and a larger upper limit, C prime.

Send both into the average machine. Out comes little c: add the two limits, then divide by two.

Little c sits strictly between them. The code checks both inequalities. That gives our construction room on both sides.

## 00:53 — Five promises. One number that works.

Source line 1390:

```lean
obtain ⟨M, hM⟩
```

Next come five helpers. Each says: I can help, but only when M is big enough.

The code adds their five thresholds, plus two. Watch this choice of M pass every checkpoint. All five promises now apply together.

Obtain hands us two things: the number M, and a receipt called h M. In Lean, that receipt is the proof that all five requirements hold.

## 01:18 — Someone has to survive.

Source line 1403:

```lean
obtain ⟨ m, hm ⟩ := hM.2.2.2.2.2;
```

One promise gives us a good candidate between M and twice M. Here is a small pretend crowd to picture the argument.

Bad candidates turn red and drop away. The counting lemma proves there are fewer bad candidates than there are places in the interval.

So they cannot all disappear. At least one survives. We call a survivor m.

Obtain brings m forward with its evidence, h m. This illustrates an existence proof; Lean is not testing the little tiles on screen.

## 01:48 — Now watch why these numbers work.

Source line 1404:

```lean
use m + k_val c M, m, 2 * m;
```

Remember our empty boxes? Use fills them. Put m plus k into a, m into b, and two copies of m into n.

The yellow piece k is c times the natural logarithm of M, rounded down. Earlier lemmas already give us bounds on it.

Now build the extra amount: a plus b minus n. Substitute the colored pieces from our boxes.

One positive m cancels one negative m. The second pair cancels too. What survives? Just k. That is the trick: the gap becomes something we already control.

## 02:22 — Bring the evidence back to the doors.

Source line 1411:

```lean
refine' ⟨ by linarith, _, _, this.2.2.2.2.1, this.2.2.2.2.2, _ ⟩;
```

The boxes are filled, but the six doors are still locked. Choosing numbers does not automatically prove they work.

The construction lemma brings evidence for factorial divisibility and other bounds. Watch that evidence travel to the requirements it proves.

Refine organizes the evidence into six slots. Linarith and nlinarith use the known facts to finish the remaining inequalities.

Every requirement now has a proof. All six doors open. There is nothing left to fill in.

## 02:54 — The whole journey, in one view.

Source line 1419:

```lean
#print axioms erdos_728_fc
```

We chose a middle value, made the helpers work together, took a surviving candidate, built the numbers, and supplied the evidence.

This proves the logarithmic window existence claim for epsilon between zero and one half, and positive C less than C prime.

The full source checked in Lean, with standard axioms and no sorry placeholder. We summarized the earlier number theory lemmas; those are also part of the checked proof.

Source: https://github.com/plby/lean-proofs/blob/f06c4076c5352252d1dbab91ae3afa28037f466c/src/v4.24.0/ErdosProblems/Erdos728b.lean
