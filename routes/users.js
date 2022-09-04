const express = require('express');

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

userRoutes.patch('/users/me', updateUser);

userRoutes.patch('/users/me/avatar', updateAvatar);

module.exports = {
  userRoutes,
};
