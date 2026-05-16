/* ================================================================
   HARIHARAN R — PORTFOLIO  |  intro.js  (MEGA CINEMATIC EDITION)
   ✦ Ambient orb canvas
   ✦ Gold particle burst when name finishes + on each load stage
   ✦ Shine ONLY on logo (#ci-logo-inner::after via CSS in HTML)
   ✦ Name typewriter — stamped chars with colour tints (NO shine)
   ✦ Glitch flicker on name completion
   ✦ Upgraded loading bar with glow
   ✦ 5 s auto-dismiss / click to skip
================================================================ */

(function () {
  var intro = document.getElementById('portfolio-intro');
  if (!intro) return;

  /* ════════════════════════════════════════════
     1. AMBIENT ORB CANVAS
  ════════════════════════════════════════════ */
  var canvas = document.getElementById('ci-canvas');
  var ctx    = canvas.getContext('2d');
  var W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  var orbs = [];
  for (var i = 0; i < 6; i++) {
    orbs.push({
      x: Math.random(), y: Math.random(),
      r: 0.18 + Math.random() * 0.28,
      phase: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.004,
      hue: Math.random() < 0.6 ? '232,197,71' : '200,130,20'
    });
  }

  var raf;
  function drawOrbs() {
    ctx.clearRect(0, 0, W, H);
    var t = Date.now() / 1000;
    for (var i = 0; i < orbs.length; i++) {
      var o = orbs[i];
      var pulse = 0.5 + 0.5 * Math.sin(t * o.speed * Math.PI * 2 + o.phase);
      var gr = ctx.createRadialGradient(
        o.x * W, o.y * H, 0,
        o.x * W, o.y * H, o.r * Math.min(W, H) * (0.7 + 0.5 * pulse)
      );
      gr.addColorStop(0,    'rgba(' + o.hue + ',' + (0.09 * pulse).toFixed(3) + ')');
      gr.addColorStop(0.45, 'rgba(' + o.hue + ',' + (0.05 * pulse).toFixed(3) + ')');
      gr.addColorStop(1,    'rgba(' + o.hue + ',0)');
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, W, H);
    }
    raf = requestAnimationFrame(drawOrbs);
  }
  drawOrbs();

  /* ════════════════════════════════════════════
     2. PARTICLE BURST CANVAS
  ════════════════════════════════════════════ */
  var pCanvas = document.getElementById('ci-particles');
  var pCtx    = pCanvas.getContext('2d');

  function resizeP() { pCanvas.width = window.innerWidth; pCanvas.height = window.innerHeight; }
  resizeP();
  window.addEventListener('resize', resizeP);

  var particles = [];

  function spawnBurst(cx, cy, count, speed) {
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var spd   = speed * (0.4 + Math.random());
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 1,
        decay: 0.014 + Math.random() * 0.022,
        size: 1.4 + Math.random() * 3,
        gold: Math.random() > 0.3
      });
    }
  }

  var pRaf;
  function drawParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x  += p.vx; p.y  += p.vy;
      p.vx *= 0.96; p.vy *= 0.96;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      pCtx.fillStyle = p.gold
        ? 'rgba(232,197,71,' + p.life.toFixed(2) + ')'
        : 'rgba(255,255,255,' + (p.life * 0.45).toFixed(2) + ')';
      pCtx.fill();
    }
    pRaf = requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ════════════════════════════════════════════
     3. TYPEWRITER
     Shine is on #ci-logo-inner::after (CSS only).
     Name text has NO shine — only colour-tinted stamp animation.
  ════════════════════════════════════════════ */
  var colorClasses = ['c0', 'c1', 'c2', 'c3', 'c4'];

  function typeChars(el, text, startDelay, charInterval, onDone) {
    var total = text.length;
    text.split('').forEach(function (ch, i) {
      setTimeout(function () {
        var span = document.createElement('span');
        span.className = 'ci-char ' + colorClasses[i % colorClasses.length];
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.animationDelay = '0ms';
        el.appendChild(span);
        if (i === total - 1 && onDone) onDone();
      }, startDelay + i * charInterval);
    });
  }

  var n1 = document.getElementById('ci-n1');
  var n2 = document.getElementById('ci-n2');

  typeChars(n1, 'HARIHARAN', 700, 120, function () {
    /* Particle burst from name position */
    var rect = n1.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 130, 7);

    /* Glitch flicker on the name line */
    n1.classList.add('ci-glitch');
    setTimeout(function () { n1.classList.remove('ci-glitch'); }, 380);

    /* Type "R." with pause */
    typeChars(n2, 'R.', 320, 280, function () {
      var r2 = n2.getBoundingClientRect();
      spawnBurst(r2.left + r2.width / 2, r2.top + r2.height / 2, 75, 5);
    });
  });

  /* Inject glitch keyframes once */
  if (!document.getElementById('ci-glitch-style')) {
    var gs = document.createElement('style');
    gs.id  = 'ci-glitch-style';
    gs.textContent = [
      '.ci-glitch {',
      '  animation: ci-glitch-anim 0.35s steps(2,end) !important;',
      '}',
      '@keyframes ci-glitch-anim {',
      '  0%  { clip-path:inset(15% 0 58% 0); transform:translate(-4px,0) skewX(-3deg); color:#e8c547; }',
      '  30% { clip-path:inset(62% 0  8% 0); transform:translate( 4px,0) skewX( 3deg); color:#fff; }',
      '  65% { clip-path:inset(28% 0 42% 0); transform:translate(-2px,0) skewX(-1deg); color:#e8c547; }',
      '  100%{ clip-path:none;               transform:translate(0,0);                 color:#fff; }',
      '}',
    ].join('\n');
    document.head.appendChild(gs);
  }

  /* ════════════════════════════════════════════
     4. DIVIDER + TAGLINE
  ════════════════════════════════════════════ */
  setTimeout(function () {
    var divider = document.getElementById('ci-divider');
    var tagline = document.getElementById('ci-tagline');
    if (divider) divider.classList.add('grow');
    if (tagline) tagline.classList.add('show');
  }, 100);

  /* ════════════════════════════════════════════
     5. LOADING BAR — glowing fill + particle puff
  ════════════════════════════════════════════ */
  var fill   = document.getElementById('ci-loader-fill');
  var pctEl  = document.getElementById('ci-loader-pct');
  var statEl = document.getElementById('ci-loader-status');

  var loadStages = [
    { at: 0,    pct: 0,   label: 'Initializing Portfolio' },
    { at: 500,  pct: 15,  label: 'Loading Assets'         },
    { at: 1200, pct: 38,  label: 'Rendering Timeline'     },
    { at: 2100, pct: 62,  label: 'Applying Color Grade'   },
    { at: 3000, pct: 80,  label: 'Syncing Audio'          },
    { at: 3900, pct: 94,  label: 'Finalizing Export'      },
    { at: 4600, pct: 100, label: '\u2726  Ready'          }
  ];

  loadStages.forEach(function (s) {
    setTimeout(function () {
      if (fill)   fill.style.width   = s.pct + '%';
      if (pctEl)  pctEl.textContent  = s.pct + '%';
      if (statEl) statEl.textContent = s.label;
      /* Tiny particle puff at bar tip on each milestone */
      if (fill && s.pct > 0 && s.pct < 100) {
        var bar = fill.getBoundingClientRect();
        spawnBurst(bar.right, bar.top + bar.height / 2, 20, 2.5);
      }
    }, s.at);
  });

  /* ════════════════════════════════════════════
     6. DISMISS — 5 s auto / click to skip
  ════════════════════════════════════════════ */
  function dismiss() {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(pRaf);
    intro.classList.add('exit');
    setTimeout(function () {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    }, 950);
  }

  var timer = setTimeout(dismiss, 5000);
  intro.addEventListener('click', function () { clearTimeout(timer); dismiss(); });

})();
