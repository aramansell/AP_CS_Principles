#!/usr/bin/env python3
"""
One-shot refactor pass: cut the retired section types out of the lesson pages.

This is a migration script, not part of the build. It exists so the cut is one
reviewable, repeatable operation across 81 files rather than 81 hand edits, and
it is deleted once the refactor lands. See the plan for the shape it produces.

It removes:
  - every <div class="tinker"> block
  - every <div class="bug-hunt"> block, except in BUG_HUNT_KEEP
  - activity wrappers left with nothing but a header
  - any <li> after the third in a <div class="socratic"> list
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


def cut_empty_activities(s):
    """Drop activity wrappers that are now no more than a header."""
    n = 0
    i = 0
    while True:
        m = re.search(r'<div class="activity [^"]*">', s[i:])
        if not m:
            return s, n
        start = i + m.start()
        end = matching_div(s, start)
        if end is None:
            return s, n
        inner = s[start:end]
        rest = re.sub(r'<div class="activity-header">.*?</div>', '', inner, flags=re.S)
        rest = re.sub(r'<!--.*?-->', '', rest, flags=re.S)
        rest = re.sub(r'<h[1-6][^>]*>.*?</h[1-6]>', '', rest, flags=re.S)
        if rest.strip() == '':
            cut_from = start
            line_start = s.rfind('\n', 0, start) + 1
            if s[line_start:start].strip() == '':
                cut_from = line_start
            cut_to = end
            while cut_to < len(s) and s[cut_to] in ' \t':
                cut_to += 1
            if s[cut_to:cut_to + 1] == '\n':
                cut_to += 1
            s = s[:cut_from] + s[cut_to:]
            n += 1
            i = cut_from
        else:
            i = end


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
    totals = {'tinker': 0, 'bug-hunt': 0, 'empty-activity': 0,
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

        src, n = cut_empty_activities(src)
        while n:
            totals['empty-activity'] += n
            src, n = cut_empty_activities(src)

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
