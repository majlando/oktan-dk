/* ============================================================
   OKTAN — sætter årstal i footer. Resten er ren CSS + WebGL.
   ============================================================ */
(function () {
  "use strict";
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
