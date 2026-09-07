import * as THREE from 'three';
const data = await fetch('/movie/quick/chapters.json').then(r => r.json());
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
// The large shapes tell the story; a separate lower rail preserves the mathematics.
function rounded(w,h,d,color) {
 const r=Math.min(.22,h/4),s=new THREE.Shape();
 s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
 return new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSize:.08,bevelThickness:.08,bevelSegments:3,steps:1}),new THREE.MeshStandardMaterial({color,roughness:.24,metalness:.18,transparent:true}));
}
function piece(name,color=blue,w=1.5,h=1.4){const g=new THREE.Group(),body=rounded(w,h,.32,color);g.add(body);const face=label(name,w-.1,h,{color:'#0b1730',size:.7});face.position.z=.43;g.add(face);g.userData.body=body;return g;}
function ring(x,y,color,at,max=1.5){const g=new THREE.Mesh(new THREE.TorusGeometry(.5,.035,8,48),new THREE.MeshBasicMaterial({color,transparent:true}));return actor(g,x,y,at,(t,n)=>{const p=ramp(t,at,at+.7);n.scale.setScalar(1+p*max);return 1-p;},.8);}
function bobPiece(name,x,y,color,at,w=2.2){return actor(piece(name,color,w,1.8),x,y,at,(t,n)=>{const p=ramp(t,at,at+.65);n.position.y+=(1-p)*2+Math.sin((t-at)*2)*.045;n.rotation.z=(1-p)*-.25;return 1;});}
function lightPad(x,y,at,on,index,caption='',w=2.5){const g=new THREE.Group();const base=rounded(w,1.7,.25,'#152943');g.add(base);const light=new THREE.Mesh(new THREE.SphereGeometry(.19,20,16),new THREE.MeshStandardMaterial({color:'#344967',emissive:'#14263e',transparent:true}));light.position.set(0,.26,.48);g.add(light);const title=label(caption||String(index+1),w-.15,.6,{color:'#c7d8f0',size:.3});title.position.set(0,-.45,.37);g.add(title);const tick=label('✓',.7,.7,{color:teal,size:.55});tick.position.set(0,.27,.7);g.add(tick);return actor(g,x,y,at,t=>{light.visible=t<on;tick.visible=t>=on;return 1;});}
function ribbon(text,y,color=teal,at=0,until=Infinity,size=.55){return words(text,0,y,23,size,color,at,t=>1-ramp(t,until,until+.3));}
function build(index){
 clear();chapter=data.chapters[index];scene.background.set(['#0b1020','#111025','#0b1424','#111124','#0c1122','#0b1822','#0b1420'][index]);
 words('ERDŐS 728  /  THE QUICK CUT',0,6.15,23,.25,muted);
 words(chapter.title,0,5.1,23,.82,'#f0f5ff');
 const mathLines=[];for(const word of chapter.math.split(' ')){if(!mathLines.length||mathLines.at(-1).length+word.length>106)mathLines.push(word);else mathLines[mathLines.length-1]+=' '+word;}
 actor(box(24,2,.04,'#0e2036'),0,-5.55,0,undefined,-.15);
 words('MATH LAYER',-10,-4.65,3,.2,muted);
 mathLines.forEach((line,i)=>words(line,0,-5.08-i*.43,23,.29,'#bfd3ef'));
 const code=chapter.code.length>58?"refine' ⟨ … ⟩;  ·  linarith / nlinarith":chapter.code;
 words(`L${chapter.line}  ${code}`,0,-6.08,23,.26,blue);
 const rail=box(22,.035,.02,'#203653');rail.position.set(0,-6.6,0);root.add(rail);progress=box(22,.055,.03,teal);progress.position.y=-6.6;root.add(progress);
 [challenge,middle,ready,crowd,cancel,receipts,complete][index]();
}
function challenge(){
 const showFit=beat(1,.02);
 ['a?','b?','n?'].forEach((n,i)=>{const start=beat(0,.04+i*.08);actor(piece(n,[blue,purple,teal][i],3,2.2),(i-1)*5,2,start,(t,node)=>{node.rotation.z=(1-ramp(t,start,start+.6))*.25;node.position.y+=(1-ramp(t,start,start+.6))*2;return 1-ramp(t,showFit,showFit+.35);});});
 for(let i=0;i<6;i++)lightPad((i-2.5)*3.55,-.9,beat(0,.23+i*.065),Infinity,i,['SIZE','SIZE','SIZE','DIVIDE','GAP','GAP'][i]);
 ribbon('BUILD → CHECK',-3.3,yellow,beat(0,.58),showFit);
 // A plainly labelled toy division, not a computed Erdős witness.
 for(let i=0;i<12;i++){
  const start=beat(1,.08),end=beat(1,.54),p=piece('',blue,.44,.44);actor(p,(i-5.5)*.7,2.55,start,(t,n)=>{const q=ramp(t,start,end);n.position.x=THREE.MathUtils.lerp((i-5.5)*.7,((Math.floor(i/4)-1)*4)+(i%2-.5)*.62,q);n.position.y=THREE.MathUtils.lerp(2.55,2.45+ (Math.floor(i%4/2)-.5)*.62,q);return 1;});
 }
 for(let i=0;i<3;i++){const g=new THREE.Mesh(new THREE.TorusGeometry(.94,.055,8,48),new THREE.MeshBasicMaterial({color:teal,transparent:true}));actor(g,(i-1)*4,2.45,beat(1,.39),undefined,-.2);}
 ribbon('12 ÷ 4 = 3.  NOTHING LEFT OVER.',-3.3,teal,beat(1,.34),Infinity,.56);
 words('Toy example of exact division',0,3.8,23,.3,muted,beat(1,.2));
}
function middle(){
 const a=beat(0,.06),b=beat(0,.37);
 words('LOWER',-7,2.8,5,.4,blue,a);words('UPPER',7,2.8,5,.4,purple,a);
 bobPiece('C',-7,1,blue,a);bobPiece('C′',7,1,purple,a);
 const core=piece('c',yellow,2.6,2.1);actor(core,-5,1,b,(t,n)=>{n.position.x=THREE.MathUtils.lerp(-5,0,ramp(t,b,b+1.1));n.rotation.z=Math.sin(ramp(t,b,b+1.1)*Math.PI)*.2;return 1;});
 for(const sign of [-1,1]){const bar=rounded(4,.07,.03,'#4a5770');actor(bar,sign*3.45,1,beat(0,.46),undefined,-.2);}
 ring(0,1,yellow,beat(0,.62),3);
 ribbon('ROOM ON BOTH SIDES',-2.3,yellow,beat(0,.52),Infinity,.7);
 words('(lower + upper) ÷ 2',0,-3.5,23,.42,muted,beat(0,.32));
}
function ready(){
 const starts=Array.from({length:5},(_,i)=>beat(0,.35+i*.085));
 for(let i=0;i<5;i++){lightPad((i-2)*4.3,1.5,beat(0,.04+i*.04),starts[i],i,`HELPER ${i+1}`,3.5);ring((i-2)*4.3,1.75,teal,starts[i],1.2);}
 const slider=piece('M',yellow,2.2,1.4);actor(slider,-9,-.9,beat(0,.25),(t,n)=>{n.position.x=THREE.MathUtils.lerp(-9,9,ramp(t,beat(0,.3),beat(0,.76)));return 1-ramp(t,beat(1,.03),beat(1,.17));});
 actor(box(19,.06,.07,'#2a3a56'),0,-.9,beat(0,.1),undefined,-.2);
 bobPiece('M',-2,-1.4,yellow,beat(1,.08),2.4);bobPiece('✓',2,-1.4,teal,beat(1,.25),2.4);
 ribbon('NUMBER + PROOF',-3.2,teal,beat(1,.25),Infinity,.72);
}
function crowd(){
 const kept=[3,8,16];for(let i=0;i<20;i++){
  const start=beat(0,.02)+i*.015,x=(i%10-4.5)*1.85,y=i<10?2.1:.3,g=piece('?',blue,1.1,1.1),bad=!kept.includes(i);
  actor(g,x,y,start,(t,n)=>{if(bad){const a=beat(0,.27)+i*.035,p=ramp(t,a,a+.75);n.userData.body.material.color.set(p?red:blue);n.position.y-=p*3.1;n.rotation.z=p*(i%2?1:-1);return 1-p;}const p=ramp(t,beat(1,.03),beat(1,.42));if(i===8){n.position.x=THREE.MathUtils.lerp(x,-1.5,p);n.position.y=THREE.MathUtils.lerp(y,.8,p);n.scale.setScalar(1+p*.7);}return i===8?1-ramp(t,beat(1,.45),beat(1,.58)):1-.8*p;});
 }
 ribbon('THE BAD ONES CANNOT FILL THE CROWD.',-2.25,red,beat(0,.39),beat(1,.03),.57);
 ribbon('AT LEAST ONE SURVIVES.',-2.25,teal,beat(1,.05),Infinity,.72);
 bobPiece('m',-1.5,.8,blue,beat(1,.46),2.2);bobPiece('✓',2,.8,teal,beat(1,.52),2.2);
 words('Illustrative crowd. The proof counts; it does not test these tiles.',0,-3.65,23,.29,muted,beat(0,.05));
}
function cancel(){
 const rows=[[-7,'a',blue], [0,'b',purple],[7,'n',teal]];
 rows.forEach(([x,name,color])=>{actor(rounded(5.4,1.65,.12,'#192c49'),x,2,0);words(name,x,3.45,5,.63,color,0);});
 const pieces=[['m',-8,blue],['k',-6,yellow],['m',0,blue],['m',6,blue],['m',8,blue]],targets=[-6,-3,0,3,6];
 pieces.forEach(([name,x,color],i)=>{
  const at=beat(0,.03+i*.045);bobPiece(name,x,2,color,at,1.35);
  const start=beat(0,.46+i*.045),end=beat(0,.64+i*.045);
  actor(piece(i>2?'−m':name,color,1.7,1.3),x,2,start,(t,n)=>{
   const p=ramp(t,start,end);n.position.set(THREE.MathUtils.lerp(x,targets[i],p),THREE.MathUtils.lerp(2,-.6,p),.7);
   const pair=i===0||i===3?0:i===2||i===4?1:-1;
   if(pair>=0){const a=beat(1,pair===0?.06:.28),b=beat(1,pair===0?.21:.44),q=ramp(t,a,b);n.position.x=THREE.MathUtils.lerp(n.position.x,pair===0?-1.5:3,q);n.position.y+=Math.sin(q*Math.PI)*.7;n.scale.setScalar(1-q*.5);return 1-q;}
   const q=ramp(t,beat(1,.49),beat(1,.65));n.position.x=THREE.MathUtils.lerp(n.position.x,0,q);n.scale.setScalar(1+q*.6);return 1;
  },.7);
 });
 ribbon('FIRST + SECOND − THIRD',-2.65,'#f0f5ff',beat(0,.44),beat(1,.48),.56);
 ring(-1.5,-.6,blue,beat(1,.2),2);ring(3,-.6,blue,beat(1,.43),2);
 ribbon('THAT LITTLE YELLOW GAP.',-2.65,yellow,beat(1,.52),Infinity,.72);
 words('k = floor(c log M)',0,-3.7,23,.34,muted,beat(1,.69));
}
function receipts(){
 const positions=Array.from({length:6},(_,i)=>[(i%3-1)*7.3,i<3?2.1:-.45]);
 const captions=['POSITIVE n','a LARGE ENOUGH','b LARGE ENOUGH','EXACT DIVISION','GAP ABOVE LIMIT','GAP BELOW LIMIT'];
 const on=positions.map((_,i)=>beat(1,.15+i*.105));
 positions.forEach(([x,y],i)=>{lightPad(x,y,beat(0,.03+i*.02),on[i],i,captions[i],5.7);ring(x,y+.3,teal,on[i],1.4);const start=on[i]-.8;actor(piece('✓',teal,.64,.6),0,-2.9,start,(t,n)=>{const p=ramp(t,start,on[i]);n.position.set(THREE.MathUtils.lerp(0,x,p),THREE.MathUtils.lerp(-2.9,y+.3,p),1);return 1-ramp(t,on[i],on[i]+.2);});});
 ribbon('A NUMBER IS NOT A PROOF.',-3.3,yellow,beat(0,.05),beat(1,.62),.65);
 ribbon('6 / 6. ALL CHECKED.',-3.3,teal,beat(1,.69),Infinity,.8);
}
function complete(){
 const a=beat(0,.04),b=beat(0,.39),c=beat(0,.73);
 bobPiece('BUILD',-7,1.8,blue,a,4.2);bobPiece('SIMPLIFY',0,1.8,yellow,b,4.2);bobPiece('PROVE',7,1.8,teal,c,4.2);
 words('→',-3.5,1.8,1,.7,muted,b);words('→',3.5,1.8,1,.7,muted,c);
 ribbon('YOU JUST SAW THE PROOF’S MAIN TRICK.',-.7,yellow,beat(0,.78),beat(1,.27),.56);
 ribbon('LEAN CHECKED. NO MISSING ENDING.',-.7,teal,beat(1,.28),Infinity,.64);
 for(let i=0;i<6;i++){const tick=label('✓',1.2,1.2,{color:teal,size:.8});actor(tick,(i-2.5)*1.5,-2.6,beat(1,.08+i*.045));}
 words('The supporting number theory is summarized.',0,-3.65,23,.32,muted,beat(1,.25));
}
window.renderFrame=time=>{
 const found=data.chapters.findIndex(ch=>time<ch.end),index=found<0?data.chapters.length-1:found;if(index!==current){current=index;build(index);}
 const t=time-chapter.start,duration=chapter.end-chapter.start,fade=Math.min(ramp(t,0,.13),1-ramp(t,duration-.13,duration));
 for(const {obj,base,at,update}of actors){obj.position.copy(base);obj.rotation.set(0,0,0);obj.scale.setScalar(1);const opacity=ramp(t,at,at+.18)*fade*(update(t,obj)??1);obj.visible=opacity>.001;obj.traverse(child=>{if(child.material)child.material.opacity=opacity;});}
 const amount=Math.max(.001,Math.min(1,time/data.duration));progress.scale.x=amount;progress.position.x=-11+11*amount;renderer.render(scene,camera);
};
window.filmDuration=data.duration;window.renderFrame(.8);window.filmReady=true;
