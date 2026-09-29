/**
 * Answer keys for the MCQ practice sets, emitted at build time from
 * src/data/mcq-bank.ts as a static asset at /data/mcq-keys.json.
 *
 * Why an endpoint instead of inlining into the lessons: the lesson HTML is
 * served to students, and answers written into it are one View Source away.
 * Keeping the keys in a separate asset the grader fetches only when the
 * student presses "Grade this set" means the page source contains the
 * questions and nothing else.
 *
 * This is a courtesy, not a security boundary — the file is public, like
 * everything else on a static site, and a determined student can read it.
 * It exists so that casual skimming does not spoil the practice, and so the
 * teacher has one canonical key to check against.
 */
import type { APIRoute } from 'astro';
import {
  BIG_IDEA_RANGE,
  MCQ_SETS,
  MCQ_BANK,
  bigIdeaShare,
  questionsForSet,
  questionId,
  type MCQQuestion,
} from '../../data/mcq-bank';

interface KeyEntry {
  answer: string;
  ced: string;
  trap?: string;
  explain: string;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export const GET: APIRoute = () => {
  const keys: Record<string, KeyEntry> = {};
  const counts: Record<string, number> = {};

  for (const set of [1, 2, 3] as const) {
    const qs: MCQQuestion[] = questionsForSet(set);
    counts[MCQ_SETS[set].label] = qs.length;
    qs.forEach((q, i) => {
      keys[questionId(q, i)] = {
        answer: LETTERS[q.answer],
        ced: q.ced,
        ...(q.trap ? { trap: q.trap } : {}),
        explain: q.explain,
      };
    });
  }

  // Publishing the ranges alongside the measured shares lets verify-site
  // hold the weighting invariant against the shipped artifact, rather than
  // re-deriving it from the source with a fragile regex.
  const mixed = MCQ_BANK.filter((q) => q.set !== 2);
  const weighting = {
    note: 'Sets 1 and 3 are the mixed practice sets and track the exam\'s published big-idea ranges. Set 2 is the targeted data/networks remediation set, so it deliberately spikes BI2/BI4 and is excluded from the range assertion.',
    mixedSets: ['Practice Set 1', 'Practice Set 3'],
    ranges: Object.fromEntries(
      Object.entries(BIG_IDEA_RANGE).map(([k, v]) => [k, { min: v.min, max: v.max }]),
    ),
    mixed: bigIdeaShare(mixed),
    all: bigIdeaShare(MCQ_BANK),
  };

  const body = JSON.stringify(
    {
      format: 'apcsp-mcq-keys/1',
      note: 'Generated from src/data/mcq-bank.ts at build time. Do not edit by hand.',
      total: Object.keys(keys).length,
      counts,
      weighting,
      keys,
    },
    null,
    2,
  );

  return new Response(body, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
