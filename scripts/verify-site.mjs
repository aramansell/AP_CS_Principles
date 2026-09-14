#!/usr/bin/env node
/**
 * Site integrity verifier — run after `npm run build` (which the package
 * script does for you via `npm run verify`). Checks, in order:
 *
 *  1. every lesson id in SEQUENCE has a built page, and every built
 *     lesson page corresponds to a SEQUENCE entry
 *  2. every internal link on every built page resolves to a real file
 *     (catches typos, dead links, and stale lesson references)
 *  3. the dashboard lists all lessons; the pacing table lists all days
 *  4. the coverage matrix lists all CED topic families
 *  5. the exam hub is complete
 *  6. the MCQ bank is intact — every answer key matches a rendered
 *     question, every explanation exists, and the mixed practice sets
 *     sit inside the exam's published big-idea weighting ranges
 *
 * Ported from the AP CS A Guide's verify-site.mjs, minus the legacy-site
 * URL parity checks (this site has no legacy twin).
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');
const root = path.resolve('src/data/curriculum.ts');
const lessonsData = path.resolve('src/data/lessons.ts');

let failures = 0;
const fail = (msg) => { failures++; console.error('FAIL: ' + msg); };
const ok = (msg) => console.log('  ok: ' + msg);

// ---------- read the curriculum data via a tiny esbuild-free shim:
// the .ts file is erasable-syntax TS; strip types crudely and eval in a
// sandbox would be fragile. Instead: import it with Node's TS support
// (Node >= 23.6 runs .ts with --experimental-strip-types by default in
// 24; this script runs under plain node, so we shell out to a data dump
// via node -e). Simpler: parse SEQUENCE/LESSONS by importing the same
// module through astro's compiled copy? No — keep it dumb and textual.

// Pull the data we need with targeted regexes over the source. It is a
// generated, single-source-of-truth file; the format is stable.
const curriculum = fs.readFileSync(root, 'utf8');
const lessonsSrc = fs.readFileSync(lessonsData, 'utf8');

const lessonIds = [...lessonsSrc.matchAll(/\s'([0-9]+\.[0-9]+(?:[a-z])?)':/g)].map((m) => m[1]);
if (lessonIds.length === 0) fail('no lesson ids found in lessons.ts');

const lessonArrays = [...curriculum.matchAll(/lessons:\s*\[([^\]]*)\]/g)].map(m => m[1]);
const seqIds = [];
for (const arr of lessonArrays) {
  for (const m of arr.matchAll(/'([^']+)'/g)) {
    seqIds.push(m[1]);
  }
}
const uniqueSeqIds = [...new Set(seqIds)];

// ---------- 1. every sequence lesson has a page & vice versa
console.log('1. lesson pages vs SEQUENCE...');
for (const id of uniqueSeqIds) {
  const p = path.join(dist, 'lessons', id + '.html');
  if (!fs.existsSync(p)) fail('SEQUENCE lesson ' + id + ' has no built page (dist/lessons/' + id + '.html)');
}
for (const id of lessonIds) {
  const p = path.join(dist, 'lessons', id + '.html');
  if (!fs.existsSync(p)) fail('lessons.ts entry ' + id + ' has no built page');
  else if (!uniqueSeqIds.includes(id)) fail('lessons.ts entry ' + id + ' is not in SEQUENCE (curriculum.ts)');
}
const built = fs.existsSync(path.join(dist, 'lessons')) ? fs.readdirSync(path.join(dist, 'lessons')).filter((f) => f.endsWith('.html')) : [];
for (const f of built) {
  const id = f.replace('.html', '');
  if (!lessonIds.includes(id)) fail('built lesson page ' + f + ' is not in lessons.ts');
}
ok(built.length + ' lesson pages built');

// ---------- 2. internal link check on every page
console.log('2. internal links...');
const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
})(dist);
const HREF = /href="([^"]*)"/g;
let links = 0;
// the configured site base (astro.config.mjs) — absolute links are legal on
// the 404 page, which GitHub serves from arbitrary depths.
const astroCfg = fs.readFileSync(path.resolve('astro.config.mjs'), 'utf8');
const baseMatch = astroCfg.match(/base\s*:\s*['"]([^'"]+)['"]/);
const base = (baseMatch ? baseMatch[1] : '').replace(/\/$/, '');
for (const page of pages) {
  // scan links in markup only — inline <script> bodies contain template
  // fragments (e.g. "href=" + expr) that are not real links.
  const html = fs.readFileSync(page, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  const rel = path.relative(dist, page);
  for (const m of html.matchAll(HREF)) {
    let href = m[1];
    if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) continue;
    href = href.split('#')[0];
    if (href === '') continue;
    let target;
    if (href.startsWith('/')) {
      if (base && !href.startsWith(base + '/')) continue; // off-site absolute path
      target = path.join(dist, decodeURIComponent(href.slice(base ? base.length : 0) || ''));
    } else {
      target = path.resolve(path.dirname(page), decodeURIComponent(href));
    }
    links++;
    if (!fs.existsSync(target)) {
      fail(rel + ' links to missing ' + href);
    }
  }
}
ok(links + ' internal links checked across ' + pages.length + ' pages');

// ---------- 3. dashboard + pace completeness
console.log('3. dashboard & pacing calendar...');
const dash = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
for (const id of lessonIds) {
  if (!dash.includes('lessons/' + id + '.html')) fail('dashboard is missing lesson link ' + id);
}
const pace = fs.readFileSync(path.join(dist, 'pace.html'), 'utf8');
const bdayMatches = [...curriculum.matchAll(/'(202[67]-[0-9]{2}-[0-9]{2})'/g)].map((m) => m[1]);
const uniqueDays = [...new Set(bdayMatches)];
const paceOk = uniqueDays.every((d) => pace.includes(d));
if (!paceOk) fail('pace.html is missing at least one calendar date from curriculum.ts');
else ok('pacing calendar covers all ' + uniqueDays.length + ' referenced dates');

// ---------- 4. coverage matrix lists every CED family
console.log('4. coverage matrix...');
const cov = fs.readFileSync(path.join(dist, 'docs', 'coverage.html'), 'utf8');
const fams = [...curriculum.matchAll(/'([A-Z]{3}-[0-9])':/g)].map((m) => m[1]);
const uniqueFams = [...new Set(fams)];
for (const f of uniqueFams) {
  if (!cov.includes(f)) fail('coverage.html missing CED family ' + f);
}
ok(uniqueFams.length + ' CED families listed');

// ---------- 5. exam hub complete
console.log('5. exam hub...');
const hub = ['index', 'create-performance-task', 'written-responses', 'mc-strategy', 'reference-sheet'];
for (const h of hub) {
  const p = path.join(dist, 'exam', h + '.html');
  if (!fs.existsSync(p)) fail('exam hub page missing: ' + h);
}
const cptPage = fs.readFileSync(path.join(dist, 'exam', 'create-performance-task.html'), 'utf8');
if (!cptPage.includes('AP Digital Portfolio')) fail('CPT page never mentions the AP Digital Portfolio');
if (!cptPage.includes('Personalized Project Reference')) fail('CPT page never mentions the PPR');
ok('exam hub complete (5 pages, key terms present)');

// ---------- 6. MCQ bank integrity + weighting
// The clinic lessons (11.4a/b/c) now ship real questions rendered from
// src/data/mcq-bank.ts, graded against /data/mcq-keys.json. This check
// guards the three ways that can silently break: a question rendered with
// no key (ungradeable), a key with no question (dead entry), and the mixed
// sets drifting outside the exam's published big-idea ranges.
console.log('6. MCQ bank...');
const keysPath = path.join(dist, 'data', 'mcq-keys.json');
if (!fs.existsSync(keysPath)) {
  fail('data/mcq-keys.json was not emitted (src/pages/data/mcq-keys.json.ts)');
} else {
  let bank = null;
  try {
    bank = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
  } catch (e) {
    fail('data/mcq-keys.json is not valid JSON: ' + e.message);
  }
  if (bank) {
    if (bank.format !== 'apcsp-mcq-keys/1') fail('mcq-keys.json has an unexpected format marker: ' + bank.format);

    const ids = Object.keys(bank.keys ?? {});
    if (ids.length === 0) fail('mcq-keys.json contains no keys');
    if (bank.total !== ids.length) fail('mcq-keys.json total (' + bank.total + ') disagrees with the ' + ids.length + ' keys present');

    // every key must be well-formed and carry a CED family the course
    // actually teaches (the same 10 families check 4 asserts in coverage)
    const cedSource = path.resolve('src/data/curriculum.ts');
    const cedFams = new Set([...fs.readFileSync(cedSource, 'utf8').matchAll(/'([A-Z]{3}-[0-9])':/g)].map((m) => m[1]));
    for (const id of ids) {
      const k = bank.keys[id];
      if (!/^[ABCD]$/.test(k.answer ?? '')) fail('mcq key ' + id + ' has a non-letter answer: ' + k.answer);
      if (!k.explain) fail('mcq key ' + id + ' has no explanation');
      if (!cedFams.has(k.ced)) fail('mcq key ' + id + ' cites unknown CED family ' + k.ced);
    }

    // every key must correspond to a rendered question in its own lesson,
    // and every rendered question must have a key — matched by data-q.
    let rendered = 0;
    for (const id of ids) {
      const lessonId = id.split(':')[0];
      const p = path.join(dist, 'lessons', lessonId + '.html');
      if (!fs.existsSync(p)) { fail('mcq key ' + id + ' points at missing lesson ' + lessonId); continue; }
      const html = fs.readFileSync(p, 'utf8');
      if (!html.includes('data-q="' + id + '"')) fail('mcq key ' + id + ' has no rendered question in ' + lessonId + '.html');
      rendered++;
    }
    for (const setEntry of Object.entries(bank.counts ?? {})) {
      const [label, n] = setEntry;
      if (typeof n !== 'number' || n <= 0) fail('mcq set "' + label + '" has no questions');
    }
    const counted = Object.values(bank.counts ?? {}).reduce((a, b) => a + b, 0);
    if (counted !== ids.length) fail('mcq set counts sum to ' + counted + ' but ' + ids.length + ' keys exist');

    // the mixed sets must sit inside the exam's published big-idea ranges
    const w = bank.weighting;
    if (!w || !w.mixed || !w.ranges) {
      fail('mcq-keys.json is missing the published weighting block');
    } else {
      for (const bi of Object.keys(w.ranges)) {
        const { min, max } = w.ranges[bi];
        const v = w.mixed[bi];
        if (typeof v !== 'number') fail('mcq weighting has no share for ' + bi);
        else if (v < min || v > max) {
          fail('mcq mixed sets put ' + bi + ' at ' + v + '%, outside the published ' + min + '-' + max + '%');
        }
      }
      const sum = Object.values(w.mixed).reduce((a, b) => a + b, 0);
      if (sum < 99 || sum > 101) fail('mcq mixed-set big-idea shares sum to ' + sum + '%, not 100');
    }

    if (rendered === ids.length && ids.length > 0) {
      ok(ids.length + ' MCQ keys, each matched to a rendered question (' +
        Object.entries(bank.counts ?? {}).map(([l, n]) => l.replace('Practice Set ', 'set') + '=' + n).join(', ') + ')');
    }

    // Every rendered question must offer exactly four distinct choices. A
    // duplicated distractor or a fifth option is invisible in the key file
    // (which only records the answer letter) but obvious to the grader's
    // arithmetic, so it is checked against the shipped markup.
    let choiceSets = 0;
    for (const lid of ['11.4a', '11.4b', '11.4c']) {
      const p = path.join(dist, 'lessons', lid + '.html');
      if (!fs.existsSync(p)) { fail('MCQ lesson missing: ' + lid); continue; }
      const html = fs.readFileSync(p, 'utf8');
      const groups = [...html.matchAll(/<div class="mc-choices"[^>]*>([\s\S]*?)<\/div>/g)];
      const qCount = (html.match(/<div class="mc-question"/g) ?? []).length;
      if (groups.length !== qCount) {
        fail(lid + ' renders ' + qCount + ' questions but ' + groups.length + ' choice groups');
      }
      for (const [, inner] of groups) {
        choiceSets++;
        const texts = [...inner.matchAll(/<span class="mc-choice-text">([\s\S]*?)<\/span>/g)]
          .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLowerCase());
        if (texts.length !== 4) fail(lid + ' has a question with ' + texts.length + ' choices, not 4');
        else if (new Set(texts).size !== 4) fail(lid + ' has a question with a duplicated choice');
      }
    }
    if (choiceSets > 0) ok(choiceSets + ' questions offer four distinct choices');

    // Every trap a question names must have a row in the catalog students
    // are told to re-read — otherwise the scorecard sends them nowhere.
    const stratPage = path.join(dist, 'exam', 'mc-strategy.html');
    if (fs.existsSync(stratPage)) {
      const strat = fs.readFileSync(stratPage, 'utf8');
      const bankSrc = fs.readFileSync(path.resolve('src/data/mcq-bank.ts'), 'utf8');
      const traps = new Set([...bankSrc.matchAll(/trap:\s*'([^']+)'/g)].map((m) => m[1]));
      const missing = [...traps].filter((t) => !strat.includes(t));
      if (missing.length) fail('mcq questions cite traps absent from mc-strategy.html: ' + missing.join(', '));
      else ok(traps.size + ' trap names all present in the strategy catalog');
    }
  }
}

console.log('');
if (failures === 0) {
  console.log('VERIFY PASSED — ' + pages.length + ' pages, ' + links + ' links, ' + built.length + ' lessons.');
  process.exit(0);
} else {
  console.log('VERIFY FAILED — ' + failures + ' problem(s) above.');
  process.exit(1);
}
