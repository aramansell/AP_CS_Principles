/**
 * Walkthrough — the "build it with me" primitive.
 *
 * WHY THIS EXISTS
 * Every build lab used to be the same three beats: an API table, three
 * one-line snippets from foreign domains (a forklift, a lighthouse), and a
 * callout listing ten questions with no worked code. The theory was that a
 * student assembles the script from documentation. For a student who has
 * never programmed, that is not a scaffold — it is a blank page with
 * questions on it, and it is the leap they could not make.
 *
 * A walkthrough replaces "here are the questions" with "here is the code,
 * and here is what every single part of it does." It is deliberately
 * complete: nothing is withheld that a beginner would need. It is also
 * deliberately NOT copy-pasteable as one blob — the code arrives in steps,
 * each step explained before the next arrives, so the student types it and
 * understands it as they go.
 *
 * THE SCAFFOLDING LADDER
 * Completeness is not a global setting; it decays across the course. The
 * first time a concept appears the student gets the full treatment. Later,
 * when the concept returns wearing different clothes, they get less. The
 * `level` field records where a lesson sits so the ladder stays visible
 * (and checkable) rather than drifting by accident.
 *
 *   1  full        every line given and explained  (1.4 movement, 2.1 coin)
 *   2  guided      the shape given, gaps to fill    (2.2 spike)
 *   3  outline     the spec and the API, no code    (2.3, 2.4)
 *   4  solo        the problem only                 (3.2 projectile)
 *
 * Level 1 is expressed by giving every line. Level 2 is expressed by marking
 * individual lines `blank` — the student still sees the whole shape of the
 * file, including the parts they have met before, but the line carrying the
 * NEW idea is left for them to produce. That is the difference between
 * "a little less" and "nothing": the frame stays, one line goes.
 *
 * At level 2 and above the finished file moves behind a <details> disclosure.
 * It is still there, because a student who missed class must be able to catch
 * up (see the module comment) — but it is now a deliberate act to look rather
 * than the default view, which is what makes the gaps real. At level 1 the
 * file stays open, because a first-timer has nothing to check against yet.
 *
 * See also the "How do I…?" index (src/pages/docs/ask.astro), which is the
 * same material indexed the way a student actually searches for it.
 */

/** Where a lesson sits on the scaffolding ladder. */
export type ScaffoldLevel = 1 | 2 | 3 | 4;

export const LEVEL_LABEL: Record<ScaffoldLevel, string> = {
  1: 'Full walkthrough',
  2: 'Guided build',
  3: 'Outline only',
  4: 'Solo build',
};

/**
 * Which genre of lesson is carrying the ladder furniture.
 *
 * `LEVEL_LABEL` above is code vocabulary, and it is only true of a lesson that
 * ends in a script. A lesson about binary, compression or encryption has no
 * file to hand over, so a chip reading "Outline only" is a claim about
 * something that does not exist — and inventing a second ladder vocabulary
 * would put a word on screen the teacher never asked for and no other page
 * uses.
 *
 * So a `concept` lesson keeps every structural part of the ladder — the
 * `data-scaffold` attribute, the rung number, the decompose decay, and the
 * checks in scripts/verify-site.mjs that read them — and drops only the
 * visible chip. Wording changes; nothing that is checked does.
 *
 * Note the levels that are reachable: check 7 fails a lesson that declares
 * level 1 or 2 without rendering a walkthrough, so a concept lesson (which
 * never renders one) sits at 3 or 4 by construction.
 */
export type LessonFrame = 'build' | 'concept';

/** One line of code and the plain-English account of what it does. */
export interface CodeLine {
  /**
   * The code exactly as it should appear, indentation included. On a `blank`
   * line this is instead the placeholder text drawn in the gap — pass the
   * shape of the answer (`____ = ____;`) when the shape is the hint, or leave
   * it empty to draw a bare rule.
   */
  code: string;
  /**
   * What this line does, in words a first-time programmer already has.
   * Supports `inline code` and **bold**. Leave empty for a blank
   * spacer line — it will be shown but not annotated.
   *
   * On a `blank` line this is the prompt: it must say precisely what the
   * student is being asked to produce, because for that line it is the only
   * instruction they get.
   */
  what: string;
  /**
   * Why it has to be this way, or what breaks if you do it differently.
   * This is where the misconceptions actually get killed, so use it for
   * the things students get wrong rather than for restating `what`.
   */
  why?: string;
  /**
   * The student writes this line, not you. Use it for the one line in a step
   * that carries the new idea — the rest of the step stays given, so the
   * frame is intact and exactly one thing is being asked of them.
   *
   * A blank line MUST have a `what`; it is the prompt. `rendersWalkthrough`
   * counts them, and verify-site refuses a level-2 lesson with none.
   */
  blank?: boolean;
  /**
   * An extra nudge under a blank, for the student who reads the prompt and
   * still does not know where to start. Put the *name* of the thing to reach
   * for here, never the answer itself.
   */
  hint?: string;
  /**
   * Where to read about the API this line uses — the quick reference row, the
   * lesson that taught it, or both. Rendered as a link under the annotation.
   *
   * Put this on the line that CARRIES a new API, not on every line that calls
   * one. A step where four lines each link to the same table teaches the
   * student to stop reading the annotations, which costs more than the links
   * are worth. `href` is relative to a lesson page (e.g.
   * `../docs/reference/unity-csharp-quickref.html`).
   */
  doc?: string;
  href?: string;
}

/** One increment of the build: a few lines, framed by a sub-problem. */
export interface Step {
  /** Imperative and concrete: "Declare the fields at class scope". */
  title: string;
  /** One or two sentences on the problem this step solves. */
  lead?: string;
  lines: CodeLine[];
}

export interface WalkthroughSpec {
  /** The literal question this walkthrough answers, in a student's words. */
  ask: string;
  /** The file being edited, e.g. "Assets/Scripts/PlayerController.cs". */
  file: string;
  /** What the student will have at the end of this walkthrough. */
  intro: string;
  /**
   * The block's header label. Defaults to "Build It With Me".
   *
   * Lessons converted to the editor/code split pass "In the Code", so the file
   * half of the lesson carries the same explicit name as the "In the Editor"
   * block above it — a student should never have to work out which half of the
   * work they are in. verify-site asserts the two labels travel together, so a
   * half-converted lesson fails rather than reading as one thing.
   */
  label?: string;
  /** Scaffolding level — drives the badge, and is asserted by verify-site. */
  level: ScaffoldLevel;
  steps: Step[];
  /**
   * The finished file. This is a check-your-work reference for students who
   * missed class, deliberately placed AFTER the steps so it cannot be pasted
   * as a shortcut past the explanation. See the module comment.
   */
  finalFile?: string;
  /** One line on what to do with the finished file. */
  finalNote?: string;
}

/** HTML-escape. Prose may contain `<`, `>`, `&`; code definitely does. */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Escape, then allow `code`, **bold** and *italic* in prose. Escape always comes first. */
function prose(s: string): string {
  const out = esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italics run last and never inside a code span: `*` is multiplication in C#,
  // so `` `a*b*c` `` has to survive untouched, and the "no space just inside the
  // markers" rule is what keeps prose arithmetic like `3 * 4 * 5` from turning
  // into emphasis. Both are load-bearing; neither is decoration.
  return out
    .split(/(<code>[\s\S]*?<\/code>)/g)
    .map((part, i) => (i % 2 ? part : part.replace(/(?<!\*)\*(?!\s)([^\s*](?:[^*\n]*[^\s*])?)(?<!\s)\*(?!\*)/g, '<em>$1</em>')))
    .join('');
}

/** How many lines across a spec the student has to write themselves. */
export function countBlanks(spec: WalkthroughSpec): number {
  return spec.steps.reduce((n, s) => n + s.lines.filter((l) => l.blank).length, 0);
}

function renderStep(step: Step, index: number): string {
  // Line numbers restart per step: each step is self-contained, and the
  // annotations below the code refer to these numbers.
  const code = step.lines
    .map((l, i) => {
      const n = i + 1;
      const cls = ['wt-line'];
      if (l.why) cls.push('wt-line-why');
      if (l.blank) cls.push('wt-blank');
      // A blank line draws its `code` as the placeholder. Empty `code` means
      // a bare rule — the student supplies the whole line, not just a value.
      const body = l.blank
        ? '<span class="wt-gap">' + esc(l.code.trim() === '' ? '________________' : l.code) + '</span>'
        : esc(l.code);
      // The line number is carried in data-n and drawn by CSS (see .wt-line
      // ::before in public/style.css). It is decoration: on screen it sits in
      // the gutter, but in the TEXT it is absent, so copying a step out of the
      // page gives you the code and not "1using UnityEngine;23public class".
      return '<span class="' + cls.join(' ') + '" data-n="' + n + '">' + body + '</span>';
    })
    // Joined with a real newline, so the source reads one line per line.
    // .wt-line is display:block, so the browser breaks lines with or without
    // it — but anything that reads the TEXT rather than the rendered page (a
    // copy-paste, a text extract, a screen reader) has no CSS, and without
    // these newlines the whole file arrives as one unbroken line.
    //
    // The container is <pre>, so a newline between two .wt-line spans would
    // otherwise render as a visible blank line; .wt-code > code sets
    // white-space:normal to collapse it. See public/style.css.
    .join('\n');

  const annots = step.lines
    .map((l, i) => ({ line: l, n: i + 1 }))
    .filter((x) => x.line.what.trim() !== '')
    .map((x) => {
      let out = '<li' + (x.line.blank ? ' class="wt-your-turn"' : '') + '>';
      // A blank is a thing to DO, so it is labelled as such rather than left
      // to read like every other annotation.
      if (x.line.blank) out += '<span class="wt-turn-tag">Your turn</span>';
      out += '<span class="wt-ref">' + x.n + '</span><span class="wt-what">' + prose(x.line.what) + '</span>';
      if (x.line.hint) out += '<span class="wt-hint">' + prose(x.line.hint) + '</span>';
      if (x.line.why) out += '<span class="wt-why">' + prose(x.line.why) + '</span>';
      if (x.line.doc) {
        out += '<span class="wt-doc">Read: ' +
          (x.line.href
            ? '<a href="' + esc(x.line.href) + '">' + prose(x.line.doc) + '</a>'
            : prose(x.line.doc)) +
          '</span>';
      }
      out += '</li>';
      return out;
    })
    // One annotation per line in the source too. This <ol> is not a <pre>, so
    // the newline collapses on screen and costs nothing.
    .join('\n');

  return (
    '<div class="wt-step">' +
    '<h4 class="wt-step-title"><span class="wt-num">Step ' + (index + 1) + '</span>' + prose(step.title) + '</h4>' +
    (step.lead ? '<p class="wt-lead">' + prose(step.lead) + '</p>' : '') +
    '<pre class="wt-code"><code>' + code + '</code></pre>' +
    '<ol class="wt-annot">' + annots + '</ol>' +
    '</div>'
  );
}

/**
 * Render a full walkthrough. Returns an HTML string for interpolation into a
 * lesson body (which is itself a template literal rendered via set:html).
 */
export function renderWalkthrough(spec: WalkthroughSpec): string {
  const steps = spec.steps.map((s, i) => renderStep(s, i)).join('');

  const finalNote = prose(
    spec.finalNote ??
      'Do not paste this in. Compare it against what you built — every line should be one you can explain.'
  );

  // The reference file carries its own marker INSIDE the code block, because
  // the note above it does not survive a copy: it is outside the artifact, so
  // a pasted file arrived looking exactly like the student's own work. This
  // header is what travels with the paste, and it is the difference between
  // "you cannot prove I pasted this" and "this is the reference file."
  //
  // It is deliberately not an accusation and not a trap. A student who reads
  // the file and then writes their own never sees it again. A student who
  // hands it in unchanged has handed in a file whose first line says what it
  // is AND what to do about it — go back and build it one step at a time.
  // That is the whole point: it hands the teacher the conversation, and it
  // hands the student the instruction, in the same four lines.
  const isCode = (s: string) => /[;{}]/.test(s);
  const refHeader =
    spec.finalFile && isCode(spec.finalFile)
      ? [
          '// ' + '-'.repeat(66),
          '//  REFERENCE FILE — ' + (spec.file || 'the finished script'),
          '//  Written to be read, not pasted. Build it with the walkthrough',
          '//  above, one step at a time, then open this and compare.',
          '//  If it is sitting in your project unchanged, that is the thing',
          '//  to go and do now — the walkthrough is still above you.',
          '// ' + '-'.repeat(66),
          '',
        ].join('\n')
      : '';

  const finalCode =
    '<pre class="wt-code wt-code-full"><code>' +
    esc(refHeader + (spec.finalFile ?? '')) +
    '</code></pre>';

  // The answer key is a deliberate act to open, at EVERY level — including
  // level 1. It is never removed: a student who missed class still has to be
  // able to catch up alone, and the whole reason every line is written down
  // the first time is so that it can be found again later. But it is never
  // lying open at the bottom of the page either.
  //
  // This was wrong in the first cut: the gate was applied at level 2 and up,
  // which is exactly backwards. Level 1 is the lesson with no gaps at all, so
  // a student who is going to paste has the least to lose by skipping to the
  // bottom — and that is the newest student in the course. A block of code
  // sitting open at the end of the page with "do not paste this in" written
  // above it is not a warning, it is a target.
  const finalPeek = spec.level === 1
    ? 'build it as you read &mdash; then open this to check every line'
    : 'try every gap first &mdash; then open this to compare';
  const finalFile = !spec.finalFile
    ? ''
    : '<details class="wt-final wt-gated">' +
      '<summary>' +
      '<span class="wt-gated-title">Check your work: the finished file</span>' +
      '<span class="wt-gated-peek">' + finalPeek + '</span>' +
      '</summary>' +
      '<p class="wt-lead">' + finalNote + '</p>' +
      finalCode +
      '</details>';

  const blanks = countBlanks(spec);
  const gapLine = blanks
    ? '<p class="wt-gapcount">This build leaves <strong>' + blanks +
      (blanks === 1 ? ' line' : ' lines') +
      '</strong> for you to write. Everything around ' +
      (blanks === 1 ? 'it is' : 'them is') +
      ' given, so you always know the shape of what you are producing.</p>'
    : '';

  return (
    '<div class="activity walkthrough" data-scaffold="' + spec.level + '" data-gaps="' + blanks + '">' +
    '<div class="activity-header">' +
    '<span class="activity-label">' + (spec.label ?? 'Build It With Me') + '</span>' +
    '<span class="activity-time">' + LEVEL_LABEL[spec.level] + '</span>' +
    '</div>' +
    '<p class="wt-ask"><span class="wt-ask-label">The question this answers</span>' +
    '&ldquo;' + prose(spec.ask) + '&rdquo;</p>' +
    '<p class="wt-lead wt-file">You are editing <code>' + esc(spec.file) + '</code>. ' + prose(spec.intro) + '</p>' +
    gapLine +
    steps +
    finalFile +
    '</div>'
  );
}

/**
 * A one-line banner naming the question a lesson answers, for lessons that
 * do not carry a full walkthrough (the later, solo end of the ladder).
 */
export function renderAskBanner(ask: string, level: ScaffoldLevel, frame: LessonFrame = 'build'): string {
  // A concept lesson keeps `data-scaffold` — the checks read it, and the rung
  // is a real statement about how much of the decomposition is handed over —
  // and drops only the code-scaffolding chip, for the reason in `LessonFrame`.
  const chip =
    frame === 'concept'
      ? ''
      : '<span class="ask-banner-level">' + LEVEL_LABEL[level] + '</span>';
  return (
    '<div class="ask-banner" data-scaffold="' + level + '"' +
    (frame === 'concept' ? ' data-frame="concept"' : '') + '>' +
    '<span class="ask-banner-label">In this lesson you will be able to answer</span>' +
    '<span class="ask-banner-q">&ldquo;' + prose(ask) + '&rdquo;</span>' +
    chip +
    '</div>'
  );
}
