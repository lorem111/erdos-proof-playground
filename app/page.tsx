'use client';
import { useEffect, useMemo, useState } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight, ArrowUpRight, Check, MoveUpRight } from 'lucide-react';
import { flushSync } from 'react-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { examples, makeExperiment, lengthLabel, recordedCount } from '@/lib/experiment';
const colors = ['#1668d4','#d64e27','#8153c8','#087f70','#ac7010','#bd3f7a','#386578','#556723','#79452e','#5e56ae'];
const phaseNames = ['Meet the dots','Check the shape','Set the target','Measure every pair','See the result'];
export default function Home() {
  const [exampleId,setExampleId]=useState('square');
  const [cursor,setCursor]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [speed,setSpeed]=useState(2200);
  const run=useMemo(()=>makeExperiment(exampleId),[exampleId]);
  const step=run.steps[cursor];
  const pair=step.pairIndex===undefined?undefined:run.pairs[step.pairIndex];
  const seen=run.pairs.slice(0,recordedCount(step,run.pairs.length));
  const discovered=run.groups.filter(s=>seen.some(p=>p.squared===s));
  const phase=step.kind==='setup'?0:step.kind==='convex'?1:step.kind==='target'?2:step.kind==='finish'?4:3;
  const finished=step.kind==='finish';
  function go(index:number) {setPlaying(false);setCursor(Math.max(0,Math.min(run.steps.length-1,index)));}
  function choose(id:string) {setPlaying(false);setCursor(0);setExampleId(id);}
  useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setCursor(c=>Math.min(c+1,run.steps.length-1)),speed);return()=>clearInterval(timer);},[playing,speed,run.steps.length]);
  useEffect(()=>{if(finished)setPlaying(false);},[finished]);
  useEffect(()=>{
    type Tool = { name:string; description:string; inputSchema:object; annotations:object; execute:(input:unknown)=>unknown };
    const context=(document as Document & {modelContext?:{registerTool:(tool:Tool,options:{signal:AbortSignal})=>void|Promise<void>}}).modelContext;
    if(!context?.registerTool)return;
    const lifecycle=new AbortController();
    try { void Promise.resolve(context.registerTool({
      name:'navigate_distance_run',
      description:'Choose one of the four polygon examples and navigate to a numbered step. Pauses playback and updates the visible graph and explanation. Steps are numbered starting at 1.',
      inputSchema:{type:'object',properties:{shape:{type:'string',enum:examples.map(e=>e.id)},step:{type:'integer',minimum:1}},required:['shape','step'],additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute(input:unknown){
        const value=input as {shape?:unknown;step?:unknown};
        if(!value || typeof value.shape!=='string' || !examples.some(e=>e.id===value.shape) || typeof value.step!=='number' || !Number.isInteger(value.step))throw new Error('Provide a supported shape and an integer step.');
        const experiment=makeExperiment(value.shape);
        if(value.step<1 || value.step>experiment.steps.length)throw new Error(`Step must be from 1 to ${experiment.steps.length}.`);
        const index=value.step-1;
        flushSync(()=>{setPlaying(false);setExampleId(value.shape as string);setCursor(index);});
        return {shape:value.shape,step:value.step,totalSteps:experiment.steps.length,stage:experiment.steps[index].kind,pairsChecked:recordedCount(experiment.steps[index],experiment.pairs.length)};
      },
    },{signal:lifecycle.signal})).catch(()=>{}); } catch { /* Optional browser capability. */ }
    return()=>lifecycle.abort();
  },[]);
  const v=step.vertex??0, prev=run.points[(v+run.points.length-1)%run.points.length], vertex=run.points[v], next=run.points[(v+1)%run.points.length];
  const prior=pair ? seen.filter(p=>p!==pair&&p.squared===pair.squared):[];
  const isNew=prior.length===0;
  const title=step.kind==='setup'?'Same length? Count it once.':step.kind==='convex'?`Take the turn at ${vertex.label}.`:step.kind==='target'?'How many lengths do we need?':step.kind==='pick'?`Meet pair ${pair!.a.label}${pair!.b.label}.`:step.kind==='measure'?'Take the shortcut across.':step.kind==='group'?(isNew?'A new length joins the collection.':'Same length. Same bucket.'): 'Every pair checked. Here’s the count.';
  const explanation=step.kind==='setup'?`Imagine a rubber band around these ${run.points.length} dots. We’ll measure the straight line between every pair. Different pairs can have the same length, so we only count each length once.`:step.kind==='convex'?`Walk from ${prev.label} to ${vertex.label} to ${next.label}. You turn left here. Every corner in this shape turns the same way, so there are no dents. That’s what “convex” means.`:step.kind==='target'?`The rule says a convex polygon with ${run.points.length} dots has at least half that many different distances, rounded down. “At least” means this number or more is okay.`:step.kind==='pick'?`Let’s connect ${pair!.a.label} and ${pair!.b.label}. We check this pair once. Going from ${pair!.b.label} back to ${pair!.a.label} has the same length, so it doesn’t get another turn.`:step.kind==='measure'?`The dashed path moves ${Math.abs(pair!.dx)} units sideways and ${Math.abs(pair!.dy)} units vertically. The straight line is the shortcut. Pythagoras tells us its squared length: sideways² + vertical².`:step.kind==='group'?(isNew?`We haven’t seen squared length ${pair!.squared} before. So we make a new bucket for length ${lengthLabel(pair!.squared)}. Our collection grows by one. Easy!`:`We already found this length with ${prior[0].a.label}${prior[0].b.label}. Put ${pair!.a.label}${pair!.b.label} in the same bucket. One more pair, but no new distance.`):`We checked all ${run.pairs.length} pairs and found ${run.groups.length} different lengths. The target was ${run.target}. This ${run.example.name.toLowerCase()} meets the rule!`;
  const why=step.kind==='setup'?'We’re counting different lengths, not lines. Four equal sides still contribute just one length.':step.kind==='convex'?'The rule applies to convex shapes. Checking this condition first makes sure we’re asking the right question.':step.kind==='target'?'A target gives us something precise to compare with at the end. More lengths than the target is still a success.':step.kind==='pick'?'A tidy pair order means we won’t miss a connection or count the same pair twice.':step.kind==='measure'?'Keeping squared lengths lets us compare exact whole numbers. Square roots can be messy decimals; we don’t need to round them to compare.':step.kind==='group'?'Grouping equal lengths is the key move: we count buckets, not how many pairs are inside each bucket.':'This run checks one example. A proof must cover every convex polygon, including ones we haven’t drawn. Altman proved that general result; this animation does not run a Lean proof.';
  const sx=(x:number)=>340+x*63, sy=(y:number)=>267-y*63;
  const stageStarts=[0,1,run.points.length+1,run.points.length+2,run.steps.length-1];
  return <main>
    <header className="topbar"><a href="#" className="brand"><span className="brand-mark">∴</span> little math lab<span className="brand-divider">/</span><span className="muted">Erdős explorations</span></a><a className="source-link" href="https://www.erdosproblems.com/93" target="_blank" rel="noreferrer">Problem #93 <ArrowUpRight size={16}/></a></header>
    <section className="intro"><div><p className="eyebrow">GEOMETRY · A GUIDED EXPERIMENT</p><h1>A few dots. How many distances?</h1><p className="intro-copy">Connect the dots. Collect the lengths. Follow the math, one small step at a time.</p></div><span className="status"><span/> Solved problem · explorable example</span></section>
    <div className="workspace">
      <section className="drawing-panel" aria-label="Interactive distance experiment">
        <div className="canvas-toolbar"><div><span className="eyebrow">YOUR SHAPE</span><RadioGroup className="shape-buttons" aria-label="Choose a shape" value={exampleId} onValueChange={value=>choose(String(value))}>{examples.map(e=><label key={e.id}><RadioGroupItem value={e.id} aria-label={e.name}/><span>{e.name}</span></label>)}</RadioGroup></div><span className="point-count">{run.points.length} dots<br/><b>{run.pairs.length} pairs</b></span></div>
        <div className="graph-wrap"><div className="graph-caption">{run.example.note}</div>
        <svg className="graph" viewBox="0 0 680 535" role="img" aria-label={`${run.example.name} with labeled coordinates. ${pair?`Pair ${pair.a.label}${pair.b.label} is highlighted.`:step.kind==='convex'?`Checking the turn at ${vertex.label}.`:'All vertices are shown.'}`}>
          <defs><pattern id="grid" width="63" height="63" x="25" y="15" patternUnits="userSpaceOnUse"><path d="M63 0H0V63" fill="none" stroke="#dee7ee" strokeWidth="1"/></pattern></defs>
          <rect width="680" height="535" fill="url(#grid)"/>
          <line x1="25" x2="655" y1="267" y2="267" stroke="#c5d3e0"/><line x1="340" x2="340" y1="15" y2="519" stroke="#c5d3e0"/>
          <text x="650" y="290" className="axis-label">x</text><text x="352" y="28" className="axis-label">y</text><text x="348" y="286" className="axis-label">0</text>
          <polygon points={run.points.map(p=>`${sx(p.x)},${sy(p.y)}`).join(' ')} fill="#1668d409" stroke="#a5b7c9" strokeWidth="2" strokeLinejoin="round"/>
          {(finished?run.pairs:seen).map(p=><line key={p.a.label+p.b.label} x1={sx(p.a.x)} y1={sy(p.a.y)} x2={sx(p.b.x)} y2={sy(p.b.y)} stroke={colors[p.group%colors.length]} strokeWidth="2.5" opacity={finished?.65:.24}/>)}
          {step.kind==='convex'&&<polyline points={[prev,vertex,next].map(p=>`${sx(p.x)},${sy(p.y)}`).join(' ')} fill="none" stroke="#087f70" strokeWidth="5" strokeLinejoin="round"/>}
          {pair&&<><line x1={sx(pair.a.x)} y1={sy(pair.a.y)} x2={sx(pair.b.x)} y2={sy(pair.b.y)} stroke={colors[pair.group%colors.length]} strokeWidth="5" strokeLinecap="round"/>
            {step.kind==='measure'&&<><path d={`M ${sx(pair.a.x)} ${sy(pair.a.y)} H ${sx(pair.b.x)} V ${sy(pair.b.y)}`} fill="none" stroke="#5d718b" strokeWidth="2" strokeDasharray="6 6"/><text x={(sx(pair.a.x)+sx(pair.b.x))/2} y={sy(pair.a.y)+25} className="delta-label">sideways: {Math.abs(pair.dx)}</text><text x={sx(pair.b.x)+12} y={(sy(pair.a.y)+sy(pair.b.y))/2-13} className="delta-label">up/down: {Math.abs(pair.dy)}</text></>}
          </>}
          {run.points.map(p=><g key={p.label}><circle cx={sx(p.x)} cy={sy(p.y)} r="13" fill="white" stroke={step.kind==='convex'&&p===vertex?'#087f70':'#163554'} strokeWidth="3"/><circle cx={sx(p.x)} cy={sy(p.y)} r="4" fill="#163554"/><text x={sx(p.x)+(p.x<0?-20:20)} y={sy(p.y)+(p.y<=0?32:-23)} textAnchor={p.x<0?'end':'start'} className="point-label">{p.label} <tspan className="coord">({p.x}, {p.y})</tspan></text></g>)}
        </svg>
        <div className="graph-legend"><span><i style={{background:pair?colors[pair.group%colors.length]:'#1668d4'}}/> {pair?`Measuring ${pair.a.label}${pair.b.label}`:finished?'Matching colors = matching lengths':'One grid square = 1 unit'}</span><span>2D plane</span></div></div>
        <div className="transport"><div className="play-controls"><button className="icon-button" aria-label="Restart run" onClick={()=>go(0)}><RotateCcw size={18}/></button><button className="icon-button" aria-label="Previous step" disabled={cursor===0} onClick={()=>go(cursor-1)}><ArrowLeft size={18}/></button><button className="play-button" onClick={()=>{if(finished)setCursor(0);setPlaying(!playing);}}>{playing?<Pause size={17}/>:<Play size={17}/>} {playing?'Pause':finished?'Replay':'Play run'}</button><button className="icon-button" aria-label="Next step" disabled={finished} onClick={()=>go(cursor+1)}><ArrowRight size={18}/></button></div><button className="speed" aria-label={`Playback speed ${speed===2200?'normal':'slow'}. Click to change.`} onClick={()=>setSpeed(speed===2200?4200:2200)}>{speed===2200?'1×':'0.5×'} speed</button></div>
        <div className="scrubber"><Slider aria-label="Run step" min={0} max={run.steps.length-1} step={1} value={[cursor]} onValueChange={value=>go(Array.isArray(value)?value[0]:value)}/><span>{cursor+1} / {run.steps.length}</span></div>
      </section>
      <aside className="explanation-panel"><div className="step-heading"><span className="eyebrow">THE PLAY-BY-PLAY</span><span className="step-tag">Step {String(cursor+1).padStart(2,'0')}</span></div>
        <nav className="phases" aria-label="Experiment stages">{phaseNames.map((name,i)=><button key={name} onClick={()=>go(stageStarts[i])} className={phase===i?'active':phase>i?'complete':''} aria-label={name} aria-current={phase===i?'step':undefined}><span>{phase>i?<Check size={12}/>:i+1}</span></button>)}</nav><p className="phase-label">{phaseNames[phase]}{pair?` · pair ${step.pairIndex!+1} of ${run.pairs.length}`:''}</p>
        <div className="step-content" key={`${exampleId}-${cursor}`} aria-live="polite" aria-atomic="true"><h2>{title}</h2><p>{explanation}</p>
        <div className="math-card"><span className="eyebrow">{step.kind==='convex'?'THE TURN CHECK':step.kind==='measure'?'THE ACTUAL CALCULATION':step.kind==='group'?'THE COLLECTION':finished?'THE COMPARISON':'THE RULE IN NUMBERS'}</span><div className="equation">{step.kind==='convex'?<>{run.turns[v]} &gt; 0 <span>↶ left turn</span></>:step.kind==='measure'?<>({pair!.dx})² + ({pair!.dy})² = <strong>{pair!.squared}</strong></>:step.kind==='group'?<>length {lengthLabel(pair!.squared)} <span>→</span> bucket {pair!.group+1}</>:finished?<><strong>{run.groups.length}</strong> ≥ {run.target} <Check size={26}/></>:<>⌊ {run.points.length} ÷ 2 ⌋ = <strong>{run.target}</strong></>}</div>
        <p>{step.kind==='convex'?`Turn score = (${vertex.x-prev.x}) × (${next.y-vertex.y}) − (${vertex.y-prev.y}) × (${next.x-vertex.x}). Positive means left. These presets follow the boundary without crossing.`:step.kind==='measure'?`Distance = ${lengthLabel(pair!.squared)}${Number.isInteger(Math.sqrt(pair!.squared))?'':` ≈ ${Math.sqrt(pair!.squared).toFixed(3)}`} units. “Squared” just means a number times itself.`:step.kind==='group'?`${seen.length} pairs checked · ${discovered.length} different lengths so far`:finished?'Different lengths found ≥ minimum required.':'Those floor brackets ⌊ ⌋ mean “round down to a whole number.”'}</p></div>
        <div className="why"><span><MoveUpRight size={16}/> WHY THIS MATTERS</span><p>{why}</p></div></div>
        <button className="next-button" onClick={()=>go(finished?0:cursor+1)}>{finished?'Try the run again':'Okay, next step'}<ArrowRight size={18}/></button>
      </aside>
    </div>
    <section className="collection"><div className="collection-heading"><div><p className="eyebrow">THE DISTANCE COLLECTION</p><h2>{discovered.length} different {discovered.length===1?'length':'lengths'} <span>from {seen.length} checked pairs</span></h2></div><span className="target-chip">Target: at least {run.target}</span></div>
      <div className="buckets">{discovered.length===0?<p className="empty-collection">Your collection starts empty. Play the run to discover the first length.</p>:discovered.map(s=>{const group=run.groups.indexOf(s);const members=seen.filter(p=>p.squared===s);return <div className="bucket" key={s} style={{borderTopColor:colors[group%colors.length]}}><span className="bucket-label">BUCKET {group+1}</span><strong style={{color:colors[group%colors.length]}}>{lengthLabel(s)} <small>units</small></strong><div className="pair-chips">{members.map(p=><button key={p.a.label+p.b.label} onClick={()=>go(run.points.length+2+run.pairs.indexOf(p)*3+1)} title={`Revisit the calculation for ${p.a.label}${p.b.label}`}>{p.a.label}{p.b.label}</button>)}</div></div>})}</div>
    </section>
    <footer><p><b>A small experiment with a big idea.</b> This is an exact check of the selected integer-coordinate example, not a general proof or a Lean execution trace.</p><div><a href="https://www.erdosproblems.com/93" target="_blank" rel="noreferrer">Read problem #93 <ArrowUpRight size={14}/></a><a href="https://github.com/google-deepmind/formal-conjectures/blob/main/FormalConjectures/ErdosProblems/93.lean" target="_blank" rel="noreferrer">See the Lean statement <ArrowUpRight size={14}/></a></div><details><summary>How this connects to the repository</summary><p>The statement <code>Erdos93.erdos_93</code> says <code>A.card / 2 ≤ distinctDistances A</code>, assuming the dots are in convex position. Here, <code>A.card</code> is the number of dots and <code>distinctDistances</code> is our bucket count. The cloned file contains a <code>sorry</code> placeholder and links to a separate formal proof. This playground computes examples in JavaScript; it does not fill in that proof.</p></details></footer>
  </main>;
}
