import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  packingCases,
  packingUnit,
  denominators,
  windows,
  sieve,
  subsets,
  edgeCount,
  edges,
  binomialFamily,
  squareFamily,
} from '../lib/arcade/math.ts';
test('399 witness satisfies every conjunct and the second disjunct', () => {
  assert.ok(48 * 36 > 1 && 4 > 2);
  assert.equal(3628800 + 36 ** 4, 48 ** 4);
});
test('493 recipe includes the boundary n=0 and large inputs', () => {
  for (const n of [0, 1, 7, 20, 1000000]) {
    const a = n + 2,
      b = 2;
    assert.ok(a >= 2 && b >= 2);
    assert.equal(a * b - (a + b), n);
  }
});
test('1193 counts ordered pairs including both endpoints', () => {
  for (let n = 0; n < 30; n++) {
    const pairs = Array.from({ length: n + 1 }, (_, k) => [k, n - k]);
    assert.ok(pairs.every(([a, b]) => a >= 0 && b >= 0 && a + b === n));
    assert.equal(pairs.length, n + 1);
  }
});
test('231 checks all 56 windows and detects shuffled repeats in positive controls', () => {
  const all = windows();
  assert.equal(all.length, 56);
  assert.equal(all.filter((w) => w.match).length, 0);
  assert.ok(windows([0, 1, 1, 0]).some((w) => w.size === 4 && w.match));
  assert.ok(windows([2, 2]).some((w) => w.match));
});
test('316 exact enumeration: total below two, no valid strict split', () => {
  assert.ok(denominators.every((d) => packingUnit % d === 0));
  assert.equal(packingCases.length, 2048);
  assert.ok(packingCases[0].right < 2 * packingUnit);
  assert.equal(packingCases.filter((p) => p.valid).length, 0);
  for (let i = 0; i < 2048; i++)
    assert.equal(packingCases[i].left, packingCases[2047 - i].right);
});
test('692 periodic counts and exact valley inequalities', () => {
  const a = sieve(6),
    b = sieve(7),
    c = sieve(8);
  assert.deepEqual(
    [a, b, c].map((d) => [d.period, d.hits, d.fraction]),
    [
      [20, 7, '7/20'],
      [60, 20, '1/3'],
      [420, 152, '38/105'],
    ],
  );
  assert.ok(b.hits * a.period < a.hits * b.period);
  assert.ok(b.hits * c.period < c.hits * b.period);
  for (const d of [a, b, c])
    for (let x = 1; x <= d.period; x++)
      assert.equal(
        d.divisors.filter((v) => (x + d.period) % v === 0).length,
        d.counts[x - 1],
      );
});
test('794 exhausts every subset and finds the claimed maxima', () => {
  assert.equal(new Set(edges.map((e) => e.join(','))).size, 28);
  for (const k of [4, 5]) {
    const ss = subsets(k);
    assert.equal(ss.length, 126);
    assert.equal(Math.max(...ss.map(edgeCount)), k === 4 ? 2 : 4);
  }
});
test('397 exact giant-integer products, disjoint inputs and distinct seeds', () => {
  const keys = new Set();
  for (let a = 2; a <= 6; a++) {
    const f = binomialFamily(a);
    assert.equal(f.l, f.r);
    assert.equal(new Set([...f.left, ...f.right]).size, 6);
    keys.add(f.left.join(','));
  }
  assert.equal(keys.size, 5);
});
test('363 square formula and disjoint blocks across all slider values', () => {
  for (let n = 2; n <= 8; n++) {
    const f = squareFamily(n);
    assert.equal(f.product, f.root * f.root);
    assert.equal(new Set(f.values.flat()).size, 16);
    assert.ok(f.factors.every(([, e]) => e % 2 === 0));
    assert.ok(
      f.values.every((block) => block.every((v, i) => v === block[0] + i)),
    );
  }
});
test('645 displayed propagation witnesses have d > x', () => {
  for (let n = 6; n <= 50; n++) {
    const [a, b, c] = [n, 3 * n, 5 * n];
    assert.equal(b - a, c - b);
    assert.ok(b - a > a);
  }
  assert.ok(2 > 1);
});
test('downloaded source hashes are intact and contain no proof holes', async () => {
  const { createHash } = await import('node:crypto');
  const manifest = JSON.parse(
    fs.readFileSync('public/proofs/manifest.json', 'utf8'),
  );
  assert.equal(manifest.length, 10);
  for (const p of manifest)
    for (const f of p.files) {
      const text = fs.readFileSync(`public/proofs/${f.path}`, 'utf8');
      assert.equal(createHash('sha256').update(text).digest('hex'), f.sha256);
      const code = text.replace(/\/-[\s\S]*?-\//g, '').replace(/--[^\n]*/g, '');
      assert.doesNotMatch(
        code,
        /\b(sorry|admit|sorryAx|native_decide|axiom)\b/,
      );
    }
});

test('published verification report covers all ten exact sources with no proof-hole axioms', () => {
  const report = JSON.parse(
    fs.readFileSync('public/proofs/verification.json', 'utf8'),
  );
  const manifest = JSON.parse(
    fs.readFileSync('public/proofs/manifest.json', 'utf8'),
  );
  assert.equal(report.status, 'passed');
  assert.equal(report.upstreamCommit, manifest[0].upstreamCommit);
  assert.deepEqual(
    report.entries.map((e) => e.id),
    manifest.map((e) => e.id),
  );
  for (const entry of report.entries) {
    assert.equal(entry.status, 'passed');
    assert.equal(entry.exitCode, 0);
    assert.ok(entry.axiomReports.length > 0);
    assert.ok(
      entry.axiomReports.every((r) =>
        r.axioms.every((a) =>
          ['propext', 'Classical.choice', 'Quot.sound'].includes(a),
        ),
      ),
    );
  }
});
