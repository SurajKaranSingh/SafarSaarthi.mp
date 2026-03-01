/**
 * SafarSaarthi Global Functionality
 * Handles: Language, Navigation, Modals, Gallery Flow, and Filtering
 */

// 1. Booking Data Configuration
const bookingData = {
    hotels: [
        { name: 'MakeMyTrip', url: 'https://www.makemytrip.com/hotels/' },
        { name: 'Goibibo', url: 'https://www.goibibo.com/hotels/' },
        { name: 'OYO', url: 'https://www.oyorooms.com/' },
        { name: 'Agoda', url: 'https://www.agoda.com/' }
    ],
    taxis: [
        { name: 'Ola', url: 'https://www.olacabs.com/' },
        { name: 'Uber', url: 'https://www.uber.com/in/en/' },
        { name: 'Rapido', url: 'https://www.rapido.bike/' }
    ],
    tickets: [
        { name: 'IRCTC', url: 'https://www.irctc.co.in/' },
        { name: 'Ixigo', url: 'https://www.ixigo.com/' },
        { name: 'Redbus', url: 'https://www.redbus.in/' }
    ],
    food: [
        { name: 'Zomato', url: 'https://www.zomato.com/' },
        { name: 'Swiggy', url: 'https://www.swiggy.com/' }
    ]
};

// 2. Multi-Language Support
function setLang(lang) {
    document.querySelectorAll('.en').forEach(el => el.style.display = lang === 'en' ? '' : 'none');
    document.querySelectorAll('.hi').forEach(el => el.style.display = lang === 'hi' ? '' : 'none');
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    
    const activeBtn = document.querySelector(`.lang-btn[onclick="setLang('${lang}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    document.documentElement.lang = lang;
    localStorage.setItem('preferredLang', lang); // Remembers choice across pages
}

// 3. Modals & Popups (Booking and Images)
function openBookPopup(cat, titleEn, titleHi) {
    const pop = document.getElementById('bookPopup');
    const lang = document.documentElement.lang || 'en';
    const titleEl = document.getElementById('bookPopupTitle');
    const linksEl = document.getElementById('bookPopupLinks');

    if (titleEl) titleEl.textContent = lang === 'hi' ? titleHi : titleEn;
    if (linksEl && bookingData[cat]) {
        linksEl.innerHTML = bookingData[cat].map(o => 
            `<a href="${o.url}" target="_blank" rel="noopener" class="popup-link">${o.name}</a>`
        ).join('');
    }
    if (pop) pop.classList.add('open');
}

function closeBookPopup(e) {
    const pop = document.getElementById('bookPopup');
    if (!e || e.target === pop || e.target.classList.contains('popup-close')) {
        if (pop) pop.classList.remove('open');
    }
}

function openImgPopup(src) {
    const pop = document.getElementById('imgPopup');
    const img = document.getElementById('imgPopupSrc');
    if (img) img.src = src;
    if (pop) pop.classList.add('open');
}

function closeImgPopup(e) {
    const pop = document.getElementById('imgPopup');
    if (!e || e.target === pop || e.target.classList.contains('img-popup-close')) {
        if (pop) pop.classList.remove('open');
    }
}

// 4. Navigation & Tabs
function toggleMenu() {
    const m = document.getElementById('mobileMenu');
    if (m) m.classList.toggle('open');
}

function showTab(e, id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    e.currentTarget.classList.add('active');
    const targetPanel = document.getElementById('panel-' + id);
    if (targetPanel) targetPanel.classList.add('active');
}

// 5. Attraction Filtering
function filterCards(cat, btn) {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    document.querySelectorAll('.attr-card').forEach(card => {
        const cats = card.dataset.cat || '';
        card.style.display = (cat === 'all' || cats.includes(cat)) ? '' : 'none';
    });
}

// 6. Infinite Gallery Auto-Scroll
function initGallery() {
    const strip = document.getElementById('galleryStrip');
    if (!strip) return;

    // Clone images for seamless looping
    const imgs = Array.from(strip.children);
    imgs.forEach(n => strip.appendChild(n.cloneNode(true)));

    let speed = 0.8, paused = false, raf;

    const tick = () => {
        if (!paused) {
            strip.scrollLeft += speed;
            if (strip.scrollLeft >= strip.scrollWidth / 2) strip.scrollLeft = 0;
        }
        raf = requestAnimationFrame(tick);
    };

    strip.addEventListener('mouseenter', () => paused = true);
    strip.addEventListener('mouseleave', () => paused = false);

    // Drag to scroll logic
    let dragging = false, startX, startScroll;
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

    raf = requestAnimationFrame(tick);
}

// 7. Initialize Everything on Load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language from local storage or default to 'en'
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    setLang(savedLang);

    // Setup Gallery
    initGallery();

    // Escape key listener for modals
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeBookPopup();
            closeImgPopup();
        }
    });

    // Auto-close mobile menu on link click
    document.querySelectorAll('.mobile-menu a').forEach(a => {
        a.addEventListener('click', () => {
            const m = document.getElementById('mobileMenu');
            if (m) m.classList.remove('open');
        });
    });
});
function setLang(lang) {
    // 1. Update the lang attribute on the top-level <html> tag
    document.documentElement.lang = lang;

    // 2. Update the active state of the buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (lang === 'en') {
        document.querySelector(".lang-btn[onclick=\"setLang('en')\"]").classList.add('active');
    } else {
        document.querySelector(".lang-btn[onclick=\"setLang('hi')\"]").classList.add('active');
    }

    // 3. Optional: Save the preference so it stays when the user changes pages
    localStorage.setItem('preferredLang', lang);
}

// Run this on page load to check for saved language
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    setLang(savedLang);
});