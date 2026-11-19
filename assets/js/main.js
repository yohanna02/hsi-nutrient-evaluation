/* ==========================================================================
   HSI project site — behaviour
   Vanilla JS, no dependencies. Everything degrades gracefully without it.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* --- Theme ------------------------------------------------------------ */
  var themeBtn = document.getElementById('themeToggle');
  var STORE = 'hsi-theme';

  function systemDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : systemDark();
  }
  function paintThemeBtn() {
    var dark = isDark();
    themeBtn.textContent = dark ? '☀' : '◐';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  paintThemeBtn();

  themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(STORE, next); } catch (e) { /* private mode */ }
    paintThemeBtn();
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (!root.getAttribute('data-theme')) paintThemeBtn();
  });

  /* --- Scroll spy -------------------------------------------------------
     The header is taller on a phone (brand row + link strip), so its height
     is measured rather than assumed, and kept in sync as the layout changes. */
  var header = document.querySelector('.site-header');
  var nav = document.getElementById('nav');
  var navLinks = {};
  Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
    navLinks[a.getAttribute('href').slice(1)] = a;
  });
  // Only sections the nav points at. The hero has an id of its own but no nav
  // link, and including it left nothing highlighted while reading the top.
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  ).filter(function (s) { return s.id in navLinks; });

  // Track each section by its heading. A section's box starts with its top
  // padding, so the box edge is well above the text the reader is actually on.
  var anchors = sections.map(function (s) {
    return s.querySelector('h2') || s;
  });

  function headerH() { return header.getBoundingClientRect().height; }
  function syncOffset() {
    root.style.scrollPaddingTop = (headerH() + 12) + 'px';
  }
  syncOffset();
  window.addEventListener('resize', syncOffset);

  /* Keep the highlighted link inside the swipeable strip on a phone. */
  function revealLink(link) {
    if (nav.scrollWidth <= nav.clientWidth) return;
    var l = link.offsetLeft, r = l + link.offsetWidth;
    if (l < nav.scrollLeft) nav.scrollLeft = l - 12;
    else if (r > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = r - nav.clientWidth + 12;
  }

  var ticking = false;
  var current = null;
  function spy() {
    ticking = false;
    // The reading line sits about a third down the viewport — the content the
    // reader is actually looking at, rather than the top edge of the screen.
    var line = window.scrollY + window.innerHeight * 0.33;
    var active = null;
    for (var i = 0; i < sections.length; i++) {
      if (anchors[i].getBoundingClientRect().top + window.scrollY <= line) active = sections[i].id;
    }
    // The last section may be shorter than the viewport, so it can never reach
    // the reading line — at the bottom of the page it is the one being read.
    if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) {
      active = sections[sections.length - 1].id;
    }
    if (active === current) return;
    current = active;
    for (var id in navLinks) {
      if (id === active) navLinks[id].setAttribute('aria-current', 'true');
      else navLinks[id].removeAttribute('aria-current');
    }
    if (active && navLinks[active]) revealLink(navLinks[active]);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(spy); }
  }, { passive: true });
  spy();

  /* Opening a disclosure changes the page height, so re-run the spy. */
  Array.prototype.forEach.call(document.querySelectorAll('details.more'), function (d) {
    d.addEventListener('toggle', spy);
  });

  /* --- Sample filters --------------------------------------------------- */
  var filters = document.getElementById('filters');
  var scans = Array.prototype.slice.call(document.querySelectorAll('#gallery .scan'));

  filters.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    var want = chip.dataset.filter;

    Array.prototype.forEach.call(filters.querySelectorAll('.chip'), function (c) {
      c.setAttribute('aria-pressed', String(c === chip));
    });
    scans.forEach(function (card) {
      card.hidden = !(want === 'all' || card.dataset.food === want);
    });
    spy();
  });

  /* --- Demo video: never leave audio playing behind the reader ---------- */
  var video = document.getElementById('demoVideo');
  if (video) {
    // Pause when it scrolls out of view, so scrolling on does not leave sound running.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting && !video.paused) video.pause();
        });
      }, { threshold: 0 }).observe(video);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && !video.paused) video.pause();
    });
  }

  /* --- Lightbox --------------------------------------------------------- */
  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lightboxImg');
  var boxCap = document.getElementById('lightboxCap');
  var boxClose = document.getElementById('lightboxClose');
  var boxOpen = document.getElementById('lightboxOpen');
  var lastFocus = null;

  function openBox(trigger) {
    var thumb = trigger.querySelector('img');
    lastFocus = trigger;
    boxImg.src = trigger.dataset.full;
    boxImg.alt = thumb ? thumb.alt : '';
    boxCap.textContent = trigger.dataset.caption || '';
    boxOpen.href = trigger.dataset.full;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    boxClose.focus();
  }
  function closeBox() {
    box.hidden = true;
    boxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.zoomable');
    if (trigger) {
      if (video && !video.paused) video.pause();
      openBox(trigger);
      return;
    }
    if (!box.hidden && (e.target === box || e.target.closest('#lightboxClose'))) closeBox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !box.hidden) closeBox();
  });

  /* --- Print: expand the collapsed detail so nothing is lost on paper --- */
  var openedForPrint = [];
  function expandForPrint() {
    openedForPrint = [];
    Array.prototype.forEach.call(document.querySelectorAll('details.more'), function (d) {
      if (!d.open) { d.open = true; openedForPrint.push(d); }
    });
  }
  function restoreAfterPrint() {
    openedForPrint.forEach(function (d) { d.open = false; });
    openedForPrint = [];
  }
  window.addEventListener('beforeprint', expandForPrint);
  window.addEventListener('afterprint', restoreAfterPrint);
  if (window.matchMedia) {
    var printQuery = window.matchMedia('print');
    printQuery.addEventListener('change', function (e) {
      if (e.matches) expandForPrint(); else restoreAfterPrint();
    });
  }
})();