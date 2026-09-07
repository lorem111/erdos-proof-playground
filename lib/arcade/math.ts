// Independent, exact arithmetic behind the browser examples. This is not Lean execution.
export const denominators = [2, 3, 4, 5, 6, 7, 10, 11, 13, 14, 15];
export const packingUnit = 60060;
export function packing(mask: number) {
  let left = 0,
    right = 0;
  denominators.forEach((d, i) => {
    if (mask & (1 << i)) left += packingUnit / d;
    else right += packingUnit / d;
  });
  return { left, right, valid: left < packingUnit && right < packingUnit };
}
export const packingCases = Array.from({ length: 2048 }, (_, mask) =>
  packing(mask),
);
export const word = [0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 1, 0, 1];
export function windows(input = word) {
  const out: {
    start: number;
    size: number;
    a: number[];
    b: number[];
    match: boolean;
  }[] = [];
  for (let size = 2; size <= input.length; size += 2)
    for (let start = 0; start + size <= input.length; start++) {
      const a = [0, 0, 0, 0],
        b = [0, 0, 0, 0];
      input.slice(start, start + size / 2).forEach((c) => a[c]++);
      input.slice(start + size / 2, start + size).forEach((c) => b[c]++);
      out.push({ start, size, a, b, match: a.every((v, i) => v === b[i]) });
    }
  return out;
}
export function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}
export function sieve(m: number) {
  const divisors = Array.from({ length: m - 4 }, (_, i) => i + 4);
  const period = divisors.reduce((a, b) => (a * b) / gcd(a, b), 1);
  const counts = Array.from(
    { length: period },
    (_, i) => divisors.filter((d) => (i + 1) % d === 0).length,
  );
  const hits = counts.filter((c) => c === 1).length;
  return {
    divisors,
    period,
    counts,
    hits,
    fraction: `${hits / gcd(hits, period)}/${period / gcd(hits, period)}`,
  };
}
export const edges: number[][] = [];
for (let a = 1; a <= 3; a++)
  for (let b = 4; b <= 6; b++)
    for (let c = 7; c <= 9; c++) edges.push([a, b, c]);
edges.push([1, 2, 3]);
export function subsets(k: number) {
  return Array.from({ length: 512 }, (_, mask) =>
    Array.from({ length: 9 }, (_, i) => i + 1).filter(
      (v) => mask & (1 << (v - 1)),
    ),
  ).filter((s) => s.length === k);
}
export function edgeCount(s: number[]) {
  return edges.filter((e) => e.every((v) => s.includes(v))).length;
}
export function binomial(n: number, k: number) {
  let v = BigInt(1);
  for (let i = 1; i <= k; i++) v = (v * BigInt(n - i + 1)) / BigInt(i);
  return v;
}
export function binomialFamily(a: number) {
  const c = 8 * a * a + 8 * a + 1;
  const left = [a, 2 * a + 2, c],
    right = [a + 1, 2 * a, c + 1];
  return {
    left,
    right,
    l: left.reduce((v, n) => v * binomial(2 * n, n), BigInt(1)),
    r: right.reduce((v, n) => v * binomial(2 * n, n), BigInt(1)),
  };
}
export function blocks(n: number) {
  return [4 * n, 4 * n + 4, 4 * n * n + 7 * n, 8 * n * n + 14 * n + 2].map(
    (x) => Array.from({ length: 4 }, (_, i) => x + i),
  );
}
export function factors(numbers: number[]) {
  const out = new Map<number, number>();
  for (let x of numbers) {
    for (let p = 2; p * p <= x; p++)
      while (x % p === 0) {
        out.set(p, (out.get(p) || 0) + 1);
        x /= p;
      }
    if (x > 1) out.set(x, (out.get(x) || 0) + 1);
  }
  return [...out].sort((a, b) => a[0] - b[0]);
}
export function squareFamily(n: number) {
  const values = blocks(n);
  const product = values.flat().reduce((a, b) => a * BigInt(b), BigInt(1));
  const root = [
    16,
    n,
    n + 1,
    2 * n + 1,
    2 * n + 3,
    4 * n + 1,
    4 * n + 3,
    4 * n + 5,
    4 * n + 7,
    4 * n * n + 7 * n + 1,
    4 * n * n + 7 * n + 2,
  ].reduce((a, b) => a * BigInt(b), BigInt(1));
  return { values, product, root, factors: factors(values.flat()) };
}
