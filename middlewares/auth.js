const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
 


const handleAuthError = (res) => {
  res.status(errorCode.unauthorized).send({ message: errorMessage.authorizationRequired });
};

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError("Unauthorized action"));  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    console.error(err)
    return next(new UnauthorizedError("Unauthorized action"));
  }

  req.user = payload;

  return next();
};

module.exports = auth;