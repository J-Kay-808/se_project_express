const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { errorCode, errorMessage } = require("../utils/errors");

// Controller to get all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => {
      console.error(e);
      return res.status(errorCode.defaultError).send({ message: errorMessage.defaultError });
    });
};


// Controller to get a user by ID
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => {
      console.error(e);
      if (e.name === 'DocumentNotFoundError') {
        return res.status(errorCode.idNotFound).send({ message: errorMessage.idNotFound });
      } if (e.name === 'CastError') {
        return res.status(errorCode.invalidData).send({ message: errorMessage.invalidData });
      }
      return res.status(errorCode.defaultError).send({ message: errorMessage.defaultError });
    });
};

// Controller to create a new user
const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res.status(errorCode.invalidData).send({ message: errorMessage.invalidEmail })
  }

  if (!validator.isEmail(email)) {
    return res
      .status(errorCode.invalidData)
      .send({ message: errorMessage.invalidEmail });
  }
  return User.findOne({ email })
    .then((existingEmail) => {
      if (existingEmail) {
        throw new Error('Email already exists');
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
      if (e.message === 'This Email already Exists') {
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

module.exports = { getUsers, getUser, createUser, login };