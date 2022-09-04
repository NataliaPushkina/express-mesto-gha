const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ERROR_BED_REQ,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  ERROR_UNAUTHORIZED,
} = require('../utils/constants');

const createUser = async (req, res) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    }).save();
    return res.send(user.hidePassword());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_BED_REQ).send({ message: 'Переданы некорректные данные пользователя' });
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
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
    return res.send(user);
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
    return res.send(user);
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError') {
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
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_BED_REQ).send({ message: 'Передана некорректная ссылка на аватар пользователя' });
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь c указанным email не найден' });
  }
  const matchedPas = await bcrypt.compare(password, user.password);
  if (!matchedPas) {
    return res.status(ERROR_UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
  }
  const token = jwt.sign(
    { _id: user._id },
    'some-secret-key',
  );
  res.cookie('jwt', token, {
    maxAge: 3600000,
    httpOnly: true,
  });
  return res.send(user);
};

const getUserInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.send(user);
  } catch (err) {
    res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
