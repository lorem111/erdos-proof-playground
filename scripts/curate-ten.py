"""Copy ten pinned upstream proofs and preserve provenance. Usage: curate-ten.py CHECKOUT"""
from pathlib import Path
import shutil, json, hashlib, subprocess, sys
root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path('../erdos-proof-library').resolve()
commit = 'f06c4076c5352252d1dbab91ae3afa28037f466c'
if subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD'],text=True).strip() != commit:
    raise SystemExit('Expected pinned upstream commit ' + commit)
app = Path(__file__).resolve().parents[1]
meta = []
for n in [399,493,1193,231,316,692,794,397,363,645]:
    paths = [Path(f'ErdosProblems/Erdos{n}.lean')]
    if n == 231: paths.append(Path('ErdosProblems/Erdos231/Proof.lean'))
    files = []
    for path in paths:
        src = root / 'src/latest' / path
        dest = app / 'public/proofs' / path
        dest.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(src,dest)
        files.append({'path':str(path),'text':src.read_text(),'sha256':hashlib.sha256(src.read_bytes()).hexdigest()})
    meta.append({'id':n,'files':files,'upstreamCommit':commit})
    shutil.copy2(root/f'ErdosProblems/Erdos{n}.md',app/'public/proofs'/f'Erdos{n}.md')
for target in ['lib/arcade/sources.json','public/proofs/manifest.json']:
    (app/target).write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
shutil.copy2(root/'src/latest/LICENSE',app/'public/proofs/UPSTREAM-LICENSE')
