/* ============================================================
   OKTAN — flydende, iriserende benzin (WebGL)
   Et fuldskærms-fragmentshader-felt: domæne-warpet FBM-støj giver
   en flydende væske; oliefilm-bånd giver iriserende benzin-skær.
   Reagerer på mus/touch. Falder elegant tilbage til CSS-gradient.
   ============================================================ */
(function () {
  "use strict";

  var canvas = document.getElementById("fuel");
  if (!canvas) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var gl = null;
  try {
    var opts = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" };
    gl = canvas.getContext("webgl", opts) || canvas.getContext("experimental-webgl", opts);
  } catch (e) { gl = null; }

  // Ingen WebGL → behold CSS-gradient-fallbacken (canvas er gennemsigtig).
  if (!gl) return;

  /* ---------- Shaders ---------- */
  var VERT = [
    "attribute vec2 a_pos;",
    "varying vec2 v_uv;",
    "void main(){ v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }"
  ].join("\n");

  var FRAG = [
    "precision highp float;",
    "uniform vec2  u_res;",
    "uniform float u_time;",
    "uniform vec2  u_mouse;",  // normaliseret 0..1, y opad
    "uniform float u_mamt;",   // 0..1 musens indflydelse
    "varying vec2  v_uv;",

    "float hash(vec2 p){",
    "  p = fract(p * vec2(123.34, 456.21));",
    "  p += dot(p, p + 45.32);",
    "  return fract(p.x * p.y);",
    "}",

    "float vnoise(vec2 p){",
    "  vec2 i = floor(p), f = fract(p);",
    "  float a = hash(i);",
    "  float b = hash(i + vec2(1.0, 0.0));",
    "  float c = hash(i + vec2(0.0, 1.0));",
    "  float d = hash(i + vec2(1.0, 1.0));",
    "  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);",
    "  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);",
    "}",

    "float fbm(vec2 p){",
    "  float s = 0.0, a = 0.5;",
    "  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);",
    "  for(int i = 0; i < 5; i++){ s += a * vnoise(p); p = m * p; a *= 0.5; }",
    "  return s;",
    "}",

    // IQ cosine-palette
    "vec3 pal(float t, vec3 a, vec3 b, vec3 c, vec3 d){",
    "  return a + b * cos(6.28318 * (c * t + d));",
    "}",

    "void main(){",
    "  vec2 uv = v_uv;",
    "  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;",
    "  float tm = u_time * 0.03;",

    // domæne-warp i to lag → flydende væske
    "  vec2 q = vec2( fbm(p * 1.5 + vec2(0.0, tm)),",
    "                 fbm(p * 1.5 + vec2(5.2, 1.3) - tm * 0.8) );",
    "  vec2 r = vec2( fbm(p * 1.5 + 3.0 * q + vec2(1.7, 9.2) + tm * 0.6),",
    "                 fbm(p * 1.5 + 3.0 * q + vec2(8.3, 2.8) - tm * 0.5) );",
    "  float f = fbm(p * 1.5 + 3.5 * r);",

    // mus: blød rippel + opvarmning
    "  vec2 mp = (u_mouse * u_res - 0.5 * u_res) / u_res.y;",
    "  float md = length(p - mp);",
    "  float ripple = 0.10 * sin(md * 13.0 - u_time * 1.6) * exp(-md * 2.4) * u_mamt;",
    "  f += ripple;",
    "  float mh = exp(-md * 1.7) * u_mamt;",

    // benzin-palet: domineret af neongrøn, dyb og rolig
    "  vec3 neon = vec3(0.62, 1.0, 0.05);",
    "  float h = smoothstep(0.10, 1.0, f);",

    // dyb, næsten sort base
    "  vec3 col = vec3(0.011, 0.016, 0.013);",
    // blødt grønt korpus
    "  col += vec3(0.05, 0.14, 0.018) * h * 1.15;",
    // dybt smaragd/teal i mellemtonerne
    "  col += vec3(0.0, 0.085, 0.072) * smoothstep(0.30, 0.78, f) * (0.40 + 0.60 * q.x);",
    // sparsomme, bløde neon-højlys
    "  col += neon * smoothstep(0.80, 1.05, f) * 0.40;",

    // tynde, iriserende oliefilm-striber (subtile og glatte)
    "  float band = sin((f * 7.0 + length(q) * 3.0) * 3.14159);",
    "  float sheen = smoothstep(0.90, 1.0, abs(band));",
    "  vec3 irid = pal(f * 1.4 + 0.07 * u_time, vec3(0.5), vec3(0.42), vec3(1.0), vec3(0.0, 0.33, 0.66));",
    "  col += irid * sheen * 0.13;",

    // mus-varme
    "  col += neon * mh * 0.09;",

    // tonemap + gamma
    "  col = col / (col + 0.80);",
    "  col = pow(max(col, 0.0), vec3(0.97));",

    // blød vignet
    "  float vig = 1.0 - 0.86 * pow(length(uv - 0.5) * 1.12, 2.2);",
    "  col *= clamp(vig, 0.0, 1.0);",

    // fint filmkorn
    "  col += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.022;",

    "  gl_FragColor = vec4(max(col, 0.0), 1.0);",
    "}"
  ].join("\n");

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return; // fald tilbage til CSS

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  // Fuldskærms-trekant
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, "u_res");
  var uTime = gl.getUniformLocation(prog, "u_time");
  var uMouse = gl.getUniformLocation(prog, "u_mouse");
  var uMamt = gl.getUniformLocation(prog, "u_mamt");

  /* ---------- State ---------- */
  var W = 0, H = 0;
  // Blød væske → render i lav opløsning og lad CSS opskalere.
  var SCALE = Math.min(window.innerWidth, window.innerHeight) < 720 ? 0.45 : 0.6;
  var mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, amt: 0, tamt: 0 };
  var t0 = 0, raf = null, running = false;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    var bw = Math.max(2, Math.floor(W * SCALE));
    var bh = Math.max(2, Math.floor(H * SCALE));
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    gl.viewport(0, 0, bw, bh);
    gl.uniform2f(uRes, bw, bh);
  }

  function frame(now) {
    if (!t0) t0 = now;
    var time = (now - t0) * 0.001;

    // blød forfølgelse af mus
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    mouse.amt += (mouse.tamt - mouse.amt) * 0.05;

    gl.uniform1f(uTime, time);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uMamt, mouse.amt);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    t0 = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  /* ---------- Events ---------- */
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  window.addEventListener("pointermove", function (e) {
    mouse.tx = e.clientX / W;
    mouse.ty = 1 - e.clientY / H;
    mouse.tamt = 1;
  }, { passive: true });
  window.addEventListener("pointerout", function () { mouse.tamt = 0; });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else if (!reduce) start();
  });

  // Genskab ved context-loss
  canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); stop(); }, false);

  resize();

  if (reduce) {
    // Tegn ét roligt billede og bliv stående.
    gl.uniform1f(uTime, 12.0);
    gl.uniform2f(uMouse, 0.5, 0.5);
    gl.uniform1f(uMamt, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  } else {
    start();
    // Spar GPU: kør kun mens scenen er synlig
    var stage = document.querySelector(".stage");
    if (stage && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { if (!document.hidden) start(); }
        else stop();
      }, { threshold: 0 }).observe(stage);
    }
  }
})();
