/* ============================================================
   OKTAN — placerer benzin-OKTAN'et præcist oven på den
   (gennemsigtige) overskrift, så bogstaverne viser den levende
   benzin bagved. Synker ved load, fonts-ready og resize.
   ============================================================ */
(function () {
  "use strict";

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  var word = document.querySelector(".word");
  var cut  = document.getElementById("okCut");
  var glow = document.getElementById("okGlow");
  if (!word || !cut || !glow) return;

  var VOFFSET = 0.045; // fin-justering: løft caps en anelse mod optisk midte

  function sync() {
    var r = word.getBoundingClientRect();
    var cs = getComputedStyle(word);
    var fs = parseFloat(cs.fontSize) || 0;
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2 - fs * VOFFSET;
    var ls = (cs.letterSpacing === "normal") ? "0px" : cs.letterSpacing;
    [cut, glow].forEach(function (t) {
      t.setAttribute("x", cx.toFixed(1));
      t.setAttribute("y", cy.toFixed(1));
      t.style.fontSize = cs.fontSize;
      t.style.letterSpacing = ls;
    });
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; sync(); });
  }

  schedule();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("orientationchange", schedule);
  // ekstra syncs hvis fonts/layout falder sent på plads
  setTimeout(sync, 400);
  setTimeout(sync, 1300);
})();
