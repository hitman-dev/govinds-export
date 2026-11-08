const WHATSAPP = '917709181557';
const EMAIL = 'info@govindsexport.com';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function showToast(text) {
  const toast = $('#toast');
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* Mobile menu */
const nav = $('#nav');
const menuToggle = $('#menuToggle');
function setMenu(open) {
  nav.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuToggle.textContent = open ? '×' : '☰';
}
menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('menu-open')));
$$('#navLinks a, #navLinks button').forEach(el => el.addEventListener('click', () => setMenu(false)));

/* Quote modal */
const modal = $('#quoteModal');
const form = $('#quoteForm');
function openQuote(product) {
  modal.classList.add('active');
  if (product) $('#productSelect').value = product;
  setTimeout(() => form.elements.name.focus(), 50);
}
function closeQuote() { modal.classList.remove('active'); }
$$('[data-quote]').forEach(btn => btn.addEventListener('click', () => openQuote(btn.dataset.quote)));
$('[data-close]', modal).addEventListener('click', closeQuote);
modal.addEventListener('click', e => { if (e.target === modal) closeQuote(); });

form.addEventListener('submit', e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(form));
  const lines = [
    'Quote request - Govinds Export website',
    `Name: ${f.name}`,
    f.company && `Company: ${f.company}`,
    `Email: ${f.email}`,
    f.phone && `Phone: ${f.phone}`,
    `Product: ${f.product}`,
    `Destination: ${f.country}`,
    `Requirement: ${f.details}`,
  ].filter(Boolean);
  const text = lines.join('\n');
  if (e.submitter && e.submitter.value === 'email') {
    const subject = `Quote request: ${f.product}`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  } else {
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }
  closeQuote();
  form.reset();
  showToast('Thank you! Please send the message that just opened.');
});

/* Gallery */
const galleryItems = $$('.gallery-item');
galleryItems.forEach(item => {
  const { cat, name } = item.dataset;
  const img = document.createElement('img');
  img.src = `assets/images/${cat}/${name}-sm.jpg`;
  img.alt = item.getAttribute('aria-label');
  img.loading = 'lazy';
  item.dataset.full = `assets/images/${cat}/${name}.jpg`;
  item.appendChild(img);
});

function filterGallery(cat) {
  $$('.filter-btn').forEach(b => b.setAttribute('aria-pressed', b.dataset.filter === cat));
  galleryItems.forEach(item => { item.hidden = cat !== 'all' && item.dataset.cat !== cat; });
}
$$('.filter-btn').forEach(b => b.addEventListener('click', () => filterGallery(b.dataset.filter)));
$$('[data-show]').forEach(a => a.addEventListener('click', () => filterGallery(a.dataset.show)));

/* Lightbox: a set is either the visible gallery photos or one product's photos */
const lightbox = $('#lightbox');
let lbSet = [];
let lbIndex = 0;
function lbShow(i) {
  lbIndex = (i + lbSet.length) % lbSet.length;
  const { src, alt } = lbSet[lbIndex];
  $('#lbImage').src = src;
  $('#lbImage').alt = alt;
  $('#lbCaption').textContent = `${alt}  (${lbIndex + 1} / ${lbSet.length})`;
}
function lbOpen(set, i) {
  lbSet = set;
  lbShow(i);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function lbClose() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
const lbActions = { close: lbClose, prev: () => lbShow(lbIndex - 1), next: () => lbShow(lbIndex + 1) };
$$('[data-lb]', lightbox).forEach(b => b.addEventListener('click', lbActions[b.dataset.lb]));
lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target.tagName === 'FIGURE') lbClose(); });

galleryItems.forEach(item => item.addEventListener('click', () => {
  const visible = galleryItems.filter(g => !g.hidden);
  lbOpen(visible.map(g => ({ src: g.dataset.full, alt: g.getAttribute('aria-label') })), visible.indexOf(item));
}));

$$('.product-media').forEach(media => {
  const imgs = $$('img', media);
  const set = imgs.map(img => ({ src: img.dataset.full, alt: img.alt }));
  imgs.forEach((img, i) => {
    const open = () => lbOpen(set, i);
    img.addEventListener('click', open);
    img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
});

/* Swipe between photos on phones */
let touchX = null;
lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});

document.addEventListener('keydown', e => {
  if (lightbox.classList.contains('active')) {
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
    if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  } else if (e.key === 'Escape') {
    closeQuote();
    setMenu(false);
  }
});

$('#year').textContent = new Date().getFullYear();
