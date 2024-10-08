const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { errorCode, errorMessage } = require("../utils/errors");
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth')

router.use('/items', itemRouter);
router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);
router.use('/users', userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("requested resource not found"));
});

module.exports = router;

