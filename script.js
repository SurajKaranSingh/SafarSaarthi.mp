const BOOKING_DATA = {
  hotels:  [
    { name: 'MakeMyTrip', url: 'https://www.makemytrip.com/hotels/' },
    { name: 'Goibibo',    url: 'https://www.goibibo.com/hotels/' },
    { name: 'OYO',        url: 'https://www.oyorooms.com/' },
    { name: 'Agoda',      url: 'https://www.agoda.com/' },
  ],
  taxis:   [
    { name: 'Ola',    url: 'https://www.olacabs.com/' },
    { name: 'Uber',   url: 'https://www.uber.com/in/en/' },
    { name: 'Rapido', url: 'https://www.rapido.bike/' },
  ],
  tickets: [
    { name: 'IRCTC',  url: 'https://www.irctc.co.in/' },
    { name: 'Ixigo',  url: 'https://www.ixigo.com/' },
    { name: 'Redbus', url: 'https://www.redbus.in/' },
  ],
  food:    [
    { name: 'Zomato', url: 'https://www.zomato.com/' },
    { name: 'Swiggy', url: 'https://www.swiggy.com/' },
  ],
};

// ─── 2. HELPERS ───────────────────────────────────────────────────────────────

/** Safely get a DOM element by ID. */
const el = id => document.getElementById(id);

/** Current language from the <html> tag, defaults to 'en'. */
const currentLang = () => document.documentElement.lang || 'en';

// ─── 3. LANGUAGE ──────────────────────────────────────────────────────────────

/**
 * Switches UI language by toggling the `lang` attribute on <html>.
 * CSS handles the .en / .hi visibility — JS only manages button state + storage.
 */
function setLang(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  localStorage.setItem('preferredLang', lang);
}

// ─── 4. NAVIGATION ────────────────────────────────────────────────────────────

function toggleMenu() {
  el('mobileMenu')?.classList.toggle('open');
}

// ─── 5. TABS ──────────────────────────────────────────────────────────────────

function showTab(e, id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

  e.currentTarget.classList.add('active');
  el('panel-' + id)?.classList.add('active');
}

// ─── 6. BOOKING POPUP ─────────────────────────────────────────────────────────

function openBookPopup(cat, titleEn, titleHi) {
  const popup  = el('bookPopup');
  const titleEl = el('bookPopupTitle');
  const linksEl = el('bookPopupLinks');
  if (!popup) return;

  if (titleEl) titleEl.textContent = currentLang() === 'hi' ? titleHi : titleEn;

  if (linksEl) {
    const items = BOOKING_DATA[cat] ?? [];
    linksEl.innerHTML = items.map(({ name, url }) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="popup-link">${name}</a>`
    ).join('');
  }

  popup.classList.add('open');
}

function closeBookPopup(e) {
  const popup = el('bookPopup');
  if (popup && (!e || e.target === popup || e.target.classList.contains('popup-close'))) {
    popup.classList.remove('open');
  }
}

// ─── 7. IMAGE POPUP ───────────────────────────────────────────────────────────

function openImgPopup(src) {
  const popup  = el('imgPopup');
  const imgEl  = el('imgPopupSrc');
  if (!popup) return;

  if (imgEl) imgEl.src = src;
  popup.classList.add('open');
}

function closeImgPopup(e) {
  const popup = el('imgPopup');
  if (popup && (!e || e.target === popup || e.target.classList.contains('img-popup-close'))) {
    popup.classList.remove('open');
  }
}

// ─── 8. ATTRACTION FILTERING ──────────────────────────────────────────────────

function filterCards(cat, btn) {
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  btn?.classList.add('active');

  document.querySelectorAll('.attr-card').forEach(card => {
    const cats = card.dataset.cat ?? '';
    card.style.display = (cat === 'all' || cats.includes(cat)) ? '' : 'none';
  });
}

// ─── 9. SHOW MORE / LESS ──────────────────────────────────────────────────────

function toggleMoreCards() {
  const btn     = el('showMoreBtn');
  const icon    = el('showMoreIcon');
  if (!btn) return;

  const txtEn = btn.querySelector('.en');
  const txtHi = btn.querySelector('.hi');

  const isExpanding = txtEn?.textContent.trim() !== 'Show Less';

  document.querySelectorAll('.hidden-card').forEach(card => {
    card.classList.toggle('show-now', isExpanding);
  });

  if (txtEn) txtEn.textContent = isExpanding ? 'Show Less'        : 'Show More Places';
  if (txtHi) txtHi.textContent = isExpanding ? 'कम दिखाएं'        : 'और स्थान देखें';
  if (icon)  icon.style.transform = isExpanding ? 'rotate(180deg)' : 'rotate(0deg)';

  if (!isExpanding) {
    el('attractions')?.scrollIntoView({ behavior: 'smooth' });
  }
}

// ─── 10. GALLERY ──────────────────────────────────────────────────────────────

function initGallery() {
  const strip = el('galleryStrip');
  if (!strip) return;

  // Clone children for seamless infinite loop
  Array.from(strip.children).forEach(node => strip.appendChild(node.cloneNode(true)));

  const SPEED = 0.8;
  let paused = false;
  let dragging = false, startX = 0, startScroll = 0;

  // Auto-scroll loop
  (function tick() {
    if (!paused && !dragging) {
      strip.scrollLeft += SPEED;
      if (strip.scrollLeft >= strip.scrollWidth / 2) strip.scrollLeft = 0;
    }
    requestAnimationFrame(tick);
  })();

  // Pause on hover
  strip.addEventListener('mouseenter', () => paused = true);
  strip.addEventListener('mouseleave', () => paused = false);

  // Drag to scroll
  strip.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.pageX;
    startScroll = strip.scrollLeft;
    strip.classList.add('dragging');
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    strip.scrollLeft = startScroll - (e.pageX - startX);
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    strip.classList.remove('dragging');
  });
}

// ─── 11. INIT ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Restore saved language preference
  setLang(localStorage.getItem('preferredLang') || 'en');

  // Init gallery
  initGallery();

  // Close modals on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeBookPopup();
      closeImgPopup();
    }
  });

  // Close mobile menu when a nav link is clicked
  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => el('mobileMenu')?.classList.remove('open'));
  });
});