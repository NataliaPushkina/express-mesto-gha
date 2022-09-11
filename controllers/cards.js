const Card = require('../models/card');

const NotFoundError = require('../middlewares/errors/not-found-error');
const BedReqError = require('../middlewares/errors/bed-req-error');
const ServerError = require('../middlewares/errors/server-error');
const ForbiddenError = require('../middlewares/errors/forbidden-error');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    if (!cards) {
      return next(new NotFoundError('Не удалось найти карточки'));
    }
    return res.send(cards);
  } catch (err) {
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const createCard = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: id });
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BedReqError('Ошибка в запросе'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }
    if (req.user._id !== card.owner.toString()) {
      return next(new ForbiddenError('Можно удалять только свои карточки'));
    }
    await card.remove();
    return res.send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new BedReqError('Передан некорректный id карточки'));
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
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }
    return res.send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return next(new BedReqError('Переданы некорректные данные карточки'));
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
      return next(new BedReqError('Переданы некорректные данные карточки'));
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
