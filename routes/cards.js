const express = require('express');

const cardRoutes = express.Router();

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/cards', express.json(), getCards);

cardRoutes.delete('/cards/:cardId', express.json(), deleteCard);

cardRoutes.post('/cards', express.json(), createCard);

cardRoutes.put('/cards/:cardId/likes', express.json(), likeCard);

cardRoutes.delete('/cards/:cardId/likes', express.json(), dislikeCard);

module.exports = {
  cardRoutes,
};
