#!/usr/bin/env node
/**
 * Scaffold a new lesson page: npm run new-lesson -- <id> [title]
 * The id must already exist in SEQUENCE (curriculum.ts) and lessons.ts.
 * Writes src/pages/lessons/<id>.astro from the standard template.
 */
import fs from 'node:fs';
import path from 'node:path';

const [id, ...rest] = process.argv.slice(2);
if (!id || !/^\d+\.\d+[a-z]$/.test(id)) {
  console.error('Usage: npm run new-lesson -- <id> [title]   e.g. npm run new-lesson -- 9.11a "New Topic"');
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
  '    <p>Steps...</p>',
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
