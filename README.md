# AP CS Principles — IBW, Unity, B days (2026-27)

A student-and-teacher site for AP Computer Science Principles at Ida B.
Wells High School, where the course meets **every B day** and runs on
**Unity all year**. Students fork a real game
(`cs-curriculum-main` — a 2D RPG that becomes a 2D platformer in its
caves), rebuild every system in it during first semester, then run game
jams and the AP Create performance task in second semester. The AP CSP
big ideas are woven through every week.

Built with [Astro](https://astro.build) + [Pagefind](https://pagefind.org),
deployed to GitHub Pages.

## The course in one paragraph

Semester 1 is one long build: movement → coins & health → a turret → an
enemy state machine → the axe & the cave → jumping → tilemap levels →
ladders → **your own boss fight**, ending with a semester final that is
"a normal B day" (Jan 21). Semester 2: the CSP big ideas Unity cannot
teach alone (data, systems, impact), then the **2-Button Jam**, the
**Card Game Jam** (lists, arrays, ScriptableObjects — the AP's favorite
data structures, built for real), the **Create PT** (30% of the AP
score, due Apr 30), the **AP exam** (May 14, 2027, Bluebook), and a
post-exam **Season 2** of jams — including deliberate placeholder days
that absorb snow-day shifts.

## Repo layout

```
src/
  data/
    curriculum.ts      # THE source of truth: B-day calendar, SEQUENCE,
                      # phases, CED topics; sanity-checked at build
    lessons.ts         # per-lesson titles/badges/groups for the dashboard
  layouts/             # BaseLayout (head/nav) + LessonLayout (chain,
                      # answer boxes, progress toggle)
  lib/formify.ts       # build-time transform: questions -> answer boxes
  integrations/
    pacing-md.ts       # regenerates PACING.md + dist/sitemap.xml post-build
  pages/
    index.astro        # Dashboard (6 phase tabs, My-work backup panel)
    pace.astro         # Pacing Calendar: every B day mapped to its work
    projects.astro     # The Build: what ships each phase
    search.astro 404.astro
    docs/              # 12 unit guides + concept docs + quick reference
    exam/              # Create PT, written responses, MC strategy,
                      # reference sheet, exam hub
    lessons/           # 81 lesson pages (the heart of the site)
    teachers/canvas.astro   # teacher workflow (lab JSON -> Canvas)
public/
  style.css  js/lab-forms.js  data/playtests.csv  favicon.svg
scripts/
  verify-site.mjs     # link + completeness checks after build
  new-lesson.mjs      # scaffold a new lesson page
```

## Editing the course

Everything on the site renders from `src/data/curriculum.ts`:
- **Add/re-date a lesson**: edit `SEQUENCE` (and add metadata in
  `lessons.ts`). The dashboard, prev/next chain, pacing calendar, and
  PACING.md all follow automatically — no per-page wiring.
- **Sanity checks run at build time**: a SEQUENCE date that is not a
  B day fails the build (this caught a real Nov 30 error during
  construction).
- **The B-day calendar** (Sep 1 2026 - Jun 3 2027 + the Jan 21 finals
  day) was read from the IBW Trivory calendar in September 2026. Snow
  days are not modeled; the placeholder jam days (Jun 1, Jun 3) absorb
  shifts.

### Commands

```bash
npm install        # once
npm run dev        # local dev server
npm run build      # dist/ + PACING.md + sitemap.xml + Pagefind index
npm run verify     # integrity checks (run after build)
npm run preview    # serve the built site locally
npm run new-lesson -- 9.11a   # scaffold a lesson page
```

## Deploying to GitHub Pages

The site builds to static files with `base: '/AP_CS_Principles'`
(see `astro.config.mjs`). Push this folder to a GitHub repo named
**AP_CS_Principles** under your account; `.github/workflows/deploy.yml`
builds and deploys on every push to main. The site then lives at
`https://<user>.github.io/AP_CS_Principles/`.

## Credits

Course design and the starter project: the AP CS Principles class at
Ida B. Wells High School, Portland, OR. Site architecture ported from
the AP CS A Guide (same build system, same lab-forms idea). Starter game:
`cs-curriculum-main`; card jam template: `Card-Game-Template-main` —
both used under their open-source licenses (see lesson 9.10 for the
attribution discussion your students should have).
