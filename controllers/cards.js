const Card = require('../models/card');

const NotFoundError = require('../middlewares/errors/not-found-error');
const BedReqError = require('../middlewares/errors/bed-req-error');
const ServerError = require('../middlewares/errors/server-error');
const AuthError = require('../middlewares/errors/auth-error');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(new ServerError('Произошла ошибка на сервере'));
  }
};

const createCard = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { name, link } = req.body;
    const card = await new Card({ name, link, owner: id }).save();
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BedReqError('ПОшибка в запросе'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      next(new NotFoundError('Передан несуществующий _id карточки'));
    } else
    if (req.user._id !== card.owner.toString()) {
      return next(new AuthError('Можно удалять только свои карточки'));
    }
    card.delete();
    return res.send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BedReqError('Передан некорректный id карточки'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      next(new NotFoundError('Передан несуществующий _id карточки'));
    }
    return res.send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BedReqError('Переданы некорректные данные карточки'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }
    return res.send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BedReqError('Переданы некорректные данные карточки'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
