import test from 'node:test';
import assert from 'node:assert/strict';
import {makeExperiment,recordedCount} from '../lib/experiment.ts';
const expected={square:[16,32],rectangle:[16,36,52],pentagon:[10,13,16,29,34,36],hexagon:[4,5,13,16,20]};
for(const [name,distances] of Object.entries(expected))test(`${name}: exact distances, convexity, and complete run`,()=>{
 const r=makeExperiment(name);
 assert.deepEqual([...r.groups].sort((a,b)=>a-b),distances);
 assert.equal(r.convex,true);
 assert.ok(r.turns.every(t=>t>0));
 assert.equal(r.pairs.length,r.points.length*(r.points.length-1)/2);
 assert.equal(new Set(r.pairs.map(p=>[p.a.label,p.b.label].sort().join(''))).size,r.pairs.length);
 assert.ok(r.groups.length>=r.target);
 let previous=0;
 for(const s of r.steps){
  const count=recordedCount(s,r.pairs.length);
  assert.ok(count===previous || count===previous+1);
  previous=count;
  if(s.kind==='group')assert.equal(count,s.pairIndex+1);
  if(s.kind==='measure')assert.equal(count,s.pairIndex);
 }
 assert.equal(previous,r.pairs.length);
 for(let i=0;i<r.pairs.length;i++)assert.deepEqual(r.steps[r.points.length+2+i*3+1],{kind:'measure',pairIndex:i});
});
