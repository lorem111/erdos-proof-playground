import { useState, type CSSProperties } from 'react';
import { Check, ArrowRight, X, ArrowDown, MoveRight } from 'lucide-react';
import {
  packing,
  packingCases,
  packingUnit,
  denominators,
  windows,
  word,
  sieve,
  edges,
  subsets,
  edgeCount,
  binomialFamily,
  squareFamily,
} from '../lib/arcade/math';
type Props = { id: number; step: number; progress: number; playing: boolean };
const fmt = (n: number | bigint) => n.toLocaleString('en-US');
const delay = (n: number) => ({ '--i': n }) as CSSProperties;
function Tile({
  children,
  tone = '',
  i = 0,
}: {
  children: React.ReactNode;
  tone?: string;
  i?: number;
}) {
  return (
    <span className={`tile pop ${tone}`} style={delay(i)}>
      {children}
    </span>
  );
}
function Caption({ children }: { children: React.ReactNode }) {
  return <div className="scene-caption">{children}</div>;
}
function Outcome({
  children,
  good = true,
}: {
  children: React.ReactNode;
  good?: boolean;
}) {
  return (
    <div className={`outcome pop ${good ? '' : 'negative'}`}>
      <span>{good ? <Check size={18} /> : <X size={18} />}</span>
      {children}
    </div>
  );
}
function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="experiment">
      <span>
        {label}
        <b>{value}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <small>Move it. The example recalculates.</small>
    </label>
  );
}
export default function Scene(props: Props) {
  switch (props.id) {
    case 399:
      return <Witness {...props} />;
    case 493:
      return <Recipe {...props} />;
    case 1193:
      return <Pairs {...props} />;
    case 231:
      return <Scanner {...props} />;
    case 316:
      return <Packing {...props} />;
    case 692:
      return <Sieve {...props} />;
    case 794:
      return <Tickets {...props} />;
    case 397:
      return <Cancellation {...props} />;
    case 363:
      return <Square {...props} />;
    default:
      return <Branches {...props} />;
  }
}
function Witness({ step }: Props) {
  return (
    <div className="scene witness" key={step}>
      <Caption>
        {
          [
            'A witness = one working example',
            'Two arithmetic machines',
            'The second equation wins',
            'All conditions satisfied',
          ][step]
        }
      </Caption>
      <div className="registers">
        {['n', 'x', 'y', 'k'].map((v, i) => (
          <div className="register pop" style={delay(i)} key={v}>
            <small>{v}</small>
            <strong>{[10, 48, 36, 4][i]}</strong>
            <span>{['factorial', 'base', 'base', 'power'][i]}</span>
          </div>
        ))}
      </div>
      {step === 0 ? (
        <div className="exists pop">
          <span>∃</span>
          <ArrowRight />
          <span className="text">
            “There exist…”<small>Here they are.</small>
          </span>
        </div>
      ) : (
        <div className="arithmetic-machine">
          <div className="formula-row pop">
            <span>10!</span>
            <i>1 × 2 × … × 10</i>
            <b>3,628,800</b>
          </div>
          <div className="formula-row pop" style={delay(1)}>
            <span>36⁴</span>
            <i>36 × 36 × 36 × 36</i>
            <b>1,679,616</b>
          </div>
          {step >= 2 && (
            <>
              <div className="merge-arrow">
                <ArrowDown /> add them
              </div>
              <div className="equality pop">
                <b>5,308,416</b>
                <span>=</span>
                <b>48⁴</b>
              </div>
            </>
          )}
        </div>
      )}
      {step === 3 ? (
        <div className="check-strip">
          {['48 × 36 > 1', '4 > 2', '10! + 36⁴ = 48⁴'].map((v, i) => (
            <div className="pop" style={delay(i + 1)} key={v}>
              <Check size={15} />
              {v}
            </div>
          ))}
        </div>
      ) : (
        <div className="scene-foot">ONE WORKING EXAMPLE IS ENOUGH.</div>
      )}
    </div>
  );
}
function Recipe({ step }: Props) {
  const [n, setN] = useState(7);
  return (
    <div className="scene recipe" key={step}>
      <Caption>
        {
          [
            'Give the machine any natural number',
            'The recipe chooses your ingredients',
            'Watch the extra pieces cancel',
            'One recipe, every natural number',
          ][step]
        }
      </Caption>
      <div className="recipe-input">
        <small>YOUR TARGET</small>
        <strong>{n}</strong>
        <ArrowDown />
      </div>
      <div className="ingredient-row">
        <div className="ingredient pop">
          <small>n + 2</small>
          <b>{n + 2}</b>
        </div>
        <span>and</span>
        <div className="ingredient pop" style={delay(1)}>
          <small>2</small>
          <b>2</b>
        </div>
      </div>
      {step >= 2 ? (
        <div className="cancellation-row">
          <div>
            <small>PRODUCT</small>
            <b>{2 * n + 4}</b>
            <span>
              <em>n</em>
              <em className="cross">n</em>
              <em className="cross">4</em>
            </span>
          </div>
          <strong>−</strong>
          <div>
            <small>SUM</small>
            <b>{n + 4}</b>
            <span>
              <em className="cross">n</em>
              <em className="cross">4</em>
            </span>
          </div>
          <strong>=</strong>
          <div className="result">
            <small>LEFT OVER</small>
            <b>{n}</b>
            <span>
              <em>n</em>
            </span>
          </div>
        </div>
      ) : (
        <div className="pipeline-label">
          {step === 0
            ? 'Input a target → build a witness'
            : 'Both ingredients are at least 2.'}
        </div>
      )}
      {step === 3 && (
        <Outcome>ring: the same cancellation works for every n</Outcome>
      )}
      <Slider label="Target n" value={n} min={0} max={20} onChange={setN} />
    </div>
  );
}
function Pairs({ step, progress, playing }: Props) {
  const [n, setN] = useState(6);
  return (
    <div className="scene pairs" key={step}>
      <Caption>
        {
          [
            'Start with every first number',
            'Each one gets exactly one partner',
            'The “all naturals” filter lets everyone through',
            'Count: zero is a row too',
          ][step]
        }
      </Caption>
      <div className="pair-table">
        <div className="pair-head">
          <span>FIRST</span>
          <span>PARTNER</span>
          <span>SUM</span>
          <span>ALLOWED?</span>
        </div>
        {Array.from({ length: n + 1 }, (_, k) => (
          <div
            key={k}
            className={`pair-row pop ${playing && k > Math.floor(progress * (n + 1)) ? 'waiting' : ''}`}
            style={delay(k)}
          >
            <b>{k}</b>
            <span>{step >= 1 ? n - k : '?'}</span>
            <span>{step >= 1 ? `= ${n}` : '—'}</span>
            <span className={step >= 2 ? 'pass' : ''}>
              {step >= 2 ? (
                <>
                  <Check size={14} /> yes
                </>
              ) : (
                '…'
              )}
            </span>
          </div>
        ))}
      </div>
      {step === 3 && (
        <Outcome>
          {n + 1} candidates. {n + 1} survivors. n + 1.
        </Outcome>
      )}
      <Slider label="Target n" value={n} min={2} max={9} onChange={setN} />
    </div>
  );
}
function Scanner({ step, progress, playing }: Props) {
  const [index, setIndex] = useState(18);
  const all = windows();
  const at =
    playing && step >= 2 ? Math.min(55, Math.floor(progress * 56)) : index;
  const w = all[at];
  return (
    <div className="scene scanner" key={step}>
      <Caption>
        {
          [
            'A very carefully chosen word',
            'Same size is not enough: count each symbol',
            'The scanner tries every possible window',
            'No matching halves. The universal claim fails.',
          ][step]
        }
      </Caption>
      <div className="word">
        {word.map((v, i) => (
          <div
            key={i}
            className={`word-cell color-${v} ${step > 0 ? (i >= w.start && i < w.start + w.size ? 'selected' : 'muted') : ''} ${i === w.start + w.size / 2 && step > 0 ? 'split' : ''}`}
          >
            <b>{v}</b>
            <small>{i + 1}</small>
          </div>
        ))}
      </div>
      {step > 0 ? (
        <>
          <div className="bag-compare">
            {[w.a, w.b].map((bag, j) => (
              <div key={j} className="bag">
                <small>{j ? 'RIGHT HALF' : 'LEFT HALF'}</small>
                <div>
                  {bag.map((v, c) => (
                    <div className={`hist color-${c}`} key={c}>
                      <span style={{ height: `${v * 20}px` }} />
                      <b>{v}</b>
                      <small>symbol {c}</small>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <b className="not-equal">≠</b>
          </div>
          <div className="scan-stats">
            <span>
              Window <b>{at + 1} / 56</b>
            </span>
            <span>
              Length <b>{w.size}</b>
            </span>
            <span>
              Matches <b>0</b>
            </span>
          </div>
          <Slider
            label="Inspect window"
            value={at + 1}
            min={1}
            max={56}
            onChange={(v) => setIndex(v - 1)}
          />
        </>
      ) : (
        <div className="big-rule">
          <span>15 tiles</span>
          <MoveRight />
          <span>4 symbols</span>
        </div>
      )}
      {step === 3 && <Outcome>56 windows checked · no abelian square</Outcome>}
    </div>
  );
}
function Packing({ step, progress, playing }: Props) {
  const [mask, setMask] = useState(21);
  const active =
    step === 3 && playing ? Math.min(2047, Math.floor(progress * 2048)) : mask;
  const p = packing(active);
  return (
    <div className="scene packing" key={step}>
      <Caption>
        {
          [
            'The total fits under 2. Is that enough?',
            'Click any fraction to switch bins',
            'Choose the left subset; the right is its complement',
            'An exhaustive check finds zero valid splits',
          ][step]
        }
      </Caption>
      <div className="bins">
        {[p.left, p.right].map((v, j) => (
          <div className={`bin ${v >= packingUnit ? 'overflow' : ''}`} key={j}>
            <div className="bin-title">
              <span>{j ? 'RIGHT · A ∖ B' : 'LEFT · B'}</span>
              <b>{(v / packingUnit).toFixed(4)}</b>
            </div>
            <div className="bin-meter">
              <div
                style={{ width: `${Math.min(100, (v / packingUnit) * 100)}%` }}
              />
              <span>1</span>
            </div>
            <div className="fraction-tokens">
              {denominators.map(
                (d, i) =>
                  Boolean(active & (1 << i)) === !j && (
                    <button
                      key={d}
                      onClick={() => setMask(active ^ (1 << i))}
                      aria-label={`Move 1/${d} to ${j ? 'left' : 'right'} bin`}
                      className="fraction"
                    >
                      <span>1</span>
                      <b>{d}</b>
                    </button>
                  ),
              )}
            </div>
            <small>
              {v >= packingUnit
                ? 'Too full: must be strictly below 1'
                : 'Under 1 ✓'}
            </small>
          </div>
        ))}
      </div>
      <div className="packing-total">
        Total <b>{((p.left + p.right) / packingUnit).toFixed(4)} &lt; 2</b>
        <span>Display rounded · checks are exact</span>
      </div>
      {step === 3 ? (
        <>
          <div className="binary-ribbon">
            {Array.from({ length: 64 }, (_, i) => (
              <span
                className={i <= Math.floor(active / 32) ? 'tested' : ''}
                key={i}
              />
            ))}
          </div>
          <Outcome good={false}>
            All 2,048 assignments checked ·{' '}
            {packingCases.filter((p) => p.valid).length} valid
          </Outcome>
        </>
      ) : (
        <div className="scene-foot">
          EVERY TOKEN MUST GO SOMEWHERE. NO SPLITTING TOKENS.
        </div>
      )}
    </div>
  );
}
function Sieve({ step }: Props) {
  const [m, setM] = useState(6);
  const data = sieve(m);
  return (
    <div className="scene sieve" key={step}>
      <Caption>
        {
          [
            'Exactly one divisor opens the gate',
            'The pattern repeats after one full period',
            'Three filters. Three exact fractions.',
            'Down, then up: a counterexample',
          ][step]
        }
      </Caption>
      <div className="filter-controls">
        {[6, 7, 8].map((v) => (
          <button key={v} onClick={() => setM(v)} aria-pressed={v === m}>
            m = {v}
          </button>
        ))}
        <span>divisors: {data.divisors.join(', ')}</span>
      </div>
      <div className={`sieve-grid ${data.period > 60 ? 'dense' : ''}`}>
        {data.counts.map((n, i) => (
          <span
            key={`${m}-${i}`}
            title={`${i + 1}: ${n} matching divisors`}
            className={`${n === 1 ? 'hit' : n > 1 ? 'double' : ''} pop`}
            style={delay(Math.floor(i / 12))}
          >
            {data.period <= 60 ? i + 1 : ''}
          </span>
        ))}
      </div>
      <div className="legend">
        <span>
          <i className="hit" /> exactly one
        </span>
        <span>
          <i className="double" /> two or more
        </span>
        <span>
          <i /> none
        </span>
      </div>
      {step >= 2 ? (
        <div className="proportion-bars">
          {[6, 7, 8].map((v) => {
            const d = sieve(v);
            return (
              <div key={v} className={v === 7 ? 'dip' : ''}>
                <span>m = {v}</span>
                <div style={{ width: `${(d.hits / d.period) * 210}%` }} />
                <b>{d.fraction}</b>
              </div>
            );
          })}
          <small>Bar lengths start at zero.</small>
        </div>
      ) : (
        <div className="count-result">
          <strong>{data.hits}</strong>
          <span>accepted out of</span>
          <strong>{data.period}</strong>
        </div>
      )}
      {step === 3 && <Outcome>1/3 is below both neighbors</Outcome>}
    </div>
  );
}
function Tickets({ step, progress, playing }: Props) {
  const [k, setK] = useState(4);
  const [index, setIndex] = useState(0);
  const sets = subsets(k);
  const at =
    playing && step >= 2 ? Math.min(125, Math.floor(progress * 126)) : index;
  const chosen = sets[at];
  const count = edgeCount(chosen);
  return (
    <div className="scene tickets" key={step}>
      <Caption>
        {
          [
            'Choose one label from each group',
            'Add the one-group ticket',
            'Which tickets survive inside this selection?',
            'Every small selection misses its target',
          ][step]
        }
      </Caption>
      <div className="ticket-groups">
        {[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ].map((g, j) => (
          <div key={j}>
            <small>GROUP {j + 1}</small>
            <div>
              {g.map((v) => (
                <Tile
                  key={v}
                  tone={`color-${j} ${step >= 2 && !chosen.includes(v) ? 'muted' : ''}`}
                >
                  {v}
                </Tile>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="ticket-wall">
        {edges.slice(0, step === 0 ? 27 : 28).map((e, i) => (
          <span
            className={`ticket pop ${i === 27 ? 'extra' : ''} ${step >= 2 && !e.every((v) => chosen.includes(v)) ? 'muted' : ''}`}
            style={delay(Math.floor(i / 3))}
            key={i}
          >
            {e.join('·')}
          </span>
        ))}
      </div>
      {step >= 2 ? (
        <>
          <div className="filter-controls">
            {[4, 5].map((v) => (
              <button
                key={v}
                aria-pressed={k === v}
                onClick={() => {
                  setK(v);
                  setIndex(0);
                }}
              >
                {v} labels
              </button>
            ))}
            <span>
              Inside: <b>{count}</b> / target {k === 4 ? 3 : 7}
            </span>
          </div>
          <Slider
            label="Inspect selection"
            value={at + 1}
            min={1}
            max={126}
            onChange={(v) => setIndex(v - 1)}
          />
        </>
      ) : (
        <div className="big-rule">
          <b>{step === 0 ? '27' : '28'}</b>
          <span>
            {step === 0
              ? 'ordinary tickets'
              : 'tickets = 27 ordinary + 1 extra'}
          </span>
        </div>
      )}
      {step === 3 && (
        <Outcome>Best possible: 2 with four labels, 4 with five</Outcome>
      )}
    </div>
  );
}
function Cancellation({ step }: Props) {
  const [a, setA] = useState(2);
  const f = binomialFamily(a);
  const factors = ['a+1', '2', '4a+3', '4a+1', '2a+1', '2a+1'];
  return (
    <div className="scene cancellation" key={step}>
      <Caption>
        {
          [
            'A recipe for two different teams',
            'Break giant ratios into small factors',
            'Matching factors disappear in pairs',
            'Change the seed. Get a new equality.',
          ][step]
        }
      </Caption>
      <div className="teams">
        {[f.left, f.right].map((list, j) => (
          <div key={j}>
            <small>{j ? 'RIGHT INPUTS' : 'LEFT INPUTS'}</small>
            <div>
              {list.map((v) => (
                <Tile key={v} tone={j ? 'blue' : 'green'}>
                  {v}
                </Tile>
              ))}
            </div>
          </div>
        ))}
      </div>
      {step === 0 ? (
        <div className="central-note">
          B(t) = ways to choose t objects from 2t objects
        </div>
      ) : (
        <div className={`factor-fraction ${step >= 2 ? 'cancelled' : ''}`}>
          <div>
            {factors.map((v, i) => (
              <span key={i} style={delay(i)}>
                {v}
              </span>
            ))}
          </div>
          <hr />
          <div>
            {['2', '2a+1', 'a+1', '2a+1', '4a+1', '4a+3'].map((v, i) => (
              <span key={i} style={delay(factors.indexOf(v))}>
                {v}
              </span>
            ))}
          </div>
          {step >= 2 && <b className="ratio-one pop">= 1</b>}
        </div>
      )}
      <div className="exact-equality">
        <Check size={16} />
        <span>{f.l.toString().length}-digit products match exactly</span>
        <details>
          <summary>See the integer</summary>
          <code>{f.l.toString()}</code>
        </details>
      </div>
      {step === 3 && (
        <Outcome>First entry = a. Different a, different solution.</Outcome>
      )}
      <Slider label="Seed a" value={a} min={2} max={6} onChange={setA} />
    </div>
  );
}
function Square({ step }: Props) {
  const [n, setN] = useState(2);
  const f = squareFamily(n);
  return (
    <div className="scene square" key={step}>
      <Caption>
        {
          [
            'Four disjoint blocks of four',
            'Sixteen ingredients become one product',
            'Every prime has a partner',
            'An endless supply of square products',
          ][step]
        }
      </Caption>
      <div className="number-blocks">
        {f.values.map((block, i) => (
          <div key={i}>
            <small>BLOCK {i + 1}</small>
            <div>
              {block.map((v) => (
                <Tile key={v} i={i} tone={`color-${i}`}>
                  {v}
                </Tile>
              ))}
            </div>
          </div>
        ))}
      </div>
      {step >= 2 ? (
        <div className="prime-pairs">
          {f.factors.map(([p, e], i) => (
            <div className="prime-pair pop" key={p} style={delay(i)}>
              <span>
                {p}
                <sup>{e / 2}</sup>
              </span>
              <span>
                {p}
                <sup>{e / 2}</sup>
              </span>
              <small>{e} copies → two equal halves</small>
            </div>
          ))}
        </div>
      ) : (
        <div className="product-number">
          <small>
            {step ? 'MULTIPLY ALL 16' : 'NO OVERLAP · FOUR NUMBERS EACH'}
          </small>
          {step > 0 && <strong>{fmt(f.product)}</strong>}
        </div>
      )}
      {step >= 2 && (
        <div className="square-result">
          <small>EXACT SQUARE ROOT</small>
          <b>{fmt(f.root)}</b>
          <span>× itself = the entire product</span>
        </div>
      )}
      {step === 3 && (
        <Outcome>Every n &gt; 1 gives a distinct valid collection</Outcome>
      )}
      <Slider label="Seed n" value={n} min={2} max={8} onChange={setN} />
    </div>
  );
}
function Branches({ step }: Props) {
  const [colors, setColors] = useState([true, true, false]);
  const normalized = colors.map((c) => (colors[0] ? c : !c));
  const branch = normalized[1] ? (normalized[2] ? 'easy' : 'two') : 'one';
  return (
    <div className="scene branches" key={step}>
      <Caption>
        {
          [
            'Click to recolor the first three test positions',
            'Three routes cover all colorings',
            'A hard route: one seed forces more colors',
            'There is no exit without a triple',
          ][step]
        }
      </Caption>
      <div className="color-controls">
        {[1, 3, 5].map((v, i) => (
          <button
            key={v}
            aria-label={`Toggle color at ${v}`}
            aria-pressed={colors[i]}
            className={`color-${colors[i] ? 0 : 1}`}
            onClick={() => setColors(colors.map((c, j) => (i === j ? !c : c)))}
          >
            {v}
            <small>{colors[i] ? 'A' : 'B'}</small>
          </button>
        ))}
      </div>
      {step === 0 ? (
        <div className="gap-diagram">
          <span>1</span>
          <b>+2 →</b>
          <span>3</span>
          <b>+2 →</b>
          <span>5</span>
          <small>gap 2 &gt; start 1</small>
        </div>
      ) : (
        <>
          <div className="normalize">
            {colors[0] ? 'Keep color names' : 'Swap A ↔ B everywhere'}
            <ArrowDown size={20} />
          </div>
          <div className="branch-tree">
            {[
              ['easy', '1, 3, 5 match', 'Use x=1, d=2'],
              ['one', '1 and 3 differ', 'Propagate by +1'],
              ['two', '1, 3 match; 5 differs', 'Propagate by +2'],
            ].map(([key, title, sub]) => (
              <div className={branch === key ? 'active' : ''} key={key}>
                <b>{title}</b>
                <small>{sub}</small>
              </div>
            ))}
          </div>
          {step >= 2 &&
            (branch === 'easy' ? (
              <Outcome>1, 3, 5 already form the required triple</Outcome>
            ) : (
              <div className="forced-chain">
                <small>
                  ASSUME NO TRIPLE · {branch === 'one' ? 'n ≥ 6' : 'n ≥ 9'}
                </small>
                <div>
                  {[
                    'n',
                    branch === 'one' ? 'n+1' : 'n+2',
                    '…',
                    '3n',
                    '…',
                    '5n',
                  ].map((v, i) => (
                    <span className="pop" style={delay(i)} key={i}>
                      {v}
                    </span>
                  ))}
                </div>
                <p>
                  Later seed exists → induction forces a same-color chain.
                  <br />
                  No later seed → everything in the tail has the other color.
                </p>
              </div>
            ))}
        </>
      )}
      {step === 3 && (
        <Outcome>Both hard cases produce a triple too. Contradiction.</Outcome>
      )}
    </div>
  );
}
