import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const root = process.cwd();
const quick = process.argv.includes('--quick');
const output = path.join(root, quick ? 'public/movie/quick' : 'public/movie');
const cache = path.join(root, quick ? '.film-cache/quick' : '.film-cache');
mkdirSync(output, { recursive: true }); mkdirSync(cache, { recursive: true });
const chapters = JSON.parse(readFileSync(quick ? 'scripts/quick/script.json' : 'scripts/film/script.json', 'utf8'));
const cues = []; const tracks = []; let time = 0;
const stamp = seconds => { const ms = Math.round(seconds * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`; };
for (const [i, chapter] of chapters.entries()) {
  chapter.start = time; chapter.cues = [];
  for (const [j, sentence] of chapter.sentences.entries()) {
    const base = path.join(cache, `voice-${i}-${j}`);
    writeFileSync(`${base}.txt`, sentence);
    execFileSync('say', ['-v', 'Samantha', '-r', quick ? '175' : '155', '-f', `${base}.txt`, '-o', `${base}.aiff`]);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${base}.aiff`, '-af', `apad=pad_dur=${quick ? (j === chapter.sentences.length - 1 ? .65 : .22) : (j === chapter.sentences.length - 1 ? 1.3 : .45)}`, '-ar', '48000', '-ac', '1', `${base}.wav`]);
    const duration = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', `${base}.wav`], { encoding: 'utf8' }).trim());
    const cue = { start: time, end: time + duration, text: sentence };
    cues.push(cue); chapter.cues.push(cue);
    tracks.push(`file '${base.replaceAll("'", "'\\''")}.wav'`); time += duration;
  }
  chapter.end = time;
  console.log(`Narrated chapter ${i + 1}: ${(chapter.end - chapter.start).toFixed(1)}s`);
}
writeFileSync(path.join(cache, 'audio.txt'), tracks.join('\n'));
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(cache, 'audio.txt'), '-c:a', 'pcm_s16le', path.join(cache, 'narration.wav')]);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(cache, 'narration.wav'), '-c:a', 'libmp3lame', '-b:a', '160k', path.join(output, 'erdos728-narration.mp3')]);
writeFileSync(path.join(output, 'chapters.json'), JSON.stringify({ duration: time, voice: 'Samantha (macOS synthetic narration)', chapters }, null, 2));
writeFileSync(path.join(output, 'captions.vtt'), 'WEBVTT\n\n' + cues.map(cue => `${stamp(cue.start)} --> ${stamp(cue.end)}\n${cue.text}\n`).join('\n'));
writeFileSync(path.join(output, 'script.md'), '# Erdős #728 — five moves in a Lean proof\n\nOriginal educational animation. Narration: Samantha, a macOS synthetic voice.\n\nScope: the final assembly of `Erdos728b.erdos_728_fc`; supporting lemmas summarized. The proof chooses the epsilon interval (0, 1/2).\n\n' + chapters.map(chapter => `## ${stamp(chapter.start).slice(3, 8)} — ${chapter.title}\n\nSource line ${chapter.line}:\n\n\`\`\`lean\n${chapter.code}\n\`\`\`\n\n${chapter.sentences.join('\n\n')}${chapter.math ? '\n\nMath layer: ' + chapter.math : ''}`).join('\n\n') + '\n\nSource: https://github.com/plby/lean-proofs/blob/f06c4076c5352252d1dbab91ae3afa28037f466c/src/v4.24.0/ErdosProblems/Erdos728b.lean\n');
console.log(`Audio complete: ${time.toFixed(1)} seconds`);
