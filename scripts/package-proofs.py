"""Bundle the ten original proofs, dependency pins, notices and verification report."""
from pathlib import Path
import zipfile
root=Path(__file__).resolve().parents[1]
with zipfile.ZipFile(root/'public/proofs/ten-erdos-proofs.zip','w',zipfile.ZIP_DEFLATED) as archive:
    for file in sorted((root/'public/proofs').rglob('*')):
        if file.is_file() and file.suffix != '.zip':
            archive.write(file,Path('ten-erdos-proofs')/file.relative_to(root/'public/proofs'))
    for name in ['lakefile.toml','lake-manifest.json','lean-toolchain']:
        archive.write(root/'verification'/name,Path('ten-erdos-proofs')/name)
    archive.writestr('ten-erdos-proofs/README.txt', 'Ten pinned Erdos proofs from plby/lean-proofs. Original author/license notices are preserved.\n\nWith elan installed, run `lake exe cache get` then `lake build ErdosProblems.Erdos399` (replace 399 with another included number). For memory-constrained computers, build one proof at a time.\n\nSee manifest.json for source hashes and verification.json for actual local Lean compiler output.\nWalkthrough: https://erdos-proof-playground.vercel.app/\nRepository: https://github.com/lorem111/erdos-proof-playground\n')
