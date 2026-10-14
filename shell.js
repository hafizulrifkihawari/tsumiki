/*
 * Tsumiki 積み木 — shared page shell, loaded by every page before its own script.
 *
 *   1. Left sidebar (app nav + Force Update), a ☰ drawer on narrow screens.
 *   2. Service worker registration + the "new version" toast.
 *   3. Version check: compares the running APP_VERSION (version.js, served
 *      from the SW cache with the rest of the bundle) against a no-store fetch
 *      of version.js, and flags Force Update when they differ.
 *   4. Force Update: drop the SW and every cache, refresh the HTTP cache, then
 *      hard-reload — with timeouts so a hung browser API can never stall it.
 *
 * Kept dependency-free and separate from the page scripts on purpose: if a
 * page's own script is broken or stale, navigation and Force Update still work.
 */
(function () {
  "use strict";

  var APP_VERSION = self.APP_VERSION || "?";
  var APP_ASSETS = self.APP_ASSETS || [];
  var CHECK_INTERVAL_MS = 30 * 60 * 1000;

  // ---------- 1. Sidebar ----------
  var NAV = [
    { page: "kanji", href: "index.html", jp: "漢字", label: "Kanji",
      sub: { page: "kanji-manage", href: "manage.html", jp: "管理", label: "Manage" } },
    { page: "kotoba", href: "kotoba.html", jp: "言葉", label: "Kotoba",
      sub: { page: "kotoba-manage", href: "kotoba-manage.html", jp: "管理", label: "Manage" } },
    { page: "bunpou", href: "bunpou.html", jp: "文法", label: "Bunpou" },
    { page: "kotd", href: "kotd.html", jp: "今日", label: "Kanji of the Day" }
  ];

  var currentPage = document.body.getAttribute("data-page") || "";

  // Wide screens: the sidebar can be hidden, and that choice is remembered
  // across pages. Narrow screens always use the ☰ drawer instead.
  var COLLAPSED_KEY = "tsumiki.sidebarCollapsed";
  var narrow = window.matchMedia("(max-width: 900px)");
  function readCollapsed() {
    try { return localStorage.getItem(COLLAPSED_KEY) === "1"; } catch (e) { return false; }
  }
  function setCollapsed(on) {
    document.documentElement.classList.toggle("sidebar-collapsed", on);
    try { localStorage.setItem(COLLAPSED_KEY, on ? "1" : "0"); } catch (e) { /* ignore */ }
  }
  document.documentElement.classList.toggle("sidebar-collapsed", readCollapsed());

  function navLink(item, isSub) {
    var current = item.page === currentPage ? ' aria-current="page"' : "";
    return '<a class="nav-link' + (isSub ? " nav-sub" : "") + '" href="' + item.href + '"' + current + ">" +
      '<span class="nav-jp">' + item.jp + "</span>" +
      '<span class="nav-label">' + item.label + "</span></a>";
  }

  var navHtml = NAV.map(function (item) {
    return "<li>" + navLink(item, false) + (item.sub ? navLink(item.sub, true) : "") + "</li>";
  }).join("");

  document.body.insertAdjacentHTML("afterbegin",
    '<button class="sidebar-toggle" id="sidebarToggle" type="button" aria-label="Open menu" ' +
      'aria-controls="sidebar" aria-expanded="false">☰<span class="update-dot" aria-hidden="true"></span></button>' +
    '<div class="sidebar-backdrop" id="sidebarBackdrop" hidden></div>' +
    '<aside class="sidebar" id="sidebar" aria-label="Main navigation">' +
      '<div class="sidebar-head">' +
      '<a class="sidebar-brand" href="index.html">' +
        '<span class="sidebar-logo">積み木</span>' +
        '<span class="sidebar-name">Tsumiki<small>Japanese, block by block</small></span>' +
      "</a>" +
      '<button class="sidebar-hide" id="sidebarHide" type="button" aria-label="Hide menu" title="Hide menu">«</button>' +
      "</div>" +
      '<nav><ul class="nav-list">' + navHtml + "</ul></nav>" +
      '<div class="sidebar-foot">' +
        '<div class="segmented season-seg" role="group" aria-label="Season">' +
          '<button class="seg-btn" type="button" data-season="meadow" aria-pressed="false">🌿 Meadow</button>' +
          '<button class="seg-btn" type="button" data-season="autumn" aria-pressed="false">🍁 Autumn</button>' +
          '<button class="seg-btn" type="button" data-season="light" aria-pressed="false">☀ Light</button>' +
          '<button class="seg-btn" type="button" data-season="dark" aria-pressed="false">🌙 Dark</button>' +
        "</div>" +
        '<button class="btn btn-ghost sidebar-update" id="updateBtn" type="button" ' +
          'title="Force refresh to the newest version (clears the app cache)">' +
          '<span class="btn-icon">↻</span><span class="update-label">Force Update</span>' +
          '<span class="update-dot" aria-hidden="true"></span>' +
        "</button>" +
        '<span class="sidebar-version" id="sidebarVersion">v' + APP_VERSION + "</span>" +
      "</div>" +
    "</aside>");

  var sidebar = document.getElementById("sidebar");
  var toggle = document.getElementById("sidebarToggle");
  var backdrop = document.getElementById("sidebarBackdrop");

  function setDrawer(open) {
    sidebar.classList.toggle("is-open", open);
    backdrop.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      var first = sidebar.querySelector("a, button");
      if (first) first.focus();
    }
  }
  function closeDrawer() {
    if (!sidebar.classList.contains("is-open")) return;
    setDrawer(false);
    toggle.focus();
  }

  toggle.addEventListener("click", function () {
    if (narrow.matches) { setDrawer(!sidebar.classList.contains("is-open")); return; }
    setCollapsed(false);
    toggle.setAttribute("aria-expanded", "true");
  });
  document.getElementById("sidebarHide").addEventListener("click", function () {
    if (narrow.matches) { closeDrawer(); return; }
    setCollapsed(true);
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  });
  // Leaving the narrow layout with the drawer open must not leave the backdrop behind.
  narrow.addEventListener("change", function () { if (!narrow.matches) setDrawer(false); });
  backdrop.addEventListener("click", closeDrawer);
  sidebar.addEventListener("click", function (e) { if (e.target.closest("a")) setDrawer(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar.classList.contains("is-open")) { e.stopPropagation(); closeDrawer(); }
  }, true);

  // ---------- 9. Manage pages: back link and go-to-top ----------
  // A sub page (Manage) gets a back link to its parent section in the top
  // bar. Unsaved changes still trigger the page's own beforeunload prompt.
  var parentNav = NAV.filter(function (item) {
    return item.sub && item.sub.page === currentPage;
  })[0];
  var brand = document.querySelector(".app > .topbar > .brand");
  if (parentNav && brand) {
    brand.insertAdjacentHTML("afterbegin",
      '<a class="btn btn-ghost back-link" href="' + parentNav.href + '" ' +
        'aria-label="Back to ' + parentNav.label + '">' +
        '<span class="btn-icon" aria-hidden="true">←</span>' + parentNav.label + "</a>");
  }

  // A go-to-top button shows after the user scrolls down past a set point.
  var TO_TOP_AFTER_PX = 400;
  if (parentNav) {
    document.body.insertAdjacentHTML("beforeend",
      '<button class="to-top" id="toTopBtn" type="button" aria-label="Go to top" ' +
        'title="Go to top" hidden>↑</button>');
    var toTop = document.getElementById("toTopBtn");
    var toTopFrame = 0;
    var syncToTop = function () {
      toTopFrame = 0;
      toTop.hidden = window.scrollY < TO_TOP_AFTER_PX;
    };
    window.addEventListener("scroll", function () {
      if (!toTopFrame) toTopFrame = requestAnimationFrame(syncToTop);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      // Move focus off the button, which hides at the top.
      var first = document.querySelector(".back-link") || mainEl;
      if (first) first.focus({ preventScroll: true });
    });
    syncToTop();
  }

  // ---------- 5. Pixel scene ----------
  // A decorative background layer: sky, clouds or stars, trees, ground, and
  // walking animals. CSS shows the day set when data-theme is "day" and the
  // night set at other times. Sprites are rows of palette letters ("." is transparent).
  var PAL = {
    o: "#2a1a12", b: "#e8913a", w: "#fff1d6", k: "#1a1010", p: "#ff8fa3",   // shiba
    c: "#f0a050", s: "#c8702a",                                              // ginger cat
    // Tree leaves read CSS tokens, so a season can recolour them (see styles.css).
    g: "var(--leaf)", G: "var(--leaf-lo)", h: "var(--leaf-hi)", O: "var(--leaf-dark)", t: "#7a2e2e", T: "#5a1f22", // day trees
    W: "#ffffff", l: "#dcebfa",                                             // clouds
    H: "var(--pine-hi)", m: "var(--pine)", d: "var(--pine-lo)", n: "var(--pine-dark)" // night pines
  };
  var GREY_CAT = { c: "#9aa0b8", s: "#6c7290", o: "#1c1d2c", w: "#f4f4fa" };
  var BLACK_CAT = { c: "#2c2a3a", s: "#1a1926", o: "#0a0a12", w: "#f4f4fa", k: "#f2d24a" };

  var SHIBA_TOP = [
    "..............o...o...",
    ".............obo.obo..",
    "............obbbbbbbo.",
    "...........obbbbbkbbbo",
    "..o........obbbbbbwwwk",
    ".obo.......obbbbwwwwo.",
    ".obbo......obbbwwwwo..",
    "..obboooooobbbbbwwo...",
    "...obbbbbbbbbbbbbbo...",
    "...obbbbbbbbbbbwwbo...",
    "...obwwwwwwwwbbbbbo...",
    "....obo.obo.obo.obo..."
  ];
  var SHIBA = [
    SHIBA_TOP.concat(["....obo.obo.obo.obo...", "....ooo.ooo.ooo.ooo..."]),
    SHIBA_TOP.concat(["...obo..obo...obo.obo.", "...ooo..ooo...ooo.ooo."])
  ];
  var CAT_TOP = [
    "..............o..o..",
    ".............opoopo.",
    "o...........occcccco",
    "oc..........ockcckco",
    ".oc.........occcpcco",
    ".oc..........occwwo.",
    "..oc.ooooooooccwwo..",
    "..occsccsccscccwwo..",
    "...occcscccsccccco..",
    "...ocwwwwwwwwccco..."
  ];
  var CAT = [
    CAT_TOP.concat(["....oco.oco.oco.oco.", "....ooo.ooo.ooo.ooo."]),
    CAT_TOP.concat(["...oco..oco.oco..oco", "...ooo..ooo.ooo..ooo"])
  ];
  var SIT_CAT_ROWS = [
    "oo....oo....",
    "opo..opo....",
    "occcccco....",
    "EYES........",
    "occppcco....",
    ".occcco.....",
    "occcccco....",
    "occwwcco..o.",
    "ocwwwwco.oco",
    "ocwwwwcooco.",
    "occccccocco.",
    "occccccco...",
    "ocwcocwo....",
    "oooooooo...."
  ];
  var SIT_CAT = [
    SIT_CAT_ROWS.map(function (r) { return r.replace("EYES", "ockcckco"); }),
    SIT_CAT_ROWS.map(function (r) { return r.replace("EYES", "ocsccsco"); })
  ];
  var DAY_TREE = [
    "....OOOO....",
    "..OOhhhgOO..",
    ".OhhhgggggO.",
    ".OhhggggGgO.",
    "OhhgggggGggO",
    "OhggggGgggGO",
    "OgggGggggGgO",
    "OggggggGgggO",
    "OgGgggggggGO",
    "OggggGgggGGO",
    ".OGggggGGGO.",
    ".OGGgGGGGGO.",
    "..OOGGGGOO..",
    "....OOOO....",
    "....OttTO...",
    "....OttTO...",
    "....OttTO...",
    "....OttTO...",
    "...OtttTTO.."
  ];
  var BUSH = [
    "...OOOO.......",
    "..OhhggOOOO...",
    ".OhggggghhgO..",
    "OhgggGgggggGO.",
    "OggGggggGgggGO",
    "OGGGGGGGGGGGGO"
  ];
  var PINE = [
    "......H......",
    ".....HHm.....",
    ".....Hmm.....",
    "....HHmmd....",
    "...HHmmmdd...",
    ".....Hmmd....",
    "....HHmmmd...",
    "...HHmmmmdd..",
    "..HHmmmmmmdd.",
    "....HHmmmd...",
    "...HHmmmmmd..",
    "..HHmmmmmmdd.",
    ".HHmmmmmmmddd",
    "...HHmmmmdd..",
    "..HHmmmmmmdd.",
    ".HHmmmmmmmmdd",
    "HHmmmmmmmmmdd",
    "nnnnnnnnnnnnn",
    ".....nnn.....",
    ".....nnn....."
  ];
  var CLOUD = [
    "........WWWW..............",
    "......WWWWWWWW....WWW.....",
    "....WWWWWWWWWWWWWWWWWWW...",
    "..WWWWWWWWWWWWWWWWWWWWWWW.",
    ".WWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WlWWWWWlWWWWWWWWlWWWWWWlWW",
    ".llllWllllllWlllllllllll..",
    "...llllllllllllllllll....."
  ];

  // Draw a sprite as an inline SVG. Runs of one colour merge into one rect.
  function sprite(rows, scale, pal) {
    var w = 0, rects = "";
    rows.forEach(function (row, y) {
      w = Math.max(w, row.length);
      for (var x = 0; x < row.length;) {
        var ch = row[x], end = x + 1;
        while (end < row.length && row[end] === ch) end++;
        var fill = ch !== "." && ((pal && pal[ch]) || PAL[ch]);
        if (fill) rects += '<rect x="' + x + '" y="' + y + '" width="' + (end - x) + '" height="1" fill="' + fill + '"/>';
        x = end;
      }
    });
    return '<svg width="' + w * scale + '" height="' + rows.length * scale + '" viewBox="0 0 ' + w + " " + rows.length + '">' + rects + "</svg>";
  }

  // Stepped hill line: one column per unit, heights quantised to whole units.
  function hills(seed, base, amp) {
    var cols = 160, h = 40, rects = "";
    for (var x = 0; x < cols; x++) {
      var y = base + amp * (Math.sin(x * 0.11 + seed) * 0.6 + Math.sin(x * 0.037 + seed * 2) * 0.4);
      y = Math.max(1, Math.min(h, Math.round(y)));
      rects += '<rect x="' + x + '" y="' + (h - y) + '" width="1" height="' + y + '"/>';
    }
    return rects;
  }

  // Seeded random, so the stars sit in the same place on every page.
  var seed = 7;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  function place(cls, left, html, extra) {
    return '<div class="' + cls + '" style="left:' + left + (extra || "") + '">' + html + "</div>";
  }
  function critter(frames, scale, pal, cls, style) {
    return '<div class="critter ' + cls + '" style="' + style + '"><div class="critter-body">' +
      sprite(frames[0], scale, pal) + sprite(frames[1], scale, pal) + "</div></div>";
  }

  var stars = "";
  for (var i = 0; i < 70; i++) {
    stars += '<i class="scene-star' + (i % 3 === 0 ? " is-twinkle" : "") + '" style="left:' +
      (rand() * 100).toFixed(2) + "%;top:" + (rand() * 58).toFixed(2) + "%;animation-delay:" +
      (rand() * -2.4).toFixed(2) + 's"></i>';
  }
  var clouds = "";
  [[8, 5, 70, -10], [24, 4, 95, -55], [40, 6, 80, -30], [14, 3, 120, -90]].forEach(function (c) {
    clouds += '<div class="scene-cloud" style="top:' + c[0] + "%;animation-duration:" + c[2] +
      "s;animation-delay:" + c[3] + 's">' + sprite(CLOUD, c[1]) + "</div>";
  });

  // Falling leaves. CSS shows them only in the autumn season.
  var LEAF = [".aa..", "abbaa", "abbba", ".aab.", "...a."];
  var LEAF_PALS = [{ a: "#a8321e", b: "#e0582e" }, { a: "#c8901e", b: "#f5c84a" }, { a: "#b8521a", b: "#f08a3a" }];
  var leaves = "";
  for (var j = 0; j < 10; j++) {
    leaves += '<div class="scene-leaf" style="left:' + (4 + rand() * 92).toFixed(1) + "%;--dur:" +
      (12 + rand() * 10).toFixed(1) + "s;--delay:" + (rand() * -22).toFixed(1) + 's">' +
      sprite(LEAF, 3, LEAF_PALS[j % 3]) + "</div>";
  }

  var L = "calc(var(--scene-left) + ";
  document.body.insertAdjacentHTML("afterbegin",
    '<div class="scene" aria-hidden="true">' +
      '<div class="scene-night">' + stars +
        '<div class="scene-hills"><svg viewBox="0 0 160 40" preserveAspectRatio="none">' +
          '<g fill="var(--hill)">' + hills(1, 26, 10) + "</g>" +
          '<g fill="var(--hill-2)">' + hills(4, 14, 6) + "</g></svg></div>" +
        place("scene-tree", L + "1%)", sprite(PINE, 5)) +
        place("scene-tree is-ginkgo", L + "7%)", sprite(PINE, 7)) +
        place("scene-tree is-optional", L + "14%)", sprite(PINE, 4)) +
        place("scene-tree is-optional is-ginkgo", "78%", sprite(PINE, 5)) +
        place("scene-tree", "86%", sprite(PINE, 8)) +
        place("scene-tree is-optional", "94%", sprite(PINE, 4)) +
      "</div>" +
      '<div class="scene-day">' + clouds +
        '<div class="scene-hills"><svg viewBox="0 0 160 40" preserveAspectRatio="none">' +
          '<g fill="var(--hill)">' + hills(2, 18, 8) + "</g>" +
          '<g fill="var(--hill-2)">' + hills(5, 9, 4) + "</g></svg></div>" +
        place("scene-tree", L + "0%)", sprite(BUSH, 4)) +
        place("scene-tree", L + "4%)", sprite(DAY_TREE, 5)) +
        place("scene-tree is-optional is-ginkgo", L + "10%)", sprite(DAY_TREE, 6)) +
        place("scene-tree is-optional", L + "15%)", sprite(BUSH, 3)) +
        place("scene-tree is-optional", "74%", sprite(BUSH, 4)) +
        place("scene-tree is-ginkgo", "88%", sprite(DAY_TREE, 6)) +
      "</div>" +
      leaves +
      '<div class="scene-ground"></div>' +
    "</div>" +
    // The animals walk in a second layer in front of the page. It ignores
    // pointer events, so the buttons under it still take clicks and taps.
    '<div class="scene scene-front" aria-hidden="true">' +
      critter(SIT_CAT, 3, GREY_CAT, "is-sitting", "--x:82%") +
      critter(SHIBA, 3, null, "", "--dur:34s;--delay:-6s") +
      critter(CAT, 3, BLACK_CAT, "", "--dur:34s;--delay:-3.4s") +
      critter(CAT, 3, null, "is-left", "--dur:44s;--delay:-24s") +
    "</div>");

  // ---------- 6. Time-of-day theme ----------
  // The head script of each page sets data-theme from the hour at load. This
  // part keeps it current while the page stays open. When the hour crosses
  // 06:00 or 18:00 in a visible tab, the colours and scene fade over
  // --theme-fade (90s in styles.css). In a hidden tab the switch is instant.
  var themeRoot = document.documentElement;
  var THEME_COLOR = {
    meadow: { day: "#7fbcd6", night: "#0b1a24" },
    autumn: { day: "#9fc3dc", night: "#1a1220" },
    light: { day: "#eef0f2", night: "#eef0f2" },
    dark: { day: "#121417", night: "#121417" }
  };
  function seasonNow() {
    var s = themeRoot.dataset.season;
    return THEME_COLOR.hasOwnProperty(s) ? s : "meadow";
  }
  function setThemeColor() {
    var c = THEME_COLOR[seasonNow()][themeRoot.dataset.theme === "day" ? "day" : "night"];
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.content = c; });
  }
  var FADE_MS = 90000;
  var fadeTimer = 0;
  function themeForNow() {
    // The plain Light and Dark themes ignore the hour.
    if (seasonNow() === "light") return "day";
    if (seasonNow() === "dark") return "night";
    var h = new Date().getHours();
    return h >= 6 && h < 18 ? "day" : "night";
  }
  function applyTheme(fade) {
    var theme = themeForNow();
    if (themeRoot.dataset.theme !== theme) {
      if (fade) {
        themeRoot.classList.add("theme-fading");
        clearTimeout(fadeTimer);
        fadeTimer = setTimeout(function () { themeRoot.classList.remove("theme-fading"); }, FADE_MS + 1000);
      }
      themeRoot.dataset.theme = theme;
    }
    setThemeColor();
  }
  applyTheme(false);
  setInterval(function () { applyTheme(!document.hidden); }, 30000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) applyTheme(true); });

  // ---------- 7. Season picker ----------
  // The head script of each page sets data-season from localStorage before
  // the first paint. The sidebar buttons change it with a short colour fade
  // and remember the choice in this browser.
  var SEASON_KEY = "tsumiki.season";
  var seasonBtns = document.querySelectorAll(".season-seg .seg-btn");
  function markSeason() {
    var season = seasonNow();
    seasonBtns.forEach(function (b) {
      var on = b.dataset.season === season;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  seasonBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.dataset.season === seasonNow()) return;
      themeRoot.style.setProperty("--theme-fade", "0.6s");
      themeRoot.classList.add("theme-fading");
      themeRoot.dataset.season = b.dataset.season;
      themeRoot.dataset.theme = themeForNow();
      try { localStorage.setItem(SEASON_KEY, b.dataset.season); } catch (e) {}
      markSeason();
      setThemeColor();
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(function () {
        themeRoot.classList.remove("theme-fading");
        themeRoot.style.removeProperty("--theme-fade");
      }, 700);
    });
  });
  markSeason();

  // ---------- 8. Accessibility ----------
  // a. A skip link to the page's <main>, first in the tab order.
  var mainEl = document.querySelector("main");
  if (mainEl) {
    if (!mainEl.id) mainEl.id = "main";
    mainEl.setAttribute("tabindex", "-1");
    document.body.insertAdjacentHTML("afterbegin",
      '<a class="skip-link" href="#' + mainEl.id + '">Skip to content</a>');
  }

  // b. A polite live region. Pages call self.tsumikiAnnounce("…") to have a
  // screen reader speak a result. Messages sent in one burst join into one.
  var live = document.createElement("div");
  live.className = "sr-only";
  live.setAttribute("aria-live", "polite");
  live.setAttribute("role", "status");
  document.body.appendChild(live);
  var livePending = [], liveTimer = 0;
  function announce(msg) {
    if (!msg) return;
    var key = typeof msg === "string" ? msg : msg.textContent;
    if (livePending.some(function (p) { return (typeof p === "string" ? p : p.textContent) === key; })) return;
    livePending.push(msg);
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () {
      live.textContent = "";
      var parts = livePending.splice(0);
      // A new text node after a clear makes screen readers speak repeats too.
      setTimeout(function () {
        parts.forEach(function (p) {
          var span = document.createElement("span");
          if (typeof p === "string") span.textContent = p + " ";
          else span.appendChild(p);
          live.appendChild(span);
        });
      }, 30);
    }, 60);
  }
  self.tsumikiAnnounce = announce;

  // c. Mark Japanese text with lang="ja", so a screen reader uses a Japanese
  // voice. An element gets it when kana or kanji make up most of its own text.
  var JA = /[぀-ヿ㐀-鿿ｦ-ﾟ]/g;
  function ownText(node) {
    var t = "";
    for (var c = node.firstChild; c; c = c.nextSibling) if (c.nodeType === 3) t += c.data;
    return t.replace(/[\s\d.,!?()\[\]「」『』。、・…〜~:;\/\-–—'"“”]+/g, "");
  }
  function tagLang(el) {
    if (el.nodeType !== 1 || el.hasAttribute("lang") || /^(SCRIPT|STYLE|svg)$/.test(el.nodeName)) return;
    var t = ownText(el);
    if (t && (t.match(JA) || []).length * 2 >= t.length) el.setAttribute("lang", "ja");
  }
  function tagTree(root) {
    if (root.nodeType !== 1 || root.closest(".scene")) return;
    tagLang(root);
    root.querySelectorAll("*").forEach(tagLang);
  }
  var langQueue = new Set(), langFrame = 0;
  function queueLang(node) {
    langQueue.add(node.nodeType === 3 ? node.parentNode : node);
    if (!langFrame) langFrame = requestAnimationFrame(function () {
      langFrame = 0;
      langQueue.forEach(function (n) {
        // Text that changed in place may no longer be Japanese.
        if (n && n.nodeType === 1 && n.getAttribute("lang") === "ja" && !ownText(n).match(JA)) n.removeAttribute("lang");
        if (n) tagTree(n);
      });
      langQueue.clear();
    });
  }
  tagTree(document.body);
  new MutationObserver(function (list) {
    list.forEach(function (m) {
      if (m.type === "characterData") queueLang(m.target);
      else {
        queueLang(m.target);
        m.addedNodes.forEach(queueLang);
      }
    });
  }).observe(document.body, { subtree: true, childList: true, characterData: true });

  // d. Flashcards: hide the face that is turned away, let the card take
  // focus, and speak the new face when it flips or a new card shows.
  document.querySelectorAll(".card").forEach(function (card) {
    var front = card.querySelector(".card-front");
    var back = card.querySelector(".card-back");
    if (!front || !back) return;
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-roledescription", "flashcard");
    function faceText(face) {
      var center = face.querySelector(".card-center") || face;
      var copy = center.cloneNode(true);
      copy.querySelectorAll("button, [hidden], [aria-hidden='true']").forEach(function (n) { n.remove(); });
      return copy;
    }
    var flipped = card.classList.contains("is-flipped");
    function sync(speak) {
      var now = card.classList.contains("is-flipped");
      front.setAttribute("aria-hidden", now ? "true" : "false");
      back.setAttribute("aria-hidden", now ? "false" : "true");
      if (speak) announce(faceText(now ? back : front));
    }
    sync(false);
    new MutationObserver(function () {
      var now = card.classList.contains("is-flipped");
      if (now !== flipped) { flipped = now; sync(true); }
    }).observe(card, { attributes: true, attributeFilter: ["class"] });
    // A new card: the front word text changes while the front shows.
    var word = front.querySelector(".word-display");
    var lastWord = word ? word.textContent : "";
    if (word) new MutationObserver(function () {
      if (word.textContent === lastWord) return;
      lastWord = word.textContent;
      if (!card.classList.contains("is-flipped")) sync(true);
    }).observe(word, { subtree: true, childList: true, characterData: true });
  });

  // ---------- 4. Force Update ----------
  function withTimeout(promise, ms) {
    return Promise.race([promise, new Promise(function (resolve) { setTimeout(resolve, ms); })]);
  }

  var updating = false;
  function forceUpdate() {
    if (updating) return;
    updating = true;
    var btn = document.getElementById("updateBtn");
    if (btn) {
      btn.disabled = true;
      var label = btn.querySelector(".update-label");
      if (label) label.textContent = "Updating…";
    }

    var target = new URL(location.href);
    target.searchParams.set("_v", Date.now());
    var go = function () { location.replace(target.href); };
    // Hard fallback: navigate no matter what, even if a browser API hangs.
    var fallback = setTimeout(go, 8000);

    var unregister = ("serviceWorker" in navigator)
      ? navigator.serviceWorker.getRegistrations().then(function (regs) {
          return Promise.all(regs.map(function (r) { return r.unregister(); }));
        })
      : Promise.resolve();

    // Re-fetch every asset past the HTTP cache so the reload cannot pick up a
    // stale styles.css / *.js. Done before the cache wipe: while the old worker
    // still controls this page, it may write these into its cache, and the
    // wipe below removes that again.
    var refresh = function () {
      var urls = APP_ASSETS.concat([location.pathname]);
      return Promise.all(urls.map(function (u) {
        return fetch(u, { cache: "reload" }).catch(function () {});
      }));
    };

    var wipe = function () {
      if (!window.caches) return Promise.resolve();
      return caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
      });
    };

    withTimeout(unregister.catch(function () {}), 3000)
      .then(function () { return withTimeout(refresh(), 4000); })
      .then(function () { return withTimeout(wipe().catch(function () {}), 3000); })
      .catch(function () { /* ignore — reload anyway */ })
      .then(function () { clearTimeout(fallback); go(); });
  }
  self.forceUpdate = forceUpdate;
  document.getElementById("updateBtn").addEventListener("click", forceUpdate);

  // ---------- 2. Service worker + toast ----------
  var toast = document.getElementById("updateToast");
  var toastMsg = toast && toast.querySelector(".update-toast-msg");
  var toastBtn = document.getElementById("updateToastRefresh");
  var toastDismiss = document.getElementById("updateToastDismiss");
  // "reload": a new worker already took over, a plain reload picks it up.
  // "force":  the server has a newer version than this bundle — Force Update.
  var toastMode = "reload";
  var toastDismissedFor = null;

  function showToast(mode, msg, btnText) {
    if (!toast) return;
    toastMode = mode;
    if (toastMsg) toastMsg.textContent = msg;
    if (toastBtn) toastBtn.textContent = btnText;
    toast.hidden = false;
  }
  if (toastBtn) toastBtn.addEventListener("click", function () {
    if (toastMode === "force") forceUpdate(); else location.reload();
  });
  if (toastDismiss) toastDismiss.addEventListener("click", function () {
    if (toastMode === "force") toastDismissedFor = latestSeen;
    toast.hidden = true;
  });

  var swReg = null;
  if ("serviceWorker" in navigator) {
    var swHadController = !!navigator.serviceWorker.controller;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").then(function (reg) { swReg = reg; }).catch(function () {});
    });
    // Fires once on this page's very first-ever activation (not a real
    // update — skip it) and again every time a newer worker takes over.
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (!swHadController) { swHadController = true; return; }
      if (!updating) showToast("reload", "New version available", "Refresh");
    });
  }

  // ---------- 3. Version check ----------
  var latestSeen = null;

  function markOutdated(latest) {
    latestSeen = latest;
    var hint = "New version v" + latest + " is available. You have v" + APP_VERSION + ". Tap Force Update.";
    var btn = document.getElementById("updateBtn");
    btn.classList.add("has-update");
    btn.title = hint;
    toggle.classList.add("has-update");
    toggle.title = hint;
    var ver = document.getElementById("sidebarVersion");
    ver.textContent = "v" + APP_VERSION + " → v" + latest;
    ver.classList.add("is-outdated");
    if (toastDismissedFor !== latest) {
      showToast("force", "Version v" + latest + " is available", "Force Update");
    }
  }

  function checkVersion() {
    if (updating || !navigator.onLine) return;
    fetch("version.js?check=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (text) {
        var m = /APP_VERSION\s*=\s*["']([^"']+)["']/.exec(text);
        if (m && m[1] !== APP_VERSION) {
          markOutdated(m[1]);
          // Also nudge the worker; standalone PWAs (iOS especially) do not
          // reliably re-check sw.js on their own.
          if (swReg) swReg.update().catch(function () {});
        }
      })
      .catch(function () { /* offline — stay quiet */ });
  }

  window.addEventListener("load", checkVersion);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState !== "visible") return;
    if (swReg) swReg.update().catch(function () {});
    checkVersion();
  });
  setInterval(checkVersion, CHECK_INTERVAL_MS);
})();
