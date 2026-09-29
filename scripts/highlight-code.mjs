#!/usr/bin/env node
/**
 * Syntax colouring for the built site — VS Code's own grammar, VS Code's own theme.
 *
 * The lessons are authored as raw HTML inside a template literal, so there is no
 * Markdown fence for Astro's Shiki integration to catch: the code is already
 * rendered markup by the time the page exists. The colouring therefore happens
 * here, as a step over `dist/` — `npm run build` runs this between `astro build`
 * and Pagefind, so the served page, the committed `dist/` and the search index
 * all hold the same bytes. (Dev mode does not run it; `npm run build` is the
 * truth. That is the same trade the tracked `dist/` already makes.)
 *
 * Why Shiki: it is VS Code's TextMate grammar driving VS Code's Dark+ theme, so
 * "stylize the code the way VS Code does" is not an impression of the editor, it
 * is the editor's tokenizer and the editor's palette. It is already on disk as
 * Astro's own dependency, so this imports it directly rather than adding a
 * second copy to package.json.
 *
 * The palette does NOT live here. Each token colour becomes a class (`tk-kw`,
 * `tk-ty`, …) and the eight hexes are written once, in public/style.css. This
 * file holds the mapping from hex to class name, which is a duplicate of that
 * list — so `npm run verify` check 15 fails if the two ever disagree, and fails
 * again if any colour reaches the page that the palette cannot name. A colour
 * inlined as `style="color:#…"` is how a future grammar update would try to
 * arrive unnoticed, and check 15 is what stops it.
 *
 * A block is coloured when it says what it is: `class="lang-cs"` on the `<pre>`
 * (also lang-bash, lang-json, lang-yaml). Nothing is guessed from the content.
 * Most of the code blocks in this course that are not walkthrough C# are not code
 * at all — they are trade analogies, a DNS transcript, Unity scene YAML,
 * pseudocode with arrows in it — and a heuristic that colours `nslookup` as C#
 * would be worse than leaving the block alone. The walkthrough renderer declares
 * its own blocks (walkthrough.ts), and the hand-written ones were marked in the
 * lesson sources by hand.
 *
 *   node scripts/highlight-code.mjs          # colour dist/, report what it did
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHighlighter } from 'shiki';

const ROOT = path.resolve('dist');
const THEME = 'dark-plus'; // what current VS Code ships; not the old Dark+

// hex -> class. Mirrors the `--tk-*` block in public/style.css (verified there).
const PALETTE = {
  '#569CD6': 'tk-kw', // keyword: public, class, private, static, var
  '#C586C0': 'tk-ct', // control flow: using, if, for, return, foreach
  '#4EC9B0': 'tk-ty', // type: MonoBehaviour, Rigidbody2D, UnityEngine
  '#DCDCAA': 'tk-fn', // function: Start, GetComponent, Debug.Log
  '#9CDCFE': 'tk-va', // variable, field, parameter
  '#CE9178': 'tk-st', // string
  '#B5CEA8': 'tk-nu', // number
  '#6A9955': 'tk-cm', // comment
};
const DEFAULT = '#D4D4D4'; // punctuation and plain text: the page's own colour, no span

// Language ids the lessons may declare. Shiki knows all of these; `cs` is ours.
const LANGS = { cs: 'csharp', csharp: 'csharp', sh: 'bash', bash: 'bash', json: 'json', yaml: 'yaml' };
const LABELS = { csharp: 'C#', bash: 'Shell', json: 'JSON', yaml: 'YAML' };

// A nested span (the guided build's gap — the student's blank) is swapped for a
// marker while the grammar reads the block, and swapped back afterwards.
//
// The marker has to survive tokenizing *whole*: an exotic character does not.
// The first attempt used a private-use char (``), the C# grammar dropped
// it as a non-printing nuisance and matched the digit inside it as a NUMBER, so
// the marker arrived back as a lone `0` — and a marker that does not come back
// cannot be restored, which silently deleted the green blank from every guided
// build in the course. A plain identifier cannot be split: it is one token in
// every position a blank can appear, including mid-expression (`body.____ = x`),
// because C# identifiers have no interior punctuation to break on.
const MARK = 'zzwtgapmarkerzz';
const MARK_RE = /zzwtgapmarkerzz(\d+)zz/g;

const unesc = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#0?39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&'); // &amp; last: it is the escape of an escape
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); // & first, for the same reason

const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map((m) => [m[1], m[2] ?? '']));

// --- token output -----------------------------------------------------------
// A token becomes a span, except the default-coloured ones (punctuation, which
// is most tokens by count) — wrapping those would double the page for no change
// in what the eye sees. Italic is a modifier, not a colour: Shiki uses it for a
// couple of constructs and dropping it would be a silent difference from VS Code.
const unmapped = new Set();
function wrap(content, token) {
  if (content === '') return '';
  if (!token.color || token.color === DEFAULT) return esc(content);
  let cls = PALETTE[token.color];
  if (!cls) {
    // Not in the palette: colour it anyway so the page is never wrong-by-omission,
    // but inline, which check 15 then reports. Failing loudly beats a silent hole.
    unmapped.add(token.color);
    cls = '';
    const style = ` style="color:${token.color}"`;
    return '<span' + style + '>' + esc(content) + '</span>';
  }
  if (token.fontStyle) cls += ' tk-it';
  return `<span class="${cls}">${esc(content)}</span>`;
}

// A line may hold a nested span (the guided build's gap — the student's blank,
// `<span class="wt-gap">`). Tokenizing it as code would mangle it, so each one
// is swapped for a marker before the grammar sees the text and swapped back
// after, verbatim. The markers are restored as raw HTML, never escaped.
function render(content, token, gaps) {
  if (!content.includes(MARK)) return wrap(content, token);
  let out = '', last = 0;
  for (const m of content.matchAll(MARK_RE)) {
    out += wrap(content.slice(last, m.index), token);
    out += gaps[+m[1]];
    restored++;
    last = m.index + m[0].length;
  }
  return out + wrap(content.slice(last), token);
}
let restored = 0;

// --- block shapes -----------------------------------------------------------
// `<span>` inside a `<pre>` can nest one level (wt-line holds wt-gap), so the
// matching close is found by counting rather than by the first `</span>`.
function spanEnd(html, from) {
  let depth = 1, i = from;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) return -1;
    if (html.startsWith('</span>', lt)) { if (--depth === 0) return lt; i = lt + 7; }
    else if (/^<span[\s>]/.test(html.slice(lt, lt + 6))) { depth++; i = lt + 5; }
    else i = lt + 1;
  }
  return -1;
}

/** Split a walkthrough block's content into its `<span class="wt-line">` lines.
 *
 *  The text between and around the lines comes back too (`before`, `tail`), and
 *  it has to: the newlines between two lines are the reason a copied block still
 *  reads as a block (see walkthrough.ts), so the markup must come back out the
 *  way it went in.
 *
 *  This replaces a one-line regex that looked ahead for the NEXT line to know
 *  where the current one ended. That lookahead had nothing to match at the last
 *  line of a block, so the last line was never rebuilt — and a line that is not
 *  rebuilt looks exactly like a line that was rebuilt with no colour in it, so
 *  the page simply showed the final line of every step in the page's own text
 *  colour while the lines above it were coloured. Scanning for the matching
 *  close removes the case rather than adding a third alternative to the regex. */
function splitLines(html) {
  const items = [];
  let i = 0, tail = '';
  for (;;) {
    const open = html.indexOf('<span class="wt-line', i);
    if (open < 0) { tail = html.slice(i); break; }
    const gt = html.indexOf('>', open);
    const end = spanEnd(html, gt + 1);
    if (gt < 0 || end < 0) { tail = html.slice(i); break; }
    items.push({ before: html.slice(i, open), tag: html.slice(open, gt + 1), inner: html.slice(gt + 1, end) });
    i = end + 7;
  }
  return { items, tail };
}

async function main() {
  const hl = await createHighlighter({ themes: [THEME], langs: Object.values(LANGS) });
  const files = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) files.push(p);
    }
  })(ROOT);

  let coloured = 0, named = 0, skipped = 0, lines_ = 0;
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    let out = '', last = 0, touched = false;

    for (const m of html.matchAll(/<pre(?=[\s>])([^>]*)>([\s\S]*?)<\/pre>/g)) {
      const [whole, tagAttrs, body] = m;
      const a = attrs(tagAttrs);
      // The `<code>` wrapper, if there is one, keeps its own attributes.
      const code = body.match(/^(\s*)<code([^>]*)>([\s\S]*?)<\/code>(\s*)$/);
      const inner = code ? code[3] : body;
      const codeAttrs = code ? code[2] : '';

      const declared = ((a.class || '') + ' ' + codeAttrs).match(/\blang-([\w#]+)/);
      const lang = declared ? LANGS[declared[1].toLowerCase()] : undefined;
      if (!lang) { if (declared) skipped++; continue; }
      if (inner.includes('class="tk-')) continue; // already coloured: this ran twice
      named++;

      // The whole block is tokenized as ONE document, not line by line: a string
      // or a comment that opens on one line and closes on a later one only
      // colours correctly if the grammar saw them together, which is also how
      // the editor reads the file.
      const structured = inner.includes('<span class="wt-line');
      const gaps = [];
      const source = [];
      const { items, tail } = structured ? splitLines(inner) : { items: [{ before: '', tag: null, inner }], tail: '' };
      for (const p of items) {
        // Every nested span becomes a marker; the block keeps its own markup.
        const text = p.inner.replace(/<span[^>]*>[\s\S]*?<\/span>/g, (s) => {
          gaps.push(s);
          return MARK + (gaps.length - 1) + 'zz';
        });
        source.push(unesc(text));
      }
      const { tokens } = hl.codeToTokens(source.join('\n'), { lang, theme: THEME });

      // Walk the tokens back onto their lines. Only one line's worth of pieces
      // is held at a time, so a file of any size is bounded by its longest line.
      const rendered = [];
      let cur = '';
      for (const line of tokens) {
        for (const t of line) {
          if (!t.content.includes('\n')) { cur += render(t.content, t, gaps); continue; }
          const seg = t.content.split('\n');
          for (let k = 0; k < seg.length; k++) {
            if (k > 0) { rendered.push(cur); cur = ''; }
            cur += render(seg[k], t, gaps);
          }
        }
        rendered.push(cur);
        cur = '';
      }

      let rebuilt;
      if (structured) {
        // Rebuilt in place, line by line, keeping the separators and each line's
        // `data-n` — which is the number drawn in the gutter by CSS.
        rebuilt = items.map((p, k) => p.before + p.tag + rendered[k] + '</span>').join('') + tail;
        lines_ += items.length;
      } else {
        rebuilt = rendered.join('\n');
      }

      const labelled = (a['data-lang'] ? tagAttrs : tagAttrs + ` data-lang="${LABELS[lang] || lang}"`);
      const body2 = code
        ? code[1] + '<code' + codeAttrs + '>' + rebuilt + '</code>' + code[4]
        : rebuilt;
      // A marker that reaches the page is a blank that was never put back: the
      // code block would show the student a string of nonsense where their
      // instruction used to be. It cannot be allowed through quietly.
      if (body2.includes(MARK)) {
        console.error(`  MARKER LEAK in ${file}: a nested span was not restored — fix before building again`);
        process.exitCode = 1;
      }
      out += html.slice(last, m.index) + '<pre' + labelled + '>' + body2 + '</pre>';
      last = m.index + whole.length;
      coloured++;
      touched = true;
    }
    if (touched) fs.writeFileSync(file, out + html.slice(last));
  }

  console.log(`highlight: ${coloured} block${coloured === 1 ? '' : 's'} over ${files.length} pages` +
    (lines_ ? ` (${lines_} walkthrough lines)` : '') + `, ${named} declared a language` +
    (restored ? `, ${restored} guided-build blanks put back` : ''));
  if (skipped) console.log(`  ${skipped} declared a language Shiki does not know — left plain`);
  if (unmapped.size) {
    console.log(`  UNMAPPED COLOURS: ${[...unmapped].join(', ')} — inlined; add them to the palette in public/style.css`);
    process.exitCode = 1;
  }
}

main();
