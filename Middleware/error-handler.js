// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (typeof (err) === 'string') {
    // custom application error
    return res.status(400).json({ status: 'error', message: err });
  }

  if (err.inner !== undefined) {
    if (err.inner.name === 'JsonWebTokenError') {
      // jwt authentication error
      return res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
  }
  if (err.name === 'UnauthorizedError') {
    // jwt params error
    return res.status(401).json({ status: 'error', message: err.message });
  }

  // default to 500 server error
  return res.status(500).json({ status: 'error', message: err.message });
};

module.exports.errorHandler = errorHandler;
