let items = [];

function addItem() {
    const select = document.getElementById('productSelect');
    const selectedOption = select.options[select.selectedIndex];

    const itemName = selectedOption.value; // Название товара
    const itemPrice = parseFloat(selectedOption.getAttribute('data-price')); // Цена товара

    if (itemName && itemPrice > 0) {
        items.push({ name: itemName, price: itemPrice }); // Добавляем товар в массив

        updateTable(); // Обновляем таблицу
        updateTotal(); // Обновляем общую сумму
        
        // Сброс выбора
        select.selectedIndex = 0;
    } else {
        alert('Пожалуйста, выберите товар.');
    }
}

function updateTable() {
    const tbody = document.getElementById('itemTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Очищаем таблицу

    items.forEach(item => {
        const row = tbody.insertRow(); // Создаем новую строку
        row.insertCell(0).innerText = item.name; // Заполняем ячейку с названием товара
        row.insertCell(1).innerText = item.price.toFixed(2); // Заполняем ячейку с ценой товара
    });
}

function updateTotal() {
    const total = items.reduce((sum, item) => sum + item.price, 0); // Считаем общую сумму
    document.getElementById('totalAmount').innerText = total.toFixed(2); // Обновляем отображение суммы
}

function generateReceipt() {
    const receiptContent = document.getElementById('receiptContent');
    receiptContent.innerHTML = ''; // Очищаем содержимое чека

    // Добавляем дату и время покупки
    const now = new Date();
    const dateString = now.toLocaleDateString('ru-RU'); // Формат даты
    const timeString = now.toLocaleTimeString('ru-RU'); // Формат времени
    receiptContent.innerHTML += `<strong>Дата: ${dateString}</strong><br>`;
    receiptContent.innerHTML += `<strong>Время: ${timeString}</strong><br><br>`;

    let receiptText = `Чек:\nДата: ${dateString}\nВремя: ${timeString}\n`;

    items.forEach(item => {
        receiptContent.innerHTML += `${item.name} - ${item.price.toFixed(2)} руб.<br>`; // Добавляем товары в чек
        receiptText += `${item.name} - ${item.price.toFixed(2)} руб.\n`;
    });

    const total = items.reduce((sum, item) => sum + item.price, 0); // Считаем общую сумму для чека
    receiptContent.innerHTML += `<strong>Итого: ${total.toFixed(2)} руб.</strong>`; // Добавляем итоговую сумму
    receiptText += `Итого: ${total.toFixed(2)} руб.\n`;

    // Отправляем чек на сервер для сохранения
    fetch('/save-receipt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receipt: receiptText }),
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Показываем сообщение об успешном сохранении
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });

    // Отображаем чек
    document.getElementById('receipt').style.display = 'block';
}

