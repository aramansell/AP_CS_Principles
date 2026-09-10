# Lesson-Page Writing Spec — AP CS Principles site

You are writing lesson pages for the AP CS Principles course site in
`AP_CS_Principles/`. This spec is the single source of truth for format.
Read it fully before writing.

## The course (2 sentences)

High school students meet on **B days**, all year in **Unity**, forking the
starter repo `cs-curriculum-main` (a 2D RPG that becomes a 2D platformer in
caves). First semester rebuilds every feature of that game; second semester
runs game jams and the AP Create performance task; AP CSP big ideas are
woven through every week.

## Files you write

One file per lesson: `src/pages/lessons/<ID>.astro` (e.g. `src/pages/lessons/4.2a.astro`).
Write ONLY the files you were assigned. Do not create, edit, or delete any
other file. Do not run builds (the orchestrator builds).

## Exact file format

```
---
// Lesson <ID> — <Title>
// <one or two lines about what the lesson does>
import Lesson from '../../layouts/LessonLayout.astro';

const body = <BACKTICK><HTML body — see rules below><BACKTICK>;
// (<BACKTICK> stands for ONE backtick character — the body string is a JS template literal)
---
<Lesson id="<ID>" title="<ID> <Title> — AP CS Principles" root=".." css="../style.css">
  <Fragment set:html={body} />
</Lesson>
```

Notes:
- The backtick line for `const body` is a **JavaScript template literal**.
- <ID> like `4.2a` appears in the Lesson id prop EXACTLY (it must be in LESSON_CHAIN — it is).
- Title text in the title prop may use &amp; entities but not raw &.

## CRITICAL escaping rules (violations break the build)

Inside the `const body` template literal:
1. **Never use a raw backtick** anywhere in the body (it would terminate the literal).
2. **Never use the two-character sequence \${** — it starts JS interpolation. C# string interpolation like $"Health: {h}" is FORBIDDEN in code samples; rewrite to use string concatenation (`"Health: " + h`).
3. Curly braces { } are SAFE in the body (it is a string). C# method bodies in <pre><code> are fine.
4. Escape < and > inside code samples as &lt; and &gt; (the body is injected with set:html, so raw < starts a tag). Write `List&lt;Card_data&gt;`, `if (a > b)` → `if (a &gt; b)`.
5. Use &amp; for & in prose and code samples.
6. Quotes: use normal double quotes in HTML attributes; in code samples straight quotes are fine.

## HTML vocabulary (the only classes that exist)

- `<p class="lesson-lead">` — one intro paragraph right under the h1 (every lesson has one).
- `<h1><ID> — <Title></h1>` — first line, uses a literal em dash character —.
- Activities: `<div class="activity basic-app">` wrapping one activity. Valid activity classes:
  `discovery` (Setup Lab), `basic-app` (Build Lab), `expand-app` (CSP Concept),
  `rpg` (Game Jam), `assessment` (Exam Prep/Assessment), `hybrid` (Create PT/Flex).
  A lesson usually has 2-4 activity divs.
- Activity header: `<div class="activity-header"><span class="activity-label">Label</span><span class="activity-time">~XX min</span></div>`.
  Labels are free text: Predict First / Build Lab / Bug Hunt / Tinker / Ship It / Studio / Kickoff / Playtest / Showcase / Clinic etc.
- Callouts: `<div class="callout warn">`, `<div class="callout trap">`, `<div class="callout info">` — always with a `<strong>Lead phrase.</strong>` then text.
- Question blocks (the lab-form system auto-injects an answer box after every question inside these three):
  - `<div class="bug-hunt"><h3>Bug Hunt: ...</h3>...` with an `<ol>`/`<ul>` of numbered break-it steps. Bug hunt items should END WITH A QUESTION (\?) or be phrased as a question — the injector only adds boxes to question-like text (contains ?, or does not end with . or :). Make most items questions.
  - `<div class="tinker"><h3>Tinker: ...</h3>` open-ended experiments.
  - `<div class="socratic"><h3>Socratic</h3>` reflection questions (CSP connection).
- `<div class="checklist"><h3>Checkpoint — before moving on, you must be able to:</h3><ul>...</ul></div>` — 4-6 bullets, always near the end.
- `<div class="resources"><h3>Reference Docs</h3><p>...</p><ul>...</ul></div>` — LAST block always.
- Code: `<pre><code>...</code></pre>`. Tables: plain `<table><tr><th>...`. Output annotation: `<span class="output">...</span>` inside code samples for what the Console prints.
- Do not use any other classes or ids. No inline styles except none at all.

## Link map — the ONLY pages you may link to

Relative from a lesson page (lessons live at `lessons/`):
- Root pages: `../index.html` (Dashboard), `../pace.html`, `../projects.html`, `../search.html`
- Docs unit indexes (always exist, all 12): `../docs/unit-01/index.html` … `../docs/unit-12/index.html`
  - unit-01 Setup & Movement, unit-02 Stats & Pickups, unit-03 The Turret, unit-04 The Enemy,
    unit-05 The Axe & The Cave, unit-06 Jumping, unit-07 Level Building & Ladders, unit-08 The Boss Fight,
    unit-09 Data & Systems, unit-10 Game Jams, unit-11 Create PT & the Exam, unit-12 Season 2
- Concept docs (exist): `../docs/unit-02/triggers-vs-collisions.html`,
  `../docs/unit-04/enemy-state-machines.html`, `../docs/unit-09/binary-and-hex.html`,
  `../docs/unit-09/the-internet.html`, `../docs/unit-09/encryption.html`,
  `../docs/unit-10/lists-arrays.html`, `../docs/unit-10/scriptable-objects.html`,
  `../docs/reference/unity-csharp-quickref.html`
- Exam hub (exists): `../exam/index.html`, `../exam/create-performance-task.html`,
  `../exam/written-responses.html`, `../exam/mc-strategy.html`, `../exam/reference-sheet.html`
- Dataset: `../data/playtests.csv`
- Other lessons in the same folder: e.g. `1.5a.html`, `4.2a.html` — you may link prev/next lesson by relative filename. Only link lessons adjacent to yours or referenced in your brief.
NEVER link anywhere else. Never use absolute URLs except https://github.com/ and https://trivory.com/ in prose if needed (avoid).

## Content quality bar

- Total body length: 60-120 lines of HTML. Jam/studio/CPT build-day lessons may be shorter (40-70) since they are process days; concept lessons (unit 9) and core build labs should be rich (80-130).
- Voice: second person, direct, a little funny, zero fluff. The reader is a high schooler at a computer with Unity open.
- Every build lesson: predict-first where possible (predict before running), then steps with runnable C# that matches the REAL starter code, then at least ONE of bug-hunt/tinker/socratic with REAL question-like items, then checklist, then resources.
- The C# you teach matches the actual starter scripts or builds on them step-by-step. In the starter project, most gameplay systems are NOT pre-written: students build them from scratch. Use canonical Unity naming (xSpeed, ySpeed, maxAttackRange, ChangeHealth, StatManager.manager, etc.) and consistent C# conventions: MonoBehaviour, [SerializeField] private, private helper methods, Debug.Log, CompareTag, Vector2/Vector3, Time.deltaTime.
- Weave AP CSP ideas explicitly (the CED topic listed for the lesson) — one socratic question or callout that names the connection (e.g. deltaTime = abstraction, state machine = algorithm with selection, ScriptableObjects = data abstraction).
- Dates/class context: lessons are ~90-minute block periods. Activity times should sum to roughly 60-85 min.
- No emojis. No lorem. No "TODO".

## The real starter code — READ THESE before writing build lessons

- `cs-curriculum-main/Assets/Scripts/PlayerController.cs` — BAREBONES STARTER: only plays the walking animation in `Start()` (`anim.SetBool("IsWalking", true)`). The player does NOT move, cannot collect coins, cannot take damage, and has no physics/interaction handlers. Students build movement from scratch in Unit 1 (1.4a/1.5a), hook up directional animation parameters in 1.6a, and add collision/trigger responses in Unit 2.
- `cs-curriculum-main/Assets/Scripts/StatManager.cs` — NOT IN STARTER: Built from scratch in Unit 2 (2.1a) as a persistent singleton (`public static StatManager manager`, `Awake()`, `DontDestroyOnLoad`). Stores `health` and `coins`, exposes `ChangeCoins(int amount)` and `ChangeHealth(int amount)`, and handles the death reset loop (`HandleDeath()`).
- `cs-curriculum-main/Assets/Scripts/TurretController.cs` — NOT IN STARTER: Built from scratch in Unit 3 (3.1a-3.3a). Finds the player by tag, measures `Vector3.Distance`, uses the `Time.time >= lastAttackTime + attackCooldown` cooldown pattern, and calls `Instantiate(projectilePrefab, ...)`.
- `cs-curriculum-main/Assets/Scripts/Projectile.cs` — NOT IN STARTER: Built from scratch in Unit 3 (3.2a, 3.4a). Implements movement toward target direction (`transform.Translate` / `velocity`), lifetime cleanup with `Destroy()`, and damage delivery via `OnTriggerEnter2D` calling `StatManager.manager.ChangeHealth(-1)`.
- `cs-curriculum-main/Assets/Scripts/EnemyController.cs` — NOT IN STARTER: Built from scratch in Unit 4 (4.1a-4.5a). Handles waypoint patrolling, top-down chase logic, contact damage with cooldown, and the full state machine.
- `cs-curriculum-main/Assets/Scripts/Lever.cs` — NOT IN STARTER: Built in Unit 5 (5.2a). Sprite toggling and UnityEvent wiring to open the cave door.
- `cs-curriculum-main/Assets/Scripts/Package Scripts/` — RETAINED UTILITIES: `CameraController.cs` (smooth camera follow), `SceneSwitch.cs` (scene transition trigger), and `TopDown_EnemyAnimator.cs` (enemy sprite animation helper).
- Scenes: `Assets/_Scenes` = Start, Overworld, Platformer. Prefabs in `Assets/Prefabs`: Coin, Spikes, Player, Turret, Turret_Projectile, MobileEnemy, AxeItem, Switch. (Turret and MobileEnemy prefabs are cleaned of missing component references so they start clean). Artwork: Top_Down (WallsTileSet, TP Grass) and Platformer (CavesTileSet, CaveEntranceTileSet) + PlayerAnimator (Axe/Shovel variants).
- `Card-Game-Template-main/Assets/Scripts/GameManager.cs` — singleton gm; List<Card_data> player_deck/ai_deck; List<Card> hands/discard piles; Deal() shuffles then instantiates blank_card for each hand; **Shuffle(List<Card_data>) and Shuffle(List<Card>) are EMPTY — students fill them**; AI_Turn() EMPTY. Card.cs binds a Card_data (ScriptableObject: card_name, description, health, cost, damage, sprite) to TMP texts + Image. DraggableUI.cs handles drag.
READ the actual files for any lesson touching them — never invent APIs that contradict them.

## Unit briefs (what each lesson covers)

Unit 1 — Setup & Movement (Sept):
- 1.1a Launch: Fork the starter, clone it, press Play. The character walks in place, but cannot move and has no game logic. We build everything from scratch.
- 1.2a Editor tour: five panes (Hierarchy/Scene/Game/Inspector/Project), GameObject vs Component vs Transform, play mode vs edit mode (edits in play mode vanish — demo it), saving scenes.
- 1.3a First script: MonoBehaviour lifecycle, Start vs Update, Debug.Log as developer eyes, [SerializeField] private fields vs Inspector controls. Bug hunt: typo in class name, unattached script, runaway Update logging.
- 1.4a Movement I: Problem breakdown (Input -> Direction Vector -> Position Translate). Comparing Unity input functions (Input.GetAxis vs Input.GetAxisRaw vs Input.GetKey). Writing movement logic from scratch in PlayerController.cs.
- 1.5a Movement II: Comparing movement functions (transform.Translate vs Rigidbody2D.MovePosition vs linearVelocity vs AddForce) with scenarios; Time.deltaTime frame independence; live-tuning knobs (xSpeed, ySpeed).
- 1.6a Animation states: Animator window on Player; dynamically controlling IsWalking (bool), WalkDir (int: 0 up, 1 side, 2 down), and sprite.flipX inside PlayerController.cs UpdateAnimation().

Unit 2 — Stats & Pickups (Sept-Oct):
- 2.1a Coins: Problem breakdown for pickups. OnTriggerEnter2D(Collider2D other), trigger colliders on Coin prefabs, tag comparison (CompareTag vs ==). Building StatManager.cs singleton from scratch to track coin count.
- 2.2a Spikes: Deep comparative analysis (how spikes are similar to coins vs how they differ). Solid collision (Is Trigger = false) vs triggers. OnCollisionEnter2D(Collision2D collision), tracking health in StatManager, and building the death loop (HandleDeath).
- 2.3a Potions: 3-way comparative analysis (coin vs spike vs potion). Capping health via selection; comparing bounding functions (if statements vs Mathf.Min vs Mathf.Clamp).
- 2.4a Prefabs & spawning: Prefabs vs scene instances (overrides, blue bar), spawning with Instantiate, playtest discipline (tune one variable at a time, test with hypotheses).

Unit 3 — The Turret (Oct):
- 3.1a Detection radius: Problem breakdown of enemy awareness. Comparing targeting approaches (GameObject.FindWithTag cached in Start vs serialized Transform). Comparing distance functions (Vector3.Distance vs sqrMagnitude). Building TurretController.cs from scratch.
- 3.2a Projectiles: Spawning, aiming, translation, and lifetime destruction. Comparing projectile movement techniques (transform.Translate vs Rigidbody2D.linearVelocity). Building Projectile.cs from scratch.
- 3.3a Cooldowns: Rate-limiting attacks. Comparing 3 timing approaches (Time.time timestamp vs countdown timer with Time.deltaTime vs Coroutines). Compound conditionals (&&).
- 3.4a Damage + playtest: Adding damage to Projectile.cs, connecting projectile hits back to StatManager.ChangeHealth(-1). The 4 difficulty knobs, turret personalities (Sniper, Sentry, Mortar), partner playtesting.

Unit 4 — The Enemy (Oct-Nov):
- 4.1a Patrol: EnemyController PlatformerMove: startPosition saved in Start; transform.Translate(Vector2.right * direction * speed * Time.deltaTime); when Vector3.Distance(start, now) > patrolDistance → direction *= -1. Predict the bug (stuck flipping) before seeing the guard clause.
- 4.2a Patrol polish: the stuck-flip guard clauses; SpriteRenderer flipX = direction < 0; animation if the enemy has one.
- 4.3a Chase: TopDownMove: find player GameObject.FindWithTag("Player") in Start; chaseDistance 5; move (player - enemy).normalized * speed * deltaTime — normalization for constant speed (ties to 1.4a diagonal tinker!).
- 4.4a Attack: OnCollisionEnter2D/OnCollisionStay2D with "Player" → TryDamage; damageCooldown 1.0; Time.time > lastDamageTime + cooldown; why cooldown on damage too.
- 4.5a Full state machine: the if/else shape of TopDownMove+TryDamage as STATES (idle/chase/attack); draw the state diagram on paper; AP: algorithms with selection; socratic: where is "return to patrol if player flees" in the code (the chase if has no else — falling out of the if = returning to patrol).

Unit 5 — Axe & Cave (Nov):
- 5.1a Axe pickup: AxeItem prefab; hasAxe bool on PlayerController; OnTriggerEnter2D → pickup, sprite/animation variant swap (PlayerAnimator Axe), show axe in hand; inventory as booleans (data abstraction lite).
- 5.2a Lever/door: Lever.Interact() toggles; E key handler in PlayerController Update (FindObjectsByType<Lever>, distance < 2.0); UnityEvents onLeverOn/onLeverOff wired in Inspector to open the cave door; sprite swap; socratic: UnityEvents = calling procedures without code — abstraction or magic?
- 5.3a Into the cave: SceneSwitch/SceneManager.LoadScene("Platformer"); isPlatformer decided from scene name in Start; gravityScale 2 vs 0; StatManager persists (DontDestroyOnLoad); AP: scene = data? no — systems composed of modules.

Unit 6 — Jumping (Nov):
- 6.1a Gravity & jump: AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse) on Space; gravityScale 2; force vs transform.Translate; predict: what happens holding Space (infinite jump bug).
- 6.2a Ground checks: the infinite jump bug; options (flag set on collision with ground layer, raycast, coyote timer); jumps-used counter reset on ground; pick one and build it.
- 6.3a Jump feel: faster falling (extra gravity when falling / lower jump when releasing early), coyote time, jump buffering — pick 2, tune by playtest; deltaTime again.
- 6.4a Double jump: boots pickup sets maxJumps = 2 (pickup pattern from 2.1/5.1); reset on landing; tinker: 3 jumps? air control?
- 6.5a Platforming studio: build a 3-challenge gauntlet teaching each mechanic; cross-playtest.

Unit 7 — Levels & Ladders (Dec):
- 7.1a Tilemaps: Tilemap + Tile Palette windows; paint with CavesTileSet/CaveEntranceTileSet; ground vs decor layers.
- 7.2a Tile collision: TilemapCollider2D + CompositeCollider2D; why composite; sorting layers; one-way platforms if time.
- 7.3a Ladders I: ladder zone trigger → climbing state: gravityScale 0, move freely on Y (reuse Input.GetAxis("Vertical")), keep x input; the isPlatformer if chain grows.
- 7.4a Ladders II: mount/dismount (enter from top/bottom), jump off ladder, top-of-ladder platform; polish.
- 7.5a Design a big cave: flow (teach→test→reward), difficulty ramp, landmarks, secrets, softlocks to avoid; DESIGN ON PAPER FIRST (CRD-2 planning); spec sheet.
- 7.6a/7.7a Studios: build days; 7.7a adds cross-playtest with playtest sheet + iterate.

Unit 8 — Boss Fight (Jan, 6 lessons then the Jan 21 final):
- 8.1a Boss design: spec-first (CRD-2): name, health, phases, attacks, win/lose on one page; review what makes the starter bosses fun; approve specs in pairs. NO CODE TODAY.
- 8.2a Boss body: sprite + BossController.cs (health, maxHealth); health bar (UI Slider); phase field.
- 8.3a Player attack: melee swing or projectile toward mouse; damage the boss; reuse collision patterns.
- 8.4a Boss attacks: pick patterns (charge, volley, minion spawn); phase change at health thresholds (selection!).
- 8.5a Win/lose: reuse the death loop (StatManager); victory → LoadScene or victory UI; fail states, restart flow; socratic on error handling.
- 8.6a Boss studio + semester review: cross-playtest + a written concepts check prep (predict outputs of short code — the final's format).

Unit 9 — Data & Systems (Jan-Feb, CSP Concept lessons; expand-app flavor; less Unity, more big ideas; each has a worksheet-style tinker or socratic and links its concept doc):
- 9.1a Binary: bits, place values, byte; count in binary on fingers; C# int = 32 bits; what Debug.Log shows vs what memory holds (DAT-1). Tinker: convert 13, 255, 256; why does 255 matter.
- 9.2a Hex & RGB: hex digits, #RRGGBB, Color32, the hex↔binary bridge; inspect Unity's color picker; AP: hexadecimal as shorthand for binary (DAT-1).
- 9.3a Compression: lossless (PNG, ZIP) vs lossy (JPEG, MP3); run-length encoding by hand; why game assets ship compressed; tradeoff questions (DAT-2).
- 9.4a Scenes are data: open a .unity/.prefab/.meta file in a text editor — YAML!; GUIDs in .meta; scene = data describing objects; file size math; socratic on metadata.
- 9.5a Datasets: ../data/playtests.csv — load in Sheets/Excel; filter, aggregate (count, mean, min/max); answer "where do players die most"; DAT-2 insights from data.
- 9.6a Bias & fair data: sampling bias in our playtest sheet (who did we ask?); filtering; the ethics roundtable: who is excluded; IOC-1. Socratic heavy.
- 9.7a Computer systems: CPU/GPU/RAM/storage; what happens in one rendered frame; why framerate varies machine to machine (deltaTime callback!); CSN-1. Table of specs.
- 9.8a The Internet: packet switching, routing, IP/DNS; trace the path of a WebGL build upload; bandwidth vs latency (MC trap!); CSN-1/CSN-2.
- 9.9a Encryption: symmetric keys, public/private key, TLS/HTTPS; why saves and accounts encrypt; no math beyond XOR-ish intuition; CSN-2.
- 9.10a Impact & licenses: open source licenses (the starter's license, MIT, GPL, CC); attribution in your fork's README; digital divide; who benefits/who is harmed by games; IOC-1. End with: add an ATTRIBUTION section to your repo.

Unit 10 — Jam Season (Feb-Apr, rpg flavor, process-forward):
- 10.1a 2-Button Jam kickoff: what a jam is; the constraint (exactly 2 inputs — keyboard keys or mouse buttons or UI buttons); 2.5 weeks; solo or pair; constraints breed creativity; pitch: one sentence + 3 bullets; scope ruthlessly. Link exam/create-performance-task as "the Create PT is a solo jam with a rubric."
- 10.1b/10.1c Build days: daily goal, commit, "make it run ugly first," cut features not quality; playtest checkpoint at end of each day (2 min, partner).
- 10.1d Playtest day: run the playtest sheet on two classmates' builds; observe silently; write top-3 fixes; fix one.
- 10.1e Polish: juice — screenshake, particles, sfx, title screen; the last 10%; freeze at end of class.
- 10.1f Showcase & retro: 3-minute demos; what worked, what to cut next time; retro notes feed the Create PT planning.
- 10.2a Card jam kickoff + lists: fork Card-Game-Template-main; List<Card_data> vs arrays; the GameManager fields (decks, hands, discard piles — 6 lists!); inspect in Inspector. AAP-1.
- 10.2b ScriptableObjects: create 5 Card_data assets (name, cost, damage, health, sprite); why data-as-asset (edit without code); data abstraction — the whole jam's big idea; link ../docs/unit-10/scriptable-objects.html.
- 10.2c Shuffle & traverse: fill Shuffle(List<Card_data>) — pick 100 random pairs and swap (or Fisher-Yates); traverse with foreach; why shuffle the hand overload too; predict: what happens if you skip shuffling (deck[0] every deal).
- 10.2d Turn logic: fill AI_Turn() — selection (if cost affordable) + iteration (over hand); extend Deal() to deal 3-5 cards; the game loop as while(true) of turns.
- 10.2e Build + playtest: finish the game loop, health/damage resolution, win/lose; playtest.
- 10.2f Card jam showcase: demos; retro connecting lists→AP exam questions (link ../exam/reference-sheet.html).

Unit 11 — Create PT & Exam (Apr-May; hybrid/assessment flavor):
- 11.1a CPT launch: requirements checklist verbatim (list, procedure w/ parameter, algorithm w/ sequencing+selection+iteration, call, input→output); 9 in-class hours; pick program; write the one-page spec; gate: spec approved. Link ../exam/create-performance-task.html heavily.
- 11.1b-e Build days 1-4: 11.1b = the loop (input→state→output) runs ugly; 11.1c = list + procedure land (hard requirement gate); 11.1d = edge cases + error handling you can TALK about (you need a bug story for WR2b); 11.1e = list check + feature freeze + PPR prep. Each day: 10-min standup, build, commit, push, 2-min partner check.
- 11.2a Video + PPR: record <60s (input → behavior); PPR screen captures (list, procedure, algorithm); do it in class.
- 11.2b Submit as final: walk the AP Digital Portfolio submission together in class; submitted ≠ in progress; deadline Apr 30 11:59 PM ET is national.
- 11.3a WR practice: answer all four WR prompts about YOUR program with YOUR PPR open (drills from ../exam/written-responses.html); peer-score with the rubric rows.
- 11.4a MC strategy + set 1: pacing plan, question types, trap catalog (../exam/mc-strategy.html); 20-question timed set, self-score, tag misses.
- 11.4b MC set 2: data & networks focus (binary, hex, compression, bandwidth/latency, encryption); tag misses.
- 11.4c MC set 3 + WR drill: mixed 20 + one more WR round; top-3 leaks identified for tomorrow.
- 11.5a Exam eve: Bluebook app check, laptop charge, logistics (date/time/room), strategy final pass (skip-star-return), sleep. Short, calm page.

Unit 12 — Season 2 (May-Jun):
- 12.1a Grid/Symmetry jam kickoff: constraint = build around a grid (match-3, 2048, minesweeper, tactics) or symmetry (mirrored levels, twin control); pitch; scope; reuse everything you know.
- 12.1b/12.1c Build days: as 10.1b/c.
- 12.1d Playtest: as 10.1d.
- 12.1e Showcase: demos + retro; the grid = 2D arrays you'll see in code anywhere.
- 12.2a Placeholder jam day 1 (topic TBA): run as flex jam; the calendar's shock absorber; if no topic is chosen: open studio on your best project.
- 12.2b Placeholder jam day 2 + Year retro: finish; then the retro: your September commit vs your June build, side by side (git log tour); what would you tell September-you; course feedback.

## Final checklist per file (verify before you finish)

- [ ] Starts with --- frontmatter, import, const body, closing ---, then the Lesson component — exactly the template above
- [ ] No raw backtick or \${ inside body
- [ ] All < > in code escaped; &amp; used
- [ ] h1 present; lesson-lead present; checklist present; resources div LAST
- [ ] At least one bug-hunt/tinker/socratic with question-like items
- [ ] Only links from the link map; all relative
- [ ] C# matches real starter files (you read them)
- [ ] File is valid UTF-8, uses the em dash — literally in the h1
