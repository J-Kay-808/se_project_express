const router = require('express').Router();

const { createItem, getItems, deleteItem, likeItem,
    dislikeItem, } = require('../controllers/clothingItems')
    ;



// Create

router.post('/', createItem);

// Read

router.get('/', getItems);

// Delete

router.delete('/:itemId', deleteItem);

// Likes

router.put('/:itemId/likes', likeItem);

// Dislikes

router.delete('/:itemId/likes', dislikeItem);

module.exports = router;