/* Reflection — shared helpers (vanilla, no deps) */
(function () {
  'use strict';

  var THEME_KEY = 'reflection-global-theme';

  /* ---------- theme (label shows ACTION) ---------- */
  function isDarkPreferred() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    // No saved preference: honor OS, default dark otherwise
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return false;
    } catch (e) {}
    return true;
  }

  function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.textContent = isDark ? 'Light' : 'Dark';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    });
    try { localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); } catch (e) {}
  }

  function loadTheme() {
    applyTheme(isDarkPreferred());
  }

  function toggleDarkMode() {
    var isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
  }

  window.ReflectionTheme = { loadTheme: loadTheme, toggleDarkMode: toggleDarkMode, THEME_KEY: THEME_KEY };
  window.toggleDarkMode = toggleDarkMode; // legacy onclick compat

  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY) loadTheme();
  });

  /* ---------- clipboard with fallback ---------- */
  function fallbackCopy(text, button, successText, originalText) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      if (button) {
        button.textContent = successText;
        setTimeout(function () { button.textContent = originalText; }, 1500);
      }
    } catch (err) {
      if (button) {
        button.textContent = 'Copy failed';
        setTimeout(function () { button.textContent = originalText; }, 1500);
      }
    }
    document.body.removeChild(ta);
  }

  function copyToClipboard(text, button, successText) {
    successText = successText || 'Copied!';
    var originalText = button ? button.textContent : '';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (!button) return;
        button.textContent = successText;
        setTimeout(function () { button.textContent = originalText; }, 1500);
      }).catch(function () {
        fallbackCopy(text, button, successText, originalText);
      });
    } else {
      fallbackCopy(text, button, successText, originalText);
    }
  }

  window.copyToClipboard = copyToClipboard;

  /* ---------- sanitize (for contenteditable restore) ---------- */
  function sanitizeHTML(html) {
    var tpl = document.createElement('template');
    tpl.innerHTML = html || '';
    // strip scripts/styles/iframes/objects
    tpl.content.querySelectorAll('script, style, iframe, object, embed, link, meta').forEach(function (n) { n.remove(); });
    // strip event handlers + javascript: urls
    var walker = document.createTreeWalker(tpl.content, NodeFilter.SHOW_ELEMENT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (el) {
      Array.from(el.attributes || []).forEach(function (attr) {
        var name = attr.name.toLowerCase();
        var val = (attr.value || '').trim().toLowerCase();
        if (name.indexOf('on') === 0) el.removeAttribute(attr.name);
        else if ((name === 'href' || name === 'src' || name === 'xlink:href') && (val.indexOf('javascript:') === 0 || val.indexOf('data:text/html') === 0)) {
          el.removeAttribute(attr.name);
        }
      });
    });
    return tpl.innerHTML;
  }
  window.sanitizeHTML = sanitizeHTML;

  /* ---------- auto-resize ---------- */
  function autoResize(ta) {
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }
  function initAutoResize(scope) {
    (scope || document).querySelectorAll('textarea.auto-resize').forEach(function (ta) {
      autoResize(ta);
      if (!ta.dataset.bound) {
        ta.dataset.bound = '1';
        ta.addEventListener('input', function () { autoResize(ta); });
      }
    });
  }
  window.autoResize = autoResize;
  window.initAutoResize = initAutoResize;

  /* ---------- storage ---------- */
  function loadJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function saveJSON(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}
  }
  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }
  window.ReflectionStore = { loadJSON: loadJSON, saveJSON: saveJSON, debounce: debounce };

  /* ---------- download ---------- */
  function downloadFile(filename, text, mime) {
    var blob = new Blob([text], { type: mime || 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
  window.downloadFile = downloadFile;

  /* ---------- ASCII wave (pauses when hidden, honors reduced-motion) ---------- */
  function createAsciiAnimator(preEl, opts) {
    opts = opts || {};
    var width = opts.width || 40;
    var height = opts.height || 20;
    var speed = opts.speed || 0.02;
    var frame = 0;
    var running = true;
    var raf = 0;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function drawStatic() {
      var out = '';
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          var v = Math.sin(x * 0.15) * Math.cos(y * 0.15);
          out += v > 0.6 ? '█' : v > 0.3 ? '▓' : v > 0 ? '▒' : v > -0.2 ? '░' : '·';
        }
        out += '\n';
      }
      preEl.textContent = out;
    }

    function draw() {
      if (!running) return;
      var t = frame * speed;
      var out = '';
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          var value = Math.sin(x * 0.15 + t) * Math.cos(y * 0.15 - t * 0.5);
          out += value > 0.6 ? '█' : value > 0.3 ? '▓' : value > 0 ? '▒' : value > -0.2 ? '░' : '·';
        }
        out += '\n';
      }
      preEl.textContent = out;
      frame++;
      raf = requestAnimationFrame(draw);
    }

    if (reduced) { drawStatic(); }
    else {
      draw();
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { running = false; cancelAnimationFrame(raf); }
        else if (!running) { running = true; draw(); }
      });
    }

    return {
      addEnergy: function (n) { frame += (n || 10); if (reduced) drawStatic(); },
      stop: function () { running = false; cancelAnimationFrame(raf); }
    };
  }
  window.createAsciiAnimator = createAsciiAnimator;

  /* ---------- modern rich-text helpers (replaces execCommand) ---------- */
  function wrapSelection(tag) {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    var range = sel.getRangeAt(0);
    if (range.collapsed) return;
    var el = document.createElement(tag);
    try {
      range.surroundContents(el);
    } catch (e) {
      // fallback for partial node selections
      var frag = range.extractContents();
      el.appendChild(frag);
      range.insertNode(el);
    }
    sel.removeAllRanges();
  }

  function toggleBlock(tag) {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    var node = sel.anchorNode;
    var el = node && node.nodeType === 3 ? node.parentElement : node;
    var block = el ? el.closest('h1,h2,p,div') : null;
    if (block && block.tagName.toLowerCase() === tag.toLowerCase()) {
      var p = document.createElement('p');
      p.innerHTML = block.innerHTML;
      block.replaceWith(p);
    } else if (block) {
      var h = document.createElement(tag);
      h.innerHTML = block.innerHTML;
      block.replaceWith(h);
      // restore selection into new block
      var r = document.createRange();
      r.selectNodeContents(h);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  }

  function modernFormat(editor, command) {
    editor.focus();
    if (command === 'bold') {
      // toggle strong
      var sel = window.getSelection();
      var anchor = sel && sel.anchorNode ? (sel.anchorNode.parentElement) : null;
      var strong = anchor ? anchor.closest('strong,b') : null;
      if (strong) {
        var parent = strong.parentNode;
        while (strong.firstChild) parent.insertBefore(strong.firstChild, strong);
        parent.removeChild(strong);
      } else {
        wrapSelection('strong');
      }
    } else if (command === 'italic') {
      var s2 = window.getSelection();
      var a2 = s2 && s2.anchorNode ? (s2.anchorNode.parentElement) : null;
      var em = a2 ? a2.closest('em,i') : null;
      if (em) {
        var par = em.parentNode;
        while (em.firstChild) par.insertBefore(em.firstChild, em);
        par.removeChild(em);
      } else {
        wrapSelection('em');
      }
    } else if (command === 'h1') { toggleBlock('h1'); }
    else if (command === 'h2') { toggleBlock('h2'); }
  }
  window.modernFormat = modernFormat;
})();
