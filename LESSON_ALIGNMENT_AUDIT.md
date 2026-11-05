# Lesson ↔ Build Alignment Audit

**Date:** 2026-11-05 (through lesson 6.2)
**Build:** `/Users/aansell/Documents/AP_CS_P_Starter_Project-main` (Unity 6000.6.0f1)
**Lessons:** `/Users/aansell/Documents/GitHub/AP_CS_Principles/src/pages/lessons/`
**Scope:** every lesson taught 2026-09-01 → 2026-11-05. `Assets/Scripts/Package Scripts/` is treated as given and not audited.

The test applied to every page: **if a student typed exactly what the page hands them, would they end the hour with the teacher's file?** Every "major" below is a place where the answer is no.

---

## 0. How to read this

- **No change** — page already matches the build.
- **Minor** — factual or cross-reference fixes; the code the student types is right.
- **Major** — the page teaches code, names, or a mechanism that does not exist in `Assets/Scripts/`.
- **Decision** — the page and the build disagree, and which one should move is a teaching choice, not a typo.
- **Missing** — taught in class, absent from the site.

---

## 1. Decisions that must be made before editing

These are the forks where "align the lesson to the code" and "align the code to the lesson" give different courses. I recommend the first option in each, because the code is what the students actually have.

### D1. When does `StatManager` enter the story?

The build already runs a singleton: `PlayerController.Start()` does `manager = FindAnyObjectByType<StatManager>()`, coins are `manager.coins`, and `Die()` halves `manager.coins`. `StatManager` has `Awake` duplicate-guard + `DontDestroyOnLoad` written.

The site's plan is the opposite: 2.1 teaches `[SerializeField] private int coins` on `PlayerController`, and **5.3 (Dec 11)** is the refactor that "moves stats out of PlayerController into the StatManager singleton that has been an empty stub since Unit 2."

- **Option A (recommended):** rewrite 2.1 to introduce `StatManager`, the `Start()` lookup, and `manager.coins`. Then re-scope 5.3 from "build the singleton" to "guard it, persist it, and add the HUD" — the `Awake`/`DontDestroyOnLoad` already exists, so 5.3 keeps the duplicate guard and moves to the HUD/relocation half.
- **Option B:** change the code back to a local `coins` field, keep 2.1, and let 5.3 do the refactor as written. This un-builds work already done with students.

Also: `StatManager.health` is declared and never read (health is a private int on `PlayerController`). Pick one home for health before teaching either.

### D2. Movement vocabulary and normalization

The build's top-down movement is:

```csharp
xDirection = Input.GetAxisRaw("Horizontal");
yDirection = Input.GetAxisRaw("Vertical");
xvector = xDirection * speed;      // speed = 4
yvector = yDirection * speed;
rb.linearVelocity = new Vector2(xvector, yvector);
```

The lessons teach `moveSpeed`, `inputX`/`inputY`, `Input.GetAxis` (smooth), a `Vector2 movement` built with `Time.deltaTime`, and `transform.Translate`. 1.5's centrepiece is `direction.normalized` — **nothing in the build normalizes**, so diagonals currently move at ~5.66 units/s instead of 4.

- **D2a — names:** rewrite 1.4–1.6 to `speed`, `xDirection`/`yDirection`, `xvector`/`yvector`, `GetAxisRaw`. This is mechanical and certain.
- **D2b — normalization:** either add `.normalized` to the velocity line (one line; diagonal speed drops from 5.66 to 4) or rewrite 1.5's central concept. I recommend adding the line — 1.5's vector-magnitude lesson is one of the strongest in Unit 1, and losing it to save a line is a bad trade.
- **D2c — movement call in 1.4:** with no `Rigidbody2D` until 2.1, 1.4 must still use `transform.Translate`; that is consistent with 2.2's "Translate made you a ghost" pivot. Keep it, but the lesson's final file must use the real field names. Confirm whether the teacher's 1.4 used `Translate(xvector * Time.deltaTime, yvector * Time.deltaTime, 0)`; if so the `Vector2 movement` construction in the walkthrough is the piece to replace.

### D3. 2.3–2.6 describe systems the project never had

The build has **no Potion tag, no Potion prefab, no Spawner script, no max-health cap, no heal path**. 2.3 and 2.4 are honest that the student builds these from scratch — but the teacher's reference project never got them, and 2.5/2.6 tune systems that do not exist.

- **Option A:** treat 2.3/2.4 as lessons that were skipped or replaced in class, and rewrite 2.5/2.6 around what was actually built (`manager.coins`, `ChangeHealth`, `Die()`).
- **Option B:** the class did build them and the reference project is behind — then rebuild the project first, and this audit's 2.3–2.6 rows become "no lesson change."

Do not rewrite 2.5/2.6 until this is answered; they inherit whichever answer 2.3/2.4 get.

### D4. Detection: trigger radius (build) vs distance (lessons)

`TurretController` and `EnemyController` both detect with a child trigger collider (`"Detection Radius"`, `"range radious"`), `OnTriggerEnter2D`/`Exit2D`, `CompareTag("Player")`, and an `inRange` bool. Neither computes `Vector3.Distance` anywhere.

3.1 and 4.3 are built on `Vector3.Distance`, a serialized `range`/aggro float, and `GameObject.FindWithTag`. This is the largest conceptual mismatch in the course so far, and it repeats in two units.

- **Option A (recommended):** rewrite 3.1 and 4.3 around the trigger. The distance comparison then moves to a "why a collider beats a distance check here" discussion, not the build.
- **Option B:** change `TurretController`/`EnemyController` to distance checks, restoring both lessons and the 3.3 `lastAttackTime` chain. This is more code churn than Option A and re-drops the trigger-radius lessons.

### D5. Ground check and jump key

The build: **J** jumps, gravity is decided by `SceneManager.GetActiveScene().name == "Overworld"`, and landing is `OnCollisionEnter2D` + tag `Ground` resetting `jumpsRemaining`. There is no `Ground` layer, no `groundCheck` child, no `LayerMask`, no raycast, no gizmo.

6.1 teaches a serialized `isPlatformer` ticked in the Inspector + **Space**; 6.2 teaches the raycast/`LayerMask`/gizmo model. Both are contradicted.

- **Option A (recommended):** rewrite 6.1/6.2 to scene-name gravity + J + collision/tag. It is simpler, it is what exists, and `jumpsRemaining`/`maxJumps` is a better setup for 6.3's double jump than `isGrounded`.
- **Option B:** restore the lessons by changing the code (serialize `isPlatformer`, switch to Space, add a Ground layer + raycast). That also restores 7.2's premise that "6.2 creates the Ground layer."

### D6. Two small binary calls

- **flipX:** the build sets `renderer.flipX = false` when moving left and `true` when moving right; 1.6 teaches the inverse. Flip the lesson or flip the code.
- **Jump key name:** the field is `jumpforce`; the prefab still carries an orphan `jumpForce: 7` and `Platformer.unity` overrides `jumpforce: 10`. Pick one spelling in both code and lesson. While there: the scene's `isPlatformer: 1` override is inert because the field is no longer `[SerializeField]` — harmless, but delete it to avoid teaching a false lead.

---

## 2. Per-lesson change list

### 1.1 Launch — Minor

- `1.1.astro:50` — `Assets/Scripts` row lists **Lever**, which lives in `Package Scripts/`, and omits **PlayerProjectile.cs**. Replace with: `PlayerController, EnemyController, TurretController, Projectile, PlayerProjectile, StatManager`.
- `1.1.astro:51` — `Package Scripts` row omits **Lever**. Add it: `CameraController, Lever, SceneSwitch, TopDown_EnemyAnimator`.
- `1.1.astro:52` — optional: the Prefabs folder also holds `Platform`, `PatrolPoint`, `PatrolPoints`, `Player_Projectile`, `Turret_Projectile`. Not needed for the day-one story, but "Pictures with tags. No physics, no behaviour" is wrong for `Player_Projectile`/`Turret_Projectile` only after Unit 3; at 1.1 it is right.
- No other change.

### 1.2 Editor Tour — No change

The Player anatomy (root: Transform + PlayerController; Sprite child: SpriteRenderer + Animator) is the starter state and is accurate. `Rigidbody2D`, `BoxCollider2D`, and the `Square` attack-box child arrive in 2.1 and 4.6 and are correctly absent here.

### 1.3 PlayerLogger — No change

Standalone throwaway script. It does not touch the game's files.

### 1.4 Movement I — Major (D2)

- `:100` `[SerializeField] private float moveSpeed = 5f;` → `float speed = 4;` (the build's field is private and not serialized).
- `:108–109` `inputX` / `inputY` → `xDirection` / `yDirection`, plus the derived `xvector` / `yvector`. The scope lesson (declare in the class body) survives unchanged; only the names move.
- `:119–120` `Input.GetAxis` → `Input.GetAxisRaw`; the build reads the raw axis and multiplies by `speed` on the same frame.
- `:197` the `GetAxis` row's "smooth ramp" is the wrong API for this build. Add the `GetAxisRaw` row (instant −1/0/1, no ramp) and say which one this game uses.
- `:123–131` `Vector2 movement` + `transform.Translate(movement)` → the field-name rewrite plus either (a) the build's eventual `rb.linearVelocity`, if the teacher's 1.4 used a body, or (b) a `Translate` call built from `xvector`/`yvector`. See D2c.
- `:148–161` final file — regenerate to match whatever is chosen above.

### 1.5 Movement II & Animation States — Major (D2)

- `:112` `moveSpeed` → `speed`.
- `:99`, `:123` `.normalized` is absent from the build. See D2b: add the line to code, or the lesson's central idea is false.
- `:104`, `:127` `transform.Translate(movement)` → the 1.4 decision, then 2.2's `linearVelocity` swap. The four-method table (`:177–179`) is good and stays.
- `:197–204` the "Explain why (1,1) is longer than (1,0)" checkpoint is the one place to keep if D2b is answered "no normalization": it becomes a diagnosis, not a fix.

### 1.6 Animation — Major

- `:104–105` `spriteRenderer` → `renderer` (the build's field is `SpriteRenderer renderer;`).
- `:116` `spriteRenderer = GetComponentInChildren<SpriteRenderer>();` → `renderer = ...`.
- `:155` / `:159` flipX is inverted in the build: `false` = left, `true` = right. Invert the lesson (or the code — D6).
- `:168–183` `CheckAttack()` on `Input.GetMouseButtonDown(0)` → the build uses `Input.GetKeyDown(KeyCode.E)` inside `Update`. For 1.6, teach the `Attack` trigger on **E**; the hitbox and `currentEnemy` belong to 4.6 and should not appear here.
- `:224–245` the build picks `WalkDir` by `Mathf.Abs(xvector) > Mathf.Abs(yvector)`, then `yvector > 0` / `yvector < 0`. The lesson's branch order and conditions must copy that exactly.

### 2.1 Coins — Major (D1, D2)

- `:110` `[SerializeField] private int coins;` → `manager.coins`, with `manager = FindAnyObjectByType<StatManager>();` in `Start()`.
- `:122–123` `coins = coins + 1; Debug.Log("Coins collected: " + coins);` → `manager.coins += 1; print("you have " + manager.coins + " coins");`.
- `:136` final file — same rewrite.
- `:58`, `:239–243`, `:258–260` the Player gets a **CircleCollider2D** in the lesson; the build has a **BoxCollider2D 0.4 × 1**, offset y 0.4, solid, on the root. Change the step, the pane, and the checkpoint.
- `:3–4` "No prefab in this project carries a Rigidbody2D, and only one carries any collider" — true of the shipped starter, false of the current project. Add "as it ships" framing so a student opening the finished project does not think the page is lying.
- If D1 = Option A, this lesson also needs the `StatManager` object in `Start.unity` (it exists) and the `Awake` duplicate guard (already written) — introduce both here, not in 5.3.
- `ChangeCoin(int amount)` in the build ignores `amount` and always adds 1. Either fix it or leave it out of the lesson; do not teach it as a general method while it is wrong.

### 2.2 Spikes — Major

- `:147` `[SerializeField] private int health = 3;` → `int health = 3;` (the build does not serialize health).
- `:187` `TakeDamage(1)` → `ChangeHealth(-1)`.
- `:201–211` `TakeDamage` → `public void ChangeHealth(int amount) { health += amount; if (health < 0) Die(); }`. Note the build's threshold is `< 0`, so health sits at 0 for one hit before death; either teach that (and the off-by-one) or change the code to `<= 0`. Do not teach `<= 0` while the code says `< 0`.
- Add `Die()`: `health = 3; manager.coins = manager.coins / 2; if (manager.coins < 0) manager.coins = 0;`. The page currently offers death as a student choice (reload by index/name, reset, move); the build does none of those — it halves coins and resets health in place. Rewrite the death part to the built rule, or keep the choice and mark the reference as one option.
- `:173` `body.linearVelocity = direction * moveSpeed;` → `rb.linearVelocity = new Vector2(xvector, yvector);`, with `xvector = xDirection * speed`.
- `:182–188` `OnCollisionEnter2D` + `CompareTag("Spikes")` — matches.
- Spikes prefab really does ship with **no collider** (Transform + SpriteRenderer only), so the "add the collider" step is correct. Good.
- Body settings (Dynamic, Gravity Scale 0, Freeze Rotation Z) match the prefab. Good.

### 2.3 Healing & Max Health — Decision (D3)

- No Potion tag, no Potion prefab, no potion sprite, no heal method, no `Mathf.Clamp` cap anywhere in the build. `StatManager.health` is unused.
- If the class built it: add a Potion prefab/tag, a heal branch (likely `ChangeHealth(+1)` with a clamp), and a max-health field. If not: rewrite or cut the lesson.
- The page's own header is honest about building it from scratch, so this is not a factual error — it is a question of whether the reference project should contain what the page asks students to make.

### 2.4 Prefabs / Spawning — Decision (D3)

- Teaches a `Spawner` script (`[SerializeField] GameObject`, `Input.GetKeyDown`, `Instantiate`, `Quaternion.identity`). No `Spawner` script exists in `Assets/Scripts/`, and no Spawner object in any scene.
- The pane (`:111–121`) shows three Spikes and a Potion in the Overworld; the Overworld has neither.
- Options: (a) retarget the lesson to the `Instantiate` calls that do exist (`TurretController.Shoot`, `PlayerController.Shoot`, `EnemyController.Die`'s item drop) — but those are Unit 3/4 material; (b) keep 2.4 as a prefab-layout studio with no Spawner; (c) build the Spawner with students now.
- If 2.4 stays as written, it is the only place a `Spawner` exists, and it does not.

### 2.5 Unit 2 Studio — Major (inherits D3)

- `:62` `body.linearVelocity = direction * moveSpeed;` → `rb.linearVelocity = new Vector2(xvector, yvector);`.
- `:94` `moveSpeed` → `speed`.
- `:104` "In 1.5 you moved the Transform directly, so `moveSpeed` was…" — rewrite to the chosen D2 answer.
- Every potion/max-health tuning target is absent from the build. Replace with the built systems (`manager.coins`, `ChangeHealth`, `Die()`), once D3 is answered.

### 2.6 Unit 2 Review — Major (inherits D3)

- `:98` "Potion placement" row — remove or replace with Coin/Spike placement.
- The playtest checklist must use the built death rule (halve coins, reset health, stay in place), not a reload.

### 3.1 Turret Detection — Major (D4)

- The distance model (`Vector3.Distance`, `[SerializeField] float range`, `GameObject.FindWithTag` vs serialized Transform) does not exist. The build has a child trigger (`"Detection Radius"`), `OnTriggerEnter2D`/`OnTriggerExit2D`, `CompareTag("Player")`, `inRange`, and `target = other.transform`.
- Rewrite the decompose parts, the walkthrough, the API table, and the checkpoint around the trigger.
- `3.1.astro` also seeds `sqrMagnitude` discussion; keep it as the "what the collider does for you" contrast, not as the build.

### 3.2 Projectiles — Major

- `Projectile.cs` in the build is **target-seeded, not direction-committed**: `public Transform target;`, `target_position = target.position` in `Start()`, `Vector3.MoveTowards` each frame. `TurretController.Shoot()` assigns `projectile_script.target = target`.
- The lesson's "the bullet commits to a direction at the instant of firing" is the opposite mechanism. Rewrite the walkthrough and the spec, or change the code.
- `Projectile.lifespan` is **never initialized** (default 0), so `lifespan -= Time.deltaTime; if (lifespan < 0) Destroy` kills the bullet on its first frame. This is a build bug, not a lesson issue — see §3.
- The prefab now carries a **CircleCollider2D trigger** (tag `E_Fireball`); the "no collider, no body" claim is true only of the shipped starter. Re-frame as "as it ships."
- `Instantiate` + `SpawnPoint` (`spawnpoint.position`) + `quaternion.identity` (note `using Unity.Mathematics`) match. The lesson's `Quaternion.identity` is the same value; teach the import too.

### 3.3 Cooldowns — Major

- The lesson builds a **`Time.time` timestamp** (`private float lastAttackTime;`, `lastAttackTime = -cooldown;`, `Time.time - lastAttackTime >= cooldown`).
- The build uses a **countdown**: `float timer; float time_between_shots = 1.5f;`, `timer = time_between_shots` in `Start`, `timer -= Time.deltaTime` **only while `inRange`**, `if (timer < 0) { Shoot(); timer = time_between_shots; }`.
- Rewrite the walkthrough and final file to the countdown. Keep the four-technique table (it is a correct survey), but mark the countdown as this game's choice and say *why* (it pauses while the player is out of range, which a `Time.time` stamp does not).
- Names: `time_between_shots`, not `cooldown`. The Player's melee uses `cooldownTimer`; the two are separate fields in the build.
- The Player's shoot condition uses a `bool cooldown` that is never set false — see §3.

### 3.4 Projectile Damage — Major

- The build puts damage on the **receiver**: `PlayerController.OnTriggerEnter2D` checks `CompareTag("E_Fireball")`, calls `ChangeHealth(-2)`, and destroys the projectile. The projectile script has no damage code.
- The projectile prefab is tagged **`E_Fireball`**, not `Enemy`; the Turret root is `Enemy`.
- `player.TakeDamage(amount)` (`:176`) does not exist. The method is `ChangeHealth(int)`, public.
- Rewrite the decompose parts (adding collider/body to the projectile → the receiver model), the walkthrough, and the tag discussion. The "who asks whom" Socratic survives; the answer changes from "the bullet asks `GetComponent<PlayerController>()`" to "the player asks `CompareTag("E_Fireball")`."
- If the teacher wants the projectile-side receiver, that is a code change, not a lesson edit.

### 3.5 Player Projectile — **Missing page**

- `curriculum.ts:172–173` has the row (`group: '3.5'`, title, CED tags) but `lessons: []`, and there is no `3.5.astro` or `lessons.ts` entry. The lesson was taught 2026-10-08 and has no page.
- Content to write: clone `Turret_Projectile` → `Player_Projectile`; retag **`Fireball`**; CircleCollider2D trigger (0.14); `PlayerProjectile.cs` (`speed = 10`, `direction`, `lifespan = 2`, `SetDirection(String facing)` mapping Right/Left/Up/Down, `transform.position += direction * speed * Time.deltaTime`); `PlayerController.Shoot()` instantiates at `transform.position` with `Quaternion.identity` and calls `SetDirection(facing)`; reuse the 3.3 cooldown.
- Build defects the page must either teach around or the code must fix:
  - `GameObject projectile;` is **never assigned** and not `[SerializeField]` → `Instantiate(null, …)` throws on the first Space press. Add `[SerializeField] GameObject projectile;` and wire the prefab (or assign in `Start`).
  - `bool cooldown = true;` is never set to `false`; the shoot gate is always open, and `cooldownTimer` is reset but not checked for shooting. Use `cooldownTimer < 0` for both E and Space.
  - Nothing in the project receives the `Fireball` tag, so the player's bullet damages nothing yet. The page must not claim it does.

### 4.1 Enemy Patrol — Major

- The lesson builds `waypointA`/`waypointB` Transforms, `arriveDistance`, and `body.linearVelocity`. The build uses a **list**: `[SerializeField] private List<Transform> patrolpoints`, `int patrolNumber`, `Vector3.MoveTowards(transform.position, target_position, speed * Time.deltaTime)`, wrapping at `Count`, `speed = 2`.
- Rewrite the walkthrough, the decompose parts, and the final file to the list model. `curriculum.ts:125` already says the reference build uses two waypoints and a list is "the same idea with more stops" — the code chose the list, so the page must teach it.
- The prefab has a Dynamic Rigidbody2D (GravityScale 0) and a solid 0.5 × 1 collider plus a `"range radious"` trigger. The "no collider and no body" premise is false; the body exists but the script does not use it (`MoveTowards` writes the transform).
- Guard: an empty `patrolpoints` list throws `IndexOutOfRangeException` in `Start()`. Teach the count/guard, or the list is a trap.

### 4.3 Chase — Major (D4)

- The build chases on the **trigger**: `OnTriggerEnter2D` Player → `inRange = true; target = other.gameObject.transform;`, then `target_position = target.position`. No `Vector3.Distance`, no aggro float, no `FindWithTag`.
- Rewrite the decompose parts, the "slow down on the direction" callout, the coexistence table, and the spec. The two-writer problem survives (`inRange` is the flag model), and the patrol list is the thing being overridden.
- `attacking` is declared and never used; do not teach it.
- The enemy does not drive an animator in the build (no `SetInteger`/`SetFloat` in `EnemyController`), so 4.3's facing part and its 4.2 dependency are not built yet.

### 4.6 Player Melee — **Missing page**

- `curriculum.ts:184–185` has the row but `lessons: []`; no `4.6.astro`, no `lessons.ts` entry. Taught 2026-10-22.
- Content to write: the Player's child **`Square`**, BoxCollider2D trigger 1 × 1, wired to `[SerializeField] GameObject attack_box`; `attack_box.transform.position` set per facing in `Update` (Right `+(.5,.5)`, Left `−(.5,.5)`, Up `(0,1)`, Down `(0,0)`); `OnTriggerEnter2D` Enemy → `currentEnemy`; `OnTriggerExit2D` → `null`; **E** + `cooldownTimer < 0` → `currentEnemy.GetComponent<EnemyController>().ChangeHealth(-1)`, then `cooldownTimer = .5f`.
- The Overworld Canvas already carries **"Press [E] to Interact"** — use it as the in-world cue.
- Build defect: the Turret root is also tagged **`Enemy`** and has no `EnemyController`, so meleeing a turret throws `NullReferenceException`. Either give the turret a health component, tag it separately, or teach `TryGetComponent`.
- `ChangeHealth(-1)` on an enemy with 3 health and a `< 0` death check takes **four** hits, not three. Decide whether to teach that or change the threshold.

### 7.1 Tilemaps — Minor

- Its ground truth matches the project: Grid cell size 1 × 1; `Collision` (75 tiles, tag `Ground`, TilemapCollider2D + CompositeCollider2D + Static Rigidbody2D), `Cave Exit` (2 tiles, untagged, SceneSwitch), `No Collision` (85 tiles, renderer only); the palette folders and prefabs. No factual fixes.
- Cross-references to 6.2 must be re-based after 6.2 is rewritten:
  - `:109` "the 6.2 check distance"
  - `:122` "the tag-versus-layer callout in 6.2 where you put the `Ground` layer on two of them"
  - `:141` "the ground check and its gizmo from 6.2"
- `:131` "the build-once-stamp-many habit from 2.4" — re-point if 2.4 loses its Spawner.
- `:288` "your 6.1 jump" — fine once 6.1 is J; no key is named here.

### 6.1 Gravity & Jump — Major (D5)

- `:130`, `:168`, `:254` `[SerializeField] private bool isPlatformer = false;` + "tick Is Platformer on the cave Player in the Inspector" → the build's bool is **private and not serialized**, and is set by scene name, not the Inspector.
- `:141` `body = GetComponent<Rigidbody2D>();` → `rb`.
- `:146–153` `if (isPlatformer) body.gravityScale = 1f;` → the build sets both branches:
  ```csharp
  if (SceneManager.GetActiveScene().name == "Overworld") { rb.gravityScale = 0; isPlatformer = false; }
  else { rb.gravityScale = 1; isPlatformer = true; jumpsRemaining = maxJumps; }
  ```
- `:206–223` `[SerializeField] private float jumpForce = 7f;` → `[SerializeField] float jumpforce;` (scene overrides it to 10); `KeyCode.Space` → `KeyCode.J`; `body.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse)` → `rb.AddForceY(jumpforce, ForceMode2D.Impulse)`.
- The page's ground-truth note about the existing `isPlatformer` override (`:21`, `:132`) is now a false lead: the override is in `Platformer.unity:2099` but the field is no longer serialized, so it is inert. Delete the "the scene has carried an override, this spelling picks it up" argument or serialize the field.
- The `Debug.Log("v.y = …")` proof (`:237`) is not in the build (the build prints `"jump"` and `jumpsRemaining`). Add the log to code or rewrite the proof.
- `jumpsRemaining` / `maxJumps` are seeded in `Start()` in the build. Decide whether 6.1's final file includes them (it should, or 6.1 and 6.2 disagree about the file they share).

### 6.2 Ground Checks — Major (D5)

- The entire page is the raycast model: `groundCheck` Transform child, `groundCheckDistance`, `LayerMask groundLayer`, `isGrounded`, `Physics2D.Raycast`, `OnDrawGizmosSelected`, a `Ground` layer created in Tags & Layers, and `isGrounded && Input.GetKeyDown(KeyCode.Space)`.
- The build is:
  ```csharp
  int jumpsRemaining; int maxJumps = 1;
  if (Input.GetKeyDown(KeyCode.J) && jumpsRemaining >= 1) { Jump(); jumpsRemaining -= 1; }
  void OnCollisionEnter2D(Collision2D other) {
      if (other.gameObject.CompareTag("Ground")) { jumpsRemaining = maxJumps; }
  }
  ```
- Rewrite the page to collision + tag + `jumpsRemaining`. The `Ground` tag **already exists**; the `Collision` tilemap already carries it. No layer, no child, no gizmo, no raycast.
- `:191` "the key check is the one from 5.2" — typo; 6.1.
- Build bug worth teaching or fixing: walking off a ledge never clears `jumpsRemaining`, so the player keeps one mid-air jump. Add `OnCollisionExit2D` (tag `Ground` → `jumpsRemaining = 0`) or teach the bug as the 6.3 setup.
- Downstream pages 6.3, 6.4, 7.2, 7.3 all assume `isGrounded`, Space, and a Ground layer. They are not taught yet, but they will need re-basing after this decision.

---

## 3. Build defects found during the audit

These are independent of the lessons. Some are worth a code edit; some are worth teaching as the next bug hunt.

| # | Where | Defect | Consequence |
|---|---|---|---|
| 1 | `PlayerController.cs:25, 236` | `GameObject projectile;` is never assigned and not `[SerializeField]` | `Instantiate(null, …)` throws on the first Space press; 3.5's feature cannot fire |
| 2 | `Projectile.cs` | `lifespan` declared but never initialized (default 0) | Turret bullets are destroyed on their first frame |
| 3 | `PlayerController.cs:128–140` | `bool cooldown = true;` is never set false; `cooldownTimer` reset but not checked for shooting | Space fires with no rate limit; the two cooldowns disagree |
| 4 | `PlayerController.cs:52, 155, 199` | `manager` comes from `FindAnyObjectByType<StatManager>()` with no null guard | Any scene without a StatManager throws on the first coin or on `Die()` |
| 5 | `PlayerController.cs:182–186` | `ChangeCoin(int amount)` ignores `amount` | A method that claims to take an amount always adds 1 |
| 6 | `PlayerController.cs:190–212` | `ChangeHealth` uses `health < 0`; `health` can sit at 0 | Death takes one extra hit; the lesson says `<= 0` |
| 7 | `PlayerController.cs:203–211` | `Die()` resets health and halves coins, no relocation or reload | No visible death; the player keeps playing in place |
| 8 | `PlayerController.cs:174–181` | `OnCollisionEnter2D` only resets `jumpsRemaining`; no exit reset | Walking off a ledge leaves a mid-air jump available |
| 9 | `PlayerController.cs:128–133` | `currentEnemy.GetComponent<EnemyController>()` on an `Enemy`-tagged object | Meleeing a Turret (tag `Enemy`, no `EnemyController`) throws |
| 10 | `EnemyController.cs:23` | `patrolpoints[patrolNumber]` with no count guard | An empty list throws in `Start()` |
| 11 | `StatManager.cs` | `public int health` is never read; health lives on `PlayerController` | Two health stores, one of them dead |
| 12 | `Player.prefab`, `Platformer.unity` | Orphan `jumpForce: 7` (prefab) vs `jumpforce: 10` (scene); inert `isPlatformer: 1` override | Editing the Inspector field does nothing; the scene override misleads |

Items 1, 2, 3 are blockers for anything the site claims about 3.5. Items 9 and 10 are the best bug-hunt material in the current build.

---

## 4. Curriculum and metadata changes

- `curriculum.ts:172–173` (3.5) and `:184–185` (4.6) — `lessons: []` → `lessons: ['3.5']` / `['4.6']`, once the pages exist. Until then both rows render as group-only on the dashboard and are missing from the prev/next chain.
- `lessons.ts` — add entries for `3.5` and `4.6` (title, badge class, group).
- 7.1 is scheduled on both 2026-10-26 and 2026-10-28 against a single page. If that is deliberate ("same palette, bigger canvas"), the page should say so; as it stands the second day's "Tilemaps II: Building the Cave" has no distinct content.
- 2.3–2.6: 2.3 is its own day; 2.4/2.5/2.6 share the 9/28 studio row. That is consistent with the pages, but 2.5/2.6's content is the part most dependent on D3.
- **Answer-box constraint:** rewriting a walkthrough's code does not touch answer ids. Changing the *number* of questions inside a Socratic block does. If a rewrite adds or drops a question, append or trim from the end only — never reorder or insert mid-block.

---

## 5. Out of scope but already chained to the old model

Not taught yet; do not edit now, but they will contradict the pages above once those are fixed.

- **4.2 / 4.4 / 4.5** — `TakeDamage`, max-health cap, contact damage.
- **5.3** — the StatManager refactor premise (see D1).
- **6.3 / 6.4 / 6.5** — `isGrounded`, Space, `moveSpeed`, `lastAttackTime`.
- **7.2** — the `Ground` layer, the raycast mask, "the player carries no collider."
- **7.3** — "Space to jump."
- **Docs** — `docs/unit-01` through `unit-07` and `docs/reference/unity-csharp-quickref.html` carry `moveSpeed`, `TakeDamage`, waypoints, `lastAttackTime`, `isGrounded`. The quick reference is API-shaped and mostly survives; the unit guides repeat the lessons' model and will need the same sweep.

---

## 6. Suggested order of work

1. **D5 + 6.1 + 6.2** — the current unit; students are in it today. This is also the smallest rewrite of the three big ones.
2. **3.5 + 4.6 pages** — the two missing lessons, because they are the most recent class work and the only pages that do not exist at all.
3. **D1 + 2.1 + 2.2** — the coin/health foundation. Every later stat reference depends on which answer wins.
4. **D4 + 3.1 + 3.3 + 3.4 + 4.1 + 4.3** — the Unit 3/4 receiver/detection/timing rewrites.
5. **D2 + 1.4 + 1.5 + 1.6** — Unit 1 vocabulary. Mechanical, but touches the most pages.
6. **D3 + 2.3–2.6** — last, because it is the only block whose answer may be "delete the lesson" rather than "rewrite it."
7. **7.1 cross-references** — one pass after 6.2 lands.

Build defects 1–3 should be fixed before 3.5 is written, or the page will teach a feature that cannot run.
