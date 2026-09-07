import * as THREE from 'three';
const data = await fetch('/movie/chapters.json').then(r => r.json());
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(1280, 720); renderer.setPixelRatio(1); document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#080f1c');
const camera = new THREE.PerspectiveCamera(40, 1280 / 720, .1, 100); camera.position.set(0, .1, 20); camera.lookAt(0, 0, 0);
scene.add(new THREE.AmbientLight('#c4d8ff', 2.2));
const light = new THREE.DirectionalLight('#ffffff', 3); light.position.set(-7, 9, 12); scene.add(light);
const root = new THREE.Group(); scene.add(root);
const blue = '#73baff', teal = '#5ae0b3', yellow = '#ffda78', red = '#ee7d8d', purple = '#b9a0ff', muted = '#91a6c4';
const E = x => { const v = Math.max(0, Math.min(1, x)); return v * v * (3 - 2 * v); };
const ramp = (t, a, b) => !Number.isFinite(a) ? 0 : E((t - a) / Math.max(.01, b - a));
let current = -1, actors = [], chapter, progress;
const beat = (sentence, fraction = 0) => { const cue = chapter.cues[sentence]; return cue.start - chapter.start + (cue.end - cue.start) * fraction; };
function clear() { root.traverse(o => { o.geometry?.dispose(); if (o.material) for (const m of Array.isArray(o.material) ? o.material : [o.material]) { m.map?.dispose(); m.dispose(); } }); root.clear(); actors = []; }
function label(text, w, h, { color = '#edf4ff', size = .48, mono = false, background } = {}) {
  const c = document.createElement('canvas'); c.width = Math.max(256, Math.round(w * 110)); c.height = Math.max(1, Math.round(c.width * h / w));
  const ctx = c.getContext('2d'); if (background) { ctx.fillStyle = background; ctx.fillRect(0, 0, c.width, c.height); }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.font = `600 ${size * c.width / w}px ${mono ? 'monospace' : 'Arial'}`; ctx.fillText(text, c.width / 2, c.height / 2, c.width - 15);
  const map = new THREE.CanvasTexture(c); map.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false }));
}
function box(w, h, depth, color) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, depth), new THREE.MeshStandardMaterial({ color, metalness: .15, roughness: .36, transparent: true })); }
function plate(title, subtitle, w = 4.4, h = 1.7, color = blue) {
  const g = new THREE.Group(); const body = box(w, h, .3, '#1a304c'); g.add(body);
  const edge = box(.07, h, .35, color); edge.position.x = -w / 2; g.add(edge);
  const face = label(title, w - .15, subtitle ? h * .52 : h, { color, size: .53 }); face.position.set(0, subtitle ? h * .2 : 0, .17); g.add(face);
  if (subtitle) { const sub = label(subtitle, w - .2, h * .43, { color: '#c6d6eb', size: .33 }); sub.position.set(0, -h * .26, .18); g.add(sub); }
  g.userData.body = body; return g;
}
function actor(obj, x = 0, y = 0, at = 0, update = () => 1, z = 0) {
  obj.position.set(x, y, z); root.add(obj); actors.push({ obj, base: obj.position.clone(), at, update }); return obj;
}
function words(text, x, y, w = 21, size = .48, color = '#edf4ff', at = 0, update) { return actor(label(text, w, .9, { size, color }), x, y, at, update, .55); }
function token(text, color = blue, w = 1.5) { return plate(text, '', w, 1, color); }
function receipt(text = 'evidence', color = teal, w = 3.4) { return plate('✓ ' + text, 'a proof, not a guess', w, 1.25, color); }
function travel(obj, from, to, start, end, arc = 1, remain = true) {
  return actor(obj, ...from.slice(0, 2), start, (t, node) => {
    const p = ramp(t, start, end); node.position.set(THREE.MathUtils.lerp(from[0], to[0], p), THREE.MathUtils.lerp(from[1], to[1], p) + Math.sin(p * Math.PI) * arc, THREE.MathUtils.lerp(from[2] ?? 0, to[2] ?? 0, p) + Math.sin(p * Math.PI) * .8);
    node.rotation.z = Math.sin(p * Math.PI) * -.1; return remain ? 1 : 1 - ramp(t, end, end + .6);
  });
}
const goals = [ ['n > 0','positive size'], ['εn < a','a large enough'], ['εn < b','b large enough'], ['a! b! ∣ n! k!','exact division'], ['C log n < k','gap above limit'], ['k < C′ log n','gap below limit'] ];
function door(index, x, y, start = 0, unlock = Infinity, compact = false) {
  const w = compact ? 3.25 : 6.2, h = compact ? 2.65 : 2.2;
  const g = new THREE.Group(); const frame = box(w, h, .24, '#29405e'); g.add(frame);
  const check = label('✓', w * .6, h * .8, { color: teal, size: 1.2 }); check.position.set(0, .22, .16); g.add(check);
  const fulfilled = label(goals[index][0], w - .3, .5, {color:teal,size:compact?.28:.4}); fulfilled.position.set(0,-h*.3,.17); g.add(fulfilled);
  const hinge = new THREE.Group(); hinge.position.set(-w / 2 + .07, 0, .2); g.add(hinge);
  const leaf = box(w - .14, h - .14, .12, '#14253b'); leaf.position.x = w / 2 - .07; hinge.add(leaf);
  const name = label(compact ? goals[index][1] : goals[index][0], w - .3, .65, { color: '#dce9fc', size: compact ? .32 : .43, mono: !compact }); name.position.set(w / 2 - .07, -h * .27, .08); hinge.add(name);
  const lock = new THREE.Group(); lock.position.set(w / 2 - .07, .35, .25); hinge.add(lock);
  const lockBody = box(.6, .5, .22, yellow); lock.add(lockBody);
  const shackle = new THREE.Mesh(new THREE.TorusGeometry(.22, .055, 8, 24, Math.PI), new THREE.MeshStandardMaterial({ color: yellow, transparent: true })); shackle.position.y = .25; lock.add(shackle);
  return actor(g, x, y, start, (t) => { const open = ramp(t, unlock, unlock + 1.35); hinge.rotation.y = open * 1.45; shackle.position.y = .25 + open * .18; shackle.rotation.z = -open * .5; lockBody.material.color.set(open > .3 ? teal : yellow); return 1; });
}
function build(index) {
  clear(); chapter = data.chapters[index];
  words('ERDŐS #728  ·  FOLLOW THE PROOF', 0, 6.25, 22, .29, muted);
  words(chapter.title, 0, 5.2, 23, .78);
  const source = chapter.code.length > 58 ? ["refine' ⟨ by linarith, _, _,", 'this.2.2.2.2.1, this.2.2.2.2.2, _ ⟩;'] : [chapter.code];
  source.forEach((line, i) => actor(label(line, 23, .65, { color: blue, size: .42, mono: true, background: '#102139' }), 0, -5.05 - i * .58, 0));
  words(`Lean line ${chapter.line} · earlier lemmas summarized`, 0, -6.16, 22, .26, muted);
  const rail = box(22, .035, .02, '#24344c'); rail.position.set(0, -6.6, 0); root.add(rail);
  progress = box(22, .055, .03, teal); progress.position.y = -6.6; root.add(progress);
  if (index === 0) mission(); else if (index === 1) midpoint(); else if (index === 2) thresholds(); else if (index === 3) survivor(); else if (index === 4) cancellation(); else if (index === 5) unlock(); else ending();
}
function mission() {
  ['a','b','n'].forEach((name, i) => { actor(plate(`${name} = ?`, 'an empty box', 4.8, 1.65, [blue,purple,teal][i]), (i - 1) * 6, 2.4, beat(0, .12 + i * .16)); });
  for (let i = 0; i < 6; i++) door(i, (i - 2.5) * 3.65, -1, beat(1, .08 + i * .075), Infinity, true);
  words('Every door needs evidence.', 0, -3, 22, .6, yellow, beat(1, .55), t => 1 - ramp(t, beat(2), beat(2, .12)));
  words('factorial = multiply down to 1     4! = 4 × 3 × 2 × 1', 0, -3, 23, .45, yellow, beat(2, .03), t => 1 - ramp(t, beat(3), beat(3, .1)));
  words('Build the numbers → bring back their proofs.', 0, -3, 23, .57, teal, beat(3, .08));
  words('Gap = a + b − n   ·   later, our construction makes this k', 0, -4, 23, .33, muted, beat(2, .4));
}
function midpoint() {
  actor(plate('C', 'positive lower limit', 4.6, 2, blue), -7, 1.7, beat(0, .02));
  actor(plate('C′', 'larger upper limit', 4.6, 2, yellow), 7, 1.7, beat(0, .4));
  actor(plate('AVERAGE', '(C + C′) / 2', 6, 2.1, purple), 0, -.3, beat(1, .04));
  travel(token('C', blue), [-7,1.7,.6], [-1.2,-.3,.7], beat(1, .1), beat(1, .36), 1, false);
  travel(token('C′', yellow), [7,1.7,.6], [1.2,-.3,.7], beat(1, .12), beat(1, .36), 1, false);
  travel(token('c', teal, 2), [0,-.3,1], [0,-2.25,.8], beat(1, .48), beat(1, .7), .3);
  words('C < c < C′', 0, -3.6, 17, .78, teal, beat(2, .03));
}
function thresholds() {
  const starts = [];
  for (let i = 0; i < 5; i++) {
    const start = beat(1, .32 + i * .085); starts.push(start);
    const g = plate(`M ≥ M${i+1}`, 'waiting', 3.6, 1.65, blue);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(.12, 16, 12), new THREE.MeshBasicMaterial({ color: red, transparent: true })); lamp.position.set(1.45, .52, .23); g.add(lamp);
    actor(g, (i - 2) * 4.4, 2.2, beat(0, .08 + i * .07), t => { lamp.material.color.set(t >= start ? teal : red); return 1; });
    actor(label('✓ works', 3.45, .68, { color: teal, size: .35, background: '#14263b' }), (i - 2) * 4.4, 1.78, start, undefined, .3);
  }
  const m = token('M', yellow, 2.4);
  actor(m, -9.2, .3, beat(1, .04), (t, node) => { node.position.x = THREE.MathUtils.lerp(-9.2, 9.2, ramp(t, beat(1, .27), beat(1, .72))); return 1 - ramp(t, beat(1, .78), beat(2, .02)); }, .7);
  words('M := M₁ + M₂ + M₃ + M₄ + M₅ + 2', 0, -1.4, 23, .61, yellow, beat(1, .03));
  travel(receipt('hM', teal, 5.5), [9,.3,.5], [0,-3,.8], beat(2, .2), beat(2, .48));
  words('ONE number. ALL five promises.', 0, -4, 23, .42, teal, beat(2, .56));
}
function survivor() {
  words('Candidates in [M, 2M]', 0, 3.45, 21, .4, blue);
  const keep = [2,7,11,16,19];
  for (let i = 0; i < 20; i++) {
    const x = (i % 10 - 4.5) * 1.8, y = i < 10 ? 1.95 : .35;
    const tile = token('?', blue, 1.23); const bad = !keep.includes(i);
    actor(tile, x, y, beat(0, .12) + i * .035, (t, node) => {
      if (bad) {
        const fall = ramp(t, beat(1, .12) + i * .09, beat(1, .42) + i * .09);
        node.userData.body.material.color.set(fall > 0 ? red : '#1a304c'); node.position.y -= fall * 3; node.rotation.z = fall * (i % 2 ? .8 : -.8); return 1 - fall;
      }
      node.userData.body.material.color.set(t > beat(2) ? '#236452' : '#1a304c');
      if (i === 11) { const p = ramp(t, beat(2, .32), beat(2, .72)); node.position.x = THREE.MathUtils.lerp(x, 0, p); node.position.y = THREE.MathUtils.lerp(y, -.6, p); node.scale.setScalar(1 + p * .6); return 1 - ramp(t, beat(3, .02), beat(3, .16)); }
      return 1 - .7 * ramp(t, beat(2, .3), beat(2, .65));
    });
  }
  words('bad candidates < all candidates', 0, -2.3, 23, .65, red, beat(1, .4), t => 1 - ramp(t, beat(2, .15), beat(2, .35)));
  words('At least one MUST survive.', 0, -2.3, 23, .65, teal, beat(2, .2));
  actor(token('m', teal, 2.4), 0, -.6, beat(3, .02));
  travel(receipt('hm', teal, 4.3), [7,-.6,.4], [4,-.6,.6], beat(3, .2), beat(3, .5), .4);
  words('Illustration of the counting lemma — no numerical search', 0, -3.9, 23, .32, muted, beat(0, .08));
}
function cancellation() {
  const colors = [blue,purple,teal], xs = [-7,0,7];
  ['a','b','n'].forEach((name, i) => actor(plate('', '', 5.5, 1.95, colors[i]), xs[i], 2.15, beat(0, .02)));
  const input = [['m',-8,blue],['k',-6,yellow],['m',0,blue],['m',6,blue],['m',8,blue]];
  input.forEach(([name,x,color], i) => {
    const end = beat(0, .3 + i * .11); const g = token(name, color, 1.35);
    actor(g, x, 2, end - .8, (t,node) => { node.position.y = 2 + (1 - ramp(t, end - .8, end)) * 2.5; return 1; }, .65);
  });
  // The original box labels stay visible as pieces are copied into the gap below.
  ['a = m + k','b = m','n = m + m'].forEach((s,i) => words(s,xs[i],3.6,6,.44,colors[i],beat(0,.03)));
  words('k = ⌊c log M⌋  ·  round down',0,.2,22,.48,yellow,beat(1,.04), t=>1-ramp(t,beat(2),beat(2,.12)));
  words('a + b − n',0,.1,22,.66,'#edf4ff',beat(2,.03),t=>1-ramp(t,beat(3,.13),beat(3,.32)));
  const targetX=[-6,-3,0,3,6];
  input.forEach(([name,x,color],i)=> {
    const start=beat(2,.15+i*.075), end=beat(2,.45+i*.075);
    actor(token(i>2?'−m':name,color,1.7), x, 2, start,(t,node)=>{
      const p=ramp(t,start,end); node.position.set(THREE.MathUtils.lerp(x,targetX[i],p),THREE.MathUtils.lerp(2,-1.5,p)+Math.sin(p*Math.PI)*.5,1);
      const pair=i===0||i===3?0:i===2||i===4?1:-1;
      if(pair>=0){const a=beat(3,pair===0?.12:.38), b=beat(3,pair===0?.3:.56); const q=ramp(t,a,b); const destination=pair===0?-1.5:3; node.position.x=THREE.MathUtils.lerp(node.position.x,destination,q); node.position.y+=Math.sin(q*Math.PI)*.5; node.scale.setScalar(1-q*.6); return 1-q;}
      const q=ramp(t,beat(3,.6),beat(3,.79)); node.position.x=THREE.MathUtils.lerp(node.position.x,0,q);node.scale.setScalar(1+q*.45);return 1;
    },1);
  });
  ['+','+','+','+'].forEach((s,i)=>words(s,-4.5+i*3,-1.5,1,.5,muted,beat(2,.65),t=>1-ramp(t,beat(3,.08),beat(3,.15))));
  words('PAIR 1:  m − m = 0',-5,-3.25,10,.46,blue,beat(3,.12),t=>1-ramp(t,beat(3,.38),beat(3,.46)));
  words('PAIR 2:  m − m = 0',4,-3.25,10,.46,blue,beat(3,.38),t=>1-ramp(t,beat(3,.6),beat(3,.68)));
  words('The entire gap is just k.',0,-3.25,22,.65,yellow,beat(3,.65));
}
function unlock() {
  const locations=Array.from({length:6},(_,i)=>[(i%3-1)*7, i<3?1.9:-1]);
  const times=[beat(2,.25),beat(2,.42),beat(2,.57),beat(1,.43),beat(1,.69),beat(2,.77)];
  locations.forEach(([x,y],i)=>{
    door(i,x,y,beat(0,.05),times[i]);
    const start=times[i]-1.5, end=times[i];
    const proof=token('✓',teal,.75);
    actor(proof,-9,-3.8,start,(t,node)=>{const p=ramp(t,start,end);node.position.set(THREE.MathUtils.lerp(-9,x,p),THREE.MathUtils.lerp(-3.8,y+.3,p)+Math.sin(p*Math.PI)*1.8,1.2);return 1-ramp(t,end,end+.6);});
  });
  words('a = m + k     b = m     n = 2m',0,3.5,23,.44,blue,beat(0,.1));
  words('Construction lemma → evidence',0,-3.8,23,.5,teal,beat(1,.02),t=>1-ramp(t,beat(2),beat(2,.1)));
  words('refine → organize     linarith / nlinarith → finish',0,-3.8,23,.47,yellow,beat(2,.02),t=>1-ramp(t,beat(3),beat(3,.1)));
  words('6 requirements. 6 proofs. No gaps.',0,-3.8,23,.63,teal,beat(3,.07));
}
function ending() {
  const labels=['Choose c','Choose M','Extract m','Build a,b,n','Supply proof'];
  labels.forEach((name,i)=>{const start=beat(0,.03+i*.14); actor(plate(name,'✓',3.8,1.7,teal),(i-2)*4.4,2.3,start); if(i<4) words('→',(i-1.5)*4.4,2.3,.6,.55,teal,start+.5);});
  actor(plate('PROOF COMPLETE','erdos_728_fc',11,2,teal),0,-.3,beat(0,.83));
  words('0 < ε < ½      0 < C < C′',0,-2.2,23,.52,blue,beat(1,.08));
  words('Lean checked · no sorry · supporting lemmas also checked',0,-3.2,23,.43,teal,beat(2,.06));
  words('Standard axioms: propext · Classical.choice · Quot.sound',0,-4.1,23,.3,muted,beat(2,.45));
}
window.renderFrame = time => {
  const found = data.chapters.findIndex(ch => time < ch.end), index = found < 0 ? data.chapters.length - 1 : found;
  if (index !== current) { current = index; build(index); }
  const t = time - chapter.start, duration = chapter.end - chapter.start;
  const fade = Math.min(ramp(t,0,.3),1-ramp(t,duration-.35,duration));
  for(const {obj,base,at,update} of actors){obj.position.copy(base);obj.rotation.set(0,0,0);obj.scale.setScalar(1);const opacity=ramp(t,at,at+.45)*fade*(update(t,obj)??1);obj.visible=opacity>.001;obj.traverse(child=>{if(child.material)child.material.opacity=opacity;});}
  const amount=Math.max(.001,Math.min(1,time/data.duration));progress.scale.x=amount;progress.position.x=-11+11*amount;
  renderer.render(scene,camera);
};
window.filmDuration=data.duration;window.renderFrame(.8);window.filmReady=true;
