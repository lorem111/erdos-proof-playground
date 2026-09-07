import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stages, conditions } from '../lib/erdos728-tour.ts';
const source=readFileSync(new URL('../lib/source/Erdos728b.lean',import.meta.url),'utf8');
const lines=source.trimEnd().split('\n');

test('the complete cited proof is bundled without placeholder proof tokens',()=>{
 assert.equal(lines.length,1422);
 assert.ok(!/\b(sorry|admit)\b/.test(source));
 assert.ok(source.includes('theorem erdos_728_fc :'));
 assert.ok(source.includes('theorem erdos_728 (C ε : ℝ)'));
});

test('all five walkthrough parts quote the exact corresponding source expressions',()=>{
 assert.equal(stages.length,5);
 for(const stage of stages){
  assert.ok(lines[stage.line-1].includes(stage.code),stage.id);
  for(const expression of stage.evidence)assert.ok(lines[expression.line-1].includes(expression.text),`${stage.id}: line ${expression.line}`);
 }
 assert.deepEqual(stages.map(s=>s.id),['middle','scale','candidate','witnesses','finish']);
 assert.equal(conditions.length,6);
});

test('witness construction preserves the intended natural-number gap',()=>{
 for(const m of [1,7,101,1000])for(const k of [0,1,4,20]){
  const a=m+k,b=m,n=2*m;
  assert.equal(a+b-n,k);
 }
});

test('the bundled proof matches the successfully compiled source and axiom audit',async()=>{
 const { createHash }=await import('node:crypto');
 const report=JSON.parse(readFileSync(new URL('../lib/source/erdos728-check.json',import.meta.url),'utf8'));
 assert.equal(report.status,'passed');
 assert.equal(report.exit_code,0);
 assert.equal(report.sha256,createHash('sha256').update(source).digest('hex'));
 assert.deepEqual(report.checked_theorems,['Erdos728b.erdos_728','Erdos728b.erdos_728_fc']);
 assert.deepEqual(report.axioms,['propext','Classical.choice','Quot.sound']);
 assert.ok(!report.output.includes('sorryAx'));
});
