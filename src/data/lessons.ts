/**
 * Per-lesson metadata for the dashboard.
 *
 *   title      - display title for the dashboard
 *   badgeClass - activity type CSS class (discovery | basic-app | expand-app | rpg | assessment | hybrid)
 *   badgeLabel - activity type label shown on the dashboard
 *   group      - the "Unit.Group" group number ("1.4", "J1", ...)
 *
 * Badge meanings on this site:
 *   discovery  = Setup Lab    (getting started: accounts, editor, first run)
 *   basic-app  = Build Lab    (guided Unity builds - most of the year)
 *   expand-app = CSP Concept  (the big-idea lessons: data, systems, impact)
 *   rpg        = Game Jam     (jam days: pitch, build, playtest, showcase)
 *   hybrid     = Create PT / Flex Day  (the performance task + placeholder jams)
 *   assessment = Exam Prep    (the final, clinics, exam eve)
 */
export interface LessonMeta {
  title: string;
  badgeClass: string;
  badgeLabel: string;
  group: string;
}

export const LESSONS: Record<string, LessonMeta> = {
  // Unit 1 — Setup & Movement
  '1.1': { title: "Launch: Fork, Clone & Press Play", badgeClass: 'discovery', badgeLabel: 'Setup Lab', group: '1.1' },
  '1.2': { title: "The Unity Editor Tour", badgeClass: 'discovery', badgeLabel: 'Setup Lab', group: '1.2' },
  '1.3': { title: "Your First Script: Variables & Update", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '1.3' },
  '1.4': { title: "Movement I: Input, Direction, Vector", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '1.4' },
  '1.5': { title: "Movement II: Speed, deltaTime & Tuning", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '1.5' },
  '1.6': { title: "Animation States: IsWalking, WalkDir, Attack", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '1.6' },

  // Unit 2 — Stats & Pickups
  '2.1': { title: "Coins: Triggers, Tags & the StatManager", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '2.1' },
  '2.2': { title: "Spikes: Collisions, Health & Death", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '2.2' },
  '2.3': { title: "Health Potions & the Max-Health Cap", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '2.3' },
  '2.4': { title: "Prefabs, Spawning & Playtesting", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '2.4' },

  // Unit 3 — The Turret
  '3.1': { title: "The Turret: Distance & the Detection Radius", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '3.1' },
  '3.2': { title: "Projectiles: Instantiate, Fire, Destroy", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '3.2' },
  '3.3': { title: "Fire Rate: Cooldowns & Time", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '3.3' },
  '3.4': { title: "Turret Damage, Tuning & Playtest", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '3.4' },

  // Unit 4 — The Enemy
  '4.1': { title: "The Enemy: Waypoint Patrols", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '4.1' },
  '4.2': { title: "Patrol Polish: Bounds, Flips & Animations", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '4.2' },
  '4.3': { title: "Chase: The Aggro Radius", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '4.3' },
  '4.4': { title: "Attack: Close-Range Danger", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '4.4' },
  '4.5': { title: "The Full State Machine: Back to Patrol", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '4.5' },

  // Unit 5 — The Axe & The Cave
  '5.1': { title: "The Axe: Item Pickups & Inventory Bools", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '5.1' },
  '5.2': { title: "The Door: Breaking In with Events", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '5.2' },
  '5.3': { title: "Into the Cave: Scene Loading & Mode Switch", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '5.3' },

  // Unit 6 — Jumping
  '6.1': { title: "Gravity & Jump: AddForce Impulse", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '6.1' },
  '6.2': { title: "Ground Checks: No Infinite Jumps", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '6.2' },
  '6.3': { title: "Jump Feel: Fall Speed & Coyote Time", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '6.3' },
  '6.4': { title: "Boots: Double Jump", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '6.4' },
  '6.5': { title: "Platforming Studio: The Gauntlet", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '6.5' },

  // Unit 7 — Level Building & Ladders
  '7.1': { title: "Tilemaps: The Level Editor", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '7.1' },
  '7.2': { title: "Tile Collision, Layers & Sorting", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '7.2' },
  '7.3': { title: "Ladders I: The Climbing State", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '7.3' },
  '7.4': { title: "Ladders II: Mounts, Tops & Polish", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '7.4' },
  '7.5': { title: "Design a Big Cave: Flow & Difficulty", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '7.5' },
  '7.6': { title: "Level Studio I", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '7.6' },
  '7.7': { title: "Level Studio II + Cross-Playtest", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '7.7' },

  // Unit 8 — Boss Fight
  '8.1': { title: "Boss Design: Spec It First", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '8.1' },
  '8.2': { title: "Boss Body, Health Bar & Phases", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '8.2' },
  '8.3': { title: "Player Attack: Fight Back", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '8.3' },
  '8.4': { title: "Boss Attacks: Patterns & Phases", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '8.4' },
  '8.5': { title: "Win, Lose & the Death Loop", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '8.5' },
  '8.6': { title: "Boss Studio + Final Review", badgeClass: 'basic-app', badgeLabel: 'Build Lab', group: '8.6' },

  // Unit 9 — Data & Systems
  '9.1': { title: "Binary: How Numbers Live in Memory", badgeClass: 'expand-app', badgeLabel: 'CSP Concept', group: '9.1' },
  '9.2': { title: "Hex, RGB & Data Abstraction", badgeClass: 'expand-app', badgeLabel: 'CSP Concept', group: '9.2' },
  '9.3': { title: "Compression: Lossy vs Lossless", badgeClass: 'expand-app', badgeLabel: 'CSP Concept', group: '9.3' },
  '9.4': { title: "Your Scene Is Data: Metadata & Files", badgeClass: 'expand-app', badgeLabel: 'CSP Concept', group: '9.4' },
  '9.5': { title: "Datasets: Insights from Playtest Data", badgeClass: 'expand-app', badgeLabel: 'CSP Concept', group: '9.5' },
  '9.6': { title: "Bias, Filtering & Fair Data", badgeClass: 'expand-app', badgeLabel: 'CSP Concept', group: '9.6' },
  '9.7': { title: "Computer Systems: What Runs Your Game", badgeClass: 'expand-app', badgeLabel: 'CSP Concept', group: '9.7' },
  '9.8': { title: "The Internet: Packets, Routing & DNS", badgeClass: 'expand-app', badgeLabel: 'CSP Concept', group: '9.8' },
  '9.9': { title: "Encryption: Keys, TLS & Public Key", badgeClass: 'expand-app', badgeLabel: 'CSP Concept', group: '9.9' },
  '9.10': { title: "Impact, Ethics & Licenses (Your Fork!)", badgeClass: 'expand-app', badgeLabel: 'CSP Concept', group: '9.10' },

  // Unit 10 — Jam Season
  '10.1a': { title: "2-Button Jam: Kickoff & Pitch", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.1' },
  '10.1b': { title: "2-Button Jam: Build Day 1", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.1' },
  '10.1c': { title: "2-Button Jam: Build Day 2", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.1' },
  '10.1d': { title: "2-Button Jam: Playtest", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.1' },
  '10.1e': { title: "2-Button Jam: Polish", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.1' },
  '10.1f': { title: "2-Button Jam: Showcase & Retro", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.1' },
  '10.2a': { title: "Card Jam Kickoff: Lists & Arrays", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.2' },
  '10.2b': { title: "ScriptableObjects: Card Data as Assets", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.2' },
  '10.2c': { title: "Decks: Shuffle, Draw & Traverse", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.2' },
  '10.2d': { title: "Turn Logic: Selection + Iteration", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.2' },
  '10.2e': { title: "Card Jam: Build + Playtest", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.2' },
  '10.2f': { title: "Card Jam: Showcase", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '10.2' },

  // Unit 11 — Create PT & the Exam
  '11.1a': { title: "Create PT Launch: Pick Your Program", badgeClass: 'hybrid', badgeLabel: 'Create PT', group: '11.1' },
  '11.1b': { title: "Create PT: Build Day 1", badgeClass: 'hybrid', badgeLabel: 'Create PT', group: '11.1' },
  '11.1c': { title: "Create PT: Build Day 2", badgeClass: 'hybrid', badgeLabel: 'Create PT', group: '11.1' },
  '11.1d': { title: "Create PT: Build Day 3", badgeClass: 'hybrid', badgeLabel: 'Create PT', group: '11.1' },
  '11.1e': { title: "Create PT: Build Day 4 + List Check", badgeClass: 'hybrid', badgeLabel: 'Create PT', group: '11.1' },
  '11.2a': { title: "Create PT: Video + PPR", badgeClass: 'hybrid', badgeLabel: 'Create PT', group: '11.2' },
  '11.2b': { title: "Create PT: Submit as Final", badgeClass: 'hybrid', badgeLabel: 'Create PT', group: '11.2' },
  '11.3': { title: "Written-Response Practice (PPR in hand)", badgeClass: 'assessment', badgeLabel: 'Exam Prep', group: '11.3' },
  '11.4a': { title: "MC Strategy + Practice Set 1", badgeClass: 'assessment', badgeLabel: 'Exam Prep', group: '11.4' },
  '11.4b': { title: "MC Practice 2: Data & Networks", badgeClass: 'assessment', badgeLabel: 'Exam Prep', group: '11.4' },
  '11.4c': { title: "MC Practice 3 + Written-Response Drill", badgeClass: 'assessment', badgeLabel: 'Exam Prep', group: '11.4' },
  '11.5': { title: "Exam Eve: Logistics & Strategy", badgeClass: 'assessment', badgeLabel: 'Exam Prep', group: '11.5' },

  // Unit 12 — Season 2
  '12.1a': { title: "Grid/Symmetry Jam: Kickoff & Pitch", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '12.1' },
  '12.1b': { title: "Grid/Symmetry Jam: Build Day 1", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '12.1' },
  '12.1c': { title: "Grid/Symmetry Jam: Build Day 2", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '12.1' },
  '12.1d': { title: "Grid/Symmetry Jam: Playtest", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '12.1' },
  '12.1e': { title: "Grid/Symmetry Jam: Showcase", badgeClass: 'rpg', badgeLabel: 'Game Jam', group: '12.1' },
  '12.2a': { title: "Placeholder Jam: Day 1 (topic TBA)", badgeClass: 'hybrid', badgeLabel: 'Flex Day', group: '12.2' },
  '12.2b': { title: "Placeholder Jam: Day 2 + Year Retro", badgeClass: 'hybrid', badgeLabel: 'Flex Day', group: '12.2' },
};

/** Course-phase tab for a lesson id (from the sequence). */
export function lessonPhase(lessonId: string, phaseOf: (group: string) => number): number {
  const meta = LESSONS[lessonId];
  if (!meta) throw new Error(`unknown lesson ${lessonId}`);
  return phaseOf(meta.group);
}
