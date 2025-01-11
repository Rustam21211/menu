const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Для обслуживания статических файлов

app.post('/save-receipt', (req, res) => {
    const { receipt } = req.body;

    const filePath = path.join(__dirname, 'receipts.txt');
    fs.appendFile(filePath, receipt + '\n', (err) => {
        if (err) {
            return res.status(500).send('Ошибка при сохранении чека');
        }
        res.send('Чек успешно сохранен');
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
