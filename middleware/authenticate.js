const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const authenticate = (req, res, next) => {
  const authorizationHeader = req.get('authorization');

  let token;

  if (authorizationHeader && authorizationHeader.includes('Bearer ')) {
    token = authorizationHeader.split(' ')[1];
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new createError.Unauthorized());
      }

      req.userId = decoded.id;
      return next();
    });
  } else {
    next(new createError.Forbidden());
  }
};

module.exports = authenticate;
