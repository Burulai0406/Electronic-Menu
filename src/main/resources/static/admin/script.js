function showMessage(msg, type) {
    const block = document.getElementById('message');
    block.style.color = type === 'success' ? 'green' : 'red';
    block.innerText = msg;
    setTimeout(() => block.innerText = '', 3000);
}

function resetCategoryFields() {
    document.getElementById('cat_name_kg').value = '';
    document.getElementById('cat_name_en').value = '';
    document.getElementById('cat_image').value = '';
}

function resetItemFields() {
    document.getElementById('item_name_kg').value = '';
    document.getElementById('item_name_en').value = '';
    document.getElementById('item_desc_kg').value = '';
    document.getElementById('item_desc_en').value = '';
    document.getElementById('item_price').value = '';
    document.getElementById('item_image').value = '';
}

function loadCategoriesForAdmin() {
    fetch('/api/admin/categories')
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById('category_select');
            select.innerHTML = '<option disabled selected>Select Category</option>';
            data.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.text = `${cat.name_en} / ${cat.name_kg}`;
                select.appendChild(option);
            });
        });
}

function addCategory() {
    const data = {
        name_kg: document.getElementById('cat_name_kg').value,
        name_en: document.getElementById('cat_name_en').value,
        image_url: document.getElementById('cat_image').value
    };

    fetch('/api/admin/categories', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => {
        if(res.ok){
            showMessage('Категория добавлена!', 'success');
            resetCategoryFields();
            loadCategoriesForAdmin();
            loadList();
        } else {
            res.text().then(msg => alert('Ошибка: ' + msg));
        }
    })
    .catch(err => alert('Ошибка сети: ' + err));
}

function addItem() {
    const data = {
        name_kg: document.getElementById('item_name_kg').value,
        name_en: document.getElementById('item_name_en').value,
        description_kg: document.getElementById('item_desc_kg').value,
        description_en: document.getElementById('item_desc_en').value,
        price: parseFloat(document.getElementById('item_price').value),
        image_url: document.getElementById('item_image').value,
        category: { id: parseInt(document.getElementById('category_select').value) }
    };

    fetch('/api/admin/items', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => {
        if(res.ok){
            showMessage('Позиция добавлена!', 'success');
            resetItemFields();
            loadList();
        } else {
            res.text().then(msg => alert("Ошибка при добавлении позиции:\n" + msg));
        }
    })
    .catch(err => alert("Ошибка сети: " + err));
}

function loadList() {
    fetch('/api/admin/categories')
        .then(res => res.json())
        .then(data => {
            const block = document.getElementById('list-block');
            block.innerHTML = '';
            data.forEach(cat => {
                let html = `<strong>${cat.name_en} / ${cat.name_kg}</strong>
                    <button onclick="deleteCategory(${cat.id})">Удалить категорию</button><br>`;

                if(cat.items && cat.items.length > 0){
                    cat.items.forEach(item => {
                        html += `<div>- ${item.name_en} (${item.price})
                            <button onclick="deleteItem(${item.id})">Удалить позицию</button></div>`;
                    });
                } else {
                    html += `<em>Нет позиций</em>`;
                }

                const div = document.createElement('div');
                div.innerHTML = html;
                block.appendChild(div);
            });
        });
}

function deleteCategory(id) {
    fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
        .then(res => { if(res.ok){ showMessage('Категория удалена!', 'success'); loadCategoriesForAdmin(); loadList(); } });
}

function deleteItem(id) {
    fetch(`/api/admin/items/${id}`, { method: 'DELETE' })
        .then(res => { if(res.ok){ showMessage('Позиция удалена!', 'success'); loadList(); } });
}

// init
loadCategoriesForAdmin();
loadList();
