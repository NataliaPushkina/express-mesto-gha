const express = require('express');

const cardRoutes = express.Router();

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/cards', getCards);

cardRoutes.delete('/cards/:cardId', deleteCard);

cardRoutes.post('/cards', createCard);

cardRoutes.put('/cards/:cardId/likes', likeCard);

cardRoutes.delete('/cards/:cardId/likes', dislikeCard);

module.exports = {
  cardRoutes,
};
