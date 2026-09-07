import sources from './sources.json';
export type Step = {
  title: string;
  plain: string;
  why: string;
  lines: [number, number];
  file?: number;
  math: string;
};
export type Proof = {
  id: number;
  title: string;
  hook: string;
  tag: string;
  color: string;
  scope: string;
  steps: Step[];
};
const s = (
  title: string,
  plain: string,
  why: string,
  lines: [number, number],
  math: string,
  file?: number,
): Step => ({ title, plain, why, lines, math, file });
export const proofs: Proof[] = [
  {
    id: 399,
    title: 'One example wins.',
    hook: 'Four numbers. One enormous coincidence.',
    tag: 'Find a witness',
    color: '#c7f36b',
    scope:
      'An explicit solution to the factorial-and-powers existence question. One Lean line supplies the numbers and checks the conditions.',
    steps: [
      s(
        'Load four numbers',
        'Lean is asked: do numbers like this exist? It answers by handing over a specific set: 10, 48, 36, and 4.',
        'An “exists” claim needs just one working example.',
        [20, 23],
        'n = 10 · x = 48 · y = 36 · k = 4',
      ),
      s(
        'Run the arithmetic',
        'The exclamation mark means multiply 1 through 10. The little 4 means multiply that number by itself four times.',
        'These are the actual values that the final check compares.',
        [20, 23],
        '10! = 3,628,800 · 36⁴ = 1,679,616',
      ),
      s(
        'Make the totals meet',
        'Add 10! to 36⁴. It lands exactly on 48⁴. Not approximately. Exactly.',
        'The theorem allows either of two equations; this example satisfies the second.',
        [20, 23],
        '3,628,800 + 1,679,616 = 5,308,416',
      ),
      s(
        'Close every checkbox',
        'The product 48 × 36 is bigger than 1, and the exponent 4 is bigger than 2. “by decide” checks the full concrete claim.',
        'A proof must meet every condition, including the small print.',
        [20, 23],
        '1 < 48 × 36 · 2 < 4 · equality ✓',
      ),
    ],
  },
  {
    id: 493,
    title: 'A number-making machine.',
    hook: 'Pick a target. Two numbers always produce it.',
    tag: 'Build a recipe',
    color: '#9bc9ff',
    scope:
      'For every natural n, two integers at least 2 can have product minus sum equal to n. The same symbolic recipe works for all n.',
    steps: [
      s(
        'Accept any target',
        'Choose a number n, including zero. Lean first commits to using just two ingredients, for every target.',
        '“intro n” means we must handle an arbitrary n, not one lucky example.',
        [23, 31],
        'k = 2 · N = 0 · n ≥ 0',
      ),
      s(
        'Fill the two slots',
        'Put n + 2 in the first slot and 2 in the second. Move the slider: the recipe adjusts automatically.',
        '“use” supplies the ingredients required by the existence claim.',
        [32, 32],
        'a₁ = n + 2 · a₂ = 2',
      ),
      s(
        'Multiply. Then subtract the sum.',
        'Multiplying gives 2n + 4. Adding gives n + 4. Subtracting leaves exactly n.',
        'The extra pieces cancel. This is why the recipe works for every input.',
        [33, 34],
        '(n + 2) × 2 − ((n + 2) + 2) = n',
      ),
      s(
        'Check the recipe, forever',
        'Both ingredients are at least 2. “norm_num” simplifies the conditions; “ring” proves the algebraic identity.',
        'Moving the slider shows examples. The symbolic Lean proof covers all natural numbers.',
        [28, 34],
        '2n + 4 = n + (n + 4)',
      ),
    ],
  },
  {
    id: 1193,
    title: 'Everyone gets a partner.',
    hook: 'Count pairs without missing a single one.',
    tag: 'Unpack a definition',
    color: '#f7bc73',
    scope:
      'The Lean theorem proves conv_ind ℕ n = n + 1. The density-one consequence for g(n) = n + 1 is explained in the source comments; it is not a separate formal density theorem here.',
    steps: [
      s(
        'Open the box',
        'The definition counts pairs that add to n. It tries every first number from 0 through n.',
        '“range (n + 1)” includes zero and stops at n: that is n + 1 candidates.',
        [55, 57],
        'k = 0, 1, …, n',
      ),
      s(
        'Give each number a partner',
        'If the first number is k, its partner must be n − k. Each row below adds to the same target.',
        'There is exactly one partner for each candidate.',
        [55, 57],
        'k + (n − k) = n',
      ),
      s(
        'Remove the filter',
        'Choose A to be all natural numbers. Every first number and every partner is allowed. Nothing gets thrown out.',
        'The two membership tests are automatically true for Set.univ.',
        [61, 64],
        'k ∈ ℕ ✓ · n − k ∈ ℕ ✓',
      ),
      s(
        'Count the survivors',
        'All n + 1 rows survive. “simp” unfolds the definition and simplifies the filter and count.',
        'This supplies the exact identity used for the counterexample described in the source.',
        [61, 64],
        'conv_ind Set.univ n = n + 1',
      ),
    ],
  },
  {
    id: 231,
    title: 'The anti-copy scanner.',
    hook: 'A 15-tile word that dodges every shuffled repeat.',
    tag: 'Exhaust a search',
    color: '#c8adff',
    scope:
      'A length-15 counterexample for k = 4 refutes the proposed universal bound. This is not the stronger theorem about infinite words.',
    steps: [
      s(
        'Load the counterexample',
        'Four colors stand for the symbols 0, 1, 2, and 3. This exact 15-tile word is the witness in the Lean source.',
        'A single failing word is enough to break a claim about every word.',
        [106, 110],
        'length = 15 = 2⁴ − 1',
        1,
      ),
      s(
        'Split a window in half',
        'An “abelian square” is two neighboring equal-length chunks with the same symbol counts. Order inside each half does not matter.',
        'We compare bags of symbols, not identical strings.',
        [47, 51],
        'left half is a permutation of right half',
        1,
      ),
      s(
        'Sweep every even window',
        'Try all 56 even-length windows. The two color histograms never match. Use the slider to inspect any case.',
        'Checking only neighboring identical tiles would miss shuffled repeats.',
        [57, 60],
        '7 window sizes · 56 positions in total',
        1,
      ),
      s(
        'Turn the scan into a contradiction',
        'The helper proof checks this word has no abelian square. The main theorem plugs it into the claimed rule for k = 4, producing a contradiction.',
        'Correctness lemmas connect the Boolean scan to the mathematical definition.',
        [38, 45],
        'universal claim + counterexample → contradiction',
      ),
    ],
  },
  {
    id: 316,
    title: 'Two bins. No way.',
    hook: 'Less than two bins of stuff. Still impossible to pack.',
    tag: 'Check every split',
    color: '#f69fa9',
    scope:
      'The finite SET version, with eleven distinct denominators. The source also contains a separate multiset variant, which this walkthrough does not use.',
    steps: [
      s(
        'Load eleven fractions',
        'Each token takes up 1 divided by its number. Together they occupy less than 2 units. There are no 0 or 1 denominators.',
        'These are the assumptions of the proposed packing rule.',
        [20, 26],
        'A = {2,3,4,5,6,7,10,11,13,14,15}',
      ),
      s(
        'Try to split them',
        'Click a token to move it between bins. Both bins must stay strictly below 1. Hitting exactly 1 also fails.',
        'Small total size does not guarantee that indivisible pieces can fit.',
        [20, 22],
        'sum(left) < 1 AND sum(right) < 1',
      ),
      s(
        'Make the right bin automatic',
        'Once you choose the left bin B, the other bin is everything left over: A minus B.',
        'This converts a two-bin search into a search over just one subset.',
        [27, 30],
        'right = A ∖ B',
      ),
      s(
        'Check every possibility',
        'Eleven yes/no choices give 2,048 assignments. Every one fails. Lean uses kernel computation to close the finite check.',
        'The browser also enumerates all splits using exact integer units, with no rounding decisions.',
        [31, 31],
        '2¹¹ = 2,048 assignments · 0 valid',
      ),
    ],
  },
  {
    id: 692,
    title: 'The dip that breaks a rule.',
    hook: 'Add another divisor. The count falls… then rises.',
    tag: 'Count and compare',
    color: '#6cdbcc',
    scope:
      'The source formally defines delta1 as the exact proportion in a common period and proves periodicity. Identification with a limiting density is discussed in comments, not proved as a separate limit theorem.',
    steps: [
      s(
        'Build a divisibility filter',
        'Start with the numbers strictly between 3 and m. A tile passes only when exactly one of these numbers divides it.',
        '“Exactly one” means two matches are a failure too.',
        [58, 64],
        'm = 6 → test divisors 4 and 5',
      ),
      s(
        'Find the repeat length',
        'The filter repeats after the least common multiple of its divisors. So count one complete repeating block.',
        'Periodicity makes a finite exact count meaningful.',
        [70, 89],
        'periods: 20 → 60 → 420',
      ),
      s(
        'Count three versions',
        'For m = 6, 7, and 8, the accepted counts are 7/20, 20/60, and 152/420. Select a filter to see its entire period.',
        'The code computes the counts and simplifies the fractions.',
        [92, 109],
        '7/20 → 1/3 → 38/105',
      ),
      s(
        'Spot the forbidden valley',
        'The middle value is smaller than both neighbors. A sequence that only rises and then falls cannot have this dip.',
        'Two exact inequalities refute the proposed unimodality.',
        [128, 144],
        '1/3 < 7/20 AND 1/3 < 38/105',
      ),
    ],
  },
  {
    id: 794,
    title: 'A ticket factory loophole.',
    hook: '28 triples, but no small group holds enough.',
    tag: 'Build a counterexample',
    color: '#ecb3f1',
    scope:
      'The walkthrough checks the fixed nine-vertex construction. The upstream universal wrapper uses a fixed V_set inside has_subgraph and does not impose E ⊆ V.powerset; inspect the source for its exact formal scope.',
    steps: [
      s(
        'Make three groups',
        'Put nine labels into three groups of three. A ticket contains one label from each group.',
        'Three independent choices give 3 × 3 × 3 = 27 tickets.',
        [39, 48],
        '3 choices × 3 choices × 3 choices',
      ),
      s(
        'Add one odd ticket',
        'Add {1,2,3}, a ticket entirely from the first group. Now we have 28 distinct triples.',
        'That is one more than n³ when n = 3, crossing the proposed threshold.',
        [50, 52],
        '27 + 1 = 28 > 3³',
      ),
      s(
        'Inspect every small group',
        'Choose four or five labels. A ticket counts only if all three of its labels are selected. Sweep every selection.',
        'For four labels the target is 3 tickets; for five labels it is 7.',
        [54, 60],
        '126 groups of 4 · 126 groups of 5',
      ),
      s(
        'Nothing reaches the target',
        'Across every group, the largest counts are only 2 and 4. The source’s finite “decide” check proves both target configurations absent.',
        'This exact construction defeats the claimed small-group conclusion.',
        [58, 64],
        'max with 4 = 2 < 3 · max with 5 = 4 < 7',
      ),
    ],
  },
  {
    id: 397,
    title: 'The great cancellation.',
    hook: 'Six different inputs. Two identical giant products.',
    tag: 'Cancel factors',
    color: '#b5d3f7',
    scope:
      'An infinite family of disjoint triples of indices with equal products of central binomial coefficients. The slider illustrates instances; the injection argument proves infinitude.',
    steps: [
      s(
        'Build two teams',
        'B(t) means “choose t things from 2t things.” Pick a ≥ 2. A recipe creates three inputs on each side.',
        'The extra input c = 8a² + 8a + 1 is designed to make the factors line up.',
        [99, 106],
        '[a, 2a + 2, c] versus [a + 1, 2a, c + 1]',
      ),
      s(
        'Turn products into ratios',
        'Instead of expanding huge B-values, pair up the three ratios. Lean rewrites them as ordinary fractions.',
        'Factorials cancel inside each ratio, leaving much smaller expressions.',
        [47, 67],
        'B(a)/B(a+1) × B(2a+2)/B(2a) × B(c)/B(c+1)',
      ),
      s(
        'Cancel matching pieces',
        'Every factor above the line has a matching factor below. Their product is 1, so the original products are equal.',
        '“field_simp” clears the nonzero denominators and checks the identity.',
        [86, 90],
        'all numerator factors = all denominator factors',
      ),
      s(
        'Make infinitely many',
        'The six inputs are distinct. Different a values give different teams because the first input remembers a.',
        'An injective recipe sends infinitely many parameters to infinitely many solutions.',
        [111, 130],
        'recover a from the first entry → no repeats',
      ),
    ],
  },
  {
    id: 363,
    title: 'The square-making machine.',
    hook: 'Four blocks of numbers secretly pair up perfectly.',
    tag: 'Build an infinite family',
    color: '#e1d878',
    scope:
      'An infinite family of four disjoint intervals, each containing four consecutive natural numbers, whose combined product is a square.',
    steps: [
      s(
        'Print four blocks',
        'Choose n > 1. The recipe prints four blocks, each containing four consecutive numbers.',
        'The exact starting positions are chosen to create matching factors later.',
        [37, 50],
        'starts: 4n · 4n+4 · 4n²+7n · 8n²+14n+2',
      ),
      s(
        'Multiply the ingredients',
        'Collect all sixteen numbers into one product. The helper lemmas expand each block into algebra.',
        'Now Lean can compare one explicit expression with a square.',
        [109, 114],
        'product of all four blocks',
      ),
      s(
        'Pair every prime factor',
        'In the example, every prime appears an even number of times. Pair them: one copy for each identical half.',
        'The animation illustrates the square. Lean proves the general polynomial identity using “ring”.',
        [109, 114],
        'product = root_term(n)²',
      ),
      s(
        'Keep making new ones',
        'The blocks never overlap, and changing n changes the first block. So the construction gives infinitely many valid collections.',
        'Disjointness and injectivity check the conditions that the square identity alone would miss.',
        [180, 200],
        'valid for every n > 1 · distinct n → distinct collection',
      ),
    ],
  },
  {
    id: 645,
    title: 'Every escape route closes.',
    hook: 'Two colors cannot hide a three-number pattern forever.',
    tag: 'Follow a case split',
    color: '#ffaf88',
    scope:
      'Every two-coloring of the natural numbers has a monochromatic arithmetic triple x, x+d, x+2d with 0 < x < d. A finite colored display alone does not prove this infinite statement.',
    steps: [
      s(
        'Set the win condition',
        'We need three numbers of the same color, equally spaced, with a gap larger than the first number. Try the colors of 1, 3, and 5.',
        'The easy witness is 1,3,5: its gap is 2, which is bigger than 1.',
        [145, 151],
        'x > 0 · d > x · c(x) = c(x+d) = c(x+2d)',
      ),
      s(
        'Normalize, then branch',
        'If 1 has the other color, swap the color names everywhere. Now split on the colors of 3 and 5.',
        'Renaming colors preserves “same color.” The branches cover every possibility.',
        [148, 156],
        'all same → done · otherwise → one of two lemmas',
      ),
      s(
        'Avoiding a triple forces a chain',
        'In a hard branch, assume there is no winning triple. A later true-colored number then forces more numbers to have that color.',
        'The source proves propagation by induction. If no such later number exists, the tail is all the other color.',
        [115, 142],
        'one later seed → same-color progression; no seed → constant tail',
      ),
      s(
        'Either way, a triple appears',
        'A same-color progression contains n,3n,5n. A constant tail also contains a legal triple. Both contradict the attempt to avoid one.',
        'The main theorem combines the branches and returns x, d, and the common color.',
        [170, 174],
        'every branch returns a witness',
      ),
    ],
  },
];
export function sourceFor(id: number, file = 0) {
  return sources.find((s) => s.id === id)!.files[file];
}
export const commit = sources[0].upstreamCommit;
