export type ProofStep = {
  id: string;
  line: number;
  label: string;
  code: string;
  explanation: string;
  goalCount: number;
  solved: ('A' | 'B')[];
};
export const steps: ProofStep[] = [
  { id: 'goal', line: 1, label: 'The goal', code: 'B ∧ A', explanation: 'We have A and B. Prove the same two facts in the other order.', goalCount: 1, solved: [] },
  { id: 'split', line: 2, label: 'Make two slots', code: 'constructor', explanation: 'To prove “B AND A”, prove B and then prove A. Two smaller jobs.', goalCount: 2, solved: [] },
  { id: 'use-b', line: 3, label: 'Fill B', code: 'exact h.right', explanation: 'h.right takes B from our given facts. It exactly matches the first slot.', goalCount: 1, solved: ['B'] },
  { id: 'use-a', line: 4, label: 'Fill A', code: 'exact h.left', explanation: 'h.left takes A. The second slot is filled. Nothing left to prove.', goalCount: 0, solved: ['B', 'A'] },
];
export function stepForLine(line: number) {
  const index = steps.findIndex(step => step.line === line);
  return index < 0 ? null : index;
}
