/* ================================================================
   HARIHARAN R — PORTFOLIO  |  intro.js
   Film-countdown intro animation + periodic logo shine effect
================================================================ */

(function () {
  'use strict';

  /* ── Inject all required CSS ─────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = `
    /* ── INTRO OVERLAY ───────────────────────────────────────── */
    #portfolio-intro {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #050608;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      transition: opacity 0.9s ease, visibility 0.9s ease;
    }
    #portfolio-intro.ci-hiding {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    /* Canvas starfield */
    #ci-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    /* Film grain */
    #ci-grain {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
      background-size: 180px 180px;
      opacity: 0.07;
      pointer-events: none;
      animation: ciGrainShift 0.12s steps(1) infinite;
    }
    @keyframes ciGrainShift {
      0%   { background-position: 0 0; }
      25%  { background-position: 40px -20px; }
      50%  { background-position: -30px 15px; }
      75%  { background-position: 20px 40px; }
      100% { background-position: -15px -35px; }
    }

    /* Scanlines */
    #ci-scanlines {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0px,
        transparent 3px,
        rgba(0,0,0,0.13) 3px,
        rgba(0,0,0,0.13) 4px
      );
      pointer-events: none;
    }

    /* Letterbox bars */
    #ci-bar-t, #ci-bar-b {
      position: absolute;
      left: 0; right: 0;
      height: 0;
      background: #000;
      transition: height 0.7s cubic-bezier(0.22, 1, 0.36, 1);
      z-index: 2;
    }
    #ci-bar-t { top: 0; }
    #ci-bar-b { bottom: 0; }
    #portfolio-intro.ci-letterbox #ci-bar-t,
    #portfolio-intro.ci-letterbox #ci-bar-b { height: 60px; }

    /* HUD labels */
    .ci-hud {
      position: absolute;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 0.68rem;
      letter-spacing: 0.12em;
      color: rgba(232,197,71,0.55);
      text-transform: uppercase;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.5s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      user-select: none;
    }
    #portfolio-intro.ci-letterbox .ci-hud { opacity: 1; }
    .ci-hud-tl { top: 18px; left: 18px; }
    .ci-hud-tr { top: 18px; right: 18px; }
    .ci-hud-bl { bottom: 18px; left: 18px; }
    .ci-hud-br { bottom: 18px; right: 18px; }
    .ci-hud-sep { opacity: 0.35; }
    .ci-rec {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #e74c3c;
      animation: ciRecBlink 1s step-end infinite;
      flex-shrink: 0;
    }
    @keyframes ciRecBlink { 0%,100%{opacity:1} 50%{opacity:0.1} }

    /* Corner brackets */
    .ci-corner {
      position: absolute;
      width: 50px; height: 50px;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    #portfolio-intro.ci-letterbox .ci-corner { opacity: 1; }
    .ci-corner.tl { top: 8px; left: 8px; }
    .ci-corner.tr { top: 8px; right: 8px; }
    .ci-corner.bl { bottom: 8px; left: 8px; }
    .ci-corner.br { bottom: 8px; right: 8px; }

    /* Center content */
    #ci-center {
      position: relative;
      z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.4rem;
      opacity: 0;
      transform: translateY(18px) scale(0.97);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    #portfolio-intro.ci-show-title #ci-center {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    /* Logo ring */
    #ci-logo-wrap {
      position: relative;
      width: 110px;
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #ci-logo-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1.5px solid rgba(232,197,71,0.35);
      animation: ciRingRotate 8s linear infinite;
    }
    #ci-logo-ring::before {
      content: '';
      position: absolute;
      top: -3px; left: 50%;
      width: 6px; height: 6px;
      background: rgba(232,197,71,0.9);
      border-radius: 50%;
      transform: translateX(-50%);
      box-shadow: 0 0 8px rgba(232,197,71,0.8);
    }
    #ci-logo-ring2 {
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      border: 1px solid rgba(232,197,71,0.15);
      animation: ciRingRotate 5s linear infinite reverse;
    }
    @keyframes ciRingRotate { to { transform: rotate(360deg); } }
    #ci-logo-inner {
      position: relative;
      width: 80px; height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Title text */
    #ci-title {
      text-align: center;
    }
    .ci-director-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: rgba(232,197,71,0.5);
      margin-bottom: 0.7rem;
    }
    .ci-name-wrap {
      overflow: hidden;
      line-height: 1;
    }
    .ci-name-line {
      display: block;
      font-family: 'Playfair Display', 'Georgia', serif;
      font-size: clamp(2.2rem, 6vw, 4rem);
      font-weight: 900;
      color: #f5f5f0;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transform: translateY(100%);
      transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .ci-name-wrap.sub .ci-name-line {
      font-size: clamp(1rem, 2.5vw, 1.5rem);
      font-weight: 700;
      letter-spacing: 0.22em;
      color: rgba(245,245,240,0.7);
    }
    .ci-name-line.gold { color: #e8c547; }
    #portfolio-intro.ci-show-title .ci-name-line {
      transform: translateY(0);
    }
    .ci-name-wrap.sub .ci-name-line {
      transition-delay: 0.12s;
    }
    .ci-divider {
      width: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(232,197,71,0.6), transparent);
      margin: 1rem auto;
      transition: width 0.6s ease 0.35s;
    }
    #portfolio-intro.ci-show-title .ci-divider { width: 200px; }
    .ci-tagline {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(232,197,71,0.5);
      opacity: 0;
      transition: opacity 0.5s ease 0.5s;
    }
    #portfolio-intro.ci-show-title .ci-tagline { opacity: 1; }

    /* Loader bar */
    #ci-loader {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      width: min(340px, 80vw);
      z-index: 20;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    #portfolio-intro.ci-show-title #ci-loader { opacity: 1; }
    #ci-loader-label {
      display: flex;
      justify-content: space-between;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.62rem;
      letter-spacing: 0.1em;
      color: rgba(232,197,71,0.45);
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    #ci-loader-track {
      height: 2px;
      background: rgba(232,197,71,0.12);
      border-radius: 2px;
      overflow: hidden;
    }
    #ci-loader-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, rgba(232,197,71,0.3), #e8c547);
      border-radius: 2px;
      transition: width 0.3s ease;
      box-shadow: 0 0 8px rgba(232,197,71,0.5);
    }

    /* Skip hint */
    #ci-skip {
      position: absolute;
      bottom: 55px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.58rem;
      letter-spacing: 0.15em;
      color: rgba(255,255,255,0.2);
      text-transform: uppercase;
      z-index: 20;
      white-space: nowrap;
      animation: ciSkipPulse 2.5s ease-in-out infinite;
    }
    @keyframes ciSkipPulse {
      0%,100%{opacity:0.4} 50%{opacity:0.9}
    }

    /* ── LOGO SHINE ANIMATION ────────────────────────────────── */
    @keyframes logoShineSwipe {
      0%   { background-position: -250% center; }
      100% { background-position: 350% center; }
    }
    .logo-shine-active {
      position: relative;
      overflow: hidden;
    }
    .logo-shine-active::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        105deg,
        transparent 30%,
        rgba(232,197,71,0.55) 50%,
        rgba(255,255,220,0.7) 55%,
        rgba(232,197,71,0.45) 60%,
        transparent 70%
      );
      background-size: 250% 100%;
      background-position: -250% center;
      animation: logoShineSwipe 0.7s ease forwards;
      pointer-events: none;
      border-radius: inherit;
      z-index: 5;
    }

    /* ── RING SHINE (for ci-logo-ring) ──────────────────────── */
    @keyframes ringGlow {
      0%,100% { box-shadow: 0 0 4px rgba(232,197,71,0.2), 0 0 12px rgba(232,197,71,0.1); border-color: rgba(232,197,71,0.35); }
      50%     { box-shadow: 0 0 18px rgba(232,197,71,0.9), 0 0 35px rgba(232,197,71,0.5); border-color: rgba(232,197,71,0.9); }
    }
    .ring-glow-active {
      animation: ciRingRotate 8s linear infinite, ringGlow 0.8s ease !important;
    }
  `;
  document.head.appendChild(style);

  /* ── Helpers ─────────────────────────────────────────────── */
  var intro = document.getElementById('portfolio-intro');
  if (!intro) return;

  function skipIntro() {
    intro.classList.add('ci-hiding');
    document.body.style.overflow = '';
    setTimeout(function () {
      intro.style.display = 'none';
    }, 950);
  }

  /* ── Block body scroll during intro ─────────────────────── */
  document.body.style.overflow = 'hidden';

  /* ── Canvas starfield ────────────────────────────────────── */
  var canvas = document.getElementById('ci-canvas');
  var ctx    = canvas ? canvas.getContext('2d') : null;
  var stars  = [];

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  for (var s = 0; s < 160; s++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
      dir: Math.random() > 0.5 ? 1 : -1
    });
  }

  var rafId;
  function drawStars() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function (st) {
      st.a += st.speed * st.dir;
      if (st.a > 1 || st.a < 0.05) st.dir *= -1;
      ctx.beginPath();
      ctx.arc(st.x * canvas.width, st.y * canvas.height, st.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + st.a.toFixed(2) + ')';
      ctx.fill();
    });
    rafId = requestAnimationFrame(drawStars);
  }
  drawStars();

  /* ── Populate name from DATA if available ─────────────────── */
  var n1 = document.getElementById('ci-n1');
  var n2 = document.getElementById('ci-n2');
  if (n1) n1.textContent = (typeof DATA !== 'undefined' && DATA.name) ? DATA.name.split(' ')[0].toUpperCase() : 'HARIHARAN';
  if (n2) n2.textContent = (typeof DATA !== 'undefined' && DATA.name) ? DATA.name.split(' ').slice(1).join(' ').toUpperCase() || 'EDITZ' : 'EDITZ';

  /* ── Animation sequence ──────────────────────────────────── */
  var loadMessages = [
    'Initializing Portfolio',
    'Loading Assets',
    'Calibrating Colors',
    'Preparing Timeline',
    'Rendering Frames',
    'Almost There'
  ];

  var loaderStatus = document.getElementById('ci-loader-status');
  var loaderPct    = document.getElementById('ci-loader-pct');
  var loaderFill   = document.getElementById('ci-loader-fill');

  var totalDuration = 4200; // ms total before auto-close
  var startTime;

  function updateLoader(elapsed) {
    var pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
    if (loaderFill) loaderFill.style.width = pct + '%';
    if (loaderPct)  loaderPct.textContent  = pct + '%';
    var msgIdx = Math.min(loadMessages.length - 1, Math.floor((pct / 100) * loadMessages.length));
    if (loaderStatus) loaderStatus.textContent = loadMessages[msgIdx];
  }

  function runLoader(ts) {
    if (!startTime) startTime = ts;
    var elapsed = ts - startTime;
    updateLoader(elapsed);
    if (elapsed < totalDuration) {
      requestAnimationFrame(runLoader);
    } else {
      updateLoader(totalDuration);
      setTimeout(skipIntro, 300);
    }
  }

  /* ── Step 1: letterbox + HUD (instant) ──────────────────── */
  setTimeout(function () {
    intro.classList.add('ci-letterbox');
  }, 80);

  /* ── Step 2: show title + start loader ──────────────────── */
  setTimeout(function () {
    intro.classList.add('ci-show-title');
    requestAnimationFrame(runLoader);
  }, 500);

  /* ── Click / tap to skip ─────────────────────────────────── */
  intro.addEventListener('click', function () {
    if (rafId) cancelAnimationFrame(rafId);
    skipIntro();
  });

  /* ── After intro hides, stop canvas RAF ─────────────────── */
  intro.addEventListener('transitionend', function (e) {
    if (e.propertyName === 'opacity' && intro.classList.contains('ci-hiding')) {
      if (rafId) cancelAnimationFrame(rafId);
    }
  });

  /* ──────────────────────────────────────────────────────────
     LOGO SHINE — fires every 5 seconds on all logo elements
  ────────────────────────────────────────────────────────── */

  function shineAllLogos() {
    // Collect every logo-bearing element
    var logoEls = [
      document.getElementById('ci-logo-inner'),
      document.getElementById('site-header-logo-img'),
      document.getElementById('drawer-logo-img'),
      document.getElementById('drawer-logo-text'),
      document.getElementById('ci-logo-ring'),
      document.getElementById('ci-logo-ring2'),
      document.getElementById('ci-logo-fallback')
    ].filter(Boolean);

    // Also grab any brand name text containers
    var brandMain = document.querySelector('.brand-main');
    var brandSub  = document.querySelector('.brand-sub');
    if (brandMain) logoEls.push(brandMain);
    if (brandSub)  logoEls.push(brandSub);

    logoEls.forEach(function (el) {
      // For the rings use the glow keyframe, for others use the shine sweep
      if (el.id === 'ci-logo-ring' || el.id === 'ci-logo-ring2') {
        el.classList.remove('ring-glow-active');
        void el.offsetWidth; // reflow to re-trigger
        el.classList.add('ring-glow-active');
        setTimeout(function () { el.classList.remove('ring-glow-active'); }, 900);
      } else {
        el.classList.remove('logo-shine-active');
        void el.offsetWidth; // reflow
        el.classList.add('logo-shine-active');
        setTimeout(function () { el.classList.remove('logo-shine-active'); }, 800);
      }
    });
  }

  // Start shine loop after intro is done (give it 5.5s headstart + then every 5s)
  setTimeout(function () {
    shineAllLogos();
    setInterval(shineAllLogos, 5000);
  }, totalDuration + 1500);

})();
