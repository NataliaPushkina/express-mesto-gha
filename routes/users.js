const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoutes = express.Router();
const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

userRoutes.use(auth);

userRoutes.get('/users', getUsers);

userRoutes.get('/users/me', getUserInfo);

userRoutes.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

userRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(http|https):\/\/(W{3}\.)?[^]+#?$/),
  }),
}), updateAvatar);

module.exports = {
  userRoutes,
};
