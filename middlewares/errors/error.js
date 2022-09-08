const handleError = (err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
};

module.exports = handleError;
