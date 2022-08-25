const User = require('../models/user');

const createUser = async (req, res) => {
  try {
    await new User(req.body).save();
    return res.status(200).send('Пользователь добавлен');
  } catch (err) {
    if ((err.errors.avatar !== undefined && err.errors.avatar.name === 'ValidatorError')
    || (err.errors.about !== undefined && err.errors.about.name === 'ValidatorError')
    || (err.errors.name !== undefined && err.errors.name.name === 'ValidatorError')) {
      return res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    return res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name, about },
      { new: true, runValidators: true },
    );
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    if ((err.errors.name !== undefined && err.errors.name.name === 'ValidatorError')
    || (err.errors.about !== undefined && err.errors.about.name === 'ValidatorError')) {
      return res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const id = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.errors.avatar.name === 'ValidatorError') {
      return res.status(400).send({ message: 'Передана некорректная ссылка на аватар пользователя' });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
