/* ═══════════════════════════════════════════════════
   REOTIMIZA — script.js  (Redesign Premium)
═══════════════════════════════════════════════════ */

// ── CURSOR ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
});

function animateRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0'; ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1'; ring.style.opacity = '1';
});

// ── NAV SCROLL ──────────────────────────────────────
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── MOBILE NAV ──────────────────────────────────────
function openMobileNav()  { document.getElementById('mobileNav').classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeMobileNav() { document.getElementById('mobileNav').classList.remove('open'); document.body.style.overflow = ''; }

// ── REVEAL ON SCROLL ────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ───────────────────────────────
function animateCounter(el, target, suffix, duration = 1200) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const nums = e.target.querySelectorAll('.stat-number');
      nums.forEach(n => {
        const raw    = n.dataset.value  || n.textContent.replace(/\D/g,'');
        const suffix = n.dataset.suffix || n.querySelector('span')?.textContent || '';
        animateCounter(n, parseInt(raw), suffix);
      });
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.hero-stats-bar');
if (statsBar) {
  statsBar.querySelectorAll('.stat-number').forEach(n => {
    n.dataset.value  = n.textContent.replace(/\D/g,'');
    n.dataset.suffix = n.querySelector('span')?.textContent || '';
  });
  statsObserver.observe(statsBar);
}

// ── CAROUSEL COM SETAS (Sobre Nós) ──────────────────
(function initCarousel() {
  const track  = document.getElementById('carouselTrack');
  const dots   = document.querySelectorAll('.carousel-dot');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');
  if (!track) return;

  const total = track.children.length;
  let current = 0;
  let autoTimer = null;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 4000);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  btnNext.addEventListener('click', () => { next(); startAuto(); });
  btnPrev.addEventListener('click', () => { prev(); startAuto(); });

  dots.forEach(d => {
    d.addEventListener('click', () => {
      goTo(parseInt(d.dataset.index));
      startAuto();
    });
  });

  // Swipe touch no carousel
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); startAuto(); }
  }, { passive: true });

  // Pausa no hover
  track.closest('.about-visual-grid').addEventListener('mouseenter', stopAuto);
  track.closest('.about-visual-grid').addEventListener('mouseleave', startAuto);

  startAuto();
})();

// ── SOUND TOGGLE ────────────────────────────────────
function toggleSound(event, videoId) {
  event.preventDefault();
  event.stopPropagation();

  const btn   = event.currentTarget;
  const video = document.getElementById(videoId);
  if (!video) return;

  const isMuted = video.muted;
  video.muted = !isMuted;

  // Atualiza ícone
  const iconMute  = btn.querySelector('.icon-mute');
  const iconSound = btn.querySelector('.icon-sound');
  if (iconMute && iconSound) {
    iconMute.style.display  = isMuted ? 'none' : 'block';
    iconSound.style.display = isMuted ? 'block' : 'none';
  }

  btn.classList.toggle('is-sound-on', isMuted);
  btn.setAttribute('aria-label', isMuted ? 'Desativar som' : 'Ativar som');
}

// ── FORM SUBMIT → WHATSAPP ───────────────────────────
function submitForm() {
  const nome     = document.querySelector('input[placeholder="Seu nome"]').value.trim();
  const empresa  = document.querySelector('input[placeholder="Nome da empresa"]').value.trim();
  const contato  = document.querySelector('input[placeholder*="0000"]').value.trim();
  const servico  = document.querySelector('.form-select').value;
  const mensagem = document.querySelector('.form-textarea').value.trim();

  if (!nome || !empresa || !contato || !servico || !mensagem) {
    ['.form-input', '.form-select', '.form-textarea'].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.value.trim()) {
          el.style.borderColor = 'var(--pink)';
          el.style.animation = 'shake .35s ease';
          setTimeout(() => { el.style.animation = ''; }, 400);
        }
      });
    });
    return;
  }

  const texto = encodeURIComponent(
    `Olá! Me chamo ${nome}\nEmpresa: ${empresa}\nContato: ${contato}\nServiço: ${servico}\nMensagem: ${mensagem}`
  );
  window.open(`https://wa.me/5583987473059?text=${texto}`, '_blank');
  document.querySelectorAll('.form-input, .form-select, .form-textarea')
    .forEach(i => i.value = '');
}

// ── SMOOTH SCROLL ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));

    if (target) {
      e.preventDefault();

      // Scroll suave
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Fecha menu mobile
      closeMobileNav();
    }
  });
});

// ── SERVICE ROW — magnetic effect ──────────────────
document.querySelectorAll('.service-row').forEach(row => {
  row.addEventListener('mousemove', e => {
    const r    = row.getBoundingClientRect();
    const relY = (e.clientY - r.top - r.height / 2) / r.height;
    row.style.transform = `translateY(${relY * 3}px)`;
  });
  row.addEventListener('mouseleave', () => {
    row.style.transform = '';
  });
});

// ── PARALLAX HERO GLOW ──────────────────────────────
const heroGlow = document.querySelector('.hero-bg-glow');
if (heroGlow) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroGlow.style.transform = `translateX(-50%) translateY(${y * 0.18}px)`;
  }, { passive: true });
}
