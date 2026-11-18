/**
 * Master curriculum data for the IBW AP CS Principles course, 2026-27.
 *
 * ONE source of truth. Everything data-driven on the site derives from this
 * file at build time:
 *   - the unified Dashboard & Pacing Calendar (src/pages/index.astro & src/pages/pace.astro)
 *   - PACING.md (src/integrations/pacing-md.ts)
 *   - the CED coverage matrix (src/pages/docs/coverage.astro)
 *   - the prev/next chain on every lesson page (src/layouts/LessonLayout.astro)
 *
 * Course shape (Unity all year, on B days):
 *   Phase 1  Units 1-5  The Overworld  — fork the starter, movement, stats,
 *                                        turret, enemy AI, axe, cave door & HUD
 *   Phase 2  Units 6-8  The Cave        — jump, moving platforms, ladders,
 *            + 10.1     & 3-Button Jam   double jump, boss fight (self-built)
 *                                        + January 3-Button Jam (Sem 1 final)
 *   Phase 3  Unit 9     Data & Systems  — binary, compression, datasets,
 *                                        systems, the Internet, encryption,
 *                                        impact & ethics (the CSP big ideas
 *                                        Unity does not teach on its own)
 *   Phase 4  Unit 10    Jam Season      — Open Micro-Jam + Card Game Jam
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
  '2026-12-17': 'Last class before winter break. Playable boss fight due before you go.',
  '2027-01-04': 'Back from winter break. 3-Button Game Jam begins (runs through end of Semester 1).',
  '2027-01-21': 'Semester 1 final (normal B-day schedule) - 3-Button Jam Showcase & Retro.',
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
  // lands in two B days. Unit 2 then moves up into the freed Sep 18/22/24
  // days, which is exactly the room it needs: its four lessons now each get
  // their own day instead of 2.2 and 2.3 sharing one, and two studio days
  // (2.5/2.6) follow on Unit 2's former slots. Unit 3 onward is unchanged.
  // To keep every later lesson in the year, two lighter lesson pairs still
  // share a single B day: 6.3+6.4 and 7.5+7.6.
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
    note: 'Your first selection rule. A value with a ceiling needs a rule, not just arithmetic.' },
  { d: '2026-09-28', kind: 'lesson', group: '2.4', phase: 1, ced: ['CRD-2'],
    title: 'Prefabs, Spawning & Playtesting', lessons: ['2.4'],
    note: 'One working object becomes a whole level, and you run the playtest ritual that ends every jam for the rest of the year.' },
  { d: '2026-09-30', kind: 'studio', group: '2.5', phase: 1, ced: ['AAP-2', 'AAP-3', 'CRD-2'],
    title: 'Physics & Stats Studio: Catch Up and Tune', lessons: ['2.5'],
    note: 'The heaviest unit gets a day to settle. Finish 2.1-2.4 if you are behind, re-tune your movement now that a physics body is doing the work, and fix the top item from your playtest notes.' },
  { d: '2026-10-02', kind: 'studio', group: '2.6', phase: 1, ced: ['CRD-2', 'AAP-2'],
    title: 'Unit 2 Review + Second Playtest', lessons: ['2.6', '2.7'],
    note: 'Swap seats and playtest again now that your fixes have landed. Compare the two sheets - did the fix actually work? Close the unit by demonstrating your spike, your potion and your death rule. Then the refactor: coins, health and the ceiling leave PlayerController and move onto the StatManager singleton that has been an empty stub since September. Nothing the game does changes - only who owns the numbers.' },
  { d: '2026-10-06', kind: 'lesson', group: '3.1', phase: 1, ced: ['AAP-2'],
    title: 'The Turret: Distance & the Detection Radius', lessons: ['3.1'] },
  { d: '2026-10-08', kind: 'lesson', group: '3.2', phase: 1, ced: ['AAP-2'],
    title: 'Projectiles: Instantiate, Fire, Destroy', lessons: ['3.2'] },
  { d: '2026-10-13', kind: 'lesson', group: '3.3', phase: 1, ced: ['AAP-2'],
    title: 'Fire Rate: Cooldowns & Time', lessons: ['3.3'] },
  { d: '2026-10-16', kind: 'lesson', group: '3.4', phase: 1, ced: ['CRD-2'],
    title: 'Projectile Damage, Tuning & Playtest', lessons: ['3.4', '3.5'],
    note: 'Close the projectile loop: colliders, damage and Destroy on both the turret shot and the player shot, then tune the numbers and playtest. The player shot is the same pattern under a new owner - clone the enemy projectile, recolor it, retag it, and reuse the cooldown timer from 3.3.' },
  { d: '2026-10-20', kind: 'lesson', group: '4.1', phase: 1, ced: ['AAP-2'],
    title: 'The Enemy: Patrol', lessons: ['4.1'] },
  { d: '2026-10-22', kind: 'lesson', group: '4.2', phase: 1, ced: ['AAP-2', 'CRD-2'],
    title: 'Enemy Animation: A Different State Machine', lessons: ['4.2'] },
  { d: '2026-10-26', kind: 'lesson', group: '4.3', phase: 1, ced: ['AAP-2'],
    title: 'Chase: The Aggro Radius', lessons: ['4.3'] },
  { d: '2026-10-28', kind: 'lesson', group: '4.4', phase: 1, ced: ['AAP-2'],
    title: 'Attack: Close-Range Contact Damage', lessons: ['4.4', '4.6'],
    note: 'The enemy hits you; then you hit back. A sprite child with a BoxCollider2D, moved to the side you are facing. Whatever it touches is stored in a variable, and the swing calls ChangeHealth(int amount) on it - the first time your player does something to the world instead of the world doing something to the player.' },
  { d: '2026-11-03', kind: 'lesson', group: '4.5', phase: 1, ced: ['AAP-2'],
    title: 'Jump Switch, Axe & Cave Door', lessons: ['4.5', '5.1', '5.2'],
    note: 'Catch-up wrap of Overworld mechanics: scene-based gravityScale & isPlatformer in Start(), axe pickup bool, and Lever interaction.' },
  { d: '2026-11-05', kind: 'lesson', group: '5.3', phase: 1, ced: ['AAP-1', 'CRD-2'],
    title: 'Into the Cave: StatManager Persistence & HUD',
    lessons: ['5.3'],
    note: 'StatManager owns health, maxHealth, coins, and the Canvas TextMeshProUGUI HUD across scenes, resetting and reloading the active scene inside Die().' },

  // ---------------- PHASE 2: The Cave, Boss & 3-Button Jam ----------------
  { d: '2026-11-09', kind: 'lesson', group: '6.1', phase: 2, ced: ['AAP-2'],
    title: 'Jumping & Ground Collision Tags', lessons: ['6.1', '6.2'],
    note: 'KeyCode.J + AddForceY jump gated by jumpsRemaining >= 1 and reset in OnCollisionEnter2D when CompareTag("Ground") fires.' },
  { d: '2026-11-12', kind: 'studio', group: '7.1', phase: 2, ced: ['CRD-2'],
    title: 'Tilemaps, Ground Colliders & Cave Blockout', lessons: ['7.1', '7.2', '6.5'],
    note: 'Build the Platformer cave scene out of painted tilemaps tagged Ground and block out the vertical traversal course.' },
  { d: '2026-11-16', kind: 'lesson', group: '6.3', phase: 2, ced: ['AAP-2', 'CRD-2'],
    title: 'Moving Platforms, Jump Tuning & Level Studio', lessons: ['6.3', '7.5', '7.6'],
    note: 'Build Platform.cs (wayPoints, isOn, MoveTowards, SetParent), tune gravityScale & jumpForce, unlock vertical camera tracking, and expand the cave.' },
  { d: '2026-11-18', kind: 'lesson', group: '7.3', phase: 2, ced: ['AAP-2', 'CRD-2'],
    title: 'Ladders (isPlatformer) & Cave Level Studio', lessons: ['7.3', '7.4'],
    note: 'Short lesson (~15 min): in OnTriggerEnter2D(), touching a Ladder trigger sets isPlatformer = false (and rb.gravityScale = 0); in OnTriggerExit2D(), exiting sets isPlatformer = true (and restores gravityScale). Most of the period is building your cave level and prepping for the boss fight.' },
  { d: '2026-11-20', kind: 'lesson', group: '6.4', phase: 2, ced: ['AAP-1', 'AAP-2', 'CRD-2'],
    title: 'Double Jump (StatManager) & Boss Prep Studio', lessons: ['6.4', '7.7'],
    note: 'Short lesson (~15 min): move jumpsRemaining and maxJumps into StatManager so multi-jump upgrades persist cleanly. Most of the period is finishing your cave level and getting ready for the boss fight.' },
  { d: '2026-12-01', kind: 'lesson', group: '8.1', phase: 2, ced: ['CRD-2'],
    title: 'Boss Design: Reuse Parts & Brainstorm', lessons: ['8.1'],
    note: 'Back from Thanksgiving week. Kick off two weeks of independent boss building: brainstorm ideas by reusing EnemyController, TurretController, projectiles, Platform, Spawner, and StatManager.' },
  { d: '2026-12-03', kind: 'studio', group: '8.2', phase: 2, ced: ['AAP-1', 'CRD-2'],
    title: 'Boss Prototype I: Arena, Body & Health', lessons: ['8.2'],
    note: 'Build the first rough prototype on screen: boss body, health/phases, and reused arena parts so something is playable right away.' },
  { d: '2026-12-07', kind: 'studio', group: '8.3', phase: 2, ced: ['AAP-2', 'AAP-3'],
    title: 'Boss Prototype II: Player Attacks & Hitbox', lessons: ['8.3'],
    note: 'Wire your existing melee (attackBox + KeyCode.E) and ranged (PlayerProjectile + KeyCode.Space) attacks into the boss prototype and verify clear damage feedback.' },
  { d: '2026-12-09', kind: 'studio', group: '8.4', phase: 2, ced: ['AAP-2'],
    title: 'Boss Prototype III: Patterns & Reused Hazards', lessons: ['8.4'],
    note: 'Combine turrets, moving platforms, spawners, and movement phases into readable attack patterns and phase shifts.' },
  { d: '2026-12-11', kind: 'studio', group: '8.4', phase: 2, ced: ['CRD-2'],
    title: 'Boss Studio: Self-Playtest & Tune', lessons: [],
    note: 'Self-playtest day. Fight your own boss end-to-end, log every unfair overlap, blind spot, or dead stretch, and tune numbers before friends play.' },
  { d: '2026-12-15', kind: 'studio', group: '8.5', phase: 2, ced: ['CRD-2'],
    title: 'Boss Playtest with Friends & Win/Lose Loop', lessons: ['8.5'],
    note: 'Have friends playtest your boss cold without coaching; fix confusion first, and hook up the real victory trigger and StatManager death reset.' },
  { d: '2026-12-17', kind: 'studio', group: '8.6', phase: 2, ced: ['CRD-2'],
    title: 'Boss Revisions & Pre-Break Showcase', lessons: ['8.6'],
    note: 'Apply friend-playtest revisions, freeze changes cleanly, and showcase your finished boss fight before Winter Break.' },
  { d: '2027-01-04', kind: 'jam', group: 'J1', phase: 2, ced: ['CRD-2'],
    title: '3-Button Jam: Brainstorm & Pitch', lessons: ['10.1a'],
    note: 'Jam 1 of 3. Runs through the end of Semester 1. One constraint: the whole game uses at most three buttons of input. Brainstorm widely, sketch multiple ideas, and pitch the crispest one.' },
  { d: '2027-01-06', kind: 'jam', group: 'J1', phase: 2, ced: ['CRD-2'],
    title: '3-Button Jam: Rapid Prototype', lessons: ['10.1b'],
    note: 'Build the greybox prototype fast: all three button verbs working with placeholder blocks so you can test whether the idea is fun before art or polish.' },
  { d: '2027-01-08', kind: 'jam', group: 'J1', phase: 2, ced: ['CRD-2'],
    title: '3-Button Jam: Expand Loop & Self-Playtest', lessons: ['10.1c'],
    note: 'Flesh out the winning/losing condition and one real escalation mechanic, then self-playtest with structured bug and feel notes.' },
  { d: '2027-01-12', kind: 'jam', group: 'J1', phase: 2, ced: ['CRD-2'],
    title: '3-Button Jam: Friend Playtest & Triage', lessons: ['10.1d'],
    note: 'Swap seats and have friends playtest blind (zero verbal instructions). Watch where they hesitate, record every surprise, and triage fixes.' },
  { d: '2027-01-14', kind: 'jam', group: 'J1', phase: 2, ced: ['CRD-2'],
    title: '3-Button Jam: Iterate, Polish & Freeze', lessons: ['10.1e'],
    note: 'Revise the top gameplay issues your friends found, run a follow-up check to confirm each fix worked, then add readability polish and freeze.' },
  { d: '2027-01-19', kind: 'jam', group: 'J1', phase: 2, ced: ['CRD-2'],
    title: '3-Button Jam: Final Revisions & Build Check', lessons: [],
    note: 'Last work day before finals: verify controls work cleanly in a fresh build, fix any soft-locks from playtest 2, and write your 2-sentence instructions card.' },
  { d: '2027-01-21', kind: 'test', group: 'T1', phase: 2, ced: ['CRD-2'],
    title: '3-Button Jam: Showcase & Semester 1 Retro', lessons: ['10.1f'],
    note: 'Finals-week B day (normal bell schedule). Play classmates\' 3-button games, give written feedback, and complete the Semester 1 retrospective.' },

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
  { d: '2027-02-26', kind: 'jam', group: 'J2-prep', phase: 4, ced: ['CRD-2'],
    title: 'Micro-Jam: Constraint Pitch & Prototype', lessons: [],
    note: '3-Button Jam wrapped in January; open 6-day Spring Micro-Jam sprint before Card Jam (apply the brainstorm -> prototype -> playtest -> revise loop).' },
  { d: '2027-03-02', kind: 'jam', group: 'J2-prep', phase: 4, ced: ['CRD-2'],
    title: 'Micro-Jam: Core Loop Build Day', lessons: [],
    note: 'Get the core interaction playable today and run a quick self-playtest.' },
  { d: '2027-03-05', kind: 'jam', group: 'J2-prep', phase: 4, ced: ['CRD-2'],
    title: 'Micro-Jam: Expand & Tune', lessons: [],
    note: 'Add difficulty ramp or win/lose state and tune the controls.' },
  { d: '2027-03-09', kind: 'jam', group: 'J2-prep', phase: 4, ced: ['CRD-2'],
    title: 'Micro-Jam: Friend Playtest', lessons: [],
    note: 'Have friends playtest blind without explaining controls; write down the top three surprises.' },
  { d: '2027-03-11', kind: 'jam', group: 'J2-prep', phase: 4, ced: ['CRD-2'],
    title: 'Micro-Jam: Revise & Polish', lessons: [],
    note: 'Fix the playtest blockers first, then add clean feedback and freeze.' },
  { d: '2027-03-15', kind: 'jam', group: 'J2-prep', phase: 4, ced: ['CRD-2'],
    title: 'Micro-Jam: Showcase & Card Prep', lessons: [],
    note: 'Class showcase + setup check before Card Game Jam kicks off next class.' },
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
  1: { name: 'Phase 1: Scratch + The Overworld', ced: 'CED AAP + CRD', weight: 'Scratch get-to-know-you starter, then Unity fundamentals, Units 1-5',
       span: 'Sep 1 - Nov 5', units: 'Scratch starter + Units 1-5', color: 'discovery' },
  2: { name: 'Phase 2: The Cave, Boss & 3-Button Jam', ced: 'CED AAP + CRD', weight: 'Platformer, independent boss fight & January 3-Button Jam (Sem 1 finish)',
       span: 'Nov 9 - Jan 21', units: 'Units 6-8 + 10.1 + Sem 1 Showcase', color: 'basic-app' },
  3: { name: 'Phase 3: Data & Systems', ced: 'CED DAT + CSN + IOC', weight: 'The big ideas Unity cannot teach alone, Unit 9',
       span: 'Jan 28 - Feb 24', units: 'Unit 9', color: 'expand-app' },
  4: { name: 'Phase 4: Spring Jam Season', ced: 'CED AAP + CRD', weight: 'Spring Micro-Jam + Card Game Jam (lists, arrays & ScriptableObjects), Unit 10.2',
       span: 'Feb 26 - Apr 9', units: 'Micro-Jam + Unit 10.2', color: 'rpg' },
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

/** Sequence entries grouped by phase, in calendar order. */
export function phaseEntries(phase: number): SequenceEntry[] {
  return SEQUENCE.filter((e) => e.phase === phase);
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

/** "Tue Nov 3" - compact weekday + month + day for the unified dashboard. */
export function compactDate(iso: string): string {
  const dt = parseIso(iso);
  return `${WEEKDAYS[dt.getUTCDay()]} ${MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}`;
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
