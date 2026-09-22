#!/usr/bin/env node
/**
 * How much reading is in a lesson — the metric the tightening pass is judged on.
 *
 * Line count is not it: a table row and a paragraph can be squeezed onto one
 * line, or a long paragraph broken into five, without a single word of the
 * lesson changing. What a student actually pays for is words, and the rule the
 * pass serves ("a concept gets explained at most twice, say it once and move on")
 * is about how many of them are spent saying the same thing again.
 *
 * So this counts the prose a student reads on the built page: the generated
 * markup of the walkthrough and the decompose spec is included (it is authored
 * content too), while <pre> code, the <head>, the two navs and the h1 are not —
 * code is typed rather than read, and the rest is page chrome.
 *
 *   node scripts/lesson-load.mjs                # every converted lesson vs HEAD
 *   node scripts/lesson-load.mjs 1.6 3.3 4.4    # just these
 *   node scripts/lesson-load.mjs --all          # all 81, not only converted ones
 *   node scripts/lesson-load.mjs --src 1.6      # measure the SOURCE — needs no build
 *
 * Run the default mode after `npm run build`. Anything it reports as unchanged is
 * a lesson the pass did not reach.
 *
 * `--src` measures the authored file instead of the built page: the `//` header
 * comments, the `code:` sample lines and the `finalFile` block come out, and what
 * is left is the prose a teacher wrote. It runs without a build, so a writer can
 * watch it move while working — use the built number for the record and this one
 * for the loop.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const dist = path.resolve('dist/lessons');
const srcDir = path.resolve('src/pages/lessons');
const args = process.argv.slice(2);
const all = args.includes('--all');
const fromSrc = args.includes('--src');
const wanted = args.filter((a) => !a.startsWith('--'));

const prose = (html) => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<head[\s\S]*?<\/head>/g, ' ')
  .replace(/<nav[\s\S]*?<\/nav>/g, ' ')
  .replace(/<pre[\s\S]*?<\/pre>/g, ' ')
  .replace(/<h1[\s\S]*?<\/h1>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#?\w+;/g, ' ')
  .split(/\s+/).filter((w) => w.length > 1);

// The authored body: drop the C# the student types, keep every word they read.
const source = (src) => prose(src
  .replace(/^\s*\/\/.*$/gm, ' ')
  .replace(/finalFile: `[\s\S]*?`,/g, ' ')
  .replace(/code: '(?:[^'\\]|\\.)*'/g, ' '));

const read = (id) => fromSrc ? fs.readFileSync(path.join(srcDir, id + '.astro'), 'utf8')
  : fs.readFileSync(path.join(dist, id + '.html'), 'utf8');
const measure = (what) => fromSrc ? source(what) : prose(what);
const atHead = (id) => {
  const p = fromSrc ? 'src/pages/lessons/' + id + '.astro' : 'dist/lessons/' + id + '.html';
  const r = spawnSync('git', ['show', 'HEAD:' + p], { encoding: 'utf8' });
  return r.status === 0 ? r.stdout : null;
};

// "Converted" is read off the page (or off the walkthrough spec in --src mode):
// the pass gives every lesson it touches both halves, so the label is the honest
// membership test.
const ids = (wanted.length ? wanted : fs.readdirSync(dist)
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace('.html', ''))
  .filter((id) => all || read(id).includes(fromSrc ? "label: 'In the Code'" : 'activity-label">In the Code<')))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let was = 0, now = 0;
console.log('lesson   ' + (fromSrc ? 'authored' : 'prose   ') + ' words HEAD -> now      cut');
for (const id of ids) {
  const w2 = measure(read(id));
  const head = atHead(id);
  const w1 = head === null ? null : measure(head);
  const cut = w1 === null ? '   new' : String(w2.length - w1.length).padStart(6);
  if (w1 !== null) { was += w1.length; now += w2.length; }
  console.log(id.padEnd(8) + String(w1 === null ? '-' : w1.length).padStart(6) + ' -> ' + String(w2.length).padEnd(6) +
    cut.padStart(9) + (w1 !== null && w2.length > w1.length ? '   <-- GREW' : ''));
}
if (was) {
  console.log('\ntotal: ' + was + ' -> ' + now + ' words (' + Math.round((now / was - 1) * 100) + '%)');
}
