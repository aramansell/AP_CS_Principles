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

One file per lesson: `src/pages/lessons/<ID>.astro` (e.g. `src/pages/lessons/4.2.astro`).
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
- <ID> like `4.2` appears in the Lesson id prop EXACTLY (it must be in LESSON_CHAIN — it is).
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
  Labels are free text: Predict First / Build Lab / Ship It / Studio / Kickoff / Playtest / Showcase / Clinic etc.
- Callouts: `<div class="callout warn">`, `<div class="callout trap">`, `<div class="callout info">` — always with a `<strong>Lead phrase.</strong>` then text.
- Question block — the lab form. The system auto-injects an answer box after every question-like element inside it:
  - `<div class="socratic"><h3>Socratic: ...</h3>` reflection questions (CSP connection). **Three questions is the target; four is the hard ceiling**, and the fourth is only ever the block's synthesis question — the one that ties the lesson to a bigger idea. This is the lesson's lab form, so every lesson has one — including process days — and a fifth question is a lesson nobody finishes. `npm run verify` fails on any block rendering more than four `<li>`.
  - Items only get a box if they are question-like (contains `?`, or does not end with `.` or `:`). Phrase them as questions.
- **The "Break It Down" block is not hand-written.** It is rendered from a `DecomposeSpec` (`src/lib/decompose.ts`) — parts, plus `why`/`sizeTest`, plus `turns` (the lesson's own discussion questions). Copy the shape from `scripts/new-lesson.mjs`.
- **Retired — do not use.** `<div class="tinker">`, `<div class="bug-hunt">` (kept only in 1.3, 1.4, 1.6, where breaking something IS the teaching method), a `pitfalls:` list on a walkthrough, and a `connect:` beat on a decompose spec. Each was one more block competing for the same 90 minutes; the thinking that earned its place now lives in the Socratic, in `turns`, or in a line's `why`.
- Activities labelled **"The Problem: …"** stay. In the 26 lessons that have one, it carries that lesson's API table, its hands-on discovery steps ("open Platformer.unity and press Play") and its own Socratic — it *is* that lesson's Read the Docs section, so removing it removes the reference material rather than a redundant frame. Same for 2.1's "What You Just Switched On", which tells the student to go and observe something. Trim one only where its framing merely restates the Break It Down `big`.
- `<div class="checklist"><h3>Checkpoint — before moving on, you must be able to:</h3><ul>...</ul></div>` — 4-6 bullets, always near the end.
- `<div class="resources"><h3>Reference Docs</h3><p>...</p><ul>...</ul></div>` — LAST block always.
- Code: `<pre><code>...</code></pre>`. Tables: plain `<table><tr><th>...`. Output annotation: `<span class="output">...</span>` inside code samples for what the Console prints.
  - **A code block says what language it is, or it stays plain.** Add the class to the `<pre>`: `lang-cs`, `lang-yaml`, `lang-bash`, `lang-json`. `npm run build` then colours the block the way VS Code does — Shiki runs VS Code's own grammar and its Dark+ palette over it, so the student sees the code as their editor will show it. The walkthrough renderer declares its own blocks (`lang-cs`); only hand-written blocks need the class.
  - Nothing is guessed from the content, and this is deliberate: half the code blocks in the course are not code — trade analogies, a DNS transcript, Unity scene YAML, AP pseudocode with `←` in it. Colour marks **the course's C#**, plus the few blocks that are genuinely a shell command or a scene file. A block left plain is itself the signal that this is not something you type.
  - No colour is ever written into a lesson by hand. The palette is eight classes in `public/style.css` and eight hexes in `scripts/highlight-code.mjs`, kept equal by verify check 15 — which also fails if a block declares a language that never got coloured, or if a colour reaches a page neither list can name.
- Do not use any other classes or ids. No inline styles except none at all. The one exception is the `lang-*` class on a code block above: it is not a style, it is the block declaring what language it is.

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
- Other lessons in the same folder: e.g. `1.5.html`, `4.2.html` — you may link prev/next lesson by relative filename. Only link lessons adjacent to yours or referenced in your brief.
NEVER link anywhere else. Never use absolute URLs except https://github.com/ and https://trivory.com/ in prose if needed (avoid).

## Content quality bar

- Total length: **under ~2,000 words of the author's own prose** — everything around the walkthrough: the lesson lead, the editor steps, the code-half explanation, callouts, the checkpoint, the resources. Most build lessons land in the 900-1,900 band, and jam/studio/CPT process days should be shorter still. Shorter is never a fault: a level-3 lesson with no walkthrough can honestly land near 1,100, and padding one back up to the band is the failure this rule exists to prevent. Measure, do not eyeball it: `node scripts/lesson-load.mjs --split <id>` prints the author's prose beside the walkthrough's annotation, and the plain form prints the change against the copy at HEAD. If a lesson is over the cap, it is carrying a block that should have been cut — shorten it, do not trim the teaching. Line count is *not* the measure: a table row or a paragraph can be squeezed onto one line, or broken into five, without a word of the lesson changing.

  Two things the number includes that are not paragraphs, worth knowing before you cut to reach it: the walkthrough's step headings, the decompose parts' names, the `ask`, the `finalNote`, and the imports, `href`s and component tags in the frontmatter. In a converted lesson that is **200-450 words of navigation**, so a lesson billed at 2,300 may be carrying 1,900 of actual prose. 8.3 is the one lesson shipped over the guide for exactly this reason: it measures 2,329 billed and ~1,900 of sentences, and its remaining bulk is the four-tool reference table, three architectural specifications and six pane-named editor steps — every one of which the rules above tell you to keep. Cutting a step heading or the ask banner to land on a round number is the same failure as padding a short lesson back up to the band.
- Walkthrough annotation is counted **separately, and is not capped**, because its length is not the author's to choose: a level-1 lesson withholds no line, a level-2 lesson withholds one, a level-3 lesson renders no walkthrough at all, and the number of lines is the size of the file the lesson walks through. Annotate every line the ladder asks for. Never shorten a per-line annotation to make a total land under a round number — that is how a build lesson stops being buildable, and this rule was written once as a single total over both quantities, which duly failed lessons whose annotation *was* the teaching. What governs annotation instead is check 13: the same idea explained again in a second annotation on the same page is a repeat, and a repeat gets cut.
- Voice: second person, direct, a little funny, zero fluff. The reader is a high schooler at a computer with Unity open.
- Every build lesson: a Break It Down block (decompose spec), predict-first where possible (predict before running), then steps with runnable C# that matches the REAL starter code, then a Socratic block of at most 3 real questions, then checklist, then resources.
- The C# you teach matches the actual starter scripts or builds on them step-by-step. In the starter project, most gameplay systems are NOT pre-written: students build them from scratch. Use canonical Unity naming (xSpeed, ySpeed, maxAttackRange, ChangeHealth, StatManager.manager, etc.) and consistent C# conventions: MonoBehaviour, [SerializeField] private, private helper methods, Debug.Log, CompareTag, Vector2/Vector3, Time.deltaTime.
- Weave AP CSP ideas explicitly (the CED topic listed for the lesson) — one socratic question or callout that names the connection (e.g. deltaTime = abstraction, state machine = algorithm with selection, ScriptableObjects = data abstraction).
- Dates/class context: lessons are ~90-minute block periods. Activity times should sum to roughly 60-85 min.
- No emojis. No lorem. No "TODO".

## The real starter code — READ THESE before writing build lessons

- `cs-curriculum-main/Assets/Scripts/PlayerController.cs` — BAREBONES STARTER: only plays the walking animation in `Start()` (`anim.SetBool("IsWalking", true)`). The player does NOT move, cannot collect coins, cannot take damage, and has no physics/interaction handlers. Students build movement from scratch in Unit 1 (1.4/1.5), hook up directional animation parameters in 1.6, and add collision/trigger responses in Unit 2.
- `cs-curriculum-main/Assets/Scripts/StatManager.cs` — IN STARTER AS AN EMPTY STUB: a bare `MonoBehaviour` with no fields and no methods. It stays empty through Unit 2 — stats live on `PlayerController` (2.1 names both the stub and the three options for where a number can live) — and students fill it in during the Unit 5 refactor (5.3): `public static StatManager manager`, `Awake()`, `DontDestroyOnLoad`, a duplicate guard, holding `health` and `coins` (plus the axe inventory flag), exposed through the same signed-amount methods the player used to own. The method names are the student's choice — do not hardcode them in lessons.
- `cs-curriculum-main/Assets/Scripts/TurretController.cs` — NOT IN STARTER: Built from scratch in Unit 3 (3.1-3.3). Finds the player by tag, measures `Vector3.Distance`, uses the `Time.time >= lastAttackTime + attackCooldown` cooldown pattern, and calls `Instantiate(projectilePrefab, ...)`.
- `cs-curriculum-main/Assets/Scripts/Projectile.cs` — NOT IN STARTER: Built from scratch in Unit 3 (3.2, 3.4). Implements movement toward target direction (`transform.Translate` / `linearVelocity`), lifetime cleanup with `Destroy()`, and damage delivery via `OnTriggerEnter2D` calling `StatManager.manager.ChangeHealth(-1)`.
- `cs-curriculum-main/Assets/Scripts/EnemyController.cs` — NOT IN STARTER: Built from scratch in Unit 4 (4.1-4.5). Handles waypoint patrolling, top-down chase logic, contact damage with cooldown, and the full state machine.
- `cs-curriculum-main/Assets/Scripts/Lever.cs` — NOT IN STARTER: Built in Unit 5 (5.2). Sprite toggling and UnityEvent wiring to open the cave door.
- `cs-curriculum-main/Assets/Scripts/Package Scripts/` — RETAINED UTILITIES: `CameraController.cs` (smooth camera follow), `SceneSwitch.cs` (scene transition trigger), and `TopDown_EnemyAnimator.cs` (enemy sprite animation helper).
- Scenes: `Assets/_Scenes` = Start, Overworld, Platformer. Prefabs in `Assets/Prefabs`: Coin, Spikes, Player, Turret, Turret_Projectile, MobileEnemy, AxeItem, Switch. (Turret and MobileEnemy prefabs are cleaned of missing component references so they start clean). Artwork: Top_Down (WallsTileSet, TP Grass) and Platformer (CavesTileSet, CaveEntranceTileSet) + PlayerAnimator (Axe/Shovel variants).
- `Card-Game-Template-main/Assets/Scripts/GameManager.cs` — singleton gm; List<Card_data> player_deck/ai_deck; List<Card> hands/discard piles; Deal() shuffles then instantiates blank_card for each hand; **Shuffle(List<Card_data>) and Shuffle(List<Card>) are EMPTY — students fill them**; AI_Turn() EMPTY. Card.cs binds a Card_data (ScriptableObject: card_name, description, health, cost, damage, sprite) to TMP texts + Image. DraggableUI.cs handles drag.
READ the actual files for any lesson touching them — never invent APIs that contradict them.

## Unit briefs (what each lesson covers)

Unit 1 — Setup & Movement (Sept):
- 1.1 Launch: Fork the starter, clone it, press Play. The character walks in place, but cannot move and has no game logic. We build everything from scratch.
- 1.2 Editor tour: five panes (Hierarchy/Scene/Game/Inspector/Project), GameObject vs Component vs Transform, play mode vs edit mode (edits in play mode vanish — demo it), saving scenes.
- 1.3 First script: MonoBehaviour lifecycle, Start vs Update, Debug.Log as developer eyes, [SerializeField] private fields vs Inspector controls. Bug hunt: typo in class name, unattached script, runaway Update logging.
- 1.4 Movement I: Problem breakdown (Input -> Direction Vector -> Position Translate). Comparing Unity input functions (Input.GetAxis vs Input.GetAxisRaw vs Input.GetKey). Writing movement logic from scratch in PlayerController.cs.
- 1.5 Movement II: Comparing movement functions (transform.Translate vs Rigidbody2D.MovePosition vs linearVelocity vs AddForce) with scenarios; Time.deltaTime frame independence; live-tuning knobs (xSpeed, ySpeed).
- 1.6 Animation states: Animator window on Player; dynamically controlling IsWalking (bool), WalkDir (int: 0 up, 1 side, 2 down), and sprite.flipX inside PlayerController.cs UpdateAnimation().

Unit 2 — Stats & Pickups (Sept-Oct):
- 2.1 Coins: Problem breakdown for pickups. OnTriggerEnter2D(Collider2D other), trigger colliders on Coin prefabs, tag comparison (CompareTag vs ==). Building StatManager.cs singleton from scratch to track coin count.
- 2.2 Spikes: Deep comparative analysis (how spikes are similar to coins vs how they differ). Solid collision (Is Trigger = false) vs triggers. OnCollisionEnter2D(Collision2D collision), tracking health in StatManager, and building the death loop (HandleDeath).
- 2.3 Potions: 3-way comparative analysis (coin vs spike vs potion). Capping health via selection; comparing bounding functions (if statements vs Mathf.Min vs Mathf.Clamp).
- 2.4 Prefabs & spawning: Prefabs vs scene instances (overrides, blue bar), spawning with Instantiate, playtest discipline (tune one variable at a time, test with hypotheses).

Unit 3 — The Turret (Oct):
- 3.1 Detection radius: Problem breakdown of enemy awareness. Comparing targeting approaches (GameObject.FindWithTag cached in Start vs serialized Transform). Comparing distance functions (Vector3.Distance vs sqrMagnitude). Building TurretController.cs from scratch.
- 3.2 Projectiles: Spawning, aiming, translation, and lifetime destruction. Comparing projectile movement techniques (transform.Translate vs Rigidbody2D.linearVelocity). Building Projectile.cs from scratch.
- 3.3 Cooldowns: Rate-limiting attacks. Comparing 3 timing approaches (Time.time timestamp vs countdown timer with Time.deltaTime vs Coroutines). Compound conditionals (&&).
- 3.4 Damage + playtest: Adding damage to Projectile.cs, connecting projectile hits back to StatManager.ChangeHealth(-1). The 4 difficulty knobs, turret personalities (Sniper, Sentry, Mortar), partner playtesting.

Unit 4 — The Enemy (Oct-Nov):
- 4.1 Patrol: EnemyController PlatformerMove: startPosition saved in Start; transform.Translate(Vector2.right * direction * speed * Time.deltaTime); when Vector3.Distance(start, now) > patrolDistance → direction *= -1. Predict the bug (stuck flipping) before seeing the guard clause.
- 4.2 Patrol polish: the stuck-flip guard clauses; SpriteRenderer flipX = direction < 0; animation if the enemy has one.
- 4.3 Chase: TopDownMove: find player GameObject.FindWithTag("Player") in Start; chaseDistance 5; move (player - enemy).normalized * speed * deltaTime — normalization for constant speed (ties back to the 1.4/1.5 diagonal-speed fix).
- 4.4 Attack: OnCollisionEnter2D/OnCollisionStay2D with "Player" → TryDamage; damageCooldown 1.0; Time.time > lastDamageTime + cooldown; why cooldown on damage too.
- 4.5 Full state machine: the if/else shape of TopDownMove+TryDamage as STATES (idle/chase/attack); draw the state diagram on paper; AP: algorithms with selection; socratic: where is "return to patrol if player flees" in the code (the chase if has no else — falling out of the if = returning to patrol).

Unit 5 — Axe & Cave (Nov):
- 5.1 Axe pickup: AxeItem prefab; hasAxe bool on PlayerController; OnTriggerEnter2D → pickup, sprite/animation variant swap (PlayerAnimator Axe), show axe in hand; inventory as booleans (data abstraction lite).
- 5.2 Lever/door: Lever.Interact() toggles; E key handler in PlayerController Update (FindObjectsByType<Lever>, distance < 2.0); UnityEvents onLeverOn/onLeverOff wired in Inspector to open the cave door; sprite swap; socratic: UnityEvents = calling procedures without code — abstraction or magic?
- 5.3 Into the cave: SceneSwitch/SceneManager.LoadScene("Platformer"); isPlatformer decided from scene name in Start; gravityScale 2 vs 0; StatManager persists (DontDestroyOnLoad); AP: scene = data? no — systems composed of modules.

Unit 6 — Jumping (Nov):
- 6.1 Gravity & jump: AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse) on Space; gravityScale 2; force vs transform.Translate; predict: what happens holding Space (infinite jump bug).
- 6.2 Ground checks: the infinite jump bug; options (flag set on collision with ground layer, raycast, coyote timer); jumps-used counter reset on ground; pick one and build it.
- 6.3 Jump feel: faster falling (extra gravity when falling / lower jump when releasing early), coyote time, jump buffering — pick 2, tune by playtest; deltaTime again.
- 6.4 Double jump: boots pickup sets maxJumps = 2 (pickup pattern from 2.1/5.1); reset on landing; socratic: 3 jumps? air control?
- 6.5 Platforming studio: build a 3-challenge gauntlet teaching each mechanic; cross-playtest.

Unit 7 — Levels & Ladders (Dec):
- 7.1 Tilemaps: Tilemap + Tile Palette windows; paint with CavesTileSet/CaveEntranceTileSet; ground vs decor layers.
- 7.2 Tile collision: TilemapCollider2D + CompositeCollider2D; why composite; sorting layers; one-way platforms if time.
- 7.3 Ladders I: ladder zone trigger → climbing state: gravityScale 0, move freely on Y (reuse Input.GetAxis("Vertical")), keep x input; the isPlatformer if chain grows.
- 7.4 Ladders II: mount/dismount (enter from top/bottom), jump off ladder, top-of-ladder platform; polish.
- 7.5 Design a big cave: flow (teach→test→reward), difficulty ramp, landmarks, secrets, softlocks to avoid; DESIGN ON PAPER FIRST (CRD-2 planning); spec sheet.
- 7.6/7.7 Studios: build days; 7.7 adds cross-playtest with playtest sheet + iterate.

Unit 8 — Boss Fight (Jan, 6 lessons then the Jan 21 final):
- 8.1 Boss design: spec-first (CRD-2): name, health, phases, attacks, win/lose on one page; review what makes the starter bosses fun; approve specs in pairs. NO CODE TODAY.
- 8.2 Boss body: sprite + BossController.cs (health, maxHealth); health bar (UI Slider); phase field.
- 8.3 Player attack: melee swing or projectile toward mouse; damage the boss; reuse collision patterns.
- 8.4 Boss attacks: pick patterns (charge, volley, minion spawn); phase change at health thresholds (selection!).
- 8.5 Win/lose: reuse the death loop (StatManager); victory → LoadScene or victory UI; fail states, restart flow; socratic on error handling.
- 8.6 Boss studio + semester review: cross-playtest + a written concepts check prep (predict outputs of short code — the final's format).

Unit 9 — Data & Systems (Jan-Feb, CSP Concept lessons; expand-app flavor; less Unity, more big ideas; each has a worksheet-style socratic and links its concept doc):
- 9.1 Binary: bits, place values, byte; count in binary on fingers; C# int = 32 bits; what Debug.Log shows vs what memory holds (DAT-1). Socratic: convert 13, 255, 256; why does 255 matter.
- 9.2 Hex & RGB: hex digits, #RRGGBB, Color32, the hex↔binary bridge; inspect Unity's color picker; AP: hexadecimal as shorthand for binary (DAT-1).
- 9.3 Compression: lossless (PNG, ZIP) vs lossy (JPEG, MP3); run-length encoding by hand; why game assets ship compressed; tradeoff questions (DAT-2).
- 9.4 Scenes are data: open a .unity/.prefab/.meta file in a text editor — YAML!; GUIDs in .meta; scene = data describing objects; file size math; socratic on metadata.
- 9.5 Datasets: ../data/playtests.csv — load in Sheets/Excel; filter, aggregate (count, mean, min/max); answer "where do players die most"; DAT-2 insights from data.
- 9.6 Bias & fair data: sampling bias in our playtest sheet (who did we ask?); filtering; the ethics roundtable: who is excluded; IOC-1. Socratic heavy.
- 9.7 Computer systems: CPU/GPU/RAM/storage; what happens in one rendered frame; why framerate varies machine to machine (deltaTime callback!); CSN-1. Table of specs.
- 9.8 The Internet: packet switching, routing, IP/DNS; trace the path of a WebGL build upload; bandwidth vs latency (MC trap!); CSN-1/CSN-2.
- 9.9 Encryption: symmetric keys, public/private key, TLS/HTTPS; why saves and accounts encrypt; no math beyond XOR-ish intuition; CSN-2.
- 9.10 Impact & licenses: open source licenses (the starter's license, MIT, GPL, CC); attribution in your fork's README; digital divide; who benefits/who is harmed by games; IOC-1. End with: add an ATTRIBUTION section to your repo.

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
- 11.3 WR practice: answer all four WR prompts about YOUR program with YOUR PPR open (drills from ../exam/written-responses.html); peer-score with the rubric rows.
- 11.4a MC strategy + set 1: pacing plan, question types, trap catalog (../exam/mc-strategy.html); 20-question timed set, self-score, tag misses.
- 11.4b MC set 2: data & networks focus (binary, hex, compression, bandwidth/latency, encryption); tag misses.
- 11.4c MC set 3 + WR drill: mixed 20 + one more WR round; top-3 leaks identified for tomorrow.
- 11.5 Exam eve: Bluebook app check, laptop charge, logistics (date/time/room), strategy final pass (skip-star-return), sleep. Short, calm page.

Unit 12 — Season 2 (May-Jun):
- 12.1a Grid/Symmetry jam kickoff: constraint = build around a grid (match-3, 2048, minesweeper, tactics) or symmetry (mirrored levels, twin control); pitch; scope; reuse everything you know.
- 12.1b/12.1c Build days: as 10.1b/c.
- 12.1d Playtest: as 10.1d.
- 12.1e Showcase: demos + retro; the grid = 2D arrays you'll see in code anywhere.
- 12.2a Placeholder jam day 1 (topic TBA): run as flex jam; the calendar's shock absorber; if no topic is chosen: open studio on your best project.
- 12.2b Placeholder jam day 2 + Year retro: finish; then the retro: your September commit vs your June build, side by side (git log tour); what would you tell September-you; course feedback.

## The editor half and the code half (every lesson, since the tightening pass)

A student at a computer with Unity open has two different jobs in one lesson, and
the lesson has to say which one they are doing. Every lesson carries both blocks,
labelled with these exact strings:

- `<span class="activity-label">In the Editor</span>` — the clicks.
- `<span class="activity-label">In the Code</span>` — the file.

`npm run verify` fails a lesson that labels one and not the other (check 10), so
they travel as a pair or not at all.

**In the Editor** is a numbered `<ol>` of imperative steps, and **every step names
the pane it happens in** — `Hierarchy →`, `Inspector →`, `Project window →`,
`Scene view →`. A student should never have to guess where to look, and a setting
that lives in the Inspector says Inspector:

```html
<li>
    <strong>Hierarchy →</strong> click the Player, then <strong>Inspector → Add Component →
    Rigidbody 2D</strong> if it is not already there. Set <strong>Gravity Scale</strong> to 0.
</li>
```

Inspector-only settings belong here and never in the code block as a `//` line —
a comment in a .cs file cannot click a checkbox, and a student who reads it as a
step will go looking for it in the wrong pane.

**In the Code** is the script work: the API table (`API | What it is | What you
get | What it costs`, with the call itself — `Mathf.Clamp(value, min, max)` — in
the first cell), the architectural specification callouts, and the Socratic block.
At level 3 the code half holds no code on purpose: the API and the spec are
given, and the file is the student's to write.

### Anchoring code in the file it lands in

Code samples are never a floating fragment. Each one starts with lines that say
where in the existing script it goes, and the declarations sit where a C#
developer would actually put them — fields above `Start()` with the other fields,
callbacks below `Update()` — not dropped into the middle of whatever method is
being discussed:

```js
{ code: '// PlayerController.cs — class body, above Start(), with your other fields.', what: '' },
{ code: '    [SerializeField] private int coins;', what: '...', why: '...' },
...
{ code: '// PlayerController.cs — below Update(). Unity calls this; you never do.', what: '' },
{ code: '    private void OnTriggerEnter2D(Collider2D other)', what: '...' },
```

A placement line carries `what: ''`, which is how the renderer is told to print
the line without an annotation — safe only because those lines carry no `why`,
`hint` or `doc`. The final file under the walkthrough keeps the same section
comments, so the student can see the whole shape in one place.

### Prose markup, and why a stray asterisk is a defect

Every field the student reads from a spec — `what`, `why`, `hint`, `doc`, `does`,
`big`, `sizeTest`, `turns`, a step's `title` and `lead` — goes through the same
`prose()` in `src/lib/walkthrough.ts` and `src/lib/decompose.ts`, which escapes it
and then allows `` `inline code` ``, `**bold**` and `*italic*`. Body HTML does not:
it is rendered exactly as written, so use `<em>` and `<strong>` there.

The asterisks only work in pairs, and a pair that never reaches `prose()` arrives on
the page as punctuation the student reads as a typo — with the source looking
identical either way. `verify` check 14 fails any built lesson that shows one. Its
pattern is deliberately narrower than the renderer's: `3 * 4 * 5` has a space inside
the pair and `Assets/Scripts/*.cs` has a slash, so neither is reported.

### A method is always named as a call

In prose, tables, specs and checklists: `CompareTag("Coin")`,
`OnTriggerEnter2D(Collider2D other)`, `Instantiate(Object original, Vector3
position, Quaternion rotation)`. Never the bare noun — `CompareTag` alone hides
that it takes an argument, what type that argument is, and what it returns, which
is the whole of what the student needs to know. `CompareTag()` at minimum.
`verify` check 11 enforces this in any lesson carrying the "In the Code" label.

Two names the check cannot read, and does not try to: **`Start` and `Update`**. Both
are Unity lifecycle methods and both are ordinary English (or a filename, or a
lifecycle *stage* used as a noun — "your Update cost", "Update vs FixedUpdate" in
9.7, whose subject is frame timing). They also take no arguments and return
nothing, so the call shape teaches a student nothing there, which is the whole of
what check 11 exists to show. The rule still asks for `Update()` and `Start()` when
you are teaching the callback; the scan simply declines to guess which sense a bare
name is in. Same call that dropped `Start(`/`Update(` from check 13's search terms.

Where the name is the *scene* rather than the method, the convention is fixed: the
method is `Start()`, the scene is always **`Start (index 0)`** — never `Start` bare,
never `Start()` for the scene. That is how 5.3 wrote it and every lesson naming the
scene follows it (7.3, 7.4, 7.6, 8.5, 8.6). A scene is a build index, so the spelling
says something true as well as passing the check.

A Unity settings **label** is spelled as the label, never as a call. `Queries Start
In Colliders` is a checkbox in Physics 2D the student has to be able to look up;
written as `Start()` it is false, and dropped to pass the check it costs them the
exact words to search for.

The rule is course-wide; the check is not, and that is deliberate. Run over all 81
pages it flags five lessons: three bare `Debug.Log` (11.1b, 11.1c, 12.1b) and 9.7's
two method names in prose, all five real and all five since fixed by hand, plus
10.2c's "the starter's own Instantiate line" and "the two Instantiate blocks" —
nouns about code the student can already see, where the call shape adds nothing. The
gate stays for the reason in check 10 rather than for that one false hit: 43 lessons
are still being converted, and a scan that fails a quarter of the course for not yet
carrying the label teaches nobody anything. When the conversion finishes, re-run this
check ungated; 10.2c's two sentences are what would need exempting.

### Teach it once: say it, move on

The lesson's job is to get the student building. Every explanation spent before
they start is attention they do not have when they get there — and a student who
has read about `Rigidbody2D` for the fourth time in one lesson has none left for
the thing they came to make.

So: **a concept is explained at most twice in a lesson**, and the second time only
when the context is genuinely new — a cost it did not have before, a decision it
now forces. Anything after that is the same sentence wearing a different heading,
and it gets culled rather than reworded.

The unit of deletion is the **section or paragraph that repeats an explanation**,
not the sentence. Before keeping any explanatory paragraph, find where else in the
same lesson that idea is already explained. Keep the one nearest the student's
hands — the step they are on right now — and cut the others. The usual offenders:

- a "Why this matters" paragraph restating the Break It Down `big`;
- the second and third Socratic blocks, which ask the same question in new words;
- a callout that repeats the paragraph above it with a `<strong>` lead;
- the API table row for something the surrounding prose has just explained twice.
  A table row is a *lookup*, not an explanation — a term may sit in a table row
  plus one explanation, and that is not repetition.

This is not a warning about doing too little. The course teaches by
**reapplication**: the spike comes back as a thing to collect in 2.4, the pickup
pattern comes back in 5.1, the counter comes back in 6.4, and the student learns it
by meeting it again in a new place. Nothing has to be taught to completion the
first time, so **cut any paragraph that pre-explains a later lesson** — it will be
said then, when the student has a reason to need it.

What stays: the Break It Down spec, the two halves, the API table, the
architectural specification, **one** Socratic block of three questions (`turns` on
the decompose spec is the other place a question lives), the checkpoint, the
resources. What goes: everything above, plus motivational paragraphs, "in this
lesson you will learn" framing, and any sentence whose job is to say that the next
sentence matters.

Target: a build lesson lands **under about 2,000 words of the author's own
prose** — everything except the walkthrough's per-line annotation, which
`node scripts/lesson-load.mjs --split <id>` prints beside it. It is a ceiling,
not a quota — nothing is too short, and padding a lean lesson up to the band is
the failure this rule exists to prevent. Measure it with
`node scripts/lesson-load.mjs <id>` — the words the student actually reads, with
the change against HEAD beside it, so a lesson the pass did not reach reports as
unchanged instead of looking fine. If a lesson is over the cap, the excess is
almost always a repeated explanation rather than teaching; `verify` check 13
reports the terms and paragraphs in one lesson that say the same thing. The
walkthrough annotation itself is set by the ladder, not capped here — but a
repeat inside it is still a repeat.

Line count was the old proxy and it is retired: it is gameable without cutting a
word (collapse a table onto one line, or split an editor step across five), and
two writers duly gamed it. Words are what a student pays for.

### Two things that destroy work silently

Answer-box ids are derived from document order and students' saved answers live
under them in `localStorage`. So: **never insert into or delete from the middle
of a question block, and never reorder or move a question.** Reword freely,
append at the end, trim from the end, or delete the whole block. `verify` check 12
compares every page against the copy at HEAD and fails a lesson that breaks this.

`what: ''` drops the whole annotation for that line, including `why`, `hint` and
`doc`. It is for placement comments only.

## Final checklist per file (verify before you finish)

- [ ] Starts with --- frontmatter, import, const body, closing ---, then the Lesson component — exactly the template above
- [ ] No raw backtick or \${ inside body
- [ ] All < > in code escaped; &amp; used
- [ ] h1 present; lesson-lead present; checklist present; resources div LAST
- [ ] At least one socratic block, with at most 3 question-like items
- [ ] Only links from the link map; all relative
- [ ] C# matches real starter files (you read them)
- [ ] File is valid UTF-8, uses the em dash — literally in the h1
