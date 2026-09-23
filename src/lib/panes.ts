/**
 * Editor panes — a picture of the Inspector, the Hierarchy or the Project
 * window, drawn rather than captured.
 *
 * WHY THIS EXISTS
 * Half of what a student does in this course is done in the Unity Editor, and
 * every one of those lessons describes it in prose: "Inspector → Add Component
 * → Rigidbody 2D (if it has not been added). Then set Body Type = Dynamic,
 * Gravity Scale = 0, Interpolate = Interpolate." That sentence is correct and
 * it is still hard to follow, because the thing it is describing is a PANE —
 * a grid of rows in a fixed order with a specific row you have to find — and
 * prose makes a student hold the layout in their head while they hunt for it.
 * A student who cannot find Gravity Scale does not conclude that the writing
 * was unclear. They conclude they are bad at this.
 *
 * WHAT THIS IS NOT
 * Not a screenshot. A screenshot of the starter project would be pinned to
 * one Unity version's skin, would carry whatever the window happened to be
 * showing, could not be re-rendered when the course changes, would arrive as
 * an opaque blob nobody can diff or correct, and would need every label
 * redrawn anyway to point at the row the lesson cares about. A drawing of the
 * pane is small, text-selectable, searchable, diffable, correct at any Unity
 * version, and can put a numbered badge on exactly the row the numbered step
 * above it is talking about. Where a real capture would be better — showing a
 * student what a specific project actually looks like today — the capture can
 * be added beside it; the drawing is what the lesson can rely on.
 *
 * FIDELITY
 * The greys are Unity's own (see .pane in public/style.css) so the figure
 * reads as the pane the student is looking at rather than as site decoration.
 * What is NOT faithful is the marking: real Unity does not tint a row or
 * number it, and it must not — the badge is the lesson's, and it exists to
 * tie the row to the step in the list above. Everything inside the pane frame
 * is the editor; the badge and the caption are the lesson talking.
 *
 * The caption is not optional. A pane with no caption is a puzzle: the student
 * can see the rows but not which one matters or why. Every figure says what to
 * look at in one line, and `npm run verify` (check 16) fails a figure without
 * one.
 *
 * The text inside the SVG is real text, so it is selectable, searchable and
 * readable by a screen reader; the figure also carries `role="img"` and a
 * `title`, because a figure IS an image to assistive tech and a pile of
 * loose row labels read aloud is worse than a sentence.
 *
 * Usage, inside a lesson body:
 *   ${renderPane({ pane: 'Inspector', subject: 'Player', rows: [...], caption: '...' })}
 */

/** One row of a pane. The shape follows the pane, not the other way round. */
export interface PaneRow {
  /**
   * The row's shape, which is the student's only way to tell these apart at a
   * glance: a component header is a bar, a field has a value box on the right,
   * a check has a box on the left, a button is a button, and an object row is
   * a name in the Hierarchy or the Project window.
   */
  kind: 'component' | 'field' | 'check' | 'button' | 'object';
  /** The label the student reads in the pane, spelled as Unity spells it. */
  label: string;
  /** A field's value, as it appears in the box on the right. */
  value?: string;
  /** A check's state. Unity's `Is Trigger ☑ ON` is `on: true`. */
  on?: boolean;
  /**
   * Tie this row to the numbered step above the figure. The number is drawn as
   * a badge and the row is tinted, so "set Body Type, Gravity Scale and
   * Interpolate" stops being three names to hunt for. Omit it for rows that
   * are context — a student has to be able to see the whole pane, and a figure
   * where everything is marked marks nothing.
   */
  step?: number;
  /** Indent, in levels of 12px. Hierarchy children sit under their parent. */
  depth?: number;
  /** A row that is a section heading inside a component (Unity's bold labels). */
  strong?: boolean;
  /**
   * An `object` row (Hierarchy or Project) that is a prefab instance. Unity
   * marks these with a blue cube at the left of the name, and lessons lean on
   * that mark — "each instance carries a blue cube icon" is a sentence 2.4 has
   * to be able to point at.
   */
  prefab?: boolean;
}

export interface PaneSpec {
  /** What the window is called in its own tab: Inspector, Hierarchy, Project. */
  pane: string;
  /**
   * What the pane is showing — the object, prefab or folder. Drawn as the
   * second line of the title bar, where Unity puts it (`Player` above the
   * component list, `Assets/Prefabs` above the folder grid).
   */
  subject?: string;
  rows: PaneRow[];
  /**
   * One line under the figure: what to look at. Required — see the header.
   * `code` and **bold** render as they do everywhere else.
   */
  caption: string;
}

const W = 430;          // every pane is drawn at one width, so a page of them lines up
const HEAD = 30;        // title bar
const ROW = 21;         // row height, Unity's at this scale
const PAD = 14;         // breathing room under the last row

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** `code` and **bold**, same rules as a lesson body. */
function prose(s: string): string {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function row(row: PaneRow, y: number, badge: boolean, shift: number, kids: boolean): string {
  const indent = 12 + (row.depth ?? 0) * 12 + shift;
  const tint = row.step
    ? '<rect class="pane-mark" x="0" y="' + y + '" width="' + W + '" height="' + ROW + '"/>' +
      '<rect class="pane-mark-bar" x="0" y="' + y + '" width="3" height="' + ROW + '"/>'
    : '';
  // The badge goes on the FIRST row of a step, not on every row of it. Three
  // stacked fields all wearing a "6" reads as three steps; one badge over three
  // tinted rows reads as one step that sets three things, which is what
  // `Body Type = Dynamic, Gravity Scale = 0, Interpolate = Interpolate` is.
  const badgeMark = row.step && badge
    ? '<circle class="pane-badge" cx="15" cy="' + (y + ROW / 2) + '" r="7"/>' +
      '<text class="pane-badge-n" x="15" y="' + (y + ROW / 2 + 3.5) + '">' + row.step + '</text>'
    : '';
  const label = '<text class="pane-label' + (row.strong ? ' pane-strong' : '') + '" x="' +
    indent + '" y="' + (y + 14) + '">' + esc(row.label) + '</text>';

  if (row.kind === 'component') {
    return tint +
      '<rect class="pane-head-bar" x="0" y="' + y + '" width="' + W + '" height="' + ROW + '"/>' +
      badgeMark +
      '<rect class="pane-tick" x="' + indent + '" y="' + (y + 6) + '" width="8" height="8" rx="1"/>' +
      '<path class="pane-tick-n" d="M' + (indent + 1.6) + ' ' + (y + 10) + 'l1.8 2 3-4"/>' +
      '<text class="pane-label pane-strong" x="' + (indent + 14) + '" y="' + (y + 14) + '">' +
      esc(row.label) + '</text>';
  }
  if (row.kind === 'button') {
    return tint + badgeMark +
      '<rect class="pane-btn" x="' + (12 + shift) + '" y="' + (y + 2) + '" width="' + (W - (12 + shift) * 2) + '" height="' + (ROW - 4) + '" rx="3"/>' +
      '<text class="pane-btn-t" x="' + (W / 2) + '" y="' + (y + 14) + '">' + esc(row.label) + '</text>';
  }
  if (row.kind === 'check') {
    return tint + badgeMark +
      '<rect class="pane-box" x="' + indent + '" y="' + (y + 5) + '" width="11" height="11" rx="2"/>' +
      (row.on
        ? '<path class="pane-check" d="M' + (indent + 2.5) + ' ' + (y + 10.5) + 'l2.2 2.4 3.8-5"/>'
        : '') +
      '<text class="pane-label" x="' + (indent + 18) + '" y="' + (y + 14) + '">' + esc(row.label) + '</text>';
  }
  if (row.kind === 'object') {
    // Hierarchy and Project rows: an expand arrow, then the icon, then the name
    // — the same order Unity draws them, so a name that is indented one level
    // (a child) reads as a child and a blue cube reads as a prefab instance.
    // The arrow is drawn only where the row has children, which the pane can
    // see for itself: the next row is deeper. Unity's rule, so no spec has to
    // say it, and a leaf cannot be drawn with an arrow that expands nothing.
    return tint + badgeMark +
      (kids ? '<path class="pane-caret" d="M' + indent + ' ' + (y + 8) + 'l4 4 4-4z"/>' : '') +
      '<rect class="pane-ico' + (row.prefab ? ' pane-ico-prefab' : '') + '" x="' +
      (indent + 12) + '" y="' + (y + 6) + '" width="9" height="9" rx="1.5"/>' +
      '<text class="pane-label' + (row.strong ? ' pane-strong' : '') + '" x="' + (indent + 27) + '" y="' +
      (y + 14) + '">' + esc(row.label) + '</text>';
  }
  // field: label left, value in a box on the right, the way Unity draws it.
  const boxW = 132;
  return tint + badgeMark + label +
    '<rect class="pane-field" x="' + (W - boxW - 10) + '" y="' + (y + 3) + '" width="' + boxW + '" height="' + (ROW - 6) + '" rx="3"/>' +
    '<text class="pane-value" x="' + (W - boxW) + '" y="' + (y + 14) + '">' + esc(row.value ?? '') + '</text>';
}

/**
 * Draw a pane. Returns an HTML string for interpolation into a lesson body
 * (which is itself a template literal rendered via set:html).
 */
export function renderPane(spec: PaneSpec): string {
  const h = HEAD + spec.rows.length * ROW + PAD;
  const what = spec.pane + (spec.subject ? ' showing ' + spec.subject : '');
  // A step's badge is drawn once, on its first row (see row()). Steps are
  // numbered in the lesson's list above, so they arrive ascending; the set
  // only has to remember which ones have already been labelled.
  //
  // Whether ANY row is marked is a pane-wide decision, not a per-row one: every
  // row's label shifts right by the badge's width as soon as one row is badged.
  // Shifting only the marked rows leaves their labels indented relative to the
  // unmarked ones and the pane reads as ragged — and a marked row that lines up
  // with the rest is also easier to compare against the step above it.
  const marked = spec.rows.some((r) => r.step !== undefined);
  const shift = marked ? 14 : 0;
  const badged = new Set<number>();
  const rows = spec.rows
    .map((r, i) => {
      const first = r.step !== undefined && !badged.has(r.step);
      if (first) badged.add(r.step as number);
      const next = spec.rows[i + 1];
      return row(r, HEAD + i * ROW, first, shift, !!next && (next.depth ?? 0) > (r.depth ?? 0));
    })
    .join('');
  // The caption goes through prose() so a lesson can name a setting the same
  // way it names it in the sentence above: `Gravity Scale`.
  const caption = prose(spec.caption);
  return (
    '<figure class="pane">' +
    '<svg class="pane-svg" viewBox="0 0 ' + W + ' ' + h + '" width="' + W + '" height="' + h + '" role="img" aria-label="' +
    esc(what + ' — ' + spec.caption.replace(/[`*]/g, '')) + '">' +
    '<title>' + esc(what) + '</title>' +
    // the pane frame and its title bar
    '<rect class="pane-bg" x="0" y="0" width="' + W + '" height="' + h + '" rx="5"/>' +
    '<rect class="pane-tab" x="0" y="0" width="' + W + '" height="' + HEAD + '" rx="5"/>' +
    '<rect class="pane-tab-fill" x="0" y="' + (HEAD - 6) + '" width="' + W + '" height="6"/>' +
    '<rect class="pane-tab-line" x="0" y="' + (HEAD - 1) + '" width="' + W + '" height="1"/>' +
    '<text class="pane-title" x="10" y="19">' + esc(spec.pane) + '</text>' +
    (spec.subject
      ? '<text class="pane-subject" x="' + (W - 10) + '" y="19">' + esc(spec.subject) + '</text>'
      : '') +
    rows +
    '</svg>' +
    '<figcaption>' + caption + '</figcaption>' +
    '</figure>'
  );
}
