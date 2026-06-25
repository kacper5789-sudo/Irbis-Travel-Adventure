const DEFAULT_ALBUMS = [
  { id:'alpy-2024', title:'Alpy 2024', place:'Szwajcaria', desc:'Przykładowy album. Kliknij „Dodaj zdjęcia”, aby podpiąć własne pliki z komputera.', photos:[] },
  { id:'turcja-2026', title:'Turcja 2026', place:'Turcja', desc:'Album testowy przypisany do pinezki na mapie.', photos:[] }
];
const DEFAULT_PINS = [
  { label:'Alpy Szwajcarskie', longitude:8.2, latitude:46.8, albumId:'alpy-2024', countryCode:'CH' },
  { label:'wspaniałe lato w Turcji 2026', longitude:35.2, latitude:39.0, albumId:'turcja-2026', countryCode:'TR' }
];
const DEFAULT_VISITED = ['PL'];
const CONTINENTS = [
  { key:'europa', label:'Europa', countries:['PL','AL','AD','AT','BY','BE','BA','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','XK','LV','LI','LT','LU','MT','MD','MC','ME','NL','MK','NO','PT','RO','SM','RS','SK','SI','ES','SE','CH','UA','GB','VA','SJ'] },
  { key:'azja', label:'Azja', countries:['AF','AM','AZ','BH','BD','BT','BN','KH','CN','GE','IN','ID','IR','IQ','IL','JP','JO','KZ','KW','KG','LA','LB','MY','MV','MN','MM','NP','KP','OM','PS','PK','PH','QA','RU','SA','SG','KR','LK','SY','TW','TJ','TH','TR','TM','AE','UZ','VN','YE','TL'] },
  { key:'afryka', label:'Afryka', countries:['DZ','AO','BJ','BW','BF','BI','CM','CV','CF','TD','KM','CG','CD','CI','DJ','EG','EH','GQ','ER','ET','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ','NA','NE','NG','RW','SN','SC','SZ','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW'] },
  { key:'ameryka-polnocna', label:'Ameryka Północna', countries:['CA','US','MX','GT','BZ','HN','SV','NI','CR','PA','CU','JM','HT','DO','BS','GL','PR','KY','VI','KN','AI','AG','GP','DM','MQ','BB','LC','VC','GD','BQ'] },
  { key:'ameryka-poludniowa', label:'Ameryka Południowa', countries:['AR','BO','BR','CL','CO','EC','GY','PY','PE','SR','UY','VE','CW','TT','GF'] },
  { key:'australia-oceania', label:'Australia i Oceania', countries:['AU','NZ','PG','FJ','SB','VU','WS','TO','NC'] },
  { key:'antarktyda', label:'Antarktyda', countries:['AQ'] }
];

const REGION_COUNTRIES = {
  US: {
    label:'Stany Zjednoczone', continent:'ameryka-polnocna', geodata:'usaLow', home:{ longitude:-98, latitude:39, zoom:2.8 },
    regions:{
      'US-AL':'Alabama','US-AK':'Alaska','US-AZ':'Arizona','US-AR':'Arkansas','US-CA':'Kalifornia','US-CO':'Kolorado','US-CT':'Connecticut','US-DE':'Delaware','US-FL':'Floryda','US-GA':'Georgia','US-HI':'Hawaje','US-ID':'Idaho','US-IL':'Illinois','US-IN':'Indiana','US-IA':'Iowa','US-KS':'Kansas','US-KY':'Kentucky','US-LA':'Luizjana','US-ME':'Maine','US-MD':'Maryland','US-MA':'Massachusetts','US-MI':'Michigan','US-MN':'Minnesota','US-MS':'Mississippi','US-MO':'Missouri','US-MT':'Montana','US-NE':'Nebraska','US-NV':'Nevada','US-NH':'New Hampshire','US-NJ':'New Jersey','US-NM':'Nowy Meksyk','US-NY':'Nowy Jork','US-NC':'Karolina Północna','US-ND':'Dakota Północna','US-OH':'Ohio','US-OK':'Oklahoma','US-OR':'Oregon','US-PA':'Pensylwania','US-RI':'Rhode Island','US-SC':'Karolina Południowa','US-SD':'Dakota Południowa','US-TN':'Tennessee','US-TX':'Teksas','US-UT':'Utah','US-VT':'Vermont','US-VA':'Wirginia','US-WA':'Waszyngton','US-WV':'Wirginia Zachodnia','US-WI':'Wisconsin','US-WY':'Wyoming','US-DC':'Dystrykt Kolumbii'}
  },
  CA: {
    label:'Kanada', continent:'ameryka-polnocna', geodata:'canadaLow', home:{ longitude:-96, latitude:57, zoom:2.25 },
    regions:{'CA-AB':'Alberta','CA-BC':'Kolumbia Brytyjska','CA-MB':'Manitoba','CA-NB':'Nowy Brunszwik','CA-NL':'Nowa Fundlandia i Labrador','CA-NS':'Nowa Szkocja','CA-NT':'Terytoria Północno-Zachodnie','CA-NU':'Nunavut','CA-ON':'Ontario','CA-PE':'Wyspa Księcia Edwarda','CA-QC':'Quebec','CA-SK':'Saskatchewan','CA-YT':'Jukon'}
  },
  BR: {
    label:'Brazylia', continent:'ameryka-poludniowa', geodata:'brazilLow', home:{ longitude:-54, latitude:-14, zoom:2.6 },
    regions:{'BR-AC':'Acre','BR-AL':'Alagoas','BR-AP':'Amapá','BR-AM':'Amazonas','BR-BA':'Bahia','BR-CE':'Ceará','BR-DF':'Dystrykt Federalny','BR-ES':'Espírito Santo','BR-GO':'Goiás','BR-MA':'Maranhão','BR-MT':'Mato Grosso','BR-MS':'Mato Grosso do Sul','BR-MG':'Minas Gerais','BR-PA':'Pará','BR-PB':'Paraíba','BR-PR':'Paraná','BR-PE':'Pernambuco','BR-PI':'Piauí','BR-RJ':'Rio de Janeiro','BR-RN':'Rio Grande do Norte','BR-RS':'Rio Grande do Sul','BR-RO':'Rondônia','BR-RR':'Roraima','BR-SC':'Santa Catarina','BR-SP':'São Paulo','BR-SE':'Sergipe','BR-TO':'Tocantins'}
  }
};


const AUTO_REGION_GEODATA = {
  US:['usaLow','Stany Zjednoczone','ameryka-polnocna',{longitude:-98,latitude:39,zoom:2.8}],
  CA:['canadaLow','Kanada','ameryka-polnocna',{longitude:-96,latitude:57,zoom:2.25}],
  BR:['brazilLow','Brazylia','ameryka-poludniowa',{longitude:-54,latitude:-14,zoom:2.6}],
  AU:['australiaLow','Australia','australia-oceania',{longitude:134,latitude:-25,zoom:2.7}],
  MX:['mexicoLow','Meksyk','ameryka-polnocna',{longitude:-102,latitude:23,zoom:3.3}],
  AR:['argentinaLow','Argentyna','ameryka-poludniowa',{longitude:-64,latitude:-35,zoom:2.8}],
  CL:['chileLow','Chile','ameryka-poludniowa',{longitude:-71,latitude:-30,zoom:2.9}],
  CO:['colombiaLow','Kolumbia','ameryka-poludniowa',{longitude:-74,latitude:4,zoom:3.3}],
  PE:['peruLow','Peru','ameryka-poludniowa',{longitude:-75,latitude:-9,zoom:3.2}],
  BO:['boliviaLow','Boliwia','ameryka-poludniowa',{longitude:-64,latitude:-17,zoom:3.2}],
  VE:['venezuelaLow','Wenezuela','ameryka-poludniowa',{longitude:-66,latitude:7,zoom:3.2}],
  PY:['paraguayLow','Paragwaj','ameryka-poludniowa',{longitude:-58,latitude:-23,zoom:4}],
  UY:['uruguayLow','Urugwaj','ameryka-poludniowa',{longitude:-56,latitude:-33,zoom:4.8}],
  EC:['ecuadorLow','Ekwador','ameryka-poludniowa',{longitude:-78,latitude:-1.5,zoom:4.2}],
  DE:['germanyLow','Niemcy','europa',{longitude:10.5,latitude:51,zoom:4.4}],
  FR:['franceLow','Francja','europa',{longitude:2.5,latitude:46.5,zoom:4.1}],
  IT:['italyLow','Włochy','europa',{longitude:12.5,latitude:42.7,zoom:4.2}],
  ES:['spainLow','Hiszpania','europa',{longitude:-3.5,latitude:40.2,zoom:4.1}],
  PL:['polandLow','Polska','europa',{longitude:19,latitude:52,zoom:5}],
  GB:['ukLow','Wielka Brytania','europa',{longitude:-2.5,latitude:54,zoom:4.1}],
  NL:['netherlandsLow','Holandia','europa',{longitude:5.3,latitude:52.2,zoom:5.8}],
  BE:['belgiumLow','Belgia','europa',{longitude:4.7,latitude:50.7,zoom:5.7}],
  CH:['switzerlandLow','Szwajcaria','europa',{longitude:8.2,latitude:46.8,zoom:5.6}],
  AT:['austriaLow','Austria','europa',{longitude:14,latitude:47.6,zoom:5.2}],
  CZ:['czechiaLow','Czechy','europa',{longitude:15.5,latitude:49.8,zoom:5.3}],
  NO:['norwayLow','Norwegia','europa',{longitude:9,latitude:62,zoom:3.3}],
  SE:['swedenLow','Szwecja','europa',{longitude:15,latitude:62,zoom:3.5}],
  FI:['finlandLow','Finlandia','europa',{longitude:26,latitude:64,zoom:3.6}],
  CN:['chinaLow','Chiny','azja',{longitude:104,latitude:35,zoom:2.5}],
  IN:['indiaLow','Indie','azja',{longitude:78,latitude:22,zoom:3}],
  JP:['japanLow','Japonia','azja',{longitude:138,latitude:37,zoom:3.6}],
  RU:['russiaLow','Rosja','azja',{longitude:90,latitude:61,zoom:1.5}],
  ID:['indonesiaLow','Indonezja','azja',{longitude:118,latitude:-2,zoom:2.4}],
  TH:['thailandLow','Tajlandia','azja',{longitude:101,latitude:15,zoom:3.7}],
  TR:['turkeyLow','Turcja','azja',{longitude:35,latitude:39,zoom:3.8}],
  ZA:['southAfricaLow','Republika Południowej Afryki','afryka',{longitude:24,latitude:-29,zoom:3.7}],
  NG:['nigeriaLow','Nigeria','afryka',{longitude:8,latitude:9,zoom:4.2}],
  EG:['egyptLow','Egipt','afryka',{longitude:30,latitude:27,zoom:3.9}]
};
// v10: regiony/prowincje/stany dla każdego kraju, dla którego amCharts udostępnia osobny plik geodata.
// Kliknięcie kraju zawsze najpierw próbuje wejść w podział administracyjny.
// Jeśli CDN nie ma takiej mapy dla danego kraju, klik nadal działa normalnie i zaznacza kraj.
const REGION_GEODATA_ALIASES = {
  US:['usaLow','unitedStatesLow'], CA:['canadaLow'], BR:['brazilLow'], AU:['australiaLow'], MX:['mexicoLow'],
  AR:['argentinaLow'], CL:['chileLow'], CO:['colombiaLow'], PE:['peruLow'], BO:['boliviaLow'], VE:['venezuelaLow'], PY:['paraguayLow'], UY:['uruguayLow'], EC:['ecuadorLow'],
  DE:['germanyLow'], FR:['franceLow'], IT:['italyLow'], ES:['spainLow'], PL:['polandLow'], GB:['ukLow','unitedKingdomLow'], NL:['netherlandsLow'], BE:['belgiumLow'], CH:['switzerlandLow'], AT:['austriaLow'], CZ:['czechiaLow','czechRepublicLow'], NO:['norwayLow'], SE:['swedenLow'], FI:['finlandLow'],
  CN:['chinaLow'], IN:['indiaLow'], JP:['japanLow'], RU:['russiaLow'], ID:['indonesiaLow'], TH:['thailandLow'], TR:['turkeyLow'], KR:['southKoreaLow','koreaSouthLow'], KP:['northKoreaLow','koreaNorthLow'],
  ZA:['southAfricaLow'], NG:['nigeriaLow'], EG:['egyptLow'], DZ:['algeriaLow'], AO:['angolaLow'], BJ:['beninLow'], BW:['botswanaLow'], BF:['burkinaFasoLow'], BI:['burundiLow'], CM:['cameroonLow'], CV:['capeVerdeLow'], CF:['centralAfricanRepublicLow'], TD:['chadLow'], KM:['comorosLow'], CG:['congoLow'], CD:['congoDRLow','democraticRepublicOfTheCongoLow','congoDemocraticRepublicLow'], CI:['ivoryCoastLow','coteDIvoireLow'], DJ:['djiboutiLow'], GQ:['equatorialGuineaLow'], ER:['eritreaLow'], ET:['ethiopiaLow'], GA:['gabonLow'], GM:['gambiaLow'], GH:['ghanaLow'], GN:['guineaLow'], GW:['guineaBissauLow'], KE:['kenyaLow'], LS:['lesothoLow'], LR:['liberiaLow'], LY:['libyaLow'], MG:['madagascarLow'], MW:['malawiLow'], ML:['maliLow'], MR:['mauritaniaLow'], MU:['mauritiusLow'], MA:['moroccoLow'], MZ:['mozambiqueLow'], NA:['namibiaLow'], NE:['nigerLow'], RW:['rwandaLow'], SN:['senegalLow'], SC:['seychellesLow'], SZ:['eswatiniLow','swazilandLow'], SL:['sierraLeoneLow'], SO:['somaliaLow'], SS:['southSudanLow'], SD:['sudanLow'], TZ:['tanzaniaLow'], TG:['togoLow'], TN:['tunisiaLow'], UG:['ugandaLow'], ZM:['zambiaLow'], ZW:['zimbabweLow'],
  GR:['greeceLow'], PT:['portugalLow'], RO:['romaniaLow'], UA:['ukraineLow'], IE:['irelandLow'], DK:['denmarkLow'], IS:['icelandLow'], HU:['hungaryLow'], BG:['bulgariaLow'], HR:['croatiaLow'], RS:['serbiaLow'], SK:['slovakiaLow'], SI:['sloveniaLow'], EE:['estoniaLow'], LV:['latviaLow'], LT:['lithuaniaLow'], BY:['belarusLow'], BA:['bosniaHerzegovinaLow'], AL:['albaniaLow'], MK:['northMacedoniaLow','macedoniaLow'], MD:['moldovaLow'], ME:['montenegroLow'],
  PK:['pakistanLow'], BD:['bangladeshLow'], VN:['vietnamLow'], MY:['malaysiaLow'], PH:['philippinesLow'], SA:['saudiArabiaLow'], IR:['iranLow'], IQ:['iraqLow'], IL:['israelLow'], KZ:['kazakhstanLow'], UZ:['uzbekistanLow'], MN:['mongoliaLow'], MM:['myanmarLow'], NP:['nepalLow'], LK:['sriLankaLow'], KH:['cambodiaLow'], LA:['laosLow'], AE:['uaeLow','unitedArabEmiratesLow'],
  NZ:['newZealandLow'], PG:['papuaNewGuineaLow'], FJ:['fijiLow']
};
function supportsRegionMap(countryCode){ return !!countryCode && countryCode !== 'AQ'; }
function regionCountryLabel(countryCode){ return REGION_COUNTRIES[countryCode]?.label || AUTO_REGION_GEODATA[countryCode]?.[1] || countryName(countryCode); }
function fullPlaceName(countryCode, regionCode){
  if(regionCode) return `${regionName(regionCode)}, ${regionCountryLabel(countryCode)}`;
  return countryCode ? regionCountryLabel(countryCode) : 'Nowe wspomnienie';
}
function normalizeGeodataName(geoName){ return String(geoName || '').replace(/^am5geodata_/, ''); }
function geodataScriptUrl(geoName){ return `https://cdn.amcharts.com/lib/5/geodata/${normalizeGeodataName(geoName)}.js`; }
function geodataVarName(geoName){ return 'am5geodata_' + normalizeGeodataName(geoName); }
function loadGeodataScript(geoName){
  const cleanName = normalizeGeodataName(geoName);
  return new Promise((resolve,reject)=>{
    if(window[geodataVarName(cleanName)]) return resolve(window[geodataVarName(cleanName)]);
    const existing = document.querySelector(`script[data-geodata="${cleanName}"]`);
    if(existing){
      existing.addEventListener('load',()=>window[geodataVarName(cleanName)] ? resolve(window[geodataVarName(cleanName)]) : reject(new Error('Brak zmiennej geodata')),{once:true});
      existing.addEventListener('error',()=>reject(new Error('Brak mapy regionów')),{once:true});
      return;
    }
    const script=document.createElement('script');
    let done=false;
    const finish=(fn)=>{ if(done) return; done=true; clearTimeout(timer); fn(); };
    const timer=setTimeout(()=>finish(()=>{ script.remove(); reject(new Error('Timeout mapy regionów')); }),4500);
    script.src=geodataScriptUrl(cleanName);
    script.dataset.geodata=cleanName;
    script.onload=()=>finish(()=>window[geodataVarName(cleanName)] ? resolve(window[geodataVarName(cleanName)]) : reject(new Error('Brak zmiennej geodata')));
    script.onerror=()=>finish(()=>{ script.remove(); reject(new Error('Brak mapy regionów')); });
    document.head.appendChild(script);
  });
}
function camelCaseWords(text){
  return String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,' and ').replace(/[^A-Za-z0-9]+/g,' ').trim().split(/\s+/).filter(Boolean).map((w,i)=>i? w.charAt(0).toUpperCase()+w.slice(1).toLowerCase():w.toLowerCase()).join('');
}
function regionGeodataCandidates(countryCode, countryLabel){
  const base = [...(REGION_GEODATA_ALIASES[countryCode]||[])];
  const auto = AUTO_REGION_GEODATA[countryCode]?.[0];
  if(auto) base.push(auto);
  const englishName = countryLabel || countryName(countryCode);
  const camel = camelCaseWords(englishName);
  if(camel) base.push(camel+'Low');
  base.push(String(countryCode||'').toLowerCase()+'Low');
  return [...new Set(base.filter(Boolean))];
}
async function loadFirstAvailableGeodata(candidates){
  for(const name of candidates){
    try{ return { geoName: normalizeGeodataName(name), geoJSON: await loadGeodataScript(name) }; }
    catch(e){}
  }
  return null;
}

function getVisitedRegions(){return new Set(JSON.parse(localStorage.getItem('memoryVisitedRegions') || '[]'));}
function saveVisitedRegions(set){localStorage.setItem('memoryVisitedRegions',JSON.stringify([...set]));}
function regionName(code){const saved=JSON.parse(localStorage.getItem('memoryRegionNames')||'{}');if(saved[code])return saved[code];for(const country of Object.values(REGION_COUNTRIES)){if(country.regions[code]) return country.regions[code];}return code;}
function countryForRegion(regionCode){return Object.keys(REGION_COUNTRIES).find(code => REGION_COUNTRIES[code].regions?.[regionCode] || regionCode.startsWith(code + '-'));}
function regionCodesForCountry(countryCode){const meta=REGION_COUNTRIES[countryCode];const names=JSON.parse(localStorage.getItem('memoryRegionNames')||'{}');const fixed=Object.keys(meta?.regions||{});const dynamic=Object.keys(names).filter(code=>code.startsWith(countryCode+'-'));return [...new Set([...fixed,...dynamic])];}
function hasVisitedRegion(countryCode){const regions=getVisitedRegions();return regionCodesForCountry(countryCode).some(code=>regions.has(code));}

const COUNTRY_NAMES = typeof Intl !== 'undefined' ? new Intl.DisplayNames(['pl'],{type:'region'}) : null;
const DB_NAME = 'TwojaMapaWspomnienDB';
const DB_VERSION = 1;
const PHOTO_STORE = 'photos';

function slugify(text){return String(text||'album').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || 'album'}
function getAlbums(){return JSON.parse(localStorage.getItem('memoryAlbums') || JSON.stringify(DEFAULT_ALBUMS));}
function saveAlbums(albums){localStorage.setItem('memoryAlbums',JSON.stringify(albums));}
function getPins(){return JSON.parse(localStorage.getItem('memoryPins') || JSON.stringify(DEFAULT_PINS));}
function savePins(pins){localStorage.setItem('memoryPins',JSON.stringify(pins));}
function getVisited(){const set=new Set(JSON.parse(localStorage.getItem('memoryVisited') || JSON.stringify(DEFAULT_VISITED)));DEFAULT_VISITED.forEach(c=>set.add(c));return set}
function saveVisited(set){localStorage.setItem('memoryVisited',JSON.stringify([...set]));}
function rebuildVisitedFromPins(){
  const next = new Set(DEFAULT_VISITED);
  const nextRegions = new Set();
  getPins().forEach(pin => { if(pin.countryCode) next.add(pin.countryCode); if(pin.regionCode) nextRegions.add(pin.regionCode); });
  saveVisited(next);
  saveVisitedRegions(nextRegions);
  return next;
}
function countryName(code){try{return COUNTRY_NAMES?.of(code)||code}catch(e){return code}}
function continentFor(code){return CONTINENTS.find(c => c.countries.includes(code));}

function openDB(){
  return new Promise((resolve,reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) db.createObjectStore(PHOTO_STORE, { keyPath:'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function putPhotoRecord(record){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    tx.objectStore(PHOTO_STORE).put(record);
    tx.oncomplete = () => resolve(record);
    tx.onerror = () => reject(tx.error);
  });
}
async function getPhotoRecord(id){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(PHOTO_STORE, 'readonly');
    const req = tx.objectStore(PHOTO_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}
async function deletePhotoRecord(id){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    tx.objectStore(PHOTO_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
function makePhotoId(){return 'photo-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,9)}

function renderContinents(visited){
  const wrap=document.getElementById('continentList'); if(!wrap)return;
  const visitedRegions = getVisitedRegions();
  wrap.innerHTML=CONTINENTS.map(c=>{
    const listed=c.countries.filter(code=>visited.has(code) || hasVisitedRegion(code));
    const rows=listed.length?listed.map(code=>{
      const regionMeta = REGION_COUNTRIES[code];
      if(regionMeta){
        const regionCodes = regionCodesForCountry(code).filter(regionCode=>visitedRegions.has(regionCode));
        const regionRows = regionCodes.map(regionCode=>`<div class="country region-row"><span class="dot"></span><span>${regionName(regionCode)}</span></div>`).join('');
        const regionCount = regionCodes.length;
        return `<div class="country country-main"><span class="dot"></span><span>${countryName(code)}${regionCount ? ` <small>(${regionCount} regionów)</small>` : ''}</span></div>${regionRows}`;
      }
      return `<div class="country"><span class="dot"></span><span>${countryName(code)}</span></div>`;
    }).join(''):`<div class="country" style="opacity:.55">Brak zaznaczonych krajów</div>`;
    return `<section class="continent"><button class="continent-btn" type="button"><span>${c.label} <small>(${listed.length})</small></span><span class="chev">⌄</span></button><div class="country-list">${rows}</div></section>`
  }).join('');
  wrap.querySelectorAll('.continent-btn').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.continent').classList.toggle('open')))
}

document.querySelectorAll('.menu-toggle').forEach(btn=>btn.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.toggle('open')));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.remove('open')));

function ensureAlbumPhotoArray(album){ if(!Array.isArray(album.photos)) album.photos=[]; return album; }
function selectedAlbumId(){ return new URLSearchParams(location.search).get('album'); }
async function renderSelectedAlbum(album){
  const details = document.getElementById('albumDetails');
  if(!details || !album) return;
  ensureAlbumPhotoArray(album);
  details.style.display='block';
  document.getElementById('detailTitle').textContent=album.title;
  document.getElementById('detailDesc').textContent=album.desc || 'Tu pojawią się zdjęcia i opis wyprawy.';
  document.getElementById('detailPlace').textContent=album.place || 'Album podróżniczy';
  const grid = document.getElementById('photoGrid');
  grid.innerHTML = '';
  if(!album.photos.length){
    grid.innerHTML = `<div class="photo-placeholder empty-photo">Brak zdjęć w albumie.<br><small>Kliknij „+ Dodaj zdjęcia”, żeby skopiować je do aplikacji.</small></div>`;
  } else {
    for(const photoId of album.photos){
      const record = await getPhotoRecord(photoId);
      if(!record) continue;
      const url = URL.createObjectURL(record.blob);
      const tile = document.createElement('figure');
      tile.className = 'memory-photo';
      tile.innerHTML = `<img src="${url}" alt="${record.name || 'Zdjęcie'}"><figcaption>${record.name || 'Zdjęcie'}</figcaption><button type="button" class="remove-photo" data-photo-id="${photoId}">Usuń</button>`;
      grid.appendChild(tile);
    }
    grid.querySelectorAll('.remove-photo').forEach(btn => btn.addEventListener('click', async () => {
      const id = btn.dataset.photoId;
      if(!confirm('Usunąć kopię zdjęcia z aplikacji? Oryginał na dysku zostaje nietknięty.')) return;
      const albums = getAlbums().map(ensureAlbumPhotoArray);
      const target = albums.find(a => a.id === album.id);
      if(target) target.photos = target.photos.filter(p => p !== id);
      saveAlbums(albums);
      await deletePhotoRecord(id);
      renderGalleryPage();
    }));
  }
  details.scrollIntoView({behavior:'smooth',block:'start'});
}
async function addFilesToAlbum(albumId, files){
  const albums = getAlbums().map(ensureAlbumPhotoArray);
  const album = albums.find(a => a.id === albumId);
  if(!album) return alert('Nie znaleziono albumu.');
  for(const file of files){
    if(!file.type.startsWith('image/')) continue;
    const id = makePhotoId();
    await putPhotoRecord({ id, name:file.name, type:file.type, size:file.size, createdAt:new Date().toISOString(), blob:file });
    album.photos.push(id);
  }
  saveAlbums(albums);
  renderGalleryPage();
}
function renderAlbumCards(albums, selected){
  const grid=document.getElementById('albumGrid'); if(!grid)return;
  grid.innerHTML=albums.map(a=>{
    ensureAlbumPhotoArray(a);
    const active = selected === a.id ? ' active' : '';
    return `<article class="album-card${active}"><div><div class="album-cover">${a.photos.length ? `${a.photos.length} zdjęć` : 'Miejsce na zdjęcia'}</div><h3>${a.title}</h3><div class="album-meta">${a.place||'Podróż'}</div><p>${a.desc||'Opis albumu pojawi się tutaj.'}</p></div><div class="album-actions"><a class="btn secondary" href="galeria.html?album=${a.id}">Otwórz album</a><button class="btn danger delete-album" type="button" data-album-id="${a.id}">Usuń album</button></div></article>`
  }).join('');
}

async function deleteAlbum(albumId){
  const albums = getAlbums().map(ensureAlbumPhotoArray);
  const album = albums.find(a => a.id === albumId);
  if(!album) return;
  if(!confirm(`Usunąć album „${album.title}”?\n\nZostaną usunięte jego kopie zdjęć w aplikacji oraz pinezki przypisane do tego albumu. Oryginalne zdjęcia na dysku zostają nietknięte.`)) return;

  for(const photoId of album.photos || []){
    try { await deletePhotoRecord(photoId); } catch(e) {}
  }

  const nextAlbums = albums.filter(a => a.id !== albumId);
  saveAlbums(nextAlbums);

  const nextPins = getPins().filter(pin => pin.albumId !== albumId);
  savePins(nextPins);
  rebuildVisitedFromPins();

  const current = selectedAlbumId();
  if(current === albumId) location.href = 'galeria.html';
  else renderGalleryPage();
}

async function renderGalleryPage(){
  const albums = getAlbums().map(ensureAlbumPhotoArray);
  saveAlbums(albums);
  const selected = selectedAlbumId();
  renderAlbumCards(albums, selected);
  document.querySelectorAll('.delete-album').forEach(btn => btn.addEventListener('click', () => deleteAlbum(btn.dataset.albumId)));
  const add=document.getElementById('addAlbum');
  add?.addEventListener('click',()=>{
    const title=document.getElementById('albumTitle').value.trim();
    if(!title)return alert('Wpisz nazwę albumu');
    const album={id:slugify(title)+'-'+Date.now().toString(36), title, place:document.getElementById('albumPlace').value.trim(), desc:document.getElementById('albumDesc').value.trim(), photos:[]};
    const next=[...getAlbums().map(ensureAlbumPhotoArray),album];
    saveAlbums(next);
    location.href='galeria.html?album='+album.id
  });
  document.getElementById('resetDemo')?.addEventListener('click',()=>{localStorage.removeItem('memoryAlbums');localStorage.removeItem('memoryPins');localStorage.removeItem('memoryVisited');location.reload()});
  const album = albums.find(a => a.id === selected);
  if(album){
    await renderSelectedAlbum(album);
    const input = document.getElementById('photoInput');
    const btn = document.getElementById('addPhotosBtn');
    btn?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', async () => {
      if(input.files?.length) await addFilesToAlbum(album.id, [...input.files]);
      input.value = '';
    });
  }
}

function createPinAlbumDialog(){
  if(document.getElementById('pinAlbumDialog')) return;
  const dialog = document.createElement('div');
  dialog.id = 'pinAlbumDialog';
  dialog.className = 'app-dialog';
  dialog.innerHTML = `
    <div class="app-dialog-card">
      <button type="button" class="dialog-close" id="closePinDialog">×</button>
      <h2>📍 Nowe wspomnienie</h2>
      <p>Najpierw wybierz, czy chcesz utworzyć nowy album, czy przypisać pinezkę do albumu, który już istnieje.</p>
      <div class="choice-grid">
        <button type="button" class="choice-card" id="chooseNewAlbum"><strong>➕ Utwórz nowy album</strong><span>Nowa wyprawa, nowe miejsce albo nowa historia.</span></button>
        <button type="button" class="choice-card" id="chooseExistingAlbum"><strong>📂 Przypisz do istniejącego</strong><span>Połącz pinezkę z albumem, który już masz.</span></button>
      </div>
      <div class="dialog-form pin-mode-form" id="newAlbumForm" hidden>
        <div class="mode-title">➕ Utwórz nowy album</div>
        <label>Nowy album<input id="newPinAlbumTitle" placeholder="np. Norwegia 2024"></label>
        <label>Miejsce<input id="newPinAlbumPlace" placeholder="np. Lofoty, Norwegia"></label>
        <label>Opis<textarea id="newPinAlbumDesc" placeholder="Krótka historia tego miejsca"></textarea></label>
        <button type="button" class="btn gold" id="savePinNewAlbum">Utwórz album i pinezkę</button>
      </div>
      <div class="dialog-form pin-mode-form" id="existingAlbumForm" hidden>
        <div class="mode-title">📂 Przypisz do istniejącego albumu</div>
        <div class="existing-albums-head">Wybierz album</div>
        <div class="existing-album-list" id="existingAlbumList"></div>
        <button type="button" class="btn gold" id="savePinExistingAlbum" disabled>Przypisz pinezkę</button>
      </div>
    </div>`;
  document.body.appendChild(dialog);
}

function buildMemoryMap(){
  const tooltip=document.getElementById('tooltip');
  let visited=getVisited();
  let visitedRegions=getVisitedRegions();
  renderContinents(visited);
  // Strona klienta: pinezki mają tylko krótki opis, bez albumów.
  // createPinAlbumDialog();
  am5.ready(function(){
    const root=am5.Root.new('worldMap');root.setThemes([am5themes_Animated.new(root)]);root._logo.dispose();
    const chart=root.container.children.push(am5map.MapChart.new(root,{panX:'rotateX',panY:'translateY',projection:am5map.geoNaturalEarth1(),wheelY:'zoom',maxZoomLevel:16,homeGeoPoint:{longitude:12,latitude:20},homeZoomLevel:1}));
    const polygonSeries=chart.series.push(am5map.MapPolygonSeries.new(root,{geoJSON:am5geodata_worldLow,exclude:['AQ']}));
    polygonSeries.mapPolygons.template.setAll({tooltipText:'{name}',interactive:true,fill:am5.color(0xe7eef5),stroke:am5.color(0x5b6977),strokeWidth:.7});
    const regionBackBtn = document.getElementById('regionBack');
    const countryRegionTitle = document.getElementById('countryRegionTitle');
    let activeRegionCountry = null;
    function showCountryRegionTitle(name){
      if(!countryRegionTitle) return;
      countryRegionTitle.textContent = name || '';
      countryRegionTitle.classList.toggle('active', !!name);
    }
    function hideCountryRegionTitle(){ showCountryRegionTitle(''); }
    const regionSeriesByCountry = {};
    function getGeodata(geoName){ return window[geodataVarName(geoName)] || window[geoName] || null; }
    function registerRegionSeries(countryCode, meta, geoJSON){
      if(regionSeriesByCountry[countryCode]) return regionSeriesByCountry[countryCode];
      const series = chart.series.push(am5map.MapPolygonSeries.new(root,{geoJSON}));
      series.mapPolygons.template.setAll({tooltipText:'{name}',interactive:true,fill:am5.color(0xe7eef5),stroke:am5.color(0x5b6977),strokeWidth:.7});
      series.set('visible', false);
      series.mapPolygons.template.events.on('click', ev=>{
        const ctx = ev.target.dataItem.dataContext;
        const regionCode = ctx.id;
        const names = JSON.parse(localStorage.getItem('memoryRegionNames') || '{}');
        names[regionCode] = ctx.name || meta.regions?.[regionCode] || regionCode;
        localStorage.setItem('memoryRegionNames', JSON.stringify(names));
        lastPinCountryCode = countryCode;
        lastPinRegionCode = regionCode;
        if(pinMode) return;
        if(visitedRegions.has(regionCode)) visitedRegions.delete(regionCode); else visitedRegions.add(regionCode);
        saveVisitedRegions(visitedRegions);
        if(hasVisitedRegion(countryCode)) visited.add(countryCode); else visited.delete(countryCode);
        saveVisited(visited);
        series.mapPolygons.each(colorRegionPolygon);
        polygonSeries.mapPolygons.each(colorPolygon);
        renderContinents(visited);
      });
      series.events.on('datavalidated',()=>{
        const names = JSON.parse(localStorage.getItem('memoryRegionNames') || '{}');
        series.mapPolygons.each(poly=>{
          const ctx=poly.dataItem?.dataContext;
          if(ctx?.id && ctx?.name) names[ctx.id]=ctx.name;
          colorRegionPolygon(poly);
        });
        localStorage.setItem('memoryRegionNames', JSON.stringify(names));
      });
      regionSeriesByCountry[countryCode] = series;
      return series;
    }
    Object.entries(REGION_COUNTRIES).forEach(([countryCode, meta])=>{
      const geoJSON = getGeodata(meta.geodata);
      if(geoJSON) registerRegionSeries(countryCode, meta, geoJSON);
    });
    async function ensureRegionCountry(countryCode, countryLabel){
      if(!supportsRegionMap(countryCode)) return false;
      if(regionSeriesByCountry[countryCode]) return true;
      let meta = REGION_COUNTRIES[countryCode];
      if(!meta && AUTO_REGION_GEODATA[countryCode]){
        const [geoName,label,continent,home] = AUTO_REGION_GEODATA[countryCode];
        meta = REGION_COUNTRIES[countryCode] = { label, continent, geodata:geoName, home, regions:{} };
      }
      if(!meta){
        const continent = continentFor(countryCode)?.key || '';
        meta = REGION_COUNTRIES[countryCode] = {
          label: countryLabel || countryName(countryCode),
          continent,
          geodata: '',
          home: { longitude: 12, latitude: 20, zoom: 3 },
          regions:{}
        };
      }
      const candidates = regionGeodataCandidates(countryCode, countryLabel || meta.label);
      const loaded = getGeodata(meta.geodata) ? { geoName: meta.geodata, geoJSON: getGeodata(meta.geodata) } : await loadFirstAvailableGeodata(candidates);
      if(!loaded) return false;
      meta.geodata = loaded.geoName;
      registerRegionSeries(countryCode, meta, loaded.geoJSON);
      return true;
    }
    function colorRegionPolygon(poly){const id=poly.dataItem?.dataContext?.id;if(!id)return;poly.set('fill',visitedRegions.has(id)?am5.color(0x72b85a):am5.color(0xe7eef5));}
    async function enterRegionMap(countryCode, countryLabel){
      const ok = await ensureRegionCountry(countryCode, countryLabel);
      const meta = REGION_COUNTRIES[countryCode], series = regionSeriesByCountry[countryCode];
      if(!ok || !meta || !series) return false;
      activeRegionCountry = countryCode;
      const geo = series.get('geoJSON');
      if(geo?.features?.length){
        let lon=0, lat=0, count=0;
        geo.features.forEach(f=>{
          const coords = JSON.stringify(f.geometry?.coordinates || []);
          const nums = coords.match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
          for(let i=0;i<nums.length-1;i+=2){ lon += nums[i]; lat += nums[i+1]; count++; }
        });
        if(count){ meta.home = { longitude: lon/count, latitude: lat/count, zoom: meta.home?.zoom || 3.8 }; }
      }
      polygonSeries.set('visible', false);
      Object.entries(regionSeriesByCountry).forEach(([code,sr])=>sr.set('visible', code === countryCode));
      regionBackBtn?.classList.add('active');
      showCountryRegionTitle(meta.label || countryLabel || countryName(countryCode));
      series.mapPolygons.each(colorRegionPolygon);
      chart.zoomToGeoPoint({longitude:meta.home.longitude, latitude:meta.home.latitude}, meta.home.zoom, true);
      try{pinSeries?.toFront(); renderPins?.();}catch(e){}
      return true;
    }
    function exitRegionMap(){
      activeRegionCountry = null;
      polygonSeries.set('visible', true);
      Object.values(regionSeriesByCountry).forEach(sr=>sr.set('visible', false));
      regionBackBtn?.classList.remove('active');
      hideCountryRegionTitle();
      chart.goHome();
      polygonSeries.mapPolygons.each(colorPolygon);
      try{pinSeries?.toFront(); renderPins?.();}catch(e){}
    }
    regionBackBtn?.addEventListener('click', exitRegionMap);

    function colorPolygon(poly){const id=poly.dataItem?.dataContext?.id;if(!id)return;poly.set('fill',(visited.has(id)||hasVisitedRegion(id))?am5.color(0x72b85a):am5.color(0xe7eef5));}
    let pinMode=false;
    let lastPinCountryCode=null;
    let lastPinRegionCode=null;
    function refreshVisitedCountry(code){
      if(code){ visited.add(code); saveVisited(visited); polygonSeries.mapPolygons.each(colorPolygon); renderContinents(visited); }
    }
    function toggleVisitedCountry(id){
      if(visited.has(id)) visited.delete(id); else visited.add(id);
      saveVisited(visited);
      polygonSeries.mapPolygons.each(colorPolygon);
      renderContinents(visited);
    }
    polygonSeries.mapPolygons.template.events.on('click',ev=>{
      const id=ev.target.dataItem.dataContext.id;
      if(pinMode){ lastPinCountryCode = id; lastPinRegionCode = null; return; }
      if(supportsRegionMap(id)){
        enterRegionMap(id, ev.target.dataItem.dataContext.name).then(opened=>{
          if(!opened) toggleVisitedCountry(id);
        });
        return;
      }
      toggleVisitedCountry(id);
    });
    polygonSeries.events.on('datavalidated',()=>{
      polygonSeries.mapPolygons.each(colorPolygon);
      const ids=[];
      polygonSeries.mapPolygons.each(poly=>{ const ctx=poly.dataItem?.dataContext; if(ctx?.id) ids.push(ctx.id); });
      console.info('[Mapa wspomnień v11] Test 1/2: kraje na mapie świata:', ids.length);
      console.info('[Mapa wspomnień v11] Test 2/2: każdy kraj ma bezpieczny klik; regiony są ładowane automatycznie, a brak pliku nie blokuje kraju.');
    });
    const pinSeries=chart.series.push(am5map.MapPointSeries.new(root,{}));
    let pins=getPins();
    const pinMenu=document.getElementById('pinMenu'),pinMenuTitle=document.getElementById('pinMenuTitle'),editPin=document.getElementById('editPin'),deletePin=document.getElementById('deletePin');
    let activePinIndex=null,openedAt=0;
    function hideMenu(){activePinIndex=null;pinMenu.classList.remove('active')}
    function showMenu(index,e){const pin=pins[index];if(!pin)return;activePinIndex=index;openedAt=Date.now();pinMenuTitle.textContent='📍 '+pin.label;pinMenu.classList.add('active');const x=e?.clientX||innerWidth/2,y=e?.clientY||innerHeight/2;pinMenu.style.left=Math.min(Math.max(12,x+12),innerWidth-280)+'px';pinMenu.style.top=Math.min(Math.max(12,y+12),innerHeight-130)+'px'}
    function renderPins(){pinSeries.data.setAll(pins.map((pin,index)=>({id:index,label:pin.label,albumId:pin.albumId,geometry:{type:'Point',coordinates:[pin.longitude,pin.latitude]}})));try{pinSeries.toFront();}catch(e){}}
    pinSeries.bullets.push((root,series,dataItem)=>{const container=am5.Container.new(root,{centerX:am5.p50,centerY:am5.p100,interactive:true,cursorOverStyle:'pointer'});container.children.push(am5.Label.new(root,{text:'📍',fontSize:24,centerX:am5.p50,centerY:am5.p50,dy:-8}));container.children.push(am5.Label.new(root,{text:dataItem.dataContext.label||'Punkt',centerX:am5.p50,centerY:am5.p0,dy:12,fontSize:13,fontWeight:'800',fill:am5.color(0xffffff),background:am5.RoundedRectangle.new(root,{fill:am5.color(0x02080e),fillOpacity:.86,stroke:am5.color(0xd99a2b),strokeOpacity:.55,cornerRadiusTL:7,cornerRadiusTR:7,cornerRadiusBL:7,cornerRadiusBR:7}),paddingLeft:8,paddingRight:8,paddingTop:4,paddingBottom:4}));container.events.on('click',ev=>{const se=ev.originalEvent||ev.event;se?.stopPropagation?.();showMenu(dataItem.dataContext.id,se)});return am5.Bullet.new(root,{sprite:container})});
    renderPins();
    document.addEventListener('click',ev=>{if(Date.now()-openedAt<250)return;if(!pinMenu.contains(ev.target))hideMenu()});
    document.addEventListener('keydown',ev=>{if(ev.key==='Escape')hideMenu()});
    editPin.addEventListener('click',()=>{if(activePinIndex===null)return;const pin=pins[activePinIndex];const label=prompt('Opis pinezki:',pin.label);if(label&&label.trim()){pin.label=label.trim();savePins(pins);renderPins()}hideMenu()});
    deletePin.addEventListener('click',()=>{if(activePinIndex===null)return;if(confirm('Usunąć pinezkę?')){pins.splice(activePinIndex,1);savePins(pins);visited = rebuildVisitedFromPins();polygonSeries.mapPolygons.each(colorPolygon);renderContinents(visited);renderPins()}hideMenu()});
    const addPinBtn = document.getElementById('addPin');
    addPinBtn.addEventListener('click',()=>{pinMode=!pinMode;addPinBtn.classList.toggle('active',pinMode);addPinBtn.title=pinMode?'Kliknij miejsce na mapie':'Dodaj pinezkę'});

    // Strona klienta: bez albumów. Pinezka = krótki opis + miejsce na mapie.
    function addSimplePin(label, geoPoint, countryCode, regionCode){
      pins.push({
        label,
        longitude: geoPoint.longitude,
        latitude: geoPoint.latitude,
        countryCode: countryCode || null,
        regionCode: regionCode || null
      });
      savePins(pins);
      if(regionCode){
        visitedRegions.add(regionCode);
        saveVisitedRegions(visitedRegions);
        const sr = regionSeriesByCountry[countryCode];
        sr?.mapPolygons.each(colorRegionPolygon);
      }
      renderPins();
      refreshVisitedCountry(countryCode);
    }

    chart.events.on('click',ev=>{
      if(!pinMode)return;
      hideMenu();
      let geoPoint=null;try{geoPoint=chart.invert(chart.toLocal(ev.point))}catch(e){}
      if(!geoPoint)return alert('Nie udało się odczytać miejsca.');
      const code = lastPinCountryCode || activeRegionCountry;
      const regionCode = lastPinRegionCode;
      const placeName = fullPlaceName(code, regionCode);
      const defaultName = placeName ? placeName + ' ' + new Date().getFullYear() : 'Nowe miejsce';
      const label = prompt('Krótki opis pinezki:', defaultName);
      if(!label || !label.trim()) return;
      addSimplePin(label.trim(), geoPoint, code, regionCode);
      pinMode=false;
      addPinBtn.classList.remove('active');
      addPinBtn.title='Dodaj pinezkę';
      lastPinCountryCode=null;
      lastPinRegionCode=null;
    });
    document.getElementById('zoomIn').addEventListener('click',()=>chart.zoomIn());
    document.getElementById('zoomOut').addEventListener('click',()=>chart.zoomOut());
    document.getElementById('zoomHome').addEventListener('click',()=> activeRegionCountry ? exitRegionMap() : chart.goHome());
    const fullscreenBtn=document.getElementById('mapFullscreen');
    const mapCard=document.querySelector('.map-card');
    const forceMapResize=()=>{
      requestAnimationFrame(()=>{
        try{root.resize();}catch(e){}
        try{chart.appear(0,0);}catch(e){}
      });
      [80,180,320,600].forEach(delay=>setTimeout(()=>{
        try{root.resize();}catch(e){}
      },delay));
    };
    fullscreenBtn.addEventListener('click',()=>{
      if(!document.fullscreenElement){
        mapCard.requestFullscreen?.().then(forceMapResize).catch(forceMapResize);
      }else{
        document.exitFullscreen?.().then(forceMapResize).catch(forceMapResize);
      }
    });
    document.addEventListener('fullscreenchange',forceMapResize);
    window.addEventListener('resize',forceMapResize);
  });
}
