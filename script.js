// Chimes Crane Hire — Mockup v4 shared behaviour

// Splash screen (homepage entry only) + page-transition curtain reveal/cover
const splash = document.getElementById('splash');
const pageTrans = document.getElementById('pageTrans');

function revealCurtain() {
  if (!pageTrans) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    pageTrans.style.transform = 'translateY(-100%)';
  }));
}

if (splash) {
  window.addEventListener('load', () => {
    setTimeout(() => { splash.classList.add('hide'); revealCurtain(); }, 850);
  });
} else {
  revealCurtain();
}

if (pageTrans) {
  document.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;
    const dest = new URL(href, window.location.href);
    if (dest.pathname === window.location.pathname) return; // same-page anchor, let browser scroll
    a.addEventListener('click', (e) => {
      e.preventDefault();
      pageTrans.style.transition = 'none';
      pageTrans.style.transform = 'translateY(100%)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        pageTrans.style.transition = 'transform .5s cubic-bezier(.76,0,.24,1)';
        pageTrans.style.transform = 'translateY(0)';
      }));
      setTimeout(() => { window.location.href = href; }, 480);
    });
  });
}

// Header shadow / nav state on scroll
const hdr = document.getElementById('hdr');
if (hdr) window.addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 20));

// Mobile nav toggle
const hbg = document.getElementById('hbg');
if (hbg) hbg.addEventListener('click', () => document.getElementById('nav').classList.toggle('open'));

// Fade-up on scroll
const fus = document.querySelectorAll('.fu');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
fus.forEach(el => io.observe(el));

// Count-up for stats
function countUp(el, target, suffix) {
  let v = 0;
  const step = target / 60;
  const t = setInterval(() => {
    v = Math.min(v + step, target);
    el.textContent = Math.floor(v) + suffix;
    if (v >= target) clearInterval(t);
  }, 22);
}
const sio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const t = parseInt(e.target.dataset.to);
      const suffix = e.target.dataset.suffix !== undefined ? e.target.dataset.suffix : '+';
      if (t) countUp(e.target, t, suffix);
      sio.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-n[data-to]').forEach(el => sio.observe(el));

// Industries clickable list + preview panel
function setIndustry(key) {
  document.querySelectorAll('.ind-li').forEach(el => el.classList.toggle('active', el.dataset.ind === key));
  document.querySelectorAll('.ind-panel-ico').forEach(el => el.classList.toggle('active', el.dataset.ind === key));
  document.querySelectorAll('.ind-panel-txt').forEach(el => el.classList.toggle('active', el.dataset.ind === key));
}
document.querySelectorAll('.ind-li').forEach(li => {
  li.addEventListener('click', () => setIndustry(li.dataset.ind));
  li.addEventListener('mouseenter', () => setIndustry(li.dataset.ind));
});

// Testimonial carousel
const testiSlides = document.querySelectorAll('.testi-slide');
const testiCount = document.getElementById('testiCount');
let testiIdx = 0;
function showTesti(i) {
  testiIdx = (i + testiSlides.length) % testiSlides.length;
  testiSlides.forEach((s, idx) => s.classList.toggle('active', idx === testiIdx));
  if (testiCount) testiCount.textContent = String(testiIdx + 1).padStart(2, '0') + ' / ' + String(testiSlides.length).padStart(2, '0');
}
document.getElementById('testiNext')?.addEventListener('click', () => showTesti(testiIdx + 1));
document.getElementById('testiPrev')?.addEventListener('click', () => showTesti(testiIdx - 1));

// Fleet spec modal
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}
document.querySelectorAll('.modal-backdrop').forEach(m => {
  m.addEventListener('click', (e) => { if (e.target === m) closeModal(m.id); });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-backdrop.open').forEach(m => closeModal(m.id));
});

// Quote form demo submit
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-sub');
  if (!btn) return;
  const original = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Request Sent!';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 3000);
  }, 1200);
}

// Newsletter signup demo
function handleSignup(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const original = btn.textContent;
  btn.textContent = 'Subscribed!';
  e.target.reset();
  setTimeout(() => { btn.textContent = original; }, 2500);
}
