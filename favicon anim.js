/* ═══════════════════════════════════════════════
   favicon_anim.js  –  Animated favicon with shine
   Shine sweeps the favicon icon only (no name).
   ═══════════════════════════════════════════════ */
(function () {
  var SIZE = 64;
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  var ctx = canvas.getContext('2d');
  var link = document.getElementById('favicon');

  var img = new Image();
  img.src = 'test.png';

  /* ── Shine state ── */
  var shineX      = -40;
  var shineActive = false;
  var shineSpeed  = 1.4;
  var lastTime    = 0;
  var INTERVAL    = 5000;   /* sweep every 5 s */
  var started     = false;

  /* ── Draw the base logo image (clipped to circle) ── */
  function drawBase() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    var cx = SIZE / 2, cy = SIZE / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();

    if (img.complete && img.naturalWidth) {
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
    } else {
      /* fallback – dark circle with gold H */
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = '#e8c547';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('H', cx, cy);
    }
    ctx.restore();
  }

  /* ── Diagonal shine streak ── */
  function drawShine() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();

    var grad = ctx.createLinearGradient(shineX - 20, 0, shineX + 20, SIZE);
    grad.addColorStop(0,    'rgba(255,255,255,0)');
    grad.addColorStop(0.35, 'rgba(255,245,180,0.18)');
    grad.addColorStop(0.5,  'rgba(255,255,255,0.62)');
    grad.addColorStop(0.65, 'rgba(255,245,180,0.18)');
    grad.addColorStop(1,    'rgba(255,255,255,0)');

    ctx.fillStyle = grad;
    ctx.fillRect(shineX - 30, 0, 70, SIZE);
    ctx.restore();
  }

  /* ── Gold border ring ── */
  function drawRing() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(232,197,71,0.80)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  /* ── Main render loop ── */
  function animate(timestamp) {
    requestAnimationFrame(animate);

    if (!started) {
      lastTime = timestamp;
      started  = true;
    }

    if (!shineActive && timestamp - lastTime >= INTERVAL) {
      shineActive = true;
      shineX      = -40;
    }

    drawBase();

    if (shineActive) {
      drawShine();
      shineX += shineSpeed;
      if (shineX > SIZE + 40) {
        shineActive = false;
        lastTime    = timestamp;
      }
    }

    drawRing();
    link.href = canvas.toDataURL('image/png');
  }

  /* ── Also apply CSS shine to the header logo IMG (not the name) ── */
  function applyLogoShine() {
    var logoImg = document.getElementById('site-header-logo-img');
    if (!logoImg) return;

    /* Wrap in a shine container if not already done */
    if (logoImg.parentElement.classList.contains('logo-shine-wrap')) return;

    var wrap = document.createElement('div');
    wrap.className = 'logo-shine-wrap';
    wrap.style.cssText = [
      'position:relative',
      'display:inline-block',
      'border-radius:50%',
      'overflow:hidden',
      'flex-shrink:0',
    ].join(';');

    logoImg.parentNode.insertBefore(wrap, logoImg);
    wrap.appendChild(logoImg);

    /* Inject shine pseudo-overlay via a real element */
    var shineEl = document.createElement('div');
    shineEl.className = 'logo-shine-streak';
    shineEl.style.cssText = [
      'position:absolute',
      'inset:0',
      'pointer-events:none',
      'z-index:2',
      'border-radius:50%',
      'background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,0.55) 50%,transparent 70%)',
      'background-size:200% 100%',
      'background-position:-100% 0',
      'animation:logo-shine-sweep 5s ease-in-out infinite',
    ].join(';');
    wrap.appendChild(shineEl);

    /* Inject keyframes once */
    if (!document.getElementById('logo-shine-style')) {
      var style = document.createElement('style');
      style.id = 'logo-shine-style';
      style.textContent = [
        '@keyframes logo-shine-sweep {',
        '  0%,72%   { background-position: -120% 0; opacity:0; }',
        '  74%       { opacity:1; }',
        '  84%       { background-position:  160% 0; opacity:1; }',
        '  86%,100% { background-position:  160% 0; opacity:0; }',
        '}',
        /* Gold ring glow pulse on logo */
        '.logo-shine-wrap {',
        '  box-shadow: 0 0 0 2.5px rgba(232,197,71,0.70);',
        '  transition: box-shadow 0.3s;',
        '}',
        '.logo-shine-wrap:hover {',
        '  box-shadow: 0 0 0 3px rgba(232,197,71,1), 0 0 18px rgba(232,197,71,0.35);',
        '}',
      ].join('\n');
      document.head.appendChild(style);
    }
  }

  function start() {
    requestAnimationFrame(animate);
    /* Wait for DOM ready to apply logo shine */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyLogoShine);
    } else {
      applyLogoShine();
      /* Also watch for when data.js reveals the logo img */
      var obs = new MutationObserver(function(muts) {
        muts.forEach(function(m) {
          if (m.attributeName === 'style' || m.attributeName === 'src') {
            applyLogoShine();
          }
        });
      });
      var logoImg = document.getElementById('site-header-logo-img');
      if (logoImg) obs.observe(logoImg, { attributes: true });
    }
  }

  if (img.complete && img.naturalWidth) {
    start();
  } else {
    img.onload  = start;
    img.onerror = start;
  }
})();
