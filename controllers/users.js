const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../middlewares/errors/not-found-error');
const BedReqError = require('../middlewares/errors/bed-req-error');
const ConflictError = require('../middlewares/errors/conflict-error');
const ServerError = require('../middlewares/errors/server-error');
const AuthError = require('../middlewares/errors/auth-error');

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    return res.send(user.hidePassword());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BedReqError({ message: 'Переданы некорректные данные пользователя' }));
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с указанным email уже существует'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      return res.send(user);
    }
    return next(new NotFoundError('Пользователя с указанным id не существует'));
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BedReqError('Передан некорректный id пользователя'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const updateUser = async (req, res, next) => {
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
    if (err.name === 'ValidationError') {
      next(new BedReqError('Переданы некорректные данные пользователя'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true });
    if (!user) {
      next(new NotFoundError('Пользователь по указанному id не найден'));
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BedReqError('Передана некорректная ссылка на аватар пользователя'));
    }
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new NotFoundError('Пользователь c указанным email не найден'));
    }
    const matchedPas = await bcrypt.compare(password, user.password);
    if (!matchedPas) {
      next(new AuthError('Неправильные почта или пароль'));
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
  } catch (err) {
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    return res.send(user);
  } catch (err) {
    return next(new ServerError('Произошла ошибка на сервере'));
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
