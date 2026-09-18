#!/usr/bin/env node
/**
 * Scaffold a new lesson page: npm run new-lesson -- <id> [title]
 * The id must already exist in SEQUENCE (curriculum.ts) and lessons.ts.
 * Writes src/pages/lessons/<id>.astro from the standard template.
 */
import fs from 'node:fs';
import path from 'node:path';

const [id, ...rest] = process.argv.slice(2);
if (!id || !/^\d+\.\d+[a-z]?$/.test(id)) {
  console.error('Usage: npm run new-lesson -- <id> [title]   e.g. npm run new-lesson -- 5.11 "New Topic"');
  console.error('  Units 1-9 use flat ids (5.11); jam/PT units use a letter suffix (10.1g).');
  process.exit(1);
}

const lessonsFile = path.resolve('src/data/lessons.ts');
const lessonsSrc = fs.readFileSync(lessonsFile, 'utf8');

// line scan: no regex-escaping games
let realTitle = null;
for (const line of lessonsSrc.split('\n')) {
  const t = line.trim();
  if (t.startsWith("'" + id + "': {")) {
    const m = /title: "([^"]+)"/.exec(line);
    if (m) { realTitle = m[1]; break; }
  }
}
if (!realTitle) {
  console.error('Lesson ' + id + ' is not in src/data/lessons.ts — add its metadata there (and to SEQUENCE in curriculum.ts) first.');
  process.exit(1);
}
const displayTitle = rest.length ? rest.join(' ') : realTitle;

const target = path.resolve('src/pages/lessons', id + '.astro');
if (fs.existsSync(target)) {
  console.error('Lesson page already exists: ' + target);
  process.exit(1);
}

const B = String.fromCharCode(96); // backtick
const tpl = [
  '---',
  '// Lesson ' + id + ' — ' + displayTitle,
  '// <what the lesson does in one or two lines>',
  "import Lesson from '../../layouts/LessonLayout.astro';",
  "import { renderAskBanner } from '../../lib/walkthrough';",
  "import { renderDecompose } from '../../lib/decompose';",
  "import type { DecomposeSpec } from '../../lib/decompose';",
  '',
  '// Where this lesson sits on the scaffolding ladder: 1 full walkthrough,',
  '// 2 guided, 3 outline only, 4 solo. Levels 1-2 must render a walkthrough —',
  '// verify-site fails a lesson that claims one without it. See',
  '// src/lib/walkthrough.ts for the ladder and the frame vocabulary.',
  'const LEVEL = 1;',
  '',
  '// The recurring two-beat block: split the problem, look each part up.',
  '// At LEVEL 1-2 every part needs BOTH `does` and `doc` — a part with no',
  '// reading attached is not a part yet, it is the whole problem wearing a',
  '// shorter name. At LEVEL 3 and up `does` is withheld on purpose and the',
  '// student supplies it.',
  '//',
  '// Every `doc`/`href` must point at a lesson the student has ALREADY finished.',
  '// The verifier scans the turns for forward references and fails on them.',
  'const DECOMPOSE: DecomposeSpec = {',
  "  big: 'The whole problem, in the words a student would use for it.',",
  '  parts: [',
  "    { name: '<name the part>', does: '<what it does>', doc: '<API or lesson>', href: '../docs/reference/unity-csharp-quickref.html' },",
  "    { name: '<name the part>', does: '<what it does>', doc: '<API or lesson>' },",
  '  ],',
  "  why: 'Why this is the right split — the sentence that makes the splitting itself the taught thing.',",
  "  sizeTest: 'How to tell the split is finished — the two-minute test.',",
  '  turns: [',
  "    '<a discussion question specific to this lesson>',",
  '  ],',
  '};',
  '',
  'const body = ' + B + '<h1>' + id + ' — ' + displayTitle + '</h1>',
  '',
  '<p class="lesson-lead">',
  '    One or two sentences: what this lesson is about and why it matters.',
  '</p>',
  '',
  '<!-- ============================================================ -->',
  '<div class="activity basic-app">',
  '    <div class="activity-header">',
  '        <span class="activity-label">Build Lab</span>',
  '        <span class="activity-time">~40 min</span>',
  '    </div>',
  '',
  '${renderAskBanner(' + "'<the question this lesson answers>'" + ', LEVEL)}',
  '${renderDecompose(' + "'" + id + "'" + ', DECOMPOSE, LEVEL)}',
  '',
  '    <p>Steps...</p>',
  '</div>',
  '',
  '<!-- ============================================================ -->',
  '<div class="socratic">',
  '    <h3>Socratic: <topic></h3>',
  '    <ol>',
  '        <li><question one?></li>',
  '        <li><question two?></li>',
  '        <li><question three?></li>',
  '    </ol>',
  '</div>',
  '',
  '<!-- ============================================================ -->',
  '<div class="checklist">',
  '    <h3>Checkpoint — before moving on, you must be able to:</h3>',
  '    <ul>',
  '        <li>...</li>',
  '    </ul>',
  '</div>',
  '',
  '<!-- ============================================================ -->',
  '<div class="resources">',
  '    <h3>Reference Docs</h3>',
  '    <p>Need a deeper explanation? These pages cover the same concepts:</p>',
  '    <ul>',
  '        <li><a href="../docs/unit-01/index.html">Unit 1: Setup &amp; Movement</a></li>',
  '    </ul>',
  '</div>' + B + ';',
  '---',
  '<Lesson id="' + id + '" title="' + id + ' ' + displayTitle + ' — AP CS Principles" root=".." css="../style.css">',
  '  <Fragment set:html={body} />',
  '</Lesson>',
  '',
].join('\n');

fs.writeFileSync(target, tpl);
console.log('Created ' + target);
console.log('Title from lessons.ts: ' + realTitle + '. Build it out, then npm run build && npm run verify.');
console.log('Reminders: ONE socratic block, at most 3 questions — it is the lesson lab form.');
console.log('  A tinker or bug-hunt block, a pitfalls list and a decompose `connect` beat are all retired.');
