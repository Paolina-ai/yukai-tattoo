// Yukaï Tattoo · V2 — animations
// Tout le contenu est visible sans JS ; les animations partent de l'état final (gsap.from).

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const desktop = window.matchMedia('(min-width: 761px)');
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- Menu plein écran ---------- */

const menu = $('#menu');
const menuBtn = $('.menu-btn');
let lenis;

function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.querySelector('span').textContent = open ? 'Fermer' : 'Menu';
  document.documentElement.classList.toggle('menu-open', open);
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    lenis?.stop();
  } else {
    menu.classList.remove('is-open');
    lenis?.start();
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 800);
  }
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
$$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

/* ---------- Filtres ---------- */

const filters = $$('.filter');
const items = $$('.work-track li[data-tags]');
filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-pressed', b === btn);
    });
    items.forEach((li) => { li.hidden = f !== 'all' && !li.dataset.tags.split(' ').includes(f); });
    if (hasGsap) {
      ScrollTrigger.refresh();
      gsap.fromTo(items.filter((li) => !li.hidden), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6, stagger: .04, ease: 'power3.out' });
    }
  });
});

/* ---------- Lightbox ---------- */

const box = $('.lightbox');
const boxImg = $('img', box);
$$('.card, .col img, .flash-board img').forEach((el) => {
  el.addEventListener('click', () => {
    const img = el.tagName === 'IMG' ? el : $('img', el);
    boxImg.src = img.src;
    boxImg.alt = img.alt;
    box.showModal();
    lenis?.stop();
  });
});
box.addEventListener('close', () => lenis?.start());
$('.lightbox-close', box).addEventListener('click', () => box.close());
box.addEventListener('click', (e) => { if (e.target === box) box.close(); });

/* ---------- Curseur + boutons magnétiques ---------- */

if (finePointer && !reduced) {
  document.documentElement.classList.add('has-cursor');
  const cursor = $('.cursor');
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
  (function loop() {
    rx += (x - rx) * .18; ry += (y - ry) * .18;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', (e) => {
    cursor.classList.toggle('is-view', !!e.target.closest('[data-cursor]'));
    cursor.classList.toggle('is-link', !e.target.closest('[data-cursor]') && !!e.target.closest('a, button'));
  });

  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = (e.clientX - r.left - r.width / 2) * .3;
      const my = (e.clientY - r.top - r.height / 2) * .4;
      el.style.transform = `translate(${mx}px, ${my}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1)';
      el.style.transform = '';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });
}

/* ---------- Loader ---------- */

const loader = $('.loader');
let seenLoader = false;
try { seenLoader = sessionStorage.getItem('yk-loader') === '1'; } catch (e) { /* stockage indisponible */ }

function runLoader() {
  return new Promise((resolve) => {
    if (!hasGsap || reduced || seenLoader) {
      loader.classList.add('is-skipped');
      return resolve();
    }
    try { sessionStorage.setItem('yk-loader', '1'); } catch (e) { /* ignore */ }
    const strokes = $$('.lg-stroke path', loader);
    strokes.forEach((p) => {
      const l = p.getTotalLength();
      p.style.strokeDasharray = l;
      p.style.strokeDashoffset = l;
    });
    gsap.timeline({ onComplete: () => { loader.classList.add('is-skipped'); } })
      .to(strokes, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: .03 })
      .from('.lg-fill path', { opacity: 0, scale: .6, transformOrigin: '50% 50%', duration: .5, stagger: .06, ease: 'back.out(2)' }, '-=.35')
      .from('.loader-word', { opacity: 0, letterSpacing: '1.4em', duration: .8, ease: 'power3.out' }, '-=.5')
      .to('.loader-panel', { yPercent: -100, duration: .7, ease: 'power4.inOut' }, '+=.15')
      .add(resolve, '-=.2')
      .to(loader, { yPercent: -100, duration: .8, ease: 'power4.inOut' }, '-=.25');
  });
}

/* ---------- Animations au scroll ---------- */

function initScroll() {
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  // Défilement fluide
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ lerp: .1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const target = $(a.getAttribute('href'));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: 0, duration: 1.4 }); }
    }));
  }

  // Bandeau : accélère avec la vitesse de scroll
  const marquee = $('.marquee-track');
  const anim = marquee.getAnimations?.()[0];
  if (anim) {
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = Math.min(Math.abs(self.getVelocity()) / 300, 6);
        anim.playbackRate = 1 + v;
        gsap.to(anim, { playbackRate: 1, duration: .8, overwrite: true });
      },
    });
  }

  // Titres en lettres montantes
  if (window.SplitText) {
    $$('[data-split]').forEach((el) => {
      if (el.closest('.hero')) return;
      const split = SplitText.create(el, { type: 'lines,chars', mask: 'lines' });
      gsap.from(split.chars, {
        yPercent: 110, duration: .9, ease: 'power4.out', stagger: .025,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    // Manifeste : les mots s'allument au scroll
    const words = SplitText.create('[data-words]', { type: 'words' }).words;
    gsap.fromTo(words, { opacity: .12 }, {
      opacity: 1, stagger: .1, ease: 'none',
      scrollTrigger: { trigger: '.manifesto-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  }

  // Hero : parallax photo + pivoine
  gsap.to('.hero-photo img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-peony', { rotate: 12, yPercent: 20, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.giant', { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Styles
  gsap.from('.styles-list li', { y: 40, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.styles-list', start: 'top 85%' } });

  const mm = gsap.matchMedia();

  // Travail : scroll horizontal épinglé (desktop)
  mm.add('(min-width: 761px)', () => {
    const track = $('.work-track');
    const distance = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: '.work-pin', start: 'top top', end: () => '+=' + distance(),
        pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set('.work-progress span', { scaleX: self.progress }),
      },
    });
    $$('.card img', track).forEach((img) => {
      gsap.fromTo(img, { scale: 1.25 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true },
      });
    });

    // Dessins : colonnes en parallax
    $$('.drawings .col[data-speed]').forEach((col) => {
      gsap.to(col, { yPercent: +col.dataset.speed * -1, ease: 'none', scrollTrigger: { trigger: '.drawings', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });

  // Images qui se dévoilent
  $$('.reveal-img').forEach((fig) => {
    gsap.from(fig, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', scrollTrigger: { trigger: fig, start: 'top 80%' } });
    gsap.from($('img', fig), { scale: 1.3, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: fig, start: 'top 80%' } });
  });
  gsap.fromTo('.salon-photo img', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.salon-photo', start: 'top bottom', end: 'bottom top', scrub: true } });

  // Flashs : les planches se posent sur la table
  gsap.from('.flash-board li', {
    y: 160, x: (i) => (i % 4 - 1.5) * 60, rotation: (i) => (i % 2 ? 22 : -18), opacity: 0,
    duration: 1.1, ease: 'power3.out', stagger: .08,
    scrollTrigger: { trigger: '.flash-board', start: 'top 85%' },
  });

  // Étapes RDV, cartes soins
  gsap.from('.steps li', { y: 50, opacity: 0, duration: .8, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.steps', start: 'top 85%' } });
  gsap.from('.care-card', { y: 50, opacity: 0, duration: .9, stagger: .15, ease: 'power3.out', scrollTrigger: { trigger: '.care-grid', start: 'top 85%' } });

  // « Tu gères ! » : coup de tampon
  gsap.from('.stamp', { scale: 2.6, opacity: 0, rotation: -30, duration: .6, ease: 'back.out(2.2)', scrollTrigger: { trigger: '.stamp', start: 'top 90%' } });

  // Logo RDV qui tourne doucement
  gsap.to('.rdv-logo', { rotation: -8, yPercent: -60, ease: 'none', scrollTrigger: { trigger: '.rdv', start: 'top bottom', end: 'bottom top', scrub: true } });

  // Footer : le grand YUKAÏ se remplit
  gsap.fromTo('.footer-giant', { backgroundSize: '0% 100%' }, {
    backgroundSize: '100% 100%', ease: 'none',
    scrollTrigger: { trigger: '.footer-giant', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });

  // Header : couleur selon la section sous lui (créé en dernier pour tenir compte de l'épinglage)
  const header = $('.site-header');
  $$('.paper').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 40px', end: 'bottom 40px', refreshPriority: -1,
      onToggle: (self) => header.classList.toggle('on-paper', self.isActive),
    });
  });
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- Entrée du hero ---------- */

function heroIntro() {
  const tl = gsap.timeline();
  if (window.SplitText) {
    const split = SplitText.create('.giant', { type: 'chars', mask: 'chars' });
    tl.from(split.chars, { yPercent: 110, duration: 1.2, ease: 'power4.out', stagger: .06 }, 0);
  }
  tl.from('.hero-photo', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'power4.inOut' }, 0)
    .from('.hero-photo img', { scale: 1.5, duration: 1.8, ease: 'power3.out' }, 0)
    .from(['.hero-sub', '.hero-aka', '.hero-lead', '.hero-bottom .actions'], { y: 30, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out' }, .5)
    .from('.hero-peony', { opacity: 0, scale: .9, duration: 2, ease: 'power2.out' }, .2)
    .from(['.site-header', '.hero-vertical', '.scroll-hint'], { opacity: 0, duration: .8 }, .9);
}

/* ---------- Lancement ---------- */

(async function start() {
  if (!hasGsap) { loader.classList.add('is-skipped'); return; }
  await (document.fonts?.ready ?? Promise.resolve());
  await runLoader();
  if (reduced) return;
  heroIntro();
  initScroll();
})();
