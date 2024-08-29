const router = require('express').Router();

const {
    createItem, getItems, deleteItem, updateItem, likeItem,
    dislikeItem,
} = require('../controllers/clothingItems');

const auth = require('../middlewares/auth');


router.use(auth);



// Create

router.post('/', createItem);

// Read

router.get('/', getItems);

// Delete

router.delete('/:itemId', deleteItem);

// Update

router.put('/:itemId', updateItem);

// Likes

router.put('/:itemId/likes', likeItem);

// Dislikes

router.delete('/:itemId/likes', dislikeItem);

module.exports = router;