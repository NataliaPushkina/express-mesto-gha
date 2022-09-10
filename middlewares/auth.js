const jwt = require('jsonwebtoken');

const AuthError = require('./errors/auth-error');

const auth = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    return next(new AuthError('Необходима авторизация'));
  }
  const token = cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;

  return next();
};

module.exports = auth;
