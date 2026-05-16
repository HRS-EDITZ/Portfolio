/* ================================================================
   HARIHARAN R — PORTFOLIO  |  main.js
   Core logic — render(), admin panel, GitHub sync,
   contact form (EmailJS), scroll & animation observers
================================================================ */

const ADMIN_PASSWORD = 'editor2025';

function render() {
  var headerLogoImg  = document.getElementById('site-header-logo-img');
  var drawerLogoImg  = document.getElementById('drawer-logo-img');
  var drawerLogoText = document.getElementById('drawer-logo-text');
  var hasLogo = DATA.brandLogo && DATA.brandLogo.length > 50;
  if (headerLogoImg) {
    if (hasLogo) {
      headerLogoImg.src = DATA.brandLogo;
      headerLogoImg.style.display = 'inline-block';
      headerLogoImg.style.height = '72px';
      headerLogoImg.style.width = 'auto';
      headerLogoImg.style.objectFit = 'contain';
    } else {
      headerLogoImg.style.display = 'none';
    }
  }
  if (drawerLogoImg && drawerLogoText) {
    if (hasLogo) {
      drawerLogoImg.src = DATA.brandLogo;
      drawerLogoImg.style.display = 'inline-block';
      drawerLogoText.style.display = 'none';
    } else {
      drawerLogoImg.style.display = 'none';
      drawerLogoText.style.display = 'inline';
      drawerLogoText.innerHTML = DATA.name.split(' ')[0].toUpperCase() + '<span style="color:var(--muted)">.</span>EDIT';
    }
  }

  var faviconEl = document.getElementById('dynamic-favicon');
  if (faviconEl && hasLogo) {
    faviconEl.href = DATA.brandLogo;
  }

  var ciLogoImg      = document.getElementById('ci-logo-img');
  var ciLogoFallback = document.getElementById('ci-logo-fallback');
  if (ciLogoImg && ciLogoFallback) {
    if (hasLogo) {
      ciLogoImg.src = DATA.brandLogo;
      ciLogoImg.style.display = 'block';
      ciLogoFallback.style.display = 'none';
    } else {
      ciLogoImg.style.display = 'none';
      ciLogoFallback.style.display = 'block';
    }
  }

  function setText(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
  function setHTML(id, val) { var el = document.getElementById(id); if (el) el.innerHTML = val; }
  setText('hero-badge', DATA.badge);
  setText('freelance-bar-text', DATA.badge);
  setText('h1-line1', DATA.h1line1);
  setText('h1-line2', DATA.h1line2);
  setText('h1-line3', DATA.h1line3);
  setText('hero-tagline', DATA.tagline);
  setText('stat1n', DATA.stat1n);
  setText('stat1l', DATA.stat1l);
  setText('stat2n', DATA.stat2n);
  setText('stat2l', DATA.stat2l);
  setText('stat3n', DATA.stat3n);
  setText('stat3l', DATA.stat3l);
  const avatarEl = document.getElementById('about-avatar');
  if (avatarEl) {
    if (DATA.avatar && DATA.avatar.startsWith('data:image')) {
      avatarEl.innerHTML = '<img src="' + DATA.avatar + '" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">';
    } else {
      avatarEl.textContent = DATA.avatar;
    }
  }
  setText('about-visual-label', DATA.visualLabel);
  setText('about-heading', DATA.aboutHeading);
  setText('about-p1', DATA.aboutP1);
  setText('about-p2', DATA.aboutP2);
  setText('footer-name', DATA.name);
  setText('contact-title', 'Have a project in mind?');
  setText('contact-tagline', DATA.contactTagline);
  setText('contact-email', DATA.email);
  setText('contact-location', DATA.location);
  setText('contact-availability', DATA.availability);


  const videosHTML = DATA.videos.length === 0
    ? '<p style="color:var(--muted);font-family:var(--font-mono);font-size:0.85rem;padding:2rem 0;">No videos yet. Open the admin panel → Videos tab to add your work.</p>'
    : DATA.videos.map((v,i) => {
        const hasVideo = !!extractDriveId(v.driveUrl || '');
        const isShort = (v.type === 'short');
        const hasPoster = v.posterData && v.posterData.length > 100;
        const thumbHTML = hasPoster
          ? '<img src="' + v.posterData + '" alt="' + v.title + '" style="width:100%;height:100%;object-fit:cover;">'
          : '<div class="video-thumb-placeholder">' + (isShort ? '📱' : '🎬') + '</div>';
        const typeLabel = isShort
          ? '<div style="position:absolute;top:0.6rem;left:0.6rem;background:rgba(0,0,0,0.7);color:var(--accent);font-family:var(--font-mono);font-size:0.62rem;padding:0.2rem 0.5rem;border-radius:2px;letter-spacing:0.06em;">REEL</div>'
          : '';
        return '<div class="video-card' + (isShort ? ' type-short' : '') + '" onclick="openLightbox(' + i + ')" style="cursor:pointer;' + (!hasVideo ? 'opacity:0.5;pointer-events:none;' : '') + '">' +
          '<div class="video-thumb"' + (isShort ? ' style="aspect-ratio:9/16;"' : '') + '>' + thumbHTML +
          '<div class="video-play-btn" onclick="openLightbox(' + i + ')"><div class="video-play-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div></div>' +
          typeLabel +
          (!hasVideo ? '<div style="position:absolute;bottom:0.5rem;left:50%;transform:translateX(-50%);font-family:var(--font-mono);font-size:0.65rem;color:var(--muted);white-space:nowrap;">No video added</div>' : '') +
          '</div>' +
          '<div class="video-info">' +
          '<div class="video-cat">' + v.cat + '</div>' +
          '<div class="video-title">' + v.title + '</div>' +
          '<div class="video-desc">' + v.desc + '</div>' +
          '<div class="video-tags">' + (v.tags||[]).map(t => '<span class="video-tag">' + t + '</span>').join('') + '</div>' +
          '</div></div>';
      }).join('');
  setHTML('videos-container', videosHTML);

  // ── COLOR GRADING ──────────────────────────────────────────
  const cgShots = DATA.colorGrading || [];
  const cgHTML = cgShots.length === 0
    ? '<p style="color:var(--muted);font-family:var(--font-mono);font-size:0.85rem;padding:2rem 0;">No color grading shots yet. Open the admin panel → Color Grading tab to add your work.</p>'
    : cgShots.map((s, i) => {
        const hasBefore = s.beforeData && s.beforeData.length > 50;
        const hasAfter  = s.afterData  && s.afterData.length  > 50;
        if (!hasBefore && !hasAfter) {
          return '<div class="cg-card" style="opacity:0.4;pointer-events:none;">' +
            '<div class="cg-slider-wrap" style="display:flex;align-items:center;justify-content:center;"><span style="color:var(--muted);font-family:var(--font-mono);font-size:0.8rem;">No images yet</span></div>' +
            '<div class="cg-info"><div class="cg-shot-cat">' + (s.cat||'Color Grading') + '</div>' +
            '<div class="cg-shot-title">' + (s.title||'Untitled Shot') + '</div></div></div>';
        }
        return '<div class="cg-card" onclick="openCGLightbox(' + i + ')">' +
          '<div class="cg-slider-wrap" id="cg-card-wrap-' + i + '">' +
          '<div class="cg-img-before" style="background-image:url(\'' + (hasBefore ? s.beforeData : s.afterData) + '\')"></div>' +
          '<div class="cg-img-after"  id="cg-after-' + i + '" style="background-image:url(\'' + (hasAfter  ? s.afterData  : s.beforeData) + '\')"></div>' +
          '<input type="range" class="cg-range" min="0" max="100" value="50" ' +
            'oninput="moveCGSlider(this,' + i + ')" onclick="event.stopPropagation()">' +
          '<div class="cg-divider" id="cg-div-' + i + '"></div>' +
          '<div class="cg-label cg-label-before">BEFORE</div>' +
          '<div class="cg-label cg-label-after">AFTER</div>' +
          '</div>' +
          '<div class="cg-info">' +
          '<div class="cg-shot-cat">' + (s.cat||'Color Grading') + '</div>' +
          '<div class="cg-shot-title">' + (s.title||'Untitled Shot') + '</div>' +
          (s.desc ? '<div class="cg-shot-desc">' + s.desc + '</div>' : '') +
          '<div class="cg-tags">' + (s.tags||[]).map(t => '<span class="cg-tag">' + t + '</span>').join('') + '</div>' +
          '</div></div>';
      }).join('');
  setHTML('cg-container', cgHTML);
  setTimeout(initCGCardSliders, 0);
  setHTML('hero-tags', DATA.tags.map((t,i)=>`<span class="tag ${tagColors[i%4]}">${t}</span>`).join(''));

  setHTML('about-pills', DATA.pills.map(p=>`<span class="pill">${p}</span>`).join(''));

  const sc = ['s1','s2','s3','s4'];
  setHTML('skills-container', DATA.skills.map((s,i)=>`
    <div class="skill-card ${sc[i%4]}">
      <div class="skill-num">0${i+1}</div>
      <div class="skill-icon">${s.icon}</div>
      <div class="skill-title">${s.title}</div>
      <div class="skill-desc">${s.desc}</div>
      <div class="skill-items">${s.items.map(it=>`<span class="skill-item">${it}</span>`).join('')}</div>
    </div>`).join(''));

  const thumbs = ['t1','t2','t3','t4'];
  setHTML('projects-container', DATA.projects.map((p,i)=>`
    <div class="project-card">
      <div class="project-thumb ${thumbs[i%4]}">
        <span>${p.emoji}</span>
        <span class="project-thumb-label">PROJECT ${String(i+1).padStart(2,'0')}</span>
      </div>
      <div class="project-body">
        <div class="project-cat">${p.cat}</div>
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.desc}</div>
        <div class="project-tags">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div>
      </div>
    </div>`).join(''));

  setHTML('exp-container', DATA.experience.map(e=>`
    <div class="exp-item">
      <div class="exp-year">${e.year}</div>
      <div>
        <div class="exp-role">${e.role}</div>
        <div class="exp-company">${e.company}</div>
        <div class="exp-desc">${e.desc}</div>
      </div>
    </div>`).join(''));

  setHTML('edu-container', DATA.education.map(e=>`
    <div class="edu-card">
      <div class="edu-degree">${e.degree}</div>
      <div class="edu-school">${e.school}</div>
      <div class="edu-year">${e.year}</div>
    </div>`).join(''));

  setHTML('testi-container', DATA.testimonials.map(t=>`
    <div class="testi-card">
      <div class="testi-text">${t.text}</div>
      <div class="testi-author">
        <div class="testi-avatar">${t.initials}</div>
        <div>
          <div class="testi-name">${t.name}</div>
          <div class="testi-role">${t.role}</div>
        </div>
      </div>
    </div>`).join(''));
}

// Migrate old before/after video format to single driveUrl
if (Array.isArray(DATA.videos)) {
  DATA.videos = DATA.videos.map(function(v) {
    if (!v.driveUrl) {
      v.driveUrl = v.afterDriveUrl || v.beforeDriveUrl || '';
    }
    return v;
  });
}

render();


function extractDriveId(url) {
  if (!url) return '';
  let m = url.match(/\/file\/d\/([a-zA-Z0-9_-]{10,})/);
  if (m) return m[1];
  m = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(url.trim())) return url.trim();
  return '';
}

function driveEmbedUrl(id) {
  return id ? 'https://drive.google.com/file/d/' + id + '/preview?autoplay=0' : '';
}

function buildDriveEmbed(driveUrl, isShort) {
  var id = extractDriveId(driveUrl);
  if (!id) return '';
  var embedUrl = driveEmbedUrl(id);
  var style = 'width:100%;height:100%;border:none;display:block;';
  return '<div style="position:relative;width:100%;height:100%;">' +
    '<iframe src="' + embedUrl + '" ' +
    'style="' + style + '" ' +
    'allowfullscreen ' +
    'allow="autoplay; fullscreen" ' +
    'sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox allow-forms">' +
    '</iframe>' +
    '</div>';
}

var _lbIdx = 0;

function openLightbox(i) {
  _lbIdx = i;
  var v = DATA.videos[i];
  var isShort = (v.type === 'short');
  var frame   = document.getElementById('video-lightbox-frame');
  var lbInner = document.getElementById('video-lightbox-inner');
  var hasVideo = !!extractDriveId(v.driveUrl || '');

  if (isShort) {
    frame.classList.add('type-short');
    lbInner.classList.add('type-short');
  } else {
    frame.classList.remove('type-short');
    lbInner.classList.remove('type-short');
  }

  if (!hasVideo) {
    frame.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:1rem;color:var(--muted);font-family:var(--font-mono);font-size:0.85rem;text-align:center;padding:2rem;">📭<br>No video linked yet.<br><span style="font-size:0.72rem;opacity:0.6;">Open admin panel → Videos tab and paste your Google Drive share link.</span></div>';
  } else {
    frame.innerHTML = buildDriveEmbed(v.driveUrl, isShort);
  }

  document.getElementById('video-lightbox-title').textContent = v.title;
  document.getElementById('video-lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}



function closeLightbox() {
  document.getElementById('video-lightbox').classList.remove('open');
  document.getElementById('video-lightbox-frame').innerHTML = '';
  document.body.style.overflow = '';
}

document.getElementById('video-lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeLightbox(); closeCGLightbox(); }
});
/* ═══════════════════════════════════════════════════════
   COLOR GRADING — card slider + lightbox
═══════════════════════════════════════════════════════ */
function moveCGSlider(input, i) {
  var pct = input.value;
  var afterEl = document.getElementById('cg-after-' + i);
  var divEl   = document.getElementById('cg-div-'   + i);
  if (afterEl) afterEl.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
  if (divEl)   divEl.style.left = pct + '%';
}

/* Mobile-safe pointer drag for card sliders — called after render() builds the DOM */
function initCGCardSliders() {
  document.querySelectorAll('.cg-slider-wrap').forEach(function(wrap, i) {
    var range  = wrap.querySelector('.cg-range');
    var afterEl = document.getElementById('cg-after-' + i);
    var divEl   = document.getElementById('cg-div-'   + i);
    if (!range) return;

    function applyPct(clientX) {
      var rect = wrap.getBoundingClientRect();
      var pct  = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      range.value = pct;
      if (afterEl) afterEl.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      if (divEl)   divEl.style.left = pct + '%';
    }

    var dragging = false;
    range.addEventListener('pointerdown', function(e) {
      dragging = true;
      range.setPointerCapture(e.pointerId);
      e.stopPropagation();
      applyPct(e.clientX);
    });
    range.addEventListener('pointermove', function(e) {
      if (!dragging) return;
      e.stopPropagation();
      applyPct(e.clientX);
    });
    range.addEventListener('pointerup',     function() { dragging = false; });
    range.addEventListener('pointercancel', function() { dragging = false; });
    /* keep click from bubbling up to openCGLightbox */
    range.addEventListener('click', function(e) { e.stopPropagation(); });
  });
}

function openCGLightbox(i) {
  var s = (DATA.colorGrading || [])[i];
  if (!s) return;
  var hasBefore = s.beforeData && s.beforeData.length > 50;
  var hasAfter  = s.afterData  && s.afterData.length  > 50;
  document.getElementById('cg-lb-before').style.backgroundImage = 'url(\'' + (hasBefore ? s.beforeData : '') + '\')';
  document.getElementById('cg-lb-after').style.backgroundImage  = 'url(\'' + (hasAfter  ? s.afterData  : '') + '\')';
  document.getElementById('cg-lb-after').style.clipPath = 'inset(0 50% 0 0)';
  document.getElementById('cg-lb-divider').style.left = '50%';
  document.getElementById('cg-lb-range').value = 50;
  document.getElementById('cg-lightbox-title').textContent = s.title || '';
  document.getElementById('cg-lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCGLightbox() {
  document.getElementById('cg-lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cg-lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeCGLightbox();
});

(function initCGLbSlider() {
  var wrap   = document.getElementById('cg-lb-slider-wrap');
  var range  = document.getElementById('cg-lb-range');
  var afterEl = document.getElementById('cg-lb-after');
  var divEl   = document.getElementById('cg-lb-divider');
  if (!range || !wrap) return;

  function applyPct(clientX) {
    var rect = wrap.getBoundingClientRect();
    var pct  = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    range.value = pct;
    if (afterEl) afterEl.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    if (divEl)   divEl.style.left = pct + '%';
  }

  /* range input event (desktop fallback) */
  range.addEventListener('input', function() {
    applyPct(range.getBoundingClientRect().left + (range.value / 100) * range.getBoundingClientRect().width);
    var pct = range.value;
    if (afterEl) afterEl.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    if (divEl)   divEl.style.left = pct + '%';
  });

  /* pointer events for mobile */
  var dragging = false;
  range.addEventListener('pointerdown', function(e) {
    dragging = true;
    range.setPointerCapture(e.pointerId);
    applyPct(e.clientX);
  });
  range.addEventListener('pointermove', function(e) {
    if (!dragging) return;
    applyPct(e.clientX);
  });
  range.addEventListener('pointerup',     function() { dragging = false; });
  range.addEventListener('pointercancel', function() { dragging = false; });
})();
function openDrawer() {
  document.getElementById('nav-drawer').classList.add('open');
  document.getElementById('nav-overlay').classList.add('open');
  document.getElementById('nav-hamburger').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('nav-drawer').classList.remove('open');
  document.getElementById('nav-overlay').classList.remove('open');
  document.getElementById('nav-hamburger').classList.remove('open');
  document.body.style.overflow = '';
}
function updateDrawerLogo() {
  var dli = document.getElementById('drawer-logo-img');
  var dlt = document.getElementById('drawer-logo-text');
  if (!dli || !dlt) return;
  if (DATA.brandLogo && DATA.brandLogo.length > 50) {
    dli.src = DATA.brandLogo;
    dli.style.display = 'inline-block';
    dlt.style.display = 'none';
  } else {
    dli.style.display = 'none';
    dlt.style.display = 'inline';
    dlt.innerHTML = DATA.name.split(' ')[0].toUpperCase() + '<span style="color:var(--muted)">.</span>EDIT';
  }
}


function handleLogoUpload(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    DATA.brandLogo = e.target.result;
    var previewWrap = document.getElementById('logo-preview-wrap');
    var previewImg  = document.getElementById('admin-logo-preview');
    var removeBtn   = document.getElementById('logo-remove-btn');
    if (previewImg) previewImg.src = DATA.brandLogo;
    if (previewWrap) previewWrap.style.display = 'block';
    if (removeBtn) removeBtn.style.display = 'inline-block';
    render();
    input.value = '';
  };
  reader.readAsDataURL(file);
}

function removeBrandLogo() {
  DATA.brandLogo = '';
  var previewWrap = document.getElementById('logo-preview-wrap');
  var removeBtn   = document.getElementById('logo-remove-btn');
  previewWrap.style.display = 'none';
  removeBtn.style.display = 'none';
  render();
}

/* Keyboard shortcut: Ctrl + Shift + E */
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'E') { e.preventDefault(); openPwd(); }
});

function openPwd() {
  document.getElementById('pwd-prompt').classList.add('open');
  document.getElementById('pwd-input').value = '';
  document.getElementById('pwd-err').style.display = 'none';
  setTimeout(() => document.getElementById('pwd-input').focus(), 100);
}
function closePwd() { document.getElementById('pwd-prompt').classList.remove('open'); }
function checkPwd() {
  if (document.getElementById('pwd-input').value === ADMIN_PASSWORD) { closePwd(); openAdmin(); }
  else { document.getElementById('pwd-err').style.display = 'block'; }
}
const _pwdInput = document.getElementById('pwd-input');
if (_pwdInput) _pwdInput.addEventListener('keydown', e => { if(e.key==='Enter') checkPwd(); });

function openAdmin() { populateAdmin(); document.getElementById('admin-panel').classList.add('open'); }
function closeAdmin() { document.getElementById('admin-panel').classList.remove('open'); }
function switchTab(name, clickedEl) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  var tabBtn = clickedEl || (typeof event !== 'undefined' && event && event.target) || null;
  if (!tabBtn) tabBtn = document.querySelector('.admin-tab[onclick*="\'' + name + '\'"]') || document.querySelector('.admin-tab[onclick*=\'"' + name + '"\']');
  if (tabBtn) tabBtn.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  var sec = document.getElementById('tab-' + name);
  if (sec) sec.classList.add('active');
}
function set(id,val) { const el=document.getElementById(id); if(el) el.value=val; }
function get(id) { const el=document.getElementById(id); return el ? el.value.trim() : ''; }

function populateAdmin() {
  var previewWrap = document.getElementById('logo-preview-wrap');
  var previewImg  = document.getElementById('admin-logo-preview');
  var removeBtn   = document.getElementById('logo-remove-btn');
  if (DATA.brandLogo && DATA.brandLogo.length > 50) {
    previewImg.src = DATA.brandLogo;
    previewWrap.style.display = 'block';
    removeBtn.style.display = 'inline-block';
  } else {
    previewWrap.style.display = 'none';
    removeBtn.style.display = 'none';
  }

  set('edit-name', DATA.name); set('edit-badge', DATA.badge);
  set('edit-h1-line1', DATA.h1line1); set('edit-h1-line2', DATA.h1line2); set('edit-h1-line3', DATA.h1line3);
  set('edit-tagline', DATA.tagline); set('edit-tags', DATA.tags.join(', '));
  set('edit-s1n',DATA.stat1n); set('edit-s1l',DATA.stat1l);
  set('edit-s2n',DATA.stat2n); set('edit-s2l',DATA.stat2l);
  set('edit-s3n',DATA.stat3n); set('edit-s3l',DATA.stat3l);
  set('edit-avatar', DATA.avatar); set('edit-visual-label', DATA.visualLabel);
  set('edit-about-heading', DATA.aboutHeading);
  set('edit-about-p1', DATA.aboutP1); set('edit-about-p2', DATA.aboutP2);
  set('edit-pills', DATA.pills.join(', '));
  set('edit-email', DATA.email); set('edit-location', DATA.location);
  set('edit-avail', DATA.availability); set('edit-contact-tagline', DATA.contactTagline);
  set('edit-ejs-pubkey', DATA.emailjsPublicKey);
  set('edit-ejs-service', DATA.emailjsServiceId);
  set('edit-ejs-template', DATA.emailjsTemplateId);
  renderVideoEditor();
  renderCGEditor();
  renderSkillsEditor(); renderProjectsEditor(); renderExpEditor(); renderEduEditor(); renderTestiEditor();
}


function renderVideoEditor() {
  const c = document.getElementById('videos-editor');
  if (!c) return;
  c.innerHTML = '';
  DATA.videos.forEach((v, i) => {
    const hasPoster = v.posterData && v.posterData.length > 100;

    const driveIdHtml = !!extractDriveId(v.driveUrl || '')
      ? '<div style="margin-top:0.5rem;padding:0.5rem 0.8rem;background:rgba(232,197,71,0.08);border:1px solid rgba(232,197,71,0.2);border-radius:3px;font-family:var(--font-mono);font-size:0.72rem;color:var(--accent);">✅ Drive ID detected: ' + extractDriveId(v.driveUrl) + '</div>'
      : '';

    c.innerHTML +=
      '<div class="admin-card" id="vid-card-' + i + '">' +
      '<div class="admin-card-header">' +
      '<span class="admin-card-title">Video ' + (i+1) + ': ' + v.title + '</span>' +
      '<button class="admin-btn-remove" onclick="removeVideo(' + i + ')">Remove</button>' +
      '</div>' +

      '<div class="form-group">' +
      '<label>🎬 Google Drive Share Link</label>' +
      '<input type="text" id="vid-drive-url-' + i + '" placeholder="Paste Google Drive share link here..." value="' + (v.driveUrl || '') + '" oninput="previewDriveLink(' + i + ')">' +
      '<div id="vid-drive-preview-' + i + '">' + driveIdHtml + '</div>' +
      '</div>' +

      '<div class="form-group">' +
      '<label>🖼️ Thumbnail Image (optional — shown on video card)</label>' +
      '<div class="vid-upload-area" id="vid-poster-area-' + i + '" onclick="document.getElementById(&apos;vid-poster-&apos;+' + i + '+&apos;&apos;).click()">' +
      (hasPoster
        ? '<span style="color:var(--accent)">✅ Thumbnail uploaded</span>'
        : '<span>🖼️ Click to upload thumbnail (JPG/PNG)</span>') +
      '</div>' +
      '<input type="file" id="vid-poster-' + i + '" accept="image/*" style="display:none" onchange="handlePosterFile(event,' + i + ')">' +
      '</div>' +

      '<div class="form-row">' +
      '<div class="form-group"><label>Category</label><input type="text" id="vid-cat-' + i + '" value="' + (v.cat||'') + '"></div>' +
      '<div class="form-group"><label>Title</label><input type="text" id="vid-title-' + i + '" value="' + (v.title||'') + '"></div>' +
      '</div>' +
      '<div class="form-row">' +
      '<div class="form-group"><label>📐 Video Type</label>' +
      '<select id="vid-type-' + i + '" style="width:100%;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:2px;padding:0.8rem 1rem;color:var(--text);font-family:var(--font-body);font-size:0.88rem;outline:none;">' +
      '<option value="video"' + ((!v.type || v.type==='video') ? ' selected' : '') + '>🎬 Video (16:9 landscape)</option>' +
      '<option value="short"' + (v.type==='short' ? ' selected' : '') + '>📱 Short / Reel (9:16 portrait)</option>' +
      '</select></div>' +
      '<div class="form-group"><label>Tags (comma-separated)</label><input type="text" id="vid-tags-' + i + '" value="' + (v.tags||[]).join(', ') + '"></div>' +
      '</div>' +
      '<div class="form-group"><label>Description</label><textarea id="vid-desc-' + i + '" rows="2">' + (v.desc||'') + '</textarea></div>' +
      '</div>';
  });
}

function previewDriveLink(i) {
  var url = document.getElementById('vid-drive-url-' + i).value.trim();
  var id = extractDriveId(url);
  var previewEl = document.getElementById('vid-drive-preview-' + i);
  if (id) {
    previewEl.innerHTML = '<div style="margin-top:0.5rem;padding:0.5rem 0.8rem;background:rgba(232,197,71,0.08);border:1px solid rgba(232,197,71,0.2);border-radius:3px;font-family:var(--font-mono);font-size:0.72rem;color:var(--accent);">✅ Drive ID detected: ' + id + '</div>';
  } else if (url.length > 0) {
    previewEl.innerHTML = '<div style="margin-top:0.5rem;padding:0.5rem 0.8rem;background:rgba(192,57,43,0.08);border:1px solid rgba(192,57,43,0.2);border-radius:3px;font-family:var(--font-mono);font-size:0.72rem;color:#e74c3c;">⚠️ Could not detect a Drive file ID. Make sure you paste the share link from Google Drive.</div>';
  } else {
    previewEl.innerHTML = '';
  }
}

function handlePosterFile(event, i) {
  const file = event.target.files[0];
  if (!file) return;
  const area = document.getElementById('vid-poster-area-' + i);
  const reader = new FileReader();
  reader.onload = function(e) {
    DATA.videos[i].posterData = e.target.result;
    area.innerHTML = '<span style="color:var(--accent)">✅ Thumbnail ready — ' + file.name + '</span>';
  };
  reader.readAsDataURL(file);
}

function removeVideo(i) { DATA.videos.splice(i, 1); renderVideoEditor(); }

function addVideo() {
  DATA.videos.push({title:'My Video',cat:'Category',desc:'Describe this video.',tags:['CapCut'],type:'video',driveUrl:'',posterData:''});
  renderVideoEditor();
  setTimeout(() => {
    const cards = document.querySelectorAll('#videos-editor .admin-card');
    if (cards.length) cards[cards.length-1].scrollIntoView({behavior:'smooth'});
  }, 100);
}

function renderSkillsEditor() {
  const c = document.getElementById('skills-editor'); c.innerHTML = '';
  DATA.skills.forEach((s,i) => {
    c.innerHTML += `<div class="admin-card"><div class="admin-card-header"><span class="admin-card-title">Skill ${i+1}: ${s.title}</span><button class="admin-btn-remove" onclick="removeSkill(${i})">Remove</button></div>
      <div class="form-row"><div class="form-group"><label>Icon (emoji)</label><input type="text" id="sk-icon-${i}" value="${s.icon}"></div><div class="form-group"><label>Title</label><input type="text" id="sk-title-${i}" value="${s.title}"></div></div>
      <div class="form-group"><label>Description</label><textarea id="sk-desc-${i}" rows="2">${s.desc}</textarea></div>
      <div class="form-group"><label>Items (comma-separated)</label><input type="text" id="sk-items-${i}" value="${s.items.join(', ')}"></div></div>`;
  });
}
function removeSkill(i) { DATA.skills.splice(i,1); renderSkillsEditor(); }
function addSkillCard() { DATA.skills.push({icon:'⭐',title:'New Skill',desc:'Description.',items:['Tool 1']}); renderSkillsEditor(); }

function renderProjectsEditor() {
  const c = document.getElementById('projects-editor'); c.innerHTML = '';
  DATA.projects.forEach((p,i) => {
    c.innerHTML += `<div class="admin-card"><div class="admin-card-header"><span class="admin-card-title">Project ${i+1}: ${p.title}</span><button class="admin-btn-remove" onclick="removeProject(${i})">Remove</button></div>
      <div class="form-row"><div class="form-group"><label>Emoji</label><input type="text" id="pj-emoji-${i}" value="${p.emoji}"></div><div class="form-group"><label>Category</label><input type="text" id="pj-cat-${i}" value="${p.cat}"></div></div>
      <div class="form-group"><label>Title</label><input type="text" id="pj-title-${i}" value="${p.title}"></div>
      <div class="form-group"><label>Description</label><textarea id="pj-desc-${i}" rows="2">${p.desc}</textarea></div>
      <div class="form-group"><label>Tags (comma-separated)</label><input type="text" id="pj-tags-${i}" value="${p.tags.join(', ')}"></div></div>`;
  });
}
function removeProject(i) { DATA.projects.splice(i,1); renderProjectsEditor(); }
function addProject() { DATA.projects.push({emoji:'🎬',cat:'Category',title:'New Project',desc:'Description.',tags:['Tag']}); renderProjectsEditor(); }

function renderExpEditor() {
  const c = document.getElementById('exp-editor'); c.innerHTML = '';
  DATA.experience.forEach((e,i) => {
    c.innerHTML += `<div class="admin-card"><div class="admin-card-header"><span class="admin-card-title">Job ${i+1}: ${e.role}</span><button class="admin-btn-remove" onclick="removeExp(${i})">Remove</button></div>
      <div class="form-row"><div class="form-group"><label>Years</label><input type="text" id="ex-year-${i}" value="${e.year}"></div><div class="form-group"><label>Company</label><input type="text" id="ex-co-${i}" value="${e.company}"></div></div>
      <div class="form-group"><label>Role</label><input type="text" id="ex-role-${i}" value="${e.role}"></div>
      <div class="form-group"><label>Description</label><textarea id="ex-desc-${i}" rows="2">${e.desc}</textarea></div></div>`;
  });
}
function removeExp(i) { DATA.experience.splice(i,1); renderExpEditor(); }
function addExp() { DATA.experience.push({year:'2024 — Present',role:'New Role',company:'Company',desc:'Description.'}); renderExpEditor(); }

function renderEduEditor() {
  const c = document.getElementById('edu-editor'); c.innerHTML = '';
  DATA.education.forEach((e,i) => {
    c.innerHTML += `<div class="admin-card"><div class="admin-card-header"><span class="admin-card-title">Edu ${i+1}: ${e.degree}</span><button class="admin-btn-remove" onclick="removeEdu(${i})">Remove</button></div>
      <div class="form-group"><label>Degree / Certification</label><input type="text" id="ed-deg-${i}" value="${e.degree}"></div>
      <div class="form-row"><div class="form-group"><label>Institution</label><input type="text" id="ed-school-${i}" value="${e.school}"></div><div class="form-group"><label>Year</label><input type="text" id="ed-year-${i}" value="${e.year}"></div></div></div>`;
  });
}
function removeEdu(i) { DATA.education.splice(i,1); renderEduEditor(); }
function addEdu() { DATA.education.push({degree:'New Degree',school:'Institution',year:'2024'}); renderEduEditor(); }

function renderTestiEditor() {
  const c = document.getElementById('testi-editor'); c.innerHTML = '';
  DATA.testimonials.forEach((t,i) => {
    c.innerHTML += `<div class="admin-card"><div class="admin-card-header"><span class="admin-card-title">Review ${i+1}: ${t.name}</span><button class="admin-btn-remove" onclick="removeTesti(${i})">Remove</button></div>
      <div class="form-group"><label>Quote</label><textarea id="ts-text-${i}" rows="3">${t.text}</textarea></div>
      <div class="form-row"><div class="form-group"><label>Name</label><input type="text" id="ts-name-${i}" value="${t.name}"></div><div class="form-group"><label>Role</label><input type="text" id="ts-role-${i}" value="${t.role}"></div></div>
      <div class="form-group"><label>Initials (2 chars)</label><input type="text" id="ts-init-${i}" value="${t.initials}" maxlength="2"></div></div>`;
  });
}
function removeTesti(i) { DATA.testimonials.splice(i,1); renderTestiEditor(); }
function addTesti() { DATA.testimonials.push({text:'Great work!',name:'Client Name',role:'Job Title',initials:'CN'}); renderTestiEditor(); }

/* ═══════════════════════════════════════════════════════
   COLOR GRADING ADMIN EDITOR
═══════════════════════════════════════════════════════ */
function renderCGEditor() {
  const c = document.getElementById('cg-editor');
  if (!c) return;
  c.innerHTML = '';
  if (!DATA.colorGrading) DATA.colorGrading = [];
  DATA.colorGrading.forEach((s, i) => {
    const hasBefore = s.beforeData && s.beforeData.length > 50;
    const hasAfter  = s.afterData  && s.afterData.length  > 50;
    c.innerHTML +=
      '<div class="admin-card" id="cg-card-' + i + '">' +
      '<div class="admin-card-header">' +
      '<span class="admin-card-title">Shot ' + (i+1) + ': ' + (s.title||'Untitled') + '</span>' +
      '<button class="admin-btn-remove" onclick="removeCGShot(' + i + ')">Remove</button>' +
      '</div>' +

      // Before image upload
      '<div class="form-group">' +
      '<label>📷 BEFORE Image (ungraded / raw)</label>' +
      '<div class="cg-upload-area" onclick="document.getElementById(\'cg-before-file-' + i + '\').click()">' +
      (hasBefore ? '<span style="color:var(--accent)">✅ Before image uploaded</span>' : '<span>📁 Click to upload BEFORE image (JPG/PNG)</span>') +
      '</div>' +
      (hasBefore ? '<div class="cg-preview-strip"><img class="cg-preview-img" src="' + s.beforeData + '" alt="before"></div>' : '') +
      '<input type="file" id="cg-before-file-' + i + '" accept="image/*" style="display:none" onchange="handleCGImageFile(event,' + i + ',\'before\')">' +
      '</div>' +

      // After image upload
      '<div class="form-group">' +
      '<label>✨ AFTER Image (color graded)</label>' +
      '<div class="cg-upload-area" onclick="document.getElementById(\'cg-after-file-' + i + '\').click()">' +
      (hasAfter  ? '<span style="color:var(--accent)">✅ After image uploaded</span>'  : '<span>📁 Click to upload AFTER image (JPG/PNG)</span>') +
      '</div>' +
      (hasAfter ? '<div class="cg-preview-strip"><img class="cg-preview-img" src="' + s.afterData + '" alt="after"></div>' : '') +
      '<input type="file" id="cg-after-file-' + i + '" accept="image/*" style="display:none" onchange="handleCGImageFile(event,' + i + ',\'after\')">' +
      '</div>' +

      // Meta fields
      '<div class="form-row">' +
      '<div class="form-group"><label>Category</label><input type="text" id="cg-cat-' + i + '" value="' + (s.cat||'Color Grading') + '"></div>' +
      '<div class="form-group"><label>Title</label><input type="text" id="cg-title-' + i + '" value="' + (s.title||'') + '"></div>' +
      '</div>' +
      '<div class="form-group"><label>Description</label><textarea id="cg-desc-' + i + '" rows="2">' + (s.desc||'') + '</textarea></div>' +
      '<div class="form-group"><label>Tags (comma-separated)</label><input type="text" id="cg-tags-' + i + '" value="' + (s.tags||[]).join(', ') + '"></div>' +
      '</div>';
  });
}

function handleCGImageFile(event, i, type) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    if (type === 'before') DATA.colorGrading[i].beforeData = e.target.result;
    else                   DATA.colorGrading[i].afterData  = e.target.result;
    renderCGEditor();
  };
  reader.readAsDataURL(file);
}

function removeCGShot(i) {
  DATA.colorGrading.splice(i, 1);
  renderCGEditor();
}

function addColorGradingShot() {
  if (!DATA.colorGrading) DATA.colorGrading = [];
  DATA.colorGrading.push({ cat:'Color Grading', title:'New Shot', desc:'', tags:['LUT','Grade'], beforeData:'', afterData:'' });
  renderCGEditor();
  setTimeout(() => {
    const cards = document.querySelectorAll('#cg-editor .admin-card');
    if (cards.length) cards[cards.length-1].scrollIntoView({behavior:'smooth'});
  }, 100);
}

function applyChanges() {
  DATA.name = get('edit-name');
  DATA.badge = get('edit-badge');
  DATA.h1line1 = get('edit-h1-line1'); DATA.h1line2 = get('edit-h1-line2'); DATA.h1line3 = get('edit-h1-line3');
  DATA.tagline = get('edit-tagline');
  DATA.tags = get('edit-tags').split(',').map(s=>s.trim()).filter(Boolean);
  DATA.stat1n = get('edit-s1n'); DATA.stat1l = get('edit-s1l');
  DATA.stat2n = get('edit-s2n'); DATA.stat2l = get('edit-s2l');
  DATA.stat3n = get('edit-s3n'); DATA.stat3l = get('edit-s3l');
  DATA.avatar = get('edit-avatar'); DATA.visualLabel = get('edit-visual-label');
  DATA.aboutHeading = get('edit-about-heading');
  DATA.aboutP1 = get('edit-about-p1'); DATA.aboutP2 = get('edit-about-p2');
  DATA.pills = get('edit-pills').split(',').map(s=>s.trim()).filter(Boolean);
  DATA.email = get('edit-email'); DATA.location = get('edit-location');
  DATA.availability = get('edit-avail'); DATA.contactTagline = get('edit-contact-tagline');
  DATA.emailjsPublicKey = get('edit-ejs-pubkey');
  DATA.emailjsServiceId = get('edit-ejs-service');
  DATA.emailjsTemplateId = get('edit-ejs-template');

  DATA.videos = DATA.videos.map((v,i)=>({
    driveUrl: (document.getElementById('vid-drive-url-'+i) ? document.getElementById('vid-drive-url-'+i).value.trim() : (v.driveUrl||'')),
    posterData: v.posterData || '',
    type: (document.getElementById('vid-type-'+i) ? document.getElementById('vid-type-'+i).value : (v.type||'video')),
    cat: get('vid-cat-'+i),
    title: get('vid-title-'+i),
    desc: get('vid-desc-'+i),
    tags: get('vid-tags-'+i).split(',').map(s=>s.trim()).filter(Boolean)
  }));
  if (!DATA.colorGrading) DATA.colorGrading = [];
  DATA.colorGrading = DATA.colorGrading.map((s,i)=>({
    cat:        get('cg-cat-'+i)   || 'Color Grading',
    title:      get('cg-title-'+i) || 'Untitled Shot',
    desc:       get('cg-desc-'+i)  || '',
    tags:       get('cg-tags-'+i).split(',').map(t=>t.trim()).filter(Boolean),
    beforeData: s.beforeData || '',
    afterData:  s.afterData  || ''
  }));
  DATA.skills = DATA.skills.map((_,i)=>({
    icon: get(`sk-icon-${i}`), title: get(`sk-title-${i}`),
    desc: get(`sk-desc-${i}`), items: get(`sk-items-${i}`).split(',').map(s=>s.trim()).filter(Boolean)
  }));
  DATA.projects = DATA.projects.map((_,i)=>({
    emoji: get(`pj-emoji-${i}`), cat: get(`pj-cat-${i}`),
    title: get(`pj-title-${i}`), desc: get(`pj-desc-${i}`),
    tags: get(`pj-tags-${i}`).split(',').map(s=>s.trim()).filter(Boolean)
  }));
  DATA.experience = DATA.experience.map((_,i)=>({
    year: get(`ex-year-${i}`), company: get(`ex-co-${i}`),
    role: get(`ex-role-${i}`), desc: get(`ex-desc-${i}`)
  }));
  DATA.education = DATA.education.map((_,i)=>({
    degree: get(`ed-deg-${i}`), school: get(`ed-school-${i}`), year: get(`ed-year-${i}`)
  }));
  DATA.testimonials = DATA.testimonials.map((_,i)=>({
    text: get(`ts-text-${i}`), name: get(`ts-name-${i}`),
    role: get(`ts-role-${i}`), initials: get(`ts-init-${i}`)
  }));

  render();
  saveToLocalStorage();
  const btn = document.querySelector('.admin-save');
  btn.textContent = '⏳ Syncing…'; btn.disabled = true;
  autoSyncToGitHub().then(() => {
    btn.textContent = '✅ Saved & Synced!'; btn.disabled = false;
    setTimeout(() => btn.textContent = '💾 Save Changes', 2200);
  }).catch(() => {
    btn.textContent = '✅ Saved (no sync)'; btn.disabled = false;
    setTimeout(() => btn.textContent = '💾 Save Changes', 2200);
  });
}

async function checkExportSize() {
  applyChanges();
  const bar   = document.getElementById('export-size-bar');
  const label = document.getElementById('export-size-label');
  bar.style.display = 'block';
  label.innerHTML = '⏳ Calculating…';

  const compressed = await compressDataImages(DATA);
  const html  = await buildExportHTML(compressed);
  const bytes = new Blob([html]).size;
  const mb    = (bytes / 1024 / 1024).toFixed(2);
  const kb    = (bytes / 1024).toFixed(0);

  let color, msg;
  if (bytes > 3 * 1024 * 1024) {
    color = '#e74c3c';
    msg = '⚠️ <strong>' + mb + ' MB</strong> — Too large for GitHub Pages preview.<br>' +
          'Fix: Use a smaller profile photo (under 200KB). Resize it at <a href="https://squoosh.app" target="_blank" style="color:var(--accent)">squoosh.app</a> before uploading.';
  } else if (bytes > 1 * 1024 * 1024) {
    color = '#f39c12';
    msg = '⚠️ <strong>' + mb + ' MB</strong> — Moderate. Will work on GitHub Pages but may be slow.<br>' +
          'Tip: Use a smaller profile photo for best speed.';
  } else {
    color = '#2ecc71';
    msg = '✅ <strong>' + (bytes > 1024*1024 ? mb + ' MB' : kb + ' KB') + '</strong> — GitHub Pages ready! Safe to export and upload.';
  }

  label.innerHTML = msg;
  bar.style.borderColor = color;
}


function compressImage(dataUrl, maxW, q) {
  return new Promise(resolve => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) { resolve(dataUrl); return; }
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL('image/jpeg', q));
    };
    img.onerror = () => resolve(''); // drop broken images
    img.src = dataUrl;
  });
}

async function compressDataImages(data) {
  const d = JSON.parse(JSON.stringify(data)); // deep clone, don't mutate live DATA

  if (d.avatar && d.avatar.startsWith('data:image'))
    d.avatar = await compressImage(d.avatar, 300, 0.65);

  for (let i = 0; i < (d.videos||[]).length; i++) {
    const v = d.videos[i];
    if (v.posterData && v.posterData.startsWith('data:image'))
      v.posterData = await compressImage(v.posterData, 600, 0.60);
    delete v.videoData; delete v.beforeData;
    delete v.fileName;  delete v.beforeFileName; delete v.mimeType;
  }

  for (let i = 0; i < (d.colorGrading||[]).length; i++) {
    const s = d.colorGrading[i];
    if (s.beforeData && s.beforeData.startsWith('data:image'))
      s.beforeData = await compressImage(s.beforeData, 1200, 0.72);
    if (s.afterData && s.afterData.startsWith('data:image'))
      s.afterData  = await compressImage(s.afterData,  1200, 0.72);
  }

  return d;
}

async function buildExportHTML(exportData) {
  var src = document.documentElement.outerHTML;

  // ── Close admin/pwd panels in export ──
  src = src.replace(/<div id="admin-panel"([^>]*)>/g, function(m, attrs) {
    return '<div id="admin-panel"' + attrs.replace(/\bopen\b/g, '').replace(/class="\s*"/g, 'class=""') + '>';
  });
  src = src.replace(/<div id="pwd-prompt"([^>]*)>/g, function(m, attrs) {
    return '<div id="pwd-prompt"' + attrs.replace(/\bopen\b/g, '').replace(/class="\s*"/g, 'class=""') + '>';
  });

  // ── Fetch all external JS files and inline them ──
  var scripts = ['protection.js', 'data.js', 'main.js', 'intro.js', 'ui.js'];
  var inlined = {};
  for (var i = 0; i < scripts.length; i++) {
    try {
      var r = await fetch(scripts[i] + '?v=' + Date.now());
      inlined[scripts[i]] = r.ok ? await r.text() : '/* ' + scripts[i] + ' not fetched */';
    } catch(e) {
      inlined[scripts[i]] = '/* ' + scripts[i] + ' fetch error */';
    }
  }

  // ── Inject current DATA into the data.js content ──
  var dataBlock = 'const DATA = ' + JSON.stringify(exportData) + ';';
  var dataContent = inlined['data.js'] || '';
  // Replace the existing DATA declaration in data.js
  var dataReplaced = dataContent.replace(/const DATA\s*=\s*\{[\s\S]*?\};?\s*(?=\n|$)/, dataBlock);
  if (dataReplaced === dataContent) {
    // fallback: prepend the new DATA block
    dataReplaced = dataBlock + '\n\n' + dataContent.replace(/const DATA\s*=[\s\S]*?(?=\nconst |\nvar |\nfunction |$)/, '');
  }
  inlined['data.js'] = dataReplaced;

  // ── Replace all <script src="..."> tags with inline <script> blocks ──
  src = src.replace(/<script\s+src="(protection\.js|data\.js|main\.js|intro\.js|ui\.js)"[^>]*><\/script>/g,
    function(match, filename) {
      var content = inlined[filename] || '';
      return '<script>\n' + content + '\n</script>';
    }
  );

  // ── Remove cursor elements that were injected into DOM (they get re-created by script) ──
  // Keep them since the script recreates cursor logic

  return src;
}

function showSizeBar(bytes, color, msg) {
  const bar   = document.getElementById('export-size-bar');
  const label = document.getElementById('export-size-label');
  if (!bar || !label) return;
  const kb = (bytes / 1024).toFixed(0);
  const mb = (bytes / 1024 / 1024).toFixed(2);
  label.innerHTML = msg + ' &nbsp;|&nbsp; Size: <strong style="color:' + color + '">' +
    (bytes > 1024*1024 ? mb + ' MB' : kb + ' KB') + '</strong>';
  bar.style.display = 'block';
  bar.style.borderColor = color;
}

async function exportHTML() {
  applyChanges();
  var adminEl = document.getElementById('admin-panel');
  var pwdEl   = document.getElementById('pwd-prompt');
  if (adminEl) adminEl.classList.remove('open');
  if (pwdEl)   pwdEl.classList.remove('open');

  const btn = document.querySelector('.admin-export');
  btn.textContent = '⏳ Compressing…'; btn.disabled = true;

  try {
    const compressed = await compressDataImages(DATA);
    const html       = await buildExportHTML(compressed);
    const bytes      = new Blob([html]).size;

    if (bytes > 3 * 1024 * 1024) {
      showSizeBar(bytes, '#e74c3c',
        '⚠️ Still large — your profile photo may be very high-res. Try a smaller photo.');
    } else if (bytes > 1 * 1024 * 1024) {
      showSizeBar(bytes, '#f39c12', '⚠️ Moderate size — should work on GitHub Pages');
    } else {
      showSizeBar(bytes, '#2ecc71', '✅ Great — well within GitHub Pages limits');
    }

    const blob = new Blob([html], {type:'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (DATA.name.replace(/\s+/g,'_') || 'portfolio') + '.html';
    a.click();
    btn.textContent = '✅ Exported!';
  } catch(err) {
    console.error(err);
    btn.textContent = '❌ Failed';
  }

  btn.disabled = false;
  setTimeout(() => btn.textContent = '📤 Export HTML', 3000);
}

function toggleSendBtn() {
  var cb  = document.getElementById('tnc-checkbox');
  var btn = document.getElementById('send-btn');
  var lbl = document.getElementById('send-btn-label');
  if (!btn) return;
  btn.disabled = !cb.checked;
  if (lbl) lbl.textContent = cb.checked ? 'Send Message' : 'Send Message';
}
function openTnC() {
  var modal = document.getElementById('tnc-modal');
  if (modal) modal.classList.add('open');
}
function closeTnC() {
  var modal = document.getElementById('tnc-modal');
  if (modal) modal.classList.remove('open');
}
function closeTnCIfOutside(e) {
  if (e.target === document.getElementById('tnc-modal')) closeTnC();
}
function acceptTnC() {
  var cb = document.getElementById('tnc-checkbox');
  if (cb) { cb.checked = true; toggleSendBtn(); }
  closeTnC();
}

async function sendMessage() {
  var tnc = document.getElementById('tnc-checkbox');
  if (tnc && !tnc.checked) return;

  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  const errEl   = document.getElementById('form-error');
  const sucEl   = document.getElementById('form-success');
  const btn     = document.getElementById('send-btn');
  const lbl     = document.getElementById('send-btn-label');

  errEl.style.display = 'none'; sucEl.style.display = 'none';
  function showErr(msg) { errEl.textContent = '⚠️ ' + msg; errEl.style.display = 'block'; }

  if (!name)    { showErr('Please enter your name.'); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('Please enter a valid email.'); return; }
  if (!message) { showErr('Please write a message.'); return; }
  if (!DATA.emailjsPublicKey || DATA.emailjsPublicKey === 'YOUR_PUBLIC_KEY') {
    showErr('Email not configured yet. Open admin panel → Contact tab and enter your EmailJS keys.');
    return;
  }

  if (lbl) lbl.textContent = 'Sending…';
  btn.disabled = true;
  try {
    emailjs.init({ publicKey: DATA.emailjsPublicKey });
    await emailjs.send(DATA.emailjsServiceId, DATA.emailjsTemplateId, {
      from_name: name, from_email: email,
      subject: subject || 'Portfolio Inquiry', message: message
    });
    sucEl.style.display = 'block';
    ['cf-name','cf-email','cf-subject','cf-message'].forEach(id => document.getElementById(id).value = '');
    if (tnc) { tnc.checked = false; toggleSendBtn(); }
  } catch(err) {
    showErr('Failed to send: ' + (err.text || err.message || 'Please try again.'));
    btn.disabled = false;
  }
  if (lbl) lbl.textContent = 'Send Message';
}

var LS_KEY = 'portfolio_data_v1';

function saveToLocalStorage() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(DATA));
  } catch(e) { console.warn('localStorage save failed:', e); }
}

function loadFromLocalStorage() {
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    var saved = JSON.parse(raw);
    Object.keys(saved).forEach(function(k) { DATA[k] = saved[k]; });
    return true;
  } catch(e) {
    console.warn('localStorage load failed:', e);
    return false;
  }
}

var GH_KEY = 'portfolio_gh_settings';

var GH_DEFAULTS = { user: 'hrs-editz', repo: 'Portfolio', file: 'index.html' };

function saveGitHubSettings() {
  var s = {
    user: (document.getElementById('gh-user').value.trim()) || GH_DEFAULTS.user,
    repo: (document.getElementById('gh-repo').value.trim()) || GH_DEFAULTS.repo,
    file: (document.getElementById('gh-file').value.trim()) || GH_DEFAULTS.file,
    token: document.getElementById('gh-token').value.trim()
  };
  localStorage.setItem(GH_KEY, JSON.stringify(s));
  showGhStatus('✅ Settings saved to this browser.', '#2ecc71');
}

function loadGitHubSettings() {
  try {
    var s = JSON.parse(localStorage.getItem(GH_KEY) || '{}');
    document.getElementById('gh-user').value = s.user || GH_DEFAULTS.user;
    document.getElementById('gh-repo').value = s.repo || GH_DEFAULTS.repo;
    document.getElementById('gh-file').value = s.file || GH_DEFAULTS.file;
    if (s.token) document.getElementById('gh-token').value = s.token;
  } catch(e) {}
}

function getGitHubSettings() {
  try {
    var s = JSON.parse(localStorage.getItem(GH_KEY) || '{}');
    return {
      user:  s.user  || GH_DEFAULTS.user,
      repo:  s.repo  || GH_DEFAULTS.repo,
      file:  s.file  || GH_DEFAULTS.file,
      token: s.token || ''
    };
  } catch(e) { return GH_DEFAULTS; }
}

function showGhStatus(msg, color) {
  var el = document.getElementById('gh-status');
  if (!el) return;
  var bg = color === '#e74c3c' ? 'rgba(192,57,43,0.1)'
         : color === '#2ecc71' ? 'rgba(46,204,113,0.08)'
         : color === '#3498db' ? 'rgba(52,152,219,0.08)'
         : 'rgba(243,156,18,0.08)';
  el.style.cssText = 'display:block;background:' + bg + ';border:1px solid ' + color + '66;color:' + color + ';padding:0.8rem 1rem;border-radius:3px;font-family:var(--font-mono);font-size:0.73rem;line-height:1.7;margin-top:0.9rem;';
  el.innerHTML = msg;
  setTimeout(function(){ el.scrollIntoView({behavior:'smooth', block:'nearest'}); }, 120);
}

async function testGitHubConnection() {
  var s = getGitHubSettings();
  if (!s.token || !s.user || !s.repo) {
    showGhStatus('⚠️ Enter your GitHub Token first.', '#f39c12'); return;
  }
  showGhStatus('🔌 Testing connection…', '#3498db');
  try {
    var r = await fetch('https://api.github.com/repos/' + s.user + '/' + s.repo, {
      headers: { 'Authorization': 'token ' + s.token, 'Accept': 'application/vnd.github.v3+json' }
    });
    var d = await r.json();
    if (r.ok) {
      showGhStatus('✅ Connected to <strong>' + d.full_name + '</strong>. Repo is ' + (d.private ? '🔒 private' : '🌐 public') + '.', '#2ecc71');
    } else {
      showGhStatus('❌ Error: ' + (d.message || 'Connection failed. Check your token and repo name.'), '#e74c3c');
    }
  } catch(e) { showGhStatus('❌ Network error: ' + e.message, '#e74c3c'); }
}

async function publishToGitHub() {
  // ── 1. Make sure admin panel is open and status is visible ──
  var adminEl = document.getElementById('admin-panel');
  var pwdEl   = document.getElementById('pwd-prompt');
  if (adminEl) adminEl.classList.add('open');
  if (pwdEl)   pwdEl.classList.remove('open');

  // Switch to publish tab without relying on event object
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  var pubTab = document.querySelector('.admin-tab[onclick*="publish"]');
  if (pubTab) pubTab.classList.add('active');
  var pubSec = document.getElementById('tab-publish');
  if (pubSec) pubSec.classList.add('active');

  // Force status bar visible immediately so user sees feedback
  var statusEl = document.getElementById('gh-status');
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.style.background = 'rgba(243,156,18,0.1)';
    statusEl.style.border = '1px solid #f39c1244';
    statusEl.style.color = '#f39c12';
    statusEl.innerHTML = '⏳ Starting publish — please wait…';
    setTimeout(function(){ statusEl.scrollIntoView({behavior:'smooth', block:'nearest'}); }, 150);
  }

  // ── 2. Read settings directly from the input fields ──
  var ghUser  = (document.getElementById('gh-user')  ? document.getElementById('gh-user').value.trim()  : '') || 'hrs-editz';
  var ghRepo  = (document.getElementById('gh-repo')  ? document.getElementById('gh-repo').value.trim()  : '') || 'Portfolio';
  var ghFile  = (document.getElementById('gh-file')  ? document.getElementById('gh-file').value.trim()  : '') || 'index.html';
  var ghToken = (document.getElementById('gh-token') ? document.getElementById('gh-token').value.trim() : '');

  // Also try localStorage as fallback
  if (!ghToken) {
    try {
      var stored = JSON.parse(localStorage.getItem('portfolio_gh_settings') || '{}');
      if (stored.token) ghToken = stored.token;
    } catch(e) {}
  }

  if (!ghToken) {
    showGhStatus('⚠️ No GitHub token found. Enter your Personal Access Token in the field above and click 💾 Save Settings first.', '#f39c12');
    return;
  }

  // ── 3. Disable publish buttons ──
  var publishBtns = document.querySelectorAll('button[onclick="publishToGitHub()"], button[onclick*="publishToGitHub"]');
  publishBtns.forEach(function(b) { b.disabled = true; b.style.opacity = '0.5'; });

  var apiBase = 'https://api.github.com/repos/' + ghUser + '/' + ghRepo + '/contents/' + ghFile;
  var headers = {
    'Authorization': 'token ' + ghToken,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  try {
    // ── 4. Save current form values into DATA ──
    showGhStatus('⏳ Saving changes…', '#f39c12');
    try { applyChanges(); } catch(e) { console.warn('applyChanges error:', e); }

    // ── 5. Compress images ──
    showGhStatus('⏳ Compressing images…', '#f39c12');
    var compressed;
    try {
      compressed = await compressDataImages(DATA);
    } catch(e) {
      compressed = JSON.parse(JSON.stringify(DATA)); // fallback: uncompressed clone
    }

    // ── 6. Build the HTML export (fetches & inlines all JS files) ──
    showGhStatus('⏳ Building HTML — fetching scripts to inline…', '#f39c12');
    var html;
    try {
      html = await buildExportHTML(compressed);
    } catch(e) {
      showGhStatus('❌ Failed to build HTML: ' + e.message, '#e74c3c');
      publishBtns.forEach(function(b) { b.disabled = false; b.style.opacity = ''; });
      return;
    }

    if (!html || html.length < 500) {
      showGhStatus('❌ HTML export came out empty or too small. Please try again.', '#e74c3c');
      publishBtns.forEach(function(b) { b.disabled = false; b.style.opacity = ''; });
      return;
    }

    // ── 7. Base64 encode safely ──
    showGhStatus('⏳ Encoding for GitHub…', '#f39c12');
    var encoded;
    try {
      // Safe UTF-8 → base64 that handles all characters
      var bytes = new TextEncoder().encode(html);
      var binary = '';
      for (var i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      encoded = btoa(binary);
    } catch(e) {
      try { encoded = btoa(unescape(encodeURIComponent(html))); }
      catch(e2) {
        showGhStatus('❌ Encoding failed: ' + e2.message, '#e74c3c');
        publishBtns.forEach(function(b) { b.disabled = false; b.style.opacity = ''; });
        return;
      }
    }

    // ── 8. Get current file SHA (needed for update) ──
    showGhStatus('⏳ Connecting to GitHub…', '#f39c12');
    var sha = null;
    try {
      var getResp = await fetch(apiBase, { headers: headers });
      if (getResp.ok) {
        var fileData = await getResp.json();
        sha = fileData.sha;
      } else if (getResp.status === 401) {
        showGhStatus('❌ Authentication failed — your GitHub token is invalid or expired. <a href="https://github.com/settings/tokens/new?scopes=repo&description=Portfolio+Publisher" target="_blank" style="color:var(--accent);">Create a new token ↗</a>', '#e74c3c');
        publishBtns.forEach(function(b) { b.disabled = false; b.style.opacity = ''; });
        return;
      } else if (getResp.status === 404) {
        // File doesn't exist yet — will create it fresh (sha stays null)
        sha = null;
      } else {
        var errTxt = await getResp.text();
        showGhStatus('❌ GitHub read error (' + getResp.status + '): ' + errTxt, '#e74c3c');
        publishBtns.forEach(function(b) { b.disabled = false; b.style.opacity = ''; });
        return;
      }
    } catch(e) {
      showGhStatus('❌ Network error reaching GitHub: ' + e.message, '#e74c3c');
      publishBtns.forEach(function(b) { b.disabled = false; b.style.opacity = ''; });
      return;
    }

    // ── 9. Push to GitHub ──
    showGhStatus('⏳ Uploading to GitHub — please wait…', '#f39c12');
    var body = { message: '🎬 Portfolio update via admin panel', content: encoded };
    if (sha) body.sha = sha;

    var putResp = await fetch(apiBase, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body)
    });

    var putData;
    try { putData = await putResp.json(); } catch(e) { putData = {}; }

    if (putResp.ok) {
      var liveUrl = 'https://' + ghUser + '.github.io/' + ghRepo + '/';
      showGhStatus(
        '✅ <strong>Published successfully!</strong> Your site is updating now.<br>' +
        '🌐 Live in ~60 seconds: <a href="' + liveUrl + '" target="_blank" style="color:var(--accent);">' + liveUrl + ' ↗</a><br>' +
        '<span style="color:var(--muted);font-size:0.68rem;">Changes committed to GitHub — GitHub Pages will rebuild automatically.</span>',
        '#2ecc71'
      );
      // Save settings to localStorage after successful publish
      try {
        localStorage.setItem('portfolio_gh_settings', JSON.stringify({ user: ghUser, repo: ghRepo, file: ghFile, token: ghToken }));
      } catch(e) {}
    } else {
      var errMsg = putData.message || JSON.stringify(putData);
      if (putResp.status === 422) errMsg = 'SHA mismatch — file was changed externally. Please try again.';
      if (putResp.status === 401) errMsg = 'Token invalid or missing "repo" permission. <a href="https://github.com/settings/tokens/new?scopes=repo&description=Portfolio+Publisher" target="_blank" style="color:var(--accent);">Create new token ↗</a>';
      showGhStatus('❌ Publish failed (' + putResp.status + '): ' + errMsg, '#e74c3c');
    }

  } catch(e) {
    showGhStatus('❌ Unexpected error: ' + e.message + '<br><small>Open browser console (F12) for details.</small>', '#e74c3c');
    console.error('publishToGitHub error:', e);
  }

  publishBtns.forEach(function(b) { b.disabled = false; b.style.opacity = ''; });
}

async function autoSyncToGitHub() {
  var s = getGitHubSettings();
  if (!s.token || !s.user || !s.repo) return; // not configured, skip silently

  var htmlFile = s.file || 'index.html';
  var folder   = htmlFile.includes('/') ? htmlFile.substring(0, htmlFile.lastIndexOf('/') + 1) : '';
  var dataFile = folder + 'portfolio-data.json';
  var apiBase  = 'https://api.github.com/repos/' + s.user + '/' + s.repo + '/contents/' + dataFile;
  var headers  = {
    'Authorization': 'token ' + s.token,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  var compressed = await compressDataImages(DATA);
  var json       = JSON.stringify(compressed);
  var encoded    = btoa(unescape(encodeURIComponent(json)));

  var sha = null;
  try {
    var getResp = await fetch(apiBase, { headers: headers });
    if (getResp.ok) { var fd = await getResp.json(); sha = fd.sha; }
  } catch(e) {}

  var body = { message: '⚡ Auto-sync portfolio data', content: encoded };
  if (sha) body.sha = sha;

  var putResp = await fetch(apiBase, { method: 'PUT', headers: headers, body: JSON.stringify(body) });
  if (!putResp.ok) throw new Error('GitHub push failed');
}

async function autoFetchFromGitHub() {
  var s = getGitHubSettings();
  if (!s.user || !s.repo) return; // not configured

  var htmlFile = s.file || 'index.html';
  var folder   = htmlFile.includes('/') ? htmlFile.substring(0, htmlFile.lastIndexOf('/') + 1) : '';
  var dataFile = folder + 'portfolio-data.json';

  var rawUrl = 'https://raw.githubusercontent.com/' + s.user + '/' + s.repo + '/main/' + dataFile
             + '?nocache=' + Date.now();
  try {
    var resp = await fetch(rawUrl);
    if (!resp.ok) return;
    var remote = await resp.json();
    Object.keys(remote).forEach(function(k) { DATA[k] = remote[k]; });
    render();
  } catch(e) {
  }
}

(function() {
  var origOpen = window.openAdmin;
  window.openAdmin = function() {
    if (typeof origOpen === 'function') origOpen();
    loadGitHubSettings();
  };
  autoFetchFromGitHub();
})();
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold: 0.08});
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
