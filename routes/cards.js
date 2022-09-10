const express = require('express');
const { celebrate, Joi } = require('celebrate');

const cardRoutes = express.Router();
const auth = require('../middlewares/auth');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const joiUserId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

cardRoutes.use(auth);

cardRoutes.get('/cards', getCards);

cardRoutes.delete('/cards/:cardId', joiUserId, deleteCard);

cardRoutes.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^(http|https):\/\/(W{3}\.)?[^]+#?$/),
  }),
}), createCard);

cardRoutes.put('/cards/:cardId/likes', joiUserId, likeCard);

cardRoutes.delete('/cards/:cardId/likes', joiUserId, dislikeCard);

module.exports = {
  cardRoutes,
};
