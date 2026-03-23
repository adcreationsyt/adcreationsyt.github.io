// ===== PAGE TRANSITION =====
document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('.page-main');
  if (main) main.style.animation = 'pageEnter 0.5s ease forwards';
});
document.querySelectorAll('a[href]').forEach(a => {
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('https')) return;
  a.addEventListener('click', e => {
    e.preventDefault();
    const overlay = document.querySelector('.page-transition');
    if (overlay) overlay.classList.add('fade-out');
    setTimeout(() => { window.location.href = href; }, 320);
  });
});

// ===== HAMBURGER =====
(function () {
  const burger   = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!burger || !navLinks) return;
  burger.addEventListener('click', e => {
    e.stopPropagation();
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  }));
  document.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
})();

// ===== ACTIVE NAV LINK =====
(function () {
  const links = document.querySelectorAll('.nav-links a');
  const page  = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const h = a.getAttribute('href');
    if (h === page || (page === '' && h === 'index.html')) a.classList.add('active');
  });
})();

// ===== TICKER INJECTION =====
(function () {
  if (document.querySelector('.ticker')) return;
  const ticker = document.createElement('div');
  ticker.className = 'ticker';
  const items = [
    '15 World Records','183-Letter Word Recited','URF World Record Holder',
    'Camel International Award Dubai 2023','Icon of the Year — America 2023',
    'Top Talent of the Year — America 2023','Asianet News Live Feature',
    'Manorama Online Coverage','Radio Asia 94.7 FM','Ryan International School Sharjah',
    '16 Record Organisations','Forward & Backwards Simultaneous Recitation'
  ];
  const html = [...items, ...items].map(t =>
    `<span class="ticker-item"><span class="dot"></span>${t}</span>`
  ).join('');
  ticker.innerHTML = `<div class="ticker-track">${html}</div>`;
  const nav = document.querySelector('.navbar');
  if (nav) nav.insertAdjacentElement('afterend', ticker);
})();

// ===== CURSOR GLOW =====
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let mx = -999, my = -999, gx = -999, gy = -999, inside = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    if (!inside) { gx = mx; gy = my; inside = true; }
  });
  document.addEventListener('mouseleave', () => { inside = false; });

  function loop() {
    const dist  = Math.hypot(mx - gx, my - gy);
    const speed = dist > 150 ? 0.5 : 0.08; // snap fast when re-entering
    gx += (mx - gx) * speed;
    gy += (my - gy) * speed;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  document.addEventListener('mouseover', e => {
    if (e.target.matches('a,button,.btn,.card,.gallery-item,.contact-link,.stat-item,.timeline-item,.about-block,.photo-strip-item'))
      dot.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.matches('a,button,.btn,.card,.gallery-item,.contact-link,.stat-item,.timeline-item,.about-block,.photo-strip-item'))
      dot.classList.remove('hovering');
  });
})();

// ===== THEME TOGGLE =====
(function () {
  const btn = document.getElementById('themeBtn');
  if (!btn) return;
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode'); btn.textContent = '☀️';
  }
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const light = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', light ? 'light' : 'dark');
    btn.textContent = light ? '☀️' : '🌙';
  });
})();

// ===== SCROLL-DRIVEN REVEAL + FADE OUT =====
// Opacity is calculated from how much of each element is visible in the viewport.
// Starts fading in as soon as top of element enters bottom of screen.
// Fades out as element scrolls above the top of screen.
(function () {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  // Map each element to a { el, seen } record
  const records = els.map(el => ({ el, seen: false }));

  function updateVisibility() {
    const vh = window.innerHeight;
    records.forEach(({ el, seen }, i) => {
      const rect = el.getBoundingClientRect();
      const elH  = rect.height || 1;

      // How far the element has entered from the bottom (0 = just touching, 1 = top of el at bottom of screen)
      const enterRatio = Math.min(Math.max((vh - rect.top) / (vh * 0.55), 0), 1);

      // How far the element has left from the top (0 = bottom just at top, 1 = fully gone)
      const exitRatio  = Math.min(Math.max((-rect.top) / (elH * 0.6), 0), 1);

      // Combined: fade in on enter, fade out on exit
      let opacity   = enterRatio * (1 - exitRatio);
      let translateY = (1 - enterRatio) * 22 - exitRatio * 14;

      // Clamp
      opacity    = Math.min(Math.max(opacity, 0), 1);
      translateY = Math.max(Math.min(translateY, 22), -14);

      el.style.opacity   = opacity;
      el.style.transform = `translateY(${translateY}px)`;
    });
  }

  // Override CSS transition on reveal so JS controls it
  els.forEach(el => {
    el.style.transition = 'none';
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(22px)';
  });

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility, { passive: true });
  updateVisibility();
})();

// ===== HERO PARALLAX — fades based on NEXT SECTION entering view =====
(function () {
  const heroContent = document.querySelector('.hero-content');
  const heroBg      = document.querySelector('.hero-bg');
  const heroEl      = document.querySelector('.hero');
  if (!heroContent || !heroEl) return;

  function update() {
    const y      = window.scrollY;
    const heroH  = heroEl.offsetHeight;

    // Soft drift
    heroContent.style.transform  = `translateY(${y * 0.18}px)`;
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.08}px)`;

    // Fade: don't start until 60% through the hero, fully gone at 100%
    const fadeStart = heroH * 0.60;
    const fadeEnd   = heroH * 1.05;
    const opacity   = y <= fadeStart ? 1
                    : Math.max(1 - (y - fadeStart) / (fadeEnd - fadeStart), 0);
    heroContent.style.opacity = opacity;
  }

  // Don't let JS-driven reveal overwrite hero-content opacity via .reveal class
  if (heroContent.classList.contains('reveal')) heroContent.classList.remove('reveal');

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1800) {
  if (!el) return;
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  let fired = false;
  const cObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      animateCounter(document.getElementById('recordCount'), 15, 1800);
      animateCounter(document.getElementById('longWords'),   20, 1800);
      animateCounter(document.getElementById('maxLetters'), 183, 2000);
    }
  }, { threshold: 0.4 });
  cObs.observe(statsBar);
}

// ===== TEXT SCRAMBLE =====
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
function scramble(el, text, dur = 800) {
  let f = 0, total = Math.floor(dur / 28);
  clearInterval(el._scramble);
  el._scramble = setInterval(() => {
    el.textContent = text.split('').map((ch, i) => {
      if (ch === '\n' || ch === ' ') return ch;
      return f / total > i / text.length ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    if (++f >= total) { el.textContent = text; clearInterval(el._scramble); }
  }, 28);
}
const scrambleObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      scramble(e.target, e.target.dataset.orig || e.target.textContent);
      scrambleObs.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.section-title, .page-header h1').forEach(el => {
  el.dataset.orig = el.textContent;
  scrambleObs.observe(el);
});

// ===== 3D CARD TILT =====
document.querySelectorAll('.card, .about-block, .media-card, .stat-item').forEach(card => {
  card.style.transition = 'transform 0.15s ease, background 0.3s';
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const rx = ((e.clientY - cy) / (r.height / 2)) * -6;
    const ry = ((e.clientX - cx) / (r.width  / 2)) *  6;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * 0.3;
    const dy = (e.clientY - (r.top  + r.height / 2)) * 0.3;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ===== SCROLL PROGRESS BAR =====
(function () {
  const bar = document.createElement('div');
  bar.className = 'scroll-bar';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }, { passive: true });
})();

// ===== BACK TO TOP =====
(function () {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.title     = 'Back to top';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 600), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ===== AMBIENT AUDIO =====
(function () {
  const btn = document.getElementById('audioBtn');
  if (!btn) return;
  const audio = new Audio('assets/audio/ambient.mp3');
  audio.loop   = true;
  audio.volume = 0.35;

  const wasPlaying = sessionStorage.getItem('audioPlaying') === '1';
  const savedTime  = parseFloat(sessionStorage.getItem('audioTime') || '0');

  function setPlaying(on) {
    btn.classList.toggle('playing', on);
    btn.querySelector('.audio-label').textContent = on ? 'Sound On' : 'Sound';
    sessionStorage.setItem('audioPlaying', on ? '1' : '0');
  }

  audio.addEventListener('canplay', () => {
    if (savedTime > 0) audio.currentTime = savedTime;
  }, { once: true });

  if (wasPlaying) {
    audio.muted = true;
    const resume = () => {
      audio.muted = false;
      audio.play().then(() => setPlaying(true)).catch(() => {});
      ['click','keydown','touchstart'].forEach(ev => document.removeEventListener(ev, resume));
    };
    audio.play().then(() => { audio.muted = false; setPlaying(true); }).catch(() => {
      ['click','keydown','touchstart'].forEach(ev => document.addEventListener(ev, resume));
    });
  } else {
    audio.muted = true;
    audio.play().catch(() => {});
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (audio.paused) {
      audio.muted = false;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.muted = !audio.muted;
      setPlaying(!audio.muted);
    }
  });

  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('audioTime',    audio.currentTime);
    sessionStorage.setItem('audioPlaying', (!audio.muted && !audio.paused) ? '1' : '0');
  });
})();

// ===== LIGHTBOX =====
(function () {
  const items = document.querySelectorAll('.gallery-item, .photo-strip-item');
  if (!items.length) return;
  const lb    = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<button class="lightbox-close">✕</button><img src="" alt="">`;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');
  items.forEach(item => item.addEventListener('click', () => {
    lbImg.src = item.querySelector('img').src;
    lb.classList.add('open');
  }));
  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.classList.contains('lightbox-close'))
      lb.classList.remove('open');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lb.classList.remove('open');
  });
})();

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Sent ✓';
    btn.style.background = '#0a8c40';
    setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; }, 3000);
    form.reset();
  });
}

// ===== KONAMI CODE → GITHUB =====
// ===== KONAMI CODE =====
(function () {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  const page = location.pathname.split('/').pop() || 'index.html';
  let pos = 0;
  document.addEventListener('keydown', e => {
    pos = e.key === code[pos] ? pos + 1 : (e.key === code[0] ? 1 : 0);
    if (pos === code.length) {
      pos = 0;
      if (page === 'index.html' || page === '') {
        window.location.href = 'hbd.html';
      } else {
        window.open('https://github.com/adcreationsyt/adcreationsyt.github.io', '_blank');
      }
    }
  });
})();
