// Global search (ZC-04.4). Inserted into the persistent header by the layer. Two sources: the static search-index.json
// (precached for offline use) and the current-affairs feed the app has already loaded, read through ZOLA_LIVE (read
// only). Nothing is stored, sent or logged. The query and results live only in the page's memory. The control uses its
// own ids (gsearch*), never the tracker's #trkQ.
(function () {
  var hdr = document.querySelector('.hdr .top');
  if (!hdr || document.getElementById('gsearch-wrap')) return;

  var css = '' +
    '#gsearch-wrap{position:relative;flex:1 1 220px;max-width:340px;min-width:160px;margin:0 .5rem}' +
    '#gsearch{width:100%;box-sizing:border-box;font:inherit;font-size:.9rem;padding:.35rem .55rem;border:1px solid var(--rule,#999);border-radius:6px;background:var(--sheet,#fff);color:var(--ink,#111)}' +
    '#gsearch:focus-visible{outline:2px solid var(--pen,#06c);outline-offset:1px}' +
    '#gsearch-res{position:absolute;left:0;right:0;top:calc(100% + 4px);z-index:50;max-height:min(70vh,520px);overflow:auto;background:var(--sheet,#fff);color:var(--ink,#111);border:1px solid var(--rule,#999);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.18);padding:.4rem;font-size:.9rem}' +
    '#gsearch-res[hidden]{display:none}' +
    '#gsearch-res h3{font-size:.78rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted,#555);margin:.5rem .4rem .2rem}' +
    '#gsearch-res ul{list-style:none;margin:0;padding:0}' +
    '#gsearch-res li button{display:block;width:100%;text-align:left;font:inherit;background:none;border:0;border-radius:4px;padding:.4rem;color:inherit;cursor:pointer}' +
    '#gsearch-res li button:hover,#gsearch-res li button:focus-visible{background:var(--paper,#f4f4f4);outline:none;box-shadow:inset 0 0 0 2px var(--pen,#06c)}' +
    '#gsearch-res .gs-sub{display:block;font-size:.78rem;color:var(--muted,#555)}' +
    '#gsearch-res .gs-limit{display:block;font-size:.78rem;color:var(--warn,#8a5a00)}' +
    '#gsearch-res .gs-note{font-size:.78rem;color:var(--muted,#555);margin:.5rem .4rem}' +
    '#gsearch-res .gs-more{margin:.2rem .4rem .4rem;font:inherit;font-size:.8rem;background:none;border:1px solid var(--rule,#999);border-radius:4px;padding:.2rem .5rem;cursor:pointer;color:inherit}' +
    '#gsearch-res .gs-src{display:inline-block;margin:0 .4rem .3rem;font-size:.78rem;color:var(--pen,#06c)}' +
    '#gsearch-res .gs-detail h3{margin:.5rem .4rem .2rem}' +
    '#gsearch-res .gs-dt-title{font-weight:600;margin:.2rem .4rem .4rem;line-height:1.35}' +
    '#gsearch-res .gs-dl{margin:.2rem .4rem .5rem}' +
    '#gsearch-res .gs-dl dt{font-size:.75rem;text-transform:uppercase;letter-spacing:.03em;color:var(--muted,#555);margin-top:.5rem}' +
    '#gsearch-res .gs-dl dd{margin:.1rem 0 0;line-height:1.4}' +
    '@media (max-width:640px){.hdr .top{flex-wrap:wrap}#gsearch-wrap{order:99;flex:1 1 100%;max-width:none;min-width:0;margin:.4rem 0 .2rem}}';
  var style = document.createElement('style');
  style.id = 'gsearch-css';
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'gsearch-wrap';
  wrap.setAttribute('role', 'search');
  wrap.innerHTML =
    '<label class="sr" for="gsearch">Search topics, articles, events, machines, claims, CSAT labels and feed items</label>' +
    '<input id="gsearch" type="search" autocomplete="off" spellcheck="false" placeholder="Search everything" aria-controls="gsearch-res" aria-expanded="false">' +
    '<div id="gsearch-res" hidden></div>' +
    '<p id="gsearch-status" class="sr" aria-live="polite"></p>';
  var clock = document.getElementById('clock');
  hdr.insertBefore(wrap, clock || null);

  var input = document.getElementById('gsearch');
  var res = document.getElementById('gsearch-res');
  var statusEl = document.getElementById('gsearch-status');
  var index = null, loading = null, live = null;
  var LIMIT = 8;
  var GROUPS = [
    ['forecast', 'Forecast events'], ['article', 'Articles'], ['topic', 'Syllabus topics'],
    ['machine', 'Hacking machines'], ['claim', 'Hacking claims'], ['case', 'Hacking cases'], ['csat', 'CSAT labels'],
    ['feed-event', 'Feed events'], ['feed-inbox', 'Feed news']
  ];
  var LIVE_LABEL = { live: 'Live feed', saved: 'Saved copy', offline: 'Built-in data only', setup: 'Feed not set up' };
  var current = [];
  var expanded = {};
  var detailRec = null;

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }
  function status(msg) { statusEl.textContent = msg; }

  function load() {
    if (index) return Promise.resolve(index);
    if (loading) return loading;
    loading = fetch('search-index.json', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) {
        if (!j || j.schema !== 'zola-search-index/1' || !Array.isArray(j.records)) throw new Error('unexpected index');
        // The index carries its search text already normalised (tools/search-index.mjs); nothing is normalised here.
        j.records.forEach(function (r) { r._n = r.n || norm(r.title); r._t = norm(r.title); });
        index = j;
        return j;
      })
      .catch(function () { loading = null; throw new Error('index'); });
    return loading;
  }

  // Current affairs: read-only. The app's ZOLA_LIVE API supplies the feed it already loaded. Only state, info, events and
  // inbox are read. The app's own refresh, storage and validation are left alone. The snapshot is rebuilt on setup and
  // whenever the app fires zola-live.
  function fmtDate(v) {
    var d = new Date(v);
    return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function httpsUrl(u) { return typeof u === 'string' && /^https:\/\//.test(u) ? u : ''; }
  function liveSnapshot() {
    if (live) return live;
    var L = window.ZOLA_LIVE;
    var snap = { ok: false, label: '', when: '', records: [] };
    if (!L || typeof L.inbox !== 'function' || typeof L.events !== 'function' || typeof L.state !== 'function') {
      snap.label = 'The feed is not on this page, so news and feed events are not searched.';
    } else {
      try {
        var state = L.state();
        var info = typeof L.info === 'function' ? L.info() : null;
        snap.label = LIVE_LABEL[state] || 'Feed state unknown';
        snap.when = info && info.fetchedAt ? new Date(info.fetchedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
        var evs = L.events().map(function (e) {
          var st = e.status === 'VERIFIED' ? 'Checked' : 'Unverified';
          return { type: 'feed-event', id: 'ev:' + e.id, title: e.title, status: st,
            sub: [fmtDate(e.date), e.subject, e.source && e.source.title, st].filter(Boolean).join(' · '),
            url: httpsUrl(e.source && e.source.url), route: '#forecast/tracker' };
        });
        var news = L.inbox().map(function (i) {
          return { type: 'feed-inbox', id: 'in:' + i.id, title: i.title, status: 'Unverified',
            sub: [i.source, fmtDate(i.published), (i.subjects || []).join(', '), 'Unverified'].filter(Boolean).join(' · '),
            url: httpsUrl(i.url), route: '#forecast/tracker' };
        });
        snap.records = evs.concat(news);
        snap.records.forEach(function (r) { r._n = norm(r.title + ' ' + r.sub); r._t = norm(r.title); });
        snap.ok = true;
      } catch (e) {
        snap.label = 'The feed could not be read, so news and feed events are not searched.';
      }
    }
    live = snap;
    return snap;
  }
  window.addEventListener('zola-live', function () {
    live = null;
    if (!res.hidden && input.value) render(input.value);
  });

  function search(q) {
    var tokens = norm(q).split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    var pool = index.records.concat(liveSnapshot().records);
    var hits = [];
    pool.forEach(function (r) {
      var ok = tokens.every(function (t) { return r._n.indexOf(t) !== -1; });
      if (!ok) return;
      var score = tokens.reduce(function (s, t) { return s + (r._t.indexOf(t) !== -1 ? 2 : 1); }, 0);
      hits.push({ r: r, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score || (a.r.title < b.r.title ? -1 : a.r.title > b.r.title ? 1 : 0); });
    return hits.map(function (h) { return h.r; });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // A record that has no page of its own (a syllabus topic, a Hacking claim or case) is shown here, in full, instead of
  // a link that would only open a general page. The panel says what it is, and does not claim the Hacking page opened.
  function field(label, value) {
    return value ? '<dt>' + esc(label) + '</dt><dd>' + esc(value) + '</dd>' : '';
  }
  function detailHtml(r) {
    if (r.fallback) return fallbackHtml(r);
    var d = r.detail || {}, body, heading;
    if (r.type === 'claim') {
      heading = 'Hacking claim';
      body = field('Claim', d.text) + field('Tag', d.tag) + field('Currency check', d.currency_check) +
        field('Note or limit', d.note) + field('Locator', d.locator) + field('Evidence phrase', d.evidence_phrase);
    } else if (r.type === 'case') {
      heading = 'Hacking case';
      body = field('Case', d.name) + field('Year', d.year ? String(d.year) : '') + field('Decided', d.decided) +
        field('Court', d.court) + field('Citation', d.citation) + field('Posture', d.posture) +
        field('Verified scope', d.verified_scope) + field('Null reason', d.null_reason);
    } else {
      heading = 'Syllabus topic';
      body = field('Papers', (d.papers || []).join(', '));
    }
    return '<section class="gs-detail" aria-label="Record detail"><h3>' + esc(heading) + '</h3>' +
      '<p class="gs-dt-title">' + esc(r.title) + '</p><dl class="gs-dl">' + body + '</dl>' +
      '<button type="button" class="gs-more" data-back="1">Back to results</button></section>';
  }
  // A tracker or feed result that the tracker cannot show keeps its title, date, source and status in the panel, with the
  // reason. It does not say the item is selected.
  function fallbackHtml(r) {
    var heading = r.type === 'forecast' ? 'Tracker event' : 'Feed item';
    var facts = r.type === 'forecast'
      ? field('ID', r.id) + field('Date', r.date) + field('Source', r.source) + field('Status', r.status)
      : field('Date and source', r.sub) + field('Verification', r.status);
    var link = r.url ? '<dt>Source link</dt><dd><a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">Open the source</a></dd>' : '';
    return '<section class="gs-detail" aria-label="Record detail"><h3>' + esc(heading) + '</h3>' +
      '<p class="gs-dt-title">' + esc(r.title) + '</p><dl class="gs-dl">' + facts +
      '<dt>Why it is not selected here</dt><dd>' + esc(r.fallback) + '</dd>' + link + '</dl>' +
      '<button type="button" class="gs-more" data-back="1">Back to results</button></section>';
  }
  function showFallback(r, why) {
    detailRec = { type: r.type, title: r.title, sub: r.sub, id: r.id, date: r.date, source: r.source, status: r.status, url: r.url, fallback: why };
    render(input.value);
    status('"' + r.title + '" is shown in the results panel. It is not selected on the tracker.');
  }
  function showDetail(r) {
    detailRec = r;
    render(input.value);
    status('Details for this ' + (r.type === 'claim' ? 'claim' : r.type === 'case' ? 'case' : 'topic') + ' are shown in the results panel.');
  }

  function render(q) {
    if (detailRec) {
      res.innerHTML = detailHtml(detailRec);
      res.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      return;
    }
    current = search(q);
    var groups = {};
    GROUPS.forEach(function (g) { groups[g[0]] = []; });
    current.forEach(function (r, i) { if (groups[r.type]) groups[r.type].push({ r: r, i: i }); });
    var html = '';
    GROUPS.forEach(function (g) {
      var list = groups[g[0]];
      if (!list.length) return;
      var show = expanded[g[0]] ? list : list.slice(0, LIMIT);
      html += '<h3>' + esc(g[1]) + ' (' + list.length + ')</h3><ul>';
      show.forEach(function (x) {
        var r = x.r;
        html += '<li><button type="button" data-gi="' + x.i + '">' + esc(r.title) +
          (r.sub ? '<span class="gs-sub">' + esc(r.sub) + '</span>' : '') +
          (r.limit ? '<span class="gs-limit">' + esc(r.limit) + '</span>' : '') + '</button>' +
          (r.url ? '<a class="gs-src" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">Source</a>' : '') + '</li>';
      });
      html += '</ul>';
      if (list.length > LIMIT && !expanded[g[0]]) {
        html += '<button type="button" class="gs-more" data-more="' + esc(g[0]) + '">Show all ' + list.length + '</button>';
      }
    });
    var snap = liveSnapshot();
    html += '<p class="gs-note">Feed: ' + esc(snap.label) + (snap.when ? ' · fetched ' + esc(snap.when) : '') +
      (snap.ok ? '. Feed items are unverified unless marked Checked.' : '.') + '</p>';
    html += '<p class="gs-note">Searches this device only: nothing is sent, stored or logged.</p>';
    res.innerHTML = (current.length ? '' : '<p class="gs-note">No match.</p>') + html;
    res.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    status(current.length + (current.length === 1 ? ' result' : ' results'));
  }

  function close() {
    res.hidden = true;
    res.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    current = [];
    expanded = {};
    detailRec = null;
  }

  function cssEscape(v) {
    return (window.CSS && CSS.escape) ? CSS.escape(v) : String(v).replace(/["\\]/g, '\\$&');
  }

  // A Forecast result opens the tracker and reveals its row. The tracker's own filter is cleared first, because the
  // row may be hidden by it. If the row cannot be shown, the result keeps its title and source, and nothing is claimed.
  function revealForecast(r) {
    location.hash = r.route;
    var q = document.getElementById('trkQ');
    if (q && q.value) { q.value = ''; q.dispatchEvent(new Event('input', { bubbles: true })); }
    var t0 = Date.now();
    (function wait() {
      var row = document.querySelector('[data-id="' + cssEscape(r.rowId) + '"]');
      if (row && row.offsetParent !== null) {
        row.open = true;
        row.scrollIntoView({ block: 'center' });
        var s = row.querySelector('summary');
        if (s) s.focus({ preventScroll: true });
        close();
        status('Showing "' + r.title + '" in the tracker.');
        return;
      }
      if (Date.now() - t0 > 3000) {
        showFallback(r, 'the tracker does not show this event right now.');
        return;
      }
      setTimeout(wait, 60);
    })();
  }

  // A feed result opens the tracker's feed box. The box has no per-item selection and shows only its current list, so the
  // result says whether the title is in that list and never claims it is selected. The source link opens the original page.
  function revealFeed(r) {
    location.hash = r.route;
    var t0 = Date.now();
    (function wait() {
      var box = document.getElementById('zl-inbox');
      if (box && box.offsetParent !== null) {
        box.scrollIntoView({ block: 'start' });
        if (box.textContent.indexOf(r.title) !== -1) {
          close();
          status('"' + r.title + '" is listed in the feed box on the tracker. It is not selected.');
        } else {
          showFallback(r, 'it is not in the feed box\u2019s current list.');
        }
        return;
      }
      if (Date.now() - t0 > 3000) {
        showFallback(r, 'the tracker does not show the feed box right now.');
        return;
      }
      setTimeout(wait, 60);
    })();
  }

  function activate(r) {
    if (frame) { cancelAnimationFrame(frame); frame = 0; }
    if (r.type === 'article') { location.href = r.route; return; }
    if (r.type === 'forecast') { revealForecast(r); return; }
    if (r.type === 'feed-event' || r.type === 'feed-inbox') { revealFeed(r); return; }
    if (r.type === 'topic' || r.type === 'claim' || r.type === 'case') { showDetail(r); return; }
    if (r.type === 'csat') {
      location.hash = r.route;
      close();
      status('Opened the CSAT tab. "' + r.title + '" is listed in the results and is not selected there.');
      return;
    }
    if (r.route) {
      location.hash = r.route;
      close();
      status('Opened the page for ' + r.id + '.');
    }
  }

  // One render per frame: fast typing coalesces into a single search, and the result appears on the next frame.
  var frame = 0;
  input.addEventListener('input', function () {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(function () {
      frame = 0;
      if (!norm(input.value).trim()) { close(); status(''); return; }
      load().then(function () {
        if (!norm(input.value).trim()) { close(); return; }
        detailRec = null;
        render(input.value);
      }).catch(function () {
        res.innerHTML = '<p class="gs-note">Search is unavailable: the search index could not be loaded. Reload once while online.</p>';
        res.hidden = false;
        status('Search is unavailable.');
      });
    });
  });
  input.addEventListener('focus', function () { load().catch(function () {}); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { input.value = ''; close(); status(''); }
  });
  res.addEventListener('click', function (e) {
    if (e.target.closest('[data-back]')) { detailRec = null; render(input.value); return; }
    var more = e.target.closest('[data-more]');
    if (more) { expanded[more.getAttribute('data-more')] = true; render(input.value); return; }
    var b = e.target.closest('[data-gi]');
    if (b) activate(current[Number(b.getAttribute('data-gi'))]);
  });
  // The event path is read before any handler swaps the panel's contents, so a clicked button that a render has just
  // replaced still counts as inside the control.
  document.addEventListener('click', function (e) {
    var path = e.composedPath ? e.composedPath() : [];
    var inside = path.length ? path.indexOf(wrap) !== -1 : wrap.contains(e.target);
    if (!inside) close();
  });
  liveSnapshot();
})();
