import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import path from 'node:path';
const quick = process.argv.includes('--quick');
const root = process.cwd(), output = path.join(root, quick ? 'public/movie/quick' : 'public/movie'), cache = path.join(root, quick ? '.film-cache/quick' : '.film-cache'); mkdirSync(cache, { recursive: true });
const { duration } = JSON.parse(readFileSync(path.join(output, 'chapters.json'), 'utf8'));
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ ...(existsSync(chrome) ? { executablePath: chrome } : {}), headless: true, args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = []; page.on('pageerror', error => errors.push(String(error)));
const fps = 24, frames = Math.ceil(duration * fps);
let encoder;
try {
  await page.goto(`http://127.0.0.1:5173/${quick ? 'quick-film' : 'film'}.html`); await page.waitForFunction(() => window.filmReady);
  for (const [i, chapter] of JSON.parse(readFileSync(path.join(output, 'chapters.json'), 'utf8')).chapters.entries()) {
    await page.evaluate(time => window.renderFrame(time), chapter.start + (chapter.end - chapter.start) * .85);
    await page.screenshot({ path: path.join(cache, `chapter-${i}.png`) });
  }
  await page.evaluate(time => window.renderFrame(time), quick ? 3 : 18); await page.screenshot({ path: path.join(output, 'poster.jpg'), type: 'jpeg', quality: 95 });
  encoder = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-vcodec', 'mjpeg', '-i', 'pipe:0', '-i', path.join(cache, quick ? 'soundtrack.wav' : 'narration.wav'), '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '-shortest', path.join(cache, 'story-render.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
  const exited = once(encoder, 'exit');
  encoder.stdin.on('error', error => { console.error(error); });
  for (let frame = 0; frame < frames; frame++) {
    await page.evaluate(time => window.renderFrame(time), frame / fps);
    const buffer = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!encoder.stdin.write(buffer)) await once(encoder.stdin, 'drain');
    if (frame % (fps * 10) === 0) console.log(`Rendered ${Math.round(frame / fps)} / ${Math.round(duration)} seconds`);
  }
  encoder.stdin.end(); const [code] = await exited; if (code !== 0) throw Error(`ffmpeg exited ${code}`);
  if (errors.length) throw Error(errors.join('\n'));
  renameSync(path.join(cache, 'story-render.mp4'), path.join(output, 'erdos728-explained.mp4'));
  console.log(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,width,height:format=duration,size', '-of', 'json', path.join(output, 'erdos728-explained.mp4')], { encoding: 'utf8' }));
} finally { encoder?.stdin.destroy(); await browser.close(); }
