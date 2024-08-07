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
  const { name, avatar } = req.body;
  if (!name || !avatar){
    return res.status(errorCode.invalidData).send({ message:errorMessage.invalidData})
  }
  return User.create({ name, avatar })
    .then((user) => res.status(201).send({data: user}))
    .catch((e) => {
      console.error(e);
      if (e.name === 'ValidationError') {
        return res.status(errorCode.invalidData).send({ message: errorMessage.validationError });
      }
      return res.status(errorCode.defaultError).send({ message: errorMessage.defaultError });
    });
};

module.exports = { getUsers, getUser, createUser };