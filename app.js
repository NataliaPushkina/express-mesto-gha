const express = require('express');
const mongoose = require('mongoose');

const { userRoutes } = require('./routes/users');

const { cardRoutes } = require('./routes/cards');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');
const { ERROR_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.post('/signup', createUser);

app.post('/signin', login);

app.use(auth);

app.use(userRoutes);

app.use(cardRoutes);

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена' });
});

async function main() {
  try {
    console.log('Вызвана функция main');
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
  } catch (err) {
    console.log(`Произошла ошибка ${err.name} ${err.message}`);
  }
  try {
    await app.listen(PORT);
    console.log(`Сервер запущен на ${PORT} порту`);
  } catch (err) {
    console.log(`Произошла ошибка ${err.name} ${err.message}`);
  }
}

main();
