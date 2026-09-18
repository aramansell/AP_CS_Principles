#!/usr/bin/env python3
"""
One-shot refactor pass: cut the retired section types out of the lesson pages.

This is a migration script, not part of the build. It exists so the cut is one
reviewable, repeatable operation across 81 files rather than 81 hand edits, and
it is deleted once the refactor lands. See the plan for the shape it produces.

It removes:
  - every <div class="tinker"> block
  - every <div class="bug-hunt"> block, except in BUG_HUNT_KEEP
  - the activity wrapper that held either, hoisting whatever else it contained
  - every question after the third in a <div class="socratic"> list
  - `pitfalls: [...]` and `connect: [...]` from the specs above the body

Block matching is a depth-counted div walk rather than a regex, because the
activity wrappers contain nested divs. The tinker/bug-hunt/socratic blocks
themselves contain none (verified across all 81 files), which is what makes
the inner cuts safe.

Run from the repo root:  python3 scripts/streamline-cut.py [--dry-run]
"""
import re
import sys
import glob
import os

# Breaking something on purpose IS the teaching method in these three: 1.3
# introduces debugging, and 1.4 / 1.6 are the lessons whose own activity is
# labelled "Test It, Then Break It". Everywhere else the bug hunt was one more
# form to fill in.
BUG_HUNT_KEEP = {'1.3', '1.4', '1.6'}

# Activity labels that named a section this refactor removes. A wrapper still
# carrying one of these, with no live block left inside it, is furniture for a
# section that no longer exists.
RETIRED_LABEL = re.compile(r'Bug Hunt|Tinker')

DRY = '--dry-run' in sys.argv


def matching_div(s, open_idx):
    """Index just past the </div> that closes the <div> starting at open_idx."""
    depth = 0
    i = open_idx
    while i < len(s):
        m = re.compile(r'<div\b|</div>').search(s, i)
        if not m:
            return None
        if m.group(0) == '</div>':
            depth -= 1
            if depth == 0:
                return m.end()
        else:
            depth += 1
        i = m.end()
    return None


def cut_blocks(s, cls):
    """Remove every <div class="cls">…</div>. Returns (text, count)."""
    n = 0
    while True:
        m = re.search(r'<div class="' + re.escape(cls) + r'">', s)
        if not m:
            return s, n
        end = matching_div(s, m.start())
        if end is None:
            return s, n
        # Take the surrounding blank line / indentation with it so the cut
        # does not leave a run of empty lines behind.
        start = m.start()
        line_start = s.rfind('\n', 0, start) + 1
        if s[line_start:start].strip() == '':
            start = line_start
        while end < len(s) and s[end] in ' \t':
            end += 1
        if s[end:end + 1] == '\n':
            end += 1
        s = s[:start] + s[end:]
        n += 1


def unwrap_retired_activities(s):
    """Drop the activity wrapper around a section this refactor removed.

    Returns (text, unwrapped, emptied).

    A wrapper is retired when its label names a removed section AND it no
    longer holds that section's block. The second half of that test is what
    protects 1.3/1.4/1.6, which keep their bug hunt: their wrappers still
    contain a live block and are left alone.

    What is left inside is HOISTED to lesson level, not deleted. That matters
    because the wrapper usually held more than the block: in 2.2 the tinker was
    the only thing in its wrapper besides the Checkpoint, and deleting the
    wrapper outright would have taken the Checkpoint with it — while leaving it
    in place would print "Tinker" over a checkpoint. Both are worse than a
    checkpoint with no heading of its own, which is what this produces.

    Note the wrapper's own <div> tags are part of `inner` — the earlier version
    of this function tested the whole element for emptiness and so never once
    matched. The body has to be cut out of it first.
    """
    unwrapped = 0
    emptied = 0
    i = 0
    while True:
        m = re.search(r'<div class="activity [^"]*">', s[i:])
        if not m:
            return s, unwrapped, emptied
        start = i + m.start()
        end = matching_div(s, start)
        if end is None:
            return s, unwrapped, emptied
        inner = s[start:end]
        label = re.search(r'activity-label">([^<]*)', inner)
        label = label.group(1) if label else ''
        live = ('class="bug-hunt"' in inner) or ('class="tinker"' in inner)
        if not RETIRED_LABEL.search(label) or live:
            i = end
            continue

        body = s[s.index('>', start) + 1:end - len('</div>')]
        body = re.sub(r'<div class="activity-header">.*?</div>', '', body, flags=re.S)
        # Leftover comments would read as separators for a section that is gone.
        body = re.sub(r'^\s*<!--.*?-->\s*$', '', body, flags=re.M | re.S)
        # Dedent one level, but never inside a <pre>: there, leading spaces are
        # the indentation the code sample is being read for.
        if '<pre' not in body:
            body = re.sub(r'^ {4}', '', body, flags=re.M)
        body = body.strip('\n')
        if body.strip() == '':
            emptied += 1
            repl = ''
        else:
            repl = '\n' + body + '\n'

        cut_from = start
        line_start = s.rfind('\n', 0, start) + 1
        if s[line_start:start].strip() == '':
            cut_from = line_start
        # An emptied wrapper leaves its own "=====" separator pointing at
        # nothing, so that goes too.
        if repl == '':
            prev = s.rfind('\n', 0, cut_from - 1)
            prev_line = s[prev + 1:cut_from]
            if re.fullmatch(r'\s*<!--.*?-->\s*', prev_line, re.S):
                cut_from = prev + 1
        cut_to = end
        while cut_to < len(s) and s[cut_to] in ' \t':
            cut_to += 1
        if s[cut_to:cut_to + 1] == '\n':
            cut_to += 1
        s = s[:cut_from] + repl + s[cut_to:]
        unwrapped += 1
        i = cut_from + len(repl)


def is_question(item):
    """Mirror of formify's isQuestion, so the cap counts what gets a box.

    A list item only becomes a question — and only gets an answer box — if it
    asks something. Bare instructions ("Open PlayerController.cs:") are kept in
    the list by formify but are not questions. Capping on <li> rather than on
    questions would therefore trim real questions to keep instructions.
    """
    text = re.sub(r'<[^>]+>', ' ', item)
    text = re.sub(r'&#8217;|&rsquo;', "'", text)
    text = re.sub(r'&amp;', '&', text)
    text = re.sub(r'&[a-z]+;|&#\d+;', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    if len(text) < 12:
        return False
    if '?' in text:
        return True
    return not re.search(r'[.:]$', text)


def cap_socratic(s, limit=3):
    """Cut each socratic list back to its first `limit` questions.

    Returns (text, questions_removed, trailing_items_removed). The two counts
    are reported separately because they are different edits: the first is the
    cap the teacher asked for, the second is the orphaned tail that sat after
    the last surviving question and is dropped with it.

    First-n, not best-n: the questions become the answer-box ids a student's
    saved answers are filed under (`LESSON:sc1:q2`), so trimming from the end
    leaves every surviving id pointing at the question it always did.

    The cut lands after the limit-th QUESTION, not the limit-th item, because
    the question is what the student answers — a bare instruction between two
    questions is kept by formify (it just gets no box), and counting it would
    spend part of the budget on something nobody answers.
    """
    n = 0
    tail = 0
    i = 0
    while True:
        m = re.search(r'<div class="socratic">', s[i:])
        if not m:
            return s, n, tail
        start = i + m.start()
        end = matching_div(s, start)
        if end is None:
            return s, n, tail
        block = s[start:end]
        ol = re.search(r'<ol[^>]*>', block)
        if not ol:
            i = end
            continue
        ol_end = block.find('</ol>', ol.end())
        if ol_end == -1:
            i = end
            continue
        items = re.findall(r'<li\b.*?</li>', block[ol.end():ol_end], re.S)
        questions = [it for it in items if is_question(it)]
        if len(questions) <= limit:
            i = end
            continue
        # Index just past the limit-th question.
        seen = 0
        cut = None
        for idx, item in enumerate(items):
            if is_question(item):
                seen += 1
                if seen == limit:
                    cut = idx + 1
                    break
        if cut is not None and cut < len(items):
            kept = items[:cut]
            new_ol = block[:ol.end()] + '\n' + '\n'.join(kept) + '\n' + block[ol_end:]
            s = s[:start] + new_ol + s[end:]
            n += len(questions) - limit
            tail += len(items) - cut - (len(questions) - limit)
            end = start + len(new_ol)
        i = end


def scan_bracket(s, i):
    """Index just past the ] that closes the [ at s[i], or None.

    A real scanner rather than a regex: these specs are full of prose strings
    containing brackets, apostrophes and escaped quotes ('3.4\\'s'), and a
    naive quote-skip mis-pairs on the escaped ones and walks off the end.
    Tracks string state (single, double and backtick) with backslash escapes,
    and skips // and /* */ comments.
    """
    depth = 0
    quote = None
    while i < len(s):
        c = s[i]
        if quote:
            if c == '\\':
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in '\'"`':
            quote = c
        elif c == '/' and s[i:i + 2] == '//':
            i = s.find('\n', i)
            if i == -1:
                return None
            continue
        elif c == '/' and s[i:i + 2] == '/*':
            i = s.find('*/', i)
            if i == -1:
                return None
            i += 2
            continue
        elif c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    return None


def cut_js_array(s, key):
    """Remove a `key: [ ... ]` property from a spec object. Returns (text, count)."""
    n = 0
    pat = re.compile(r'^\s*' + key + r':\s*\[', re.M)
    while True:
        m = pat.search(s)
        if not m:
            return s, n
        end = scan_bracket(s, m.end() - 1)
        if end is None:
            return s, n
        # Swallow the trailing comma and newline.
        while end < len(s) and s[end] in ' \t':
            end += 1
        if s[end:end + 1] == ',':
            end += 1
        if s[end:end + 1] == '\n':
            end += 1
        # And the leading indentation.
        start = m.start()
        s = s[:start] + s[end:]
        n += 1


def main():
    files = sorted(glob.glob('src/pages/lessons/*.astro'))
    totals = {'tinker': 0, 'bug-hunt': 0, 'retired-wrapper': 0, 'wrapper-emptied': 0,
              'socratic-q': 0, 'socratic-tail': 0, 'pitfalls': 0, 'connect': 0}
    for path in files:
        lid = os.path.basename(path).replace('.astro', '')
        src = open(path, encoding='utf-8').read()
        orig = src

        src, n = cut_blocks(src, 'tinker')
        totals['tinker'] += n

        if lid not in BUG_HUNT_KEEP:
            src, n = cut_blocks(src, 'bug-hunt')
            totals['bug-hunt'] += n

        src, n, emptied = unwrap_retired_activities(src)
        totals['retired-wrapper'] += n
        totals['wrapper-emptied'] += emptied

        src, n, tail = cap_socratic(src)
        totals['socratic-q'] += n
        totals['socratic-tail'] += tail

        src, n = cut_js_array(src, 'pitfalls')
        totals['pitfalls'] += n
        src, n = cut_js_array(src, 'connect')
        totals['connect'] += n

        if src != orig and not DRY:
            open(path, 'w', encoding='utf-8').write(src)

    print(('DRY RUN — ' if DRY else '') + 'streamline-cut:')
    for k, v in totals.items():
        print(f'  {k:16s} {v}')
    print(f'  files changed:   {len(files)}')


if __name__ == '__main__':
    main()
