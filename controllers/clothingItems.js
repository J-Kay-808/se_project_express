const ClothingItem = require('../models/clothingItem');
const { errorCode, errorMessage } = require('../utils/errors');


// Controller to CREATE Item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res
          .status(errorCode.invalidData)
          .send({ message: errorMessage.validationError });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};


// Controller to get ALL items
const getItems = (req, res) => {
  ClothingItem.find({}).then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};



// Controller to DELETE item   
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  console.log('Item ID:', itemId);
  console.log('User ID:', userId);

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res
          .status(errorCode.accessDenied)
          .send({
            message: errorMessage.accessDenied
          })
      }

      return ClothingItem.findByIdAndDelete(itemId)
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "Access Denied") {
        return res
          .status(errorCode.accessDenied)
          .send({ message: `${errorMessage.accessDenied} to delete this item` });
      }
      if (err.name === "ValidationError" || err.name === 'CastError') {
        return res
          .status(errorCode.invalidData)
          .send({ message: errorMessage.invalidData });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(errorCode.idNotFound)
          .send({ message: errorMessage.idNotFound });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};


// Controller to LIKE items
const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(errorCode.idNotFound).send({ message: errorMessage.idNotFound });
      }
      if (err.name === "CastError") {
        return res.status(errorCode.invalidData).send({ message: errorMessage.invalidData });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};


// Controller to DISLIKE items
const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(errorCode.idNotFound).send({ message: errorMessage.idNotFound });
      }
      if (err.name === "CastError") {
        return res.status(errorCode.invalidData).send({ message: errorMessage.invalidData });
      }
      return res
        (errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

module.exports = {
  getItems, createItem, deleteItem, likeItem, dislikeItem
};