import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../study.js', import.meta.url), 'utf8');

test('300 consecutive phrases with 900 examples in 30 categories', () => {
  const ids = [...html.matchAll(/<article class="card" id="p(\d{3})"/g)].map(m => m[1]);
  assert.equal(ids.length, 300);
  assert.deepEqual(ids, Array.from({length: 300}, (_, i) => String(i + 1).padStart(3, '0')));
  assert.equal([...html.matchAll(/<div class="example">/g)].length, 900);
  assert.equal([...html.matchAll(/<section class="category" data-category="/g)].length, 30);
  assert.equal([...html.matchAll(/<span class="priority-badge">優先表現<\/span>/g)].length, 30);
});

test('optional study assets are loaded from the repository', () => {
  assert.match(html, /href="\.\/study\.css"/);
  assert.match(html, /src="\.\/study\.js"/);
  assert.match(js, /localStorage\.setItem/);
  assert.match(js, /SpeechSynthesisUtterance/);
});
