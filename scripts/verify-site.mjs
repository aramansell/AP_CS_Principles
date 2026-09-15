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
 *  8. the three recurring questions survive in every lesson that has opted
 *     onto the ladder — the problem is split into more than one part, every
 *     part says where to read about it, the "connect it to something you
 *     already built" beat is still asked, and the block decays by the same
 *     level as the code
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
        const gaps = Number((html.match(/data-gaps="(\d+)"/) ?? [])[1] ?? 0);
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

    // ---------- 8. the three beats that must appear in every build lesson
    // The year has two learning targets bigger than any API — break the
    // problem into parts, and look each part up — plus the prior-knowledge
    // question that makes the sequencing pay off. They are rendered by
    // src/lib/decompose.ts and asked identically in every lesson, so the
    // checks are: the block exists, it is a real split (more than one part),
    // every named part says where to read about it, the connection beat is
    // still there, and the block decays on the same ladder as the code.
    console.log('8. the three recurring questions...');
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

      // Beat three never decays, at any level — that is the point of the
      // sequence, so a missing connection question is a real failure.
      // The block emits no nested divs, so the first </div> closes it.
      const connectBlock = html.match(/class="dc-connect"([\s\S]*?)<\/div>/);
      if (!connectBlock) {
        fail(id + ' decompose block has no "connect it to something you already built" beat');
      }
      const boxes = (html.match(/data-block="decompose"/g) ?? []).length;
      if (boxes === 0) fail(id + ' decompose block asks nothing — no answer box to discuss in');
      // ...and beat three in particular has to collect something. It is the one
      // beat that never decays, so at level 4 it is the ONLY thing still being
      // asked — a level-4 lesson whose connection is rhetorical has nothing
      // left in the block at all.
      if (connectBlock && !connectBlock[1].includes('data-block="decompose"')) {
        fail(id + '"connect it" beat talks about prior work but gives no box to write it in');
      }

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

      // The whole point of the third beat is activating PRIOR knowledge, so a
      // lesson may point back but never forward — "in 4.1 you did this" in
      // Unit 2 sends a student to a lesson that does not exist yet.
      //
      // Only the connect beat is checked. The body of a lesson may legitimately
      // say "next lesson we will...", and that is a preview rather than a claim
      // about prior knowledge; the block whose whole job is to say "you have
      // done this before" is the one that must not point at an unseen lesson.
      // The lookahead drops a decimal that is really a number: `1.5f` must not
      // read as lesson 1.5.
      const self = id.match(/^(\d+)\.(\d+)/);
      if (self && connectBlock) {
        const seen = new Set();
        for (const m of connectBlock[1].matchAll(/\b(\d{1,2}\.\d)(?![\w])/g)) seen.add(m[1]);
        for (const ref of seen) {
          if (!lessonIds.includes(ref)) continue; // not a lesson reference
          const other = ref.match(/^(\d+)\.(\d+)/);
          if (!other) continue;
          const ahead =
            Number(other[1]) > Number(self[1]) ||
            (Number(other[1]) === Number(self[1]) && Number(other[2]) > Number(self[2]));
          if (ahead) {
            fail(id + ' points forward to lesson ' + ref + ' in its "connect it" beat — ' +
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
    ok(decomposed + ' lessons carry the three recurring questions, decay verified');
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
  console.log('9. lab forms...');
  let labs = 0;
  for (const f of built) {
    const id = f.replace('.html', '');
    const html = fs.readFileSync(path.join(dist, 'lessons', f), 'utf8');
    const boxes = (html.match(/class="lab-answer"/g) ?? []).length;
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
  ok(labs + ' lessons with a lab form, every count matching its rendered boxes');
}

console.log('');
if (failures === 0) {
  console.log('VERIFY PASSED — ' + pages.length + ' pages, ' + links + ' links, ' + built.length + ' lessons.');
  process.exit(0);
} else {
  console.log('VERIFY FAILED — ' + failures + ' problem(s) above.');
  process.exit(1);
}
