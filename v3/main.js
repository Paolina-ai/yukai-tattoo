// Yukaï Tattoo · V3
// Tout le contenu est lisible sans JS. Les animations partent de l'état final (gsap.from),
// donc si un script ne charge pas, la page reste complète.

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopPointer = matchMedia('(pointer: fine) and (min-width: 761px)').matches;
const mobile = matchMedia('(max-width: 760px)').matches;
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
let lenis = null;

/* ---------- Menu plein écran ---------- */

const menu = $('#menu');
const menuBtn = $('.menu-btn');

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
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 750);
  }
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
$$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

/* ---------- Filtres de la galerie ---------- */

const filters = $$('.filter');
const grid = $('.work-grid');
const items = $$('li[data-tags]', grid);
const moreBtn = $('[data-more]');
const reveal = (els) => {
  if (hasGsap && !reduced) gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .5, stagger: .04, ease: 'power3.out' });
};

// « Voir plus » : 8 pièces d'abord, la suite au clic
moreBtn.addEventListener('click', () => {
  grid.classList.remove('is-collapsed');
  moreBtn.setAttribute('aria-expanded', 'true');
  moreBtn.hidden = true;
  reveal(items.slice(8));
  if (hasGsap) ScrollTrigger.refresh();
});

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-pressed', b === btn);
    });
    items.forEach((li) => { li.hidden = f !== 'all' && !li.dataset.tags.split(' ').includes(f); });
    // un filtre affiche toutes ses pièces ; « Tout » revient à la sélection courte (sauf si déjà dépliée)
    if (f !== 'all') { grid.classList.remove('is-collapsed'); moreBtn.hidden = true; }
    else if (moreBtn.getAttribute('aria-expanded') !== 'true') { grid.classList.add('is-collapsed'); moreBtn.hidden = false; }
    reveal(items.filter((li) => !li.hidden));
    if (hasGsap) ScrollTrigger.refresh();
  });
});

/* ---------- Lightbox ---------- */

const box = $('.lightbox');
const boxImg = $('img', box);
$$('.card, .sketch, .sheet').forEach((btn) => {
  btn.addEventListener('click', () => {
    const img = $('img', btn);
    boxImg.src = img.currentSrc.replace('-480.webp', '.webp');
    boxImg.alt = img.alt;
    box.showModal();
    lenis?.stop();
  });
});
box.addEventListener('close', () => lenis?.start());
$('.lightbox-close', box).addEventListener('click', () => box.close());
box.addEventListener('click', (e) => { if (e.target === box) box.close(); });

/* ---------- Carte Google : chargée seulement à la demande ---------- */

$('[data-map-load]').addEventListener('click', () => {
  const iframe = document.createElement('iframe');
  iframe.title = 'Carte : Label Encre Studio Tattoo à Reignac-sur-Indre';
  iframe.src = 'https://www.google.com/maps?q=Label+Encre+Studio+Tattoo,+16+Pl.+du+Bourg+du+Fau,+37310+Reignac-sur-Indre&output=embed';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  $('[data-map]').append(iframe);
});

/* ---------- Intro : logo tracé, rideau vermillon ---------- */

const loader = $('.loader');
let seen = false;
try { seen = sessionStorage.getItem('yk-intro') === '1'; } catch (e) { /* stockage indisponible */ }

function runIntro() {
  return new Promise((resolve) => {
    if (!hasGsap || reduced || seen || mobile) {
      loader.classList.add('is-done');
      return resolve();
    }
    try { sessionStorage.setItem('yk-intro', '1'); } catch (e) { /* ignore */ }
    const strokes = $$('.lg-stroke path', loader);
    strokes.forEach((p) => {
      const l = p.getTotalLength();
      p.style.strokeDasharray = l;
      p.style.strokeDashoffset = l;
    });
    gsap.timeline({ onComplete: () => loader.classList.add('is-done') })
      .to(strokes, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut', stagger: .025 })
      .from('.lg-fill path', { opacity: 0, scale: .6, transformOrigin: '50% 50%', duration: .45, stagger: .05, ease: 'back.out(2)' }, '-=.3')
      .from('.loader-word', { opacity: 0, letterSpacing: '1.4em', duration: .7, ease: 'power3.out' }, '-=.45')
      .to('.loader-panel', { yPercent: -100, duration: .6, ease: 'power4.inOut' }, '+=.1')
      .add(resolve, '-=.2')
      .to(loader, { yPercent: -100, duration: .75, ease: 'power4.inOut' }, '-=.2');
  });
}

function heroIntro() {
  const tl = gsap.timeline();
  if (window.SplitText) {
    const split = SplitText.create('.giant', { type: 'chars', mask: 'chars', aria: 'none' });
    tl.from(split.chars, { yPercent: 110, duration: 1.15, ease: 'power4.out', stagger: .06 }, 0);
  }
  // sur mobile la photo est l'élément principal (LCP) : visible dès le départ, on l'anime sans la masquer
  if (!mobile) tl.from('.hero-photo', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut' }, 0);
  tl.from('.hero-photo img', { scale: mobile ? 1.12 : 1.4, duration: 1.7, ease: 'power3.out' }, 0)
    .from(['.hero-sub', '.hero-aka', '.hero-lead', '.hero-bottom .actions'], { y: 26, opacity: 0, duration: .8, stagger: .07, ease: 'power3.out' }, .45)
    .from('.hero-peony', { opacity: 0, duration: 1.8, ease: 'power2.out' }, .2)
    .from('.site-header', { opacity: 0, duration: .7 }, .8);
}

/* ---------- Défilement ---------- */

function loadLenis() {
  return new Promise((resolve) => {
    if (!desktopPointer || reduced) return resolve();
    const s = document.createElement('script');
    s.src = 'vendor/lenis.min.js';
    s.onload = () => {
      lenis = new Lenis({ lerp: .1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
        const target = $(a.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { duration: 1.3 }); }
      }));
      resolve();
    };
    s.onerror = () => resolve();
    document.head.append(s);
  });
}

function initScroll() {
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  // Bandeau : accélère avec la vitesse de défilement
  const anim = $('.marquee-track').getAnimations?.()[0];
  if (anim) {
    ScrollTrigger.create({
      onUpdate: (self) => {
        anim.playbackRate = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 5);
        gsap.to(anim, { playbackRate: 1, duration: .8, overwrite: true });
      },
    });
  }

  // Titres de section : lettres qui montent (re-découpés si la police ou la largeur change)
  if (window.SplitText) {
    $$('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines,chars', mask: 'lines', autoSplit: true,
        onSplit: (self) => gsap.from(self.chars, {
          yPercent: 110, duration: .85, ease: 'power4.out', stagger: .022,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
      });
    });
  }

  gsap.to('.hero-photo img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Travail : les pièces apparaissent par rangées
  ScrollTrigger.batch('.work-grid li', {
    start: 'top 90%', once: true,
    onEnter: (els) => gsap.from(els, { opacity: 0, y: 40, duration: .8, stagger: .08, ease: 'power3.out' }),
  });

  // Dessins : les tuiles de la mosaïque se dévoilent
  gsap.from('.bento > *:not(.b-text)', {
    clipPath: 'inset(100% 0% 0% 0% round 14px)', duration: 1.1, ease: 'power4.inOut', stagger: .07,
    scrollTrigger: { trigger: '.bento', start: 'top 75%', once: true },
  });

  // Flashs : les planches se posent sur la table (une fois)
  gsap.from('.flash-board li', {
    y: 90, rotation: (i) => (i % 2 ? 12 : -10), opacity: 0,
    duration: .9, ease: 'power3.out', stagger: .06,
    scrollTrigger: { trigger: '.flash-board', start: 'top 85%', once: true },
  });

  // Header : couleur selon la section qu'il survole (créé en dernier pour tenir compte de l'épinglage)
  const header = $('.site-header');
  $$('.paper, .table').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 40px', end: 'bottom 40px', refreshPriority: -1,
      onToggle: (self) => header.classList.toggle('on-paper', self.isActive),
    });
  });
  // …et prend un fond dès qu'on quitte le hero
  ScrollTrigger.create({
    trigger: '.hero', start: 'bottom 70px', end: 'max',
    onToggle: (self) => header.classList.toggle('is-solid', self.isActive),
  });
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- Lancement ---------- */

(async function start() {
  if (!hasGsap) { loader.classList.add('is-done'); return; }
  await runIntro();
  if (reduced) return;
  await (document.fonts?.ready ?? Promise.resolve()); // la police du titre est préchargée : attente quasi nulle
  heroIntro();
  await loadLenis();
  initScroll();
})();
