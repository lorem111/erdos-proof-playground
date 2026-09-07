import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Check, Download, ChevronDown } from 'lucide-react';
import source from '@/lib/source/swap_and.lean?raw';
import verification from '@/lib/source/proof-check.json';
import { steps } from '@/lib/code-tour';
import ProofScene from './proof-scene';
const lines = source.trimEnd().split('\n');
const downloadUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(source)}`;
export default function SwapProof({ active }: { active: boolean }) {
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = steps[cursor];
  const done = cursor === 3;
  function go(index: number) { setPlaying(false); setCursor(Math.max(0, Math.min(3, index))); }
  useEffect(() => {
    if (!active) { setPlaying(false); return; }
    if (!playing) return;
    if (done) { setPlaying(false); return; }
    const timer = setTimeout(() => setCursor(i => i + 1), 4000);
    return () => clearTimeout(timer);
  }, [cursor, playing, done, active]);
  return <div className="proof-view">
    <header><div><span className="eyebrow">A FOUR-LINE LEAN PROOF</span><h1>Same facts. Different order.</h1></div><span className="verified"><Check size={14}/> Lean checked</span></header>
    <section className="statement" aria-label="The statement being proved"><div><span className="symbol a">A</span><span className="and">and</span><span className="symbol b">B</span></div><ArrowRight size={24}/><div><span className="symbol b">B</span><span className="and">and</span><span className="symbol a">A</span></div><span className="statement-note"><code>∧</code> means <b>AND</b>.</span></section>
    <div className="workbench">
      {active && <ProofScene kind="swap" cursor={cursor} onSelect={go}/>}
      <aside><div className="source-heading"><span>swap_and.lean</span><a href={downloadUrl} download="swap_and.lean" aria-label="Download the Lean proof"><Download size={15}/></a></div><div className="code-block" aria-label="Four-line Lean source">{lines.map((line,i)=><button key={i} className={`code-line ${i===cursor?'active':''}`} onClick={()=>go(i)} aria-current={i===cursor?'step':undefined}><span>{i+1}</span><code>{line}</code></button>)}</div><div className="explanation" aria-live="polite" aria-atomic="true" key={current.id}><span className="step-label">STEP {cursor+1} OF 4</span><h2>{current.label}</h2><p>{current.explanation}</p></div><div className="controls"><button aria-label="Previous step" disabled={cursor===0} onClick={()=>go(cursor-1)}><ArrowLeft size={17}/></button><button className="play" onClick={()=>{if(done)setCursor(0);setPlaying(v=>!v);}}>{playing?<Pause size={15}/>:<Play size={15}/>} {playing?'Pause':'Play'}</button><button className="next" onClick={()=>go(done?0:cursor+1)}>{done?'Replay':'Next'}{done?<RotateCcw size={16}/>:<ArrowRight size={16}/>}</button></div></aside>
    </div>
    <nav className="steps" aria-label="Proof steps">{steps.map((s,i)=><button key={s.id} className={`${i===cursor?'active':''} ${i<cursor?'past':''}`} onClick={()=>go(i)} aria-current={i===cursor?'step':undefined}><span className="step-number">{i<cursor?<Check size={14}/>:i+1}</span><span>{s.label}<code>{s.code}</code></span><span className="goal-count">{s.goalCount} {s.goalCount===1?'goal':'goals'}</span></button>)}</nav>
    <footer><span>Checked with Lean 4.33.1 · no <code>sorry</code> · no axioms</span><details><summary>Recorded Lean state <ChevronDown size={13}/></summary><pre>{verification.states[cursor].text}</pre><p>Captured from Lean at this line. The browser replays these states.</p></details></footer>
  </div>;
}
