const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { JWT_SECRET } = require('../utils/config');
const { errorCode, errorMessage } = require("../utils/errors");


// Controller to create a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res.status(errorCode.invalidData).send({ message: errorMessage.requiredEmailAndPassword })
  }

  if (!validator.isEmail(email)) {
    return res
      .status(errorCode.invalidData)
      .send({ message: errorMessage.invalidEmail });
  }
  return User.findOne({ email })
    .then((existingEmail) => {
      if (existingEmail) {
        throw new Error('Email Exists');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res.send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((e) => {
      console.error(e);
      if (e.message === 'Email Exists') {
        return res
          .status(errorCode.conflict)
          .send({ message: errorMessage.existEmail });
      }
      if (e.name === 'ValidationError') {
        return res.status(errorCode.invalidData).send({ message: errorMessage.validationError });
      }
      return res.status(errorCode.defaultError).send({ message: errorMessage.defaultError });
    });
};


// Controller to Login
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(errorCode.invalidData)
      .send({ message: errorMessage.requiredEmailAndPassword });
  }
  if (!validator.isEmail(email)) {
    return res
      .status(errorCode.invalidData)
      .send({ message: errorMessage.invalidEmail });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.send({ token });
    })
    .catch((e) => {
      if (e.message === 'Incorrect email or password') {
        return res
          .status(errorCode.unauthorized)
          .send({ message: errorMessage.incorrectEmailOrPassword });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};


// Controller to current user
const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      console.error(e);
      if (e.name === 'DocumentNotFoundError') {
        return res
          .status(errorCode.idNotFound)
          .send({ message: errorMessage.idNotFound });
      }
      if (e.name === 'CastError') {
        return res
          .status(errorCode.invalidData)
          .send({ message: errorMessage.invalidData });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};


// Control to update user
const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => new Error('DocumentNotFoundError'))
    .then((updatedUser) => res.status(errorCode.ok).json({ data: updatedUser }))
    .catch((e) => {
      console.error(e);
      if (e.name === 'ValidationError') {
        return res.status(errorCode.invalidData).json({ message: errorMessage.validationError });
      }
      if (e.message === 'DocumentNotFoundError') {
        return res.status(errorCode.idNotFound).json({ message: errorMessage.idNotFound });
      }
      return res.status(errorCode.defaultError).json({ message: errorMessage.defaultError });
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };