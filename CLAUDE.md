# CLAUDE.md

Project instructions for this repo. Keep this file short — the detail lives in
[`LESSON_SPEC.md`](LESSON_SPEC.md) (lesson authoring rules) and
[`README.md`](README.md) (repo layout, commands, course shape). Read those rather
than duplicating them here.

## Git workflow

**Work directly on `main`.** Do not create a feature branch, and do not use a
git worktree. This is a solo repo — Aram is the only contributor, so a
branch-and-PR round trip buys nothing.

**Always commit your work.** When a piece of work is done and verified, commit
it — do not wait to be asked, and do not leave finished work sitting
uncommitted in the tree. A branch is never the answer to "should I be on main?".

**Never push.** Committing is local and always wanted; pushing is Aram's step,
and it stays that way on purpose — he reviews the diff and pushes himself. So
commit as work finishes, then stop there and leave the push to him. Do not
`git push` unless he asks for that specific push.

## Build and verify

```bash
npm run build     # dist/ + PACING.md + sitemap.xml + Pagefind index
npm run verify    # integrity checks — run AFTER build
```

`dist/` is **tracked in this repo**. A source edit that isn't followed by a
rebuild leaves the two out of step, so run `npm run build` before committing and
include the regenerated `dist/` files in the same commit.

`npm run verify` is the gate — it checks the lesson chain, internal links, the
scaffolding ladder, decompose decay, the answer-box counts, and the Socratic
question cap. A change that fails it is not finished. When you add a rule that
matters, add a check for it rather than trusting a convention.

## Two traps that silently destroy work

These have both bitten real edits. Neither produces a build error.

**Answer-box ids are positional and persisted.** `formify()` derives ids from
document order (`lessonId:sc1:q2`), and `public/js/lab-forms.js` saves student
answers to `localStorage` under those ids. Reordering, inserting or deleting a
question *inside* a surviving block silently orphans saved answers — the box
stays, the student's text vanishes. Append or trim from the end instead.

**An empty `what` drops the whole annotation.** In a walkthrough spec, the
renderer filters annotations with `.filter((x) => x.line.what.trim() !== '')`.
The code line still renders, but `why`, `hint` and `doc` on that line go with it.
Setting `what: ''` is how you silence a line — never do it to a line carrying a
`why` or `hint`, or you delete teaching content invisibly.
