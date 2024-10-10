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
// const deleteItem = (req, res) => {
//   const { itemId } = req.params;
//   const userId = req.user._id;
//   console.log('Item ID:', itemId);
//   console.log('User ID:', userId);

//   ClothingItem.findById(itemId)
//     .orFail()
//     .then((item) => {
//       if (item.owner.toString() !== userId) {
//         return res
//         .status(FORBIDDEN)
//         .send({ message: "You do not have permission to delete this item" });
//     }

//       return ClothingItem.findByIdAndDelete(itemId)
//     })
//     .then((item) => res.send(item))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "Access Denied") {
//         return res
//           .status(errorCode.accessDenied)
//           .send({ message: `${errorMessage.accessDenied} to delete this item` });
//       }
//       if (err.name === "ValidationError" || err.name === 'CastError') {
//         return res
//           .status(errorCode.invalidData)
//           .send({ message: errorMessage.invalidData });
//       }
//       if (err.name === 'DocumentNotFoundError') {
//         return res
//           .status(errorCode.idNotFound)
//           .send({ message: errorMessage.idNotFound });
//       }
//       return res
//         .status(errorCode.defaultError)
//         .send({ message: errorMessage.defaultError });
//     });
// };

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  // Log itemId and userId for debugging
  console.log('Item ID:', itemId);
  console.log('User ID:', userId);

  // Find the item by its ID
  ClothingItem.findById(itemId)
      .then((item) => {
          // Log the full item object to debug its structure
          console.log('Item found:', item);

          // If the item is not found, throw an error
          if (!item) {
              const error = new Error('Item not found');
              error.name = 'ItemNotFound';
              throw error;
          }

          // Check if the item has an owner property
          if (!item.owner) {
              const error = new Error('Owner not found for this item');
              error.name = 'OwnerNotFound';
              throw error;
              
          }
          

          // Compare the item's owner to the logged-in user's ID
          if (item.owner.toString() !== userId) {
              const error = new Error('Access Denied');
              error.name = 'AccessDenied';
              throw error;
          }

          // Proceed to delete the item
          return ClothingItem.findByIdAndDelete(itemId);
      })
      .then((deletedItem) => {
          // Send back the deleted item to confirm success
          res.send(deletedItem);
      })
      .catch((err) => {
          console.error('Error:', err);

          // Handle specific errors and respond with proper messages and status codes
          if (err.name === 'AccessDenied') {
              return res.status(403).send({ message: 'You do not have permission to delete this item' });
          }
          if (err.name === 'ItemNotFound' || err.name === 'OwnerNotFound') {
              return res.status(404).send({ message: 'Item or owner not found' });
          }
          
          // Fallback for unexpected server errors
          res.status(500).send({ message: 'An error occurred on the server' });
      });
};




// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
//     .orFail()
//     .then((item) => res.send({ data: item }))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res
//           .status(errorCode.invalidData)
//           .send({ message: `${errorMessage.invalidData} from updateItem` });
//       }
//       return res
//         .status(errorCode.defaultError)
//         .send({ message: `${errorMessage.defaultError} from updateItem` });
//     });
// };


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