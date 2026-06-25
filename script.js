// Menu mobilne
const navLinks = document.querySelector('.nav-links');

document.querySelectorAll('.menu-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
  });
});

// Automatyczna galeria dla zdjęć nazwanych 01.jpg, 02.jpg, 03.jpg...
// Główna galeria: assets/gallery/01.jpg, 02.jpg...
// Kontynenty: assets/gallery/europa/01.jpg, assets/gallery/azja/01.jpg itd.
const DEFAULT_GALLERY_PATH = 'assets/gallery/';
const MAX_GALLERY_NUMBER = 300;
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const galleryGroups = {};
let activeLightboxGroup = [];
let activeLightboxIndex = 0;

// V39: zdjęcia dodawane/ukrywane przez panel administratora.
// Dodane zdjęcia zapisują się lokalnie w przeglądarce, a usuwanie zdjęć z paczki
// działa jako ukrywanie na stronie galerii — bez ruszania zdjęć użytych na stronie głównej i w "Kim jesteśmy".
const IRBIS_GALLERY_EXTRA_KEY = 'irbisGalleryExtraImages';
const IRBIS_GALLERY_HIDDEN_KEY = 'irbisGalleryHiddenImages';
const GALLERY_CONTINENTS = [
  { key:'europa', label:'Europa', path:'assets/gallery/europa/' },
  { key:'azja', label:'Azja', path:'assets/gallery/azja/' },
  { key:'afryka', label:'Afryka', path:'assets/gallery/afryka/' },
  { key:'ameryka-polnocna', label:'Ameryka Północna', path:'assets/gallery/ameryka-polnocna/' },
  { key:'ameryka-poludniowa', label:'Ameryka Południowa', path:'assets/gallery/ameryka-poludniowa/' },
  { key:'australia-oceania', label:'Australia i Oceania', path:'assets/gallery/australia-oceania/' },
  { key:'antarktyda', label:'Antarktyda', path:'assets/gallery/antarktyda/' }
];

function readJSONStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch (error) { return fallback; }
}

function getGalleryExtraImages() { return readJSONStorage(IRBIS_GALLERY_EXTRA_KEY, {}); }
function saveGalleryExtraImages(data) { localStorage.setItem(IRBIS_GALLERY_EXTRA_KEY, JSON.stringify(data)); }
function getGalleryHiddenImages() { return readJSONStorage(IRBIS_GALLERY_HIDDEN_KEY, {}); }
function saveGalleryHiddenImages(data) { localStorage.setItem(IRBIS_GALLERY_HIDDEN_KEY, JSON.stringify(data)); }
function galleryKeyFromPath(path) {
  const match = String(path || '').match(/assets\/gallery\/([^/]+)\//);
  return match ? match[1] : String(path || '').replace(/[^a-z0-9-]/gi, '-');
}


// V43: automatyczna kompresja zdjęć przed zapisem w panelu.
// Dzięki temu zdjęcia z telefonu/aparatu nie zapychają localStorage i strona ładuje się szybciej.
const IRBIS_IMAGE_COMPRESSION = {
  maxWidth: 1600,
  quality: 0.78,
  outputType: 'image/jpeg'
};

function compressImageFile(file, options = {}) {
  const settings = { ...IRBIS_IMAGE_COMPRESSION, ...options };

  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      reject(new Error('Wybrany plik nie jest zdjęciem.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Nie udało się odczytać zdjęcia.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Nie udało się przetworzyć zdjęcia.'));
      img.onload = () => {
        const scale = img.width > settings.maxWidth ? settings.maxWidth / img.width : 1;
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(settings.outputType, settings.quality);
        resolve({
          src: dataUrl,
          originalName: file.name,
          originalSize: file.size,
          compressedSize: Math.round((dataUrl.length * 3) / 4),
          width,
          height
        });
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Interaktywna mapa świata: dodawaj/edytuj odwiedzone kraje tutaj.
// Wystarczy dopisać kolejny obiekt w tej samej formie:
// { name: 'Nazwa kraju', continent: 'Kontynent', lat: 52.23, lng: 21.01 }
const VISITED_COUNTRIES = [
  { name: 'Polska', continent: 'Europa', lat: 52.23, lng: 21.01 },
  { name: 'Rumunia', continent: 'Europa', lat: 45.94, lng: 24.97 },
  { name: 'Grecja', continent: 'Europa', lat: 39.07, lng: 21.82 },
  { name: 'Albania', continent: 'Europa', lat: 41.15, lng: 20.17 },
  { name: 'Włochy', continent: 'Europa', lat: 41.87, lng: 12.57 },
  { name: 'Armenia', continent: 'Azja', lat: 40.07, lng: 45.04 },
  { name: 'Chiny', continent: 'Azja', lat: 35.86, lng: 104.20 },
  { name: 'Indie', continent: 'Azja', lat: 20.59, lng: 78.96 },
  { name: 'Wietnam', continent: 'Azja', lat: 14.06, lng: 108.28 }
];

function padPhotoNumber(number) {
  return String(number).padStart(2, '0');
}

function imageExists(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function findPhotoByNumber(number, basePath = DEFAULT_GALLERY_PATH) {
  const photoNumber = padPhotoNumber(number);

  for (const extension of IMAGE_EXTENSIONS) {
    const src = `${basePath}${photoNumber}.${extension}`;
    const existingSrc = await imageExists(src);
    if (existingSrc) return existingSrc;
  }

  return null;
}

function createPreviewTile(src, linkTarget) {
  const tile = document.createElement('a');
  tile.className = 'photo-tile';
  tile.href = linkTarget || 'galeria.html';
  tile.innerHTML = `<img src="${src}" alt="Zdjęcie z wyprawy Irbis Travel & Adventure" loading="lazy">`;
  return tile;
}

function createFullGalleryTile(src, groupName, index) {
  const tile = document.createElement('button');
  tile.className = 'photo-tile gallery-open';
  tile.type = 'button';
  tile.dataset.src = src;
  tile.dataset.group = groupName;
  tile.dataset.index = String(index);
  tile.setAttribute('aria-label', 'Otwórz zdjęcie');
  tile.innerHTML = `<img src="${src}" alt="Zdjęcie z galerii wypraw Irbis Travel & Adventure" loading="lazy">`;
  tile.addEventListener('click', () => openLightbox(groupName, index));
  return tile;
}

function updateLightboxImage() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox || !activeLightboxGroup.length) return;

  const img = lightbox.querySelector('img');
  const counter = lightbox.querySelector('.lightbox-counter');
  const src = activeLightboxGroup[activeLightboxIndex];
  img.src = src;
  if (counter) counter.textContent = `${activeLightboxIndex + 1} / ${activeLightboxGroup.length}`;
}

function openLightbox(groupName, index) {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  activeLightboxGroup = galleryGroups[groupName] || [];
  activeLightboxIndex = index;
  if (!activeLightboxGroup.length) return;

  updateLightboxImage();
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const img = lightbox.querySelector('img');
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  img.src = '';
  activeLightboxGroup = [];
  activeLightboxIndex = 0;
}

function showNextPhoto() {
  if (!activeLightboxGroup.length) return;
  activeLightboxIndex = (activeLightboxIndex + 1) % activeLightboxGroup.length;
  updateLightboxImage();
}

function showPrevPhoto() {
  if (!activeLightboxGroup.length) return;
  activeLightboxIndex = (activeLightboxIndex - 1 + activeLightboxGroup.length) % activeLightboxGroup.length;
  updateLightboxImage();
}

async function buildAutoGallery(gallery) {
  const limit = Number(gallery.dataset.limit || 0);
  const linkTarget = gallery.dataset.link || 'galeria.html';
  const useLightbox = gallery.dataset.lightbox === 'true';
  const basePath = gallery.dataset.path || DEFAULT_GALLERY_PATH;
  const groupName = gallery.dataset.galleryGroup || basePath;
  const foundPhotos = [];
  const maxMissingInRow = Number(gallery.dataset.maxMissing || 6);
  // Niektóre foldery kontynentów mogą zaczynać się od wyższego numeru, np. 07.jpg.
  // Dlatego przed znalezieniem pierwszego zdjęcia pozwalamy na więcej braków,
  // ale po znalezieniu zdjęć szybko kończymy skanowanie, żeby nie generować setek 404.
  const maxInitialMissing = Number(gallery.dataset.maxInitialMissing || 30);
  let missingInRow = 0;

  gallery.innerHTML = '';

  for (let number = 1; number <= MAX_GALLERY_NUMBER; number += 1) {
    const src = await findPhotoByNumber(number, basePath);

    if (!src) {
      missingInRow += 1;

      if (!foundPhotos.length && missingInRow >= maxInitialMissing) break;
      if (foundPhotos.length && missingInRow >= maxMissingInRow) break;

      continue;
    }

    missingInRow = 0;
    foundPhotos.push(src);
    if (limit && foundPhotos.length >= limit) break;
  }

  const galleryKey = galleryKeyFromPath(basePath);
  const hiddenMap = getGalleryHiddenImages();
  const extraMap = getGalleryExtraImages();
  const hiddenForGallery = new Set(hiddenMap[galleryKey] || []);
  const managedExtras = (extraMap[galleryKey] || []).map(item => item.src).filter(Boolean);
  const visiblePhotos = foundPhotos.filter(src => !hiddenForGallery.has(src)).concat(managedExtras);

  galleryGroups[groupName] = visiblePhotos;

  if (!visiblePhotos.length && gallery.classList.contains('continent-gallery')) {
    const empty = document.createElement('p');
    empty.className = 'empty-gallery-note';
    empty.textContent = 'Tu pojawią się zdjęcia po dodaniu ich do odpowiedniego folderu kontynentu.';
    gallery.replaceWith(empty);
    return;
  }

  visiblePhotos.forEach((src, index) => {
    const tile = useLightbox ? createFullGalleryTile(src, groupName, index) : createPreviewTile(src, linkTarget);
    gallery.appendChild(tile);
  });
}

document.querySelectorAll('.js-auto-gallery').forEach((gallery) => {
  buildAutoGallery(gallery);
});

// Lightbox z przewijaniem zdjęć prawo/lewo
const lightbox = document.querySelector('.lightbox');

if (lightbox) {
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-next')?.addEventListener('click', (event) => {
    event.stopPropagation();
    showNextPhoto();
  });
  document.querySelector('.lightbox-prev')?.addEventListener('click', (event) => {
    event.stopPropagation();
    showPrevPhoto();
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('active')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showNextPhoto();
    if (event.key === 'ArrowLeft') showPrevPhoto();
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const difference = touchStartX - touchEndX;
    if (Math.abs(difference) < 45) return;
    if (difference > 0) showNextPhoto();
    else showPrevPhoto();
  }, { passive: true });
}

// Interaktywna mapa świata oparta o Leaflet/OpenStreetMap
function buildVisitedMap() {
  const mapElement = document.querySelector('#irbis-world-map');
  const list = document.querySelector('#visited-country-list');
  if (!mapElement || !list) return;

  if (typeof L === 'undefined') {
    mapElement.innerHTML = '<div class="map-fallback">Mapa wymaga połączenia z internetem, żeby załadować kafelki OpenStreetMap.</div>';
    return;
  }

  const map = L.map(mapElement, {
    worldCopyJump: true,
    scrollWheelZoom: true
  }).setView([30, 20], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 6,
    minZoom: 2,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  const irbisIcon = L.divIcon({
    className: 'irbis-map-marker',
    html: '<span></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14]
  });

  const markerByCountry = {};

  VISITED_COUNTRIES.forEach((country) => {
    const marker = L.marker([country.lat, country.lng], { icon: irbisIcon })
      .addTo(map)
      .bindPopup(`<strong>${country.name}</strong><br>${country.continent}`);

    markerByCountry[country.name] = marker;
  });

  const grouped = VISITED_COUNTRIES.reduce((acc, country) => {
    acc[country.continent] = acc[country.continent] || [];
    acc[country.continent].push(country);
    return acc;
  }, {});

  list.innerHTML = Object.entries(grouped).map(([continent, countries]) => `
    <div class="map-list-group">
      <strong>${continent}</strong>
      <div class="map-country-buttons">
        ${countries.map((country) => `<button type="button" data-country="${country.name}">${country.name}</button>`).join('')}
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-country]').forEach((button) => {
    button.addEventListener('click', () => {
      const countryName = button.dataset.country;
      const marker = markerByCountry[countryName];
      const country = VISITED_COUNTRIES.find((item) => item.name === countryName);
      if (!marker || !country) return;

      list.querySelectorAll('[data-country]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      map.setView([country.lat, country.lng], 4, { animate: true });
      marker.openPopup();
    });
  });
}

buildVisitedMap();


// V38: prosty panel postów zapisujący dane lokalnie w przeglądarce.
// To jest prototyp front-end. Do realnego panelu online trzeba podpiąć bazę danych,
// np. Supabase/Firebase albo własny backend.
const IRBIS_POSTS_KEY = 'irbisTravelPosts';
const IRBIS_ADMIN_SESSION = 'irbisAdminLoggedIn';
const IRBIS_PANEL_ROLE = 'irbisPanelRole';
const IRBIS_USERS_KEY = 'irbisPanelUsers';
const IRBIS_PENDING_USERS_KEY = 'irbisPanelPendingUsers';
const IRBIS_ADMIN_LOGIN = 'admin';
const IRBIS_ADMIN_PASSWORD = 'Kazimierz369';
const IRBIS_MAX_USERS = 10000;

function getStoredPosts() {
  try {
    return JSON.parse(localStorage.getItem(IRBIS_POSTS_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function saveStoredPosts(posts) {
  try {
    localStorage.setItem(IRBIS_POSTS_KEY, JSON.stringify(posts));
  } catch (error) {
    alert('Nie udało się zapisać posta. Najczęstszy powód: zdjęcie jest za duże dla pamięci przeglądarki. Spróbuj dodać mniejsze zdjęcie albo post bez zdjęcia.');
    throw error;
  }
}

function getPanelUsers() {
  return readJSONStorage(IRBIS_USERS_KEY, []);
}

function savePanelUsers(users) {
  localStorage.setItem(IRBIS_USERS_KEY, JSON.stringify(users));
}

function getPendingPanelUsers() {
  return readJSONStorage(IRBIS_PENDING_USERS_KEY, []);
}

function savePendingPanelUsers(users) {
  localStorage.setItem(IRBIS_PENDING_USERS_KEY, JSON.stringify(users));
}

function normalizeLogin(login) {
  return String(login || '').trim().toLowerCase();
}

function findPanelUser(login, password) {
  const normalized = normalizeLogin(login);
  return getPanelUsers().find(user => normalizeLogin(user.login) === normalized && user.password === password);
}


function postAuthorLabel(post) {
  const author = (post && (post.authorLogin || post.authorRole)) ? String(post.authorLogin || post.authorRole).trim() : '';
  return author || 'Irbis Travel & Adventure';
}

function slugifyPostTitle(title) {
  return (title || 'post')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'post';
}

function renderDynamicPostPreview() {
  const wrap = document.getElementById('dynamicPostPreview');
  if (!wrap) return;
  const posts = getStoredPosts().slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 3);
  const fallback = document.querySelector('.static-posts-fallback');

  if (!posts.length) {
    wrap.innerHTML = '';
    if (fallback) fallback.style.display = '';
    return;
  }

  if (fallback) fallback.style.display = 'none';
  wrap.innerHTML = posts.map(post => `
    <article class="travel-post-card">
      ${post.image ? `<img src="${post.image}" alt="${post.title}" loading="lazy">` : `<div class="post-image-placeholder">${post.tag || 'Post'}</div>`}
      <div class="travel-post-content">
        <div class="post-author">Dodano przez: ${postAuthorLabel(post)}</div>
        <span class="post-tag">${post.tag || 'Podróż'}</span>
        <h3>${post.title}</h3>
        <p>${post.excerpt || ''}</p>
        <a href="posty.html#${post.id}">Czytaj więcej →</a>
      </div>
    </article>
  `).join('');
}

function renderDynamicPostsPage() {
  const wrap = document.getElementById('dynamicPostsList');
  if (!wrap) return;
  const posts = getStoredPosts().slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const fallback = document.querySelector('.static-posts-fallback');

  if (!posts.length) {
    wrap.innerHTML = '';
    if (fallback) fallback.style.display = '';
    return;
  }

  if (fallback) fallback.style.display = 'none';
  wrap.innerHTML = posts.map(post => `
    <article class="post-full-card" id="${post.id}">
      ${post.image ? `<img src="${post.image}" alt="${post.title}" loading="lazy">` : `<div class="post-image-placeholder full">${post.tag || 'Post'}</div>`}
      <div>
        <div class="post-author">Dodano przez: ${postAuthorLabel(post)}</div>
        <span class="post-tag">${post.tag || 'Podróż'}</span>
        <h2>${post.title}</h2>
        ${post.date ? `<p class="post-date">${post.date}</p>` : ''}
        ${(post.body || '').split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('')}
      </div>
    </article>
  `).join('');
}

async function scanStaticGalleryForAdmin(continentKey) {
  const cfg = GALLERY_CONTINENTS.find(item => item.key === continentKey);
  if (!cfg) return [];
  const found = [];
  let missingInRow = 0;
  let foundAny = false;

  for (let number = 1; number <= MAX_GALLERY_NUMBER; number += 1) {
    const src = await findPhotoByNumber(number, cfg.path);
    if (!src) {
      missingInRow += 1;
      if (!foundAny && missingInRow >= 30) break;
      if (foundAny && missingInRow >= 6) break;
      continue;
    }
    foundAny = true;
    missingInRow = 0;
    found.push(src);
  }
  return found;
}

function setupGalleryAdminPanel() {
  const select = document.getElementById('galleryContinentSelect');
  const input = document.getElementById('galleryImageInput');
  const list = document.getElementById('adminGalleryList');
  const hint = document.getElementById('adminGalleryHint');
  if (!select || !input || !list) return;

  select.innerHTML = GALLERY_CONTINENTS.map(item => `<option value="${item.key}">${item.label}</option>`).join('');

  async function renderGalleryAdminList() {
    const key = select.value;
    const cfg = GALLERY_CONTINENTS.find(item => item.key === key);
    if (!cfg) return;
    const hiddenMap = getGalleryHiddenImages();
    const extraMap = getGalleryExtraImages();
    const hidden = new Set(hiddenMap[key] || []);
    const staticImages = await scanStaticGalleryForAdmin(key);
    const customImages = extraMap[key] || [];
    const rows = [];

    staticImages.forEach((src, index) => {
      rows.push({ type:'static', id:src, src, title:`Zdjęcie z folderu ${String(index + 1).padStart(2, '0')}`, hidden:hidden.has(src) });
    });
    customImages.forEach((item, index) => {
      rows.push({ type:'custom', id:item.id, src:item.src, title:item.name || `Dodane zdjęcie ${index + 1}`, hidden:false });
    });

    if (!rows.length) {
      list.innerHTML = '<p class="empty-gallery-note">Brak zdjęć w tym kontynencie. Dodaj pierwsze zdjęcie przyciskiem powyżej.</p>';
      return;
    }

    list.innerHTML = rows.map(row => `
      <article class="admin-gallery-row${row.hidden ? ' hidden-photo' : ''}">
        <img src="${row.src}" alt="${row.title}">
        <div>
          <strong>${row.title}</strong>
          <span>${row.type === 'static' ? (row.hidden ? 'Ukryte w galerii' : 'Zdjęcie z paczki strony') : 'Dodane przez panel'}</span>
        </div>
        ${row.type === 'static'
          ? `<button type="button" data-toggle-static="${row.id}">${row.hidden ? 'Przywróć' : 'Usuń z galerii'}</button>`
          : `<button type="button" data-delete-custom="${row.id}">Usuń</button>`}
      </article>
    `).join('');

    list.querySelectorAll('[data-toggle-static]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.toggleStatic;
        const nextHiddenMap = getGalleryHiddenImages();
        const current = new Set(nextHiddenMap[key] || []);
        if (current.has(id)) current.delete(id);
        else current.add(id);
        nextHiddenMap[key] = [...current];
        saveGalleryHiddenImages(nextHiddenMap);
        renderGalleryAdminList();
      });
    });

    list.querySelectorAll('[data-delete-custom]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Usunąć to zdjęcie z galerii?')) return;
        const id = btn.dataset.deleteCustom;
        const nextExtraMap = getGalleryExtraImages();
        nextExtraMap[key] = (nextExtraMap[key] || []).filter(item => item.id !== id);
        saveGalleryExtraImages(nextExtraMap);
        renderGalleryAdminList();
      });
    });
  }

  select.addEventListener('change', renderGalleryAdminList);
  input.addEventListener('change', async () => {
    const files = [...(input.files || [])];
    if (!files.length) return;
    const key = select.value;
    const extraMap = getGalleryExtraImages();
    extraMap[key] = extraMap[key] || [];

    if (hint) hint.textContent = `Kompresuję ${files.length} zdjęć...`;

    let added = 0;
    let totalOriginal = 0;
    let totalCompressed = 0;

    for (const file of files) {
      try {
        const compressed = await compressImageFile(file, { maxWidth: 1600, quality: 0.78 });
        totalOriginal += compressed.originalSize || file.size || 0;
        totalCompressed += compressed.compressedSize || 0;
        extraMap[key].push({
          id:`gallery-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name:file.name,
          src:compressed.src,
          originalSize:compressed.originalSize,
          compressedSize:compressed.compressedSize,
          createdAt:Date.now()
        });
        added += 1;
      } catch (error) {
        console.warn('Nie udało się skompresować zdjęcia:', file.name, error);
      }
    }

    try {
      saveGalleryExtraImages(extraMap);
    } catch (error) {
      alert('Nie udało się zapisać zdjęć. Pamięć przeglądarki jest pełna. W kolejnej wersji podłączymy Supabase Storage.');
    }

    input.value = '';
    if (hint) {
      hint.textContent = added
        ? `Dodano ${added} zdjęć. Kompresja: ${formatBytes(totalOriginal)} → ${formatBytes(totalCompressed)}. Oryginały na dysku zostały nietknięte.`
        : 'Nie udało się dodać zdjęć.';
    }
    renderGalleryAdminList();
  });

  renderGalleryAdminList();
}

function setupAdminPanel() {
  const loginBox = document.getElementById('adminLogin');
  const dashboard = document.getElementById('adminDashboard');
  if (!loginBox || !dashboard) return;

  const loginNameInput = document.getElementById('adminLoginName');
  const passwordInput = document.getElementById('adminPassword');
  const loginBtn = document.getElementById('adminLoginBtn');
  const logoutBtn = document.getElementById('adminLogoutBtn');
  const form = document.getElementById('postForm');
  const imageInput = document.getElementById('postImage');
  const preview = document.getElementById('imagePreview');
  const list = document.getElementById('adminPostsList');
  const roleInfo = document.getElementById('adminRoleInfo');
  const galleryPanel = document.querySelector('.admin-gallery-panel');
  const usersPanel = document.getElementById('adminUsersPanel');
  const registeredUsersPanel = document.getElementById('adminRegisteredUsersPanel');
  const registeredUsersList = document.getElementById('registeredUsersList');
  const pendingUsersList = document.getElementById('pendingUsersList');
  const usersLimitInfo = document.getElementById('usersLimitInfo');
  const usersCountInfo = document.getElementById('usersCountInfo');
  const showRegisterRequestBtn = document.getElementById('showRegisterRequestBtn');
  const registerRequestForm = document.getElementById('registerRequestForm');
  const requestLogin = document.getElementById('requestLogin');
  const requestPassword = document.getElementById('requestPassword');
  const requestRegisterStatus = document.getElementById('requestRegisterStatus');
  let selectedImage = '';

  function currentRole() {
    return sessionStorage.getItem(IRBIS_PANEL_ROLE) || 'user';
  }

  function isAdminRole() {
    return currentRole() === 'admin';
  }

  function showDashboard(role = currentRole()) {
    loginBox.hidden = true;
    dashboard.hidden = false;

    if (roleInfo) {
      const currentLogin = sessionStorage.getItem('irbisPanelLogin') || (role === 'admin' ? 'admin' : 'użytkownik');
      roleInfo.textContent = `Zalogowano jako ${currentLogin}`;
    }

    if (galleryPanel) galleryPanel.hidden = role !== 'admin';
    if (usersPanel) usersPanel.hidden = role !== 'admin';
    if (registeredUsersPanel) registeredUsersPanel.hidden = role !== 'admin';
    updateUserStats();
    renderAdminList();
    renderPendingUsersList();
    renderRegisteredUsersList();
    if (role === 'admin') setupGalleryAdminPanel();
  }

  function showLogin() {
    loginBox.hidden = false;
    dashboard.hidden = true;
  }

  function renderAdminList() {
    const posts = getStoredPosts().slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (!list) return;
    if (!posts.length) {
      list.innerHTML = '<p class="empty-gallery-note">Nie dodano jeszcze żadnych postów przez panel.</p>';
      return;
    }

    const canDelete = isAdminRole();
    list.innerHTML = posts.map(post => `
      <article class="admin-post-row">
        ${post.image ? `<img src="${post.image}" alt="${post.title}">` : '<div class="admin-post-thumb">Post</div>'}
        <div>
          <strong>${post.title}</strong>
          <span>${post.tag || 'Podróż'}${post.date ? ' · ' + post.date : ''} · ${postAuthorLabel(post)}</span>
        </div>
        ${canDelete ? `<button type="button" data-delete-post="${post.id}">Usuń</button>` : '<span class="admin-lock-note">Dodany post</span>'}
      </article>
    `).join('');

    if (!canDelete) return;
    list.querySelectorAll('[data-delete-post]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Usunąć ten post?')) return;
        const next = getStoredPosts().filter(post => post.id !== btn.dataset.deletePost);
        saveStoredPosts(next);
        renderAdminList();
        renderDynamicPostPreview();
        renderDynamicPostsPage();
      });
    });
  }

  function updateUserStats() {
    const registeredCount = getPanelUsers().length;
    const remaining = Math.max(0, IRBIS_MAX_USERS - registeredCount);
    if (usersLimitInfo) usersLimitInfo.textContent = `Limit aktywnych użytkowników: ${remaining}`;
    if (usersCountInfo) usersCountInfo.textContent = `Liczba zarejestrowanych użytkowników: ${registeredCount}`;
  }

  function renderPendingUsersList() {
    updateUserStats();
    if (!pendingUsersList) return;
    const pending = getPendingPanelUsers();
    if (!pending.length) {
      pendingUsersList.innerHTML = '<p class="empty-gallery-note">Brak oczekujących próśb o rejestrację.</p>';
      return;
    }

    pendingUsersList.innerHTML = pending.map(user => `
      <article class="admin-user-row pending-user">
        <div>
          <strong>${user.login}</strong>
          <span>Użytkownik chce się zarejestrować · ${user.createdAt ? new Date(user.createdAt).toLocaleString('pl-PL') : '—'}</span>
        </div>
        <div class="admin-user-actions">
          <button type="button" data-approve-user="${user.id}">Zatwierdź</button>
          <button type="button" class="danger" data-reject-user="${user.id}">Odrzuć</button>
        </div>
      </article>
    `).join('');

    pendingUsersList.querySelectorAll('[data-approve-user]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!isAdminRole()) return;
        const pendingUsers = getPendingPanelUsers();
        const request = pendingUsers.find(user => user.id === btn.dataset.approveUser);
        if (!request) return;
        const users = getPanelUsers();
        if (users.length >= IRBIS_MAX_USERS) {
          alert('Osiągnięto limit aktywnych użytkowników.');
          return;
        }
        if (users.some(user => normalizeLogin(user.login) === normalizeLogin(request.login))) {
          alert('Taki użytkownik już istnieje. Odrzuć tę prośbę albo usuń istniejące konto.');
          return;
        }
        users.push({
          id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          login: request.login,
          password: request.password,
          createdAt: Date.now(),
          approvedFromRequest: request.id
        });
        savePanelUsers(users);
        savePendingPanelUsers(pendingUsers.filter(user => user.id !== request.id));
        updateUserStats();
        renderPendingUsersList();
        renderRegisteredUsersList();
      });
    });

    pendingUsersList.querySelectorAll('[data-reject-user]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!isAdminRole()) return;
        if (!confirm('Odrzucić tę prośbę o rejestrację?')) return;
        savePendingPanelUsers(getPendingPanelUsers().filter(user => user.id !== btn.dataset.rejectUser));
        renderPendingUsersList();
      });
    });
  }

  function renderRegisteredUsersList() {
    updateUserStats();
    if (!registeredUsersList) return;
    const users = getPanelUsers();
    if (!users.length) {
      registeredUsersList.innerHTML = '<p class="empty-gallery-note">Brak zatwierdzonych użytkowników.</p>';
      return;
    }

    registeredUsersList.innerHTML = users.map(user => `
      <article class="admin-user-row">
        <div>
          <strong>${user.login}</strong>
          <span>Użytkownik zatwierdzony · ${user.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : '—'}</span>
        </div>
        <button type="button" data-delete-user="${user.id}">Usuń</button>
      </article>
    `).join('');

    registeredUsersList.querySelectorAll('[data-delete-user]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!isAdminRole()) return;
        if (!confirm('Usunąć tego użytkownika?')) return;
        const next = getPanelUsers().filter(user => user.id !== btn.dataset.deleteUser);
        savePanelUsers(next);
        updateUserStats();
        renderRegisteredUsersList();
      });
    });
  }


  if (sessionStorage.getItem(IRBIS_ADMIN_SESSION) === '1') showDashboard(currentRole());
  else showLogin();

  showRegisterRequestBtn?.addEventListener('click', () => {
    if (!registerRequestForm) return;
    registerRequestForm.hidden = !registerRequestForm.hidden;
    if (!registerRequestForm.hidden) requestLogin?.focus();
  });

  registerRequestForm?.addEventListener('submit', event => {
    event.preventDefault();
    const loginRaw = requestLogin?.value.trim() || '';
    const login = normalizeLogin(loginRaw);
    const password = requestPassword?.value || '';
    const displayLogin = loginRaw.trim();

    if (!login || !password) {
      alert('Wpisz login i hasło.');
      return;
    }
    if (login === IRBIS_ADMIN_LOGIN) {
      alert('Login "admin" jest zarezerwowany.');
      return;
    }
    if (getPanelUsers().some(user => normalizeLogin(user.login) === login)) {
      alert('Taki użytkownik jest już zatwierdzony. Możesz się zalogować.');
      return;
    }
    if (getPendingPanelUsers().some(user => normalizeLogin(user.login) === login)) {
      alert('Prośba dla tego loginu już czeka na zatwierdzenie administratora.');
      return;
    }
    if (getPanelUsers().length >= IRBIS_MAX_USERS) {
      alert('Osiągnięto limit aktywnych użytkowników.');
      return;
    }

    const pending = getPendingPanelUsers();
    pending.push({
      id: `pending-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      login: displayLogin,
      password,
      createdAt: Date.now()
    });
    savePendingPanelUsers(pending);
    registerRequestForm.reset();
    if (requestRegisterStatus) requestRegisterStatus.textContent = 'Zaczekaj na zatwierdzenie przez administratora.';
    alert('Zaczekaj na zatwierdzenie przez administratora.');
  });

  loginBtn?.addEventListener('click', () => {
    const loginRaw = loginNameInput?.value || '';
    const login = normalizeLogin(loginRaw);
    const password = passwordInput?.value || '';
    let role = '';
    let displayLogin = loginRaw.trim() || login;
    const matchedUser = findPanelUser(login, password);

    if (login === IRBIS_ADMIN_LOGIN && password === IRBIS_ADMIN_PASSWORD) {
      role = 'admin';
      displayLogin = 'admin';
    } else if (matchedUser) {
      role = 'user';
      displayLogin = matchedUser.login || displayLogin;
    }

    if (role) {
      sessionStorage.setItem(IRBIS_ADMIN_SESSION, '1');
      sessionStorage.setItem(IRBIS_PANEL_ROLE, role);
      sessionStorage.setItem('irbisPanelLogin', displayLogin);
      if (loginNameInput) loginNameInput.value = '';
      if (passwordInput) passwordInput.value = '';
      showDashboard(role);
    } else {
      alert('Nieprawidłowy login lub hasło.');
    }
  });

  loginNameInput?.addEventListener('keydown', event => {
    if (event.key === 'Enter') loginBtn?.click();
  });

  passwordInput?.addEventListener('keydown', event => {
    if (event.key === 'Enter') loginBtn?.click();
  });

  logoutBtn?.addEventListener('click', () => {
    sessionStorage.removeItem(IRBIS_ADMIN_SESSION);
    sessionStorage.removeItem(IRBIS_PANEL_ROLE);
    sessionStorage.removeItem('irbisPanelLogin');
    showLogin();
  });

  imageInput?.addEventListener('change', async () => {
    const file = imageInput.files && imageInput.files[0];
    selectedImage = '';
    if (!file) {
      if (preview) preview.textContent = 'Brak zdjęcia';
      return;
    }

    if (preview) preview.textContent = 'Kompresuję zdjęcie...';

    try {
      const compressed = await compressImageFile(file, { maxWidth: 1600, quality: 0.78 });
      selectedImage = compressed.src;
      if (preview) {
        preview.innerHTML = `
          <img src="${selectedImage}" alt="Podgląd zdjęcia">
          <small>Kompresja: ${formatBytes(compressed.originalSize)} → ${formatBytes(compressed.compressedSize)}</small>
        `;
      }
    } catch (error) {
      selectedImage = '';
      if (preview) preview.textContent = 'Nie udało się przetworzyć zdjęcia.';
      alert('Nie udało się przetworzyć zdjęcia. Spróbuj wybrać inny plik.');
    }
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();
    const title = document.getElementById('postTitle')?.value.trim();
    const tag = document.getElementById('postTag')?.value.trim();
    const date = document.getElementById('postDate')?.value.trim();
    const excerpt = document.getElementById('postExcerpt')?.value.trim();
    const body = document.getElementById('postBody')?.value.trim();
    if (!title || !tag || !excerpt || !body) return;

    const post = {
      id: `${slugifyPostTitle(title)}-${Date.now()}`,
      title,
      tag,
      date,
      excerpt,
      body,
      image: selectedImage,
      createdAt: Date.now(),
      authorRole: currentRole(),
      authorLogin: sessionStorage.getItem('irbisPanelLogin') || currentRole()
    };
    const posts = getStoredPosts();
    posts.push(post);
    try {
      saveStoredPosts(posts);
    } catch (error) {
      return;
    }
    form.reset();
    selectedImage = '';
    if (preview) preview.textContent = 'Brak zdjęcia';
    renderAdminList();
    renderDynamicPostPreview();
    renderDynamicPostsPage();
    alert('Post został dodany. Zobacz go na stronie głównej albo w zakładce Posty.');
  });
}

renderDynamicPostPreview();
renderDynamicPostsPage();
setupAdminPanel();
