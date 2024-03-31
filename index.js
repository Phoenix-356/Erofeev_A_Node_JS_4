/*Создание REST API с Express
Для того, чтобы пользователи хранились постоянно, а не только, когда запущен сервер, 
необходимо реализовать хранение массива в файле.

Подсказки:
— В обработчиках получения данных по пользователю нужно читать файл
— В обработчиках создания, обновления и удаления нужно файл читать, чтобы убедиться, 
что пользователь существует, 
а затем сохранить в файл, когда внесены изменения
— Не забывайте про JSON.parse() и JSON.stringify() - эти функции помогут вам переводить 
объект в строку и наоборот.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const userFilePath = path.join(__dirname, 'users.json');

// Middleware для чтения JSON из тела запроса
app.use(express.json());

// Обработчик GET запроса для получения всех пользователей
app.get('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(userFilePath));
    res.json(users);
});

// Обработчик POST запроса для создания нового пользователя
app.post('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(userFilePath));
    const newUser = req.body;
    users.push(newUser);
    fs.writeFileSync(userFilePath, JSON.stringify(users));
    res.status(201).json(newUser);
});

// Обработчик PUT запроса для обновления данных пользователя
app.put('/users/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(userFilePath));
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
        fs.writeFileSync(userFilePath, JSON.stringify(users));
        res.json(users[index]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Обработчик DELETE запроса для удаления пользователя
app.delete('/users/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(userFilePath));
    const userId = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        const deletedUser = users.splice(index, 1)[0];
        fs.writeFileSync(userFilePath, JSON.stringify(users));
        res.json(deletedUser);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
