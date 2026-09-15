/**
 * Decompose — the three questions every build lesson asks.
 *
 * WHY THIS EXISTS
 * The year has two learning targets that are bigger than any single API, and
 * they are the same two targets whether the student is writing a movement
 * script in September or a boss state machine in April:
 *
 *   1. BREAK THE PROBLEM DOWN. A whole game feature is too big to hold in
 *      your head, so the first move is always the same: cut it into parts
 *      small enough that each one is boring. "Move the player" is not one
 *      problem, it is get the input, build the vector, apply the movement.
 *      "Collect a coin" is not one problem either, it is confirm the thing
 *      that triggered was a coin, change the count, destroy the object.
 *      Students who cannot do this stare at a blank script and conclude they
 *      are bad at programming.
 *
 *   2. LOOK EACH PART UP. Once a part is small enough to name, it is small
 *      enough to search for. This is the whole skill of a working
 *      programmer, and it is a skill, not a consolation prize — the API
 *      tables and walkthroughs are deliberately written so that the reading
 *      happens per part rather than per project.
 *
 *   3. CONNECT IT TO SOMETHING YOU HAVE ALREADY BUILT. A spike is a coin
 *      with consequences. A projectile is a coin with a direction. The
 *      course is sequenced so that each lesson reactivates as much prior
 *      knowledge as possible, and that only pays off if somebody says the
 *      connection out loud. So the block asks.
 *
 * Those three questions are always the same three, so they are rendered by
 * one primitive and appear identically in every lesson. What DECAYS is how
 * much of the answer is given — the same ladder as the walkthrough, read
 * from the same `ScaffoldLevel`:
 *
 *   1  the parts are listed, each with what it does and where to read it
 *   2  the parts are listed, but the one carrying the new idea is a gap
 *   3  the parts are named and sourced, but what each one DOES is yours
 *   4  no parts at all — you do the splitting
 *
 * Beat 3 never decays. Asking "how is this like something we already did?"
 * is the point of the sequence, so it is asked at every level and answered
 * in every lesson. What changes is only how many connections the student has
 * to reach for on their own.
 *
 * The parts are rendered as a plain <ol>. The answer boxes are emitted at
 * the END of the block (see `turns`), all in one place, so the discussion is
 * captured by the same lab-answer mechanism as every bug hunt and tinker
 * challenge — see src/lib/formify.ts.
 */

import type { LessonFrame, ScaffoldLevel } from './walkthrough';
import { LEVEL_LABEL } from './walkthrough';
import { renderAnswerField } from './formify';

/** One part of a broken-down problem — one thing small enough to look up. */
export interface Part {
  /** The part as the student would name it: "Confirm it was a coin". */
  name: string;
  /** One line on what this part does. Withheld at level 3. */
  does?: string;
  /**
   * Where to read about this part — the API name, the lesson, or both.
   * Rendered under the part. Never withheld, at any level: a part you cannot
   * look up is not a part, it is the whole problem again wearing a shorter
   * name.
   */
  doc?: string;
  /** Optional link for `doc` (usually the lesson that taught it). */
  href?: string;
  /**
   * Level 2 only: this part is the one the student has to produce. Renders
   * as a gap, with the doc pointer still attached.
   */
  blank?: boolean;
}

/**
 * Which genre of lesson the block is sitting in. The three questions are the
 * same three in both, but the words are not: a lesson that ends in a script
 * can say "before any code" and "something you already built", and a lesson
 * about binary, hex or compression cannot — there is no code to write and
 * nothing was built.
 *
 * This exists because the teacher's rule is that the three discussions belong
 * in EVERY lesson, not only the ones with a file at the end. Without it, the
 * concept units (9 and 10) could not carry the block at all, and the rule
 * quietly became "every lesson that happens to produce code" — 17 of 81.
 *
 * The type lives in `walkthrough.ts`, next to the ladder vocabulary it
 * modifies, and `renderAskBanner` takes the same flag — a concept lesson must
 * not carry a code chip on its banner either.
 *
 * `build` is the default, so every existing lesson renders byte-for-byte what
 * it rendered before.
 */
export type DecomposeFrame = LessonFrame;

export interface DecomposeSpec {
  /** The problem in its whole, unbroken form — the thing being split up. */
  big: string;
  /** The parts, in the order they should be built. */
  parts: Part[];
  /** Build (default) or concept. Changes wording only, never structure. */
  frame?: DecomposeFrame;
  /**
   * Why this is the right split: the sentence that makes the decomposition
   * itself a taught thing rather than a list to memorise.
   */
  why?: string;
  /** How to tell the split is finished (the two-minute test). */
  sizeTest?: string;
  /**
   * Beat 3 — the connections to prior work. Always rendered, at every level,
   * as questions followed by answer boxes. Point them at lessons the student
   * has actually finished.
   */
  connect: string[];
  /** Any extra discussion questions specific to this lesson. */
  turns?: string[];
}

/** HTML-escape, then allow `code` and **bold** — same rules as a lesson body. */
function prose(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** How many parts the student is handed, as opposed to working out. */
function countGiven(spec: DecomposeSpec, level: ScaffoldLevel): number {
  if (level >= 4) return 0;
  if (level === 2) return spec.parts.filter((p) => !p.blank).length;
  return spec.parts.length;
}

/**
 * One question of the closing discussion, with its answer box. Ids follow
 * the same scheme as every other lab field (`1.4:dc1:q2` = lesson 1.4, this
 * block, second question), so the teacher's export reads the same way.
 */
function turn(lessonId: string, block: string, n: number, question: string): string {
  return '<p>' + prose(question) + '</p>' + renderAnswerField(lessonId + ':' + block + ':q' + n, 'decompose', question);
}

function renderPart(p: Part, level: ScaffoldLevel): string {
  const doc = p.doc
    ? '<span class="dc-doc">Read: ' +
      (p.href ? '<a href="' + p.href + '">' + prose(p.doc) + '</a>' : prose(p.doc)) +
      '</span>'
    : '';

  // Level 2: the part carrying the new idea is the student's to produce. The
  // doc pointer stays, because finding the answer in the reading is the
  // skill being practised — not guessing the answer.
  if (level === 2 && p.blank) {
    return '<li class="dc-part dc-part-blank"><span class="dc-gap">write this part</span>' + doc + '</li>';
  }

  // Level 3: the parts are named and sourced, but what each one DOES is the
  // student's to work out — which is exactly the level-3 bargain: spec and
  // API given, no code, and the reasoning still yours.
  const does =
    level >= 3
      ? '<span class="dc-does dc-gap">what does this part do?</span>'
      : p.does
        ? '<span class="dc-does">' + prose(p.does) + '</span>'
        : '';

  return '<li class="dc-part"><span class="dc-name">' + prose(p.name) + '</span>' + does + doc + '</li>';
}

/**
 * Render the recurring three-beat block for a lesson.
 *
 * @param lessonId  the lesson's id, used for stable answer-box ids
 * @param spec      the decomposition for this lesson's problem
 * @param level     where the lesson sits on the scaffolding ladder
 */
export function renderDecompose(lessonId: string, spec: DecomposeSpec, level: ScaffoldLevel): string {
  const given = countGiven(spec, level);
  // Counts reflect what is SHOWN, not what the source lists: at level 4 no
  // part is rendered, so reporting four sourced parts would be a lie the
  // verifier would then check against nothing.
  const docs = level >= 4 ? 0 : spec.parts.filter((p) => p.doc).length;

  const concept = spec.frame === 'concept';

  const parts =
    level >= 4
      ? '<p class="dc-empty">No parts listed here on purpose. Splitting the problem up ' +
        '<em>is</em> the work of this lesson — write your list before you ' +
        (concept ? 'read on.</p>' : 'open the file.</p>')
      : '<ol class="dc-parts">' + spec.parts.map((p) => renderPart(p, level)).join('') + '</ol>';

  // The tail: one level-appropriate question, the lesson's own discussion
  // questions, then the connections. Always at least the connections, so
  // every lesson in the course asks the prior-knowledge question in writing.
  const asks: string[] = [];
  if (level >= 4) {
    asks.push('List the parts of this problem, in the order you would build them.');
  } else if (level === 3) {
    asks.push('Pick two of the parts above and say in one line what each one actually does.');
  }
  asks.push(...(spec.turns ?? []));
  asks.push(...spec.connect);

  const block = lessonId + ':dc1';
  const turns = asks.map((q, i) => turn(lessonId, 'dc1', i + 1, q)).join('');

  // The two genre differences, in one place. `frame` changes wording only —
  // no attribute, class or answer box moves, so a lesson's saved answers are
  // untouched by switching it.
  // A concept lesson carries no code, so the code-scaffolding badge would be a
  // claim about something that does not exist. It is omitted rather than
  // reworded: inventing a second ladder vocabulary would put a word on screen
  // the teacher never asked for and no other page uses.
  const badge = concept
    ? ''
    : '<span class="dc-level">' + LEVEL_LABEL[level] + '</span>';
  const askLead = concept
    ? '<strong>First, before anything else:</strong> cut that into parts small enough '
    : '<strong>First, before any code:</strong> cut that into parts small enough ';
  const connectLead = concept
    ? '<h4>Connect it to something you already know</h4>'
    : '<h4>Connect it to something you already built</h4>';

  return (
    '<div class="activity decompose" data-level="' + level + '" data-parts="' + spec.parts.length +
    '" data-given="' + given + '" data-docs="' + docs + '"' +
    (concept ? ' data-frame="concept"' : '') + '>' +
    '<div class="activity-header">' +
    '<span class="activity-label">Break It Down</span>' +
    '<span class="activity-time">~10 min</span>' +
    badge +
    '</div>' +
    '<p class="dc-big">' + prose(spec.big) + '</p>' +
    '<p class="dc-ask">' + askLead +
    'that you could look each one up on its own.</p>' +
    parts +
    (spec.why ? '<p class="dc-why">' + prose(spec.why) + '</p>' : '') +
    (spec.sizeTest ? '<p class="dc-size">' + prose(spec.sizeTest) + '</p>' : '') +
    '<div class="dc-connect">' +
    connectLead +
    '<p>Very little in this course is new. Most of it is something you have already done, ' +
    'pointed in a different direction — and saying which one out loud is how you stop ' +
    'relearning it every time.</p>' +
    turns +
    '</div>' +
    '</div>'
  );
}
