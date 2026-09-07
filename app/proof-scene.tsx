import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RotateCcw, Box } from 'lucide-react';
import { conditions } from '@/lib/erdos728-tour';

type Node = { id: string; at: [number, number, number]; title: string; lines: string[]; step: number; width?: number; height?: number; color?: string };
type Edge = { from: string; to: string; ready: boolean };
type Graph = { nodes: Node[]; edges: Edge[] };
type Props = { kind: 'swap' | 'erdos'; cursor: number; onSelect: (step: number) => void };

function graphFor(kind: Props['kind'], cursor: number): Graph {
  if (kind === 'erdos') return {
    nodes: [
      { id: 'c', at: [-4, 2.5, -1.5], title: '01  Choose c', lines: ['(C + C′) / 2', 'Between the two limits'], step: 0 },
      { id: 'M', at: [0, 2.5, 0], title: '02  Choose M', lines: ['obtain ⟨M, hM⟩', 'All five thresholds hold'], step: 1 },
      { id: 'm', at: [4, 2.5, -1.5], title: '03  Choose m', lines: ['obtain ⟨m, hm⟩', 'Candidate + evidence'], step: 2 },
      { id: 'use', at: [0, -.1, 1], title: '04  Fill a, b, n', lines: ['a = m + k   b = m   n = 2m', 'k = ⌊c log M⌋'], step: 3, width: 5 },
      { id: 'finish', at: [0, -3.3, 2], title: cursor === 4 ? '05  All six facts supplied' : '05  Supply six facts', lines: conditions.map(([code]) => `${cursor === 4 ? '✓' : '○'}  ${code}`), step: 4, width: 4.6, height: 3, color: '#41c9a2' },
    ],
    edges: [{ from: 'c', to: 'M', ready: cursor >= 1 }, { from: 'M', to: 'm', ready: cursor >= 2 }, { from: 'm', to: 'use', ready: cursor >= 3 }, { from: 'use', to: 'finish', ready: cursor >= 4 }],
  };
  const split = cursor > 0;
  return {
    nodes: [
      { id: 'a', at: [-3.7, 1.6, -1.5], title: 'Given: A', lines: ['h.left', 'Has a ticket'], step: 3, color: '#6ca7ff' },
      { id: 'b', at: [-3.7, -1.6, 1.2], title: 'Given: B', lines: ['h.right', 'Has an ID'], step: 2, color: '#b39aff' },
      { id: 'split', at: [0, 3.5, -1], title: split ? '02  Two separate goals' : '01  Goal: B ∧ A', lines: [split ? 'constructor' : 'We already have A ∧ B', split ? 'Prove B, then prove A' : 'Prove them in reverse order'], step: split ? 1 : 0, width: 4 },
      ...(split ? [
        { id: 'goal-b', at: [3.7, 1.6, 1.2] as [number, number, number], title: cursor >= 2 ? '✓  B supplied' : 'Goal 1: B', lines: [cursor >= 2 ? 'exact h.right' : 'Needs evidence for B'], step: 2, color: '#b39aff' },
        { id: 'goal-a', at: [3.7, -1.6, -1.5] as [number, number, number], title: cursor >= 3 ? '✓  A supplied' : 'Goal 2: A', lines: [cursor >= 3 ? 'exact h.left' : 'Needs evidence for A'], step: 3, color: '#6ca7ff' },
      ] : [{ id: 'goal', at: [3.7, 0, .3] as [number, number, number], title: 'Need: B ∧ A', lines: ['Both facts, in this order'], step: 0 }]),
    ],
    edges: split ? [{ from: 'split', to: 'goal-b', ready: true }, { from: 'split', to: 'goal-a', ready: true }, { from: 'b', to: 'goal-b', ready: cursor >= 2 }, { from: 'a', to: 'goal-a', ready: cursor >= 3 }] : [],
  };
}

// Labels are locally drawn textures on solid meshes, so they move with the 3D scene.
function nodeTexture(node: Node, current: boolean, completed: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = Math.round(1024 * (node.height ?? 1.6) / (node.width ?? 3.25));
  const ctx = canvas.getContext('2d')!;
  const color = node.color ?? '#80b5ff';
  ctx.fillStyle = current ? '#18385b' : '#12233a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = current ? color : completed ? '#41c9a2' : '#405a78'; ctx.fillRect(0, 0, 12, canvas.height);
  ctx.fillStyle = current ? '#ffffff' : '#dce9fa'; ctx.font = '600 86px Arial';
  ctx.fillText(node.title, 48, 110, 930);
  ctx.font = '68px monospace';
  node.lines.forEach((line, i) => { ctx.fillStyle = i === 0 || node.id === 'finish' ? color : '#a1b5ce'; ctx.fillText(line, 48, 210 + i * 74, 930); });
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function disposeObjects(root: THREE.Object3D) {
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Line)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach(material => { if ('map' in material && material.map instanceof THREE.Texture) material.map.dispose(); material.dispose(); });
  });
  root.clear();
}

export default function ProofScene({ kind, cursor, onSelect }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const runtime = useRef<{ group: THREE.Group; draw: () => void; reset: () => void; camera: THREE.PerspectiveCamera } | null>(null);
  const select = useRef(onSelect); select.current = onSelect;
  const [error, setError] = useState(false);
  useEffect(() => {
    const element = host.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
    catch { setError(true); return; }
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#091525');
    const camera = new THREE.PerspectiveCamera(43, 1, .1, 100);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', 'Interactive 3D proof graph. Drag to rotate, scroll to zoom. Use the step buttons below for keyboard navigation.');
    renderer.domElement.setAttribute('role', 'img');
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; controls.minDistance = 9; controls.maxDistance = 38;
    controls.minPolarAngle = Math.PI / 3; controls.maxPolarAngle = Math.PI * .65;
    controls.minAzimuthAngle = -.65; controls.maxAzimuthAngle = .65;
    const group = new THREE.Group(); scene.add(group);
    scene.add(new THREE.AmbientLight('#b6d7ff', 2));
    const light = new THREE.DirectionalLight('#ffffff', 3); light.position.set(-3, 8, 10); scene.add(light);
    const grid = new THREE.GridHelper(50, 50, '#274260', '#142c43'); grid.position.y = -5.3; scene.add(grid);
    const draw = () => {
      group.children.forEach(child => { if (child.userData.billboard) child.quaternion.copy(camera.quaternion); });
      renderer.render(scene, camera);
    };
    const reset = () => {
      controls.target.set(0, -.1, 0);
      const distance = Math.max(14.5, 15 / camera.aspect);
      camera.position.set(1.5, 2.5, Math.min(distance, 36)); controls.update(); draw();
    };
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); reset();
    };
    controls.addEventListener('change', draw);
    const observer = new ResizeObserver(resize); observer.observe(element);
    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    let down = [0, 0];
    const pointerDown = (event: PointerEvent) => { down = [event.clientX, event.clientY]; };
    const pointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - down[0], event.clientY - down[1]) > 5) return;
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(group.children, true).find(hit => typeof hit.object.userData.step === 'number');
      if (hit) select.current(hit.object.userData.step);
    };
    const contextLost = (event: Event) => { event.preventDefault(); setError(true); };
    renderer.domElement.addEventListener('pointerdown', pointerDown);
    renderer.domElement.addEventListener('pointerup', pointerUp);
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    runtime.current = { group, draw, reset, camera }; resize();
    return () => {
      runtime.current = null; observer.disconnect(); controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointerup', pointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      disposeObjects(scene); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    const state = runtime.current; if (!state) return;
    const { group, draw } = state; disposeObjects(group);
    const graph = graphFor(kind, cursor);
    graph.nodes.forEach(node => {
      const selected = node.step === cursor, completed = node.step < cursor;
      const body = new THREE.Group(); body.position.set(...node.at); body.userData.billboard = true;
      const width = node.width ?? 3.25, height = node.height ?? 1.6;
      const backing = new THREE.Mesh(new THREE.BoxGeometry(width + .1, height + .1, .38), new THREE.MeshStandardMaterial({ color: selected ? (node.color ?? '#73aaff') : '#314b68', roughness: .35, metalness: .25 }));
      const face = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: nodeTexture(node, selected, completed) }));
      face.position.z = .2; face.userData.step = node.step; backing.userData.step = node.step;
      body.add(backing, face); group.add(body);
    });
    graph.edges.forEach(edge => {
      const from = graph.nodes.find(node => node.id === edge.from)!, to = graph.nodes.find(node => node.id === edge.to)!;
      const start = new THREE.Vector3(...from.at), end = new THREE.Vector3(...to.at);
      const horizontal = Math.abs(end.x - start.x) > Math.abs(end.y - start.y);
      if (horizontal) { const direction = Math.sign(end.x - start.x); start.x += direction * ((from.width ?? 3.25) / 2 + .13); end.x -= direction * ((to.width ?? 3.25) / 2 + .2); }
      else { const direction = Math.sign(end.y - start.y); start.y += direction * ((from.height ?? 1.6) / 2 + .1); end.y -= direction * ((to.height ?? 1.6) / 2 + .2); }
      const midpoint = start.clone().lerp(end, .5); midpoint.z -= .5;
      const curve = new THREE.QuadraticBezierCurve3(start, midpoint, end);
      const color = edge.ready ? '#59cbb1' : '#334b66';
      group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 32, edge.ready ? .035 : .02, 8, false), new THREE.MeshBasicMaterial({ color })));
      const arrow = new THREE.Mesh(new THREE.ConeGeometry(.11, .25, 12), new THREE.MeshBasicMaterial({ color }));
      arrow.position.copy(end); arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), curve.getTangent(1).normalize()); group.add(arrow);
    });
    draw();
  }, [kind, cursor]);

  return <section className="scene-panel" aria-label={`${kind === 'erdos' ? 'Erdős 728' : 'Swap facts'} 3D proof graph`}>
    <div className="scene-toolbar"><span><Box size={15}/> 3D PROOF FLOW</span><button onClick={() => runtime.current?.reset()} aria-label="Reset 3D camera"><RotateCcw size={13}/> Reset view</button></div>
    <div className="scene-canvas" ref={host}/>
    {error && <div className="scene-error" role="alert">3D rendering is unavailable. Enable WebGL / graphics acceleration, then reload. The source and step controls remain available.</div>}
    <div className="scene-help"><span>Drag to orbit · Scroll / pinch to zoom · Click a node</span><span><i/> Current step</span></div>
  </section>;
}
