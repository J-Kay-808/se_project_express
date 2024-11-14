const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  validateUserSignUp,
  validateUserLogIn,
} = require("../middlewares/validation");

router.use('/items', itemRouter);
router.post('/signin', validateUserLogIn, login);
router.post('/signup', validateUserSignUp, createUser);

router.use(auth);
router.use('/users', userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("requested resource not found"));
});

module.exports = router;

