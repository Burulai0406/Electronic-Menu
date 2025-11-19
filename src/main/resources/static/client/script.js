let language = 'en';
let currentCategory = null;

// --- Установка языка ---
function setLanguage(lang) {
    language = lang;
    document.getElementById('language-block').style.display = 'none';
    document.getElementById('back-btn').innerText = language === 'kg' ? 'Артка' : 'Back';
    loadCategories();
}

// --- Загрузка категорий для клиента ---
function loadCategories() {
    console.log('Loading categories...');

    fetch('/api/client/categories')
        .then(res => res.json())
        .then(data => {
            console.log('Categories loaded:', data);
            const block = document.getElementById('categories-block');
            block.innerHTML = '';
            data.forEach(cat => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <img src="${cat.image_url}" width="100">
                    <h3>${language === 'kg' ? cat.name_kg : cat.name_en}</h3>
                `;
                div.onclick = () => loadItems(cat.id);
                block.appendChild(div);
            });
            block.style.display = 'block';
            document.getElementById('back-btn').style.display = 'block';
        })
        .catch(err => console.error('Ошибка при загрузке категорий:', err));
}

// --- Загрузка позиций для выбранной категории ---
function loadItems(categoryId) {
    currentCategory = categoryId;
    console.log('Loading items for category:', categoryId);

    fetch(`/api/client/items/${categoryId}`)
        .then(res => res.json())
        .then(data => {
            console.log('Items loaded:', data);
            const block = document.getElementById('items-block');
            block.innerHTML = '';
            data.forEach(item => {
                const name = language === 'kg' ? item.name_kg : item.name_en;
                const desc = language === 'kg' ? item.description_kg : item.description_en;
                const priceLabel = language === 'kg' ? 'Баасы' : 'Price';

                block.innerHTML += `
                <div>
                    <img src="${item.image_url}" width="100">
                    <h4>${name || '---'}</h4>
                    <p>${desc || '---'}</p>
                    <p>${priceLabel}: ${item.price ?? '---'}</p>
                </div>
                `;
            });
            document.getElementById('categories-block').style.display = 'none';
            block.style.display = 'block';
        })
        .catch(err => console.error('Ошибка при загрузке позиций:', err));
}

// --- Кнопка назад ---
function goBack() {
    if (document.getElementById('items-block').style.display === 'block') {
        document.getElementById('items-block').style.display = 'none';
        document.getElementById('categories-block').style.display = 'block';
    } else {
        document.getElementById('categories-block').style.display = 'none';
        document.getElementById('language-block').style.display = 'block';
        document.getElementById('back-btn').style.display = 'none';
    }
}
