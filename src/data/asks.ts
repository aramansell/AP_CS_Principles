/**
 * The "How do I…?" index.
 *
 * The course is sequenced for teaching. This file indexes it the way a student
 * actually reaches for help: not "Unit 3, lesson 2" but "how do I make a
 * projectile?" Every entry is a real question phrased the way a student would
 * type it into a search box, pointed at the lesson that answers it.
 *
 * Two rules for adding entries:
 *   1. Write the question in the student's words, not the curriculum's. "How do
 *      I make an object disappear?" — not "Object lifecycle management."
 *   2. `level` is the scaffolding that entry's lesson carries. It drives the
 *      badge shown on the index, and verify-site asserts that every ask points
 *      at a lesson that actually exists, AND that it agrees with whatever the
 *      lesson itself renders. A level here that the lesson contradicts is a
 *      build failure, on purpose.
 *
 * See src/lib/walkthrough.ts for what the levels mean.
 *
 * HOW TO ASSIGN A LEVEL — the ladder is per CONCEPT, not per week
 * This is the part that is easy to get wrong, so it is written down. The rule
 * is: the first time a concept appears, the student is walked through it. Every
 * later appearance of the SAME shape gets less. So the question to ask is never
 * "how far through the course are we" but "has this student built this shape
 * before, and is today's idea genuinely new?"
 *
 *   1  Full walkthrough — a mechanism the student has never built. Movement
 *      (1.4), the pickup (2.1), jump (6.1), C# events (5.2), the singleton
 *      (5.3) all introduce something with no precedent in this course.
 *   2  Guided build — a known shape carrying ONE new idea. The spike (2.2)
 *      reuses the pickup but adds "the world can push back"; the cooldown
 *      (3.3) reuses the turret but adds "not every frame"; the ground check
 *      (6.2) reuses the jump but adds "prove you are standing".
 *   3  Outline only — a build the student has done twice, where the new part
 *      is a variation rather than a mechanism. Health ceilings (2.3), spawning
 *      (2.4), detection ranges (3.1), enemies following you (4.3).
 *   4  Solo build — the same parts in a new arrangement, with nothing new at
 *      all. The projectile (3.2) is a coin with a direction. A double jump
 *      (6.4) is a jump with a counter.
 *
 * A lesson marked 3 or 4 that introduces a genuinely new mechanism is a bug in
 * THIS FILE, not a hard lesson — it hands a beginner a specification for
 * something they have never seen and no worked example to check against. That
 * is the exact failure this whole ladder was built to fix.
 */
import type { ScaffoldLevel } from '../lib/walkthrough';

export interface Ask {
  /** The question, in a student's words. Start lowercase; the page styles it. */
  q: string;
  /** Lesson id that answers it — must exist in src/data/lessons.ts. */
  lesson: string;
  /** One line on what the lesson actually gives you. */
  note: string;
  /** The scaffolding this lesson carries. */
  level: ScaffoldLevel;
}

export interface AskGroup {
  title: string;
  blurb: string;
  asks: Ask[];
}

export const ASK_GROUPS: AskGroup[] = [
  {
    title: 'Moving a character',
    blurb: 'Getting input, turning it into motion, and making it feel right.',
    asks: [
      { q: 'how do I print text to the console?', lesson: '1.3', note: 'Your first script: Start vs Update, and Debug.Log as your window into running code.', level: 1 },
      { q: 'how do I get input from the keyboard?', lesson: '1.4', note: 'Virtual axes vs raw keys, and why "Horizontal" beats hardcoding the D key.', level: 1 },
      { q: 'how do I move an object in Unity?', lesson: '1.4', note: 'The whole input → direction → translate pipeline, built line by line.', level: 1 },
      { q: 'why does my character move faster diagonally?', lesson: '1.5', note: 'Vector length, and what .normalized does about it.', level: 1 },
      { q: 'how do I make movement the same on every computer?', lesson: '1.5', note: 'Time.deltaTime, frame independence, and the live-tuning workflow.', level: 1 },
    ],
  },
  {
    title: 'Touching things',
    blurb: 'Detecting contact, and making something happen when it occurs.',
    asks: [
      { q: 'how do I detect a collision?', lesson: '2.1', note: 'Collider2D, Rigidbody2D, and the trigger-vs-collision distinction.', level: 1 },
      { q: 'how do I make a coin disappear when I touch it?', lesson: '2.1', note: 'OnTriggerEnter, tags, and your first piece of remembered state.', level: 1 },
      { q: 'how do I take damage when I touch a spike?', lesson: '2.2', note: 'Health, damage, and what happens when it reaches zero.', level: 2 },
      { q: 'how do I stop my character walking through walls?', lesson: '2.2', note: 'The payoff of the 1.4 discovery: choosing a movement method that respects physics.', level: 2 },
      { q: 'how do I heal, and how do I cap health at a maximum?', lesson: '2.3', note: 'Clamping a value, and why the cap belongs where the value changes.', level: 3 },
      { q: 'how do I spawn lots of the same object?', lesson: '2.4', note: 'Prefabs, Instantiate, and placing many copies from one definition.', level: 3 },
      { q: 'how do I add an item to my inventory?', lesson: '5.1', note: 'Boolean flags as the simplest possible inventory.', level: 2 },
    ],
  },
  {
    title: 'Making things happen at a distance',
    blurb: 'Detection ranges, projectiles, and enemies that react to you.',
    asks: [
      { q: 'how do I make a turret notice the player?', lesson: '3.1', note: 'Distance between two objects, and a detection radius.', level: 3 },
      { q: 'how do I shoot a projectile?', lesson: '3.2', note: 'Instantiate, direction vectors, and Destroy.', level: 4 },
      { q: 'how do I make an object disappear?', lesson: '3.2', note: 'Destroy, and the difference between hiding something and removing it.', level: 4 },
      { q: 'how do I stop shooting too fast?', lesson: '3.3', note: 'Cooldowns with Time.time — the interval pattern from 1.3, reused.', level: 2 },
      { q: 'how do I make an enemy chase me?', lesson: '4.3', note: 'An aggro radius, and moving toward a target you did not choose.', level: 4 },
      { q: 'how do I make an enemy follow a patrol route?', lesson: '4.1', note: 'Waypoints, and a state that runs without you.', level: 2 },
    ],
  },
  {
    title: 'Showing the player what is going on',
    blurb: 'Animation, on-screen text, and feedback.',
    asks: [
      { q: 'how do I play a walking animation?', lesson: '1.6', note: 'Animator parameters, and driving them from your own variables.', level: 1 },
      { q: 'how do I put my health on the screen?', lesson: '5.3', note: 'A Canvas HUD, and why it has to live in a different scene.', level: 1 },
    ],
  },
  {
    title: 'Scenes, doors and persistence',
    blurb: 'Moving between levels, and keeping what the player earned.',
    asks: [
      { q: 'how do I open a door with a key?', lesson: '5.2', note: 'Events — letting one object tell another that something happened.', level: 1 },
      { q: 'how do I switch scenes?', lesson: '5.3', note: 'SceneManager, and what happens to everything you were carrying.', level: 1 },
      { q: 'how do I keep my health when I change scenes?', lesson: '5.3', note: 'DontDestroyOnLoad, singletons, and the duplicate guard you will need.', level: 1 },
    ],
  },
  {
    title: 'Jumping and platforming',
    blurb: 'Gravity, ground checks, and making a jump feel good.',
    asks: [
      { q: 'how do I jump?', lesson: '6.1', note: 'Gravity, vertical velocity, and the first flick upward.', level: 1 },
      { q: 'why can I jump forever in mid-air?', lesson: '6.2', note: 'Ground checks — proving you are standing on something before you jump.', level: 2 },
      { q: 'how do I make a double jump?', lesson: '6.4', note: 'A counter, and resetting it on landing.', level: 3 },
      { q: 'how do I build a level out of tiles?', lesson: '7.1', note: 'Tilemaps, and collision that comes free with them.', level: 2 },
      { q: 'how do I climb a ladder?', lesson: '7.3', note: 'Climbing as a state, and switching off gravity while you are in it.', level: 3 },
    ],
  },
];

/** Flattened view — used by the page and by verify-site. */
export const ALL_ASKS: Ask[] = ASK_GROUPS.flatMap((g) => g.asks);
