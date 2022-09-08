const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    unique: true,
    required: [true, 'Поле email обязательное'],
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },

  password: {
    type: String,
    select: false,
    required: [true, 'Поле email обязательное'],
  },

  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Поле name должно содерджать больше 2 символов'],
    maxlength: [30, 'Поле name должно содерджать не больше 30 символов'],
  },

  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Поле about должно содерджать больше 2 символов'],
    maxlength: [30, 'Поле about должно содерджать не больше 30 символов'],
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {

      validator: (v) => {
        const valid = /^(http|https):\/\/(W{3}\.)?[^]+#?$/.test(v);
        return valid;
      },
      message: 'Неправильный формат поля avatar',
    },
  },
}, { versionKey: false });

userSchema.methods.hidePassword = function hidePassword() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
