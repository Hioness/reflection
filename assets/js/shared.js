/* Reflection — shared helpers (vanilla, no deps) */
(function () {
  'use strict';

  var THEME_KEY = 'reflection-global-theme';

  /* ---------- save-failure banner (quota / security errors) ---------- */
  function notifySaveError() {
    if (document.getElementById('save-warning')) return; // at most one banner
    var banner = document.createElement('div');
    banner.id = 'save-warning';
    banner.className = 'save-warning';
    banner.setAttribute('role', 'alert');
    var msg = document.createElement('span');
    msg.textContent = 'Storage is full — your latest changes were not saved.';
    var dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'save-warning-dismiss';
    dismiss.textContent = 'Dismiss';
    dismiss.addEventListener('click', function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    });
    banner.appendChild(msg);
    banner.appendChild(dismiss);
    document.body.appendChild(banner);
  }

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
    document.documentElement.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('dark-mode', isDark);
    try {
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute('content', isDark ? '#1a1a1a' : '#F0EEE6');
    } catch (e) {}
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.textContent = isDark ? 'Light' : 'Dark';
    });
    try { localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); } catch (e) {}
  }

  function loadTheme() {
    // ?theme=light|dark override (handy for QA/screenshots, persists like a toggle)
    try {
      var q = new URLSearchParams(window.location.search).get('theme');
      if (q === 'light' || q === 'dark') { applyTheme(q === 'dark'); return; }
    } catch (e) {}
    applyTheme(isDarkPreferred());
  }

  function toggleDarkMode() {
    var isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
  }

  window.ReflectionTheme = { loadTheme: loadTheme, toggleDarkMode: toggleDarkMode };
  window.toggleDarkMode = toggleDarkMode; // legacy onclick compat

  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY) loadTheme();
  });

  /* ---------- shared UI: announcements + wiring helpers ---------- */
  var announceTimer = null;

  function announce(msg) {
    var region = document.getElementById('a11y-status');
    if (!region) {
      region = document.createElement('div');
      region.id = 'a11y-status';
      region.className = 'visually-hidden';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    // clear then set so identical messages are re-announced
    region.textContent = '';
    if (announceTimer) clearTimeout(announceTimer);
    announceTimer = setTimeout(function () { region.textContent = msg; }, 50);
  }

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
      var ok = document.execCommand('copy');
      if (ok) {
        if (button) {
          button.textContent = successText;
          setTimeout(function () { button.textContent = originalText; }, 1500);
        }
        announce(successText);
      } else {
        if (button) {
          button.textContent = 'Copy failed';
          setTimeout(function () { button.textContent = originalText; }, 1500);
        }
        announce('Copy failed');
      }
    } catch (err) {
      if (button) {
        button.textContent = 'Copy failed';
        setTimeout(function () { button.textContent = originalText; }, 1500);
      }
      announce('Copy failed');
    }
    document.body.removeChild(ta);
  }

  function copyToClipboard(text, button, successText) {
    successText = successText || 'Copied!';
    var originalText = button ? button.textContent : '';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (button) {
          button.textContent = successText;
          setTimeout(function () { button.textContent = originalText; }, 1500);
        }
        announce(successText);
      }).catch(function () {
        fallbackCopy(text, button, successText, originalText);
      });
    } else {
      fallbackCopy(text, button, successText, originalText);
    }
  }

  window.copyToClipboard = copyToClipboard;

  function bindCopy(id, getText, okText) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', function () {
      copyToClipboard(getText(), btn, okText || 'Copied!');
    });
  }

  function bindDownload(id, getText, filename, okText) {
    var btn = document.getElementById(id);
    if (!btn) return;
    var originalText = btn.textContent;
    btn.addEventListener('click', function () {
      var name = typeof filename === 'function' ? filename() : filename;
      downloadFile(name, getText());
      btn.textContent = okText || 'Saved!';
      announce(okText || 'Saved!');
      setTimeout(function () { btn.textContent = originalText; }, 1500);
    });
  }

  window.ReflectionUI = { announce: announce, bindCopy: bindCopy, bindDownload: bindDownload };

  /* ---------- sanitize (allowlist rebuild for contenteditable restore) ---------- */
  var ALLOWED_TAGS = {
    p: 1, br: 1, div: 1, span: 1, strong: 1, em: 1, b: 1, i: 1, u: 1, s: 1,
    h1: 1, h2: 1, h3: 1, ul: 1, ol: 1, li: 1, code: 1, pre: 1, blockquote: 1,
    hr: 1, a: 1
  };
  // Dropped entirely, including all descendants.
  var DROP_TAGS = {
    script: 1, style: 1, iframe: 1, object: 1, embed: 1, link: 1, meta: 1,
    base: 1, basefont: 1, bgsound: 1, template: 1, form: 1, input: 1, button: 1,
    select: 1, textarea: 1, svg: 1, math: 1, video: 1, audio: 1, canvas: 1,
    slot: 1, portal: 1
  };

  function normUrl(value) {
    var s = value == null ? '' : String(value);
    // strip leading/trailing C0 controls, space and DEL
    s = s.replace(/^[\u0000-\u0020\u007F]+/, '').replace(/[\u0000-\u0020\u007F]+$/, '');
    // the WHATWG URL parser removes tabs/newlines/CR anywhere
    s = s.replace(/[\t\n\r]/g, '');
    var m = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(s);
    if (m) {
      var scheme = m[1].toLowerCase();
      if (scheme === 'http' || scheme === 'https' || scheme === 'mailto' || scheme === 'tel') return s;
      return '';
    }
    return s;
  }

  function sanitizeHTML(html) {
    var tpl = document.createElement('template');
    tpl.innerHTML = html == null ? '' : String(html);
    var root = tpl.content;

    // Iterative depth-first walk over every descendant (nested template content
    // is unreachable this way, but <template> is dropped whole, so it is gone).
    var elements = [];
    var stack = [root];
    while (stack.length) {
      var current = stack.pop();
      for (var i = current.childNodes.length - 1; i >= 0; i--) {
        var child = current.childNodes[i];
        if (child.nodeType === 1) elements.push(child);
        stack.push(child);
      }
    }

    // 1) drop forbidden elements (and thus their descendants)
    for (var d = 0; d < elements.length; d++) {
      var dropEl = elements[d];
      var dropTag = dropEl.tagName ? dropEl.tagName.toLowerCase() : '';
      if (DROP_TAGS[dropTag] && dropEl.parentNode) dropEl.parentNode.removeChild(dropEl);
    }

    // 2) unwrap unknown tags, keep only `href` on <a>, walk in document order
    for (var e = 0; e < elements.length; e++) {
      var el = elements[e];
      if (!root.contains(el)) continue; // inside a dropped subtree
      var tag = el.tagName ? el.tagName.toLowerCase() : '';
      if (!ALLOWED_TAGS[tag]) {
        while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el);
        el.parentNode.removeChild(el);
        continue;
      }
      var names = [];
      for (var ai = 0; ai < el.attributes.length; ai++) names.push(el.attributes[ai].name);
      for (var ni = 0; ni < names.length; ni++) {
        var attrName = names[ni];
        if (tag === 'a' && attrName.toLowerCase() === 'href') {
          var safe = normUrl(el.getAttribute(attrName));
          if (safe) el.setAttribute('href', safe);
          else el.removeAttribute(attrName);
        } else {
          el.removeAttribute(attrName);
        }
      }
    }

    return tpl.innerHTML;
  }
  window.sanitizeHTML = sanitizeHTML;

  /* ---------- auto-resize (capped at 60vh) ---------- */
  function autoResize(ta) {
    ta.style.height = 'auto';
    var cap = window.innerHeight * 0.6;
    ta.style.height = Math.min(ta.scrollHeight, cap) + 'px';
    ta.style.overflowY = ta.scrollHeight > cap ? 'auto' : 'hidden';
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
    var parsed;
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      parsed = JSON.parse(raw);
    } catch (e) { return fallback; }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return fallback;
    // shallow-merge onto a copy of fallback: known keys are type-checked,
    // unknown keys are preserved (they are user data, e.g. annual answers)
    var out = {};
    var parsedKeys = Object.keys(parsed);
    for (var pi = 0; pi < parsedKeys.length; pi++) { out[parsedKeys[pi]] = parsed[parsedKeys[pi]]; }
    var keys = Object.keys(fallback || {});
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var fv = fallback[k];
      if (!Object.prototype.hasOwnProperty.call(parsed, k)) { out[k] = fv; continue; }
      var pv = parsed[k];
      var match;
      if (Array.isArray(fv)) match = Array.isArray(pv);
      else if (fv === null) match = (pv === null);
      else match = (typeof pv === typeof fv);
      out[k] = match ? pv : fv;
    }
    return out;
  }
  function saveJSON(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
      return true;
    } catch (e) {
      notifySaveError();
      return false;
    }
  }
  function debounce(fn, ms) {
    var t = null;
    var pending = false;
    var self = null;
    var args = null;
    function invoke() {
      pending = false;
      t = null;
      var a = args, s = self;
      args = null;
      self = null;
      fn.apply(s, a);
    }
    var debounced = function () {
      self = this;
      args = arguments;
      pending = true;
      clearTimeout(t);
      t = setTimeout(invoke, ms);
    };
    debounced.flush = function () {
      if (!pending) return;
      clearTimeout(t);
      invoke();
    };
    debounced.cancel = function () {
      clearTimeout(t);
      t = null;
      pending = false;
      args = null;
      self = null;
    };
    return debounced;
  }
  function localDate(d) {
    d = d || new Date();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
  }
  function onExternalChange(key, handler) {
    window.addEventListener('storage', function (e) {
      if (e.key !== key || e.newValue == null) return;
      var parsed;
      try { parsed = JSON.parse(e.newValue); } catch (err) { return; }
      handler(parsed);
    });
  }
  window.ReflectionStore = {
    loadJSON: loadJSON,
    saveJSON: saveJSON,
    debounce: debounce,
    localDate: localDate,
    onExternalChange: onExternalChange,
    notifySaveError: notifySaveError
  };

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
      addEnergy: function (n) { frame += (n || 10); if (reduced) drawStatic(); }
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

  // block-level tags the editor manages at its top level
  var BLOCK_RE = /^(p|div|h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote|pre|hr|table)$/;

  function toggleBlock(tag, editor) {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editor) return;
    var range = sel.getRangeAt(0);
    var low = tag.toLowerCase();
    var nodes = [];
    var i;

    if (!range.collapsed) {
      // every top-level child of the editor the selection touches
      for (i = 0; i < editor.childNodes.length; i++) {
        var child = editor.childNodes[i];
        if (child.nodeType === 1 && child.tagName === 'BR') continue;
        var hit = false;
        try { hit = range.intersectsNode(child); } catch (e) { hit = false; }
        if (hit) nodes.push(child);
      }
    } else {
      // collapsed caret: the block it lives in, else the direct child / text node
      var node = sel.anchorNode;
      var el = node && node.nodeType === 3 ? node.parentElement : node;
      var block = el && el.closest ? el.closest('h1,h2,p,div') : null;
      // stop the search at the editor root: never match the editor itself
      if (block && (block === editor || !editor.contains(block))) block = null;
      if (block) nodes.push(block);
      else if (node && node.nodeType === 3 && node.parentNode === editor) nodes.push(node);
      else if (el && el.parentNode === editor) nodes.push(el);
      else return;
    }

    // drop stray <br> placeholders so they cannot become headings
    var kept = [];
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 1 && nodes[i].tagName === 'BR') continue;
      kept.push(nodes[i]);
    }
    nodes = kept;
    if (!nodes.length) return;

    var anyBlock = false;
    var allTarget = true;
    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var isEl = n.nodeType === 1;
      if (isEl && BLOCK_RE.test(n.tagName.toLowerCase())) anyBlock = true;
      if (!(isEl && n.tagName.toLowerCase() === low)) allTarget = false;
    }

    if (!anyBlock) {
      // a run of inline content / text: wrap the whole run in one block,
      // moving the nodes so inline markup (strong/em/links) survives
      var wrap = document.createElement(tag);
      var first = nodes[0];
      first.parentNode.insertBefore(wrap, first);
      for (i = 0; i < nodes.length; i++) wrap.appendChild(nodes[i]);
      var r1 = document.createRange();
      r1.selectNodeContents(wrap);
      sel.removeAllRanges();
      sel.addRange(r1);
      return;
    }

    var made = [];
    for (i = 0; i < nodes.length; i++) {
      var m = nodes[i];
      var isBlock = m.nodeType === 1 && BLOCK_RE.test(m.tagName.toLowerCase());
      var repl = document.createElement(allTarget ? 'p' : tag);
      if (isBlock) {
        repl.innerHTML = m.innerHTML;
        m.parentNode.replaceChild(repl, m);
      } else {
        m.parentNode.replaceChild(repl, m);
        repl.appendChild(m);
      }
      made.push(repl);
    }
    // restore the selection across every converted block
    var r = document.createRange();
    r.setStartBefore(made[0]);
    r.setEndAfter(made[made.length - 1]);
    sel.removeAllRanges();
    sel.addRange(r);
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
    } else if (command === 'h1') { toggleBlock('h1', editor); }
    else if (command === 'h2') { toggleBlock('h2', editor); }
  }
  window.modernFormat = modernFormat;
})();
