const ClothingItem = require('../models/clothingItem');
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");

// Controller to CREATE Item
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError("Invalid data entered"));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid data entered"));
      }
      return next(error);
    });
};

// Controller to get ALL items
const getItems = (req, res, next) => {
  ClothingItem.find({}).then((items) => res.send(items))
    .catch(next);
};

// Controller to DELETE item   
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  console.log('Item ID:', itemId);
  console.log('User ID:', userId);

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }

      return ClothingItem.findByIdAndDelete(itemId)
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

// Controller to LIKE items
const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};


// Controller to DISLIKE items
const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

module.exports = {
  getItems, createItem, deleteItem, likeItem, dislikeItem
};