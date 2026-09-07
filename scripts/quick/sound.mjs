import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const { duration, chapters }=JSON.parse(readFileSync('public/movie/quick/chapters.json','utf8'));
const rate=48000, samples=new Float32Array(Math.ceil(duration*rate));
const at=(c,s,f)=>{const cue=chapters[c].cues[s];return cue.start+(cue.end-cue.start)*f};
function ping(time,frequency=660,gain=.1,length=.13){for(let i=0;i<length*rate;i++){const pos=Math.round(time*rate)+i;if(pos>=samples.length)break;const t=i/rate,envelope=Math.min(1,t/.008)*Math.exp(-t*28);samples[pos]+=gain*envelope*(Math.sin(2*Math.PI*frequency*t)+.15*Math.sin(4*Math.PI*frequency*t));}}
for(let i=0;i<3;i++)ping(at(0,0,.04+i*.08),330+i*110,.07);
ping(at(0,1,.54),880,.07);ping(at(1,0,.62),660,.08);
for(let i=0;i<5;i++)ping(at(2,0,.35+i*.085),440+i*110,.075);
for(let i=0;i<8;i++)ping(at(3,0,.28)+i*.07,220-i*12,.04,.08);
ping(at(3,1,.46),660,.09);
ping(at(4,1,.20),330,.1);ping(at(4,1,.43),440,.1);ping(at(4,1,.65),880,.08);
for(let i=0;i<6;i++)ping(at(5,1,.15+i*.105),440+[0,110,220,330,440,660][i],.09);
const pcm=Buffer.alloc(samples.length*2);for(let i=0;i<samples.length;i++)pcm.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),i*2);
const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+pcm.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(1,22);header.writeUInt32LE(rate,24);header.writeUInt32LE(rate*2,28);header.writeUInt16LE(2,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(pcm.length,40);
writeFileSync('.film-cache/quick/effects.wav',Buffer.concat([header,pcm]));
execFileSync('ffmpeg',['-v','error','-y','-i','.film-cache/quick/narration.wav','-i','.film-cache/quick/effects.wav','-filter_complex','[0:a][1:a]amix=inputs=2:normalize=0,alimiter=limit=0.95:level=false','-c:a','pcm_s16le','.film-cache/quick/soundtrack.wav']);
console.log('Quiet, synchronized sound cues mixed under narration.');
