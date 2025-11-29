
const API_BASE = '/api/client';
let lang = localStorage.getItem('lang') || 'en';
const i18n = {
  en: {
    about: 'About',
    menu: 'Menu',
    team: 'Team',
    contact: 'Contact',
    address: 'Address',
    about_title: 'About us',
    team_title: 'Team',
    contact_title: 'Contact',
    address_title: 'Address'
  },
  ru: {
    about: 'О нас',
    menu: 'Меню',
    team: 'Команда',
    contact: 'Контакты',
    address: 'Адрес',
    about_title: 'О нас',
    team_title: 'Команда',
    contact_title: 'Контакты',
    address_title: 'Адрес'
  },
  kg: {
    about: 'Биз жөнүндө',
    menu: 'Меню',
    team: 'Команда',
    contact: 'Контакт',
    address: 'Дарек',
    about_title: 'Биз жөнүндө',
    team_title: 'Команда',
    contact_title: 'Контакт',
    address_title: 'Дарек'
  }
};

function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    el.innerText = i18n[lang][key] || i18n['en'][key] || key;
  });
}

document.getElementById('langSelect').value = lang;
document.getElementById('langSelect').addEventListener('change', (e)=> {
  lang = e.target.value;
  localStorage.setItem('lang', lang);
  applyI18n();
  loadCategories();
});

document.getElementById('menuBtn').addEventListener('click', ()=> showSection('categories'));
document.getElementById('aboutBtn').addEventListener('click', ()=> showSection('about'));
document.getElementById('teamBtn').addEventListener('click', ()=> showSection('team'));
document.getElementById('contactBtn').addEventListener('click', ()=> showSection('contact'));
document.getElementById('addressBtn').addEventListener('click', ()=> showSection('address'));
document.getElementById('backToCats').addEventListener('click', ()=> showSection('categories'));

function showSection(id){
  ['about','categories','itemsBlock','team','contact','address'].forEach(s=>{
    document.getElementById(s) && (document.getElementById(s).classList.add('hidden'));
  });
  document.getElementById(id) && (document.getElementById(id).classList.remove('hidden'));
}

applyI18n();
showSection('categories');
loadCategories();

function loadCategories(){
  fetch(`${API_BASE}/categories`)
    .then(r => r.json())
    .then(data => {
      const root = document.getElementById('categories');
      root.innerHTML = '';
      data.forEach(cat => {
        const name = lang==='kg' ? cat.name_kg : (lang==='ru' ? cat.name_ru : cat.name_en);
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl p-4 shadow cursor-pointer flex flex-col items-center';
        card.innerHTML = `
          <img src="${cat.image_url||'/assets/placeholder.png'}" alt="${name}" class="w-full h-40 object-cover rounded-lg mb-3">
          <h3 class="text-lg font-semibold">${name||'---'}</h3>
        `;
        card.onclick = () => loadItems(cat.id, name);
        root.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Load categories error', err);
    });
}

function loadItems(categoryId, categoryName){
  fetch(`${API_BASE}/items/${categoryId}`)
    .then(r => r.json())
    .then(data => {
      const list = document.getElementById('itemsList');
      list.innerHTML = '';
      data.forEach(item => {
        const name = lang==='kg' ? item.name_kg : (lang==='ru' ? item.name_ru : item.name_en);
        const desc = lang==='kg' ? item.description_kg : (lang==='ru' ? item.description_ru : item.description_en);
        const priceLabel = lang==='kg' ? 'Баасы' : (lang==='ru' ? 'Цена' : 'Price');
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl p-4 shadow';
        card.innerHTML = `
          <img src="${item.image_url||'/assets/placeholder.png'}" alt="${name}" class="w-full h-36 object-cover rounded-lg mb-3">
          <h4 class="font-semibold">${name || '---'}</h4>
          <p class="text-sm mt-2">${desc || ''}</p>
          <div class="mt-3 font-medium">${priceLabel}: ${item.price ?? '---'}</div>
        `;
        list.appendChild(card);
      });

      showSection('itemsBlock');
      document.getElementById('itemsBlock').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => console.error('Load items error', err));
}
