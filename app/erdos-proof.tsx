import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, Pause, RotateCcw, Check, Download } from 'lucide-react';
import source from '@/lib/source/Erdos728b.lean?raw';
import verification from '@/lib/source/erdos728-check.json';
import { stages, proofUrl, paperUrl } from '@/lib/erdos728-tour';
import ProofScene from './proof-scene';
export default function ErdosProof({active}:{active:boolean}){
 const [cursor,setCursor]=useState(0),[playing,setPlaying]=useState(false);
 const step=stages[cursor], done=cursor===4;
 function go(index:number){setPlaying(false);setCursor(Math.max(0,Math.min(4,index)));}
 useEffect(()=>{if(!active){setPlaying(false);return;}if(!playing)return;if(done){setPlaying(false);return;}const timer=setTimeout(()=>setCursor(i=>i+1),6000);return()=>clearTimeout(timer);},[cursor,playing,active,done]);
 return <div className="proof-view erdos-view">
  <header><div><span className="eyebrow">ERDŐS #728 · THE PROOF CITED BY YOUR PDF</span><h1>Build three numbers. Meet six conditions.</h1></div><span className={`verified ${verification.status!=='passed'?'source-status':''}`}>{verification.status==='passed'?<><Check size={14}/> Lean checked</>:'Complete proof source'}</span></header>
  <div className="erdos-intro"><code>a! b! ∣ n! (a + b − n)!</code><span><b>∣</b> means “divides with no remainder.”</span><a href={paperUrl} target="_blank" rel="noreferrer">Paper §6 <ArrowUpRight size={13}/></a></div>
  <div className="workbench erdos-workbench">
   {active && <ProofScene kind="erdos" cursor={cursor} onSelect={go}/>}
   <aside><div className="source-heading"><a href={`${proofUrl}#L${step.line}`} target="_blank" rel="noreferrer">Erdos728b.lean <ArrowUpRight size={12}/></a><a href={`data:text/plain;charset=utf-8,${encodeURIComponent(source)}`} download="Erdos728b.lean" aria-label="Download the complete Erdos 728 Lean proof"><Download size={15}/></a></div><div className="erdos-excerpts"><span>SELECTED SOURCE EXPRESSIONS</span>{step.evidence.map(({line,text},i)=><div key={`${line}-${i}`}><span>{line}</span><code>{text}</code></div>)}</div><div className="explanation" key={step.id} aria-live="polite" aria-atomic="true"><span className="step-label">PART {cursor+1} OF 5</span><h2>{step.label}</h2><p>{step.explanation}</p></div><div className="controls"><button aria-label="Previous Erdos proof part" disabled={cursor===0} onClick={()=>go(cursor-1)}><ArrowLeft size={17}/></button><button className="play" onClick={()=>{if(done)setCursor(0);setPlaying(p=>!p);}}>{playing?<Pause size={15}/>:<Play size={15}/>} {playing?'Pause':'Play'}</button><button className="next" onClick={()=>go(done?0:cursor+1)}>{done?'Replay':'Next'}{done?<RotateCcw size={16}/>:<ArrowRight size={16}/>}</button></div></aside>
  </div>
  <nav className="steps erdos-steps" aria-label="Erdos 728 proof parts">{stages.map((stage,i)=><button key={stage.id} className={`${cursor===i?'active':''} ${cursor>i?'past':''}`} onClick={()=>go(i)} aria-current={cursor===i?'step':undefined}><span className="step-number">{cursor>i?<Check size={14}/>:i+1}</span><span>{stage.short}<code>line {stage.line}</code></span></button>)}</nav>
  <footer><span>Five grouped steps of <code>erdos_728_fc</code> · earlier lemmas collapsed · no live execution</span><details><summary>Source & verification</summary><p>This is the 1,422-line proof cited in §6 of arXiv:2601.07421v5. The separate theorem <code>erdos_728</code> proves an infinite-family formulation with a logarithmic lower bound. This tab follows the two-sided-window existence theorem <code>erdos_728_fc</code>.</p><p>{verification.status==='passed'?'Locally checked with Lean 4.24.0 and the pinned Mathlib version. Both theorems depend only on propext, Classical.choice and Quot.sound; neither uses sorryAx.':'The source contains no sorry or admit. Local compiler verification is pending; the diagrams summarize source code, not captured goal states.'}</p></details></footer>
 </div>;
}
