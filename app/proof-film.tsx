import { useEffect, useRef, useState } from 'react';
import { Download, Film, Headphones } from 'lucide-react';
import detailedMovie from '../public/movie/chapters.json';
import quickMovie from '../public/movie/quick/chapters.json';
const timestamp = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
export default function ProofFilm({ active }: { active: boolean }) {
  const player = useRef<HTMLVideoElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const [time, setTime] = useState(0);
  const [cut, setCut] = useState<'quick' | 'detailed'>('quick');
  const movie = cut === 'quick' ? quickMovie : detailedMovie;
  const base = cut === 'quick' ? '/movie/quick' : '/movie';
  const found = movie.chapters.findIndex(chapter => time < chapter.end);
  const current = found < 0 ? movie.chapters.length - 1 : found;
  const quickFound = quickMovie.chapters.findIndex(chapter => time < chapter.end);
  const quickStep = quickMovie.chapters[quickFound < 0 ? quickMovie.chapters.length - 1 : quickFound];
  useEffect(() => { if (!active) { player.current?.pause(); audio.current?.pause(); } }, [active]);
  function switchCut(next: 'quick' | 'detailed') { player.current?.pause(); audio.current?.pause(); setTime(0); setCut(next); }
  return <div className="proof-view film-view">
    <header><div><span className="eyebrow">ERDŐS #728 · {timestamp(movie.duration)} · NARRATED ANIMATION</span><h1>{cut === 'quick' ? 'Watch the pieces. Get the idea.' : 'Three boxes. Six doors. One proof.'}</h1></div><span className="verified"><Film size={14}/> Lean checked</span></header>
    <div className="cut-picker" role="group" aria-label="Choose video version"><button aria-pressed={cut === 'quick'} onClick={() => switchCut('quick')}>Quick visual cut <span>{timestamp(quickMovie.duration)}</span></button><button aria-pressed={cut === 'detailed'} onClick={() => switchCut('detailed')}>Original doors cut <span>{timestamp(detailedMovie.duration)}</span></button></div>
    <p className="film-intro">{cut === 'quick' ? 'Follow the big shapes. The small math strip tells you exactly what they mean.' : 'Follow the surviving candidate, watch the pieces cancel, and unlock each requirement.'} Supporting lemmas are summarized.</p>
    <video key={cut} ref={player} className="proof-movie" controls preload="metadata" poster={`${base}/poster.jpg`} onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onPlay={() => audio.current?.pause()}>
      <source src={`${base}/erdos728-explained.mp4`} type="video/mp4"/>
      <track kind="captions" src={`${base}/captions.vtt`} srcLang="en" label="English"/>
      Your browser cannot play this video. Download the MP4 below.
    </video>
    <nav className="film-chapters" aria-label="Animation chapters">{movie.chapters.map((chapter, index) => <button key={chapter.title} className={current === index ? 'active' : ''} aria-current={current === index ? 'step' : undefined} onClick={() => { if (player.current) { player.current.currentTime = chapter.start + .4; setTime(chapter.start + .4); } }}><span>{timestamp(chapter.start)}</span>{chapter.short}</button>)}</nav>
    {cut === 'quick' && <details className="math-explainer"><summary>The math behind this moment</summary><p>{quickStep.math}</p><code>{quickStep.code}</code><a href={`https://github.com/plby/lean-proofs/blob/f06c4076c5352252d1dbab91ae3afa28037f466c/src/v4.24.0/ErdosProblems/Erdos728b.lean#L${quickStep.line}`} target="_blank" rel="noreferrer">View source line {quickStep.line} ↗</a></details>}
    <div className="film-downloads"><a href={`${base}/erdos728-explained.mp4`} download><Download size={15}/> Video</a><a href={`${base}/script.md`} download><Download size={15}/> Script</a><a href={`${base}/erdos728-narration.mp3`} download><Headphones size={15}/> Narration</a><a href={`${base}/captions.vtt`} download><Download size={15}/> Captions</a><span>Original Three.js animation · {movie.voice}</span></div>
    <details className="film-transcript"><summary>Read the narration</summary>{movie.chapters.map(chapter => <section key={chapter.title}><h2>{timestamp(chapter.start)} · {chapter.title}</h2><code>{chapter.code}</code>{chapter.sentences.map(sentence => <p key={sentence}>{sentence}</p>)}</section>)}<div className="audio-only"><span>Listen without video</span><audio key={cut} ref={audio} controls preload="none" src={`${base}/erdos728-narration.mp3`} onPlay={() => player.current?.pause()}/></div></details>
  </div>;
}
