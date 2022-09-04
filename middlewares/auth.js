const jwt = require('jsonwebtoken');

const { ERROR_UNAUTHORIZED } = require('../utils/constants');

const auth = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    return res
      .status(ERROR_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
  const token = cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
    console.log(payload);
  } catch (err) {
    return res.status(ERROR_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  return next();
};

module.exports = auth;
