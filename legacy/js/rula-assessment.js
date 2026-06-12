/**
 * RULA Assessment Engine (unified)
 *
 * Handles right-only, left-only, and both-sides assessments.
 * Set window.RULA_CONFIG = { mode: 'right' | 'left' | 'both' } before loading.
 *
 * Requires: rula-tables.js (RULA_TABLES global)
 *
 * @author Waldemar Walczak
 * Originally created: 2019-12-13
 * Refactored: 2026-03-18
 */

(function () {
  'use strict';

  const mode = (window.RULA_CONFIG && window.RULA_CONFIG.mode) || 'right';

  // ── Mode configuration ──────────────────────────────────────────────

  const CONFIGS = {
    right: {
      maxQuestionStep: 10,
      resultsStep: 11,
      forceLoadBStep: 10,
      forceLoadBNav: 'nav10',
      resultsNav: 'nav11',
      pdfFilename: 'rula-scoresheet-right.pdf',
      resultsContainerTarget: 'step-11'
    },
    left: {
      maxQuestionStep: 10,
      resultsStep: 11,
      forceLoadBStep: 10,
      forceLoadBNav: 'nav10',
      resultsNav: 'nav11',
      pdfFilename: 'rula-scoresheet-left.pdf',
      resultsContainerTarget: 'step-11'
    },
    both: {
      maxQuestionStep: 15,
      resultsStep: 16,
      forceLoadBStep: 15,
      forceLoadBNav: 'nav15',
      resultsNav: 'nav16',
      pdfFilename: 'rula-scoresheet-left-right.pdf',
      resultsContainerTarget: 'step-11'
    }
  };

  var cfg = CONFIGS[mode];

  // Question input definitions: what to collect at each step
  // collectAtStep N reads radio-(N-1) answer from the previous question
  var QUESTION_DEFS = mode === 'both' ? [
    { step: 2,  radio: 'radio-q1',  target: 'upperArm',    adj: 'upperArmAdj',  checkbox: 'customCheck-q1',  cbType: 'multi' },
    { step: 3,  radio: 'radio-q2',  target: 'lowerArm',    adj: 'lowerArmAdj',  checkbox: 'customCheck-q2',  cbType: 'single' },
    { step: 4,  radio: 'radio-q3',  target: 'wrist',       adj: 'wristAdj',     checkbox: 'customCheck-q3',  cbType: 'single', removeBounce: true },
    { step: 5,  radio: 'radio-q4',  target: 'wristTwist',  addBounce: true },
    { step: 6,  radio: 'radio-q5',  target: 'forceLoadAR', adj: 'muscleUseAR',  checkbox: 'customCheck-q5',  cbType: 'single' },
    { step: 7,  radio: 'radio-q6',  target: 'upperArmL',   adj: 'upperArmAdjL', checkbox: 'customCheck-q6',  cbType: 'multi' },
    { step: 8,  radio: 'radio-q7',  target: 'lowerArmL',   adj: 'lowerArmAdjL', checkbox: 'customCheck-q7',  cbType: 'single' },
    { step: 9,  radio: 'radio-q8',  target: 'wristL',      adj: 'wristAdjL',    checkbox: 'customCheck-q8',  cbType: 'single', removeBounce: true },
    { step: 10, radio: 'radio-q9',  target: 'wristTwistL', addBounce: true },
    { step: 11, radio: 'radio-q10', target: 'forceLoadA',  adj: 'muscleUseA',   checkbox: 'customCheck-q10', cbType: 'single' },
    { step: 12, radio: 'radio-q11', target: 'neck',        adj: 'neckAdj',      checkbox: 'customCheck-q11', cbType: 'multi' },
    { step: 13, radio: 'radio-q12', target: 'trunk',       adj: 'trunkAdj',     checkbox: 'customCheck-q12', cbType: 'multi' },
    { step: 14, radio: 'radio-q13', target: 'legs' }
  ] : [
    { step: 2, radio: 'radio-q1', target: 'upperArm',   adj: 'upperArmAdj', checkbox: 'customCheck-q1', cbType: 'multi' },
    { step: 3, radio: 'radio-q2', target: 'lowerArm',   adj: 'lowerArmAdj', checkbox: 'customCheck-q2', cbType: 'single' },
    { step: 4, radio: 'radio-q3', target: 'wrist',      adj: 'wristAdj',    checkbox: 'customCheck-q3', cbType: 'single', removeBounce: true },
    { step: 5, radio: 'radio-q4', target: 'wristTwist', addBounce: true },
    { step: 6, radio: 'radio-q5', target: 'forceLoadA', adj: 'muscleUseA',  checkbox: 'customCheck-q5', cbType: 'single' },
    { step: 7, radio: 'radio-q6', target: 'neck',       adj: 'neckAdj',     checkbox: 'customCheck-q6', cbType: 'multi' },
    { step: 8, radio: 'radio-q7', target: 'trunk',      adj: 'trunkAdj',    checkbox: 'customCheck-q7', cbType: 'multi' },
    { step: 9, radio: 'radio-q8', target: 'legs' }
  ];

  // Summary image/class configuration for the results modal
  var SUMMARY_DEFS = {
    right: [
      { q: 1, type: 'image', id: 'sum-1-img', path: 'media/summary/sum-1/sum-1-', h: '180px' },
      { q: 2, type: 'image', id: 'sum-2-img', path: 'media/summary/sum-2/sum-2-', h: '90px' },
      { q: 3, type: 'image', id: 'sum-3-img', path: 'media/summary/sum-3/sum-3-', h: '130px' },
      { q: 4, type: 'image', id: 'sum-4-img', path: 'media/summary/sum-4/sum-4-', h: '90px' },
      { q: 5, type: 'force', prefix: 'sum-5', count: 4 },
      { q: 6, type: 'image', id: 'sum-6-img', path: 'media/summary/sum-6/sum-6-', h: '90px' },
      { q: 7, type: 'image', id: 'sum-7-img', path: 'media/summary/sum-7/sum-7-', h: '90px' },
      { q: 8, type: 'legs',  id: 'sum-8-img', path: 'media/summary/sum-8/sum-8-', h: '90px' },
      { q: 9, type: 'force', prefix: 'sum-9', count: 4 }
    ],
    left: [
      { q: 1, type: 'image', id: 'sum-1-img', path: 'media/summary/left-side/sum-1/sum-1-', h: '180px' },
      { q: 2, type: 'image', id: 'sum-2-img', path: 'media/summary/left-side/sum-2/sum-2-', h: '90px' },
      { q: 3, type: 'image', id: 'sum-3-img', path: 'media/summary/left-side/sum-3/sum-3-', h: '130px' },
      { q: 4, type: 'image', id: 'sum-4-img', path: 'media/summary/sum-4/sum-4-', h: '90px' },
      { q: 5, type: 'force', prefix: 'sum-5', count: 4 },
      { q: 6, type: 'image', id: 'sum-6-img', path: 'media/summary/sum-6/sum-6-', h: '90px' },
      { q: 7, type: 'image', id: 'sum-7-img', path: 'media/summary/sum-7/sum-7-', h: '90px' },
      { q: 8, type: 'legs',  id: 'sum-8-img', path: 'media/summary/sum-8/sum-8-', h: '90px' },
      { q: 9, type: 'force', prefix: 'sum-9', count: 4 }
    ],
    both: [
      { q: 1,  type: 'image', id: 'sum-1-img',  path: 'media/summary/sum-1/sum-1-', h: '180px' },
      { q: 2,  type: 'image', id: 'sum-2-img',  path: 'media/summary/sum-2/sum-2-', h: '90px' },
      { q: 3,  type: 'image', id: 'sum-3-img',  path: 'media/summary/sum-3/sum-3-', h: '130px' },
      { q: 4,  type: 'image', id: 'sum-4-img',  path: 'media/summary/sum-4/sum-4-', h: '90px' },
      { q: 5,  type: 'force', prefix: 'sum-5',  count: 4 },
      { q: 6,  type: 'image', id: 'sum-6-img',  path: 'media/summary/left-side/sum-1/sum-1-', h: '180px' },
      { q: 7,  type: 'image', id: 'sum-7-img',  path: 'media/summary/left-side/sum-2/sum-2-', h: '90px' },
      { q: 8,  type: 'image', id: 'sum-8-img',  path: 'media/summary/left-side/sum-3/sum-3-', h: '130px' },
      { q: 9,  type: 'image', id: 'sum-9-img',  path: 'media/summary/left-side/sum-4/sum-4-', h: '90px' },
      { q: 10, type: 'force', prefix: 'sum-10', count: 4 },
      { q: 11, type: 'image', id: 'sum-11-img', path: 'media/summary/sum-6/sum-6-', h: '90px' },
      { q: 12, type: 'image', id: 'sum-12-img', path: 'media/summary/sum-7/sum-7-', h: '90px' },
      { q: 13, type: 'legs',  id: 'sum-13-img', path: 'media/summary/sum-8/sum-8-', h: '90px' },
      { q: 14, type: 'force', prefix: 'sum-14', count: 4 }
    ]
  };

  // ── State ───────────────────────────────────────────────────────────

  var currentQuestionIndex = 1;

  // Body part scores
  var scores = {
    upperArm: 0, upperArmAdj: 0,
    lowerArm: 0, lowerArmAdj: 0,
    wrist: 0, wristAdj: 0,
    wristTwist: 0,
    forceLoadA: 0, muscleUseA: 0,
    // Left side (both mode)
    upperArmL: 0, upperArmAdjL: 0,
    lowerArmL: 0, lowerArmAdjL: 0,
    wristL: 0, wristAdjL: 0,
    wristTwistL: 0,
    forceLoadAR: 0, muscleUseAR: 0,
    // Part B (shared)
    neck: 0, neckAdj: 0,
    trunk: 0, trunkAdj: 0,
    legs: 0,
    forceLoadB: 0, muscleUseB: 0
  };

  var AScore = 0, AScoreL = 0, BScore = 0;
  var wristArmScore = 0, wristArmScoreL = 0, neckTrunkLegsScore = 0;
  var finalScore = 0, finalScoreL = 0;

  // Form input values
  var inputEmail = '', inputSubject = '', inputScorer = '';
  var inputDepartment = '', inputCompany = '', inputDate = '';

  // DOM elements
  var nextBtn, prevBtn, controls;

  // Track which nav items have click handlers bound
  var boundNavs = {};

  // ── Helpers ─────────────────────────────────────────────────────────

  function $(id) { return document.getElementById(id); }
  function $q(sel) { return document.querySelector(sel); }
  function $qa(sel) { return document.querySelectorAll(sel); }

  function setHtml(id, html) {
    var el = $(id);
    if (el) el.innerHTML = html;
  }

  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  // Convert all <img> elements inside a container to inline base64 data URLs.
  // This prevents CORS / tainted-canvas errors when html2canvas renders them.
  function inlineImages(container) {
    var images = container.querySelectorAll('img');
    var promises = [];
    images.forEach(function (img) {
      if (!img.src || img.src.indexOf('data:') === 0) return;
      promises.push(new Promise(function (resolve) {
        var c = document.createElement('canvas');
        var source = new Image();
        source.onload = function () {
          c.width = source.naturalWidth;
          c.height = source.naturalHeight;
          c.getContext('2d').drawImage(source, 0, 0);
          try { img.src = c.toDataURL('image/png'); } catch (e) { /* skip */ }
          resolve();
        };
        source.onerror = function () { resolve(); };
        source.src = img.src;
      }));
    });
    return Promise.all(promises);
  }

  function showTab(stepNum) {
    var tabLink = $q('a[href="#step-' + stepNum + '"]');
    if (tabLink) {
      var tab = bootstrap.Tab.getOrCreateInstance(tabLink);
      tab.show();
    }
  }

  // ── Initialization ──────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    nextBtn = $('next-btn');
    prevBtn = $('prev-btn');
    controls = $('controls');

    // Initialize Bootstrap popovers and tooltips
    $qa('[data-bs-toggle="popover"]').forEach(function (el) {
      new bootstrap.Popover(el);
    });
    $qa('.popover-dismiss').forEach(function (el) {
      new bootstrap.Popover(el, { trigger: 'focus' });
    });
    $qa('[data-bs-toggle="tooltip"]').forEach(function (el) {
      new bootstrap.Tooltip(el);
    });

    // Set today's date
    var now = new Date();
    var dd = ('0' + now.getDate()).slice(-2);
    var mm = ('0' + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + '-' + mm + '-' + dd;
    var formDate = $('form-date');
    if (formDate) formDate.value = today;

    // Add animations to question containers
    $qa('.question-container').forEach(function (el) {
      el.classList.add('animated', 'fadeIn');
    });
    if (controls) controls.classList.add('animated', 'fadeIn');

    // Attach click handlers to radio buttons
    $qa('.radio').forEach(function (el) {
      el.addEventListener('click', selectAnswer);
    });

    // Next button
    $qa('.next-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentQuestionIndex < cfg.maxQuestionStep) {
          currentQuestionIndex++;
        }
        topFunction();
        setOutput();
        selectAnswer();
        setTableScores();
        rulaScore();
        showTab(currentQuestionIndex);
      });
    });

    // Previous button
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentQuestionIndex > 1) {
          currentQuestionIndex--;
        }
        topFunction();
        selectAnswer();
        if (currentQuestionIndex === 1) {
          prevBtn.classList.add('hide');
        }
        showTab(currentQuestionIndex);
      });
    }

    // PDF export button
    var pdfBtn = $('html2canvas');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', function () {
        pdfBtn.disabled = true;
        setTimeout(function () { pdfBtn.disabled = false; }, 5000);

        var sumAnswers = $('sum-answers');
        if (sumAnswers && sumAnswers.length) {
          for (var i = 0; i < sumAnswers.length; i++) {
            sumAnswers[i].classList.remove('sum-cont-mob');
          }
        }

        // Convert images to inline data URLs to avoid CORS/tainted canvas issues
        inlineImages($('modal-body')).then(function () {
          html2pdf().from($('modal-body')).set({
            margin: [0.2, 0.3, 0.2, 0.3],
            filename: cfg.pdfFilename,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {},
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          }).save();
        });
      });
    }

    // Summary/modal buttons
    $qa('#modal-btn, #results-btn, #full-sum-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        handleSummary();
      });
    });
  });

  // ── Flow Control ────────────────────────────────────────────────────

  function selectAnswer() {
    nextBtn.classList.add('hide');

    if (currentQuestionIndex === 1) {
      prevBtn.classList.add('hide');
    } else {
      prevBtn.classList.remove('hide');
    }

    var checked = $q('input[name="radio-q' + currentQuestionIndex + '"]:checked');
    if (!checked) return;

    // Mark nav as completed
    var nav = $('nav' + currentQuestionIndex);
    nav.style.color = '#2aa747';
    nav.style.cursor = 'pointer';
    nav.classList.add('animated', 'flipInY', 'font-weight-bold');

    // Show optional fields
    var optFields = $('optional-fields-q' + currentQuestionIndex);
    if (optFields) {
      optFields.classList.remove('hide');
      optFields.scrollIntoView();
      optFields.classList.add('animated', 'fadeIn');
    }

    // Bind nav click handler (once per nav)
    if (!boundNavs[currentQuestionIndex]) {
      boundNavs[currentQuestionIndex] = true;
      bindNavClick(currentQuestionIndex);
    }

    // Show/hide next button
    if (currentQuestionIndex === cfg.maxQuestionStep) {
      nextBtn.classList.add('hide');
    } else {
      nextBtn.classList.remove('hide');
    }
  }

  function bindNavClick(stepNum) {
    var nav = $('nav' + stepNum);
    if (!nav) return;
    nav.addEventListener('click', function (e) {
      e.preventDefault();
      showTab(stepNum);
      currentQuestionIndex = stepNum;

      if (currentQuestionIndex < cfg.maxQuestionStep) {
        nextBtn.classList.remove('hide');
      } else if (currentQuestionIndex === cfg.maxQuestionStep) {
        nextBtn.classList.add('hide');
      }

      if (currentQuestionIndex === 1) {
        prevBtn.classList.add('hide');
      } else {
        prevBtn.classList.remove('hide');
      }
    });
  }

  // ── Score Collection ────────────────────────────────────────────────

  function getInput() {
    // Process question definitions
    var def = findDef(currentQuestionIndex);
    if (def) {
      collectQuestionInput(def);
      return;
    }

    // Special steps: forceLoadB and results
    if (currentQuestionIndex === cfg.forceLoadBStep) {
      handleForceLoadBStep();
    } else if (currentQuestionIndex === cfg.resultsStep) {
      handleResultsStep();
    }
  }

  function findDef(step) {
    for (var i = 0; i < QUESTION_DEFS.length; i++) {
      if (QUESTION_DEFS[i].step === step) return QUESTION_DEFS[i];
    }
    return null;
  }

  function collectQuestionInput(def) {
    // Handle bounce animation on the show-results element
    var showResults = $('show-results');
    if (def.removeBounce && showResults) showResults.classList.remove('bounce');
    if (def.addBounce && showResults) showResults.classList.add('bounce');

    // Read radio value
    var radioEl = $q('input[name="' + def.radio + '"]:checked');
    if (!radioEl) return;
    scores[def.target] = parseInt(radioEl.value);

    // No checkbox/adjustment
    if (!def.checkbox) return;

    if (def.cbType === 'multi') {
      collectMultiCheckbox(def);
    } else {
      collectSingleCheckbox(def);
    }
  }

  function collectMultiCheckbox(def) {
    var adjKey = def.adj;
    scores[adjKey] = 0;

    var options = document.getElementsByName(def.checkbox);
    var anyChecked = $q('input[name="' + def.checkbox + '"]:checked');

    if (anyChecked) {
      for (var i = 0; i < options.length; i++) {
        if (options[i].type === 'checkbox' && options[i].checked) {
          scores[adjKey] += parseInt(options[i].value);
          var sumEl = $('sum-' + options[i].id);
          if (sumEl) sumEl.classList.remove('sum-li');
        }
      }
    }

    // Mark unchecked summary items
    for (var j = 0; j < options.length; j++) {
      if (!options[j].checked) {
        var sumEl2 = $('sum-' + options[j].id);
        if (sumEl2) sumEl2.classList.add('sum-li');
      }
    }
  }

  function collectSingleCheckbox(def) {
    var adjKey = def.adj;
    var checkedCb = $q('input[name="' + def.checkbox + '"]:checked');
    var sumId = 'sum-' + def.checkbox;

    if (checkedCb) {
      scores[adjKey] = parseInt(checkedCb.value);
      var sumEl = $(sumId);
      if (sumEl) sumEl.classList.toggle('sum-li');
    } else {
      scores[adjKey] = 0;
      var sumEl2 = $(sumId);
      if (sumEl2) sumEl2.classList.add('sum-li');
    }
  }

  function handleForceLoadBStep() {
    // The step before results: force/load for Part B
    var forceLoadBNav = $(cfg.forceLoadBNav);
    var resultsNavEl = $(cfg.resultsNav);
    var forceLoadBStep = cfg.forceLoadBStep;
    var qNum = forceLoadBStep; // radio-q{N} where N = step number

    if (resultsNavEl) resultsNavEl.classList.remove('hide');

    var radioName = 'radio-q' + (forceLoadBStep - 1);
    if (mode === 'both') {
      radioName = 'radio-q14';
    } else {
      radioName = 'radio-q9';
    }

    var radioEl = $q('input[name="' + radioName + '"]:checked');
    if (radioEl) {
      scores.forceLoadB = parseInt(radioEl.value);
    }

    var cbName = mode === 'both' ? 'customCheck-q14' : 'customCheck-q9';
    var checkedCb = $q('input[name="' + cbName + '"]:checked');
    var sumId = 'sum-' + cbName;

    if (checkedCb) {
      scores.muscleUseB = parseInt(checkedCb.value);
      var s = $(sumId);
      if (s) s.classList.remove('sum-li');
    } else {
      scores.muscleUseB = 0;
      var s2 = $(sumId);
      if (s2) s2.classList.add('sum-li');
    }

    // Style the forceLoadB nav
    if (forceLoadBNav) {
      forceLoadBNav.style.color = '#2aa747';
      forceLoadBNav.style.cursor = 'pointer';
      forceLoadBNav.classList.add('animated', 'flipInY', 'font-weight-bold');
    }

    // Bind forceLoadB nav click
    if (!boundNavs['forceLoadB']) {
      boundNavs['forceLoadB'] = true;
      if (forceLoadBNav) {
        forceLoadBNav.addEventListener('click', function (e) {
          e.preventDefault();
          showTab(forceLoadBStep);
          currentQuestionIndex = forceLoadBStep;
          nextBtn.classList.add('hide');
          prevBtn.classList.remove('hide');
        });
      }
    }
  }

  function handleResultsStep() {
    getFormInput();

    var resultsNavEl = $(cfg.resultsNav);
    if (resultsNavEl) {
      resultsNavEl.style.cursor = 'pointer';
      resultsNavEl.style.color = 'black';
    }

    // Bind results nav click
    if (!boundNavs['results']) {
      boundNavs['results'] = true;
      if (resultsNavEl) {
        resultsNavEl.addEventListener('click', function (e) {
          e.preventDefault();
          showTab(cfg.resultsStep);
          nextBtn.classList.add('hide');
          showResultsPage();
        });
      }
    }

    prevBtn.classList.add('hide');

    // Display form input in results
    setHtml('email', '<li class="user-input">' + inputEmail + '</li>');
    setHtml('subject', '<li class="user-input">' + inputSubject + '</li>');
    setHtml('scorer', '<li class="user-input">' + inputScorer + '</li>');
    setHtml('department', '<li class="user-input">' + inputDepartment + '</li>');
    setHtml('company', '<li class="user-input">' + inputCompany + '</li>');
    setHtml('date', '<li class="user-input">' + inputDate + '</li>');

    // Create results container
    var target = $(cfg.resultsContainerTarget);
    if (target && !$('results-container')) {
      var rc = document.createElement('div');
      rc.id = 'results-container';
      target.appendChild(rc);
    }

    // Create sum-table in modal
    var modalBody = $('modal-body');
    if (modalBody && !$('sum-table')) {
      var st = document.createElement('div');
      st.id = 'sum-table';
      modalBody.appendChild(st);
    }
  }

  function getFormInput() {
    inputEmail = ($('form-email') || {}).value || '';
    inputSubject = ($('form-subject') || {}).value || '';
    inputScorer = ($('form-scorer') || {}).value || '';
    inputDepartment = ($('form-department') || {}).value || '';
    inputCompany = ($('form-company') || {}).value || '';
    inputDate = ($('form-date') || {}).value || '';
  }

  // ── Score Calculation ───────────────────────────────────────────────

  function setTableScores() {
    var s = scores;

    // Part A - Right (or single side)
    var totalAKey = '' + (s.upperArm + s.upperArmAdj) +
                         (s.lowerArm + s.lowerArmAdj) +
                         (s.wrist + s.wristAdj) +
                         s.wristTwist;
    AScore = parseInt(RULA_TABLES[0][totalAKey]);

    // Part A - Left (both mode)
    if (mode === 'both') {
      var totalAKeyL = '' + (s.upperArmL + s.upperArmAdjL) +
                            (s.lowerArmL + s.lowerArmAdjL) +
                            (s.wristL + s.wristAdjL) +
                            s.wristTwistL;
      AScoreL = parseInt(RULA_TABLES[0][totalAKeyL]);
    }

    // Part B
    var totalBKey = '' + (s.neck + s.neckAdj) +
                         (s.trunk + s.trunkAdj) +
                         s.legs;
    BScore = parseInt(RULA_TABLES[1][totalBKey]);
  }

  function setOutput() {
    getInput();

    var s = scores;

    if (mode === 'both') {
      // Right arm display
      setHtml('upper-arm', s.upperArm + s.upperArmAdj);
      setHtml('lower-arm', s.lowerArm + s.lowerArmAdj);
      setHtml('wrist', s.wrist + s.wristAdj);
      setHtml('wrist-twist', s.wristTwist);
      setHtml('muscle-a-r', s.forceLoadAR + s.muscleUseAR);
      // Left arm display
      setHtml('upper-arm-l', s.upperArmL + s.upperArmAdjL);
      setHtml('lower-arm-l', s.lowerArmL + s.lowerArmAdjL);
      setHtml('wrist-l', s.wristL + s.wristAdjL);
      setHtml('wrist-twist-l', s.wristTwistL);
      setHtml('muscle-a', s.forceLoadA + s.muscleUseA);
    } else {
      // Single side display
      setHtml('upper-arm', s.upperArm + s.upperArmAdj);
      setHtml('lower-arm', s.lowerArm + s.lowerArmAdj);
      setHtml('wrist', s.wrist + s.wristAdj);
      setHtml('wrist-twist', s.wristTwist);
      setHtml('muscle-a', s.forceLoadA + s.muscleUseA);
    }

    // Part B display (shared)
    setHtml('neck', s.neck + s.neckAdj);
    setHtml('trunk', s.trunk + s.trunkAdj);
    setHtml('leg', s.legs);
    setHtml('muscle-b', s.forceLoadB + s.muscleUseB);

    // Part A score
    if (!Number.isNaN(AScore)) {
      if (mode === 'both') {
        wristArmScore = AScore + s.forceLoadAR + s.muscleUseAR;
      } else {
        wristArmScore = AScore + s.forceLoadA + s.muscleUseA;
      }
      setHtml('posture-a', AScore);
      setHtml('part-a-score', wristArmScore);
    } else {
      setHtml('part-a-score', '0');
    }

    // Left Part A score (both mode)
    if (mode === 'both') {
      if (!Number.isNaN(AScoreL)) {
        wristArmScoreL = AScoreL + s.forceLoadA + s.muscleUseA;
        setHtml('posture-a-l', AScoreL);
        setHtml('part-a-score-l', wristArmScoreL);
      } else {
        setHtml('part-a-score-l', '0');
      }
    }

    // Part B score
    if (!Number.isNaN(BScore)) {
      neckTrunkLegsScore = BScore + s.forceLoadB + s.muscleUseB;
      setHtml('posture-b', BScore);
      setHtml('part-b-score', neckTrunkLegsScore);

      // Final scores via Table C
      finalScore = parseInt(RULA_TABLES[2][wristArmScore + 'x' + neckTrunkLegsScore]);

      if (mode === 'both') {
        finalScoreL = parseInt(RULA_TABLES[2][wristArmScoreL + 'x' + neckTrunkLegsScore]);
      }
    } else {
      setHtml('part-b-score', '0');
    }
  }

  // ── Score Display ───────────────────────────────────────────────────

  function getActionLevel(score) {
    if (score < 3) return { level: 1, css: 'bg-success', text: 'Action level 1: The posture is acceptable if it is not maintained or repeated for long periods' };
    if (score < 5) return { level: 2, css: 'bg-warning', text: 'Action level 2:\n        \tFurther investigation is needed and changes may be required' };
    if (score < 7) return { level: 3, css: 'bg-warning', text: 'Action level 3:\n        \tFurther investigation and changes are required soon' };
    return { level: 4, css: 'bg-danger', text: 'Action level 4:\n        \tFurther investigation and changes are required immediately' };
  }

  function renderScoreCard(score, header, label) {
    var al = getActionLevel(score);
    return '<h4 style="text-align: left;"><img src="media/icons/target.png" alt="Final RULA Score Icon" style="float: left; margin-right: 5px;">' + header + '</h4>' +
      '<div class="' + al.css + ' rula-card">' +
      '<ul style="list-style: none; padding: 15px;">' +
      '<li style="color: white;">' +
      '<h5>' + label + ': ' + score + '</h5>' +
      al.text +
      '</li></ul></div>';
  }

  function rulaScore() {
    if (mode === 'both') {
      // Right side
      var rightHtml = renderScoreCard(finalScore, 'Right side:', 'RULA Score (Right)');
      setHtml('score-container', rightHtml);
      setHtml('rula-scorecard', rightHtml);

      // Left side
      var leftHtml = renderScoreCard(finalScoreL, 'Left side:', 'RULA Score (Left)');
      setHtml('score-container-l', leftHtml);
      setHtml('rula-scorecard-l', leftHtml);
    } else {
      var html = renderScoreCard(finalScore, 'Final RULA score:', 'RULA Score');
      setHtml('score-container', html);
      setHtml('rula-scorecard', html);
    }
  }

  function showResultsPage() {
    setOutput();
    setTableScores();
    topFunction();
    rulaScore();

    currentQuestionIndex = cfg.resultsStep;

    var rc = $('results-card');
    if (rc) rc.classList.add('hide');
    var sr = $('show-results');
    if (sr) sr.classList.add('hide');

    $qa('.results-list > li.hide').forEach(function (li) {
      li.classList.remove('hide');
    });
  }

  // ── Mobile Results Toggle ───────────────────────────────────────────

  // Expose globally for HTML onclick attributes
  window.showResultsPage = showResultsPage;
  window.showResults = showResultsPage;

  window.toggleResultsMobile = function () {
    var card = $('results-card');
    var showEl = $('show-results');
    if (!card) return;

    var resultsCards = $qa('.results-card');

    if (card.classList.contains('slideInUp')) {
      resultsCards.forEach(function (el) {
        el.classList.toggle('slideInUp');
        el.classList.toggle('slideOutDown');
      });
      if (showEl) showEl.innerHTML =
        '<div class="animated flipInX">' +
        '<img src="media/arrow-up.png"><br>' +
        '<h6><strong>Show scores</strong></h6></div>';

    } else if (card.classList.contains('slideOutDown')) {
      resultsCards.forEach(function (el) {
        el.classList.toggle('slideOutDown');
        el.classList.toggle('slideInUp');
      });
      if (showEl) showEl.innerHTML =
        '<div class="animated flipInX">' +
        '<img src="media/arrow-down.png"><br>' +
        '<h6><strong>Hide scores</strong></h6></div>';

    } else {
      resultsCards.forEach(function (el) {
        el.classList.toggle('slideInUp');
        el.classList.toggle('results-card-hide');
        el.classList.toggle('results-card-show');
      });
      if (showEl) showEl.innerHTML =
        '<div class="animated flipInX">' +
        '<img src="media/arrow-down.png"><br>' +
        '<h6><strong>Hide scores</strong></h6></div>';
    }
  };

  // ── Summary / Modal ─────────────────────────────────────────────────

  function handleSummary() {
    // Remove existing cloned results from modal
    var existing = $q('#modal-body > #results-list-cont');
    if (existing) existing.remove();

    // Clone results into modal
    var original = $('results-list-cont');
    if (original) {
      var clone = original.cloneNode(true);
      $('modal-body').appendChild(clone);
    }

    // Render summary images/toggles per question
    var defs = SUMMARY_DEFS[mode];
    for (var i = 0; i < defs.length; i++) {
      renderSummaryItem(defs[i]);
    }
  }

  function renderSummaryItem(def) {
    var checked = $q('input[name="radio-q' + def.q + '"]:checked');
    if (!checked) return;

    var idx = checked.id.match(/radio(\d+)/)[1];

    if (def.type === 'image') {
      setHtml(def.id, '<img src="' + def.path + idx + '.jpg" alt="" height="' + def.h + '">');

    } else if (def.type === 'legs') {
      var text = idx === '1'
        ? 'Legs and feet are well supported and in an evenly balanced posture.'
        : 'Legs and feet are NOT evenly balanced and supported.';
      setHtml(def.id, text + '<br><img src="' + def.path + idx + '.jpg" alt="" height="' + def.h + '">');

    } else if (def.type === 'force') {
      var intIdx = parseInt(idx);
      for (var j = 1; j <= def.count; j++) {
        var el = $(def.prefix + '-q' + j);
        if (el) {
          if (j === intIdx) {
            el.classList.remove('sum-li');
          } else {
            el.classList.add('sum-li');
          }
        }
      }
    }
  }

})();
