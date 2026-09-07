import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { steps, stepForLine } from '../lib/code-tour.ts';
const source=readFileSync(new URL('../lib/source/swap_and.lean',import.meta.url),'utf8');
const checked=JSON.parse(readFileSync(new URL('../lib/source/proof-check.json',import.meta.url),'utf8'));

test('displayed proof is exactly the source checked by Lean',()=>{
 assert.equal(createHash('sha256').update(source).digest('hex'),checked.sha256);
 assert.equal(checked.axiomFree,true);
 assert.equal(source.trimEnd().split('\n').length,4);
 assert.ok(!source.includes('sorry'));
});

test('four displayed steps match their actual source lines',()=>{
 assert.equal(steps.length,4);
 for(const [index,step] of steps.entries()){
  assert.equal(stepForLine(step.line),index);
  assert.ok(source.split('\n')[step.line-1].includes(step.code));
  assert.equal(checked.states[index].line,step.line);
 }
 assert.equal(stepForLine(5),null);
});

test('visual goal counts match the captured Lean states',()=>{
 assert.deepEqual(checked.states.map(s=>s.goals),[['B ∧ A'],['B','A'],['A'],[]]);
 assert.deepEqual(steps.map(s=>s.goalCount),checked.states.map(s=>s.goals.length));
 assert.deepEqual(steps.map(s=>s.solved),[[],[],['B'],['B','A']]);
 assert.equal(checked.states[3].text,'No goals.');
});

test('known facts fill the correct slots, in proof order',()=>{
 assert.equal(steps[2].code,'exact h.right');
 assert.deepEqual(steps[2].solved,['B']);
 assert.equal(steps[3].code,'exact h.left');
 assert.deepEqual(steps[3].solved,['B','A']);
 assert.equal(steps[3].goalCount,0);
});
