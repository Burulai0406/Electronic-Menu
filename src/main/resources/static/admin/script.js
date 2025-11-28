
const ADMIN_API = '/api/admin';
let authHeader = localStorage.getItem('authHeader') || null;

const showMessage = (msg, type='info') => {
  alert(msg);
};

function setAuthHeader(username, password){
  authHeader = 'Basic ' + btoa(`${username}:${password}`);
  localStorage.setItem('authHeader', authHeader);
  document.getElementById('adminUser').innerText = username;
  document.getElementById('adminUser').classList.remove('hidden');
  document.getElementById('logoutBtn').classList.remove('hidden');
  document.getElementById('loginBlock').classList.add('hidden');
  document.getElementById('adminPanel').classList.remove('hidden');
  loadCategoriesForAdmin();
  loadList();
}

function clearAuth(){
  authHeader = null;
  localStorage.removeItem('authHeader');
  document.getElementById('adminUser').classList.add('hidden');
  document.getElementById('logoutBtn').classList.add('hidden');
  document.getElementById('loginBlock').classList.remove('hidden');
  document.getElementById('adminPanel').classList.add('hidden');
}

document.getElementById('loginBtn').addEventListener('click', ()=>{
  const u = document.getElementById('adminUserInput').value;
  const p = document.getElementById('adminPassInput').value;
  if(!u||!p){ showMessage('Введите логин и пароль'); return; }
  // test credentials by calling protected endpoint
  const test = fetch(`${ADMIN_API}/categories`, { headers: { 'Authorization': 'Basic ' + btoa(`${u}:${p}`) }});
  test.then(res => {
    if(res.status === 200){
      setAuthHeader(u,p);
    } else {
      showMessage('Неверные учётные данные');
    }
  }).catch(err => showMessage('Ошибка сети: '+err));
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  clearAuth();
});


window.addEventListener('load', ()=>{
  if(authHeader){
    fetch(`${ADMIN_API}/categories`, { headers: { 'Authorization': authHeader }})
      .then(r => {
        if(r.ok) {
          document.getElementById('adminUser').innerText = 'admin';
          setAuthHeader('admin','***');
        } else {
          clearAuth();
        }
      }).catch(()=> clearAuth());
  }
});

function fetchAuth(url, opts={}){
  opts.headers = opts.headers || {};
  if(authHeader) opts.headers['Authorization'] = authHeader;
  opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
  return fetch(url, opts);
}


function loadCategoriesForAdmin(){
  fetchAuth('/api/admin/categories')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('category_select');
      select.innerHTML = '<option disabled selected>Select Category</option>';
      data.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.text = `${cat.name_en || 'EN'} / ${cat.name_ru || 'RU'} / ${cat.name_kg || 'KG'}`;
        select.appendChild(opt);
      });
    })
    .catch(err => console.error(err));
}

function addCategory(){
  const data = {
    name_kg: document.getElementById('cat_name_kg').value,
    name_ru: document.getElementById('cat_name_ru').value,
    name_en: document.getElementById('cat_name_en').value,
    image_url: document.getElementById('cat_image').value
  };
  fetchAuth('/api/admin/categories', { method: 'POST', body: JSON.stringify(data)})
    .then(res => {
      if(res.ok){ showMessage('Категория добавлена', 'success'); resetCategoryFields(); loadCategoriesForAdmin(); loadList(); }
      else res.text().then(t => showMessage('Ошибка: '+t));
    }).catch(e=> showMessage('Ошибка сети: '+e));
}

function addItem(){
  const categoryId = parseInt(document.getElementById('category_select').value);
  if(!categoryId){ showMessage('Выберите категорию'); return; }
  const data = {
    name_kg: document.getElementById('item_name_kg').value,
    name_ru: document.getElementById('item_name_ru').value,
    name_en: document.getElementById('item_name_en').value,
    description_kg: document.getElementById('item_desc_kg').value,
    description_ru: document.getElementById('item_desc_ru').value,
    description_en: document.getElementById('item_desc_en').value,
    price: parseFloat(document.getElementById('item_price').value),
    image_url: document.getElementById('item_image').value,
    category: { id: categoryId }
  };

  fetchAuth('/api/admin/items', { method: 'POST', body: JSON.stringify(data)})
    .then(res => {
      if(res.ok){ showMessage('Позиция добавлена', 'success'); resetItemFields(); loadList(); }
      else res.text().then(t => showMessage('Ошибка: '+t));
    }).catch(e=> showMessage('Ошибка сети: '+e));
}

function resetCategoryFields(){
  ['cat_name_kg','cat_name_ru','cat_name_en','cat_image'].forEach(id=>document.getElementById(id).value='');
}
function resetItemFields(){
  ['item_name_kg','item_name_ru','item_name_en','item_desc_kg','item_desc_ru','item_desc_en','item_price','item_image'].forEach(id=>document.getElementById(id).value='');
}

function loadList(){
  fetchAuth('/api/admin/categories')
    .then(res => res.json())
    .then(data => {
      const block = document.getElementById('list-block');
      block.innerHTML = '';
      data.forEach(cat => {
        const wrapper = document.createElement('div');
        wrapper.className = 'p-3 border rounded';
        let html = `<div class="flex justify-between items-center">
                      <div><strong>${cat.name_en || 'EN'} / ${cat.name_ru || 'RU'} / ${cat.name_kg || 'KG'}</strong></div>
                      <div><button onclick="deleteCategory(${cat.id})" class="px-2 py-1 rounded">Удалить</button></div>
                    </div>`;
        if(cat.items && cat.items.length){
          html += '<div class="mt-2 space-y-2">';
          cat.items.forEach(item => {
            html += `<div class="flex justify-between items-center">
                      <div>${item.name_en || item.name_ru || item.name_kg} (${item.price})</div>
                      <div><button onclick="deleteItem(${item.id})" class="px-2 py-1 rounded">Удалить</button></div>
                    </div>`;
          });
          html += '</div>';
        } else {
          html += '<div class="mt-2 text-sm text-gray-500">Нет позиций</div>';
        }
        wrapper.innerHTML = html;
        block.appendChild(wrapper);
      });
    }).catch(err => console.error(err));
}

function deleteCategory(id){
  if(!confirm('Удалить категорию?')) return;
  fetchAuth(`/api/admin/categories/${id}`, { method: 'DELETE' })
    .then(res => { if(res.ok){ showMessage('Категория удалена'); loadCategoriesForAdmin(); loadList(); }});
}

function deleteItem(id){
  if(!confirm('Удалить позицию?')) return;
  fetchAuth(`/api/admin/items/${id}`, { method: 'DELETE' })
    .then(res => { if(res.ok){ showMessage('Позиция удалена'); loadList(); }});
}

document.getElementById('add-category-btn').addEventListener('click', addCategory);
document.getElementById('add-item-btn').addEventListener('click', addItem);
