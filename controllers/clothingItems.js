const ClothingItem = require('../models/clothingItem');
const { errorCode, errorMessage } = require('../utils/errors');


// Controller to get ALL items
const getItems = (req, res) => {
  ClothingItem.find({}).then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(e);
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

// Controller to get a item by ID
// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((e) => {
//       res.status(500).send({ message: "Error from updateItem", e });
//     });

// }

//// Controller to CREATE Item
const createItem = (req, res) => {
  console.log(req)
  console.log(res)

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id }).then((item) => {
    console.log(item)
    res.send({ data: item })
  }).catch((e) => {
    console.error(e);
    if (e.name === "ValidationError") {
      return res.status(errorCode.invalidData)
        .send({ message: errorMessage.validationError });
    }
    return res
      .status(errorCode.defaultError)
      .send({ message: errorMessage.defaultError });
  });
};

// Controller to DELETE item   
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.send({ item }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(errorCode.idNotFound) .send({ message: errorMessage.idNotFound });
      }
      if (e.name === "CastError") {
        return res.status(errorCode.invalidData).send({ message: errorMessage.invalidData });
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
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(errorCode.idNotFound) .send({ message: errorMessage.idNotFound });
      }
      if (e.name === "CastError") {
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
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(errorCode.idNotFound) .send({ message: errorMessage.idNotFound });
      }
      if (e.name === "CastError") {
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