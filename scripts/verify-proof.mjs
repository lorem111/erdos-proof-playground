import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const sourcePath = new URL('lib/source/swap_and.lean', root);
const source = readFileSync(sourcePath, 'utf8');
function lean(args) {
  const result = spawnSync('lean', args, { encoding: 'utf8', cwd: root });
  if (result.error || result.status !== 0) throw new Error(result.error?.message ?? result.stdout + result.stderr);
  return result.stdout.trim();
}
const version = lean(['--version']);
lean([sourcePath.pathname]);
const directory = mkdtempSync(join(tmpdir(), 'lean-swap-and-'));
try {
  const instrumented = source.trimEnd().split('\n').flatMap((line, index) => [line, `  trace "STATE_START_${index}"`, '  trace_state', `  trace "STATE_END_${index}"`]).join('\n') + '\n#print axioms swap_and\n';
  const traceFile = join(directory, 'Trace.lean');
  writeFileSync(traceFile, instrumented);
  const output = lean([traceFile]);
  const states = [0, 1, 2, 3].map(index => {
    const match = output.match(new RegExp(`STATE_START_${index}\\n([\\s\\S]*?)STATE_END_${index}`));
    if (!match) throw new Error(`Missing trace for step ${index}`);
    const text = match[1].trim();
    const goals = [...text.matchAll(/^⊢ (.+)$/gm)].map(match => match[1]);
    return { line: index + 1, text: text || 'No goals.', goals };
  });
  const axiomFree = output.includes("'swap_and' does not depend on any axioms");
  if (!axiomFree || states.at(-1).goals.length !== 0) throw new Error('Proof is not complete or uses axioms.');
  writeFileSync(new URL('lib/source/proof-check.json', root), JSON.stringify({ version, sha256: createHash('sha256').update(source).digest('hex'), axiomFree, states }, null, 2) + '\n');
  console.log('Lean checked the proof: 1 → 2 → 1 → 0 goals. No axioms.');
} finally {
  rmSync(directory, { recursive: true, force: true });
}
