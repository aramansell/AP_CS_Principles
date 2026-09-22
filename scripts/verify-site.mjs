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
 *  7. the scaffolding ladder holds — every lesson that carries a
 *     walkthrough declares a valid level, every "How do I…?" entry points
 *     at a lesson that exists, and every walkthrough lesson is findable
 *     from the question index
 *  8. the two recurring questions survive in every lesson that has opted
 *     onto the ladder — the problem is split into more than one part, every
 *     part says where to read about it, the block still asks the student
 *     something, and it decays by the same level as the code
 *  9. the lab form adds up — every lesson renders at least one answer box,
 *     and the count the page prints at build time matches the boxes the
 *     page actually contains
 * 10. the editor half and the code half of a lesson are labelled apart — a
 *     lesson that names one of them names the other
 * 11. every method in the prose is named as a call — CompareTag(String tag),
 *     not CompareTag — because the shape of the call is the thing being taught
 * 12. no saved answer was orphaned — an answer box may only be appended after
 *     or trimmed from the end of its block, never inserted into or moved, so a
 *     student's saved text never reappears under a question it does not answer
 * 13. a converted lesson does not explain the same thing twice (a warning, not a
 *     failure — overlap is a heuristic, so the list goes to a human)
 *
 * Ported from the AP CS A Guide's verify-site.mjs, minus the legacy-site
 * URL parity checks (this site has no legacy twin).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';

const dist = path.resolve(process.argv[2] ?? 'dist');
const root = path.resolve('src/data/curriculum.ts');
const lessonsData = path.resolve('src/data/lessons.ts');

let failures = 0;
const fail = (msg) => { failures++; console.error('FAIL: ' + msg); };
const ok = (msg) => console.log('  ok: ' + msg);

// A warning is not a failure. It is used where the detector is a heuristic —
// it can see that two paragraphs are saying the same thing but not whether the
// repetition is deliberate — so it hands a list to a human instead of stopping
// the build. Silence is still not the goal: a warn that never fires is a warn
// nobody has checked the threshold of.
let warnings = 0;
const warn = (msg) => { warnings++; console.log('  WARN: ' + msg); };

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

// ---------- 7. scaffolding ladder + the "How do I…?" index
// Two subsystems that can silently rot: a lesson that gains a walkthrough but
// no ladder level (so students cannot tell how much support they are meant to
// have), and an ask entry pointing at a lesson that was renamed or removed.
console.log('7. scaffolding ladder & question index...');
const askPath = path.join(dist, 'docs', 'ask.html');
const askSrcPath = path.resolve('src/data/asks.ts');
if (!fs.existsSync(askPath)) {
  fail('docs/ask.html was not built (src/pages/docs/ask.astro)');
}
if (!fs.existsSync(askSrcPath)) {
  fail('src/data/asks.ts is missing');
} else {
  const askSrc = fs.readFileSync(askSrcPath, 'utf8');
  const askLessons = [...askSrc.matchAll(/lesson:\s*'([^']+)'/g)].map((m) => m[1]);
  const askQs = [...askSrc.matchAll(/q:\s*'([^']+)'/g)].map((m) => m[1]);
  if (askQs.length === 0) fail('asks.ts contains no questions');

  // every ask must point at a lesson that actually exists
  for (const lid of askLessons) {
    if (!fs.existsSync(path.join(dist, 'lessons', lid + '.html'))) {
      fail('asks.ts entry points at missing lesson ' + lid);
    }
    if (!lessonIds.includes(lid)) fail('asks.ts entry points at ' + lid + ', which is not in lessons.ts');
  }

  // the page must actually contain the questions (data -> render, not just data)
  if (fs.existsSync(askPath)) {
    const askHtml = fs.readFileSync(askPath, 'utf8');
    const missing = askQs.filter((q) => !askHtml.includes(q));
    if (missing.length) fail('docs/ask.html does not render ' + missing.length + ' ask(s), e.g. "' + missing[0] + '"');

    // every walkthrough lesson must be reachable from the question index,
    // and must declare a ladder level the badges know how to render
    const walkthroughLessons = [];
    const byLevel = { 1: [], 2: [], 3: [], 4: [] };
    const askLevels = new Map();
    for (const m of askSrc.matchAll(/lesson:\s*'([^']+)'[\s\S]*?level:\s*([1-4])/g)) {
      if (!askLevels.has(m[1])) askLevels.set(m[1], new Set());
      askLevels.get(m[1]).add(m[2]);
    }
    for (const f of built) {
      const id = f.replace('.html', '');
      const html = fs.readFileSync(path.join(dist, 'lessons', f), 'utf8');
      const wt = html.includes('class="activity walkthrough"');

      // A lesson's level can be declared by a walkthrough (levels 1-2) or by
      // the ask banner alone (levels 3-4, which give no code). Both are read,
      // because the whole ladder has to be checked, not just the lessons that
      // happen to render a walkthrough — an unchecked level is a badge the
      // index can lie about.
      const wtLevel = html.match(/class="activity walkthrough" data-scaffold="([^"]*)"/);
      const bannerLevel = html.match(/class="ask-banner" data-scaffold="([^"]*)"/);
      if (!wtLevel && !bannerLevel) continue; // lesson declares no scaffold level at all

      if (wt) walkthroughLessons.push(id);
      if (wt && !wtLevel) fail(id + ' renders a walkthrough with no data-scaffold level');

      // A lesson may carry MORE THAN ONE walkthrough — 5.3 does, because the
      // singleton and the HUD are two genuinely new mechanisms and each gets
      // its own. Reading only the first would let the rest sit at a different
      // level, or withhold lines the declared level promises, while the badge
      // and every check above said otherwise. So the level is read from all of
      // them and they must agree.
      const allWtLevels = [...html.matchAll(/class="activity walkthrough" data-scaffold="([^"]*)"/g)]
        .map((m) => m[1]);
      const disagreeing = allWtLevels.filter((l) => l !== allWtLevels[0]);
      if (disagreeing.length) {
        fail(id + ' renders walkthroughs at different scaffold levels (' +
          allWtLevels.join(', ') + ') — one lesson, one rung');
      }

      const declared = wtLevel ?? bannerLevel;
      if (!/^[1-4]$/.test(declared[1])) {
        fail(id + ' declares an invalid scaffold level: ' + declared[1]);
        continue;
      }
      const level = Number(declared[1]);
      if (byLevel[level]) byLevel[level].push(id);

      // A level and the shape it renders must match, or the badge is fiction.
      // Levels 1-2 hand the student the code; levels 3-4 must not.
      if (level <= 2 && !wt) {
        fail(id + ' declares scaffold level ' + level + ' (gives the code) but renders no walkthrough');
      }
      if (level >= 3 && wt) {
        fail(id + ' declares scaffold level ' + level + ' (gives no code) but hands over a walkthrough anyway');
      }
      if (level >= 3 && bannerLevel && bannerLevel[1] !== String(level)) {
        fail(id + ' ask banner says level ' + bannerLevel[1] + ' but the walkthrough says ' + level);
      }
      if (level <= 2 && bannerLevel && bannerLevel[1] !== String(level)) {
        fail(id + ' ask banner says level ' + bannerLevel[1] + ' but the walkthrough says ' + level);
      }

      // Gaps only exist where a walkthrough does. The ladder decays by
      // WITHHOLDING, so within a walkthrough the level has to be real rather
      // than a label: a level-1 lesson gives every line, and a guided lesson
      // has to actually leave the student something to write, or "a little
      // less" never happened and the next lesson's leap is back.
      if (wt) {
        // Summed across every walkthrough on the page, not just the first: a
        // multi-walkthrough lesson is exactly where a withheld line would
        // otherwise slip past the level-1 rule.
        const gaps = [...html.matchAll(/data-gaps="(\d+)"/g)]
          .reduce((n, m) => n + Number(m[1]), 0);
        if (level === 2 && gaps === 0) {
          fail(id + ' declares scaffold level 2 (guided) but leaves no gaps for the student to fill');
        }
        if (level === 1 && gaps > 0) {
          fail(id + ' declares scaffold level 1 (full walkthrough) but withholds ' + gaps + ' line(s)');
        }
        // A gap with no prompt is a blank page with a hole in it.
        if (gaps > 0) {
          const turns = (html.match(/class="wt-your-turn"/g) ?? []).length;
          if (turns !== gaps) {
            fail(id + ' renders ' + gaps + ' gap(s) but ' + turns + ' instruction(s) telling the student what to write');
          }
        }

        // The answer key is gated at EVERY level. The first cut applied the
        // gate at level 2 and up, which is backwards: level 1 is the lesson
        // with no gaps at all, so it is the one where skipping to the bottom
        // of the page and pasting costs the student least — and it is the
        // newest student in the course. A block of code lying open under a
        // "do not paste this in" note is a target, not a warning.
        if (/<div class="wt-final">/.test(html)) {
          fail(id + ' renders the finished file in an open block — the answer key must sit behind ' +
            'a <details> at every level, level 1 included (src/lib/walkthrough.ts)');
        }

        // Walkthrough lines are separated by real newlines in the markup, so
        // the file reads as a file to anything that reads TEXT rather than
        // pixels — a copy, a text extract, a screen reader. Without them the
        // whole script arrives as "1using UnityEngine;23public class…" on one
        // line, which is what a student actually reported.
        if (/<\/span><span class="wt-line/.test(html)) {
          fail(id + ' joins walkthrough lines with no newline — the code reaches a copy or a ' +
            'text extract as a single unbroken line (src/lib/walkthrough.ts renderStep)');
        }
        // ...and the gutter numbers are drawn by CSS from data-n rather than
        // written into the text, so a copied step gives code and not "1using".
        if (/<span class="wt-ln">/.test(html)) {
          fail(id + ' still writes line numbers into the text — they belong in data-n, drawn ' +
            'by .wt-line::before (public/style.css)');
        }
      }

      // the index and the lesson must agree on how much support this is.
      // Every entry for a lesson must agree, not merely one of them — a lesson
      // with three ask entries and one stale level would otherwise pass while
      // the index told students two different things.
      const claimed = askLevels.get(id);
      if (claimed) {
        const wrong = [...claimed].filter((l) => l !== String(level));
        if (wrong.length) {
          fail(id + ' is scaffold level ' + level + ' but asks.ts describes it as level ' + wrong.join('/'));
        }
      }

      // Every lesson on the ladder must be findable from the question index —
      // not just the ones that happen to render a walkthrough. A student who
      // cannot find the lesson cannot reread it, and src/data/asks.ts is the
      // only complete map of what each lesson is designed to give. Keeping it
      // complete is also what stops the rollout plan living in somebody's head.
      if (!askLessons.includes(id)) {
        fail(id + ' declares a ladder level but has no "How do I…?" entry pointing at it (src/data/asks.ts)');
      }
    }
    const groupCount = (askSrc.match(/title:\s*'/g) ?? []).length;
    const ladder = [1, 2, 3, 4]
      .filter((l) => byLevel[l].length)
      .map((l) => 'L' + l + ': ' + byLevel[l].join(', '))
      .join('  |  ');
    ok('scaffolding ladder: ' + walkthroughLessons.join(', ') + ' carry walkthroughs, all indexed');
    ok('ladder spread — ' + ladder);
    ok(askQs.length + ' questions indexed across ' + groupCount + ' groups, all rendering');

    // ---------- 8. the two beats that must appear in every build lesson
    // The year has two learning targets bigger than any API — break the
    // problem into parts, and look each part up. They are rendered by
    // src/lib/decompose.ts and asked identically in every lesson, so the
    // checks are: the block exists, it is a real split (more than one part),
    // every named part says where to read about it, the block still asks the
    // student something, and it decays on the same ladder as the code.
    //
    // There used to be a third beat — "connect it to something you already
    // built" — asked in every lesson without decay. It was removed: asked 46
    // times it became a formality students answered without thinking, and it
    // cost 163 answer boxes. A connection to earlier work now belongs in the
    // lesson's own `turns` if it genuinely explains the decomposition, which
    // is what the forward-reference scan below still guards.
    console.log('8. the two recurring questions...');
    let decomposed = 0;
    const stillLevel = [];
    for (const f of built) {
      const id = f.replace('.html', '');
      const html = fs.readFileSync(path.join(dist, 'lessons', f), 'utf8');

      // Which lessons are even in scope? A lesson that has declared a rung on
      // the ladder has opted into the new pattern, and is held to it in full.
      // The rest are still on the old shape; they are counted and reported,
      // not failed, or the signal would be red for weeks and worth nothing.
      const declares = /class="activity walkthrough" data-scaffold="[1-4]"|class="ask-banner" data-scaffold="[1-4]"/.test(html);
      const hasLab = /activity-label">[^<]*(Build Lab|Build:|Your Turn)/.test(html);
      if (!declares) {
        if (hasLab) stillLevel.push(id);
        continue;
      }

      const block = html.match(/<div class="activity decompose"[^>]*>/);
      if (!block) {
        fail(id + ' declares a ladder level but carries no "Break It Down" block (src/lib/decompose.ts)');
        continue;
      }
      decomposed++;

      const attr = (n) => {
        const m = block[0].match(new RegExp('data-' + n + '="(\\d+)"'));
        return m ? Number(m[1]) : NaN;
      };
      const level = attr('level');
      const parts = attr('parts');
      const given = attr('given');
      const docs = attr('docs');
      if (!(level >= 1 && level <= 4)) fail(id + ' decompose block has no valid data-level: ' + level);
      if (!(parts >= 2)) {
        fail(id + ' decompose block lists ' + parts + ' part(s) — a one-part split is not a decomposition');
      }
      // `parts` is the authored split — the record of what the lesson intends,
      // shown or not. `docs` is what is rendered, and at level 4 nothing is,
      // so the sourcing rule only binds where parts are actually visible.
      if (level <= 3 && docs !== parts) {
        fail(id + ' decompose block lists ' + parts + ' part(s) but sources only ' + docs +
          ' — a part with no reading is the whole problem again');
      }
      // the decay, read from the block itself
      if (level === 1 && given !== parts) fail(id + ' is level 1 but withholds ' + (parts - given) + ' part(s)');
      if (level === 2 && given >= parts) fail(id + ' is level 2 (guided) but hands over every part');
      if (level >= 3 && level <= 3 && given !== parts) fail(id + ' is level 3 but withholds ' + (parts - given) + ' part(s)');
      if (level === 4 && given !== 0) fail(id + ' is level 4 (solo) but still hands over ' + given + ' part(s)');

      // The block has to ask the student something. The discussion is the
      // point of the block — a parts list with nothing to answer is a reading,
      // not a decomposition. At level 4 the auto-generated "list the parts"
      // prompt guarantees this; below that the lesson's own `turns` carry it,
      // so a lesson that lists parts and asks nothing is the failure here.
      const boxes = (html.match(/data-block="decompose"/g) ?? []).length;
      if (boxes === 0) fail(id + ' decompose block asks nothing — no answer box to discuss in');

      // Every prompt in the block has to be answerable. Note this is NOT a
      // "must contain a question mark" test: "Pick two of the parts above and
      // say in one line what each one actually does" is a good discussion
      // prompt and contains no '?'. What this catches is an empty or stub
      // prompt — a box the student cannot possibly know how to fill.
      for (const m of html.matchAll(/data-block="decompose"[^>]*data-question="([^"]*)"/g)) {
        if (m[1].trim().length < 20) {
          fail(id + ' decompose block has a stub prompt: "' + m[1] + '"');
        }
      }

      // A lesson may point back but never forward — "in 4.1 you did this" in
      // Unit 2 sends a student to a lesson that does not exist yet. The turns
      // are where earlier lessons get named, so that is what is scanned.
      //
      // Only the turns are checked. The body of a lesson may legitimately say
      // "next lesson we will...", and that is a preview rather than a claim
      // about prior knowledge.
      // The lookahead drops a decimal that is really a number: `1.5f` must not
      // read as lesson 1.5.
      const self = id.match(/^(\d+)\.(\d+)/);
      // The turns container emits <p> + <label> siblings and no nested divs,
      // so the first </div> closes it. Absent at level 1-2 when a lesson has
      // no turns of its own — nothing to scan, and nothing claimed.
      const turnsBlock = html.match(/class="dc-turns"([\s\S]*?)<\/div>/);
      if (self && turnsBlock) {
        const seen = new Set();
        for (const m of turnsBlock[1].matchAll(/\b(\d{1,2}\.\d)(?![\w])/g)) seen.add(m[1]);
        for (const ref of seen) {
          if (!lessonIds.includes(ref)) continue; // not a lesson reference
          const other = ref.match(/^(\d+)\.(\d+)/);
          if (!other) continue;
          const ahead =
            Number(other[1]) > Number(self[1]) ||
            (Number(other[1]) === Number(self[1]) && Number(other[2]) > Number(self[2]));
          if (ahead) {
            fail(id + ' points forward to lesson ' + ref + ' in its Break It Down turns — ' +
              'prior knowledge only, the student has not been there yet');
          }
        }
      }

      // the banner and the block must agree about the rung
      const bannerL = html.match(/class="ask-banner" data-scaffold="([1-4])"/);
      if (bannerL && Number(bannerL[1]) !== level) {
        fail(id + ' ask banner says level ' + bannerL[1] + ' but the decompose block says ' + level);
      }
    }
    ok(decomposed + ' lessons carry the two recurring questions, decay verified');
    if (stillLevel.length) {
      console.log('  note: ' + stillLevel.length + ' build lesson(s) still on the old shape, not yet ' +
        'rolled onto the ladder: ' + stillLevel.join(', '));
    }
  }

  // ---------- 9. the lab form adds up
  // The lesson page renders "0/N answered" at build time and a script rewrites
  // it on load from the boxes actually present. Those two numbers come from
  // different places (src/lib/formify.ts and the DOM), so any new kind of
  // answer box can silently desync them — the student sees one total, then a
  // different one a moment later, and neither is obviously the wrong one.
  //
  // This check also holds the floor: every lesson has to render at least one
  // box. A lesson that loses its last one emits no lab bar, and the count
  // below would simply print a smaller number — so without this, a refactor
  // that deletes questions degrades verification silently instead of failing
  // it. That is the trap the box-count column exists to catch.
  console.log('9. lab forms...');
  let labs = 0;
  const boxless = [];
  for (const f of built) {
    const id = f.replace('.html', '');
    const html = fs.readFileSync(path.join(dist, 'lessons', f), 'utf8');
    const boxes = (html.match(/class="lab-answer"/g) ?? []).length;
    if (boxes === 0) boxless.push(id);
    const bar = html.match(/class="lab-bar"[^>]*data-count="(\d+)"/);
    if (!bar) {
      if (boxes > 0) fail(id + ' renders ' + boxes + ' answer box(es) but no lab bar to hold them');
      continue;
    }
    labs++;
    if (Number(bar[1]) !== boxes) {
      fail(id + ' lab bar counts ' + bar[1] + ' question(s) but the page renders ' + boxes +
        ' answer box(es) — the readout will contradict itself once the script runs');
    }
  }
  if (boxless.length) {
    fail(boxless.length + ' lesson(s) render no answer box at all, so they carry no lab form: ' +
      boxless.join(', ') + ' — every lesson has to ask the student something');
  }
  ok(labs + ' lessons with a lab form, every count matching its rendered boxes');

  // The Socratic is the lesson's one discussion block. Three questions is the
  // target and a fourth is allowed only when it is the block's synthesis
  // question — the one that ties the lesson to a bigger idea. A fifth is
  // accretion, which is what the restructure existed to remove.
  //
  // The count is read from the rendered <li> list rather than from the answer
  // boxes, so a question authored in the source and silently never boxed still
  // counts against the cap. Counting boxes would let a block grow past the
  // limit precisely by being less answerable.
  const overCap = [];
  for (const f of built) {
    const id = f.replace('.html', '');
    const html = fs.readFileSync(path.join(dist, 'lessons', f), 'utf8');
    const blocks = [...html.matchAll(/<div class="socratic">([\s\S]*?)<\/div>/g)];
    blocks.forEach((m, i) => {
      const n = (m[1].match(/<li\b/g) ?? []).length;
      if (n > 4) overCap.push(id + ':sc' + (i + 1) + ' has ' + n);
    });
  }
  if (overCap.length) {
    fail('Socratic block(s) over the four-question limit: ' + overCap.join('; ') +
      " — three is the target, and a fourth only if it is the block's synthesis question");
  } else {
    ok('no Socratic block exceeds four questions');
  }

  // ---------- 10. the editor half and the code half are labelled apart
  // A student at a computer with Unity open needs to know which half of the
  // work they are in: the clicks (and which pane each one happens in) or the
  // file. The lessons say so with two block labels — "In the Editor" and
  // "In the Code" — and this check is what keeps the pair honest.
  //
  // It is deliberately scoped by the labels themselves rather than by a list of
  // converted lessons: a lesson that names one half must name the other, so a
  // half-converted lesson fails while a lesson that has not been through this
  // pass yet is simply not held to it. That is the only form of this rule that
  // can be introduced to 81 lessons without a red build for a month.
  //
  // It reads the rendered label, not a class or an attribute, so the split
  // cannot be satisfied by markup without the words a student reads.
  console.log('10. editor work vs code work...');
  const editorRe = /activity-label">In the Editor</;
  const codeRe = /activity-label">In the Code</;
  const split = [];
  const half = [];
  for (const f of built) {
    const id = f.replace('.html', '');
    const html = fs.readFileSync(path.join(dist, 'lessons', f), 'utf8');
    const hasEditor = editorRe.test(html);
    const hasCode = codeRe.test(html);
    if (hasEditor && hasCode) split.push(id);
    else if (hasEditor || hasCode) half.push(id + ' (' + (hasEditor ? 'editor half only' : 'code half only') + ')');
  }
  if (half.length) {
    fail('lesson(s) label one half of the work but not the other: ' + half.join(', ') +
      ' — every lesson that says "In the Editor" must also say "In the Code", and the reverse');
  }
  ok(split.length + ' lesson(s) label the editor half and the code half apart' +
    (split.length ? ': ' + split.join(', ') : ''));

  // ---------- 11. every method in the prose is named as a call
  // "CompareTag beats comparing strings" reads as a noun, and the student has no
  // way to see that it takes an argument, what type that argument is, or that it
  // returns a bool. Writing CompareTag(String tag) — or CompareTag("Coin") —
  // shows the shape of the call instead of asking the reader to remember it.
  //
  // Two deliberate limits:
  //   - Code blocks are dropped before the scan. Inside code a method name is
  //     already in its call, and a comment that says "// Destroy the coin" is
  //     prose about a line, not a method taught by name.
  //   - Only lessons that carry the "In the Code" label are scanned, for the
  //     reason in check 10: the rest of the course is still being converted, and
  //     a check that fails 77 lessons teaches nobody anything.
  console.log('11. methods named as calls...');
  const METHODS = [
    'CompareTag', 'GetComponent', 'GetComponentInChildren',
    'OnTriggerEnter2D', 'OnTriggerExit2D', 'OnTriggerStay2D',
    'OnCollisionEnter2D', 'OnCollisionExit2D', 'OnCollisionStay2D',
    'Instantiate', 'Destroy', 'Debug.Log',
    'Mathf.Clamp', 'Mathf.Min', 'Mathf.Max', 'Mathf.Abs',
    'Input.GetAxis', 'Input.GetAxisRaw', 'Input.GetKey', 'Input.GetKeyDown',
    'Input.GetMouseButtonDown', 'AddForce', 'MovePosition', 'LoadScene',
    'FindWithTag', 'SetBool', 'SetInteger', 'SetTrigger',
    'Start', 'Update',
  ];
  const bareMethods = [];
  for (const id of split) {
    // strip scripts, styles and every code block, then the remaining tags —
    // what is left is the prose the student actually reads.
    const text = fs.readFileSync(path.join(dist, 'lessons', id + '.html'), 'utf8')
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<pre[\s\S]*?<\/pre>/g, ' ')
      // Page chrome is not prose the lesson is teaching with. The <head> holds
      // the <title> and both navs hold the neighbouring lessons' names, so this
      // check used to fail a lesson because the NEXT lesson's title happens to
      // name a method — and the honest-looking fix for that is to misspell the
      // title, which is how a check gets obeyed and the site gets worse.
      .replace(/<head[\s\S]*?<\/head>/g, ' ')
      .replace(/<nav[\s\S]*?<\/nav>/g, ' ')
      // The h1 is the lesson's NAME, registered in src/data/lessons.ts and reused
      // by the dashboard, the pacing calendar and the ask index. A name is a
      // label, not a sentence about a method: "Projectiles: Instantiate, Fire,
      // Destroy" is three nouns stacked as a title, and rewriting it to
      // "Instantiate(), Fire, Destroy()" would desync it from the site's own
      // record of what the lesson is called. (If the h1s should carry the call
      // shape too, that is a change to the registered titles first, and then to
      // this rule — not to one page's h1.)
      .replace(/<h1[\s\S]*?<\/h1>/g, ' ')
      // Same reasoning one level down: a link to another lesson names that lesson
      // by its registered title ("Next: 3.2 — Projectiles: Instantiate, Fire,
      // Destroy"). That is a reference to a name, not prose teaching a method, so
      // the anchor's own text is dropped — a lesson is not made worse by the
      // name of the lesson it points at.
      .replace(/<a\b[^>]*href="\d+\.\d+[a-z]?\.html"[^>]*>[\s\S]*?<\/a>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      // Entities are decoded after the tags are gone, so a generic call reads
      // as one: `GetComponent&lt;T&gt;()` in the markup is `GetComponent<T>()`
      // in the prose, and the `<` is part of the call's shape.
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    for (const name of METHODS) {
      // A name is "named as a call" when what follows it opens one — `(` for a
      // plain call, `<` for a generic one. Anything else is the bare noun this
      // check exists to catch.
      const re = new RegExp('\\b' + name.replace(/\./g, '\\.') + '\\b(?!\\s*[<(])', 'g');
      const hit = re.exec(text);
      if (!hit) continue;
      const near = text.slice(Math.max(0, hit.index - 45), hit.index + 45)
        .replace(/\s+/g, ' ').trim();
      bareMethods.push(id + ': ' + name + ' — ...' + near + '...');
    }
  }
  if (bareMethods.length) {
    fail('method(s) named without their call in a converted lesson:\n    ' + bareMethods.join('\n    '));
  } else {
    ok('no method in the ' + split.length + ' converted lesson(s) is named without its parentheses');
  }

  // ---------- 12. nobody's saved answer was orphaned
  // Answer-box ids are positional — formify derives them from document order
  // (lessonId:sc1:q2) — and public/js/lab-forms.js saves student work in
  // localStorage under them. So editing the middle of a question block does not
  // lose a box, it loses the *text inside it*: the box survives under an id that
  // now belongs to a different question, and the student's answer quietly
  // reappears beneath a prompt it does not answer. Nothing about the page looks
  // wrong, which is why this is a check and not a habit.
  //
  // The baseline is the copy of the page committed at HEAD (dist/ is tracked, so
  // the previous render is always there to compare against). During a rewrite of
  // this size that is the only thing that knows what the ids used to mean.
  //
  // Two ways to orphan an answer, both caught:
  //   (a) inserting into or deleting from the middle of a block shifts every id
  //       after it, so the id sequence stops being an append-or-trim of the old
  //       one;
  //   (b) moving a question to a different slot keeps the ids but swaps which
  //       question each one belongs to — caught by noticing text that has left
  //       its old id but is still on the page under a new one.
  //
  // Rewording a question is not flagged: its old text is simply gone, and the
  // answer still sits under the id it was typed into. Trimming from the end and
  // appending to the end are both allowed, and are how a block is meant to
  // change.
  console.log('12. saved answers still belong to their question...');
  const boxesOf = (html) => [...html.matchAll(/data-q="([^"]+)"[^>]*data-question="([^"]*)"/g)]
    .map((m) => ({ id: m[1], q: m[2] }));
  const flat = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim().toLowerCase();
  const seq = (boxes) => {
    // group by the block key (lessonId:sc1), keeping document order, so a
    // comparison is per-block and a whole block disappearing is its own case.
    const byBlock = new Map();
    for (const b of boxes) {
      const key = b.id.replace(/:q\d+$/, '');
      if (!byBlock.has(key)) byBlock.set(key, []);
      byBlock.get(key).push(b.id);
    }
    return byBlock;
  };
  let hasHead = true;
  try {
    execSync('git rev-parse --verify --quiet HEAD^{commit}', { stdio: ['ignore', 'ignore', 'ignore'] });
  } catch {
    hasHead = false;
  }
  if (!hasHead) {
    ok('skipped — no commit to compare against (not a git checkout?)');
  } else {
    const orphans = [];
    for (const f of built) {
      const id = f.replace('.html', '');
      const atHead = (p) => {
        const r = spawnSync('git', ['show', 'HEAD:' + p], { encoding: 'utf8' });
        return r.status === 0 ? r.stdout : null;
      };
      const was = atHead('dist/lessons/' + f);
      if (was === null) continue; // a lesson page that did not exist at HEAD has no saved answers
      const oldBoxes = boxesOf(was);
      if (oldBoxes.length === 0) continue;
      const nowBoxes = boxesOf(fs.readFileSync(path.join(dist, 'lessons', f), 'utf8'));
      const nowText = new Map(nowBoxes.map((b) => [b.id, flat(b.q)]));
      const nowLive = new Set(nowBoxes.map((b) => flat(b.q)));
      const oldSeq = seq(oldBoxes);
      const newSeq = seq(nowBoxes);

      for (const [block, oldIds] of oldSeq) {
        const newIds = newSeq.get(block);
        if (newIds && !(oldIds.every((x, i) => newIds[i] === x) || newIds.every((x, i) => oldIds[i] === x))) {
          orphans.push(id + ' ' + block + ': ids are no longer an append-or-trim of the committed ones (' +
            oldIds.join(', ') + ' → ' + newIds.join(', ') + ') — anything after the change moved under a new id, ' +
            'and the answers already typed into those boxes are now attached to other questions');
          continue;
        }
        // Ids can survive intact and still be orphaned, by two questions trading
        // places: box q1 now shows what used to be q2's prompt, and the student's
        // answer to q1 is sitting under a question it does not answer. Every id
        // is present, the count is right, the page reads fine.
        //
        // A reworded question is not flagged — its new text matches no old prompt
        // in the block. A moved one is: the new text under this id is verbatim
        // the old text of a different id in the same block. That is the shape of
        // a trade, and it is the only way that text gets there.
        const oldText = new Map(oldBoxes.filter((b) => b.id.startsWith(block + ':')).map((b) => [b.id, flat(b.q)]));
        for (const [oldId, wasText] of oldText) {
          const isText = nowText.get(oldId);
          if (isText === undefined || isText === wasText || isText === '') continue;
          const cameFrom = [...oldText].find(([k, t]) => k !== oldId && t === isText);
          if (!cameFrom) continue; // reworded, or the question this replaces was rewritten too
          orphans.push(id + ': ' + oldId + ' now shows the question that used to live under ' + cameFrom[0] +
            ' — the two traded slots, so every saved answer in that pair is reading the other prompt');
        }
      }
      for (const b of oldBoxes) {
        const stillThere = nowText.has(b.id);
        const text = flat(b.q);
        if (stillThere || !nowLive.has(text)) continue;
        const landed = nowBoxes.find((n) => flat(n.q) === text);
        orphans.push(id + ': the question under ' + b.id + ' is unchanged but now answers as ' + landed.id +
          ' — the text moved slots, so saved answers are reading the wrong prompt (trim or append, never move)');
      }
    }
    if (orphans.length) {
      fail(orphans.length + ' answer box(es) orphaned against the committed page:\n    ' + orphans.join('\n    '));
    } else {
      ok('every answer box in the ' + built.length + ' built lesson(s) still belongs to the question it did');
    }
  }

  // ---------- 13. a lesson does not explain the same thing twice
  // The lesson that exhausts its reader is not the one with a hard idea in it. It
  // is the one that explains the same idea in four sections, so the student
  // arrives at the build with nothing left — the complaint that produced this
  // check was "how many times do we need to explain Rigidbody2D inside one
  // lesson". Two signals, both read per converted lesson:
  //
  //   (a) density — a concept carried by sentences in three or more sections of
  //       one lesson. Wording changes from section to section, so looking for
  //       repeated sentences misses it; counting the sections that talk about a
  //       term at all does not.
  //   (b) restatement — two paragraphs in a lesson whose content words are mostly
  //       the same words, which is what saying the same thing in new words looks
  //       like from outside.
  //
  // It reports rather than fails. Both are heuristics: a comparison table's two
  // rows share their vocabulary, and a term can legitimately appear in the Break
  // It Down list, the reference table and the spec. So the reader keeps the
  // judgment, and the numbers below are tuning knobs rather than rules.
  //
  // Reference-table rows are exempt from (b) (a row is a lookup, not an
  // explanation, per the spec) and code is dropped from both — a walkthrough line
  // is the instruction, not prose about it. The term list is deliberately short
  // and is meant to grow as the course's concepts get named; a term nobody
  // explains twice never needs to be in it.
  console.log('13. explanations that repeat...');
  const TERMS = [
    'Rigidbody2D', 'Collider2D', 'Is Trigger', 'CompareTag', 'Time.deltaTime', 'Animator',
    'Instantiate', 'Destroy', 'MovePosition', 'AddForce', 'transform.Translate', 'linearVelocity',
    'SerializeField', 'OnTriggerEnter2D', 'OnCollisionEnter2D', 'Debug.Log', 'Sprite Renderer',
    'Prefab', 'Tilemap', 'gravityScale', 'Vector2', 'normalized', 'Input.GetAxis',
    'state machine', 'ScriptableObject', 'Canvas', 'Update(', 'Start(',
  ];
  const SECTIONS_MAX = 2;   // the spec allows three sections only if the third is a new context
  const SENTENCES_MIN = 6;  // and only if the mentions are load-bearing rather than incidental
  const STOP = new Set(('the a an and or but if then than that this these those it its is are was were be been ' +
    'being am to of in on at for with from by as not no you your we our they their them us me my do does did ' +
    'doing have has had can could will would should may might must one two three also so because when where ' +
    'which who whom what how why there here about into over under again more most other some such only own ' +
    'same too very just now out up down off still get got gets make makes made use uses used like want wanted ' +
    'need needs needed see sees saw know knows knew think thinks way ways thing things').split(' '));
  const tokens = (s) => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w)));
  const PROSE_MIN = 12;   // a paragraph shorter than this cannot carry an explanation
  const OVERLAP_MIN = 0.5;
  const dense = [];
  const repeated = [];
  for (const id of split) {
    const html = fs.readFileSync(path.join(dist, 'lessons', id + '.html'), 'utf8');
    // carve the page into labelled sections so a report can say WHERE the repeat is
    const marks = [...html.matchAll(/class="activity-label">([^<]*)</g)];
    const blocks = [];
    for (let i = 0; i < marks.length; i++) {
      const from = marks[i].index;
      const to = i + 1 < marks.length ? marks[i + 1].index : html.length;
      blocks.push({ where: marks[i][1].trim(), html: html.slice(from, to) });
    }
    const units = [];
    for (const b of blocks) {
      const prose = b.html.replace(/<pre[\s\S]*?<\/pre>/g, ' ').replace(/<table[\s\S]*?<\/table>/g, ' ');
      for (const m of prose.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
        const text = m[2].replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
        const t = tokens(text);
        if (t.size >= PROSE_MIN) units.push({ where: b.where, text, t });
      }
    }
    // (a) density: how many sections lean on one term, and how hard
    //
    // <pre> comes out first. Code the student types is not prose they read: a
    // lesson ABOUT the Animator must type `GetComponentInChildren<Animator>()`
    // in the walkthrough, and counting that as a mention meant a lesson could
    // not get its own subject below three sections however well it was written
    // — the warning fired hardest on exactly the lessons that were right. The
    // sections still count as sections, because the student does meet the term
    // there; only the sentence tally is prose.
    const readable = (h) => h.replace(/<pre[\s\S]*?<\/pre>/g, ' ').replace(/<[^>]+>/g, ' ');
    for (const term of TERMS) {
      const inBlocks = blocks.filter((b) => readable(b.html).includes(term));
      if (inBlocks.length <= SECTIONS_MAX) continue;
      let sentences = 0;
      for (const b of blocks) {
        for (const s of readable(b.html).split(/(?<=[.!?])\s+/)) {
          if (s.includes(term)) sentences++;
        }
      }
      if (sentences < SENTENCES_MIN) continue;
      dense.push({ id, term, sentences, where: inBlocks.map((b) => b.where).join(' / ') });
    }
    // (b) restatement: two paragraphs made of the same content words
    for (let i = 0; i < units.length; i++) {
      for (let j = i + 1; j < units.length; j++) {
        const a = units[i], b = units[j];
        let shared = 0;
        for (const w of a.t) if (b.t.has(w)) shared++;
        const overlap = shared / (a.t.size + b.t.size - shared);
        if (overlap < OVERLAP_MIN) continue;
        repeated.push({ id, overlap, a, b });
      }
    }
  }
  dense.sort((x, y) => y.sentences - x.sentences);
  repeated.sort((x, y) => y.overlap - x.overlap);
  if (dense.length === 0 && repeated.length === 0) {
    ok('no concept in the ' + split.length + ' converted lesson(s) is explained across three sections');
  }
  if (dense.length) {
    warn(dense.length + ' term(s) explained in three or more sections of one lesson (' + split.length +
      ' converted lesson(s) scanned):\n' +
      dense.slice(0, 25).map((d) => '      ' + d.id + ': ' + d.term + ' — ' + d.sentences +
        ' sentences across ' + d.where).join('\n') +
      (dense.length > 25 ? '\n      ... and ' + (dense.length - 25) + ' more' : '') +
      '\n    Say it once and let them build. A third section is allowed only for a genuinely new context,');
  }
  if (repeated.length) {
    warn(repeated.length + ' pair(s) of paragraphs in a converted lesson say the same thing, worst first:\n' +
      repeated.slice(0, 6).map((r) => '      ' + r.id + ' ' + Math.round(r.overlap * 100) + '% — "' + r.a.where +
        '" vs "' + r.b.where + '"\n        A: ' + r.a.text.slice(0, 90) + '\n        B: ' + r.b.text.slice(0, 90))
        .join('\n') +
      (repeated.length > 6 ? '\n      ... and ' + (repeated.length - 6) + ' more' : ''));
  }
}

console.log('');
if (failures === 0) {
  console.log('VERIFY PASSED — ' + pages.length + ' pages, ' + links + ' links, ' + built.length + ' lessons.' +
    (warnings ? '  ' + warnings + ' warning(s) above — read them.' : ''));
  process.exit(0);
} else {
  console.log('VERIFY FAILED — ' + failures + ' problem(s) above.' +
    (warnings ? '  (' + warnings + ' warning(s) too.)' : ''));
  process.exit(1);
}
