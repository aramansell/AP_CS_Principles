# AP CS Principles Pacing, 2026-27 (IBW, B days)

Exam: **Friday, May 14, 2027**, 8:00 AM (Session 1). Create PT due **Friday, April 30, 2027, 11:59 PM ET** (AP Digital Portfolio). Source of truth: src/data/curriculum.ts. Regenerated automatically by `npm run build` (src/integrations/pacing-md.ts).

| Date | Type | Group | Title | CED |
|---|---|---|---|---|
| 2026-09-01 (Tue) | Launch | 0.1 | Scratch Starter 1: Course Tour & First Sprites — First 45 min: course tour, how this site works, lab rules. Then Scratch accounts and the first sprite of your get-to-know-you project. | CRD-1 CRD-2 |
| 2026-09-03 (Thu) | Lesson | 0.2 | Scratch Starter 2: Motion, Loops & Your Scene | CRD-2 |
| 2026-09-08 (Tue) | Lesson | 0.3 | Scratch Starter 3: Events, Sound & Iteration — Two weeks of Scratch: the same building blocks as Unity, zero environment overhead. | CRD-2 |
| 2026-09-10 (Thu) | Lesson | 0.4 | Scratch Starter 4: Gallery Walk — Showcase and names. Next B day the real engine starts. | CRD-1 CRD-2 |
| 2026-09-14 (Mon) | Launch | 1.1 | Unity Launch: Fork, Clone, Press Play - then Movement — Unity begins. The teacher demos the fork, the clone and the editor tour live in about fifteen minutes; 1.1-1.3 are the written version for anyone who needs to catch up on their own. The real build today is 1.4 - getting the player moving in the overworld. | CRD-1 CRD-2 |
| 2026-09-16 (Wed) | Lesson | 1.5 | Movement II & Animation States — Choose the movement method this game actually needs, tune it, then drive the Animator with IsWalking, WalkDir and Attack. | AAP-1 AAP-2 |
| 2026-09-18 (Fri) | Lesson | 2.1 | Coins: Triggers, Tags & Your First Stat — The physics engine switches on. Nothing in this project has a collider or a rigidbody - today you give the player a body, and find out that it changes the whole game. | AAP-3 CRD-2 |
| 2026-09-22 (Tue) | Lesson | 2.2 | Spikes: Physics, Damage & Death — The pivotal lesson of the unit. A solid spike reveals that transform.Translate has made your character a ghost - so you choose a movement method you can live with all year, then build health and death on top of it. | AAP-3 AAP-2 CRD-2 |
| 2026-09-24 (Thu) | Lesson | 2.3 | Healing Pickups & the Max-Health Cap — Your first selection rule. The health potion is a prefab cloned from the coin - a different tag and a different png - so the pickup family grows without a new script. | AAP-3 AAP-2 |
| 2026-09-28 (Mon) | Studio | 2.4 | Unit 2 Studio: Prefabs, Tuning & Review — Prefabs are not a standalone lesson in this course - you have used them since 2.1. Today consolidates: instantiate a second copy, re-tune the movement now that a physics body is doing the work, and run the second playtest. | AAP-2 AAP-3 CRD-2 |
| 2026-09-30 (Wed) | Lesson | 3.1 | The Turret: Distance & the Detection Radius | AAP-2 |
| 2026-10-02 (Fri) | Lesson | 3.2 | Projectiles: Instantiate, Fire, Destroy | AAP-2 |
| 2026-10-06 (Tue) | Lesson | 3.3 | Fire Rate: Cooldowns & Time | AAP-2 |
| 2026-10-08 (Thu) | Lesson | 3.5 | Player Projectile: Clone, Retag & Reuse the Cooldown — The player fires back. Clone the enemy projectile, recolor it, retag it, and give it the cooldown timer you built in 3.3 - the point is that the pattern moves to a new owner. | AAP-2 CRD-2 |
| 2026-10-13 (Tue) | Lesson | 3.4 | Projectile Damage, Tuning & Playtest — Close the projectile loop: colliders, damage and Destroy on both the turret shot and the player shot, then tune the numbers and playtest. | CRD-2 |
| 2026-10-16 (Fri) | Lesson | 4.1 | The Enemy: Patrol a List of Points — The reference build in 4.1 uses two waypoints; a list of points is the same idea with more stops. The enemy now has a memory of where it is going. | AAP-2 AAP-1 |
| 2026-10-20 (Tue) | Lesson | 4.3 | Chase & Return: The Aggro Radius — The enemy leaves its beat when the player is close and walks back to the next patrol point when the player escapes. No state machine yet - two behaviours and a rule for which one wins. | AAP-2 CRD-2 |
| 2026-10-22 (Thu) | Lesson | 4.6 | Player Melee: A Hitbox That Remembers the Enemy — A sprite child with a BoxCollider2D, moved to the side you are facing. Whatever it touches is stored in a variable, and the swing calls ChangeHealth(int amount) on it. The first time your player does something to the world instead of the world doing something to the player. | AAP-2 AAP-3 CRD-2 |
| 2026-10-26 (Mon) | Lesson | 7.1 | Tilemaps I: The Level Editor — Today you learn to build worlds. | CRD-2 |
| 2026-10-28 (Wed) | Lesson | 7.1 | Tilemaps II: Building the Cave — Same palette, bigger canvas: the cave becomes a place with an entrance, a route and a goal. | CRD-2 |
| 2026-11-03 (Tue) | Lesson | 6.1 | Gravity & Jump: The First Flick — Jump code lands in the cave you just painted. Gravity, the first flick, and the moment the top-down RPG becomes a platformer. | AAP-2 |
| 2026-11-05 (Thu) | Lesson | 2.7 | Refactor Day: Moving Stats into the StatManager — A deliberate trip back to Unit 2. Coins, health and the ceiling leave PlayerController and move onto the StatManager singleton that has been an empty stub since September. Nothing the game does changes - only who owns the numbers. This is the day the course keeps promising: the MVP was allowed to be a shortcut, and now we go back and make it right. | AAP-1 CRD-2 |
| 2026-11-09 (Mon) | Lesson | 6.2 | Ground Checks & Jump Feel — Jumping is unlimited in mid-air, and today you find out why and stop it with a tag and a collision callback. A longer studio half follows: tune the fall, then add the double jump the cave is going to need. | AAP-2 |
| 2026-11-12 (Thu) | Studio | 6.5 | Platforming Studio: The Gauntlet — The cave has a jump now. Studio day: build the Gauntlet that teaches it. | CRD-2 |
| 2026-11-16 (Mon) | Lesson | 7.2 | Tile Collision, Layers & Sorting | CRD-2 |
| 2026-11-18 (Wed) | Lesson | 7.3 | Ladders I: The Climbing State | AAP-2 |
| 2026-11-20 (Fri) | Lesson | 7.4 | Ladders II: Mounts, Tops & Polish | AAP-2 |
| 2026-12-01 (Tue) | Studio | 7.5 | Design a Big Cave + Level Studio I — Back from Thanksgiving week. Paper first: design the cave, then start painting it. Spikes, coins, the enemy and the turret all have to find a place in the level. | CRD-2 |
| 2026-12-03 (Thu) | Studio | 7.7 | Level Studio II + Cross-Playtest — Last studio before the axe and the door: polish two beats, then trade machines. | CRD-2 |
| 2026-12-07 (Mon) | Lesson | 5.1 | The Axe: Item Pickups & Inventory Bools | AAP-1 CRD-2 |
| 2026-12-09 (Wed) | Lesson | 5.2 | The Door: Opening It with Events | AAP-2 CRD-2 |
| 2026-12-11 (Fri) | Lesson | 5.3 | Into the Cave: Persistence & the HUD — The architectural payoff. Leaving the overworld destroys every stat the student owns, because a scene load replaces rather than loses. They refactor stats out of PlayerController into the StatManager singleton that has been an empty stub since Unit 2, guard against duplicates, and put the HUD where the game begins. | AAP-1 CRD-2 |
| 2026-12-15 (Tue) | Lesson | 4.2 | Enemy Animation & Contact Damage — The enemy animation you deferred in October, plus the contact-damage rule that makes catching you matter. Both make the enemy read as a creature rather than a moving box; the full state machine follows next class. | AAP-2 CRD-2 |
| 2026-12-17 (Thu) | Lesson | 4.5 | The Full State Machine: Patrol, Chase, Attack — Last class before winter break. Patrol, chase, return and attack become named states - the enemy is finished before you go. | AAP-2 |
| 2027-01-04 (Mon) | Lesson | 8.1 | Boss Design: Spec It First — Back from break, and the first build that is fully yours. Design on paper before you open Unity. | CRD-2 |
| 2027-01-06 (Wed) | Lesson | 8.2 | Boss Body, Health & Phases | AAP-1 CRD-2 |
| 2027-01-08 (Fri) | Lesson | 8.3 | Player Attack: Fight Back | AAP-2 AAP-3 |
| 2027-01-12 (Tue) | Lesson | 8.4 | Boss Attacks: Patterns & Phases | AAP-2 |
| 2027-01-14 (Thu) | Lesson | 8.5 | Win, Lose & the Death Loop | CRD-2 |
| 2027-01-19 (Tue) | Studio | 8.6 | Boss Studio + Final Review | CRD-2 |
| 2027-01-21 (Thu) | Final | T1 | Semester 1 Final (a normal B day) — Finals-week B day, normal bell schedule. Practical + concepts from Units 1-8. |  |
| 2027-01-28 (Thu) | Lesson | 9.1 | Binary: How Numbers Live in Memory | DAT-1 |
| 2027-02-01 (Mon) | Lesson | 9.2 | Hex, RGB & Data Abstraction | DAT-1 |
| 2027-02-03 (Wed) | Lesson | 9.3 | Compression: Lossy vs Lossless | DAT-1 |
| 2027-02-05 (Fri) | Lesson | 9.4 | Your Scene Is Data: Metadata & Files | DAT-2 |
| 2027-02-09 (Tue) | Lesson | 9.5 | Datasets: Insights from Playtest Data | DAT-2 |
| 2027-02-11 (Thu) | Lesson | 9.6 | Bias, Filtering & Fair Data | DAT-2 IOC-1 |
| 2027-02-16 (Tue) | Lesson | 9.7 | Computer Systems: What Runs Your Game | CSN-1 |
| 2027-02-18 (Thu) | Lesson | 9.8 | The Internet: Packets, Routing & DNS | CSN-2 |
| 2027-02-22 (Mon) | Lesson | 9.9 | Encryption: Keys, TLS & Public Key | CSN-2 |
| 2027-02-24 (Wed) | Lesson | 9.10 | Impact, Ethics & Licenses (Your Fork!) | IOC-1 CRD-1 |
| 2027-02-26 (Fri) | Jam | J1 | 2-Button Jam: Kickoff & Pitch — Jam 1 of 3. One rule: the whole game runs on exactly two inputs. Constraints breed creativity. | CRD-2 |
| 2027-03-02 (Tue) | Jam | J1 | 2-Button Jam: Build Day 1 | CRD-2 |
| 2027-03-05 (Fri) | Jam | J1 | 2-Button Jam: Build Day 2 | CRD-2 |
| 2027-03-09 (Tue) | Jam | J1 | 2-Button Jam: Playtest | CRD-2 |
| 2027-03-11 (Thu) | Jam | J1 | 2-Button Jam: Polish | CRD-2 |
| 2027-03-15 (Mon) | Jam | J1 | 2-Button Jam: Showcase & Retro | CRD-2 |
| 2027-03-17 (Wed) | Lesson | 10.2 | Card Jam Kickoff: Lists & Arrays — Jam 2 of 3. Fork the Card-Game-Template repo. Lists are the biggest idea on the CSP exam - a deck of cards is the perfect list. | AAP-1 AAP-2 |
| 2027-03-19 (Fri) | Lesson | 10.2 | ScriptableObjects: Card Data as Assets | AAP-1 |
| 2027-03-30 (Tue) | Lesson | 10.2 | Decks: Shuffle, Draw & Traverse — Back from spring break. Fill in GameManager.Shuffle() - your first real traversal. | AAP-2 |
| 2027-04-01 (Thu) | Lesson | 10.2 | Turn Logic: Selection + Iteration | AAP-2 |
| 2027-04-07 (Wed) | Jam | 10.2 | Card Jam: Build + Playtest | CRD-2 |
| 2027-04-09 (Fri) | Jam | 10.2 | Card Jam: Showcase | CRD-2 |
| 2027-04-13 (Tue) | Create PT | CPT | Create PT Launch: Pick Your Program — Section II: 30% of your AP score (shared with the written responses), 9 hours of in-class time, due Apr 30. Start planning today. | CRD-2 |
| 2027-04-15 (Thu) | Create PT | CPT | Create PT: Build Day 1 | AAP-1 |
| 2027-04-19 (Mon) | Create PT | CPT | Create PT: Build Day 2 | AAP-2 |
| 2027-04-21 (Wed) | Create PT | CPT | Create PT: Build Day 3 | AAP-3 |
| 2027-04-23 (Fri) | Create PT | CPT | Create PT: Build Day 4 + List Check | AAP-2 |
| 2027-04-27 (Tue) | Create PT | CPT | Create PT: Video + PPR | CRD-2 |
| 2027-04-29 (Thu) | Create PT | CPT | Create PT: Submit as Final | CRD-2 |
| 2027-05-03 (Mon) | Clinic | E1 | Written-Response Practice (PPR in hand) | CRD-2 AAP-2 |
| 2027-05-05 (Wed) | Clinic | E2 | MC Strategy + Practice Set 1 | AAP-1 AAP-2 AAP-3 |
| 2027-05-07 (Fri) | Clinic | E3 | MC Practice 2: Data & Networks | DAT-1 DAT-2 CSN-1 CSN-2 |
| 2027-05-11 (Tue) | Clinic | E4 | MC Practice 3 + Written-Response Drill | CRD-1 CRD-2 IOC-1 |
| 2027-05-13 (Thu) | Exam Eve | VE | Exam Eve: Logistics & Strategy |  |
| 2027-05-14 (Fri) | EXAM | EX | THE AP CSP EXAM: 8:00 AM, Session 1 — Not a B day - the exam is Friday morning. 70 multiple-choice questions (120 min) + 2 written-response questions (60 min) in Bluebook. You have trained for this since September. |  |
| 2027-05-17 (Mon) | Jam | J3 | Grid/Symmetry Jam: Kickoff & Pitch — The exam is behind you. Jam 3 of 3: build a game around a grid or around symmetry - your pick. | CRD-2 |
| 2027-05-19 (Wed) | Jam | J3 | Grid/Symmetry Jam: Build Day 1 | CRD-2 |
| 2027-05-21 (Fri) | Jam | J3 | Grid/Symmetry Jam: Build Day 2 | CRD-2 |
| 2027-05-25 (Tue) | Jam | J3 | Grid/Symmetry Jam: Playtest | CRD-2 |
| 2027-05-27 (Thu) | Jam | J3 | Grid/Symmetry Jam: Showcase | CRD-2 |
| 2027-06-01 (Tue) | Season 2 | J4 | Placeholder Jam: Day 1 (topic TBA) — Flex jam slot - a fourth jam runs here if the year allows. Topic picked by the class. |  |
| 2027-06-03 (Thu) | Season 2 | J4 | Placeholder Jam: Day 2 + Year Retro — Last B day of the year. Compare your September commit to today - then we party (responsibly). |  |

Coverage: 10/10 CED topic families. All covered.
