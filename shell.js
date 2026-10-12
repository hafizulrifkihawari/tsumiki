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

  // ---------- 5. Pixel scene ----------
  // A decorative background layer: sky, clouds or stars, trees, ground, and
  // walking animals. CSS shows the day set in light mode and the night set in
  // dark mode. Sprites are rows of palette letters ("." is transparent).
  var PAL = {
    o: "#2a1a12", b: "#e8913a", w: "#fff1d6", k: "#1a1010", p: "#ff8fa3",   // shiba
    c: "#f0a050", s: "#c8702a",                                              // ginger cat
    g: "#6cc644", G: "#4a9c2c", h: "#9be34f", O: "#1f4a1a", t: "#7a2e2e", T: "#5a1f22", // day trees
    W: "#ffffff", l: "#dcebfa",                                             // clouds
    H: "#b8fff0", m: "#3fbfa8", d: "#1d6f6a", n: "#0f3a48"                   // night pines
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

  var L = "calc(var(--scene-left) + ";
  document.body.insertAdjacentHTML("afterbegin",
    '<div class="scene" aria-hidden="true">' +
      '<div class="scene-night">' + stars +
        '<div class="scene-hills"><svg viewBox="0 0 160 40" preserveAspectRatio="none">' +
          '<g fill="var(--hill)">' + hills(1, 26, 10) + "</g>" +
          '<g fill="var(--hill-2)">' + hills(4, 14, 6) + "</g></svg></div>" +
        place("scene-tree", L + "1%)", sprite(PINE, 5)) +
        place("scene-tree", L + "7%)", sprite(PINE, 7)) +
        place("scene-tree is-optional", L + "14%)", sprite(PINE, 4)) +
        place("scene-tree is-optional", "78%", sprite(PINE, 5)) +
        place("scene-tree", "86%", sprite(PINE, 8)) +
        place("scene-tree is-optional", "94%", sprite(PINE, 4)) +
      "</div>" +
      '<div class="scene-day">' + clouds +
        '<div class="scene-hills"><svg viewBox="0 0 160 40" preserveAspectRatio="none">' +
          '<g fill="var(--hill)">' + hills(2, 18, 8) + "</g>" +
          '<g fill="var(--hill-2)">' + hills(5, 9, 4) + "</g></svg></div>" +
        place("scene-tree", L + "0%)", sprite(BUSH, 4)) +
        place("scene-tree", L + "4%)", sprite(DAY_TREE, 5)) +
        place("scene-tree is-optional", L + "10%)", sprite(DAY_TREE, 6)) +
        place("scene-tree is-optional", L + "15%)", sprite(BUSH, 3)) +
        place("scene-tree is-optional", "74%", sprite(BUSH, 4)) +
        place("scene-tree", "88%", sprite(DAY_TREE, 6)) +
      "</div>" +
      '<div class="scene-ground"></div>' +
      critter(SIT_CAT, 3, GREY_CAT, "is-sitting", "--x:82%") +
      critter(SHIBA, 3, null, "", "--dur:34s;--delay:-6s") +
      critter(CAT, 3, BLACK_CAT, "", "--dur:34s;--delay:-3.4s") +
      critter(CAT, 3, null, "is-left", "--dur:44s;--delay:-24s") +
    "</div>");

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
