/**
 * MCQ practice sets — client side. No dependencies.
 *
 * Owns two things the lessons' clinic days need and paper cannot give:
 * a self-check, and the family error table.
 *
 *   - Selection syncing: every radio writes the chosen letter into the
 *     hidden `.lab-answer` textarea beside it and fires an `input` event,
 *     so lab-forms.js persists it, counts it, and includes it in the
 *     answers .json download without knowing this script exists.
 *   - Grading: on "Grade this set" the answer key is fetched from
 *     /data/mcq-keys.json (keys are not in the page source), each question
 *     is marked right or wrong against the student's own choice, the
 *     explanation is revealed, and the scorecard reports the per-CED-family
 *     breakdown plus the traps missed — which is the error table the
 *     lesson asks students to build by hand, computed instead.
 *
 * Restore order matters: this file is loaded after lab-forms.js in
 * LessonLayout.astro, so lab-forms has already put saved answers back into
 * the bridge textareas by the time we read them to re-check the radios.
 */
(function () {
  'use strict';

  var LETTERS = ['A', 'B', 'C', 'D'];
  void LETTERS;   // kept in step with the renderer's choice order
  var quizzes = Array.prototype.slice.call(document.querySelectorAll('.mc-quiz'));
  if (!quizzes.length) return;

  var keyCache = null;

  function fetchKeys(path) {
    if (keyCache) return keyCache;
    keyCache = fetch(path)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) { return (data && data.keys) || {}; });
    return keyCache;
  }

  function familyLabel(ced) {
    // 'AAP-2' -> 'Algorithms & Programming'; the big-idea name for the table.
    var map = {
      CRD: 'Creative Development',
      DAT: 'Data',
      AAP: 'Algorithms & Programming',
      CSN: 'Computer Systems & Networks',
      IOC: 'Impact of Computing'
    };
    return map[String(ced).split('-')[0]] || String(ced);
  }

  quizzes.forEach(function (quiz) {
    var qs = Array.prototype.slice.call(quiz.querySelectorAll('.mc-question'));
    var progressEl = quiz.querySelector('.mc-progress');
    var gradeBtn = quiz.querySelector('.mc-grade');
    var cardEl = quiz.querySelector('.mc-scorecard');
    var keysPath = quiz.dataset.keys || '../data/mcq-keys.json';
    var startedAt = Date.now();
    var firstPick = {};   // qid -> seconds from set start to first selection
    var graded = false;

    function bridge(qid) {
      return quiz.querySelector('textarea.mc-bridge[data-q="' + qid.replace(/"/g, '\\"') + '"]');
    }

    function selected(q) {
      var r = q.querySelector('input[type=radio]:checked');
      return r ? r.value : '';
    }

    function updateProgress() {
      if (!progressEl) return;
      var n = qs.filter(function (q) { return selected(q) !== ''; }).length;
      progressEl.textContent = n + '/' + qs.length + ' answered';
      progressEl.classList.toggle('some', n > 0);
    }

    // --- wire each question's radios
    qs.forEach(function (q) {
      var qid = q.dataset.q || '';
      var radios = Array.prototype.slice.call(q.querySelectorAll('input[type=radio]'));
      var box = bridge(qid);

      // Restore: lab-forms.js has already refilled the bridge textarea.
      if (box && box.value) {
        var want = box.value.trim().toUpperCase().charAt(0);
        radios.forEach(function (r) { if (r.value === want) r.checked = true; });
      }

      radios.forEach(function (r) {
        r.addEventListener('change', function () {
          if (firstPick[qid] === undefined) {
            firstPick[qid] = Math.round((Date.now() - startedAt) / 1000);
          }
          // Feed lab-forms.js without it knowing about us.
          if (box) {
            box.value = r.value;
            box.dispatchEvent(new Event('input', { bubbles: true }));
          }
          if (graded) { graded = false; clearMarks(quiz); }  // re-answer clears old marks
          updateProgress();
        });
      });
    });

    updateProgress();

    function clearMarks(root) {
      Array.prototype.slice.call(root.querySelectorAll('.mc-question')).forEach(function (q) {
        q.classList.remove('right', 'wrong', 'unanswered');
        Array.prototype.slice.call(q.querySelectorAll('.mc-choice')).forEach(function (c) {
          c.classList.remove('is-answer', 'is-picked');
        });
        var res = q.querySelector('.mc-result');
        if (res) { res.hidden = true; res.innerHTML = ''; }
      });
      var card = root.querySelector('.mc-scorecard');
      if (card) { card.hidden = true; card.innerHTML = ''; }
    }

    // --- grading
    if (gradeBtn) gradeBtn.addEventListener('click', function () {
      gradeBtn.disabled = true;
      var wasLabel = gradeBtn.textContent;
      gradeBtn.textContent = 'Grading...';

      fetchKeys(keysPath)
        .then(function (keys) {
          grade(keys);
          gradeBtn.textContent = 'Grade again';
          gradeBtn.disabled = false;
        })
        .catch(function () {
          gradeBtn.textContent = wasLabel;
          gradeBtn.disabled = false;
          if (cardEl) {
            cardEl.hidden = false;
            cardEl.innerHTML =
              '<p class="mc-error">Could not load the answer key. If you are offline or ' +
              'opened this file directly, that is expected — reconnect and press Grade again. ' +
              'Your answers are saved regardless.</p>';
          }
        });
    });

    function grade(keys) {
      clearMarks(quiz);
      graded = true;

      var right = 0, blank = 0;
      var byFamily = {};   // family -> {right, total}
      var traps = {};      // trap name -> count missed

      qs.forEach(function (q, idx) {
        var qid = q.dataset.q;
        var ced = q.dataset.ced || '';
        var fam = familyLabel(ced);
        var key = keys[qid] || {};
        var correct = String(key.answer || '').toUpperCase();
        var pick = selected(q);

        byFamily[fam] = byFamily[fam] || { right: 0, total: 0 };
        byFamily[fam].total++;

        if (!pick) blank++;

        var isRight = pick === correct && correct !== '';
        if (isRight) { right++; byFamily[fam].right++; }

        q.classList.add(isRight ? 'right' : (pick ? 'wrong' : 'unanswered'));

        // Mark the correct choice always; mark the student's wrong pick too.
        // Done here rather than in CSS with :has() so the highlight does not
        // depend on a selector some school browsers still lack.
        Array.prototype.slice.call(q.querySelectorAll('.mc-choice')).forEach(function (c) {
          var input = c.querySelector('input[type=radio]');
          if (!input) return;
          if (input.value === correct) c.classList.add('is-answer');
          if (input.checked && !isRight) c.classList.add('is-picked');
        });

        if (!isRight && key.trap) {
          traps[key.trap] = (traps[key.trap] || 0) + 1;
        }

        var res = q.querySelector('.mc-result');
        if (res) {
          var t = firstPick[qid] !== undefined ? firstPick[qid] + 's' : '—';
          var verdict = isRight
            ? '<span class="mc-verdict right">Correct</span>'
            : '<span class="mc-verdict wrong">' +
              (pick ? 'You chose ' + pick + ', answer is ' + correct : 'Not answered — answer is ' + correct) +
              '</span>';
          res.innerHTML =
            '<p class="mc-verdict-row">' + verdict + ' <span class="mc-meta">' + ced +
            ' &middot; ' + t +
            (key.trap ? ' &middot; trap: ' + key.trap : '') + '</span></p>' +
            '<p class="mc-explain">' + (key.explain || '') + '</p>';
          res.hidden = false;
        }
      });

      // --- scorecard: score, then the family error table the lesson asks for
      var pct = Math.round((right / qs.length) * 100);
      var rows = Object.keys(byFamily).sort().map(function (fam) {
        var d = byFamily[fam];
        var cls = d.right === d.total ? 'good' : (d.right === 0 ? 'bad' : 'mid');
        return '<tr class="' + cls + '"><td>' + fam + '</td><td>' + d.right + '/' + d.total +
          '</td><td>' + (d.right === d.total ? 'strong' : 'drill') + '</td></tr>';
      }).join('');

      var trapList = Object.keys(traps).sort(function (a, b) { return traps[b] - traps[a]; });
      var trapBlock = trapList.length
        ? '<p class="mc-card-note"><strong>Traps you missed:</strong> ' +
          trapList.map(function (t) { return t + ' (' + traps[t] + ')'; }).join(', ') +
          ' — read those rows in the <a href="../exam/mc-strategy.html">trap catalog</a> tonight.</p>'
        : '<p class="mc-card-note">No catalogued traps missed. Your misses, if any, were knowledge gaps rather than misreads — re-read the CED family, do not re-drill technique.</p>';

      cardEl.innerHTML =
        '<h4>Scorecard</h4>' +
        '<p class="mc-score-line"><strong>' + right + '/' + qs.length + '</strong> (' + pct + '%)' +
        (blank ? ' &middot; ' + blank + ' left blank — never leave one blank' : '') + '</p>' +
        '<table class="mc-table"><tr><th>Family (big idea)</th><th>Score</th><th>Verdict</th></tr>' +
        rows + '</table>' +
        trapBlock +
        '<p class="mc-card-note">Write the <em>misconception sentence</em> for each miss into your ' +
        'error table before you move on — "I thought the mode was the average" is fixable, ' +
        '"I guessed C" is not.</p>';
      cardEl.hidden = false;
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
})();
