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

const lessonIds = [...lessonsSrc.matchAll(/\s'([0-9]+\.[0-9]+[a-z])':/g)].map((m) => m[1]);
if (lessonIds.length === 0) fail('no lesson ids found in lessons.ts');

const seqIds = [...curriculum.matchAll(/'([0-9]+\.[0-9]+[a-z])'/g)].map((m) => m[1]);
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

console.log('');
if (failures === 0) {
  console.log('VERIFY PASSED — ' + pages.length + ' pages, ' + links + ' links, ' + built.length + ' lessons.');
  process.exit(0);
} else {
  console.log('VERIFY FAILED — ' + failures + ' problem(s) above.');
  process.exit(1);
}
