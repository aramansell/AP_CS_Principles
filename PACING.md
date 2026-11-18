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
| 2026-09-24 (Thu) | Lesson | 2.3 | Healing Pickups & the Max-Health Cap — Your first selection rule. A value with a ceiling needs a rule, not just arithmetic. | AAP-3 AAP-2 |
| 2026-09-28 (Mon) | Lesson | 2.4 | Prefabs, Spawning & Playtesting — One working object becomes a whole level, and you run the playtest ritual that ends every jam for the rest of the year. | CRD-2 |
| 2026-09-30 (Wed) | Studio | 2.5 | Physics & Stats Studio: Catch Up and Tune — The heaviest unit gets a day to settle. Finish 2.1-2.4 if you are behind, re-tune your movement now that a physics body is doing the work, and fix the top item from your playtest notes. | AAP-2 AAP-3 CRD-2 |
| 2026-10-02 (Fri) | Studio | 2.6 | Unit 2 Review + Second Playtest — Swap seats and playtest again now that your fixes have landed. Compare the two sheets - did the fix actually work? Close the unit by demonstrating your spike, your potion and your death rule. Then the refactor: coins, health and the ceiling leave PlayerController and move onto the StatManager singleton that has been an empty stub since September. Nothing the game does changes - only who owns the numbers. | CRD-2 AAP-2 |
| 2026-10-06 (Tue) | Lesson | 3.1 | The Turret: Distance & the Detection Radius | AAP-2 |
| 2026-10-08 (Thu) | Lesson | 3.2 | Projectiles: Instantiate, Fire, Destroy | AAP-2 |
| 2026-10-13 (Tue) | Lesson | 3.3 | Fire Rate: Cooldowns & Time | AAP-2 |
| 2026-10-16 (Fri) | Lesson | 3.4 | Projectile Damage, Tuning & Playtest — Close the projectile loop: colliders, damage and Destroy on both the turret shot and the player shot, then tune the numbers and playtest. The player shot is the same pattern under a new owner - clone the enemy projectile, recolor it, retag it, and reuse the cooldown timer from 3.3. | CRD-2 |
| 2026-10-20 (Tue) | Lesson | 4.1 | The Enemy: Patrol | AAP-2 |
| 2026-10-22 (Thu) | Lesson | 4.2 | Enemy Animation: A Different State Machine | AAP-2 CRD-2 |
| 2026-10-26 (Mon) | Lesson | 4.3 | Chase: The Aggro Radius | AAP-2 |
| 2026-10-28 (Wed) | Lesson | 4.4 | Attack: Close-Range Contact Damage — The enemy hits you; then you hit back. A sprite child with a BoxCollider2D, moved to the side you are facing. Whatever it touches is stored in a variable, and the swing calls ChangeHealth(int amount) on it - the first time your player does something to the world instead of the world doing something to the player. | AAP-2 |
| 2026-11-03 (Tue) | Lesson | 4.5 | Jump Switch, Axe & Cave Door — Catch-up wrap of Overworld mechanics: scene-based gravityScale & isPlatformer in Start(), axe pickup bool, and Lever interaction. | AAP-2 |
| 2026-11-05 (Thu) | Lesson | 5.3 | Into the Cave: StatManager Persistence & HUD — StatManager owns health, maxHealth, coins, and the Canvas TextMeshProUGUI HUD across scenes, resetting and reloading the active scene inside Die(). | AAP-1 CRD-2 |
| 2026-11-09 (Mon) | Lesson | 6.1 | Jumping & Ground Collision Tags — KeyCode.J + AddForceY jump gated by jumpsRemaining >= 1 and reset in OnCollisionEnter2D when CompareTag("Ground") fires. | AAP-2 |
| 2026-11-12 (Thu) | Studio | 7.1 | Tilemaps, Ground Colliders & Cave Blockout — Build the Platformer cave scene out of painted tilemaps tagged Ground and block out the vertical traversal course. | CRD-2 |
| 2026-11-16 (Mon) | Lesson | 6.3 | Moving Platforms, Jump Tuning & Level Studio — Build Platform.cs (wayPoints, isOn, MoveTowards, SetParent), tune gravityScale & jumpForce, unlock vertical camera tracking, and expand the cave. | AAP-2 CRD-2 |
| 2026-11-18 (Wed) | Lesson | 7.3 | Ladders (isPlatformer) & Cave Level Studio — Short lesson (~15 min): in OnTriggerEnter2D(), touching a Ladder trigger sets isPlatformer = false (and rb.gravityScale = 0); in OnTriggerExit2D(), exiting sets isPlatformer = true (and restores gravityScale). Most of the period is building your cave level and prepping for the boss fight. | AAP-2 CRD-2 |
| 2026-11-20 (Fri) | Lesson | 6.4 | Double Jump (StatManager) & Boss Prep Studio — Short lesson (~15 min): move jumpsRemaining and maxJumps into StatManager so multi-jump upgrades persist cleanly. Most of the period is finishing your cave level and getting ready for the boss fight. | AAP-1 AAP-2 CRD-2 |
| 2026-12-01 (Tue) | Lesson | 8.1 | Boss Design: Reuse Parts & Brainstorm — Back from Thanksgiving week. Kick off two weeks of independent boss building: brainstorm ideas by reusing EnemyController, TurretController, projectiles, Platform, Spawner, and StatManager. | CRD-2 |
| 2026-12-03 (Thu) | Studio | 8.2 | Boss Prototype I: Arena, Body & Health — Build the first rough prototype on screen: boss body, health/phases, and reused arena parts so something is playable right away. | AAP-1 CRD-2 |
| 2026-12-07 (Mon) | Studio | 8.3 | Boss Prototype II: Player Attacks & Hitbox — Wire your existing melee (attackBox + KeyCode.E) and ranged (PlayerProjectile + KeyCode.Space) attacks into the boss prototype and verify clear damage feedback. | AAP-2 AAP-3 |
| 2026-12-09 (Wed) | Studio | 8.4 | Boss Prototype III: Patterns & Reused Hazards — Combine turrets, moving platforms, spawners, and movement phases into readable attack patterns and phase shifts. | AAP-2 |
| 2026-12-11 (Fri) | Studio | 8.4 | Boss Studio: Self-Playtest & Tune — Self-playtest day. Fight your own boss end-to-end, log every unfair overlap, blind spot, or dead stretch, and tune numbers before friends play. | CRD-2 |
| 2026-12-15 (Tue) | Studio | 8.5 | Boss Playtest with Friends & Win/Lose Loop — Have friends playtest your boss cold without coaching; fix confusion first, and hook up the real victory trigger and StatManager death reset. | CRD-2 |
| 2026-12-17 (Thu) | Studio | 8.6 | Boss Revisions & Pre-Break Showcase — Apply friend-playtest revisions, freeze changes cleanly, and showcase your finished boss fight before Winter Break. | CRD-2 |
| 2027-01-04 (Mon) | Jam | J1 | 3-Button Jam: Brainstorm & Pitch — Jam 1 of 3. Runs through the end of Semester 1. One constraint: the whole game uses at most three buttons of input. Brainstorm widely, sketch multiple ideas, and pitch the crispest one. | CRD-2 |
| 2027-01-06 (Wed) | Jam | J1 | 3-Button Jam: Rapid Prototype — Build the greybox prototype fast: all three button verbs working with placeholder blocks so you can test whether the idea is fun before art or polish. | CRD-2 |
| 2027-01-08 (Fri) | Jam | J1 | 3-Button Jam: Expand Loop & Self-Playtest — Flesh out the winning/losing condition and one real escalation mechanic, then self-playtest with structured bug and feel notes. | CRD-2 |
| 2027-01-12 (Tue) | Jam | J1 | 3-Button Jam: Friend Playtest & Triage — Swap seats and have friends playtest blind (zero verbal instructions). Watch where they hesitate, record every surprise, and triage fixes. | CRD-2 |
| 2027-01-14 (Thu) | Jam | J1 | 3-Button Jam: Iterate, Polish & Freeze — Revise the top gameplay issues your friends found, run a follow-up check to confirm each fix worked, then add readability polish and freeze. | CRD-2 |
| 2027-01-19 (Tue) | Jam | J1 | 3-Button Jam: Final Revisions & Build Check — Last work day before finals: verify controls work cleanly in a fresh build, fix any soft-locks from playtest 2, and write your 2-sentence instructions card. | CRD-2 |
| 2027-01-21 (Thu) | Final | T1 | 3-Button Jam: Showcase & Semester 1 Retro — Finals-week B day (normal bell schedule). Play classmates' 3-button games, give written feedback, and complete the Semester 1 retrospective. | CRD-2 |
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
| 2027-02-26 (Fri) | Jam | J2-prep | Micro-Jam: Constraint Pitch & Prototype — 3-Button Jam wrapped in January; open 6-day Spring Micro-Jam sprint before Card Jam (apply the brainstorm -> prototype -> playtest -> revise loop). | CRD-2 |
| 2027-03-02 (Tue) | Jam | J2-prep | Micro-Jam: Core Loop Build Day — Get the core interaction playable today and run a quick self-playtest. | CRD-2 |
| 2027-03-05 (Fri) | Jam | J2-prep | Micro-Jam: Expand & Tune — Add difficulty ramp or win/lose state and tune the controls. | CRD-2 |
| 2027-03-09 (Tue) | Jam | J2-prep | Micro-Jam: Friend Playtest — Have friends playtest blind without explaining controls; write down the top three surprises. | CRD-2 |
| 2027-03-11 (Thu) | Jam | J2-prep | Micro-Jam: Revise & Polish — Fix the playtest blockers first, then add clean feedback and freeze. | CRD-2 |
| 2027-03-15 (Mon) | Jam | J2-prep | Micro-Jam: Showcase & Card Prep — Class showcase + setup check before Card Game Jam kicks off next class. | CRD-2 |
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
