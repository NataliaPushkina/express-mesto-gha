const express = require('express');

const userRoutes = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/users', getUsers);

userRoutes.get('/users/:userId', getUserById);

userRoutes.post('/users', express.json(), createUser);

userRoutes.patch('/users/me', updateUser);

userRoutes.patch('/users/me/avatar', updateAvatar);

module.exports = {
  userRoutes,
};
