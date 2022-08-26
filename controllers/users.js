const User = require('../models/user');

const OK = 200;
const ERROR_BED_REQ = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await new User({ name, about, avatar }).save();
    return res.status(OK).send(user);
  } catch (err) {
    if ((err.errors.avatar !== undefined && err.errors.avatar.name === 'ValidatorError')
    || (err.errors.about !== undefined && err.errors.about.name === 'ValidatorError')
    || (err.errors.name !== undefined && err.errors.name.name === 'ValidatorError')) {
      return res.status(ERROR_BED_REQ).send({ message: 'Переданы некорректные данные пользователя' });
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователя с указанным id не существует' });
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(ERROR_BED_REQ).send({ message: 'Передан некорректный id пользователя' });
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
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
    return res.status(OK).send(user);
  } catch (err) {
    console.log(err);
    if ((err.errors.name !== undefined && err.errors.name.name === 'ValidatorError')
    || (err.errors.about !== undefined && err.errors.about.name === 'ValidatorError')) {
      return res.status(ERROR_BED_REQ).send({ message: 'Переданы некорректные данные пользователя' });
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const id = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true });
    if (!user) {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    }
    return res.status(OK).send(user);
  } catch (err) {
    if (err.errors.avatar.name === 'ValidatorError') {
      return res.status(ERROR_BED_REQ).send({ message: 'Передана некорректная ссылка на аватар пользователя' });
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
