/* ================================================================
   HARIHARAN R — PORTFOLIO  |  intro.js
   Self-contained film-countdown intro + logo shine every 5s
================================================================ */
(function () {
  'use strict';

  /* ── Inject all CSS ─────────────────────────────────────── */
  var s = document.createElement('style');
  s.textContent =
    '#ci-canvas{position:absolute;inset:0;width:100%;height:100%}' +
    '#ci-grain{position:absolute;inset:0;pointer-events:none;opacity:.07;' +
    'background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E");' +
    'background-size:180px 180px;animation:ci-grain .12s steps(1) infinite}' +
    '@keyframes ci-grain{0%{background-position:0 0}25%{background-position:40px -20px}50%{background-position:-30px 15px}75%{background-position:20px 40px}100%{background-position:-15px -35px}}' +
    '#ci-scanlines{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(0,0,0,.13) 3px,rgba(0,0,0,.13) 4px)}' +
    '#ci-bar-t,#ci-bar-b{position:absolute;left:0;right:0;height:0;background:#000;transition:height .7s cubic-bezier(.22,1,.36,1);z-index:2}' +
    '#ci-bar-t{top:0}#ci-bar-b{bottom:0}' +
    '#portfolio-intro.ci-letterbox #ci-bar-t,#portfolio-intro.ci-letterbox #ci-bar-b{height:60px}' +
    '.ci-hud{position:absolute;font-family:"JetBrains Mono","Courier New",monospace;font-size:.68rem;letter-spacing:.12em;color:rgba(232,197,71,.55);text-transform:uppercase;z-index:10;opacity:0;transition:opacity .5s;display:flex;align-items:center;gap:.5rem;user-select:none}' +
    '#portfolio-intro.ci-letterbox .ci-hud{opacity:1}' +
    '.ci-hud-tl{top:18px;left:18px}.ci-hud-tr{top:18px;right:18px}.ci-hud-bl{bottom:18px;left:18px}.ci-hud-br{bottom:18px;right:18px}' +
    '.ci-hud-sep{opacity:.35}' +
    '.ci-rec{width:7px;height:7px;border-radius:50%;background:#e74c3c;animation:ci-blink 1s step-end infinite;flex-shrink:0}' +
    '@keyframes ci-blink{0%,100%{opacity:1}50%{opacity:.1}}' +
    '.ci-corner{position:absolute;width:50px;height:50px;z-index:10;opacity:0;transition:opacity .5s}' +
    '#portfolio-intro.ci-letterbox .ci-corner{opacity:1}' +
    '.ci-corner.tl{top:8px;left:8px}.ci-corner.tr{top:8px;right:8px}.ci-corner.bl{bottom:8px;left:8px}.ci-corner.br{bottom:8px;right:8px}' +
    '#ci-center{position:relative;z-index:20;display:flex;flex-direction:column;align-items:center;gap:1.4rem;opacity:0;transform:translateY(18px) scale(.97);transition:opacity .7s ease,transform .7s ease}' +
    '#portfolio-intro.ci-show-title #ci-center{opacity:1;transform:translateY(0) scale(1)}' +
    '#ci-logo-wrap{position:relative;width:110px;height:110px;display:flex;align-items:center;justify-content:center}' +
    '#ci-logo-ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(232,197,71,.35);animation:ci-spin 8s linear infinite}' +
    '#ci-logo-ring::before{content:"";position:absolute;top:-3px;left:50%;width:6px;height:6px;background:rgba(232,197,71,.9);border-radius:50%;transform:translateX(-50%);box-shadow:0 0 8px rgba(232,197,71,.8)}' +
    '#ci-logo-ring2{position:absolute;inset:8px;border-radius:50%;border:1px solid rgba(232,197,71,.15);animation:ci-spin 5s linear infinite reverse}' +
    '@keyframes ci-spin{to{transform:rotate(360deg)}}' +
    '#ci-logo-inner{position:relative;width:80px;height:80px;display:flex;align-items:center;justify-content:center}' +
    '#ci-title{text-align:center}' +
    '.ci-director-label{font-family:"JetBrains Mono",monospace;font-size:.65rem;letter-spacing:.28em;text-transform:uppercase;color:rgba(232,197,71,.5);margin-bottom:.7rem}' +
    '.ci-name-wrap{overflow:hidden;line-height:1}' +
    '.ci-name-line{display:block;font-family:"Playfair Display","Georgia",serif;font-size:clamp(2.2rem,6vw,4rem);font-weight:900;color:#f5f5f0;letter-spacing:.06em;text-transform:uppercase;transform:translateY(100%);transition:transform .65s cubic-bezier(.22,1,.36,1)}' +
    '.ci-name-wrap.sub .ci-name-line{font-size:clamp(1rem,2.5vw,1.5rem);font-weight:700;letter-spacing:.22em;color:rgba(245,245,240,.7);transition-delay:.12s}' +
    '.ci-name-line.gold{color:#e8c547}' +
    '#portfolio-intro.ci-show-title .ci-name-line{transform:translateY(0)}' +
    '.ci-divider{width:0;height:1px;background:linear-gradient(90deg,transparent,rgba(232,197,71,.6),transparent);margin:1rem auto;transition:width .6s ease .35s}' +
    '#portfolio-intro.ci-show-title .ci-divider{width:200px}' +
    '.ci-tagline{font-family:"JetBrains Mono",monospace;font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(232,197,71,.5);opacity:0;transition:opacity .5s ease .5s}' +
    '#portfolio-intro.ci-show-title .ci-tagline{opacity:1}' +
    '#ci-loader{position:absolute;bottom:80px;left:50%;transform:translateX(-50%);width:min(340px,80vw);z-index:20;opacity:0;transition:opacity .5s}' +
    '#portfolio-intro.ci-show-title #ci-loader{opacity:1}' +
    '#ci-loader-label{display:flex;justify-content:space-between;font-family:"JetBrains Mono",monospace;font-size:.62rem;letter-spacing:.1em;color:rgba(232,197,71,.45);text-transform:uppercase;margin-bottom:.5rem}' +
    '#ci-loader-track{height:2px;background:rgba(232,197,71,.12);border-radius:2px;overflow:hidden}' +
    '#ci-loader-fill{height:100%;width:0%;border-radius:2px;background:linear-gradient(90deg,rgba(232,197,71,.3),#e8c547);transition:width .3s ease;box-shadow:0 0 8px rgba(232,197,71,.5)}' +
    '#ci-skip{position:absolute;bottom:55px;left:50%;transform:translateX(-50%);font-family:"JetBrains Mono",monospace;font-size:.58rem;letter-spacing:.15em;color:rgba(255,255,255,.2);text-transform:uppercase;z-index:20;white-space:nowrap;animation:ci-pulse 2.5s ease-in-out infinite}' +
    '@keyframes ci-pulse{0%,100%{opacity:.4}50%{opacity:.9}}' +
    /* Logo shine */
    '@keyframes logo-shine-swipe{0%{background-position:-250% center}100%{background-position:350% center}}' +
    '.logo-shine-active{position:relative!important;overflow:hidden!important}' +
    '.logo-shine-active::after{content:"";position:absolute;inset:0;' +
    'background:linear-gradient(105deg,transparent 30%,rgba(232,197,71,.55) 50%,rgba(255,255,220,.7) 55%,rgba(232,197,71,.45) 60%,transparent 70%);' +
    'background-size:250% 100%;background-position:-250% center;' +
    'animation:logo-shine-swipe .7s ease forwards;pointer-events:none;border-radius:inherit;z-index:5}' +
    '@keyframes ring-glow{0%,100%{box-shadow:0 0 4px rgba(232,197,71,.2);border-color:rgba(232,197,71,.35)}50%{box-shadow:0 0 18px rgba(232,197,71,.9),0 0 35px rgba(232,197,71,.5);border-color:rgba(232,197,71,.9)}}' +
    '.ring-glow-active{animation:ci-spin 8s linear infinite,ring-glow .8s ease !important}';
  document.head.appendChild(s);

  /* ── Get intro element ───────────────────────────────────── */
  var intro = document.getElementById('portfolio-intro');
  if (!intro) return;

  /* ── Skip intro ─────────────────────────────────────────── */
  function skipIntro() {
    intro.classList.add('ci-hiding');
    setTimeout(function () {
      intro.style.display = 'none';
      document.body.style.overflow = '';
    }, 950);
  }

  /* ── Populate name ───────────────────────────────────────── */
  var n1 = document.getElementById('ci-n1');
  var n2 = document.getElementById('ci-n2');
  try {
    var nm = (typeof DATA !== 'undefined' && DATA.name) ? DATA.name : 'HARIHARAN EDITZ';
    var pts = nm.split(' ');
    if (n1) n1.textContent = (pts[0] || 'HARIHARAN').toUpperCase();
    if (n2) n2.textContent = (pts.slice(1).join(' ') || 'EDITZ').toUpperCase();
  } catch (e) {
    if (n1) n1.textContent = 'HARIHARAN';
    if (n2) n2.textContent = 'EDITZ';
  }

  /* ── Canvas starfield ────────────────────────────────────── */
  var canvas = document.getElementById('ci-canvas');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var stars = [];
  var rafId;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  for (var i = 0; i < 160; i++) {
    stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.2,
      a: Math.random(), speed: Math.random() * 0.004 + 0.001, dir: Math.random() > 0.5 ? 1 : -1 });
  }

  function drawStars() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var j = 0; j < stars.length; j++) {
      var st = stars[j];
      st.a += st.speed * st.dir;
      if (st.a > 1 || st.a < 0.05) st.dir *= -1;
      ctx.beginPath();
      ctx.arc(st.x * canvas.width, st.y * canvas.height, st.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + st.a.toFixed(2) + ')';
      ctx.fill();
    }
    rafId = requestAnimationFrame(drawStars);
  }
  drawStars();

  /* ── Loader ──────────────────────────────────────────────── */
  var msgs = ['Initializing Portfolio','Loading Assets','Calibrating Colors',
    'Preparing Timeline','Rendering Frames','Almost There'];
  var lStatus = document.getElementById('ci-loader-status');
  var lPct    = document.getElementById('ci-loader-pct');
  var lFill   = document.getElementById('ci-loader-fill');
  var TOTAL   = 4200;
  var t0      = null;

  function tickLoader(ts) {
    if (!t0) t0 = ts;
    var el = ts - t0;
    var pct = Math.min(100, Math.round((el / TOTAL) * 100));
    if (lFill) lFill.style.width = pct + '%';
    if (lPct)  lPct.textContent  = pct + '%';
    if (lStatus) lStatus.textContent = msgs[Math.min(msgs.length - 1, Math.floor((pct / 100) * msgs.length))];
    if (el < TOTAL) { requestAnimationFrame(tickLoader); }
    else { setTimeout(skipIntro, 300); }
  }

  /* ── Sequence ────────────────────────────────────────────── */
  setTimeout(function () { intro.classList.add('ci-letterbox'); }, 80);
  setTimeout(function () {
    intro.classList.add('ci-show-title');
    requestAnimationFrame(tickLoader);
  }, 500);

  /* ── Click to skip ───────────────────────────────────────── */
  intro.addEventListener('click', function () {
    if (rafId) cancelAnimationFrame(rafId);
    skipIntro();
  });
  intro.addEventListener('transitionend', function (e) {
    if (e.propertyName === 'opacity' && intro.classList.contains('ci-hiding')) {
      if (rafId) cancelAnimationFrame(rafId);
    }
  });

  /* ══════════════════════════════════════════════════════════
     LOGO SHINE — every 5 seconds
  ══════════════════════════════════════════════════════════ */
  function shineLogos() {
    var shine = [
      document.getElementById('ci-logo-inner'),
      document.getElementById('ci-logo-fallback'),
      document.getElementById('site-header-logo-img'),
      document.getElementById('drawer-logo-img'),
      document.getElementById('drawer-logo-text'),
      document.querySelector('.brand-main'),
      document.querySelector('.brand-sub')
    ];
    var glow = [
      document.getElementById('ci-logo-ring'),
      document.getElementById('ci-logo-ring2')
    ];

    shine.forEach(function (el) {
      if (!el) return;
      el.classList.remove('logo-shine-active');
      void el.offsetWidth;
      el.classList.add('logo-shine-active');
      setTimeout(function () { el.classList.remove('logo-shine-active'); }, 800);
    });
    glow.forEach(function (el) {
      if (!el) return;
      el.classList.remove('ring-glow-active');
      void el.offsetWidth;
      el.classList.add('ring-glow-active');
      setTimeout(function () { el.classList.remove('ring-glow-active'); }, 900);
    });
  }

  setTimeout(function () {
    shineLogos();
    setInterval(shineLogos, 5000);
  }, TOTAL + 1500);

})();
