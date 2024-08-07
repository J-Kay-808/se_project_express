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
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: "Error from updateItem", e });
    });

}

//// Controller to CREATE Item
const createItem = (req, res) => {
  console.log(req)
  console.log(res)

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id }).then((item) => {
    console.log(item)
    res.send({ data: time })
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
        return res.status(NOT_FOUND).send({ message: e.message });
      }
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid Data" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server" });
    });
};




module.exports = {
   getItems, updateItem, createItem, deleteItem
}