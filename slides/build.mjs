import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { minitype, mdString, image, p, h1, h2, physical, pt, em, fill, hexToRgb, solid, newpage, vspace } from '@minitype/minitype';

const dir = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(dir, '../output/pdf/networking-lab-overview.pdf');
const source = await fs.readFile(path.join(dir, 'overview.md'), 'utf8');
const slides = source.trim().split(/\r?\n---\r?\n/);
assert(slides.length > 0 && slides.every(s => /^# .+/m.test(s)), 'Each slide needs a title');
const regular = 'SourceHanSansJP-Regular';
const bold = 'SourceHanSansJP-Bold';
const ink = hexToRgb('#183047');
const accent = hexToRgb('#006B73');
const body = [];
for (const [index, slide] of slides.entries()) {
  if (index) body.push(newpage());
  const blocks = mdString(slide.trim(), {
    h1: text => ({ ...h1([text]), unnumbered: true }),
    h2: text => ({ ...h2([text]), unnumbered: true }),
    image: (src) => image(path.resolve(dir, src), { width: src.endsWith('-explanation.png') ? 270 : 298, align: 'center' }),
  }).blocks;
  for (const block of blocks) {
    if (block.type === 'table' && block.rows[0].length === 2) {
      block.style = { ...block.style, columnWidths: [100, 198.6667] };
    }
  }
  if (index === 0) body.push(vspace(20));
  body.push(...blocks);
  body.push({ type: 'flow', position: 'nombre', blockOffset: 6, page: index,
    blocks: [p(`${index + 1} / ${slides.length}`, { font: regular, size: pt(12), align: 'right', effects: [fill(ink)] })] });
}
const textStyle = { font: regular, size: pt(25), lineHeight: em(1.5), align: 'left', firstIndent: 0, effects: [fill(ink)] };
const document = minitype([{ body }], {
  size: { width: 338.6667, height: 190.5 },
  padding: physical(17, 20, 20, 20),
  block: {
    paragraph: textStyle,
    h1: { ...textStyle, font: bold, size: pt(36), lineHeight: em(1.25), effects: [fill(accent)] },
    h2: { ...textStyle, font: bold, size: pt(25), lineHeight: em(1.3) },
    li1: { ...textStyle, size: pt(23), lineHeight: em(1.45) },
    table: {
      cellPadding: physical(3, 4),
      verticalBorders: solid(0, ink),
      horizontalBorders: solid(0.2, hexToRgb('#CAD7DE')),
      textStyle: row => ({ ...textStyle, size: pt(21), lineHeight: em(1.3), font: row === 0 ? bold : regular }),
      background: row => row === 0 ? hexToRgb('#EAF3F4') : undefined,
    },
  },
  command: { b: { font: bold }, c: { font: regular, effects: [fill(accent)] } },
  gaps: [['h1', 'fallback', 11], ['h2', 'paragraph', 3], ['paragraph', 'h2', 7], ['li1', 'li1', 4], ['fallback', 'fallback', 6]],
}, {
  fontDir: path.join(dir, 'node_modules/@minitype/minitype/fonts'),
  metadata: { title: '3B情2 ネットワーク構築：概要説明', author: '嶋 直樹' },
});
// One slide must fit on one page; fail before replacing a previous PDF.
assert.equal(await document.getPageCount(), slides.length, 'A slide overflowed onto another page');
assert.deepEqual(await document.getDiagnostics(), [], 'Typesetting diagnostics');
await fs.mkdir(path.dirname(output), { recursive: true });
await document.save(output);
console.log(`${slides.length} slides: ${output}`);
