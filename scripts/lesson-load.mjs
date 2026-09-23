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
const split = args.includes('--split');
const wanted = args.filter((a) => !a.startsWith('--'));

const prose = (html) => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<head[\s\S]*?<\/head>/g, ' ')
  .replace(/<nav[\s\S]*?<\/nav>/g, ' ')
  // A drawn editor pane (src/lib/panes.ts) is a picture: the words inside the
  // <svg> are Unity's row labels — "Is Trigger", "Gravity Scale" — which a
  // student reads in the pane itself, not sentences the author wrote. They come
  // out with the code blocks. The <figcaption> is the author's one line and it
  // counts, the same way a walkthrough's `lead` counts.
  .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<pre[\s\S]*?<\/pre>/g, ' ')
  .replace(/<h1[\s\S]*?<\/h1>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#?\w+;/g, ' ')
  .split(/\s+/).filter((w) => w.length > 1);

// The authored body: drop the C# the student types, keep every word they read.
// Order matters: the code strings and the finished file are removed BEFORE the
// comment strip, because `//`-line removal does not know it is inside a template
// literal. A `finalFile` whose last line is a comment had its closing backtick
// eaten by the comment strip, the `finalFile` pattern then never matched, and the
// whole C# file — comments included — was billed to the author's prose. Six
// lessons were carrying a whole file in their body count for this reason.
//
// The <pre> strip is the same bug one level down, and it was the last one still
// loose: a code block whose final line is a comment ending in `</code></pre>`
// ("// (0.192, 0.302, 0.475) as floats → ... #314D79</code></pre>") lost its
// closing tags to the comment strip, so the block never counted as a block. Ten
// lessons had that shape, six of them converted, and the damage ran both ways:
// the unclosed `<pre>` made prose()'s non-greedy match swallow real prose (9.2
// read 645 for a body of 1,014) or leave code comments counted as prose (8.5 read
// 1,998 for 1,936 — "// cuts power magnets." was billed to the author). Stripping
// <pre> here, on the authored tags and before the comment strip, removes the whole
// class and matches what prose() already does to the built page.
//
// One shape did bite, and it is why the header and the body are stripped as two
// strings rather than one. A `//` header comment that names the tag (`<pre>`) used
// to match, lazily, the first `</pre>` far down in the body — deleting every word
// between them from the count. 9.7 read 149 for a body of 1,705 and 10.2b read
// NEGATIVE 545. The subagent that hit it did the right thing for the wrong reason:
// it reworded its own header notes to say "a code block" instead of naming the tag,
// so the metric would behave. That is a writer changing true prose to satisfy a
// measurement, which is the one thing this file must never cause. Splitting the two
// regions kills the interaction at the root — a comment can no longer reach into
// the body — so authors can name the tag in a note without costing themselves a
// count, and the header/body boundary is the same one the site itself uses.
// An editor pane (src/lib/panes.ts). A pane's rows are Unity's labels — "Is
// Trigger", "Gravity Scale", "Body Type" — which is the same kind of name as a
// code block's, and billing them to the author would tax every lesson that gains
// a figure. The figcaption is the author's own line and counts, so the call is
// replaced by the caption's literals rather than by nothing, and the src count
// keeps matching the built page (where prose() drops the <svg> and keeps the
// caption).
//
// It is found by balancing brackets, not by a regex: a pane spec is an object
// inside a call inside a template literal, and its rows nest further. The
// scanner walks the call's own delimiters, skipping over string literals so a
// brace inside a label cannot end it early.
const stripPanes = (src) => {
  const CALL = '${renderPane(';
  let out = '', i = 0;
  for (;;) {
    const at = src.indexOf(CALL, i);
    if (at < 0) return out + src.slice(i);
    out += src.slice(i, at);
    let depth = 0, q = '';
    let j = at + CALL.length - 1;                       // sitting on the '('
    for (; j < src.length; j++) {
      const c = src[j];
      if (q) { if (c === '\\') j++; else if (c === q) q = ''; continue; }
      if (c === "'" || c === '"' || c === '`') { q = c; continue; }
      if (c === '(' || c === '{' || c === '[') depth++;
      else if (c === ')' || c === '}' || c === ']') { depth--; if (!depth) break; }
    }
    const cap = src.slice(at, j + 1).match(/caption:\s*([\s\S]*?),\s*rows:/);
    out += ' ' + (cap ? cap[1].replace(/\\'/g, '’').replace(/['"+]/g, ' ') : ' ') + ' ';
    i = j + 1;
  }
};
const STRIP = (s) => stripPanes(s)
  .replace(/finalFile: `[\s\S]*?`,/g, ' ')
  .replace(/code: '(?:[^'\\]|\\.)*'/g, ' ')
  .replace(/<pre[\s\S]*?<\/pre>/g, ' ')
  .replace(/^\s*\/\/.*$/gm, ' ');
const source = (src) => {
  const i = src.indexOf('const body =');
  return i < 0 ? prose(STRIP(src)) : prose(STRIP(src.slice(0, i)) + ' ' + STRIP(src.slice(i)));
};

// The split. A lesson's prose is two different quantities wearing one number:
// the author's own words, and the walkthrough's annotation, which is one
// annotation per code line and so is set by the file the lesson walks through
// and by the ladder level (a level-1 lesson withholds no line, a level-3 lesson
// renders no walkthrough at all). The ceiling governs the first; the second is
// bounded by the ladder and read for repeats by verify check 13. Counting them
// together flagged lessons whose annotation was the teaching, which is how a
// metric talks a writer into deleting the thing the lesson exists to say.
// A spec field's value is often several literals concatenated across lines
// (`'...' +` / `'...'`), which is how a long `why` stays readable in the source.
// So the field name is the anchor and the literals after it are walked as a
// chain: take the first, then keep going while a `+` joins the next. Reading
// only the first literal counted the rest of a wrapped value as body, which made
// the metric depend on how the author happened to break the line — the one thing
// a word count must never measure. (It was found the honest way: 8.5's decompose
// spec read as 144 body words it had never written.)
const SPEC_HEAD = /\b(what|why|hint|doc|lead|intro|does|big|sizeTest)\s*:\s*/g;
const LITERAL = /^(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)/;
const specWords = (src) => {
  let n = 0;
  for (const m of src.matchAll(SPEC_HEAD)) {
    let i = m.index + m[0].length;
    for (;;) {
      const lit = src.slice(i).match(LITERAL);
      if (!lit) break;
      n += prose(lit[1] ?? lit[2] ?? lit[3] ?? '').length;
      i += lit[0].length;
      const plus = src.slice(i).match(/^\s*\+\s*/);
      if (!plus) break;
      i += plus[0].length;
    }
  }
  return n;
};

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
if (split) {
  console.log('lesson    body   annotation   total   (the ceiling governs `body`)');
  for (const id of ids) {
    const src = fs.readFileSync(path.join(srcDir, id + '.astro'), 'utf8');
    const total = source(src).length;
    const ann = specWords(src);
    const body = total - ann;
    console.log(id.padEnd(8) + String(body).padStart(6) + String(ann).padStart(13) + String(total).padStart(8) +
      (body > 2000 ? '   OVER' : ''));
  }
  process.exit(0);
}
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
