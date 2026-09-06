export type Point = { x: number; y: number; label: string };
export const examples = [
  { id: 'square', name: 'Square', note: 'Start here · lots of matching lengths', coords: [[-2,-2],[2,-2],[2,2],[-2,2]] },
  { id: 'rectangle', name: 'Rectangle', note: 'Stretch the square. What changes?', coords: [[-3,-2],[3,-2],[3,2],[-3,2]] },
  { id: 'pentagon', name: 'Pentagon', note: 'Five dots · learn what “round down” means', coords: [[-2,-2],[2,-2],[3,1],[0,3],[-3,1]] },
  { id: 'hexagon', name: 'Hexagon', note: 'Six dots · fifteen pairs to investigate', coords: [[-2,0],[-1,-2],[1,-2],[2,0],[1,2],[-1,2]] },
];
export type Pair = { a: Point; b: Point; dx: number; dy: number; squared: number; group: number };
export type Step = { kind: 'setup' | 'convex' | 'target' | 'pick' | 'measure' | 'group' | 'finish'; pairIndex?: number; vertex?: number };
export function makeExperiment(id: string) {
  const example = examples.find(e => e.id === id) ?? examples[0];
  const points = example.coords.map(([x,y],i) => ({x,y,label:String.fromCharCode(65+i)}));
  const groups: number[] = [];
  const pairs: Pair[] = [];
  for(let i=0;i<points.length;i++) for(let j=i+1;j<points.length;j++) {
    const a=points[i], b=points[j], dx=b.x-a.x, dy=b.y-a.y, squared=dx*dx+dy*dy;
    if(!groups.includes(squared)) groups.push(squared);
    pairs.push({a,b,dx,dy,squared,group:groups.indexOf(squared)});
  }
  const turns = points.map((b,i) => {
    const a=points[(i+points.length-1)%points.length], c=points[(i+1)%points.length];
    return (b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x);
  });
  // All presets are simple polygons given in boundary order.
  const convex = turns.every(t=>t>0) || turns.every(t=>t<0);
  const steps: Step[] = [{kind:'setup'}, ...points.map((_,vertex):Step=>({kind:'convex',vertex})), {kind:'target'}];
  pairs.forEach((_,pairIndex)=> steps.push({kind:'pick',pairIndex},{kind:'measure',pairIndex},{kind:'group',pairIndex}));
  steps.push({kind:'finish'});
  return {example,points,pairs,groups,turns,convex,steps,target:Math.floor(points.length/2)};
}
export function lengthLabel(squared: number) { return Number.isInteger(Math.sqrt(squared)) ? String(Math.sqrt(squared)) : `√${squared}`; }
export function recordedCount(step: Step, total: number) {
  return step.kind==='finish' ? total : step.pairIndex===undefined ? 0 : step.pairIndex+(step.kind==='group'?1:0);
}
