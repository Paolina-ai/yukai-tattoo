// Filtres de la galerie
const filters = document.querySelectorAll('.filter');
const items = document.querySelectorAll('.gallery li');

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', active);
    });
    items.forEach((li) => {
      li.hidden = f !== 'all' && !li.dataset.tags.split(' ').includes(f);
    });
  });
});

// Lightbox
const box = document.querySelector('.lightbox');
const boxImg = box.querySelector('img');

document.querySelectorAll('.tile, .sketches img, .flash-board img').forEach((el) => {
  el.addEventListener('click', () => {
    const img = el.tagName === 'IMG' ? el : el.querySelector('img');
    boxImg.src = img.src;
    boxImg.alt = img.alt;
    box.showModal();
  });
});
box.querySelector('.lightbox-close').addEventListener('click', () => box.close());
box.addEventListener('click', (e) => { if (e.target === box) box.close(); });

// Apparition au scroll
const reveal = document.querySelectorAll('.section-head, .gallery li, .sketches img, .steps li, .care-card, .styles-list li');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveal.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
}
