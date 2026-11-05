/**
 * Master curriculum data for the IBW AP CS Principles course, 2026-27.
 *
 * ONE source of truth. Everything data-driven on the site derives from this
 * file at build time:
 *   - the dashboard lesson lists (src/pages/index.astro)
 *   - the pacing calendar (src/pages/pace.astro) and PACING.md
 *   - the CED coverage matrix (src/pages/docs/coverage.astro)
 *   - the prev/next chain on every lesson page (src/layouts/LessonLayout.astro)
 *
 * Course shape (Unity all year, on B days):
 *   Phase 1  Units 1-5  The Overworld  — fork the starter, movement, stats,
 *                                        turret, enemy AI, axe & cave door
 *   Phase 2  Units 6-8  The Cave        — jump, double jump, tilemaps, ladders,
 *                                        level design, boss fight + final
 *   Phase 3  Unit 9     Data & Systems  — binary, compression, datasets,
 *                                        systems, the Internet, encryption,
 *                                        impact & ethics (the CSP big ideas
 *                                        Unity does not teach on its own)
 *   Phase 4  Unit 10    Jam Season      — 2-Button Jam, Card Game Jam
 *                                        (lists, arrays, ScriptableObjects)
 *   Phase 5  Unit 11    Create PT+Exam  — Create performance task (30%),
 *                                        MC + written-response sprint
 *   Phase 6  Unit 12    Season 2        — post-exam jams + placeholders
 *
 * AP CSP exam: Friday May 14, 2027, 8:00 AM (Session 1).
 * Create PT due: Friday April 30, 2027, 11:59 PM ET (AP Digital Portfolio).
 */

export const EXAM_DATE = '2027-05-14';
export const EXAM_TIME = '8:00 AM (Session 1)';
export const CPT_DEADLINE = '2027-04-30';

/** B-day calendar for IBW 2026-27, taken from the IBW Trivory calendar
 *  (trivory.com/ibw/calendar, read Sept 2026). The district alternates A/B
 *  on every school day; "Flex B" days are B days on a modified schedule
 *  and count as normal class days for this course. The January finals day
 *  Jan 21 is the B-side of finals week - the semester 1 final runs on it,
 *  on the normal bell schedule. June finals days (Jun 4-8) carry no A/B
 *  label and are not class days: the last B day of the year is Jun 3, and
 *  the semester 2 final meets on this course's period during June finals.
 *  Cross-check: the 83 A days derived from the same Trivory read match the
 *  AP CS A course's A_DAYS 1:1. Re-check Trivory if snow make-up days
 *  shift the alternation. */
export const B_DAYS: string[] = [
  // September 2026 (first student day of the year is Aug 31, an A day)
  '2026-09-01', '2026-09-03', '2026-09-08', '2026-09-10', '2026-09-14',
  '2026-09-16', '2026-09-18', '2026-09-22', '2026-09-24', '2026-09-28',
  '2026-09-30',
  // October 2026 (no school Oct 9 + Oct 14; Oct 12 is a Flex A day)
  '2026-10-02', '2026-10-06', '2026-10-08', '2026-10-13', '2026-10-16',
  '2026-10-20', '2026-10-22', '2026-10-26', '2026-10-28',
  // November 2026 (Veterans Day Nov 11; Thanksgiving week Nov 23-27 off)
  '2026-11-03', '2026-11-05', '2026-11-09', '2026-11-12', '2026-11-16',
  '2026-11-18', '2026-11-20',
  // December 2026 (winter break starts after Dec 18; Dec 21+ off)
  '2026-12-01', '2026-12-03', '2026-12-07', '2026-12-09', '2026-12-11',
  '2026-12-15', '2026-12-17',
  // January 2027 (MLK Jan 18 off; finals Jan 20-22 run the A/B alternation;
  // Jan 25-26 are semester-break non-student days)
  '2027-01-04', '2027-01-06', '2027-01-08', '2027-01-12', '2027-01-14',
  '2027-01-19', '2027-01-21', '2027-01-28',
  // February 2027 (Presidents Day Feb 15 off; no February break this year)
  '2027-02-01', '2027-02-03', '2027-02-05', '2027-02-09', '2027-02-11',
  '2027-02-16', '2027-02-18', '2027-02-22', '2027-02-24', '2027-02-26',
  // March 2027 (Mar 3 off; spring break Mar 22-26)
  '2027-03-02', '2027-03-05', '2027-03-09', '2027-03-11', '2027-03-15',
  '2027-03-17', '2027-03-19', '2027-03-30',
  // April 2027 (no April break this year; Create PT due Apr 30)
  '2027-04-01', '2027-04-07', '2027-04-09', '2027-04-13', '2027-04-15',
  '2027-04-19', '2027-04-21', '2027-04-23', '2027-04-27', '2027-04-29',
  // May 2027 (the AP exam, May 14, is an A day - not a class day)
  '2027-05-03', '2027-05-05', '2027-05-07', '2027-05-11', '2027-05-13',
  '2027-05-17', '2027-05-19', '2027-05-21', '2027-05-25', '2027-05-27',
  // June 2027 (June finals Jun 4-8 have no A/B label; Jun 3 is the last B day)
  '2027-06-01', '2027-06-03',
];

/** Calendar notes for pace.html (events on teaching days). */
export const DAY_NOTES: Record<string, string> = {
  '2026-09-01': 'First B day of the year. Course tour, syllabus, Scratch accounts, first sprite.',
  '2026-09-14': 'Unity begins: fork cs-curriculum-main, clone it, press Play.',
  '2026-11-20': 'Last class before Thanksgiving week (Nov 23-27 off).',
  '2026-12-17': 'Last class before winter break. The enemy state machine lands before you go.',
  '2027-01-04': 'Back from break. Boss fight build begins.',
  '2027-01-21': 'Semester 1 final - a normal B day on the finals-week schedule.',
  '2027-01-28': 'Semester 2 begins.',
  '2027-03-19': 'Last class before spring break (Mar 22-26).',
  '2027-04-29': 'Create PT is due TOMORROW, Apr 30, 11:59 PM ET - submit as final today.',
  '2027-05-13': 'Exam eve - logistics, strategy, early night. The exam is tomorrow morning.',
  '2027-05-14': 'AP CSP EXAM, 8:00 AM, Session 1. Not a B day - report per IBW instructions.',
  '2027-06-03': 'Last B day of the year. June finals run Jun 4-8; your final meets on your block.',
};

export type EntryKind =
  | 'launch' | 'lesson' | 'studio' | 'jam' | 'cpt' | 'clinic'
  | 'test' | 'eve' | 'exam' | 'season2';

export interface SequenceEntry {
  /** ISO date (a B day; except the exam milestone, which may be an A day) */
  d: string;
  kind: EntryKind;
  /** lesson group label, e.g. "1.4" or "J1" */
  group: string;
  /** 1-6 (phase) */
  phase: number;
  /** CED topic families covered (CRD-1, DAT-2, AAP-3, ...) */
  ced: string[];
  title: string;
  /** lesson file ids taught on this day, in order */
  lessons: string[];
  note?: string;
}

export const SEQUENCE: SequenceEntry[] = [
  // ---------------- PHASE 1: Scratch warm-up + The Overworld ----------------
  // The first two weeks (Sep 1-10, four B days) are the Scratch
  // get-to-know-you starter project. The first Unity project begins Sep 14.
  // Unit 1 is front-loaded: the teacher demonstrates 1.1-1.3 live in about
  // fifteen minutes and the class goes straight into 1.4, so the whole unit
  // lands in two B days.
  //
  // The Sep-Oct rows below record the order the 2026-27 class actually built,
  // not the order this file was first written for. The differences that matter:
  //   - 2.4 is a consolidation studio, not a standalone prefabs lesson. Prefabs
  //     have been in use since 2.1 (the health potion is a cloned coin).
  //   - A player projectile (the enemy projectile cloned, recolored and
  //     retagged) and a player melee swing (a child hitbox that remembers the
  //     enemy it touched) are class-built lessons with no site page yet. They
  //     are calendar rows with no lesson id, so the dashboard does not list
  //     them - the pace table is the record.
  //   - The cave is painted in tilemaps BEFORE the jump exists, which is why
  //     7.1 sits before Unit 6 in the teaching order.
  //   - Enemy animation (4.2), contact damage (4.4) and the full state machine
  //     (4.5) are deferred to December, after the axe, door and scene
  //     persistence, so the semester still reaches the boss fight.
  { d: '2026-09-01', kind: 'launch', group: '0.1', phase: 1, ced: ['CRD-1', 'CRD-2'],
    title: 'Scratch Starter 1: Course Tour & First Sprites', lessons: [],
    note: 'First 45 min: course tour, how this site works, lab rules. Then Scratch accounts and the first sprite of your get-to-know-you project.' },
  { d: '2026-09-03', kind: 'lesson', group: '0.2', phase: 1, ced: ['CRD-2'],
    title: 'Scratch Starter 2: Motion, Loops & Your Scene', lessons: [] },
  { d: '2026-09-08', kind: 'lesson', group: '0.3', phase: 1, ced: ['CRD-2'],
    title: 'Scratch Starter 3: Events, Sound & Iteration', lessons: [],
    note: 'Two weeks of Scratch: the same building blocks as Unity, zero environment overhead.' },
  { d: '2026-09-10', kind: 'lesson', group: '0.4', phase: 1, ced: ['CRD-1', 'CRD-2'],
    title: 'Scratch Starter 4: Gallery Walk', lessons: [],
    note: 'Showcase and names. Next B day the real engine starts.' },
  { d: '2026-09-14', kind: 'launch', group: '1.1', phase: 1, ced: ['CRD-1', 'CRD-2'],
    title: 'Unity Launch: Fork, Clone, Press Play - then Movement', lessons: ['1.1', '1.2', '1.3', '1.4'],
    note: 'Unity begins. The teacher demos the fork, the clone and the editor tour live in about fifteen minutes; 1.1-1.3 are the written version for anyone who needs to catch up on their own. The real build today is 1.4 - getting the player moving in the overworld.' },
  { d: '2026-09-16', kind: 'lesson', group: '1.5', phase: 1, ced: ['AAP-1', 'AAP-2'],
    title: 'Movement II & Animation States', lessons: ['1.5', '1.6'],
    note: 'Choose the movement method this game actually needs, tune it, then drive the Animator with IsWalking, WalkDir and Attack.' },
  { d: '2026-09-18', kind: 'lesson', group: '2.1', phase: 1, ced: ['AAP-3', 'CRD-2'],
    title: 'Coins: Triggers, Tags & Your First Stat', lessons: ['2.1'],
    note: 'The physics engine switches on. Nothing in this project has a collider or a rigidbody - today you give the player a body, and find out that it changes the whole game.' },
  { d: '2026-09-22', kind: 'lesson', group: '2.2', phase: 1, ced: ['AAP-3', 'AAP-2', 'CRD-2'],
    title: 'Spikes: Physics, Damage & Death', lessons: ['2.2'],
    note: 'The pivotal lesson of the unit. A solid spike reveals that transform.Translate has made your character a ghost - so you choose a movement method you can live with all year, then build health and death on top of it.' },
  { d: '2026-09-24', kind: 'lesson', group: '2.3', phase: 1, ced: ['AAP-3', 'AAP-2'],
    title: 'Healing Pickups & the Max-Health Cap', lessons: ['2.3'],
    note: 'Your first selection rule. The health potion is a prefab cloned from the coin - a different tag and a different png - so the pickup family grows without a new script.' },
  { d: '2026-09-28', kind: 'studio', group: '2.4', phase: 1, ced: ['AAP-2', 'AAP-3', 'CRD-2'],
    title: 'Unit 2 Studio: Prefabs, Tuning & Review', lessons: ['2.4', '2.5', '2.6'],
    note: 'Prefabs are not a standalone lesson in this course - you have used them since 2.1. Today consolidates: instantiate a second copy, re-tune the movement now that a physics body is doing the work, and run the second playtest.' },
  { d: '2026-09-30', kind: 'lesson', group: '3.1', phase: 1, ced: ['AAP-2'],
    title: 'The Turret: Distance & the Detection Radius', lessons: ['3.1'] },
  { d: '2026-10-02', kind: 'lesson', group: '3.2', phase: 1, ced: ['AAP-2'],
    title: 'Projectiles: Instantiate, Fire, Destroy', lessons: ['3.2'] },
  { d: '2026-10-06', kind: 'lesson', group: '3.3', phase: 1, ced: ['AAP-2'],
    title: 'Fire Rate: Cooldowns & Time', lessons: ['3.3'] },
  { d: '2026-10-08', kind: 'lesson', group: '3.5', phase: 1, ced: ['AAP-2', 'CRD-2'],
    title: 'Player Projectile: Clone, Retag & Reuse the Cooldown', lessons: ['3.5'],
    note: 'The player fires back. Clone the enemy projectile, recolor it, retag it, and give it the cooldown timer you built in 3.3 - the point is that the pattern moves to a new owner.' },
  { d: '2026-10-13', kind: 'lesson', group: '3.4', phase: 1, ced: ['CRD-2'],
    title: 'Projectile Damage, Tuning & Playtest', lessons: ['3.4'],
    note: 'Close the projectile loop: colliders, damage and Destroy on both the turret shot and the player shot, then tune the numbers and playtest.' },
  { d: '2026-10-16', kind: 'lesson', group: '4.1', phase: 1, ced: ['AAP-2', 'AAP-1'],
    title: 'The Enemy: Patrol a List of Points', lessons: ['4.1'],
    note: 'The reference build in 4.1 uses two waypoints; a list of points is the same idea with more stops. The enemy now has a memory of where it is going.' },
  { d: '2026-10-20', kind: 'lesson', group: '4.3', phase: 1, ced: ['AAP-2', 'CRD-2'],
    title: 'Chase & Return: The Aggro Radius', lessons: ['4.3'],
    note: 'The enemy leaves its beat when the player is close and walks back to the next patrol point when the player escapes. No state machine yet - two behaviours and a rule for which one wins.' },
  { d: '2026-10-22', kind: 'lesson', group: '4.6', phase: 1, ced: ['AAP-2', 'AAP-3', 'CRD-2'],
    title: 'Player Melee: A Hitbox That Remembers the Enemy', lessons: ['4.6'],
    note: 'A sprite child with a BoxCollider2D, moved to the side you are facing. Whatever it touches is stored in a variable, and the swing calls ChangeHealth(int amount) on it. The first time your player does something to the world instead of the world doing something to the player.' },

  // ---------------- PHASE 2: The Cave (Units 4-8) ----------------
  // The cave is painted before the jump exists: tilemaps land in October,
  // gravity and jumping in November. 7.1 therefore appears here, ahead of
  // Unit 6, because that is the order the class built it.
  { d: '2026-10-26', kind: 'lesson', group: '7.1', phase: 2, ced: ['CRD-2'],
    title: 'Tilemaps I: The Level Editor', lessons: ['7.1'],
    note: 'Today you learn to build worlds.' },
  { d: '2026-10-28', kind: 'lesson', group: '7.1', phase: 2, ced: ['CRD-2'],
    title: 'Tilemaps II: Building the Cave', lessons: ['7.1'],
    note: 'Same palette, bigger canvas: the cave becomes a place with an entrance, a route and a goal.' },
  { d: '2026-11-03', kind: 'lesson', group: '6.1', phase: 2, ced: ['AAP-2'],
    title: 'Gravity & Jump: The First Flick', lessons: ['6.1'],
    note: 'Jump code lands in the cave you just painted. Gravity, the first flick, and the moment the top-down RPG becomes a platformer.' },
  { d: '2026-11-05', kind: 'lesson', group: '2.7', phase: 2, ced: ['AAP-1', 'CRD-2'],
    title: 'Refactor Day: Moving Stats into the StatManager', lessons: ['2.7'],
    note: 'A deliberate trip back to Unit 2. Coins, health and the ceiling leave PlayerController and move onto the StatManager singleton that has been an empty stub since September. Nothing the game does changes - only who owns the numbers. This is the day the course keeps promising: the MVP was allowed to be a shortcut, and now we go back and make it right.' },
  { d: '2026-11-09', kind: 'lesson', group: '6.2', phase: 2, ced: ['AAP-2'],
    title: 'Ground Checks & Jump Feel', lessons: ['6.2', '6.3', '6.4'],
    note: 'Jumping is unlimited in mid-air, and today you find out why and stop it with a tag and a collision callback. A longer studio half follows: tune the fall, then add the double jump the cave is going to need.' },
  { d: '2026-11-12', kind: 'studio', group: '6.5', phase: 2, ced: ['CRD-2'],
    title: 'Platforming Studio: The Gauntlet', lessons: ['6.5'],
    note: 'The cave has a jump now. Studio day: build the Gauntlet that teaches it.' },
  { d: '2026-11-16', kind: 'lesson', group: '7.2', phase: 2, ced: ['CRD-2'],
    title: 'Tile Collision, Layers & Sorting', lessons: ['7.2'] },
  { d: '2026-11-18', kind: 'lesson', group: '7.3', phase: 2, ced: ['AAP-2'],
    title: 'Ladders I: The Climbing State', lessons: ['7.3'] },
  { d: '2026-11-20', kind: 'lesson', group: '7.4', phase: 2, ced: ['AAP-2'],
    title: 'Ladders II: Mounts, Tops & Polish', lessons: ['7.4'] },
  { d: '2026-12-01', kind: 'studio', group: '7.5', phase: 2, ced: ['CRD-2'],
    title: 'Design a Big Cave + Level Studio I', lessons: ['7.5', '7.6'],
    note: 'Back from Thanksgiving week. Paper first: design the cave, then start painting it. Spikes, coins, the enemy and the turret all have to find a place in the level.' },
  { d: '2026-12-03', kind: 'studio', group: '7.7', phase: 2, ced: ['CRD-2'],
    title: 'Level Studio II + Cross-Playtest', lessons: ['7.7'],
    note: 'Last studio before the axe and the door: polish two beats, then trade machines.' },
  { d: '2026-12-07', kind: 'lesson', group: '5.1', phase: 2, ced: ['AAP-1', 'CRD-2'],
    title: 'The Axe: Item Pickups & Inventory Bools', lessons: ['5.1'] },
  { d: '2026-12-09', kind: 'lesson', group: '5.2', phase: 2, ced: ['AAP-2', 'CRD-2'],
    title: 'The Door: Opening It with Events', lessons: ['5.2'] },
  { d: '2026-12-11', kind: 'lesson', group: '5.3', phase: 2, ced: ['AAP-1', 'CRD-2'],
    title: 'Into the Cave: Scenes, Persistence & the Refactor', lessons: ['5.3'],
    note: 'The architectural payoff. Leaving the overworld destroys every stat the student owns, because a scene load replaces rather than loses. They refactor stats out of PlayerController into the StatManager singleton that has been an empty stub since Unit 2, guard against duplicates, and put the HUD where the game begins.' },
  { d: '2026-12-15', kind: 'lesson', group: '4.2', phase: 2, ced: ['AAP-2', 'CRD-2'],
    title: 'Enemy Animation & Contact Damage', lessons: ['4.2', '4.4'],
    note: 'The enemy animation you deferred in October, plus the contact-damage rule that makes catching you matter. Both make the enemy read as a creature rather than a moving box; the full state machine follows next class.' },
  { d: '2026-12-17', kind: 'lesson', group: '4.5', phase: 2, ced: ['AAP-2'],
    title: 'The Full State Machine: Patrol, Chase, Attack', lessons: ['4.5'],
    note: 'Last class before winter break. Patrol, chase, return and attack become named states - the enemy is finished before you go.' },
  { d: '2027-01-04', kind: 'lesson', group: '8.1', phase: 2, ced: ['CRD-2'],
    title: 'Boss Design: Spec It First', lessons: ['8.1'],
    note: 'Back from break, and the first build that is fully yours. Design on paper before you open Unity.' },
  { d: '2027-01-06', kind: 'lesson', group: '8.2', phase: 2, ced: ['AAP-1', 'CRD-2'],
    title: 'Boss Body, Health & Phases', lessons: ['8.2'] },
  { d: '2027-01-08', kind: 'lesson', group: '8.3', phase: 2, ced: ['AAP-2', 'AAP-3'],
    title: 'Player Attack: Fight Back', lessons: ['8.3'] },
  { d: '2027-01-12', kind: 'lesson', group: '8.4', phase: 2, ced: ['AAP-2'],
    title: 'Boss Attacks: Patterns & Phases', lessons: ['8.4'] },
  { d: '2027-01-14', kind: 'lesson', group: '8.5', phase: 2, ced: ['CRD-2'],
    title: 'Win, Lose & the Death Loop', lessons: ['8.5'] },
  { d: '2027-01-19', kind: 'studio', group: '8.6', phase: 2, ced: ['CRD-2'],
    title: 'Boss Studio + Final Review', lessons: ['8.6'] },
  { d: '2027-01-21', kind: 'test', group: 'T1', phase: 2, ced: [],
    title: 'Semester 1 Final (a normal B day)', lessons: [],
    note: 'Finals-week B day, normal bell schedule. Practical + concepts from Units 1-8.' },

  // ---------------- PHASE 3: Data & Systems (Unit 9) ----------------
  { d: '2027-01-28', kind: 'lesson', group: '9.1', phase: 3, ced: ['DAT-1'],
    title: 'Binary: How Numbers Live in Memory', lessons: ['9.1'] },
  { d: '2027-02-01', kind: 'lesson', group: '9.2', phase: 3, ced: ['DAT-1'],
    title: 'Hex, RGB & Data Abstraction', lessons: ['9.2'] },
  { d: '2027-02-03', kind: 'lesson', group: '9.3', phase: 3, ced: ['DAT-1'],
    title: 'Compression: Lossy vs Lossless', lessons: ['9.3'] },
  { d: '2027-02-05', kind: 'lesson', group: '9.4', phase: 3, ced: ['DAT-2'],
    title: 'Your Scene Is Data: Metadata & Files', lessons: ['9.4'] },
  { d: '2027-02-09', kind: 'lesson', group: '9.5', phase: 3, ced: ['DAT-2'],
    title: 'Datasets: Insights from Playtest Data', lessons: ['9.5'] },
  { d: '2027-02-11', kind: 'lesson', group: '9.6', phase: 3, ced: ['DAT-2', 'IOC-1'],
    title: 'Bias, Filtering & Fair Data', lessons: ['9.6'] },
  { d: '2027-02-16', kind: 'lesson', group: '9.7', phase: 3, ced: ['CSN-1'],
    title: 'Computer Systems: What Runs Your Game', lessons: ['9.7'] },
  { d: '2027-02-18', kind: 'lesson', group: '9.8', phase: 3, ced: ['CSN-2'],
    title: 'The Internet: Packets, Routing & DNS', lessons: ['9.8'] },
  { d: '2027-02-22', kind: 'lesson', group: '9.9', phase: 3, ced: ['CSN-2'],
    title: 'Encryption: Keys, TLS & Public Key', lessons: ['9.9'] },
  { d: '2027-02-24', kind: 'lesson', group: '9.10', phase: 3, ced: ['IOC-1', 'CRD-1'],
    title: 'Impact, Ethics & Licenses (Your Fork!)', lessons: ['9.10'] },

  // ---------------- PHASE 4: Jam Season (Unit 10) ----------------
  { d: '2027-02-26', kind: 'jam', group: 'J1', phase: 4, ced: ['CRD-2'],
    title: '2-Button Jam: Kickoff & Pitch', lessons: ['10.1a'],
    note: 'Jam 1 of 3. One rule: the whole game runs on exactly two inputs. Constraints breed creativity.' },
  { d: '2027-03-02', kind: 'jam', group: 'J1', phase: 4, ced: ['CRD-2'],
    title: '2-Button Jam: Build Day 1', lessons: ['10.1b'] },
  { d: '2027-03-05', kind: 'jam', group: 'J1', phase: 4, ced: ['CRD-2'],
    title: '2-Button Jam: Build Day 2', lessons: ['10.1c'] },
  { d: '2027-03-09', kind: 'jam', group: 'J1', phase: 4, ced: ['CRD-2'],
    title: '2-Button Jam: Playtest', lessons: ['10.1d'] },
  { d: '2027-03-11', kind: 'jam', group: 'J1', phase: 4, ced: ['CRD-2'],
    title: '2-Button Jam: Polish', lessons: ['10.1e'] },
  { d: '2027-03-15', kind: 'jam', group: 'J1', phase: 4, ced: ['CRD-2'],
    title: '2-Button Jam: Showcase & Retro', lessons: ['10.1f'] },
  { d: '2027-03-17', kind: 'lesson', group: '10.2', phase: 4, ced: ['AAP-1', 'AAP-2'],
    title: 'Card Jam Kickoff: Lists & Arrays', lessons: ['10.2a'],
    note: 'Jam 2 of 3. Fork the Card-Game-Template repo. Lists are the biggest idea on the CSP exam - a deck of cards is the perfect list.' },
  { d: '2027-03-19', kind: 'lesson', group: '10.2', phase: 4, ced: ['AAP-1'],
    title: 'ScriptableObjects: Card Data as Assets', lessons: ['10.2b'] },
  { d: '2027-03-30', kind: 'lesson', group: '10.2', phase: 4, ced: ['AAP-2'],
    title: 'Decks: Shuffle, Draw & Traverse', lessons: ['10.2c'],
    note: 'Back from spring break. Fill in GameManager.Shuffle() - your first real traversal.' },
  { d: '2027-04-01', kind: 'lesson', group: '10.2', phase: 4, ced: ['AAP-2'],
    title: 'Turn Logic: Selection + Iteration', lessons: ['10.2d'] },
  { d: '2027-04-07', kind: 'jam', group: '10.2', phase: 4, ced: ['CRD-2'],
    title: 'Card Jam: Build + Playtest', lessons: ['10.2e'] },
  { d: '2027-04-09', kind: 'jam', group: '10.2', phase: 4, ced: ['CRD-2'],
    title: 'Card Jam: Showcase', lessons: ['10.2f'] },

  // ---------------- PHASE 5: Create PT & the Exam (Unit 11) ----------------
  { d: '2027-04-13', kind: 'cpt', group: 'CPT', phase: 5, ced: ['CRD-2'],
    title: 'Create PT Launch: Pick Your Program', lessons: ['11.1a'],
    note: 'Section II: 30% of your AP score (shared with the written responses), 9 hours of in-class time, due Apr 30. Start planning today.' },
  { d: '2027-04-15', kind: 'cpt', group: 'CPT', phase: 5, ced: ['AAP-1'],
    title: 'Create PT: Build Day 1', lessons: ['11.1b'] },
  { d: '2027-04-19', kind: 'cpt', group: 'CPT', phase: 5, ced: ['AAP-2'],
    title: 'Create PT: Build Day 2', lessons: ['11.1c'] },
  { d: '2027-04-21', kind: 'cpt', group: 'CPT', phase: 5, ced: ['AAP-3'],
    title: 'Create PT: Build Day 3', lessons: ['11.1d'] },
  { d: '2027-04-23', kind: 'cpt', group: 'CPT', phase: 5, ced: ['AAP-2'],
    title: 'Create PT: Build Day 4 + List Check', lessons: ['11.1e'] },
  { d: '2027-04-27', kind: 'cpt', group: 'CPT', phase: 5, ced: ['CRD-2'],
    title: 'Create PT: Video + PPR', lessons: ['11.2a'] },
  { d: '2027-04-29', kind: 'cpt', group: 'CPT', phase: 5, ced: ['CRD-2'],
    title: 'Create PT: Submit as Final', lessons: ['11.2b'] },
  { d: '2027-05-03', kind: 'clinic', group: 'E1', phase: 5, ced: ['CRD-2', 'AAP-2'],
    title: 'Written-Response Practice (PPR in hand)', lessons: ['11.3'] },
  { d: '2027-05-05', kind: 'clinic', group: 'E2', phase: 5, ced: ['AAP-1', 'AAP-2', 'AAP-3'],
    title: 'MC Strategy + Practice Set 1', lessons: ['11.4a'] },
  { d: '2027-05-07', kind: 'clinic', group: 'E3', phase: 5, ced: ['DAT-1', 'DAT-2', 'CSN-1', 'CSN-2'],
    title: 'MC Practice 2: Data & Networks', lessons: ['11.4b'] },
  { d: '2027-05-11', kind: 'clinic', group: 'E4', phase: 5, ced: ['CRD-1', 'CRD-2', 'IOC-1'],
    title: 'MC Practice 3 + Written-Response Drill', lessons: ['11.4c'] },
  { d: '2027-05-13', kind: 'eve', group: 'VE', phase: 5, ced: [],
    title: 'Exam Eve: Logistics & Strategy', lessons: ['11.5'] },
  { d: '2027-05-14', kind: 'exam', group: 'EX', phase: 5, ced: [],
    title: 'THE AP CSP EXAM: 8:00 AM, Session 1', lessons: [],
    note: 'Not a B day - the exam is Friday morning. 70 multiple-choice questions (120 min) + 2 written-response questions (60 min) in Bluebook. You have trained for this since September.' },

  // ---------------- PHASE 6: Season 2 (Unit 12) ----------------
  { d: '2027-05-17', kind: 'jam', group: 'J3', phase: 6, ced: ['CRD-2'],
    title: 'Grid/Symmetry Jam: Kickoff & Pitch', lessons: ['12.1a'],
    note: 'The exam is behind you. Jam 3 of 3: build a game around a grid or around symmetry - your pick.' },
  { d: '2027-05-19', kind: 'jam', group: 'J3', phase: 6, ced: ['CRD-2'],
    title: 'Grid/Symmetry Jam: Build Day 1', lessons: ['12.1b'] },
  { d: '2027-05-21', kind: 'jam', group: 'J3', phase: 6, ced: ['CRD-2'],
    title: 'Grid/Symmetry Jam: Build Day 2', lessons: ['12.1c'] },
  { d: '2027-05-25', kind: 'jam', group: 'J3', phase: 6, ced: ['CRD-2'],
    title: 'Grid/Symmetry Jam: Playtest', lessons: ['12.1d'] },
  { d: '2027-05-27', kind: 'jam', group: 'J3', phase: 6, ced: ['CRD-2'],
    title: 'Grid/Symmetry Jam: Showcase', lessons: ['12.1e'] },
  { d: '2027-06-01', kind: 'season2', group: 'J4', phase: 6, ced: [],
    title: 'Placeholder Jam: Day 1 (topic TBA)', lessons: ['12.2a'],
    note: 'Flex jam slot - a fourth jam runs here if the year allows. Topic picked by the class.' },
  { d: '2027-06-03', kind: 'season2', group: 'J4', phase: 6, ced: [],
    title: 'Placeholder Jam: Day 2 + Year Retro', lessons: ['12.2b'],
    note: 'Last B day of the year. Compare your September commit to today - then we party (responsibly).' },
];

export interface Phase {
  name: string;
  ced: string;
  weight: string;
  span: string;
  units: string;
  color: string;
}

export const PHASES: Record<number, Phase> = {
  1: { name: 'Phase 1: Scratch + The Overworld', ced: 'CED AAP + CRD', weight: 'Scratch get-to-know-you starter, then Unity fundamentals, Units 1-4',
       span: 'Sep 1 - Oct 22', units: 'Scratch starter + Units 1-4', color: 'discovery' },
  2: { name: 'Phase 2: The Cave', ced: 'CED AAP + CRD', weight: 'The cave, the deferred enemy work, and your first boss, Units 4-8',
       span: 'Oct 26 - Jan 21', units: 'Units 4-8 + final', color: 'basic-app' },
  3: { name: 'Phase 3: Data & Systems', ced: 'CED DAT + CSN + IOC', weight: 'The big ideas Unity cannot teach alone, Unit 9',
       span: 'Jan 28 - Feb 24', units: 'Unit 9', color: 'expand-app' },
  4: { name: 'Phase 4: Jam Season', ced: 'CED AAP + CRD', weight: '2-Button Jam + Card Game Jam, Unit 10',
       span: 'Feb 26 - Apr 9', units: 'Unit 10', color: 'rpg' },
  5: { name: 'Phase 5: Create PT & the Exam', ced: 'CED CRD + AAP', weight: 'Create PT 30% + end-of-course exam 70%',
       span: 'Apr 13 - May 14', units: 'Unit 11', color: 'hybrid' },
  6: { name: 'Phase 6: Season 2', ced: 'Post-exam', weight: 'Grid/Symmetry Jam + placeholder jams, for the love of the game',
       span: 'May 17 - Jun 3', units: 'Unit 12', color: 'assessment' },
};

/** CED topic families (Fall 2023 CED, current) for the coverage matrix. */
export const CED_TOPICS: Record<string, string> = {
  'CRD-1': 'Creative Development - Collaboration & Legal/Ethical Concerns',
  'CRD-2': 'Creative Development - Program Purpose, Design & Testing',
  'DAT-1': 'Data - Binary, Representation & Compression',
  'DAT-2': 'Data - Programs, Metadata, Insights & Bias',
  'AAP-1': 'Algorithms & Programming - Variables, Expressions & Data Abstraction',
  'AAP-2': 'Algorithms & Programming - Algorithms, Selection & Iteration',
  'AAP-3': 'Algorithms & Programming - Procedures & Abstraction',
  'CSN-1': 'Computer Systems & Networks - Devices, Bandwidth, Fault Tolerance',
  'CSN-2': 'Computer Systems & Networks - The Internet & Encryption',
  'IOC-1': 'Impact of Computing - Effects, Equity, Privacy & Law',
};

export const KIND_LABEL: Record<EntryKind, string> = {
  launch: 'Launch', lesson: 'Lesson', studio: 'Studio', jam: 'Jam',
  cpt: 'Create PT', clinic: 'Clinic', test: 'Final', eve: 'Exam Eve',
  exam: 'EXAM', season2: 'Season 2',
};

// ---------------------------------------------------------------------------
// Derived values (computed at build time - always in sync).
// ---------------------------------------------------------------------------

/** Canonical lesson order: phase order, then within-day order (the teaching
 *  sequence - the source of truth for every lesson page's prev/next links).
 *  Note 12.1/12.2 (Season 2 jams) intentionally teach after 11.x: the chain
 *  reflects the teaching order, not the numeric order. */
export const LESSON_CHAIN: string[] = (() => {
  const chain: string[] = [];
  for (const e of SEQUENCE) {
    for (const lid of e.lessons) {
      if (!chain.includes(lid)) chain.push(lid);
    }
  }
  return chain;
})();

/** Lesson ids grouped by phase, first appearance order. */
export function phaseLessons(phase: number): string[] {
  const out: string[] = [];
  for (const e of SEQUENCE) {
    if (e.phase !== phase) continue;
    for (const lid of e.lessons) if (!out.includes(lid)) out.push(lid);
  }
  return out;
}

/** First sequence entry that teaches a given CED topic family. */
export function firstTeaching(topic: string): SequenceEntry | undefined {
  return SEQUENCE.find((e) => e.ced.includes(topic));
}

/** All CED topic families covered somewhere in the sequence. */
export function coveredTopics(): Set<string> {
  return new Set(SEQUENCE.flatMap((e) => e.ced));
}

/** All class days (B days + the finals-day B). */
export function courseDays(): string[] {
  return [...B_DAYS];
}

// ---------------------------------------------------------------------------
// Date formatting helpers (no dependencies).
// ---------------------------------------------------------------------------

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LONG_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const LONG_WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** "Tue Sep 1, 2026" - the pace.html table format. */
export function prettyDate(iso: string): string {
  const dt = parseIso(iso);
  return `${WEEKDAYS[dt.getUTCDay()]} ${MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
}

/** "2026-09-01 (Tue)" - the PACING.md table format. */
export function mdDate(iso: string): string {
  const dt = parseIso(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())} (${WEEKDAYS[dt.getUTCDay()]})`;
}

/** "Sep 1" - the coverage matrix format. */
export function shortDate(iso: string): string {
  const dt = parseIso(iso);
  return `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}`;
}

/** "Friday, May 14, 2027" - long form for prose. */
export function longDate(iso: string): string {
  const dt = parseIso(iso);
  return `${LONG_WEEKDAYS[dt.getUTCDay()]}, ${LONG_MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
}

/** "May 14, 2027" - medium form for prose. */
export function mediumDate(iso: string): string {
  const dt = parseIso(iso);
  return `${LONG_MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
}

// Sanity: every sequence date is a course day (or the exam milestone), no duplicates.
const seqDays = SEQUENCE.map((e) => e.d);
if (new Set(seqDays).size !== seqDays.length) throw new Error('duplicate dates in SEQUENCE');
for (const e of SEQUENCE) {
  if (e.kind === 'exam') {
    if (e.d !== EXAM_DATE) throw new Error(`exam entry must be ${EXAM_DATE}`);
  } else if (!B_DAYS.includes(e.d)) {
    throw new Error(`sequence date ${e.d} is not a B day`);
  }
}
