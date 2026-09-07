import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Check,
  Code2,
  Play,
  Pause,
  RotateCcw,
  VolumeX,
  Maximize2,
  X,
  CodeXml,
  BookOpen,
  Download,
  Link as LinkIcon,
} from 'lucide-react';
import { proofs, sourceFor, commit } from '../lib/arcade/content';
import Scene from './arcade-scenes';
import './arcade.css';
const repo = 'https://github.com/lorem111/erdos-proof-playground';
function hashState() {
  const m = location.hash.match(/^#(\d+)(?:\/(\d+))?$/);
  const i = proofs.findIndex((p) => p.id === Number(m?.[1]));
  return {
    index: i < 0 ? 0 : i,
    step: Math.max(0, Math.min(3, Number(m?.[2] || 1) - 1)),
  };
}
export default function Home() {
  const initial = hashState();
  const [index, setIndex] = useState(initial.index),
    [step, setStep] = useState(initial.step),
    [playing, setPlaying] = useState(false),
    [progress, setProgress] = useState(0),
    [speed, setSpeed] = useState(1),
    [present, setPresent] = useState(false),
    [sourceOpen, setSourceOpen] = useState(false),
    [copied, setCopied] = useState(false),
    [reduced, setReduced] = useState(
      () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    ),
    [visited, setVisited] = useState<number[]>(() => {
      try {
        const saved: unknown = JSON.parse(
          localStorage.getItem('erdos-seen') || '[]',
        );
        return Array.isArray(saved)
          ? [
              ...new Set(
                saved.filter(
                  (v): v is number =>
                    typeof v === 'number' && proofs.some((p) => p.id === v),
                ),
              ),
            ]
          : [];
      } catch {
        return [];
      }
    });
  const player = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const proof = proofs[index],
    current = proof.steps[step],
    file = sourceFor(proof.id, current.file);
  const lines = file.text.split('\n');
  if (step === 3 && !visited.includes(proof.id))
    setVisited([...visited, proof.id]);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  useEffect(() => {
    try {
      localStorage.setItem('erdos-seen', JSON.stringify(visited));
    } catch {}
  }, [visited]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const read = () => {
      const h = hashState();
      setIndex(h.index);
      setStep(h.step);
      setProgress(0);
      setPlaying(false);
    };
    addEventListener('hashchange', read);
    return () => removeEventListener('hashchange', read);
  }, []);
  useEffect(() => {
    history.replaceState(null, '', `#${proof.id}/${step + 1}`);
    document.title = `#${proof.id} · ${proof.title} | Small Proofs`;
  }, [proof.id, proof.title, step]);
  useEffect(() => {
    if (!playing) return;
    let frame: number,
      last = performance.now();
    let elapsed = progressRef.current;
    const tick = (now: number) => {
      elapsed += ((now - last) / 8000) * speed;
      last = now;
      if (elapsed >= 1) {
        if (step === 3) {
          setPlaying(false);
          setProgress(1);
        } else {
          setStep((s) => s + 1);
          setProgress(0);
        }
        return;
      }
      setProgress(elapsed);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, step, speed]);
  const go = (n: number) => {
    setStep(Math.max(0, Math.min(3, n)));
    setProgress(0);
    setPlaying(false);
  };
  const select = (i: number) => {
    setIndex(i);
    setStep(0);
    setProgress(0);
    setPlaying(false);
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPresent(false);
        return;
      }
      if ((e.target as HTMLElement).closest('input,select')) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(step + 1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(step - 1);
      }
      if (
        e.code === 'Space' &&
        !(e.target as HTMLElement).closest('button,summary,a')
      ) {
        e.preventDefault();
        if (progress === 1) {
          setStep(0);
          setProgress(0);
        }
        setPlaying((v) => !v);
      }
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [step, progress]);
  async function share() {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div
      className={`arcade ${present ? 'presenting' : ''} ${reduced ? 'reduced' : ''}`}
      style={{ '--accent': proof.color } as CSSProperties}
    >
      <header className="site-header">
        <a href="#399/1" className="wordmark">
          <span className="brand-icon">∴</span> small proofs
          <span className="brand-dot">.</span>
        </a>
        <nav>
          <a
            href="#collection"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById('collection')
                ?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
            }}
          >
            The collection
          </a>
          <a href={repo} target="_blank" rel="noreferrer">
            <CodeXml size={16} /> GitHub <ArrowUpRight size={14} />
          </a>
        </nav>
      </header>
      <main className="arcade-main">
        <section className="hero">
          <div>
            <div className="eyebrow">
              <span /> TEN ERDŐS PROOFS · ZERO PREREQUISITES
            </div>
            <h1>
              Big math.
              <br />
              <span>Small, visible steps.</span>
            </h1>
            <p>
              Watch the code think. Move the pieces.
              <br />
              Get the idea before the symbols get in the way.
            </p>
          </div>
          <div className="hero-note">
            <div className="tiny-demo">
              <span>?</span>
              <ArrowRight />
              <span>→</span>
              <ArrowRight />
              <span>
                <Check size={22} />
              </span>
            </div>
            <p>
              One idea. Four moments.
              <br />A little less mysterious.
            </p>
            <a
              href="#walkthrough"
              onClick={(e) => {
                e.preventDefault();
                player.current?.scrollIntoView({
                  behavior: reduced ? 'instant' : 'smooth',
                });
              }}
            >
              Start exploring <ArrowRight size={16} />
            </a>
          </div>
        </section>
        <section id="collection" className="collection">
          <div className="section-label">
            <span>01 — PICK YOUR PUZZLE</span>
            <span>{visited.length} / 10 explored</span>
          </div>
          <div className="proof-grid">
            {proofs.map((p, i) => (
              <button
                key={p.id}
                onClick={() => {
                  select(i);
                  if (innerWidth < 800)
                    player.current?.scrollIntoView({
                      behavior: reduced ? 'instant' : 'smooth',
                    });
                }}
                className={`proof-card ${i === index ? 'selected' : ''}`}
                aria-pressed={i === index}
                style={{ '--card-color': p.color } as CSSProperties}
              >
                <span className="card-meta">
                  #{p.id}
                  <span>
                    {visited.includes(p.id) ? (
                      <Check size={13} />
                    ) : (
                      String(i + 1).padStart(2, '0')
                    )}
                  </span>
                </span>
                <strong>{p.title}</strong>
                <span className="card-tag">
                  {p.tag}
                  <ArrowUpRight size={13} />
                </span>
              </button>
            ))}
          </div>
        </section>
        <section id="walkthrough" ref={player} className="walkthrough">
          <div className="walkthrough-heading">
            <div>
              <div className="eyebrow">
                02 — INSIDE THE PROOF{' '}
                <span className="problem-badge">ERDŐS #{proof.id}</span>
              </div>
              <h2>{proof.title}</h2>
              <p>{proof.hook}</p>
            </div>
            <div className="view-actions">
              <button
                onClick={share}
                aria-label="Copy link to this step"
                title="Copy link to this step"
              >
                {copied ? <Check size={18} /> : <LinkIcon size={18} />}
              </button>
              <button
                onClick={() => setPresent((v) => !v)}
                aria-label={present ? 'Exit presentation' : 'Presentation mode'}
                title="Presentation mode"
              >
                {present ? <X size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>
          <div className="player-layout">
            <div className="visual-column">
              <div
                className="stage"
                onPointerDown={(e) => {
                  if ((e.target as HTMLElement).closest('input,button,summary'))
                    setPlaying(false);
                }}
              >
                <div className="stage-top">
                  <span>
                    <i /> BROWSER ANIMATION
                  </span>
                  <span>STEP {step + 1} / 4</span>
                </div>
                <Scene
                  key={proof.id}
                  id={proof.id}
                  step={step}
                  progress={progress}
                  playing={playing}
                />
                <div className="stage-bottom">
                  <VolumeX size={13} /> No audio needed{' '}
                  <span>Try the controls inside the scene</span>
                </div>
              </div>
              <div className="transport">
                <button
                  className="play-button"
                  aria-label={
                    playing ? 'Pause walkthrough' : 'Play walkthrough'
                  }
                  onClick={() => {
                    if (progress === 1) {
                      setStep(0);
                      setProgress(0);
                    }
                    setPlaying((v) => !v);
                  }}
                >
                  {playing ? (
                    <Pause size={18} fill="currentColor" />
                  ) : (
                    <Play size={18} fill="currentColor" />
                  )}
                  {playing ? 'Pause' : 'Play'}
                </button>
                <button
                  className="icon-button"
                  onClick={() => {
                    setStep(0);
                    setProgress(0);
                    setPlaying(false);
                  }}
                  aria-label="Restart walkthrough"
                >
                  <RotateCcw size={17} />
                </button>
                <div className="timeline" aria-label="Animation progress">
                  {proof.steps.map((s, i) => (
                    <button
                      aria-label={`Go to step ${i + 1}: ${s.title}`}
                      key={i}
                      onClick={() => go(i)}
                      className={i === step ? 'active' : ''}
                    >
                      <span
                        style={{
                          width: `${i < step ? 100 : i === step ? progress * 100 : 0}%`,
                        }}
                      />
                    </button>
                  ))}
                </div>
                <select
                  aria-label="Playback speed"
                  value={speed}
                  onChange={(e) => setSpeed(+e.target.value)}
                >
                  <option value={0.75}>0.75×</option>
                  <option value={1}>1×</option>
                  <option value={1.5}>1.5×</option>
                </select>
                <button
                  className="icon-button"
                  aria-label="Previous step"
                  disabled={step === 0}
                  onClick={() => go(step - 1)}
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  className="next-button"
                  disabled={step === 3}
                  onClick={() => go(step + 1)}
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <aside className="explanation">
              <div className="steps-nav">
                {proof.steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className={i === step ? 'active' : ''}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    <span>{i < step ? <Check size={12} /> : i + 1}</span>
                    {s.title}
                  </button>
                ))}
              </div>
              <div
                className="explanation-copy"
                key={`${proof.id}-${step}`}
                aria-live="polite"
              >
                <span className="mini-label">WHAT THE CODE DOES</span>
                <h3>{current.title}</h3>
                <p>{current.plain}</p>
                <div className="math-note">{current.math}</div>
                <span className="mini-label">WHY THIS MATTERS</span>
                <p className="why">{current.why}</p>
              </div>
              <div className="code-panel">
                <div>
                  <span>
                    <Code2 size={14} /> ACTUAL LEAN SOURCE
                  </span>
                  <a
                    href={`https://github.com/plby/lean-proofs/blob/${commit}/src/latest/${file.path}#L${current.lines[0]}-L${current.lines[1]}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open these lines on GitHub"
                  >
                    <ArrowUpRight size={16} />
                  </a>
                </div>
                <pre>
                  {lines
                    .slice(current.lines[0] - 1, current.lines[1])
                    .map((l, i) => (
                      <span className="code-line" key={i}>
                        <i>{current.lines[0] + i}</i>
                        <code>{l || ' '}</code>
                      </span>
                    ))}
                </pre>
                <button onClick={() => setSourceOpen((v) => !v)}>
                  <BookOpen size={13} />
                  {sourceOpen ? 'Hide full file' : 'Read full file'}
                </button>
              </div>
            </aside>
          </div>
          {sourceOpen && (
            <div className="full-source">
              <div>
                <b>{file.path}</b>
                <a href={`/proofs/${file.path}`} download>
                  <Download size={15} /> Download .lean
                </a>
              </div>
              <pre>
                {lines.map((l, i) => (
                  <span
                    key={i}
                    className={`code-line ${i + 1 >= current.lines[0] && i + 1 <= current.lines[1] ? 'highlight' : ''}`}
                  >
                    <i>{i + 1}</i>
                    <code>{l || ' '}</code>
                  </span>
                ))}
              </pre>
            </div>
          )}
          <div className="proof-footer">
            <span>
              <Check size={14} /> Original proof source included
            </span>
            <span>
              Illustrated source walkthrough · JS examples, not a live Lean
              session
            </span>
            <button
              onClick={() => {
                select((index + 1) % 10);
              }}
            >
              Next puzzle <ArrowRight size={15} />
            </button>
          </div>
          <details className="source-details">
            <summary>
              Proof scope, verification & credits{' '}
              <span>Read the fine print →</span>
            </summary>
            <div>
              <p>{proof.scope}</p>
              <p>
                Sources:{' '}
                <a
                  href={`https://github.com/plby/lean-proofs/blob/${commit}/ErdosProblems/Erdos${proof.id}.md`}
                  target="_blank"
                  rel="noreferrer"
                >
                  plby/lean-proofs, Erdős #{proof.id}
                </a>
                , pinned to commit <code>{commit.slice(0, 12)}</code>. Original
                author and license notices are preserved in the downloaded
                files. This independent educational project is not affiliated
                with Erdős Problems or the Lean project.
              </p>
              <p id="verification-note">
                The browser uses independently tested JavaScript examples. Lean
                verification results and exact reproduction instructions are in
                the{' '}
                <a href="/proofs/verification.json" target="_blank">
                  verification report
                </a>
                . A proof verifies its formal statement; the scope note above
                explains what is being illustrated.
              </p>
              <a href={`/proofs/${sourceFor(proof.id).path}`} download>
                <Download size={14} /> Download main Lean file
              </a>
              {proof.id === 231 && (
                <a href="/proofs/ErdosProblems/Erdos231/Proof.lean" download>
                  Download helper module
                </a>
              )}
            </div>
          </details>
        </section>
        <section className="closing">
          <span>YOU DON’T HAVE TO READ EVERY SYMBOL.</span>
          <h2>
            Follow the move.
            <br />
            Then follow the proof.
          </h2>
          <p>
            These are ten approachable entry points into real formal proofs.
            <br />
            Some ideas are tiny. Their consequences aren’t.
          </p>
        </section>
      </main>
      <footer className="site-footer">
        <span>
          small proofs. <small>Math, with the steps left in.</small>
        </span>
        <a href={repo}>
          Source & reproduction <ArrowUpRight size={14} />
        </a>
        <span>← → steps · Space play · Esc exit</span>
      </footer>
    </div>
  );
}
