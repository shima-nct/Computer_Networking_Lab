"""Export the current minitype PDF to the existing GitHub Pages docs directory."""
import json
import re
import shutil
from pathlib import Path

import fitz  # PyMuPDF

root = Path(__file__).resolve().parent
pdf = root.parent / 'output/pdf/networking-lab-overview.pdf'
dest = root.parent / 'docs/slides'
source = re.split(r'\n---\n', (root / 'overview.md').read_text(encoding='utf-8').strip())
template = (root / 'viewer.html').read_text(encoding='utf-8')
assert template.count('/* SLIDES */') == 1
with fitz.open(pdf) as document:
    assert len(document) == len(source), 'PDF and slide source page counts differ'
    descriptions = []
    dest.mkdir(parents=True, exist_ok=True)
    for number, page in enumerate(document, 1):
        alt = re.findall(r'!\[([^\]]*)\]', source[number - 1])
        descriptions.append(page.get_text().strip() + '\n' + '\n'.join(alt))
        page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False).save(dest / f'page-{number:02d}.png')
    assert all((dest / f'page-{n:02d}.png').is_file() for n in range(1, len(document) + 1))
data = json.dumps(descriptions, ensure_ascii=False).replace('<', '\\u003c')
(dest / 'index.html').write_text(template.replace('/* SLIDES */', data), encoding='utf-8', newline='\n')
shutil.copyfile(pdf, dest / pdf.name)
print(f'Exported {len(source)} slides to {dest}')
