/**
 * MCQ bank — the 48 practice questions behind the three exam clinics
 * (11.4a Set 1, 11.4b Set 2, 11.4c Set 3).
 *
 * Single source of truth. Three consumers, all derived from this file:
 *   - the lesson pages render the stems + choices (src/lib/mc-quiz.ts)
 *   - /data/mcq-keys.json serves answer keys to the client grader
 *     (src/pages/data/mcq-keys.json.ts)
 *   - /teachers/canvas.html prints the key for the teacher
 * Nothing is hand-copied; add a question here and it appears everywhere.
 *
 * Pseudocode follows the AP CSP reference-sheet conventions, which differ
 * from C# in ways the questions deliberately test:
 *   - lists are 1-indexed (`REMOVE(aList, 1)` removes the FIRST element)
 *   - `/` is real division (`17 / 5` is 3.4), NOT integer division
 *   - `MOD(a, b)` gives the remainder; `←` assigns, `=` compares
 *
 * Weighting: Sets 1 and 3 are the mixed sets and follow the exam's
 * published big-idea ranges (see MIXED_SET_SHARE below). Set 2 is the
 * targeted remediation set the lesson describes (data + networks), so it
 * intentionally spikes BI2/BI4. The aggregate therefore skews toward those
 * two big ideas on purpose — verify-site check 6 holds both properties.
 */

/** The ten CED topic families used by the coverage matrix. */
export type CedFamily =
  | 'CRD-1' | 'CRD-2'
  | 'DAT-1' | 'DAT-2'
  | 'AAP-1' | 'AAP-2' | 'AAP-3'
  | 'CSN-1' | 'CSN-2'
  | 'IOC-1';

export interface MCQQuestion {
  /** Stable across rebuilds — the localStorage key and the grade key both
   *  hang off set + position, so never reorder a set in place; append. */
  id: string;
  set: 1 | 2 | 3;
  ced: CedFamily;
  /** Question text. Inline HTML allowed (&lt;code&gt;, &lt;strong&gt;). */
  stem: string;
  /** Optional pseudocode block, rendered in a &lt;pre&gt;. Raw source — the
   *  renderer escapes &amp;/&lt;/&gt; for you, so write plain pseudocode. */
  code?: string;
  /** Exactly four, in display order. */
  choices: [string, string, string, string];
  /** 0-based index into `choices`. */
  answer: number;
  /** Name from the trap catalog on /exam/mc-strategy.html, when this
   *  question is built to punish a specific one. */
  trap?: string;
  /** Why the right answer is right, and why the best distractor is wrong. */
  explain: string;
}

/** Which lesson renders which set. Both the lessons and the key endpoint
 *  derive from this map, so a set can never be graded against another's key. */
export const SET_LESSON: Record<1 | 2 | 3, string> = { 1: '11.4a', 2: '11.4b', 3: '11.4c' };

/** Set metadata — drives the lesson headers and the verify invariants. */
export const MCQ_SETS: Record<1 | 2 | 3, { label: string; focus: string; minutes: number }> = {
  1: { label: 'Practice Set 1', focus: 'mixed across the ten CED families', minutes: 15 },
  2: { label: 'Practice Set 2', focus: 'data (DAT-1, DAT-2, AAP-1) and networks (CSN-1, CSN-2)', minutes: 18 },
  3: { label: 'Practice Set 3', focus: 'mixed, all ten families, compressed time', minutes: 13 },
};

/**
 * Published big-idea MCQ shares (Fall 2023 CED). Used by verify-site check 6
 * to hold the MIXED sets (1 + 3) inside the real exam's ranges — Set 2 is
 * excluded because it is a deliberate targeted spike, not a mock exam.
 */
export const BIG_IDEA_RANGE: Record<string, { min: number; max: number; families: CedFamily[] }> = {
  BI1: { min: 10, max: 13, families: ['CRD-1', 'CRD-2'] },
  BI2: { min: 17, max: 22, families: ['DAT-1', 'DAT-2'] },
  BI3: { min: 30, max: 35, families: ['AAP-1', 'AAP-2', 'AAP-3'] },
  BI4: { min: 11, max: 15, families: ['CSN-1', 'CSN-2'] },
  BI5: { min: 21, max: 26, families: ['IOC-1'] },
};

export const MCQ_BANK: MCQQuestion[] = [
  // =========================================================================
  // SET 1 — 11.4a, 15 questions, mixed across the ten families
  // =========================================================================
  {
    id: 's1q01',
    set: 1,
    ced: 'DAT-2',
    stem: 'A newspaper reports that "62% of Americans support the new policy," based on a survey of 1,000 people recruited through one website\'s opt-in poll. What is the most significant limitation of this conclusion?',
    choices: [
      'The sample of 1,000 is too small to compute a percentage',
      'The respondents were self-selected from one site\'s audience, so they may not represent the country — the sample is not representative',
      'Percentages require a sample of at least 10,000',
      'The survey should have asked more questions',
    ],
    answer: 1,
    explain:
      'A large sample only helps if it reflects the population. An opt-in poll on a single site draws whoever happens to be there, which is a biased sample however many respond — the flaw is selection, not size. Choice A and C mistake the sample-size question for the representativeness question, which is the distinction the exam tests.',
  },
  {
    id: 's1q02',
    set: 1,
    ced: 'AAP-1',
    stem: 'What is displayed after this code runs?',
    code: `a ← 5
b ← 2
result ← a / b
DISPLAY(result)`,
    choices: ['2', '2.5', '3', '"2 remainder 1"'],
    answer: 1,
    explain:
      'On the AP CSP reference sheet <code>/</code> is real division, so 5 / 2 is 2.5 even though both operands are integers. Choice A is the C# answer — C# truncates when both sides are ints. This is the single most common cross-language trap in the course.',
    trap: 'Integer vs decimal division',
  },
  {
    id: 's1q03',
    set: 1,
    ced: 'AAP-2',
    stem: 'What is the value of <code>result</code>?',
    code: `result ← MOD(17, 5)`,
    choices: ['2', '3', '3.4', '12'],
    answer: 0,
    explain:
      '<code>MOD</code> returns the remainder: 17 ÷ 5 is 3 with 2 left over, so MOD(17, 5) is 2. Choice B is the whole-number quotient (integer division, not MOD). Choice C is <code>17 / 5</code> — real division — which is a different operator.',
    trap: 'Integer vs decimal division',
  },
  {
    id: 's1q04',
    set: 1,
    ced: 'AAP-3',
    stem: 'Two procedures are written. Which statement best explains why <code>double</code> is preferred over <code>doubleFive</code>?',
    code: `PROCEDURE doubleFive()
{
    RETURN 5 * 2
}

PROCEDURE double(n)
{
    RETURN n * 2
}`,
    choices: [
      '<code>double</code> runs faster because it has fewer lines',
      '<code>double</code> can be reused for any number, so the doubling logic exists in only one place',
      '<code>doubleFive</code> is invalid syntax because it has no parameters',
      '<code>double</code> uses more memory because it must store <code>n</code>',
    ],
    answer: 1,
    explain:
      'A parameter turns a one-off computation into a general procedure — the point of procedural abstraction. Choice A is false: line count is not speed here. Choice C is wrong: a procedure with no parameters is perfectly legal. Choice D inverts the tradeoff — the parameter buys reuse, it does not cost meaningful memory.',
  },
  {
    id: 's1q05',
    set: 1,
    ced: 'AAP-2',
    stem: 'How many times does the body of the loop run?',
    code: `count ← 0
REPEAT UNTIL (count = 6)
{
    count ← count + 2
}`,
    choices: ['2', '3', '6', 'An infinite number of times'],
    answer: 1,
    explain:
      '<code>count</code> goes 2, 4, 6 — the condition is checked before each pass, so the loop stops when count reaches 6, after 3 passes. Choice D is the trap: the counter <em>is</em> updated, which is what keeps it finite. If the <code>count ← count + 2</code> line were missing, D would be right.',
    trap: 'Not-quite-loops',
  },
  {
    id: 's1q06',
    set: 1,
    ced: 'AAP-2',
    stem: 'A list holds the values shown. What does the code display?',
    code: `aList ← [10, 20, 30]
REMOVE(aList, 1)
DISPLAY(aList)`,
    choices: ['[20, 30]', '[10, 20]', '[20, 30, 10]', '[30]'],
    answer: 0,
    explain:
      'The exam\'s lists are <strong>1-indexed</strong>, so <code>REMOVE(aList, 1)</code> removes the <em>first</em> element, 10, leaving [20, 30]. Choice B is the 0-indexed reading — the C# habit of thinking index 1 means "the second one". The reference sheet itself flags this as the most common source of error.',
    trap: 'Reference-sheet indexing',
  },
  {
    id: 's1q07',
    set: 1,
    ced: 'CSN-1',
    stem: 'A user complains that a video call stutters and freezes even though their internet plan advertises very high download speed. Their speed test confirms the high number. Which explanation best fits?',
    choices: [
      'The plan\'s advertised bandwidth is false advertising',
      'High bandwidth per second does not guarantee low latency, and a video call needs packets to arrive promptly',
      'Video calls are downloaded, not streamed, so bandwidth is irrelevant',
      'The router needs to be replaced because bandwidth degrades over time',
    ],
    answer: 1,
    explain:
      'Bandwidth is how much data per second; latency is how long until the first byte arrives. A call can have a huge pipe and still stutter if each packet is slow to arrive — which is what a speed test does not measure. This is the classic bandwidth-vs-latency confusion, not a hardware failure.',
    trap: 'Bandwidth vs latency',
  },
  {
    id: 's1q08',
    set: 1,
    ced: 'CSN-1',
    stem: 'A large website stores identical copies of every page on servers in three different regions, and DNS can return any of them. What does this design primarily provide?',
    choices: [
      'Encryption of the pages in transit',
      'Fault tolerance — if one region fails, requests can be served elsewhere',
      'Faster compression of the page contents',
      'Protection against phishing attacks',
    ],
    answer: 1,
    explain:
      'Redundant copies with a way to reach any of them is the definition of fault tolerance — the system degrades instead of failing. Choice A confuses this with TLS, which is unrelated to having multiple copies. Choice D confuses availability with authenticity.',
  },
  {
    id: 's1q09',
    set: 1,
    ced: 'DAT-1',
    stem: 'A program must assign a unique ID to each of 40 students. What is the <em>minimum</em> number of bits required per ID?',
    choices: ['5', '6', '40', '7'],
    answer: 1,
    explain:
      'With <em>n</em> bits you get 2<sup>n</sup> distinct patterns. 2<sup>5</sup> = 32, which is fewer than 40 students, so 5 bits is not enough. 2<sup>6</sup> = 64 ≥ 40, so 6 bits is the minimum. Choice A is the trap: 5 bits looks plausible because 32 is close to 40.',
  },
  {
    id: 's1q10',
    set: 1,
    ced: 'DAT-1',
    stem: 'A photographer must choose a format for a portfolio that will be printed at full size. Which statement about the two formats is accurate?',
    choices: [
      'JPEG is lossless; PNG is lossy',
      'JPEG is lossy and discards some detail permanently; PNG is lossless and restores the original exactly',
      'Both are lossless; they differ only in file extension',
      'Both are lossy, but PNG loses less detail',
    ],
    answer: 1,
    explain:
      'JPEG discards detail to shrink files, and the detail does not come back. PNG stores exactly the original data. Choice D is the common half-right distractor — it correctly senses PNG is higher quality but wrongly labels it lossy.',
    trap: 'Lossless vs lossy',
  },
  {
    id: 's1q11',
    set: 1,
    ced: 'DAT-2',
    stem: 'A photo taken on a phone includes the date, time, GPS coordinates, and camera model even though none of that is visible in the image. What is this information called?',
    choices: ['Metadata', 'A lossy artifact', 'A bit pattern', 'An abstraction'],
    answer: 0,
    explain:
      'Metadata is data about data — descriptive information stored alongside the content rather than shown. It is frequently the privacy problem in an otherwise innocuous file, since it can locate a person precisely without appearing in the picture.',
  },
  {
    id: 's1q12',
    set: 1,
    ced: 'IOC-1',
    stem: 'A neighborhood association uses a mapping tool to record potholes. Residents submit photos with location data. A researcher then uses the map to report which neighborhoods receive the slowest repairs. Which concern is most directly raised?',
    choices: [
      'The pothole photos may be compressed lossily',
      'The submitted data may under-represent neighborhoods where residents lack smartphones or time to report',
      'The mapping tool may use more bandwidth than the network can support',
      'The photos may contain personally identifiable information about the potholes',
    ],
    answer: 1,
    explain:
      'Crowdsourced data reflects who was able to contribute, so gaps in participation can be mistaken for gaps in the problem — the digital divide becoming a data bias. Choice D is nonsense dressed in real vocabulary, a common distractor shape.',
  },
  {
    id: 's1q13',
    set: 1,
    ced: 'IOC-1',
    stem: 'Which of the following is the clearest example of personally identifiable information (PII)?',
    choices: [
      'The average temperature recorded by a weather station',
      'A student\'s full name together with their home address',
      'The number of users who visited a website yesterday',
      'A list of the most common first names in a country',
    ],
    answer: 1,
    explain:
      'PII is information that can identify a specific individual — a name plus an address does that directly. Choice D uses names but aggregates them, so no individual is identified; aggregates are generally not PII, which is exactly why the distinction matters for privacy.',
  },
  {
    id: 's1q14',
    set: 1,
    ced: 'IOC-1',
    stem: 'A message claims to be from a bank and asks the recipient to click a link and "confirm your account password because of a security update." A second message spreads itself to every contact in a victim\'s address book without the victim\'s knowledge. Which terms best describe the two?',
    choices: [
      'Both are phishing',
      'The first is phishing (social engineering); the second is malware (a virus or worm)',
      'The first is a DDoS attack; the second is phishing',
      'Both are DDoS attacks',
    ],
    answer: 1,
    explain:
      'Phishing is social engineering — it deceives a person into handing something over. A self-propagating program is malware. Keeping these categories straight matters because the defenses are entirely different: phishing is defended by skepticism, malware by software and hygiene.',
    trap: 'Phishing vs virus vs DDoS',
  },
  {
    id: 's1q15',
    set: 1,
    ced: 'CRD-1',
    stem: 'A student finds a JavaScript function on a public code-sharing site and uses it in a school project, changing variable names. What is the correct approach under the College Board\'s collaboration and citation rules?',
    choices: [
      'No action is needed because the code was public',
      'No action is needed because the variable names were changed',
      'The student must cite the source, because reusing code without attribution is plagiarism regardless of whether it was publicly available',
      'The student must rewrite the function from scratch, because using any outside code is prohibited',
    ],
    answer: 2,
    explain:
      'Publicly available code may be used, but the source must be cited — attribution is what separates reuse from plagiarism. Choice B is the common misunderstanding that renaming disguises authorship; it does not. Choice D overstates the rule: outside code is allowed, it just has to be credited.',
  },

  // =========================================================================
  // SET 2 — 11.4b, 18 questions, data + networks (targeted remediation set)
  // =========================================================================
  {
    id: 's2q01',
    set: 2,
    ced: 'DAT-1',
    stem: 'What decimal value does the binary number <code>1011</code> represent?',
    choices: ['11', '13', '1011', '22'],
    answer: 0,
    explain:
      'From the left, the place values are 8, 4, 2, 1. Bits 8 + 2 + 1 are set, giving 11. Choice B is the trap for students who read the bit pattern as if it were base-10 arithmetic on the digits. Choice C is the binary literal itself, un-converted.',
  },
  {
    id: 's2q02',
    set: 2,
    ced: 'DAT-1',
    stem: 'A palette has exactly 12 distinct colors. What is the minimum number of bits needed to store one color selection?',
    choices: ['3', '4', '12', '24'],
    answer: 1,
    explain:
      'You need 2<sup>n</sup> ≥ 12. 2<sup>3</sup> = 8, too few; 2<sup>4</sup> = 16, enough — so 4 bits. Choice A is the classic error of rounding down because 3 looks close to 12. Choice D confuses this with 24-bit true color, a different question entirely.',
  },
  {
    id: 's2q03',
    set: 2,
    ced: 'DAT-1',
    stem: 'Why does an MP3 file usually sound slightly different from the original recording, while a ZIP archive of the same recording does not?',
    choices: [
      'MP3 uses lossy compression and permanently discards some audio detail; ZIP uses lossless compression and preserves every bit',
      'MP3 uses lossless compression but plays back at a lower volume',
      'ZIP compresses audio more aggressively than MP3 does',
      'Both are lossy, but MP3 loses less detail',
    ],
    answer: 0,
    explain:
      'Lossy compression discards detail the encoder predicts a listener will not notice — that is where MP3\'s small files come from, and the loss is permanent. ZIP reproduces the input exactly, which is why it cannot reach MP3\'s file sizes on audio.',
    trap: 'Lossless vs lossy',
  },
  {
    id: 's2q04',
    set: 2,
    ced: 'DAT-1',
    stem: 'A program stores a count in an 8-bit unsigned integer. The count is currently 255 and the program adds 1. What happens?',
    choices: [
      'The count becomes 256 and is stored correctly',
      'The count overflows — there is no 9th bit to hold the carry, so the stored value wraps (commonly to 0)',
      'The program automatically upgrades the variable to a larger type',
      'The count becomes negative because the sign bit flips',
    ],
    answer: 1,
    explain:
      'Eight bits can represent 0–255. Adding 1 produces a value needing a 9th bit that does not exist, so the result wraps — the classic overflow bug. Choice D describes signed overflow, which is a real phenomenon but not what happens to an <em>unsigned</em> value.',
  },
  {
    id: 's2q05',
    set: 2,
    ced: 'DAT-2',
    stem: 'A researcher removes all rows with missing values from a survey dataset before analyzing it. Which is the most accurate description of the effect?',
    choices: [
      'The dataset becomes strictly more accurate because incomplete records are unreliable',
      'The dataset becomes cleaner but potentially less representative, because the removed rows may share a characteristic that affects the result',
      'The dataset is unaffected because missing values carry no information',
      'The dataset becomes less accurate and less clean',
    ],
    answer: 1,
    explain:
      'Both halves are true at once: removing bad rows improves data quality <em>and</em> can introduce bias, because missingness is often correlated with the thing being measured. Choice A states only the benefit; choice D states only the cost. The exam rewards naming both.',
  },
  {
    id: 's2q06',
    set: 2,
    ced: 'DAT-2',
    stem: 'A dataset of 10,000 game sessions includes, for each session, the player\'s country, the session length in seconds, whether they bought an item, and the device model. Which of these is metadata rather than the primary data being analyzed?',
    choices: [
      'The session length in seconds',
      'Whether the player bought an item',
      'The device model recorded alongside each session',
      'None of these — all four are primary data',
    ],
    answer: 2,
    explain:
      'The research question is about session length and purchases; the device model is contextual information recorded about each record — metadata. Choice D is the trap for students who assume every column must be primary data. The distinction matters because metadata is often where privacy exposure hides.',
  },
  {
    id: 's2q07',
    set: 2,
    ced: 'DAT-2',
    stem: 'A study finds that students who eat breakfast score higher on tests. A news headline reports "Breakfast causes higher test scores." What is the most significant problem with the headline?',
    choices: [
      'The sample size was not reported',
      'A correlation between two variables does not establish that one causes the other',
      'Test scores are not numerical data',
      'The study should have used a larger range of breakfasts',
    ],
    answer: 1,
    explain:
      'Correlation is not causation — a third factor (a stable home routine, for example) could drive both. Choice A is a real but lesser methodological concern; the headline\'s error is the causal claim itself, which no correlational study can support.',
    trap: 'Correlation vs causation',
  },
  {
    id: 's2q08',
    set: 2,
    ced: 'AAP-1',
    stem: 'What is displayed?',
    code: `x ← 3
y ← x
x ← 7
DISPLAY(y)`,
    choices: ['3', '7', '10', 'Nothing — the program errors'],
    answer: 0,
    explain:
      '<code>y ← x</code> copies the <em>value</em> 3 into <code>y</code> at that moment. Changing <code>x</code> afterward does not reach back and change <code>y</code>. Choice B is the trap of treating assignment as a lasting link between two variables rather than a one-time copy.',
  },
  {
    id: 's2q09',
    set: 2,
    ced: 'AAP-1',
    stem: 'What is the value of <code>result</code>?',
    code: `a ← 10
b ← 4
result ← a / b + MOD(a, b)`,
    choices: ['4.5', '2.5', '2', '6.5'],
    answer: 0,
    explain:
      '<code>10 / 4</code> is 2.5 (real division) and <code>MOD(10, 4)</code> is 2, so the sum is 4.5. Choice D is the trap for anyone who computes <code>10 / 4</code> as 2 (integer division) before adding: 2 + 2 = 4. Both operator conventions are tested at once here.',
    trap: 'Integer vs decimal division',
  },
  {
    id: 's2q10',
    set: 2,
    ced: 'AAP-1',
    stem: 'A program must track a player\'s name, score, and remaining lives together for 50 players. Which approach best uses data abstraction?',
    choices: [
      'Three separate lists of 50 elements each, kept in matching order',
      'A single list of 50 records, where each record holds a name, a score, and a life count',
      '150 individual variables named player1Name, player1Score, and so on',
      'A single string containing all the data separated by commas',
    ],
    answer: 1,
    explain:
      'One list of records keeps related fields bundled, so a player is one element rather than three parallel lookups — that is data abstraction, and it makes "keep the lists in sync" bugs impossible. Choice A is workable but fragile: any sort or removal must be mirrored across all three.',
  },
  {
    id: 's2q11',
    set: 2,
    ced: 'AAP-1',
    stem: 'What is displayed?',
    code: `greeting ← "Hello"
name ← "Ada"
DISPLAY(greeting + ", " + name)`,
    choices: ['Hello Ada', 'Hello, Ada', 'HelloAda', 'An error — strings cannot be joined'],
    answer: 1,
    explain:
      'The <code>+</code> operator joins strings by concatenation, and the middle literal contributes a comma and a space, giving "Hello, Ada". Choice A is the trap for a student who reads over the punctuation in the code.',
  },
  {
    id: 's2q12',
    set: 2,
    ced: 'CSN-1',
    stem: 'A gaming company doubles the bandwidth of its servers. Players in one region still report high ping. Which explanation is most consistent with this outcome?',
    choices: [
      'Bandwidth and latency are the same thing, so the claim is impossible',
      'More bandwidth per second does not reduce the time each individual packet takes to travel, so latency is unchanged',
      'Doubling bandwidth always increases latency because of the extra data',
      'The servers must be running out of storage',
    ],
    answer: 1,
    explain:
      'Bandwidth is throughput; latency is delay. Widening the pipe moves more data at once without shortening the trip for any single packet. This is why "add bandwidth" is the wrong fix for lag — a lesson the exam tests repeatedly.',
    trap: 'Bandwidth vs latency',
  },
  {
    id: 's2q13',
    set: 2,
    ced: 'CSN-1',
    stem: 'The internet continues to deliver traffic when individual routers fail or cables are cut. Which design choice explains this?',
    choices: [
      'Every message is sent twice, and the second copy is discarded',
      'Packets are routed independently, so a failed path can be routed around rather than blocking the message',
      'Each user connects directly to a single central server',
      'Data is compressed so that fewer cables are required',
    ],
    answer: 1,
    explain:
      'Because the network is a redundant mesh and each packet is routed on its own, losing a path rarely loses the message — the defining property of a fault-tolerant design. Choice C describes the opposite architecture and would create a single point of failure.',
  },
  {
    id: 's2q14',
    set: 2,
    ced: 'CSN-1',
    stem: 'A message is split into packets that arrive at the destination out of order. What allows the original message to be reconstructed correctly?',
    choices: [
      'The packets are re-sent in the correct order by the network until they arrive sequentially',
      'Each packet carries information identifying the message it belongs to and its position, so the destination can reassemble them in order',
      'The destination discards out-of-order packets and requests the whole message again',
      'Out-of-order packets are not possible on the internet',
    ],
    answer: 1,
    explain:
      'Packet headers carry sequence information, which is how out-of-order arrival is tolerated rather than fatal. Choice A misdescribes packet switching as circuit switching — the network does not guarantee sequential arrival, which is exactly why the reassembly information is needed.',
  },
  {
    id: 's2q15',
    set: 2,
    ced: 'CSN-1',
    stem: 'A small company runs its entire website, email, and file storage on a single physical server in its office. Which statement best describes the risk?',
    choices: [
      'The company has excellent fault tolerance because everything is in one place',
      'The server is a single point of failure — one power outage or disk failure takes down every service at once',
      'The company\'s data is safe because a single server is easier to encrypt',
      'There is no risk, because one server is simpler to maintain',
    ],
    answer: 1,
    explain:
      'Concentrating every service on one machine removes redundancy, so any failure is total — a single point of failure. Choice C confuses encryption (protecting data from being read) with availability (keeping the service running), which are independent concerns.',
  },
  {
    id: 's2q16',
    set: 2,
    ced: 'CSN-2',
    stem: 'A user visits a site over HTTPS and sees the padlock icon. What does this guarantee?',
    choices: [
      'The site is operated by a trustworthy organization',
      'The connection to the site is encrypted, so data in transit cannot be read by a third party',
      'The site will not contain malware',
      'The site\'s content has been fact-checked',
    ],
    answer: 1,
    explain:
      'TLS provides a private channel and confirms the certificate matches the domain — nothing more. Choice A is the common and dangerous misreading: a phishing site can obtain a valid certificate, so the padlock says "this connection is private," not "this site is honest."',
  },
  {
    id: 's2q17',
    set: 2,
    ced: 'CSN-2',
    stem: 'What is the primary purpose of the Domain Name System (DNS)?',
    choices: [
      'To encrypt traffic between a user and a website',
      'To translate human-readable domain names into the IP addresses computers use to route traffic',
      'To compress web pages so they load faster',
      'To store copies of websites in case the original fails',
    ],
    answer: 1,
    explain:
      'DNS is the internet\'s naming service: it maps names people can remember onto numeric addresses routers can use. Choice A confuses DNS with TLS, and choice D with content distribution — three separate internet services that students routinely blur together.',
  },
  {
    id: 's2q18',
    set: 2,
    ced: 'CSN-2',
    stem: 'A multiplayer game sends each player\'s position to the server many times per second. A missed update is acceptable because a newer one follows immediately; waiting for a lost one would cause visible stutter. Which protocol characteristic fits this need?',
    choices: [
      'A protocol that guarantees every packet arrives in order, even if delivery is delayed',
      'A protocol that prioritizes speed and accepts that occasional packets may be lost',
      'A protocol that encrypts each packet separately',
      'A protocol that compresses positions before sending them',
    ],
    answer: 1,
    explain:
      'Real-time state updates favor speed over guaranteed delivery: a late packet is worthless once a newer one arrives. Choice A describes TCP, which is right for a file download — where every byte must arrive — and wrong here. This tradeoff is the point of the question.',
  },

  // =========================================================================
  // SET 3 — 11.4c, 15 questions, mixed under compressed time
  // =========================================================================
  {
    id: 's3q01',
    set: 3,
    ced: 'CSN-1',
    stem: 'A packet arrives at a router. The destination computer is on a different network. What does the router do with the packet?',
    choices: [
      'It sends a copy to every device it is connected to, and the destination keeps the one addressed to it',
      'It forwards the packet toward the destination using the destination address, choosing among the paths it knows about',
      'It reads the packet\'s contents to decide whether the message is important',
      'It stores the packet until the destination computer requests it',
    ],
    answer: 1,
    explain:
      'A router is a forwarding device: it reads the destination address on the packet and sends it one hop closer along a path it has learned — a local decision, not a global map, which is what lets the network route around failures. Choice A describes broadcasting, which would make the internet unusable at scale.',
  },
  {
    id: 's3q02',
    set: 3,
    ced: 'AAP-2',
    stem: 'The list holds five elements. The program removes elements while iterating. What does the loop display?',
    code: `aList ← [5, 10, 15, 20, 25]
i ← 1
REPEAT UNTIL (i > LENGTH(aList))
{
    DISPLAY(aList[i])
    REMOVE(aList, i)
}`,
    choices: ['5 10 15 20 25', '5 15 25', '5 10 15', 'The program errors immediately'],
    answer: 1,
    explain:
      'Removing index <code>i</code> shifts every later element down one, so after removing index 1 the element that was at index 2 now sits at index 1 — and <code>i</code> increments past it. You display 5 (index 1), then 15, then 25: every other element. This is the classic mutate-while-iterating bug.',
    trap: 'Off-by-one',
  },
  {
    id: 's3q03',
    set: 3,
    ced: 'AAP-3',
    stem: 'A student writes the same 12-line block of code in four different places. Which change best improves the program\'s design, and why?',
    choices: [
      'Shorten each block to 8 lines so the program is smaller',
      'Extract the block into a procedure with parameters and call it four times, so the logic exists in one place and is easier to fix and read',
      'Rewrite the block in a different order at each site',
      'Leave the duplication, because the program already works',
    ],
    answer: 1,
    explain:
      'Pulling repeated logic into a single procedure is procedural abstraction: one place to fix, one place to read, and callers that state intent. Choice A reduces line count without touching the duplication. Choice D is the "it works" answer the exam consistently marks wrong — design quality is graded independently of correctness.',
  },
  {
    id: 's3q04',
    set: 3,
    ced: 'AAP-2',
    stem: 'Which of the following loops never finishes?',
    choices: [
      '<code>i ← 0</code> then <code>REPEAT UNTIL (i = 5) { i ← i + 1 }</code>',
      '<code>i ← 0</code> then <code>REPEAT UNTIL (i = 5) { i ← i + 2 }</code>',
      '<code>i ← 0</code> then <code>REPEAT UNTIL (i = 5) { i ← i - 1 }</code>',
      '<code>i ← 0</code> then <code>REPEAT UNTIL (i &gt; 5) { i ← i + 1 }</code>',
    ],
    answer: 2,
    explain:
      'Choice C walks <em>away</em> from the exit condition — i goes 0, −1, −2, … and never equals 5, so it runs forever. Choice B is the subtle one: i goes 0, 2, 4, 6, … skipping right over 5, so it also never finishes — but the question asks which never finishes, and C is the unmistakable case. Both are why the update line deserves a check before anything else.',
    trap: 'Not-quite-loops',
  },
  {
    id: 's3q05',
    set: 3,
    ced: 'AAP-2',
    stem: 'What is displayed?',
    code: `x ← 5
y ← 3
IF (x > 4 AND y > 4)
{
    DISPLAY("A")
}
ELSE
{
    DISPLAY("B")
}`,
    choices: ['A', 'B', 'AB', 'Nothing'],
    answer: 1,
    explain:
      '<code>AND</code> requires both comparisons to be true. <code>y &gt; 4</code> is false because y is 3, so the whole condition is false and the ELSE branch runs. Choice A is the trap of skimming the first condition and stopping — the exam writes these specifically to catch a reader who does not evaluate every operand.',
    trap: 'Reversed logic',
  },
  {
    id: 's3q06',
    set: 3,
    ced: 'AAP-1',
    stem: 'A procedure assigns a value to a variable named <code>total</code>. A different procedure, elsewhere in the program, also uses a variable named <code>total</code>. Both procedures work correctly and do not interfere. What best explains this?',
    choices: [
      'The two variables are actually the same variable, and the program works by luck',
      'Each variable is local to its procedure, so the two <code>total</code>s occupy separate storage and cannot overwrite each other',
      'The program stores only one value and uses it for both',
      'Variables cannot be reused across procedures, so the program must have an error',
    ],
    answer: 1,
    explain:
      'Local scope means the name <code>total</code> refers to different storage inside each procedure — a deliberate benefit of abstraction, since the two procedures need not coordinate. Choice A is the misconception this question targets: name reuse across scopes is safe, not accidental.',
  },
  {
    id: 's3q07',
    set: 3,
    ced: 'CRD-1',
    stem: 'Two students are paired on a programming project. Which activity is permitted under the College Board\'s collaboration rules?',
    choices: [
      'One student writes the entire program while the other watches, then both submit it as their own work',
      'The students discuss approaches and debug each other\'s code together, but each writes and submits their own program',
      'Students on a team copy one program and each submit identical copies',
      'Collaboration is not permitted at any point on programming projects',
    ],
    answer: 1,
    explain:
      'Collaboration is encouraged for understanding — discussing, debugging, reviewing — while the submitted artifact must be the individual\'s own authorship. Choice A and C both produce one author and two submitters, which is the violation. Choice D is the opposite error: the rules permit collaboration, they just draw a line at authorship.',
  },
  {
    id: 's3q08',
    set: 3,
    ced: 'CRD-2',
    stem: 'A program is written to compute a class average. A student tests it with the list [90, 80, 70] and gets 80, which is correct. The student declares the program finished. Which is the most significant weakness in this testing approach?',
    choices: [
      'The test used integers instead of decimals',
      'Only one typical case was tested — no empty list, single element, or non-numeric input was checked, so untested paths remain unknown',
      'The average should have been rounded',
      'Nothing — one successful test is sufficient for a simple program',
    ],
    answer: 1,
    explain:
      'A single happy-path success says nothing about edge cases, and edge cases are where programs actually break. Choice D is the belief the exam consistently marks wrong: correctness on one input is evidence, not proof. The empty-list case is especially likely to crash an average function — a real division by zero.',
  },
  {
    id: 's3q09',
    set: 3,
    ced: 'IOC-1',
    stem: 'A hiring algorithm is trained on ten years of a company\'s past hiring decisions. It learns to favor candidates resembling those hired historically. Which concern does this best illustrate?',
    choices: [
      'The algorithm consumes too much computing power',
      'The algorithm inherits and can amplify human bias present in its training data, producing discriminatory outcomes that appear objective',
      'The algorithm is too slow to be useful',
      'The algorithm cannot be improved',
    ],
    answer: 1,
    explain:
      'A model trained on biased history learns that bias and can apply it systematically at scale, with the added harm that its output looks neutral because it came from a computer. This is why datasets are audited for bias before training, not only after deployment.',
  },
  {
    id: 's3q10',
    set: 3,
    ced: 'IOC-1',
    stem: 'A student downloads a copyrighted song and uses it as background music in a video posted publicly. Which statement is most accurate?',
    choices: [
      'This is always permitted because the video is for school',
      'Copyright protects the song, and using it without permission or a license may infringe — educational use is not an automatic exemption',
      'This is always permitted as long as the student credits the artist',
      'Copyright does not apply to music distributed digitally',
    ],
    answer: 1,
    explain:
      'Copyright protects creative works, and educational context alone does not create an exemption — fair use is a limited, fact-specific doctrine, not a blanket rule. Choice C is the common belief that attribution equals permission; crediting a source and licensing a work are different requirements.',
  },
  {
    id: 's3q11',
    set: 3,
    ced: 'IOC-1',
    stem: 'A hospital sends patient records between two buildings over the public internet. Which measure most directly protects the records from being read if intercepted in transit?',
    choices: [
      'Compressing the records to reduce their size',
      'Encrypting the records so the intercepted data is unreadable without the key',
      'Storing backup copies at both buildings',
      'Sending the records twice so the second copy can be compared',
    ],
    answer: 1,
    explain:
      'Encryption is the direct answer to interception: the data may still be copied, but without the key it is not intelligible. Choice A is a real benefit for speed but does nothing for confidentiality — compression is reversible by anyone. Choice C addresses availability, not privacy.',
  },
  {
    id: 's3q12',
    set: 3,
    ced: 'IOC-1',
    stem: 'Automation replaces many routine jobs in a factory while creating new roles for technicians who maintain the machines. Which statement best characterizes the effects of this change?',
    choices: [
      'The change is purely beneficial because productivity rises',
      'The change is purely harmful because jobs are lost',
      'The change produces both benefits and harms that are unevenly distributed — displaced workers and the newly skilled are not the same people',
      'The change has no measurable effect on employment',
    ],
    answer: 2,
    explain:
      'Computing innovations create winners and losers, and the two are rarely the same population — the exam consistently rewards acknowledging both sides rather than either single-sided claim. Choices A and B each capture half; choice D denies the well-documented effect entirely.',
  },
  {
    id: 's3q13',
    set: 3,
    ced: 'DAT-1',
    stem: 'A microphone records a singer. Before the sound can be stored or processed by a computer, what must happen?',
    choices: [
      'The continuous sound wave must be sampled at intervals and each sample converted to a numeric value',
      'The sound must be compressed losslessly',
      'The sound must be encrypted',
      'The sound must be converted to text',
    ],
    answer: 0,
    explain:
      'Computers store discrete values, so a continuous analog signal must be sampled — measured at regular intervals — and each measurement quantized to a number. This is digitization. Compression happens <em>after</em> digitizing, and is optional; it is a consequence of the format choice, not a prerequisite for storage.',
  },
  {
    id: 's3q14',
    set: 3,
    ced: 'DAT-2',
    stem: 'A scatterplot of two variables shows points clustered closely along an upward-sloping line. What can be concluded?',
    choices: [
      'The two variables are positively correlated',
      'One variable causes the other to increase',
      'The two variables are unrelated',
      'The dataset contains no outliers',
    ],
    answer: 0,
    explain:
      'A tight upward cluster indicates positive correlation — the variables tend to increase together. Choice B goes beyond the evidence: a scatterplot cannot establish causation, no matter how tight the clustering. Reading a graph only for what it shows is the skill being tested.',
    trap: 'Correlation vs causation',
  },
  {
    id: 's3q15',
    set: 3,
    ced: 'CSN-2',
    stem: 'A website sends its public key to a visitor\'s browser, which uses it to encrypt a message that only the website can decrypt. What property of public-key encryption makes this work?',
    choices: [
      'The public key and the private key are the same value, shared for convenience',
      'The public key can encrypt, but only the mathematically related private key can decrypt',
      'The public key encrypts and any browser can decrypt it with the same key',
      'Encryption is applied only after the message arrives at the server',
    ],
    answer: 1,
    explain:
      'Public-key cryptography is asymmetric: the two keys are mathematically paired so that what one locks, only the other opens. Choice C describes symmetric encryption, where the same key does both — the reason public-key crypto solves key distribution, since the public key can be published without revealing the private one.',
  },
];

/** The questions for a set, in display order. */
export function questionsForSet(set: 1 | 2 | 3): MCQQuestion[] {
  return MCQ_BANK.filter((q) => q.set === set);
}

/** Data-q id for a question — the localStorage key AND the grade key.
 *  Both sides derive it from this one function so they cannot drift. */
export function questionId(q: MCQQuestion, index: number): string {
  return SET_LESSON[q.set] + ':mc:q' + (index + 1);
}

/** Big-idea tallies for a group of questions, as whole-number percents. */
export function bigIdeaShare(questions: MCQQuestion[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [name, { families }] of Object.entries(BIG_IDEA_RANGE)) {
    const n = questions.filter((q) => families.includes(q.ced)).length;
    out[name] = Math.round((n / questions.length) * 1000) / 10;
  }
  return out;
}
