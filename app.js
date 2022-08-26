const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

const { userRoutes } = require('./routes/users');

const { cardRoutes } = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '630471e9e5268039ade183b2',
  };
  next();
});

app.use(userRoutes);

app.use(cardRoutes);

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
