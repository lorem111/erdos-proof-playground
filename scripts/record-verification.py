"""Produce a public report from completed, local Lake runs. No inference from source comments."""
from pathlib import Path
from datetime import datetime, timezone
import json, sys, re, hashlib
root = Path(sys.argv[1])
app = Path(__file__).resolve().parents[1]
manifest = json.loads((app/'public/proofs/manifest.json').read_text())
by_id = {}
for name in ['results.json','supplement-results.json','extra-results.json']:
    path = root/name
    if path.exists():
        for row in json.loads(path.read_text()):
            if row['id'] not in by_id or row['exitCode'] == 0:
                by_id[row['id']] = row
entries = []
for proof in manifest:
    n = proof['id']
    result = by_id.get(n)
    for file in proof['files']:
        expected = file['sha256']
        actual = hashlib.sha256((root/file['path']).read_bytes()).hexdigest()
        if expected != actual: raise SystemExit(f'Source changed: {file["path"]}')
    entry = {'id':n,'status':'not_yet_checked','command':f'lake build ErdosProblems.Erdos{n}'}
    if result:
        output = result['output'].replace(str(root),'<verification>')
        entry.update(status='passed' if result['exitCode']==0 else 'failed', exitCode=result['exitCode'], seconds=result['seconds'], output=output)
        ax = re.findall(r"'([^']+)' depends on axioms: \[([^\]]*)\]",output)
        entry['axiomReports'] = [{'theorem':name,'axioms':[a.strip() for a in value.split(',') if a.strip()]} for name,value in ax]
        if result['exitCode']==0 and (not ax or any('sorryAx' in a['axioms'] for a in entry['axiomReports'])):
            raise SystemExit(f'Missing or unsafe axiom report for {n}')
    entries.append(entry)
report = {'status':'passed' if all(e['status']=='passed' for e in entries) else 'in_progress', 'checkedAt':datetime.now(timezone.utc).isoformat(), 'upstream':'https://github.com/plby/lean-proofs', 'upstreamCommit':manifest[0]['upstreamCommit'], 'lean':'4.33.0', 'mathlibCommit':'db584cd6d46c92f209a44c0f1c829460d327499d', 'method':'Lake compiled the original, hash-checked source files with the pinned dependencies. Successful cached targets may be replayed. Axiom reports are actual compiler output, not source comments.', 'browser':'Interactive examples are separately implemented and tested in JavaScript. This site does not execute Lean in the browser.', 'entries':entries}
(app/'public/proofs/verification.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
print(report['status'],sum(e['status']=='passed' for e in entries),'/ 10')
