/**
 * MCQ renderer — build-time. Turns a set from src/data/mcq-bank.ts into the
 * interactive practice markup that lands inside a lesson body.
 *
 * Why build-time: the lesson bodies are template strings rendered through
 * `set:html`, so nothing in them can run a script. Everything interactive
 * therefore lives in public/js/mc-quiz.js, and this module's only job is to
 * emit markup that script can find — with the ids and data attributes it
 * expects. Answer keys and explanations are NOT emitted here; they are
 * fetched at grade time from /data/mcq-keys.json, so a student reading the
 * page source finds the questions and their own choices and nothing else.
 *
 * The hidden `.lab-answer` textarea per question is the bridge to the
 * existing lab-forms pipeline: lab-forms.js restores, saves, counts, and
 * downloads every `textarea.lab-answer` it finds, so MCQ answers ride into
 * the same answers .json the teacher already collects — no changes needed
 * on that side.
 */
import {
  BIG_IDEA_RANGE,
  MCQ_SETS,
  questionsForSet,
  questionId,
  type MCQQuestion,
} from '../data/mcq-bank';

/** Escape for a text node inside <pre><code>. */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Escape for a double-quoted HTML attribute. */
function attr(s: string): string {
  return esc(s).replace(/"/g, '&quot;');
}

/** Crude tag strip for the self-describing `data-question` attribute. */
function plain(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const LETTERS = ['A', 'B', 'C', 'D'];

function renderQuestion(q: MCQQuestion, index: number): string {
  const qid = questionId(q, index);
  const n = index + 1;

  const code = q.code ? '<pre class="mc-code"><code>' + esc(q.code) + '</code></pre>' : '';

  const choices = q.choices
    .map(
      (c, i) =>
        '<label class="mc-choice">' +
        '<input type="radio" name="' + attr(qid) + '" value="' + LETTERS[i] + '" ' +
        'data-q="' + attr(qid) + '">' +
        '<span class="mc-letter">' + LETTERS[i] + '</span>' +
        '<span class="mc-choice-text">' + c + '</span>' +
        '</label>',
    )
    .join('');

  return (
    '<div class="mc-question" data-q="' + attr(qid) + '" data-ced="' + attr(q.ced) + '" data-n="' + n + '">' +
    '<p class="mc-stem"><span class="mc-num">' + n + '.</span> ' + q.stem +
    '<span class="mc-ced">' + q.ced + '</span></p>' +
    code +
    '<div class="mc-choices" role="group" aria-label="Question ' + n + '">' + choices + '</div>' +
    '<p class="mc-result" hidden></p>' +
    // Hidden bridge textarea — lab-forms.js owns persistence of this element.
    '<textarea class="lab-answer mc-bridge" hidden data-q="' + attr(qid) + '" data-block="mc" ' +
    'data-question="' + attr('[' + q.ced + '] ' + plain(q.stem).slice(0, 240)) + '"></textarea>' +
    '</div>'
  );
}

/**
 * Render a full practice set: header, questions, the grade button, and the
 * (initially hidden) scorecard the client fills in with the family error
 * table the lessons ask students to build by hand.
 */
export function renderMcqSet(set: 1 | 2 | 3, keysPath: string): string {
  const qs = questionsForSet(set);
  if (qs.length === 0) throw new Error('mcq set ' + set + ' has no questions in the bank');
  const meta = MCQ_SETS[set];

  const header =
    '<div class="activity-header">' +
    '<span class="activity-label">' + meta.label + '</span>' +
    '<span class="activity-time">' + qs.length + ' questions, ' + meta.minutes + ' min</span>' +
    '</div>' +
    '<p class="mc-blurb"><strong>' + qs.length + ' questions in ' + meta.minutes +
    ' minutes.</strong> ' + meta.focus.charAt(0).toUpperCase() + meta.focus.slice(1) +
    '. Answer every question — there is no penalty for guessing, and a blank scores like a wrong one. ' +
    'When the timer stops, press <em>Grade this set</em> for your scorecard and the family error table.</p>';

  return (
    '<div class="activity assessment mc-quiz" data-set="' + set + '" data-keys="' + attr(keysPath) + '" ' +
    'data-count="' + qs.length + '" data-pagefind-ignore>' +
    header +
    '<div class="mc-questions">' +
    qs.map((q, i) => renderQuestion(q, i)).join('') +
    '</div>' +
    '<div class="mc-actions">' +
    '<button type="button" class="mc-grade">Grade this set</button>' +
    '<span class="mc-progress">0/' + qs.length + ' answered</span>' +
    '</div>' +
    '<div class="mc-scorecard" hidden></div>' +
    '<p class="mc-note">Your answers save on this device and are included in the ' +
    'answers .json you download at the end of the lesson.</p>' +
    '</div>'
  );
}

/** Big-idea legend for the coverage note on the teacher page. */
export function bigIdeaLegend(): { name: string; range: string }[] {
  return Object.entries(BIG_IDEA_RANGE).map(([name, r]) => ({
    name,
    range: r.min + '-' + r.max + '%',
  }));
}
