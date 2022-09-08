const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoutes = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

userRoutes.get('/users', getUsers);

userRoutes.get('/users/me', getUserInfo);

userRoutes.get('/users/:userId', getUserById);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().alphanum().min(2).max(30),
    about: Joi.string().alphanum().min(2).max(30),
  }),
}), updateUser);

userRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    // avatar: Joi.string().uri(),
    avatar: Joi.string(),
  }),
}), updateAvatar);

module.exports = {
  userRoutes,
};
