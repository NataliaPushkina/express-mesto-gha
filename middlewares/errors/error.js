const handleError = (err, req, res, next) => {
  res.send({ message: err.message });
  next();
};

module.exports = handleError;
