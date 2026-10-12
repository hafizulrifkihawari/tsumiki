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
      '<a class="sidebar-brand" href="index.html">' +
        '<span class="sidebar-logo">積み木</span>' +
        '<span class="sidebar-name">Tsumiki<small>Japanese, block by block</small></span>' +
      "</a>" +
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

  toggle.addEventListener("click", function () { setDrawer(!sidebar.classList.contains("is-open")); });
  backdrop.addEventListener("click", closeDrawer);
  sidebar.addEventListener("click", function (e) { if (e.target.closest("a")) setDrawer(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar.classList.contains("is-open")) { e.stopPropagation(); closeDrawer(); }
  }, true);

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
