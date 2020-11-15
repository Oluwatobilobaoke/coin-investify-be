const home = (req, res) => {
  res.status(200).json({ message: 'Welcome to Crypto API' });
};

module.exports = { home };
