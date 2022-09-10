const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const valid = /^(http|https):\/\/(W{3}\.)?[^]+#?$/.test(v);
        return valid;
      },
      message: 'Неправильный формат ссылки',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    validate: {
      validator: (v) => /^[a-fA-F0-9]{24}$/.test(v),
      message: 'Неправильный id пользователя!',
    },
  },

  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],

  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
