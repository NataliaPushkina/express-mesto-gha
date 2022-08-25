const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const createCard = async (req, res) => {
  try {
    const id = req.user._id;
    const { name, link } = req.body;
    const card = await new Card({ name, link, owner: id }).save();
    return res.status(200).send(card);
  } catch (err) {
    if ((err.errors.name !== undefined && err.errors.name.name === 'ValidatorError')
        || (err.errors.link !== undefined && err.errors.link.name === 'ValidatorError')) {
      return res.status(400).send({ message: 'Ошибка в запросе' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    await Card.findByIdAndDelete(cardId);
    return res.status(200).send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ message: 'Карточка с указанным id не найдена' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const likeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.status(200).send('Лайк добавлен');
  } catch (err) {
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    res.status(200).send('Лайк удалён');
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
