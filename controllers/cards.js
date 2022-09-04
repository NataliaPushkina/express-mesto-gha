const Card = require('../models/card');

const {
  ERROR_BED_REQ,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  ERROR_UNAUTHORIZED,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const createCard = async (req, res) => {
  try {
    const id = req.user._id;
    const { name, link } = req.body;
    const card = await new Card({ name, link, owner: id }).save();
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_BED_REQ).send({ message: 'Ошибка в запросе' });
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndDelete(cardId);
    const owner = card.owner.toString();
    if (!card) {
      res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
    } else
    if (req.user._id !== owner) {
      return res.status(ERROR_UNAUTHORIZED).send({ message: 'Можно удалять только свои карточки' });
    }
    return res.send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(ERROR_BED_REQ).send({ message: 'Передан некорректный id карточки' });
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const likeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(ERROR_BED_REQ).send({ message: 'Переданы некорректные данные карточки' });
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(ERROR_BED_REQ).send({ message: 'Переданы некорректные данные карточки' });
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
