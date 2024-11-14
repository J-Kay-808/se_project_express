const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { login, createUser } = require('../controllers/users');
const { NotFoundError } = require('../errors/NotFoundError');
const auth = require('../middlewares/auth')
const {
  validateUserSignUp,
  validateUserLogIn,
} = require("../middlewares/validation"); 

router.use(auth);
router.use('/users', userRouter);

router.use('/items', itemRouter);
router.post('/signin', validateUserLogIn, login);
router.post('/signup', validateUserSignUp, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("requested resource not found"));
});

module.exports = router;

